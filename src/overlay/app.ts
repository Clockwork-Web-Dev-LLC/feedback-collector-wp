import css from './styles.css' with { type: 'text' };
import { OVERLAY_HOST_ID, createAnchor, isRenderable, resolveAnchor } from './anchor';
import type { Anchor } from './anchor';
import { Api } from './api';
import { breakpoint, captureContext, currentPagePath, currentQuery } from './capture';
import { h, relativeTime, select } from './dom';
import { chevronIcon, deviceIcon, shotIcon } from './icons';
import { Recorder, canRecord, clock, mountPointerTrail } from './recorder';
import type { Recording } from './recorder';
import type { Config, Item, ItemStatus, ItemType, Priority } from './types';

const TYPES: ItemType[] = ['bug', 'tweak', 'change', 'comment'];
const STORAGE_KEY = 'fbc:mode';
const CORNER_KEY = 'fbc:corner';
export const PREVIEW_FRAME_NAME = 'fbc-preview';
const DEVICES: Array<{ id: string; label: string; w: number; h: number }> = [
  { id: 'phone', label: 'Mobile', w: 390, h: 844 },
  { id: 'tablet', label: 'Tablet', w: 820, h: 1180 },
  { id: 'desktop', label: 'Desktop', w: 1440, h: 900 },
];
const EDGE = 16;
const SIDEBAR_WIDTH = 360;

type Corner = 'tl' | 'tr' | 'bl' | 'br';
const CORNERS: Corner[] = ['tl', 'tr', 'bl', 'br'];

type Placement = 'pinned' | 'hidden' | 'note' | 'orphan';

interface PinState {
  item: Item;
  el: Element | null;
  placement: Placement;
  pin: HTMLButtonElement | null;
}

interface PinModeRequest {
  hint: string;
  done: (el: Element, x: number, y: number) => void;
}

interface SidebarFilters {
  scope: 'page' | 'all';
  type: '' | ItemType;
  status: 'unresolved' | '' | ItemStatus;
  mine: boolean;
  round: number; // 0 = all rounds
  bp: '' | 'mobile' | 'tablet' | 'desktop';
}

/** Today's date in the browser, as Y-m-d. */
function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Adds whole days to a Y-m-d date (calendar math, no timezone drift). */
export function addDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return t.toISOString().slice(0, 10);
}

/**
 * The due date to suggest for the next item: the reviewer's batch date while the batch
 * is running, otherwise N days from today.
 */
export function suggestDue(due: Config['due'], now: number = Date.now()): string {
  if (!due) return '';
  if (due.batchUntil && now < due.batchUntil * 1000) return due.suggest;
  if (!due.batchUntil && due.suggest) return due.suggest; // computed by the server at page load
  return addDays(localToday(), due.days);
}

/**
 * A <video> for a recording. Browser-made WebM carries no length in its header, so Chrome reports
 * Infinity and the scrubber doesn't work: seek far past the end once, which makes it read the real
 * length, then rewind. `seconds` is shown meanwhile.
 */
export function playableVideo(src: string, seconds: number): HTMLVideoElement {
  const video = h('video', { src, controls: true, preload: 'metadata', playsinline: true, title: `Screen recording (${clock(seconds * 1000)})` }) as HTMLVideoElement;
  video.addEventListener(
    'loadedmetadata',
    () => {
      if (video.duration !== Infinity) return;
      const rewind = () => {
        video.removeEventListener('durationchange', rewind);
        video.currentTime = 0;
      };
      video.addEventListener('durationchange', rewind);
      video.currentTime = 1e9;
    },
    { once: true }
  );
  return video;
}

export class App {
  private api: Api;
  private host!: HTMLDivElement;
  private root!: HTMLDivElement;
  private pinsLayer!: HTMLDivElement;
  private outline!: HTMLDivElement;
  private outlineTag!: HTMLSpanElement;
  private toolbar: HTMLDivElement | null = null;
  private sidebar: HTMLDivElement | null = null;
  private card: HTMLElement | null = null;
  private hintEl: HTMLElement | null = null;
  private bannerEl: HTMLElement | null = null;

  private mode = false;
  private pinMode: PinModeRequest | null = null;
  private states = new Map<number, PinState>();
  private allItems: Item[] | null = null;
  private filters: SidebarFilters = { scope: 'page', type: '', status: 'unresolved', mine: false, round: 0, bp: '' };
  private pagePath: string;
  private framePending = false;
  private refreshTimer = 0;
  private lastWidth = window.innerWidth;
  private mutationObserver: MutationObserver | null = null;
  private loaded = false;
  private corner: Corner = 'br';
  private dragging = false;
  private ghost: HTMLDivElement | null = null;
  /** True inside our own device-preview iframe. */
  private readonly inPreview = window.self !== window.top && window.name === PREVIEW_FRAME_NAME;
  private previewEl: HTMLElement | null = null;
  /** Element the open menu/composer is about; stays outlined until the card closes. */
  private selectedEl: Element | null = null;
  private unbinds: Array<() => void> = [];
  private cardCleanup: (() => void) | null = null;
  /** Asked before the open card closes; false keeps it open (a composer holding a recording). */
  private cardGuard: (() => boolean) | null = null;
  /** The screen recording in progress, if any. */
  private recorder: Recorder | null = null;
  private recClock: HTMLElement | null = null;
  private stopTrail: (() => void) | null = null;
  /** Gets the finished recording (or null when it was discarded or never started). */
  private recDone: ((recording: Recording | null) => void) | null = null;

  constructor(private cfg: Config) {
    this.api = new Api(cfg);
    this.pagePath = cfg.pagePath ?? currentPagePath(cfg.homePath);
  }

  /** Cleans up all listeners, observers, timers and DOM elements. */
  destroy(): void {
    if (this.recorder) void this.recorder.discard();
    this.stopTrail?.();
    if (this.cardCleanup) {
      this.cardCleanup();
      this.cardCleanup = null;
    }
    for (const u of this.unbinds) u();
    this.unbinds = [];
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
    if (this.refreshTimer) {
      window.clearTimeout(this.refreshTimer);
      this.refreshTimer = 0;
    }
    this.host?.remove();
  }

  private listen(target: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
    target.addEventListener(type, listener, options);
    this.unbinds.push(() => target.removeEventListener(type, listener, options));
  }

  init(): void {
    this.mount();
    this.bindGlobalEvents();
    this.bindAdminBar();

    let stored = false;
    let localCorner: Corner | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY) === '1';
      const corner = window.localStorage.getItem(CORNER_KEY) as Corner | null;
      if (corner && CORNERS.includes(corner)) localCorner = corner;
    } catch {
      stored = false;
    }
    // The corner is per reviewer (saved on their WordPress user), so it
    // follows them to any browser. A choice made before that, in this browser, is adopted once.
    const prefs = this.cfg.prefs ?? {};
    this.corner = prefs.corner ?? localCorner ?? this.corner;
    if (!this.inPreview) {
      const adopt: NonNullable<Config['prefs']> = {};
      if (!prefs.corner && localCorner) adopt.corner = localCorner;
      if (Object.keys(adopt).length) this.savePrefs(adopt);
    }
    if (this.inPreview) {
      // Inside the device preview: always in Feedback mode, and no admin bar, even after
      // navigating within the frame (which drops the ?fbcol_preview arg the server keys on).
      const style = document.createElement('style');
      style.textContent = '#wpadminbar{display:none!important}html{margin-top:0!important}';
      document.head.append(style);
      this.corner = 'bl';
      void this.setMode(true);
      return;
    }
    if (this.cfg.openItem || stored) {
      void this.setMode(true);
    }
  }

  // ---------------------------------------------------------------- mounting

  private mount(): void {
    this.host = h('div', { id: OVERLAY_HOST_ID });
    // Inline !important beats page stylesheets such as `* { all: unset }`.
    this.host.setAttribute(
      'style',
      'all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;'
    );
    const shadow = this.host.attachShadow({ mode: 'open' });
    shadow.append(h('style', { text: css }));

    this.root = h('div', { class: 'fbc' });
    const brand = this.cfg.brand;
    if (brand) {
      // Text colors arrive pre-computed by luminance, so white never lands on a light brand color.
      const vars: Array<[string, string]> = [
        ['--primary', brand.primary],
        ['--on-primary', brand.onPrimary],
        ['--dark', brand.dark],
        ['--on-dark', brand.onDark],
        ['--brand-accent', brand.accent],
        ['--ink-primary', brand.ink ?? ''],
      ];
      for (const [prop, value] of vars) {
        if (value) this.root.style.setProperty(prop, value);
      }
    }
    const layer = h('div', { class: 'layer' });
    this.outlineTag = h('span', { class: 'outline-tag' });
    this.outline = h('div', { class: 'outline' }, this.outlineTag);
    this.pinsLayer = h('div');
    layer.append(this.outline, this.pinsLayer);
    this.root.append(layer);
    shadow.append(this.root);
    document.body.append(this.host);
  }

  private inOverlay(e: Event): boolean {
    return e.composedPath().includes(this.host);
  }

  private bindGlobalEvents(): void {
    this.listen(document, 'contextmenu', ((e: MouseEvent) => this.onContextMenu(e)) as EventListener, true);
    this.listen(document, 'mousemove', ((e: MouseEvent) => this.onMouseMove(e)) as EventListener, { capture: true, passive: true });
    for (const type of ['pointerdown', 'mousedown', 'mouseup', 'click']) {
      this.listen(document, type, ((e: MouseEvent) => this.onPinModeEvent(e)) as EventListener, true);
    }
    this.listen(document, 'mousedown', ((e: MouseEvent) => this.onOutsideMouseDown(e)) as EventListener, false);
    this.listen(document, 'keydown', ((e: KeyboardEvent) => this.onKeyDown(e)) as EventListener, true);
    this.listen(window, 'scroll', (() => this.schedulePosition()) as EventListener, { passive: true, capture: true });
    this.listen(window, 'resize', (() => {
      const widthChanged = window.innerWidth !== this.lastWidth;
      this.lastWidth = window.innerWidth;
      if (this.card?.classList.contains('popover') || this.card?.classList.contains('composer')) {
        this.card.style.maxHeight = `${Math.max(160, window.innerHeight - this.topOffset() - 24)}px`;
        this.moveCard(this.card, this.card.offsetLeft, this.card.offsetTop);
      }
      if (widthChanged) this.scheduleRefresh(80);
      else this.schedulePosition();
    }) as EventListener);
  }

  private bindAdminBar(): void {
    const link = document.querySelector<HTMLAnchorElement>('#wp-admin-bar-fbcol-toggle > a');
    if (link) {
      this.listen(link, 'click', ((e: MouseEvent) => {
        e.preventDefault();
        void this.setMode(!this.mode);
      }) as EventListener);
    }
  }

  // ---------------------------------------------------------------- mode

  async setMode(on: boolean): Promise<void> {
    if (!on && this.recorder) {
      this.toast('Stop or discard the recording first', true);
      return;
    }
    this.mode = on;
    if (!this.inPreview) {
      // The preview frame shares localStorage with the parent; it must not toggle the parent's mode.
      try {
        window.localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
      } catch {
        /* storage unavailable: mode simply isn't remembered */
      }
    }
    document.querySelector('#wp-admin-bar-fbcol-toggle')?.classList.toggle('fbc-on', on);

    if (!on) {
      this.exitPinMode();
      this.closeCard();
      this.closeSidebar();
      this.hideOutline();
      this.toolbar?.remove();
      this.toolbar = null;
      this.bannerEl?.remove();
      this.bannerEl = null;
      this.pinsLayer.replaceChildren();
      for (const s of this.states.values()) s.pin = null;
      this.mutationObserver?.disconnect();
      return;
    }

    this.renderToolbar();
    this.observeMutations();
    if (!this.loaded) {
      await this.loadItems();
    } else {
      this.refresh();
    }
    if (this.cfg.openItem) {
      const id = this.cfg.openItem;
      this.cfg.openItem = 0;
      this.stripDeepLinkParam();
      void this.openDeepLink(id);
    }
  }

  private stripDeepLinkParam(): void {
    const url = new URL(window.location.href);
    if (url.searchParams.has('fbcol_item') || url.searchParams.has('fbc_item')) {
      url.searchParams.delete('fbcol_item');
      url.searchParams.delete('fbc_item'); // 0.3 links in older Teamwork tasks
      window.history.replaceState(window.history.state, '', url.toString());
    }
  }

  // ---------------------------------------------------------------- data

  private async loadItems(): Promise<void> {
    try {
      const { items } = await this.api.listItems(this.pagePath);
      // Reuse pins already on screen; drop the ones whose item is gone (never leave strays behind).
      const prev = new Map(this.states);
      this.states.clear();
      for (const item of items) {
        const old = prev.get(item.id);
        prev.delete(item.id);
        this.states.set(item.id, { item, el: old?.el ?? null, placement: 'orphan', pin: old?.pin ?? null });
      }
      for (const stale of prev.values()) stale.pin?.remove();
      this.loaded = true;
      this.refresh();
    } catch (err) {
      this.toast(`Could not load feedback: ${(err as Error).message}`, true);
    }
  }

  private upsert(item: Item): void {
    const existing = this.states.get(item.id);
    if (existing) {
      existing.item = item;
    } else {
      this.states.set(item.id, { item, el: null, placement: 'orphan', pin: null });
    }
    if (this.allItems) {
      const i = this.allItems.findIndex((x) => x.id === item.id);
      if (i >= 0) this.allItems[i] = item;
      else this.allItems.push(item);
    }
    this.updateScopeBadges();
  }

  private remove(id: number): void {
    const s = this.states.get(id);
    s?.pin?.remove();
    this.states.delete(id);
    if (this.allItems) this.allItems = this.allItems.filter((x) => x.id !== id);
    this.updateScopeBadges();
  }

  // ---------------------------------------------------------------- resolve + pins

  /** Re-resolve every anchor, recompute visibility, redraw pins. */
  private refresh(): void {
    for (const s of this.states.values()) {
      if (!s.item.anchor) {
        s.el = null;
        s.placement = 'note';
        continue;
      }
      const el = s.el && s.el.isConnected ? s.el : resolveAnchor(s.item.anchor).el;
      s.el = el;
      s.placement = !el ? 'orphan' : isRenderable(el) ? 'pinned' : 'hidden';
    }
    this.drawPins();
    this.updateToolbarCount();
    if (this.sidebar) this.renderSidebarList();
  }

  private drawPins(): void {
    if (!this.mode) return;
    for (const s of this.states.values()) {
      // Pins follow the List's status filter, so the page and the List never disagree.
      const show = s.placement === 'pinned' && this.matchesStatus(s.item);
      if (!show) {
        s.pin?.remove();
        s.pin = null;
        continue;
      }
      if (!s.pin) {
        const pin = h('button', {
          class: 'pin',
          type: 'button',
          'aria-label': `Feedback #${s.item.id}: ${s.item.title}`,
          onclick: (e: Event) => {
            e.stopPropagation();
            void this.openPopover(s.item.id);
          },
        });
        s.pin = pin;
        this.pinsLayer.append(pin);
      }
      const resolved = s.item.status === 'resolved';
      const pulsing = s.pin.classList.contains('pulse');
      s.pin.className = `pin ${s.item.type}${resolved ? ' resolved' : ''}${pulsing ? ' pulse' : ''}`;
      s.pin.textContent = resolved ? '✓' : String(s.item.id);
      s.pin.title = `#${s.item.id} ${s.item.title}`;
    }
    this.positionPins();
  }

  private schedulePosition(): void {
    if (this.framePending || !this.mode) return;
    this.framePending = true;
    requestAnimationFrame(() => {
      this.framePending = false;
      this.positionPins();
      this.positionChrome();
      if (this.selectedEl) this.hideOutline(); // keeps the locked outline on its element while scrolling
    });
  }

  private scheduleRefresh(delay = 250): void {
    window.clearTimeout(this.refreshTimer);
    this.refreshTimer = window.setTimeout(() => this.mode && this.refresh(), delay);
  }

  /** Viewport-relative positioning keeps pins on sticky/fixed elements while scrolling. */
  private positionPins(): void {
    for (const s of this.states.values()) {
      if (!s.pin || !s.el || !s.item.anchor) continue;
      const r = s.el.getBoundingClientRect();
      const x = r.left + s.item.anchor.offsetX * r.width;
      const y = r.top + s.item.anchor.offsetY * r.height;
      s.pin.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    }
  }

  private observeMutations(): void {
    if (!this.mutationObserver) {
      this.mutationObserver = new MutationObserver((records) => {
        if (records.every((r) => r.target === this.host || this.host.contains(r.target))) return;
        this.schedulePosition();
        this.scheduleRefresh(300);
      });
    }
    this.mutationObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style', 'hidden', 'open'] });
  }

  // ---------------------------------------------------------------- input

  private onContextMenu(e: MouseEvent): void {
    if (!this.mode || this.recorder || e.altKey || this.inOverlay(e)) return;
    const target = this.eventTarget(e);
    if (!target) return;
    e.preventDefault();
    e.stopPropagation();
    this.exitPinMode();
    this.openTypeMenu(target, e.clientX, e.clientY);
  }

  private onPinModeEvent(e: MouseEvent): void {
    if (!this.pinMode || this.inOverlay(e) || e.button !== 0) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (e.type !== 'click') return;
    const target = this.eventTarget(e);
    const req = this.pinMode;
    this.exitPinMode();
    if (target) req.done(target, e.clientX, e.clientY);
  }

  private onOutsideMouseDown(e: MouseEvent): void {
    // A composer holding a recording only closes on purpose (× / Cancel / Esc), never by a stray click.
    if (this.card && !this.inOverlay(e) && !this.cardGuard && !this.recorder) this.closeCard();
  }

  private onMouseMove(e: MouseEvent): void {
    // The outline shows only while picking an element to pin (+); plain hovering stays quiet.
    if (!this.mode || this.recorder || !this.pinMode || this.inOverlay(e)) {
      if (!this.pinMode) this.hideOutline();
      return;
    }
    const target = this.eventTarget(e);
    if (!target || target === document.documentElement || target === document.body) {
      this.hideOutline();
      return;
    }
    this.drawOutline(target);
  }

  private drawOutline(target: Element): void {
    const r = target.getBoundingClientRect();
    Object.assign(this.outline.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    const id = target.id ? `#${target.id}` : '';
    this.outlineTag.textContent = `${target.tagName.toLowerCase()}${id}`;
    this.outline.classList.add('on');
  }

  private onKeyDown(e: KeyboardEvent): void {
    // The annotator handles its own keys (Esc, undo, tool shortcuts); stay out of its way so
    // Esc there never closes the composer underneath.
    if (this.annotating) return;
    const origin = e.composedPath()[0];
    const typing =
      origin instanceof HTMLElement && (origin.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(origin.tagName));

    if (e.altKey && e.shiftKey && e.code === 'KeyF' && !typing) {
      e.preventDefault();
      void this.setMode(!this.mode);
      return;
    }
    if (e.key === 'Escape' && this.previewEl) {
      e.preventDefault();
      this.closePreview();
      return;
    }
    if (e.key === 'Escape' && this.mode) {
      if (this.pinMode) {
        this.exitPinMode();
        e.preventDefault();
      } else if (this.card) {
        this.closeCard();
        e.preventDefault();
      } else if (this.sidebar) {
        this.closeSidebar();
        e.preventDefault();
      }
    }
  }

  private eventTarget(e: Event): Element | null {
    const t = e.target;
    if (t instanceof Element) return t;
    if (t instanceof Node) return t.parentElement;
    return null;
  }


  /** Hides the hover outline, unless an element is selected (menu/composer open for it): that one stays outlined. */
  private hideOutline(): void {
    if (this.selectedEl?.isConnected) {
      this.drawOutline(this.selectedEl);
      this.outline.classList.add('locked');
      return;
    }
    this.outline.classList.remove('on', 'locked');
  }

  private enterPinMode(req: PinModeRequest): void {
    this.closeCard();
    this.pinMode = req;
    this.hintEl?.remove();
    this.hintEl = h('div', { class: 'crosshair-hint', text: `${req.hint} · Esc to cancel` });
    this.root.append(this.hintEl);
    document.documentElement.style.cursor = 'crosshair';
    this.renderToolbar();
  }

  private exitPinMode(): void {
    if (!this.pinMode) return;
    this.pinMode = null;
    this.hintEl?.remove();
    this.hintEl = null;
    document.documentElement.style.cursor = '';
    this.hideOutline();
    this.renderToolbar();
  }

  // ---------------------------------------------------------------- cards

  private scripts = new Map<string, Promise<void>>();
  private annotating = false;

  /** Opens the screenshot annotator (Fabric.js, loaded on first use). Resolves null on cancel. */
  private async annotate(image: Blob): Promise<Blob | null> {
    if (this.annotating) return null;
    this.annotating = true;
    try {
      if (!window.FBCOLAnnotator) await this.loadBundle('annotator.js');
      const api = window.FBCOLAnnotator;
      if (!api) throw new Error('The annotator could not load.');
      const brand = this.cfg.brand?.primary ?? '#6953c4';
      return await api.open({ image, mount: this.root, colors: ['#e5383b', brand, '#ffb703', '#ffffff', '#111111'] });
    } catch (err) {
      this.toast((err as Error).message, true);
      return null;
    } finally {
      this.annotating = false;
    }
  }

  /** Loads a lazily built bundle from dist/ once (capture.js, annotator.js). */
  private loadBundle(file: string): Promise<void> {
    const cached = this.scripts.get(file);
    if (cached) return cached;
    const base = this.cfg.assetsUrl ?? '';
    const p = new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = `${base}${file}${this.cfg.version ? `?ver=${encodeURIComponent(this.cfg.version)}` : ''}`;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        this.scripts.delete(file);
        reject(new Error(`Could not load ${file}`));
      };
      document.head.append(s);
    });
    this.scripts.set(file, p);
    return p;
  }

  /** Screenshot of the current viewport (overlay excluded, inputs masked), or null if disabled/failed. */
  private async startCapture(marker: { x: number; y: number } | null): Promise<Blob | null> {
    if (!this.cfg.shots || !this.cfg.assetsUrl) return null;
    try {
      if (!window.FBCOLCapture) await this.loadBundle('capture.js');
      const api = window.FBCOLCapture;
      if (!api) return null;
      return await api.captureViewport({ marker, color: this.cfg.brand?.primary ?? '#6953c4' });
    } catch {
      return null;
    }
  }

  /** Assignee picker options from the active source (Teamwork project members or WordPress users). */
  private assigneeOptions(): Array<[string, string]> {
    return [['0', 'Unassigned'], ...this.cfg.assignees.people.map((p): [string, string] => [String(p.id), p.name])];
  }

  private assigneeLabel(): string {
    return this.cfg.assignees.source === 'teamwork' ? 'Assignee (Teamwork)' : 'Assignee';
  }

  /** createAnchor throws for overlay, detached or shadow-DOM elements; never let that break the click. */
  private safeAnchor(el: Element, x: number, y: number): Anchor | null {
    try {
      return createAnchor(el, x, y);
    } catch {
      this.toast("Can't pin to that element. Try its container, or add a page note.", true);
      return null;
    }
  }

  /** Closes the open card. Selection survives only when one card replaces another (menu → composer). */
  private closeCard(keepSelection = false): void {
    if (this.cardGuard) {
      if (!this.cardGuard()) return;
      this.cardGuard = null;
    }
    if (this.cardCleanup) {
      this.cardCleanup();
      this.cardCleanup = null;
    }
    this.card?.remove();
    this.card = null;
    if (!keepSelection) {
      this.selectedEl = null;
      this.hideOutline();
    }
  }

  /**
   * Closes the open card so another can take its place. False when it refused (a composer holding a
   * video, or one hidden behind a recording in progress): the caller must not open anything.
   */
  private releaseCard(): boolean {
    if (!this.card) return true;
    this.closeCard(true);
    return !this.card;
  }

  private showCard(card: HTMLElement, x: number, y: number): void {
    this.closeCard(true);
    this.hideOutline();
    this.card = card;
    card.style.left = '0px';
    card.style.top = '0px';
    card.style.visibility = 'hidden';
    // Never taller than the space below the admin bar, so the whole card always fits.
    card.style.maxHeight = `${Math.max(160, window.innerHeight - this.topOffset() - 24)}px`;
    this.root.append(card);
    this.moveCard(card, x + 8, y + 8);
    card.style.visibility = '';
    // Screenshots load after placement and grow the card: keep it fully on screen as it resizes.
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        if (!card.isConnected) return ro.disconnect();
        this.moveCard(card, card.offsetLeft, card.offsetTop);
      });
      ro.observe(card);
    }
    card.addEventListener('load', () => this.moveCard(card, card.offsetLeft, card.offsetTop), true);
    const head = card.querySelector<HTMLElement>(':scope > .head');
    if (head) {
      head.classList.add('drag');
      head.title = 'Drag to move';
      head.addEventListener('pointerdown', (e) => this.startCardDrag(card, e));
    }
  }

  /** Places a card at (left, top), clamped so all of it stays on screen and below the admin bar. */
  private moveCard(card: HTMLElement, left: number, top: number): void {
    const minTop = this.topOffset() + 12;
    const maxLeft = Math.max(12, window.innerWidth - card.offsetWidth - 12);
    const maxTop = Math.max(minTop, window.innerHeight - card.offsetHeight - 12);
    card.style.left = `${Math.round(Math.max(12, Math.min(left, maxLeft)))}px`;
    card.style.top = `${Math.round(Math.max(minTop, Math.min(top, maxTop)))}px`;
  }

  /** Drags a card by its header; the card can't be pushed off screen. */
  private startCardDrag(card: HTMLElement, e: PointerEvent): void {
    if (e.button !== 0 || (e.target as Element).closest('button, a, input, select, textarea')) return;
    e.preventDefault();
    const head = e.currentTarget as HTMLElement;
    const dx = e.clientX - card.offsetLeft;
    const dy = e.clientY - card.offsetTop;
    try {
      head.setPointerCapture(e.pointerId);
    } catch {
      // Synthetic or already-released pointer: dragging still works while over the header.
    }
    card.classList.add('dragging');
    const move = (ev: PointerEvent) => this.moveCard(card, ev.clientX - dx, ev.clientY - dy);
    const end = () => {
      card.classList.remove('dragging');
      head.removeEventListener('pointermove', move);
      head.removeEventListener('pointerup', end);
      head.removeEventListener('pointercancel', end);
    };
    head.addEventListener('pointermove', move);
    head.addEventListener('pointerup', end);
    head.addEventListener('pointercancel', end);
  }

  private openTypeMenu(el: Element, x: number, y: number): void {
    if (!this.releaseCard()) return;
    // Keep the right-clicked element outlined while the menu and composer are open.
    this.selectedEl = el;
    const labels = this.cfg.labels.type;
    const choose = (type: ItemType) => this.openComposer(type, el, x, y);
    const buttons = TYPES.map((type, i) =>
      h('button', { type: 'button', onclick: () => choose(type) }, h('span', { class: `dot ${type}` }), labels[type], h('kbd', { text: String(i + 1) }))
    );
    const menu = h(
      'div',
      {
        class: 'card menu',
        role: 'menu',
        onkeydown: (e: Event) => {
          const k = (e as KeyboardEvent).key;
          const n = Number(k);
          if (n >= 1 && n <= TYPES.length) {
            e.preventDefault();
            choose(TYPES[n - 1]);
          }
        },
      },
      h('div', { class: 'menu-title', text: 'Add feedback' }),
      ...buttons,
      h('hr'),
      h('button', { type: 'button', onclick: () => this.openComposer('comment', null, window.innerWidth / 2 - 170, 120) }, 'Note for the whole page')
    );
    this.showCard(menu, x, y);
    buttons[0].focus();
  }

  private openComposer(type: ItemType, el: Element | null, x: number, y: number): void {
    if (!this.releaseCard()) return;
    this.selectedEl = el; // a whole-page note has nothing to keep outlined
    let anchor: Anchor | null = null;
    if (el) {
      anchor = this.safeAnchor(el, x, y);
      if (!anchor) return;
    }
    const labels = this.cfg.labels;
    const typeSelect = select('type', TYPES.map((t) => [t, labels.type[t]]), type);
    const title = h('input', { type: 'text', name: 'title', maxlength: 255, required: true, placeholder: 'What needs attention?', autocomplete: 'off' });
    const desc = h('textarea', { name: 'description', placeholder: 'Details, steps to reproduce, what you expected… (optional)' });
    const priority = select('priority', (Object.keys(labels.priority) as Priority[]).map((p) => [p, labels.priority[p]]), 'medium');
    const assignee = select('assignee_id', this.assigneeOptions(), '0');
    // "Set date?": ticked by default when the site says so, pre-filled with the reviewer's
    // batch date (or N days out when no batch is running).
    const dueOn = h('input', { type: 'checkbox', name: 'due_on' }) as HTMLInputElement;
    dueOn.checked = !!this.cfg.due?.onByDefault;
    const dueInput = h('input', { type: 'date', name: 'due_date', value: suggestDue(this.cfg.due) }) as HTMLInputElement;
    dueInput.hidden = !dueOn.checked;
    dueOn.addEventListener('change', () => {
      dueInput.hidden = !dueOn.checked;
      if (dueOn.checked && !dueInput.value) dueInput.value = suggestDue(this.cfg.due);
    });
    const error = h('div', { class: 'error', role: 'alert' });
    const submit = h('button', { class: 'btn primary', type: 'submit', text: 'Add' });

    // Show it: nothing is attached until the reviewer asks for a screenshot or a video (one or
    // the other). Both leave the overlay out, so the open composer never appears in them.
    type Attachment = { kind: 'shot'; blob: Blob; url: string } | { kind: 'video'; rec: Recording; url: string; timer: number };
    let attach: Attachment | null = null;
    let recording = false;
    const canShot = !!this.cfg.shots && !!this.cfg.assetsUrl;
    const canVideo = this.canRecordHere();
    const marker = el ? { x, y } : null;
    const attachBox = h('div', { class: 'attach', 'aria-live': 'polite' });

    const dropAttachment = (discardVideo: boolean) => {
      if (!attach) return;
      URL.revokeObjectURL(attach.url);
      if (attach.kind === 'video') {
        window.clearInterval(attach.timer);
        if (discardVideo) void attach.rec.discard();
      }
      attach = null;
    };
    // Closing the composer would throw a video away (or end a recording in progress): confirm first.
    const syncGuard = () => {
      this.cardGuard =
        recording || attach?.kind === 'video'
          ? () => {
              if (recording) return false; // stop or discard from the recording bar first
              if (!window.confirm('Discard this screen recording?')) return false;
              dropAttachment(true);
              return true;
            }
          : null;
    };
    const takeShot = async () => {
      attachBox.replaceChildren(h('div', { class: 'meta', text: 'Capturing screenshot…' }));
      const blob = await this.startCapture(marker);
      if (!form.isConnected) return;
      if (blob) {
        dropAttachment(true);
        attach = { kind: 'shot', blob, url: URL.createObjectURL(blob) };
      } else {
        this.toast('Couldn’t capture a screenshot', true);
      }
      renderAttach();
    };
    const recordVideo = () => {
      recording = true;
      syncGuard();
      form.hidden = true;
      void this.startRecording((rec) => {
        recording = false;
        if (!form.isConnected) {
          if (rec) void rec.discard();
          return;
        }
        form.hidden = false;
        if (rec) {
          dropAttachment(true);
          const status = () => {
            const p = rec.progress();
            const line = attachBox.querySelector('.rec-status');
            if (line) line.textContent = p >= 1 ? `Uploaded${rec.mic ? '' : ' · no microphone'}` : `Uploading… ${Math.round(p * 100)}%`;
            if (p >= 1 && attach?.kind === 'video') window.clearInterval(attach.timer);
          };
          attach = { kind: 'video', rec, url: URL.createObjectURL(rec.blob), timer: window.setInterval(status, 400) };
          renderAttach();
          status();
        } else {
          renderAttach();
        }
        syncGuard();
        this.moveCard(form, form.offsetLeft, form.offsetTop);
        title.focus();
      });
    };
    const remove = (label: string) =>
      h('button', {
        type: 'button',
        class: 'btn link',
        text: label,
        onclick: () => {
          dropAttachment(true);
          renderAttach();
          syncGuard();
        },
      });
    const renderAttach = () => {
      if (!attach) {
        attachBox.replaceChildren(
          ...(canShot || canVideo
            ? [
                h(
                  'div',
                  { class: 'attach-pick' },
                  h('span', { class: 'attach-label', text: 'Show it' }),
                  canShot ? h('button', { type: 'button', class: 'btn attach-btn', onclick: () => void takeShot() }, deviceIcon('camera'), 'Screenshot') : null,
                  canVideo ? h('button', { type: 'button', class: 'btn attach-btn', onclick: recordVideo }, deviceIcon('record'), 'Video') : null
                ),
              ]
            : [])
        );
        return;
      }
      if (attach.kind === 'shot') {
        const shot = attach;
        attachBox.replaceChildren(
          h(
            'div',
            { class: 'shot' },
            h('img', { src: shot.url, alt: 'Screenshot that will be attached' }),
            h(
              'div',
              { class: 'shot-actions' },
              h('button', {
                type: 'button',
                class: 'btn link',
                text: '✎ Annotate',
                onclick: async () => {
                  const edited = await this.annotate(shot.blob);
                  if (!edited || attach !== shot) return;
                  URL.revokeObjectURL(shot.url);
                  attach = { kind: 'shot', blob: edited, url: URL.createObjectURL(edited) };
                  renderAttach();
                },
              }),
              h('button', { type: 'button', class: 'btn link', text: 'Retake', onclick: () => void takeShot() }),
              remove('Remove')
            )
          )
        );
        return;
      }
      const video = attach;
      attachBox.replaceChildren(
        h(
          'div',
          { class: 'rec-preview' },
          playableVideo(video.url, video.rec.durationMs / 1000),
          h(
            'div',
            { class: 'meta' },
            `Screen recording · ${clock(video.rec.durationMs)}`,
            video.rec.events.length ? ` · ${video.rec.events.length} click${video.rec.events.length === 1 ? '' : 's'} and errors logged` : ''
          ),
          h('div', { class: 'meta rec-status' }),
          h('div', { class: 'shot-actions' }, canVideo ? h('button', { type: 'button', class: 'btn link', text: 'Re-record', onclick: recordVideo }) : null, remove('Remove'))
        )
      );
    };
    renderAttach();

    const form = h(
      'form',
      {
        class: 'card composer',
        novalidate: true,
        onsubmit: (e: Event) => {
          e.preventDefault();
          void save();
        },
      },
      h('div', { class: 'head' }, h('span', { class: 'chip' }, h('span', { class: `dot ${type}` }), el ? `<${el.tagName.toLowerCase()}>` : 'Whole page'), h('button', { class: 'x', type: 'button', 'aria-label': 'Close', text: '×', onclick: () => this.closeCard() })),
      h('label', { class: 'field' }, h('span', { text: 'Title' }), title),
      error,
      h('label', { class: 'field' }, h('span', { text: 'Description' }), desc),
      h('div', { class: 'row' }, h('label', { class: 'field' }, h('span', { text: 'Type' }), typeSelect), h('label', { class: 'field' }, h('span', { text: 'Priority' }), priority)),
      h('label', { class: 'field' }, h('span', { text: this.assigneeLabel() }), assignee),
      this.cfg.assignees.fallback
        ? h('div', { class: 'meta hint', text: 'Showing WordPress users until Teamwork is connected (Feedback → Settings). Then this lists your Teamwork project members.' })
        : null,
      h('div', { class: 'field due-field' }, h('label', { class: 'check' }, dueOn, ' Set date?'), dueInput),
      attachBox,
      h('div', { class: 'actions' }, h('button', { class: 'btn link', type: 'button', text: 'Cancel', onclick: () => this.closeCard() }), submit)
    );

    const save = async () => {
      error.textContent = '';
      if (!title.value.trim()) {
        error.textContent = 'Add a short title.';
        title.focus();
        return;
      }
      submit.disabled = true;
      try {
        const current = attach as Attachment | null;
        let rec: { token: string; duration: number; events: Recording['events'] } | undefined;
        if (current?.kind === 'video') {
          submit.textContent = 'Uploading…';
          rec = { token: await current.rec.uploaded(), duration: Math.round(current.rec.durationMs / 1000), events: current.rec.events };
        }
        const item = await this.api.createItem(
          {
            type: typeSelect.value as ItemType,
            title: title.value.trim(),
            description: desc.value,
            priority: priority.value as Priority,
            assignee_id: Number(assignee.value),
            assignee_source: this.cfg.assignees.source,
            due_date: dueOn.checked && dueInput.value ? dueInput.value : null,
            page_path: this.pagePath,
            page_query: currentQuery(),
            page_title: document.title,
            anchor,
            context: captureContext(this.cfg),
            recording: rec,
          },
          current?.kind === 'shot' ? current.blob : null
        );
        dropAttachment(false);
        this.cardGuard = null;
        if (item.due_next) this.cfg.due = item.due_next; // keeps the batch date for the next item
        this.closeCard();
        this.upsert(item);
        const s = this.states.get(item.id);
        if (s && el) s.el = el;
        this.refresh();
        if (item.video_error) this.toast(`Added #${item.id}, but the recording wasn’t saved: ${item.video_error}`, true);
        else if (item.screenshot_error) this.toast(`Added #${item.id}, but the screenshot wasn’t saved: ${item.screenshot_error}`, true);
        else this.toast(`Added #${item.id}`);
      } catch (err) {
        error.textContent = (err as Error).message;
        submit.disabled = false;
        submit.textContent = 'Add';
      }
    };

    this.showCard(form, x, y);
    // Closing without saving frees the screenshot (a video is handled by the guard).
    this.cardCleanup = () => {
      if (attach?.kind === 'shot') dropAttachment(false);
    };
    title.focus();
  }

  async openPopover(id: number, at?: { x: number; y: number }): Promise<void> {
    if (!this.releaseCard()) return;
    let item: Item;
    try {
      item = await this.api.getItem(id);
    } catch (err) {
      this.toast((err as Error).message, true);
      return;
    }
    this.upsert(item);
    const labels = this.cfg.labels;
    const s = this.states.get(id);
    const pinRect = s?.pin?.getBoundingClientRect();
    const x = at?.x ?? (pinRect ? pinRect.right : window.innerWidth / 2 - 170);
    const y = at?.y ?? (pinRect ? pinRect.top : 100);

    const save = async (changes: Parameters<Api['updateItem']>[1]) => {
      try {
        const updated = await this.api.updateItem(id, changes);
        this.upsert(updated);
        this.refresh();
        void this.openPopover(id, { x: parseFloat(card.style.left) - 8, y: parseFloat(card.style.top) - 8 });
      } catch (err) {
        this.toast((err as Error).message, true);
      }
    };

    const status = select('status', (Object.keys(labels.status) as ItemStatus[]).map((k) => [k, labels.status[k]]), item.status, {
      onchange: () => void save({ status: status.value as ItemStatus }),
    });
    const assignee = select('assignee_id', this.assigneeOptions(), String(item.assignee_id), {
      onchange: () => void save({ assignee_id: Number(assignee.value), assignee_source: this.cfg.assignees.source }),
    });
    const priority = select('priority', (Object.keys(labels.priority) as Priority[]).map((k) => [k, labels.priority[k]]), item.priority, {
      onchange: () => void save({ priority: priority.value as Priority }),
    });
    const dueInput = h('input', {
      type: 'date',
      name: 'due_date',
      value: item.due_date ?? '',
      class: item.overdue ? 'overdue' : '',
      onchange: () => void save({ due_date: dueInput.value || null }),
    }) as HTMLInputElement;

    const reply = h('textarea', { placeholder: 'Reply… (type @ to mention)', rows: 2 }) as HTMLTextAreaElement;
    const replyField = h('label', { class: 'field mention-container' }, reply);
    const cleanupMentions = this.setupMentions(reply, replyField);

    const thread = h(
      'ul',
      { class: 'thread' },
      ...(item.comments ?? []).map((c) =>
        h('li', { class: c.kind }, h('span', { class: 'who', text: c.user_name }), h('span', { class: 'when', text: relativeTime(c.created_at) }), this.renderMentionText('body', c.body))
      )
    );

    const current = breakpoint();
    const mismatch =
      item.breakpoint && item.breakpoint !== current
        ? h('div', { class: 'notice', text: `Logged at ${item.breakpoint} (${item.context?.viewport_w ?? '?'}px). You are on ${current} (${window.innerWidth}px).` })
        : null;
    const orphan = s?.placement === 'orphan' ? h('div', { class: 'notice', text: 'The element this was pinned to can’t be found on the page anymore. Use “Pin again” in the list to place it.' }) : null;

    const card = h(
      'div',
      { class: 'card popover', role: 'dialog', 'aria-label': `Feedback #${item.id}` },
      h('div', { class: 'head' }, h('span', { class: 'chip' }, h('span', { class: `dot ${item.type}` }), `${labels.type[item.type]} #${item.id}`), h('button', { class: 'x', type: 'button', 'aria-label': 'Close', text: '×', onclick: () => this.closeCard() })),
      h('div', { class: 't', style: 'font-weight:700;font-size:15px;margin-bottom:4px', text: item.title }),
      h('div', { class: 'meta', text: `Round ${item.round} · ${item.reporter_name} · ${relativeTime(item.created_at)}` }),
      item.breakpoint
        ? h('div', { class: 'meta bp-line' }, h('span', { class: 'chip', text: item.breakpoint }), ` ${item.context?.viewport_w ?? '?'}px wide${item.context?.preview ? ` · ${item.context.preview} preview` : ''}`)
        : null,
      item.tw_task_url
        ? h('div', { class: 'meta' }, h('a', { href: item.tw_task_url, target: '_blank', rel: 'noopener', text: `Teamwork task #${item.tw_task_id} ↗` }), item.status === 'resolved' ? ' · completed' : ' · status syncs from Teamwork')
        : item.tw_note
          ? h('div', { class: 'notice', text: item.tw_note })
          : null,
      mismatch,
      orphan,
      item.description ? this.renderMentionText('desc', item.description) : null,
      item.screenshot_url
        ? (() => {
            let expanded = false;
            let toggleText: HTMLElement;
            const toggleBtn = h(
              'button',
              {
                type: 'button',
                class: 'shot-toggle',
                'aria-expanded': 'false',
                onclick: () => {
                  expanded = !expanded;
                  shotWrap.classList.toggle('is-expanded', expanded);
                  toggleBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                  toggleText.textContent = expanded ? 'Hide screenshot' : 'View screenshot';
                },
              },
              h('span', { class: 'shot-toggle-lead' }, shotIcon(), (toggleText = h('span', { class: 'shot-toggle-label', text: 'View screenshot' }))),
              chevronIcon()
            );

            const shotBody = h(
              'div',
              { class: 'shot-body' },
              h(
                'div',
                { class: 'shot-inner' },
                h('a', { href: item.screenshot_url, target: '_blank', rel: 'noopener', title: 'Open full screenshot' }, h('img', { src: item.screenshot_url, alt: 'Screenshot from when this was filed' })),
                h(
                  'div',
                  { class: 'shot-actions' },
                  h('button', {
                    type: 'button',
                    class: 'btn link',
                    text: '✎ Annotate',
                    onclick: async () => {
                      try {
                        const res = await fetch(item.screenshot_url as string, { credentials: 'same-origin', cache: 'no-store' });
                        const edited = await this.annotate(await res.blob());
                        if (!edited) return;
                        const updated = await this.api.replaceScreenshot(item.id, edited);
                        this.upsert(updated);
                        this.toast(`Annotations saved on #${item.id}`);
                        void this.openPopover(id, { x: parseFloat(card.style.left) - 8, y: parseFloat(card.style.top) - 8 });
                      } catch (err) {
                        this.toast((err as Error).message, true);
                      }
                    },
                  })
                )
              )
            );

            const shotWrap = h('div', { class: 'shot shot--collapsible' }, toggleBtn, shotBody);
            return shotWrap;
          })()
        : null,
      item.video_url ? this.videoBlock(item) : null,
      h('div', { class: 'row' }, h('label', { class: 'field' }, h('span', { text: 'Status' }), status), h('label', { class: 'field' }, h('span', { text: 'Priority' }), priority)),
      h('label', { class: 'field' }, h('span', { text: item.overdue ? 'Due date · overdue' : 'Due date' }), dueInput),
      item.assignee_locked
        ? h(
            'div',
            { class: 'field' },
            h('span', { text: this.assigneeLabel() }),
            h('div', { text: item.assignee_name || 'Unassigned' }),
            h('div', { class: 'meta', text: 'In Teamwork now: change the assignee there.' })
          )
        : h('label', { class: 'field' }, h('span', { text: this.assigneeLabel() }), assignee),
      thread,
      replyField,
      h(
        'div',
        { class: 'actions' },
        h('a', { class: 'btn link', href: `${this.cfg.adminUrl}&item=${item.id}`, target: '_blank', rel: 'noopener', text: 'Admin' }),
        item.can_delete ? h('button', { class: 'btn danger', type: 'button', text: 'Delete', onclick: () => void this.deleteItem(item.id) }) : null,
        h('button', {
          class: 'btn primary',
          type: 'button',
          text: 'Reply',
          onclick: async () => {
            if (!reply.value.trim()) return;
            try {
              await this.api.addComment(item.id, reply.value);
              void this.openPopover(id, { x: parseFloat(card.style.left) - 8, y: parseFloat(card.style.top) - 8 });
            } catch (err) {
              this.toast((err as Error).message, true);
            }
          },
        })
      )
    );
    this.showCard(card, x, y);
    this.cardCleanup = cleanupMentions;
  }

  private renderMentionText(containerClass: string, text: string): HTMLElement {
    const el = h('div', { class: containerClass });
    const people = this.cfg.assignees?.people ?? [];
    const escaped = people
      .map((p) => p.name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .filter((n) => n.length > 0)
      .sort((a, b) => b.length - a.length);
    const pattern = escaped.length
      ? new RegExp(`(@(?:${escaped.join('|')}|[A-Za-z0-9_.-]+))`, 'g')
      : /(@[A-Za-z0-9_.-]+)/g;
    const parts = text.split(pattern);
    for (const part of parts) {
      if (part.startsWith('@')) {
        el.append(h('span', { class: 'mention', text: part }));
      } else if (part) {
        el.append(document.createTextNode(part));
      }
    }
    return el;
  }

  private setupMentions(textarea: HTMLTextAreaElement, container: HTMLElement): () => void {
    const people = this.cfg.assignees?.people ?? [];
    if (!people.length) return () => {};

    let menu: HTMLDivElement | null = null;
    let selectedIndex = 0;
    let matchStart = -1;
    let filtered: Array<{ id: number; name: string }> = [];

    const closeMenu = () => {
      menu?.remove();
      menu = null;
      matchStart = -1;
      filtered = [];
    };

    const insertMention = (person: { id: number; name: string }) => {
      const val = textarea.value;
      const before = val.slice(0, matchStart);
      const after = val.slice(textarea.selectionEnd);
      const insert = `@${person.name} `;
      textarea.value = `${before}${insert}${after}`;
      const newPos = before.length + insert.length;
      textarea.setSelectionRange(newPos, newPos);
      textarea.focus();
      closeMenu();
    };

    const renderMenu = () => {
      if (!menu) {
        menu = h('div', { class: 'mention-menu', role: 'listbox' }) as HTMLDivElement;
        container.append(menu);
      }
      menu.innerHTML = '';
      if (!filtered.length) {
        closeMenu();
        return;
      }
      filtered.forEach((p, idx) => {
        const item = h('div', {
          class: `mention-item${idx === selectedIndex ? ' is-active' : ''}`,
          role: 'option',
          text: p.name,
          onclick: (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            insertMention(p);
          },
        });
        menu?.append(item);
      });
    };

    const onInput = () => {
      const pos = typeof textarea.selectionStart === 'number' && textarea.selectionStart > 0
        ? textarea.selectionStart
        : textarea.value.length;
      const val = textarea.value.slice(0, pos);
      const lastAt = val.lastIndexOf('@');
      if (lastAt === -1 || (lastAt > 0 && !/\s/.test(val[lastAt - 1]))) {
        closeMenu();
        return;
      }
      const query = val.slice(lastAt + 1).toLowerCase();
      if (query.includes('\n')) {
        closeMenu();
        return;
      }
      matchStart = lastAt;
      filtered = people.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 5);
      selectedIndex = 0;
      if (filtered.length) {
        renderMenu();
      } else {
        closeMenu();
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!menu) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % filtered.length;
        renderMenu();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + filtered.length) % filtered.length;
        renderMenu();
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        if (filtered[selectedIndex]) {
          e.preventDefault();
          insertMention(filtered[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
      }
    };

    textarea.addEventListener('input', onInput);
    textarea.addEventListener('keydown', onKeyDown);
    const onDocClick = (e: Event) => {
      if (menu && !menu.contains(e.target as Node) && e.target !== textarea) {
        closeMenu();
      }
    };
    document.addEventListener('click', onDocClick);

    return () => {
      closeMenu();
      textarea.removeEventListener('input', onInput);
      textarea.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('click', onDocClick);
    };
  }

  private reanchor(id: number): void {
    this.enterPinMode({
      hint: `Click the element #${id} belongs to`,
      done: async (el, x, y) => {
        try {
          const anchor = this.safeAnchor(el, x, y);
          if (!anchor) return;
          const updated = await this.api.updateItem(id, { anchor });
          this.upsert(updated);
          const s = this.states.get(id);
          if (s) s.el = el;
          this.refresh();
          this.toast(`Pinned #${id} again`);
        } catch (err) {
          this.toast((err as Error).message, true);
        }
      },
    });
  }

  private async deleteItem(id: number): Promise<void> {
    if (!window.confirm(`Delete feedback #${id}? This can’t be undone.`)) return;
    try {
      await this.api.deleteItem(id);
      this.closeCard();
      this.remove(id);
      this.refresh();
      this.toast(`Deleted #${id}`);
    } catch (err) {
      this.toast((err as Error).message, true);
    }
  }

  private async openDeepLink(id: number): Promise<void> {
    const s = this.states.get(id);
    if (s?.el && s.placement === 'pinned') {
      s.el.scrollIntoView({ block: 'center', behavior: 'auto' });
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      this.positionPins();
      s.pin?.classList.add('pulse');
    }
    const item = s?.item;
    if (item?.breakpoint && item.breakpoint !== breakpoint()) {
      this.showBanner(`#${id} was logged at ${item.breakpoint} (${item.context?.viewport_w ?? '?'}px wide). You're viewing at ${breakpoint()} (${window.innerWidth}px). Resize to reproduce.`);
    }
    await this.openPopover(id);
  }

  // ---------------------------------------------------------------- toolbar + sidebar

  private unresolvedCount(): number {
    let n = 0;
    for (const s of this.states.values()) if (s.item.status !== 'resolved') n++;
    return n;
  }

  /** The recording in a pin's card: the player, and a timeline of clicks and errors that seeks to each. */
  private videoBlock(item: Item): HTMLElement {
    const video = playableVideo(item.video_url as string, item.video_duration ?? 0);
    const events = item.video_events ?? [];
    return h(
      'details',
      { class: 'rec-block', open: true },
      h('summary', { text: `Screen recording · ${clock((item.video_duration ?? 0) * 1000)}` }),
      video,
      events.length
        ? h(
            'ol',
            { class: 'rec-timeline' },
            ...events.map((ev) =>
              h(
                'li',
                { class: ev.kind },
                h('button', {
                  type: 'button',
                  class: 'btn link',
                  text: clock(ev.t),
                  title: 'Play from here',
                  onclick: () => {
                    video.currentTime = Math.max(0, ev.t / 1000 - 1);
                    void video.play();
                  },
                }),
                h('span', { text: ev.kind === 'error' ? 'JS error ' : 'clicked ' }),
                h('code', { text: ev.label })
              )
            )
          )
        : null
    );
  }

  // ---------------------------------------------------------------- screen recording

  private canRecordHere(): boolean {
    return !!this.cfg.video?.enabled && !this.inPreview && canRecord();
  }

  /** Records the tab; `done` gets the recording, or null when it was cancelled, discarded or too short. */
  private async startRecording(done: (recording: Recording | null) => void): Promise<void> {
    if (this.recorder) return;
    this.exitPinMode();
    this.recDone = done;
    const recorder = new Recorder(this.api, {
      maxSeconds: this.cfg.video?.maxSeconds ?? 180,
      isOverlay: (e) => this.inOverlay(e),
      onTick: (ms) => {
        if (this.recClock) this.recClock.textContent = `${clock(ms)} / ${clock((this.cfg.video?.maxSeconds ?? 180) * 1000)}`;
      },
      onStop: (recording) => this.onRecordingStopped(recording),
    });
    this.recorder = recorder;
    this.renderToolbar();
    try {
      await recorder.start();
    } catch (err) {
      if (this.recorder !== recorder) return; // already discarded from the toolbar
      const name = (err as Error).name;
      if (name === 'NotAllowedError' || name === 'AbortError') this.toast('Recording cancelled');
      else this.toast(`Couldn’t start recording: ${(err as Error).message}`, true);
      this.finishRecording(null);
      return;
    }
    this.stopTrail = mountPointerTrail(this.root.querySelector('.layer') as HTMLElement);
  }

  private onRecordingStopped(recording: Recording): void {
    if (recording.durationMs < 1000 || !recording.blob.size) {
      void recording.discard();
      this.toast('Recording was too short, so it was discarded', true);
      this.finishRecording(null);
      return;
    }
    this.finishRecording(recording);
  }

  /** Back to the normal toolbar, and the recording to the composer that asked for it. */
  private finishRecording(recording: Recording | null): void {
    this.stopTrail?.();
    this.stopTrail = null;
    this.recorder = null;
    this.recClock = null;
    const done = this.recDone;
    this.recDone = null;
    this.renderToolbar();
    done?.(recording);
  }

  /** The toolbar while recording: a timer, Stop and Discard, nothing else to click by accident. */
  private recordingToolbar(): HTMLDivElement {
    const recorder = this.recorder as Recorder;
    this.recClock = h('span', { class: 'rec-clock', text: 'Starting…' });
    return h(
      'div',
      { class: 'toolbar recording', role: 'toolbar', 'aria-label': 'Screen recording' },
      h('span', { class: 'rec-dot', 'aria-hidden': 'true' }),
      this.recClock,
      h('button', { type: 'button', class: 'rec-stop', text: '■ Stop', title: 'Stop and go back to your feedback', onclick: () => recorder.stop() }),
      h('button', {
        type: 'button',
        text: 'Discard',
        onclick: () => {
          if (!window.confirm('Throw this recording away?')) return;
          void recorder.discard();
          this.finishRecording(null);
          this.toast('Recording discarded');
        },
      })
    );
  }

  private renderToolbar(): void {
    if (!this.mode) return;
    const count = this.unresolvedCount();
    const bar = this.recorder ? this.recordingToolbar() : h(
      'div',
      { class: 'toolbar', role: 'toolbar', 'aria-label': this.cfg.brand?.name ?? 'Feedback' },
      h('button', {
        type: 'button',
        class: 'grip',
        title: 'Drag to move · arrow keys snap to a corner',
        'aria-label': 'Move toolbar: drag, or use arrow keys to snap to a corner',
        text: '⠿',
        onpointerdown: (e: Event) => this.startDrag(e as PointerEvent),
        onkeydown: (e: Event) => this.onGripKey(e as KeyboardEvent),
      }),
      this.cfg.brand?.logo
        ? h('span', { class: 'brand', title: `${this.cfg.brand.name} · drag to move`, onpointerdown: (e: Event) => this.startDrag(e as PointerEvent) }, h('img', { src: this.cfg.brand.logo, alt: this.cfg.brand.name }))
        : h('span', { class: 'brand', title: 'Drag to move', text: this.cfg.brand?.label ?? 'Feedback', onpointerdown: (e: Event) => this.startDrag(e as PointerEvent) }),
      h('button', {
        type: 'button',
        class: this.pinMode ? 'icon-btn on' : 'icon-btn',
        'data-tip': 'Add feedback to an element',
        'aria-label': 'Add feedback to an element',
        onclick: () =>
          this.pinMode
            ? this.exitPinMode()
            : this.enterPinMode({ hint: 'Click any element to add feedback', done: (el, x, y) => this.openTypeMenu(el, x, y) }),
      }, deviceIcon('add')),
      h('button', { type: 'button', class: 'icon-btn', 'data-tip': 'Add a page note', 'aria-label': 'Add a note for the whole page', onclick: () => this.openComposer('comment', null, window.innerWidth / 2 - 170, 120) }, deviceIcon('note')),
      this.inPreview
        ? null
        : h(
            'span',
            { class: 'devices', role: 'group', 'aria-label': 'Preview at a device size' },
            ...DEVICES.map((d) =>
              d.id === 'desktop'
                ? // Desktop is the real page you're already on: shown as the active view.
                  h('button', { type: 'button', class: 'icon-btn', 'aria-pressed': 'true', 'data-tip': 'Desktop: the page as you see it now', 'aria-label': 'Desktop view (current)', onclick: () => this.closePreview() }, deviceIcon(d.id))
                : h('button', { type: 'button', class: 'icon-btn', 'aria-pressed': 'false', 'data-tip': `Preview as ${d.label} (${d.w}px)`, 'aria-label': `Preview as ${d.label}, ${d.w} pixels wide`, onclick: () => this.openPreview(d.id) }, deviceIcon(d.id))
            )
          ),
      h('button', { type: 'button', class: this.sidebar ? 'on' : '', onclick: () => (this.sidebar ? this.closeSidebar() : this.openSidebar()) }, h('span', { class: 'label', text: 'List' }), count ? h('span', { class: 'count', text: String(count) }) : null),
      h('button', { type: 'button', 'data-tip': 'Exit Feedback mode (Alt+Shift+F)', 'aria-label': 'Exit Feedback mode', text: '×', onclick: () => void this.setMode(false) })
    );
    const wasPlaced = !!this.toolbar;
    // Stays hidden while the device preview covers the page (re-renders must not unhide it).
    bar.hidden = !!this.previewEl;
    if (this.toolbar) this.toolbar.replaceWith(bar);
    else this.root.append(bar);
    this.toolbar = bar;
    // Re-renders replace the element; place it at once (no animation) so it never jumps.
    this.positionToolbar(false);
    if (!wasPlaced) this.positionChrome();
  }

  private updateToolbarCount(): void {
    this.renderToolbar();
  }

  // ---------------------------------------------------------------- device preview

  /**
   * Shows this page in a phone/tablet/laptop-sized same-origin iframe. The overlay runs inside
   * (see main.ts), so feedback filed there records that width and breakpoint. The parent's
   * pins and toolbar pause meanwhile, and refresh on close.
   */
  private openPreview(deviceId: string, rotated = false): void {
    if (deviceId === 'desktop') {
      this.closePreview(); // desktop is the page itself, never a frame
      return;
    }
    const device = DEVICES.find((d) => d.id === deviceId) ?? DEVICES[0];
    const w = rotated ? device.h : device.w;
    const hgt = rotated ? device.w : device.h;
    const label = `${device.label} ${w}×${hgt}`;

    this.closeCard();
    this.exitPinMode();
    const reuse = this.previewEl?.querySelector<HTMLIFrameElement>('iframe');
    const url = new URL(reuse?.contentWindow?.location.href ?? window.location.href);
    url.searchParams.delete('fbcol_item');
    url.searchParams.set('fbcol_preview', '1');

    this.previewEl?.remove();
    const frame = h('iframe', { name: PREVIEW_FRAME_NAME, title: `${label} preview`, 'data-device': label, src: url.toString() });
    frame.style.width = `${w}px`;
    frame.style.height = `${hgt}px`;
    const holder = h('div', { class: 'preview-device' }, frame);
    const stage = h('div', { class: 'preview-stage' }, holder);
    const blocked = h('div', { class: 'preview-blocked', hidden: true });

    const deviceButtons = DEVICES.map((d) =>
      h(
        'button',
        {
          type: 'button',
          class: 'icon-btn',
          'aria-pressed': String(d.id === device.id),
          title: d.id === 'desktop' ? 'Desktop: back to the page itself' : `${d.label} (${d.w}px)`,
          'aria-label': d.id === 'desktop' ? 'Desktop: close the preview' : `${d.label}, ${d.w} pixels wide`,
          onclick: () => (d.id === 'desktop' ? this.closePreview() : this.openPreview(d.id, d.id === device.id ? rotated : false)),
        },
        deviceIcon(d.id),
        h('span', { class: 'icon-label', text: d.label })
      )
    );
    const openWindow = () => {
      window.open(url.toString(), PREVIEW_FRAME_NAME, `width=${w},height=${hgt},resizable=yes,scrollbars=yes`);
    };
    const bar = h(
      'div',
      { class: 'preview-bar', role: 'toolbar', 'aria-label': 'Device preview' },
      h('strong', { text: 'Device preview' }),
      h('div', { class: 'preview-devices' }, ...deviceButtons),
      h('button', { type: 'button', title: 'Rotate', text: '⟲ Rotate', onclick: () => this.openPreview(device.id, !rotated) }),
      h('span', { class: 'preview-label', text: label }),
      h('span', { class: 'annotator-spacer' }),
      h('button', { type: 'button', text: 'Open in a window', onclick: openWindow }),
      h('button', { type: 'button', class: 'preview-close', text: 'Done', onclick: () => this.closePreview() })
    );
    const wrap = h('div', { class: 'preview', role: 'dialog', 'aria-label': `Device preview: ${label}` }, bar, stage, blocked);
    this.previewEl = wrap;
    this.root.append(wrap);

    // Scale the device to fit; the iframe keeps its true CSS width, so breakpoints are real.
    const fit = () => {
      const avail = stage.getBoundingClientRect();
      const scale = Math.min(1, (avail.width - 32) / w, (avail.height - 32) / hgt);
      holder.style.width = `${Math.round(w * scale)}px`;
      holder.style.height = `${Math.round(hgt * scale)}px`;
      frame.style.transform = `scale(${scale})`;
    };
    requestAnimationFrame(fit);

    // Hosts sending X-Frame-Options: DENY leave an empty frame; offer the window instead.
    frame.addEventListener('load', () => {
      let ok = false;
      try {
        ok = !!frame.contentDocument && frame.contentDocument.location.href !== 'about:blank';
      } catch {
        ok = false;
      }
      if (!ok) {
        blocked.hidden = false;
        blocked.replaceChildren(h('p', { text: 'This site can’t be shown in a frame here.' }), h('button', { type: 'button', class: 'btn primary', text: `Open ${label} in a window`, onclick: openWindow }));
      }
    });

    // Pause the page underneath.
    this.pinsLayer.hidden = true;
    if (this.toolbar) this.toolbar.hidden = true;
    this.closeSidebar();
  }

  private closePreview(): void {
    if (!this.previewEl) return;
    this.previewEl.remove();
    this.previewEl = null;
    this.pinsLayer.hidden = false;
    if (this.toolbar) this.toolbar.hidden = false;
    // Pick up anything filed inside the preview.
    this.loaded = false;
    void this.loadItems();
  }

  // ---------------------------------------------------------------- toolbar placement

  /**
   * Bottom edge of the WordPress admin bar in the viewport, or 0. Measured live: it is
   * 32px on desktop, 46px on small screens, and scrolls away on phones (position: absolute).
   */
  private topOffset(): number {
    const bar = document.getElementById('wpadminbar');
    if (!bar) return 0;
    const r = bar.getBoundingClientRect();
    return r.height > 0 ? Math.max(0, Math.round(r.bottom)) : 0;
  }

  /** Where the toolbar sits for a corner, never under the admin bar or an open sidebar. */
  private toolbarTarget(corner: Corner): { x: number; y: number } {
    const bar = this.toolbar;
    const w = bar?.offsetWidth ?? 0;
    const hgt = bar?.offsetHeight ?? 0;
    const top = this.topOffset();
    let x = corner.endsWith('l') ? EDGE : window.innerWidth - w - EDGE;
    if (corner.endsWith('r') && this.sidebar && window.innerWidth >= SIDEBAR_WIDTH + w + EDGE * 2) {
      x -= SIDEBAR_WIDTH;
    }
    const y = corner.startsWith('t') ? top + EDGE : window.innerHeight - hgt - EDGE;
    return { x: Math.max(0, x), y: Math.max(top, y) };
  }

  private nearestCorner(cx: number, cy: number): Corner {
    const top = this.topOffset();
    const v = cy < top + (window.innerHeight - top) / 2 ? 't' : 'b';
    const hz = cx < window.innerWidth / 2 ? 'l' : 'r';
    return `${v}${hz}` as Corner;
  }

  private positionToolbar(animate = false): void {
    const bar = this.toolbar;
    if (!bar || this.dragging) return;
    const { x, y } = this.toolbarTarget(this.corner);
    bar.classList.toggle('snapping', animate);
    bar.style.left = `${x}px`;
    bar.style.top = `${y}px`;
    bar.dataset.corner = this.corner;
  }

  /** Keeps every top-anchored overlay element below the admin bar and toasts clear of the toolbar. */
  private positionChrome(): void {
    this.root.style.setProperty('--top-offset', `${this.topOffset()}px`);
    const tbHeight = this.toolbar?.offsetHeight ?? 0;
    const toastBottom = this.toolbar && this.corner.startsWith('b') ? tbHeight + EDGE * 2 : 24;
    this.root.style.setProperty('--toast-bottom', `${toastBottom}px`);
    this.positionToolbar(false);
  }

  /** Saves preferences to the reviewer's account; the local copy keeps working if that fails. */
  private savePrefs(prefs: NonNullable<Config['prefs']>): void {
    this.cfg.prefs = { ...(this.cfg.prefs ?? {}), ...prefs };
    this.api.savePrefs(prefs).catch(() => {
      /* offline or no permission: this browser still remembers it */
    });
  }

  private setCorner(corner: Corner): void {
    this.corner = corner;
    try {
      if (!this.inPreview) window.localStorage.setItem(CORNER_KEY, corner);
    } catch {
      /* private window: the account copy below still remembers it */
    }
    if (!this.inPreview) this.savePrefs({ corner });
    this.positionToolbar(true);
    this.positionChrome();
  }

  /** Pointer drag from the grip or logo: follow the pointer, preview the snap corner, snap on release. */
  private startDrag(e: PointerEvent): void {
    const bar = this.toolbar;
    if (!bar || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const rect = bar.getBoundingClientRect();
    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;
    this.dragging = true;
    bar.classList.remove('snapping');
    bar.classList.add('dragging');

    this.ghost?.remove();
    this.ghost = h('div', { class: 'snap-ghost' });
    Object.assign(this.ghost.style, { width: `${rect.width}px`, height: `${rect.height}px` });
    this.root.append(this.ghost);

    const move = (ev: PointerEvent) => {
      const top = this.topOffset();
      const x = Math.min(Math.max(ev.clientX - dx, 0), window.innerWidth - rect.width);
      const y = Math.min(Math.max(ev.clientY - dy, top), window.innerHeight - rect.height);
      bar.style.left = `${x}px`;
      bar.style.top = `${y}px`;
      const target = this.nearestCorner(x + rect.width / 2, y + rect.height / 2);
      const spot = this.toolbarTarget(target);
      if (this.ghost) Object.assign(this.ghost.style, { left: `${spot.x}px`, top: `${spot.y}px` });
      bar.dataset.target = target;
    };
    const end = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move, true);
      window.removeEventListener('pointerup', end, true);
      window.removeEventListener('pointercancel', end, true);
      const r = bar.getBoundingClientRect();
      this.dragging = false;
      bar.classList.remove('dragging');
      this.ghost?.remove();
      this.ghost = null;
      delete bar.dataset.target;
      this.setCorner(ev.type === 'pointercancel' ? this.corner : this.nearestCorner(r.left + r.width / 2, r.top + r.height / 2));
    };
    window.addEventListener('pointermove', move, true);
    window.addEventListener('pointerup', end, true);
    window.addEventListener('pointercancel', end, true);
  }

  /** Arrow keys on the grip move the toolbar between corners. */
  private onGripKey(e: KeyboardEvent): void {
    const map: Record<string, (c: Corner) => Corner> = {
      ArrowLeft: (c) => `${c[0]}l` as Corner,
      ArrowRight: (c) => `${c[0]}r` as Corner,
      ArrowUp: (c) => `t${c[1]}` as Corner,
      ArrowDown: (c) => `b${c[1]}` as Corner,
    };
    const next = map[e.key];
    if (!next) return;
    e.preventDefault();
    this.setCorner(next(this.corner));
    (this.toolbar?.querySelector('.grip') as HTMLButtonElement | null)?.focus();
  }

  private openSidebar(): void {
    this.sidebar?.remove();
    const f = this.filters;
    const labels = this.cfg.labels;

    const pageTab = h(
      'button',
      {
        type: 'button',
        class: `scope-tab ${f.scope === 'page' ? 'active' : ''}`,
        'data-scope': 'page',
        'aria-selected': String(f.scope === 'page'),
        role: 'tab',
        onclick: () => this.setScope('page'),
      },
      h('span', { class: 'tab-label', text: 'This page' }),
      h('span', { class: 'tab-badge', text: String(this.states.size) })
    );
    const allTab = h(
      'button',
      {
        type: 'button',
        class: `scope-tab ${f.scope === 'all' ? 'active' : ''}`,
        'data-scope': 'all',
        'aria-selected': String(f.scope === 'all'),
        role: 'tab',
        onclick: () => this.setScope('all'),
      },
      h('span', { class: 'tab-label', text: 'All pages' }),
      h('span', { class: 'tab-badge', text: this.allItems ? String(this.allItems.length) : '' })
    );
    const scopeSwitch = h('div', { class: 'scope-switch', role: 'tablist', 'aria-label': 'Feedback scope' }, pageTab, allTab);

    const type = select('type', [['', 'All types'], ...TYPES.map((t): [string, string] => [t, labels.type[t]])], f.type, {
      onchange: () => {
        f.type = type.value as SidebarFilters['type'];
        void this.renderSidebarList();
      },
    });
    const status = select('status', [['unresolved', 'Unresolved'], ['', 'Any status'], ...(Object.keys(labels.status) as ItemStatus[]).map((k): [string, string] => [k, labels.status[k]])], f.status, {
      onchange: () => {
        f.status = status.value as SidebarFilters['status'];
        this.drawPins();
        void this.renderSidebarList();
      },
    });
    const rounds: Array<[string, string]> = [['0', 'All rounds']];
    for (let r = this.cfg.round; r >= 1; r--) rounds.push([String(r), r === this.cfg.round ? `Round ${r} (current)` : `Round ${r}`]);
    const round = select('round', rounds, String(f.round), {
      onchange: () => {
        f.round = Number(round.value);
        void this.renderSidebarList();
      },
    });
    const bp = select('bp', [['', 'All breakpoints'], ['mobile', 'Mobile'], ['tablet', 'Tablet'], ['desktop', 'Desktop']], f.bp, {
      onchange: () => {
        f.bp = bp.value as SidebarFilters['bp'];
        void this.renderSidebarList();
      },
    });
    const mine = h('input', {
      type: 'checkbox',
      onchange: () => {
        f.mine = mine.checked;
        void this.renderSidebarList();
      },
    });
    mine.checked = f.mine;

    this.sidebar = h(
      'div',
      { class: 'sidebar', role: 'complementary', 'aria-label': 'Feedback list' },
      h(
        'header',
        {},
        h('h2', {}, this.cfg.brand?.label ?? 'Feedback', h('button', { class: 'x', type: 'button', 'aria-label': 'Close list', text: '×', onclick: () => this.closeSidebar() })),
        scopeSwitch,
        h('div', { class: 'filters' }, type, status, round, bp, h('label', {}, mine, 'Assigned to me'))
      ),
      h('div', { class: 'list' })
    );
    this.root.append(this.sidebar);
    this.renderToolbar();
    void this.renderSidebarList();

    if (!this.allItems) {
      void this.api
        .listItems()
        .then(({ items }) => {
          this.allItems = items;
          this.updateScopeBadges();
          if (this.filters.scope === 'all' || items.length > this.states.size) {
            void this.renderSidebarList();
          }
        })
        .catch(() => {});
    }
  }

  private setScope(scope: 'page' | 'all'): void {
    if (this.filters.scope === scope) return;
    this.filters.scope = scope;
    if (this.sidebar) {
      const tabs = this.sidebar.querySelectorAll<HTMLButtonElement>('.scope-tab');
      tabs.forEach((tab) => {
        const isCurrent = tab.dataset.scope === scope;
        tab.classList.toggle('active', isCurrent);
        tab.setAttribute('aria-selected', String(isCurrent));
      });
    }
    void this.renderSidebarList();
  }

  private updateScopeBadges(): void {
    if (!this.sidebar) return;
    const pageBadge = this.sidebar.querySelector<HTMLElement>('.scope-tab[data-scope="page"] .tab-badge');
    const allBadge = this.sidebar.querySelector<HTMLElement>('.scope-tab[data-scope="all"] .tab-badge');
    if (pageBadge) pageBadge.textContent = String(this.states.size);
    if (allBadge) allBadge.textContent = this.allItems ? String(this.allItems.length) : '';
  }

  private closeSidebar(): void {
    this.sidebar?.remove();
    this.sidebar = null;
    this.renderToolbar();
  }

  private matchesStatus(item: Item): boolean {
    const f = this.filters.status;
    if (f === 'unresolved') return item.status !== 'resolved';
    return !f || item.status === f;
  }

  private matches(item: Item): boolean {
    const f = this.filters;
    if (f.type && item.type !== f.type) return false;
    if (f.round && item.round !== f.round) return false;
    if (f.bp && item.breakpoint !== f.bp) return false;
    if (!this.matchesStatus(item)) return false;
    if (f.mine && (!this.cfg.assignees.me || item.assignee_id !== this.cfg.assignees.me)) return false;
    return true;
  }

  private async renderSidebarList(): Promise<void> {
    const list = this.sidebar?.querySelector('.list');
    if (!list) return;

    const entry = (item: Item, onclick: () => void, extra?: HTMLElement | null) =>
      h(
        'button',
        { class: 'entry', type: 'button', onclick },
        h('span', { class: `num ${item.status === 'resolved' ? 'resolved' : item.type}`, text: `#${item.id}` }),
        h(
          'span',
          {},
          h('span', { class: 't', text: item.title }),
          h('span', { class: 's', text: `Round ${item.round} · ${this.cfg.labels.status[item.status]}${item.assignee_name ? ` · ${item.assignee_name}` : ''}${item.breakpoint ? ` · ${item.breakpoint}` : ''}` })
        ),
        extra ?? null
      );

    if (this.filters.scope === 'all') {
      if (!this.allItems) {
        list.replaceChildren(h('div', { class: 'empty', text: 'Loading…' }));
        try {
          this.allItems = (await this.api.listItems()).items;
          this.updateScopeBadges();
        } catch (err) {
          list.replaceChildren(h('div', { class: 'empty', text: (err as Error).message }));
          return;
        }
      }
      const groups = new Map<string, Item[]>();
      for (const item of this.allItems.filter((i) => this.matches(i))) {
        const g = groups.get(item.page_path) ?? [];
        g.push(item);
        groups.set(item.page_path, g);
      }
      const nodes: Node[] = [];
      for (const [path, items] of groups) {
        nodes.push(h('h3', { text: path === this.pagePath ? `${path} (this page)` : path }));
        for (const item of items) {
          nodes.push(
            entry(item, () => {
              if (item.page_path === this.pagePath) {
                this.focusItem(item.id);
              } else {
                const url = new URL(item.page_url, window.location.origin);
                url.searchParams.set('fbcol_item', String(item.id));
                window.location.href = url.toString();
              }
            })
          );
        }
      }
      list.replaceChildren(...(nodes.length ? nodes : [h('div', { class: 'empty', text: 'Nothing matches these filters.' })]));
      return;
    }

    const sections: Record<Placement, { title: string; nodes: HTMLElement[] }> = {
      pinned: { title: 'On this page', nodes: [] },
      note: { title: 'Page notes', nodes: [] },
      hidden: { title: 'At other breakpoints', nodes: [] },
      orphan: { title: 'Orphaned — element not found', nodes: [] },
    };
    for (const s of [...this.states.values()].sort((a, b) => a.item.id - b.item.id)) {
      if (!this.matches(s.item)) continue;
      const extra =
        s.placement === 'orphan'
          ? h('span', {
              class: 'btn link reanchor',
              role: 'button',
              text: 'Pin again',
              onclick: (e: Event) => {
                e.stopPropagation();
                this.reanchor(s.item.id);
              },
            })
          : null;
      sections[s.placement].nodes.push(entry(s.item, () => this.focusItem(s.item.id), extra));
    }
    const nodes: Node[] = [];
    for (const key of ['pinned', 'note', 'hidden', 'orphan'] as Placement[]) {
      const sec = sections[key];
      if (!sec.nodes.length) continue;
      const title = key === 'hidden' ? `${sec.nodes.length} at other breakpoints` : sec.title;
      nodes.push(h('h3', { text: title }), ...sec.nodes);
    }
    const totalAcrossSite = this.allItems ? this.allItems.length : 0;
    const otherCount = totalAcrossSite - this.states.size;
    if (nodes.length > 0 && otherCount > 0) {
      nodes.push(
        h(
          'div',
          { class: 'list-footer-prompt' },
          h(
            'button',
            {
              type: 'button',
              class: 'btn-view-all',
              onclick: () => this.setScope('all'),
            },
            `View ${otherCount} more on other pages (${totalAcrossSite} total) →`
          )
        )
      );
    }
    if (!nodes.length) {
      const emptyNodes: Node[] = [
        h('div', { class: 'empty', text: 'No feedback on this page yet. Right-click anything to add some.' }),
      ];
      if (totalAcrossSite > 0) {
        emptyNodes.push(
          h(
            'div',
            { class: 'list-empty-action' },
            h(
              'button',
              {
                type: 'button',
                class: 'btn-view-all',
                onclick: () => this.setScope('all'),
              },
              `View all ${totalAcrossSite} items on other pages →`
            )
          )
        );
      }
      list.replaceChildren(...emptyNodes);
      return;
    }
    list.replaceChildren(...nodes);
  }

  private focusItem(id: number): void {
    const s = this.states.get(id);
    if (!s) return;
    if (s.placement === 'pinned' && s.el) {
      if (!this.matchesStatus(s.item)) {
        this.filters.status = '';
        const sel = this.sidebar?.querySelector<HTMLSelectElement>('select[name="status"]');
        if (sel) sel.value = '';
        this.drawPins();
        void this.renderSidebarList();
      }
      s.el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      window.setTimeout(() => {
        this.positionPins();
        s.pin?.classList.remove('pulse');
        void s.pin?.offsetWidth;
        s.pin?.classList.add('pulse');
        void this.openPopover(id);
      }, 450);
    } else {
      void this.openPopover(id, { x: window.innerWidth - 720, y: 80 });
    }
  }

  // ---------------------------------------------------------------- feedback

  private toast(message: string, isError = false): void {
    const t = h('div', { class: `toast${isError ? ' err' : ''}`, role: 'status', text: message });
    this.root.append(t);
    window.setTimeout(() => t.remove(), isError ? 5000 : 2200);
  }

  private showBanner(message: string): void {
    this.bannerEl?.remove();
    this.bannerEl = h('div', { class: 'banner', role: 'status' }, h('span', { text: message }), h('button', { type: 'button', text: 'Dismiss', onclick: () => { this.bannerEl?.remove(); this.bannerEl = null; } }));
    this.root.append(this.bannerEl);
  }
}
