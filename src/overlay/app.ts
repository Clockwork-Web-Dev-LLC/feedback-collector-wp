import css from './styles.css' with { type: 'text' };
import { OVERLAY_HOST_ID, createAnchor, isRenderable, resolveAnchor } from './anchor';
import type { Anchor } from './anchor';
import { Api } from './api';
import { breakpoint, captureContext, currentPagePath, currentQuery } from './capture';
import { h, relativeTime, select } from './dom';
import type { Config, Item, ItemStatus, ItemType, Priority } from './types';

const TYPES: ItemType[] = ['bug', 'tweak', 'change', 'comment'];
const STORAGE_KEY = 'fbc:mode';

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
  private showResolved = false;
  private pinMode: PinModeRequest | null = null;
  private states = new Map<number, PinState>();
  private allItems: Item[] | null = null;
  private filters: SidebarFilters = { scope: 'page', type: '', status: 'unresolved', mine: false };
  private pagePath: string;
  private framePending = false;
  private refreshTimer = 0;
  private lastWidth = window.innerWidth;
  private mutationObserver: MutationObserver | null = null;
  private loaded = false;

  constructor(private cfg: Config) {
    this.api = new Api(cfg);
    this.pagePath = cfg.pagePath ?? currentPagePath(cfg.homePath);
  }

  init(): void {
    this.mount();
    this.bindGlobalEvents();
    this.bindAdminBar();

    let stored = false;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      stored = false;
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
    document.addEventListener('contextmenu', (e) => this.onContextMenu(e), true);
    document.addEventListener('mousemove', (e) => this.onMouseMove(e), { capture: true, passive: true });
    for (const type of ['pointerdown', 'mousedown', 'mouseup', 'click']) {
      document.addEventListener(type, (e) => this.onPinModeEvent(e as MouseEvent), true);
    }
    document.addEventListener('mousedown', (e) => this.onOutsideMouseDown(e), false);
    document.addEventListener('keydown', (e) => this.onKeyDown(e), true);
    window.addEventListener('scroll', () => this.schedulePosition(), { passive: true, capture: true });
    window.addEventListener('resize', () => {
      const widthChanged = window.innerWidth !== this.lastWidth;
      this.lastWidth = window.innerWidth;
      if (widthChanged) this.scheduleRefresh(80);
      else this.schedulePosition();
    });
  }

  private bindAdminBar(): void {
    const link = document.querySelector<HTMLAnchorElement>('#wp-admin-bar-fbc-toggle > a');
    link?.addEventListener('click', (e) => {
      e.preventDefault();
      void this.setMode(!this.mode);
    });
  }

  // ---------------------------------------------------------------- mode

  async setMode(on: boolean): Promise<void> {
    this.mode = on;
    try {
      window.localStorage.setItem(STORAGE_KEY, on ? '1' : '0');
    } catch {
      /* storage unavailable: mode simply isn't remembered */
    }
    document.querySelector('#wp-admin-bar-fbc-toggle')?.classList.toggle('fbc-on', on);

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
    if (url.searchParams.has('fbc_item')) {
      url.searchParams.delete('fbc_item');
      window.history.replaceState(window.history.state, '', url.toString());
    }
  }

  // ---------------------------------------------------------------- data

  private async loadItems(): Promise<void> {
    try {
      const { items } = await this.api.listItems(this.pagePath);
      this.states.clear();
      for (const item of items) this.states.set(item.id, { item, el: null, placement: 'orphan', pin: null });
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
  }

  private remove(id: number): void {
    const s = this.states.get(id);
    s?.pin?.remove();
    this.states.delete(id);
    if (this.allItems) this.allItems = this.allItems.filter((x) => x.id !== id);
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
      const show = s.placement === 'pinned' && (this.showResolved || s.item.status !== 'resolved');
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
      s.pin.className = `pin ${s.item.type}${resolved ? ' resolved' : ''}`;
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
    if (!this.mode || e.altKey || this.inOverlay(e)) return;
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
    if (this.card && !this.inOverlay(e)) this.closeCard();
  }

  private onMouseMove(e: MouseEvent): void {
    if (!this.mode || (this.card && !this.pinMode) || this.inOverlay(e)) {
      if (!this.pinMode) this.hideOutline();
      return;
    }
    const target = this.eventTarget(e);
    if (!target || target === document.documentElement || target === document.body) {
      this.hideOutline();
      return;
    }
    const r = target.getBoundingClientRect();
    Object.assign(this.outline.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    const id = target.id ? `#${target.id}` : '';
    this.outlineTag.textContent = `${target.tagName.toLowerCase()}${id}`;
    this.outline.classList.add('on');
  }

  private onKeyDown(e: KeyboardEvent): void {
    const origin = e.composedPath()[0];
    const typing =
      origin instanceof HTMLElement && (origin.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(origin.tagName));

    if (e.altKey && e.shiftKey && e.code === 'KeyF' && !typing) {
      e.preventDefault();
      void this.setMode(!this.mode);
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

  private hideOutline(): void {
    this.outline.classList.remove('on');
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

  /** createAnchor throws for overlay, detached or shadow-DOM elements; never let that break the click. */
  private safeAnchor(el: Element, x: number, y: number): Anchor | null {
    try {
      return createAnchor(el, x, y);
    } catch {
      this.toast("Can't pin to that element. Try its container, or add a page note.", true);
      return null;
    }
  }

  private closeCard(): void {
    this.card?.remove();
    this.card = null;
  }

  private showCard(card: HTMLElement, x: number, y: number): void {
    this.closeCard();
    this.hideOutline();
    this.card = card;
    card.style.left = '0px';
    card.style.top = '0px';
    card.style.visibility = 'hidden';
    this.root.append(card);
    const w = card.offsetWidth;
    const hgt = card.offsetHeight;
    const left = Math.max(12, Math.min(x + 8, window.innerWidth - w - 12));
    const top = Math.max(12, Math.min(y + 8, window.innerHeight - hgt - 12));
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
    card.style.visibility = '';
  }

  private openTypeMenu(el: Element, x: number, y: number): void {
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
    const assignee = select('assignee_id', [['0', 'Unassigned'], ...this.cfg.reviewers.map((r): [string, string] => [String(r.id), r.name])], '0');
    const error = h('div', { class: 'error', role: 'alert' });
    const submit = h('button', { class: 'btn primary', type: 'submit', text: 'Add' });

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
      h('label', { class: 'field' }, h('span', { text: 'Assignee' }), assignee),
      h('div', { class: 'actions' }, h('button', { class: 'btn link', type: 'button', text: 'Cancel', onclick: () => this.closeCard() }), submit)
    );

    const save = async () => {
      if (!title.value.trim()) {
        error.textContent = 'Add a short title.';
        title.focus();
        return;
      }
      submit.disabled = true;
      try {
        const item = await this.api.createItem({
          type: typeSelect.value as ItemType,
          title: title.value.trim(),
          description: desc.value,
          priority: priority.value as Priority,
          assignee_id: Number(assignee.value),
          page_path: this.pagePath,
          page_query: currentQuery(),
          page_title: document.title,
          anchor,
          context: captureContext(this.cfg),
        });
        this.closeCard();
        this.upsert(item);
        const s = this.states.get(item.id);
        if (s && el) s.el = el;
        this.refresh();
        this.toast(`Added #${item.id}`);
      } catch (err) {
        error.textContent = (err as Error).message;
        submit.disabled = false;
      }
    };

    this.showCard(form, x, y);
    title.focus();
  }

  private async openPopover(id: number, at?: { x: number; y: number }): Promise<void> {
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
    const assignee = select('assignee_id', [['0', 'Unassigned'], ...this.cfg.reviewers.map((r): [string, string] => [String(r.id), r.name])], String(item.assignee_id), {
      onchange: () => void save({ assignee_id: Number(assignee.value) }),
    });
    const priority = select('priority', (Object.keys(labels.priority) as Priority[]).map((k) => [k, labels.priority[k]]), item.priority, {
      onchange: () => void save({ priority: priority.value as Priority }),
    });

    const reply = h('textarea', { placeholder: 'Reply…', rows: 2 });
    const thread = h(
      'ul',
      { class: 'thread' },
      ...(item.comments ?? []).map((c) =>
        h('li', { class: c.kind }, h('span', { class: 'who', text: c.user_name }), h('span', { class: 'when', text: relativeTime(c.created_at) }), h('div', { class: 'body', text: c.body }))
      )
    );

    const current = breakpoint();
    const mismatch =
      item.breakpoint && item.breakpoint !== current
        ? h('div', { class: 'notice', text: `Logged at ${item.breakpoint} (${item.context?.viewport_w ?? '?'}px). You are on ${current} (${window.innerWidth}px).` })
        : null;
    const orphan = s?.placement === 'orphan' ? h('div', { class: 'notice', text: 'The element this was pinned to can’t be found on the page anymore. Re-anchor it.' }) : null;

    const card = h(
      'div',
      { class: 'card popover', role: 'dialog', 'aria-label': `Feedback #${item.id}` },
      h('div', { class: 'head' }, h('span', { class: 'chip' }, h('span', { class: `dot ${item.type}` }), `${labels.type[item.type]} #${item.id}`), h('button', { class: 'x', type: 'button', 'aria-label': 'Close', text: '×', onclick: () => this.closeCard() })),
      h('div', { class: 't', style: 'font-weight:700;font-size:15px;margin-bottom:4px', text: item.title }),
      h('div', { class: 'meta', text: `${item.reporter_name} · ${relativeTime(item.created_at)}${item.breakpoint ? ` · ${item.breakpoint}` : ''}` }),
      item.tw_task_url
        ? h('div', { class: 'meta' }, h('a', { href: item.tw_task_url, target: '_blank', rel: 'noopener', text: `Teamwork task #${item.tw_task_id} ↗` }), item.status === 'resolved' ? ' · completed' : ' · status syncs from Teamwork')
        : null,
      mismatch,
      orphan,
      item.description ? h('p', { class: 'desc', text: item.description }) : null,
      h('div', { class: 'row' }, h('label', { class: 'field' }, h('span', { text: 'Status' }), status), h('label', { class: 'field' }, h('span', { text: 'Priority' }), priority)),
      h('label', { class: 'field' }, h('span', { text: 'Assignee' }), assignee),
      thread,
      h('label', { class: 'field' }, reply),
      h(
        'div',
        { class: 'actions' },
        item.anchor || s?.placement === 'note'
          ? h('button', { class: 'btn link left', type: 'button', text: 'Re-anchor', onclick: () => this.reanchor(item.id) })
          : null,
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
          this.toast(`Re-anchored #${id}`);
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

  private renderToolbar(): void {
    if (!this.mode) return;
    const count = this.unresolvedCount();
    const bar = h(
      'div',
      { class: 'toolbar', role: 'toolbar', 'aria-label': 'Feedback' },
      h('span', { class: 'brand', text: 'Feedback' }),
      h('button', {
        type: 'button',
        class: this.pinMode ? 'on' : '',
        title: 'Click an element to pin feedback (or right-click anywhere)',
        text: '+ Add',
        onclick: () =>
          this.pinMode
            ? this.exitPinMode()
            : this.enterPinMode({ hint: 'Click any element to add feedback', done: (el, x, y) => this.openTypeMenu(el, x, y) }),
      }),
      h('button', { type: 'button', text: 'Page note', onclick: () => this.openComposer('comment', null, window.innerWidth / 2 - 170, 120) }),
      h('button', { type: 'button', class: this.sidebar ? 'on' : '', onclick: () => (this.sidebar ? this.closeSidebar() : this.openSidebar()) }, h('span', { class: 'label', text: 'List' }), count ? h('span', { class: 'count', text: String(count) }) : null),
      h('button', {
        type: 'button',
        class: this.showResolved ? 'on' : '',
        title: 'Show resolved pins',
        text: '✓ Resolved',
        onclick: () => {
          this.showResolved = !this.showResolved;
          this.drawPins();
          this.renderToolbar();
        },
      }),
      h('button', { type: 'button', title: 'Exit Feedback mode (Alt+Shift+F)', 'aria-label': 'Exit Feedback mode', text: '×', onclick: () => void this.setMode(false) })
    );
    if (this.toolbar) this.toolbar.replaceWith(bar);
    else this.root.append(bar);
    this.toolbar = bar;
  }

  private updateToolbarCount(): void {
    this.renderToolbar();
  }

  private openSidebar(): void {
    this.sidebar?.remove();
    const f = this.filters;
    const labels = this.cfg.labels;
    const scope = select('scope', [['page', 'This page'], ['all', 'All pages']], f.scope, {
      onchange: () => {
        f.scope = scope.value as SidebarFilters['scope'];
        void this.renderSidebarList();
      },
    });
    const type = select('type', [['', 'All types'], ...TYPES.map((t): [string, string] => [t, labels.type[t]])], f.type, {
      onchange: () => {
        f.type = type.value as SidebarFilters['type'];
        void this.renderSidebarList();
      },
    });
    const status = select('status', [['unresolved', 'Unresolved'], ['', 'Any status'], ...(Object.keys(labels.status) as ItemStatus[]).map((k): [string, string] => [k, labels.status[k]])], f.status, {
      onchange: () => {
        f.status = status.value as SidebarFilters['status'];
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
        h('h2', {}, 'Feedback', h('button', { class: 'x', type: 'button', 'aria-label': 'Close list', text: '×', onclick: () => this.closeSidebar() })),
        h('div', { class: 'filters' }, scope, type, status, h('span'), h('label', {}, mine, 'Assigned to me'))
      ),
      h('div', { class: 'list' })
    );
    this.root.append(this.sidebar);
    this.renderToolbar();
    void this.renderSidebarList();
  }

  private closeSidebar(): void {
    this.sidebar?.remove();
    this.sidebar = null;
    this.renderToolbar();
  }

  private matches(item: Item): boolean {
    const f = this.filters;
    if (f.type && item.type !== f.type) return false;
    if (f.status === 'unresolved' && item.status === 'resolved') return false;
    if (f.status && f.status !== 'unresolved' && item.status !== f.status) return false;
    if (f.mine && item.assignee_id !== this.cfg.user.id) return false;
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
          h('span', { class: 's', text: `${this.cfg.labels.status[item.status]}${item.assignee_name ? ` · ${item.assignee_name}` : ''}${item.breakpoint ? ` · ${item.breakpoint}` : ''}` })
        ),
        extra ?? null
      );

    if (this.filters.scope === 'all') {
      if (!this.allItems) {
        list.replaceChildren(h('div', { class: 'empty', text: 'Loading…' }));
        try {
          this.allItems = (await this.api.listItems()).items;
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
                url.searchParams.set('fbc_item', String(item.id));
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
              text: 'Re-anchor',
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
    list.replaceChildren(...(nodes.length ? nodes : [h('div', { class: 'empty', text: 'No feedback on this page yet. Right-click anything to add some.' })]));
  }

  private focusItem(id: number): void {
    const s = this.states.get(id);
    if (!s) return;
    if (s.placement === 'pinned' && s.el) {
      if (s.item.status === 'resolved' && !this.showResolved) {
        this.showResolved = true;
        this.drawPins();
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
