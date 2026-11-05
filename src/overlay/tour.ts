import { h } from './dom';

/** One stop on the walkthrough. Without a target the card sits in the middle of the screen. */
export interface TourStep {
  /** A heading above the step count, e.g. "Feedback mode activated". */
  kicker?: string;
  title: string;
  body: string;
  /** The element to spotlight; skipped when it returns null (e.g. hidden on this screen). */
  target?: () => Element | null;
  /** Runs when the step shows (e.g. opens the form it describes); leave() undoes it. */
  enter?: () => void;
  leave?: () => void;
  /** With enter(): the step is kept even though its element only exists once entered. */
  opens?: boolean;
}

const SEEN_KEY = 'fbc:tour';
/** Bump when the steps change enough that everyone should see them again. */
export const TOUR_VERSION = '1';
const PAD = 6;
const GAP = 12;
const EDGE = 16;

export function tourSeen(): boolean {
  try {
    return window.localStorage.getItem(SEEN_KEY) === TOUR_VERSION;
  } catch {
    return false; // storage blocked: show it (finishing it still closes it for this page view)
  }
}

export function markTourSeen(): void {
  try {
    window.localStorage.setItem(SEEN_KEY, TOUR_VERSION);
  } catch {
    /* storage blocked: the tour may show again next visit */
  }
}

/**
 * A coach-mark walkthrough inside the overlay's shadow root: a dimmed screen with a cut-out
 * around the current element and a small card that explains it. Back / Next / Skip, Esc to
 * close, arrow keys to step. Steps whose element isn't on screen are skipped.
 */
export class Tour {
  private layer: HTMLDivElement | null = null;
  private spot!: HTMLDivElement;
  private card!: HTMLDivElement;
  private index = 0;
  private steps: TourStep[] = [];
  private readonly onKey = (e: KeyboardEvent) => this.key(e);
  private readonly onResize = () => this.place();

  constructor(
    private mount: HTMLElement,
    private onDone: () => void = () => {}
  ) {}

  get open(): boolean {
    return !!this.layer;
  }

  start(steps: TourStep[]): void {
    this.close(false);
    this.steps = steps.filter((s) => s.opens || !s.target || s.target());
    if (!this.steps.length) return;
    this.index = 0;
    this.spot = h('div', { class: 'tour-spot' }) as HTMLDivElement;
    this.card = h('div', { class: 'tour-card', role: 'dialog', 'aria-modal': 'true', 'aria-live': 'polite' }) as HTMLDivElement;
    this.layer = h('div', { class: 'tour' }, h('div', { class: 'tour-blocker' }), this.spot, this.card) as HTMLDivElement;
    this.mount.append(this.layer);
    window.addEventListener('keydown', this.onKey, true);
    window.addEventListener('resize', this.onResize);
    this.render();
  }

  /** Ends the tour. finished: true when the user reached the end or skipped (both count as seen). */
  close(finished = true): void {
    if (!this.layer) return;
    this.steps[this.index]?.leave?.();
    this.layer.remove();
    this.layer = null;
    window.removeEventListener('keydown', this.onKey, true);
    window.removeEventListener('resize', this.onResize);
    if (finished) this.onDone();
  }

  private go(delta: number): void {
    const next = this.index + delta;
    if (next < 0) return;
    if (next >= this.steps.length) {
      this.close(true);
      return;
    }
    this.steps[this.index]?.leave?.();
    this.index = next;
    this.render();
  }

  private key(e: KeyboardEvent): void {
    if (!this.layer) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this.close(true);
    } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      this.go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      this.go(-1);
    }
  }

  private render(): void {
    const step = this.steps[this.index];
    step.enter?.();
    const last = this.index === this.steps.length - 1;
    const next = h('button', { type: 'button', class: 'btn primary tour-next', text: last ? 'Got it' : 'Next', onclick: () => this.go(1) });
    this.card.setAttribute('aria-label', step.title);
    this.card.replaceChildren(
      ...(step.kicker ? [h('div', { class: 'tour-kicker', text: step.kicker })] : []),
      h('div', { class: 'tour-count', text: `${this.index + 1} of ${this.steps.length}` }),
      h('div', { class: 'tour-title', text: step.title }),
      h('p', { class: 'tour-body', text: step.body }),
      h(
        'div',
        { class: 'tour-actions' },
        last ? null : h('button', { type: 'button', class: 'btn link tour-skip', text: 'Skip tour', onclick: () => this.close(true) }),
        h('span', { class: 'tour-spacer' }),
        this.index > 0 ? h('button', { type: 'button', class: 'btn tour-back', text: 'Back', onclick: () => this.go(-1) }) : null,
        next
      )
    );
    this.place();
    next.focus();
    // What enter() opened lays out over the next frames (and may animate in): place again.
    if (step.enter) {
      window.requestAnimationFrame(() => this.place());
      window.setTimeout(() => this.place(), 260);
    }
  }

  /** Puts the cut-out on the step's element and the card beside it, kept on screen. */
  private place(): void {
    if (!this.layer) return;
    const step = this.steps[this.index];
    const el = step.target?.() ?? null;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cw = Math.min(340, vw - EDGE * 2);
    this.card.style.width = `${cw}px`;
    if (!el) {
      this.spot.hidden = true;
      this.layer.classList.add('dim');
      const ch = this.card.offsetHeight;
      this.card.style.left = `${Math.round((vw - cw) / 2)}px`;
      this.card.style.top = `${Math.round(Math.max(EDGE, (vh - ch) / 2))}px`;
      return;
    }
    this.layer.classList.remove('dim');
    const r = el.getBoundingClientRect();
    this.spot.hidden = false;
    Object.assign(this.spot.style, {
      left: `${r.left - PAD}px`,
      top: `${r.top - PAD}px`,
      width: `${r.width + PAD * 2}px`,
      height: `${r.height + PAD * 2}px`,
    });
    const ch = this.card.offsetHeight;
    const clampX = (x: number) => Math.min(Math.max(EDGE, x), vw - cw - EDGE);
    const clampY = (y: number) => Math.min(Math.max(EDGE, y), vh - ch - EDGE);
    const centerX = clampX(r.left + r.width / 2 - cw / 2);
    const centerY = clampY(r.top + r.height / 2 - ch / 2);
    // Prefer above, then below, then beside (tall things like the form or the list), then
    // overlapping the bottom of the screen as a last resort (small phones).
    let left = centerX;
    let top: number;
    if (r.top - PAD - GAP - ch >= EDGE) {
      top = r.top - PAD - GAP - ch;
    } else if (r.bottom + PAD + GAP + ch <= vh - EDGE) {
      top = r.bottom + PAD + GAP;
    } else if (r.left - PAD - GAP - cw >= EDGE) {
      left = r.left - PAD - GAP - cw;
      top = centerY;
    } else if (r.right + PAD + GAP + cw <= vw - EDGE) {
      left = r.right + PAD + GAP;
      top = centerY;
    } else {
      top = vh - ch - EDGE;
    }
    this.card.style.left = `${Math.round(left)}px`;
    this.card.style.top = `${Math.round(top)}px`;
  }
}
