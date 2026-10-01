// Boot test for the overlay controller under happy-dom. Proves the bundle wires up
// and the right-click → menu → composer → POST flow runs. It cannot prove layout
// (happy-dom has no real rects), so pin *positions* are covered by the browser pass.
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { App } from '../src/overlay/app';
import { OVERLAY_HOST_ID } from '../src/overlay/anchor';
import type { Config, Item } from '../src/overlay/types';

const cfg = (): Config => ({
  restUrl: 'http://localhost:8899/index.php?rest_route=/feedback-collector/v1',
  nonce: 'abc123',
  homePath: '/',
  pagePath: '/services/',
  adminUrl: 'http://localhost:8899/wp-admin/admin.php?page=feedback-collector',
  user: { id: 1, name: 'Admin', isAdmin: true },
  assignees: { source: 'wordpress', people: [{ id: 1, name: 'Admin' }], error: '', me: 1 },
  labels: {
    type: { bug: 'Bug', tweak: 'Tweak', change: 'Change Request', comment: 'Comment' },
    status: { open: 'Open', in_progress: 'In Progress', ready_for_review: 'Ready for Review', resolved: 'Resolved' },
    priority: { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' },
  },
  page: { postId: 7, postType: 'page', theme: 'blocksy' },
  openItem: 0,
  round: 2,
});

interface Call {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: unknown;
}
let calls: Call[] = [];
let serverItems: Item[] = [];

function makeItem(over: Partial<Item>): Item {
  return {
    id: 1, type: 'bug', status: 'open', priority: 'medium', title: 't', description: '', page_path: '/services/', page_query: '',
    page_title: '', page_url: 'http://localhost:8899/services/', anchor: null, context: null, breakpoint: 'desktop', round: 1, reporter_id: 1,
    reporter_name: 'Admin', assignee_id: 0, assignee_name: '', tw_task_id: 0, tw_task_url: '', tw_sync_state: '', created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(), can_delete: true, ...over,
  };
}

const shadow = () => document.getElementById(OVERLAY_HOST_ID)?.shadowRoot ?? null;
const tick = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => {
  document.getElementById('wpadminbar')?.remove();
  document.body.innerHTML = '<main><section><h2>Services</h2><a id="cta" href="/contact/">Book a demo</a></section></main>';
  try { window.localStorage.clear(); } catch { /* ignore */ }
  calls = [];
  serverItems = [];
  // Give the CTA a real box so isRenderable() and pin placement work.
  const cta = document.getElementById('cta') as HTMLElement;
  cta.getBoundingClientRect = () => ({ x: 100, y: 200, left: 100, top: 200, right: 260, bottom: 240, width: 160, height: 40, toJSON: () => ({}) }) as DOMRect;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? 'GET';
    const headers = (init?.headers ?? {}) as Record<string, string>;
    const raw = init?.body;
    const body = raw instanceof FormData ? { form: true, data: JSON.parse(String(raw.get('data'))), file: raw.get('screenshot') } : raw ? JSON.parse(String(raw)) : undefined;
    calls.push({ method, url, headers, body });
    if (method === 'GET' && url.includes('/items&') ) {
      return new Response(JSON.stringify({ items: serverItems, total: serverItems.length }), { status: 200 });
    }
    if (method === 'POST' && url.endsWith('/items')) {
      const b = body as Partial<Item>;
      const item = makeItem({ id: 42, type: b.type, title: b.title, anchor: b.anchor ?? null, page_path: b.page_path });
      return new Response(JSON.stringify(item), { status: 201 });
    }
    return new Response(JSON.stringify({ message: 'nope' }), { status: 404 });
  }) as typeof fetch;
});

afterEach(() => {
  document.getElementById(OVERLAY_HOST_ID)?.remove();
});

describe('overlay boot', () => {
  it('mounts a shadow host and stays inert until Feedback mode is on', async () => {
    const app = new App(cfg());
    app.init();
    expect(shadow()).not.toBeNull();
    expect(shadow()?.querySelector('.toolbar')).toBeNull();

    const ev = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 150, clientY: 210 });
    document.getElementById('cta')?.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(false); // native menu untouched when mode is off
    expect(shadow()?.querySelector('.menu')).toBeNull();
  });

  it('right-click → type menu → composer → POST with anchor, page key and context', async () => {
    const app = new App(cfg());
    app.init();
    await app.setMode(true);
    expect(shadow()?.querySelector('.toolbar')).not.toBeNull();
    const list = calls.find((c) => c.method === 'GET');
    expect(list?.url).toContain('page_path=%2Fservices%2F');
    expect(list?.headers['X-WP-Nonce']).toBe('abc123');

    const ev = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 150, clientY: 210 });
    document.getElementById('cta')?.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    const menu = shadow()?.querySelector('.menu');
    expect(menu).not.toBeNull();
    const labels = [...(menu?.querySelectorAll('button') ?? [])].map((b) => b.textContent ?? '');
    expect(labels.slice(0, 4).map((l) => l.replace(/\d$/, ''))).toEqual(['Bug', 'Tweak', 'Change Request', 'Comment']);

    (menu?.querySelectorAll('button')[1] as HTMLButtonElement).click(); // Tweak
    const form = shadow()?.querySelector('form.composer') as HTMLFormElement;
    expect(form).not.toBeNull();
    const title = form.querySelector('input[name="title"]') as HTMLInputElement;
    title.value = 'CTA is misaligned';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await tick();
    await tick();

    const post = calls.find((c) => c.method === 'POST');
    expect(post).toBeDefined();
    const body = post?.body as Record<string, unknown>;
    expect(body.type).toBe('tweak');
    expect(body.title).toBe('CTA is misaligned');
    expect(body.page_path).toBe('/services/');
    expect((body.anchor as { id: string; tag: string }).id).toBe('cta');
    expect((body.anchor as { tag: string }).tag).toBe('a');
    const ctx = body.context as Record<string, unknown>;
    expect(ctx.post_id).toBe(7);
    expect(['mobile', 'tablet', 'desktop']).toContain(String(ctx.breakpoint));
    expect(shadow()?.querySelector('form.composer')).toBeNull(); // closed on success
    const pin = shadow()?.querySelector('.pin');
    expect(pin?.textContent).toBe('42');
  });

  it('empty title is blocked client-side (no POST)', async () => {
    const app = new App(cfg());
    app.init();
    await app.setMode(true);
    document.getElementById('cta')?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 150, clientY: 210 }));
    (shadow()?.querySelector('.menu button') as HTMLButtonElement).click();
    const form = shadow()?.querySelector('form.composer') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await tick();
    expect(calls.some((c) => c.method === 'POST')).toBe(false);
    expect(form.querySelector('.error')?.textContent).toContain('title');
  });

  it('Alt+right-click passes through to the native menu', async () => {
    const app = new App(cfg());
    app.init();
    await app.setMode(true);
    const ev = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, altKey: true });
    document.getElementById('cta')?.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(false);
    expect(shadow()?.querySelector('.menu')).toBeNull();
  });

  it('existing items render pins; an unresolvable anchor is orphaned, not pinned', async () => {
    serverItems = [
      makeItem({ id: 5, type: 'change', anchor: { id: 'cta', selector: '#cta', xpath: '', text: 'Book a demo', tag: 'a', offsetX: 0.5, offsetY: 0.5, docX: 0, docY: 0 } }),
      makeItem({ id: 6, anchor: { id: 'gone', selector: '#gone', xpath: '/html/body/div[9]', text: 'Missing', tag: 'button', offsetX: 0.5, offsetY: 0.5, docX: 0, docY: 0 } }),
    ];
    const app = new App(cfg());
    app.init();
    await app.setMode(true);
    const pins = [...(shadow()?.querySelectorAll('.pin') ?? [])].map((p) => p.textContent);
    expect(pins).toEqual(['5']);
    const pin = shadow()?.querySelector('.pin') as HTMLElement;
    expect(pin.style.transform).toBe('translate(180px, 220px)'); // left + 0.5*width, top + 0.5*height of the stubbed rect
  });

  it('Alt+Shift+F toggles mode but not while typing in an input', async () => {
    document.body.insertAdjacentHTML('beforeend', '<input id="q" />');
    const app = new App(cfg());
    app.init();
    const input = document.getElementById('q') as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, altKey: true, shiftKey: true, code: 'KeyF', key: 'Ï' }));
    await tick();
    expect(shadow()?.querySelector('.toolbar')).toBeNull();
    document.body.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, altKey: true, shiftKey: true, code: 'KeyF', key: 'Ï' }));
    await tick();
    expect(shadow()?.querySelector('.toolbar')).not.toBeNull();
  });
});

describe('toolbar placement', () => {
  const adminBar = (bottom: number) => {
    const bar = document.createElement('div');
    bar.id = 'wpadminbar';
    bar.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, right: 1024, bottom, width: 1024, height: bottom, toJSON: () => ({}) }) as DOMRect;
    document.body.prepend(bar);
    return bar;
  };
  const toolbar = () => shadow()?.querySelector('.toolbar') as HTMLElement;
  const px = (v: string) => Number.parseFloat(v);

  it('defaults to the bottom-right corner', async () => {
    const app = new App(cfg());
    app.init();
    await app.setMode(true);
    expect(toolbar().dataset.corner).toBe('br');
    expect(px(toolbar().style.top)).toBe(window.innerHeight - toolbar().offsetHeight - 16);
  });

  it('drag snaps to the nearest corner, persists, and never sits under the admin bar', async () => {
    adminBar(32);
    const app = new App(cfg());
    app.init();
    await app.setMode(true);
    const grip = toolbar().querySelector('.grip') as HTMLElement;
    grip.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0, clientX: 900, clientY: 700 }));
    expect(shadow()?.querySelector('.snap-ghost')).not.toBeNull();
    window.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 20, clientY: 5 }));
    expect(px(toolbar().style.top)).toBeGreaterThanOrEqual(32); // clamped below the admin bar mid-drag
    window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: 20, clientY: 5 }));
    expect(toolbar().dataset.corner).toBe('tl');
    expect(px(toolbar().style.top)).toBe(32 + 16);
    expect(px(toolbar().style.left)).toBe(16);
    expect(shadow()?.querySelector('.snap-ghost')).toBeNull();
    expect(window.localStorage.getItem('fbc:corner')).toBe('tl');
  });

  it('restores the saved corner on the next page load', async () => {
    window.localStorage.setItem('fbc:corner', 'tr');
    adminBar(46); // the taller mobile admin bar
    const app = new App(cfg());
    app.init();
    await app.setMode(true);
    expect(toolbar().dataset.corner).toBe('tr');
    expect(px(toolbar().style.top)).toBe(46 + 16);
  });

  it('arrow keys on the grip move between corners', async () => {
    const app = new App(cfg());
    app.init();
    await app.setMode(true);
    const grip = () => toolbar().querySelector('.grip') as HTMLElement;
    grip().dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp' }));
    expect(toolbar().dataset.corner).toBe('tr');
    grip().dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowLeft' }));
    expect(toolbar().dataset.corner).toBe('tl');
  });

  it('a right-corner toolbar moves aside when the sidebar opens', async () => {
    const app = new App(cfg());
    app.init();
    await app.setMode(true);
    const before = px(toolbar().style.left);
    const listBtn = [...toolbar().querySelectorAll('button')].find((b) => b.textContent?.includes('List')) as HTMLButtonElement;
    listBtn.click();
    expect(px(toolbar().style.left)).toBe(before - 360);
  });

  it('keeps the sidebar and hints below the admin bar', async () => {
    adminBar(32);
    const app = new App(cfg());
    app.init();
    await app.setMode(true);
    const root = shadow()?.querySelector('.fbc') as HTMLElement;
    expect(root.style.getPropertyValue('--top-offset')).toBe('32px');
  });
});

describe('screenshots', () => {
  it('captures at right-click and sends item + screenshot in one multipart request', async () => {
    const marks: Array<{ x: number; y: number } | null> = [];
    window.FBCCapture = {
      captureViewport: async (opts) => {
        marks.push(opts.marker);
        return new Blob([new Uint8Array([0xff, 0xd8, 0xff])], { type: 'image/jpeg' });
      },
    };
    const app = new App({ ...cfg(), shots: true, assetsUrl: 'http://localhost:8899/wp-content/plugins/feedback-collector/dist/' });
    app.init();
    await app.setMode(true);
    document.getElementById('cta')?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 150, clientY: 210 }));
    expect(marks).toEqual([{ x: 150, y: 210 }]); // started at right-click, before the composer opens
    (shadow()?.querySelector('.menu button') as HTMLButtonElement).click();
    await tick();
    const form = shadow()?.querySelector('form.composer') as HTMLFormElement;
    expect(form.querySelector('.shot img')).not.toBeNull(); // thumbnail shown
    (form.querySelector('input[name="title"]') as HTMLInputElement).value = 'With a screenshot';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await tick();
    await tick();
    const post = calls.find((c) => c.method === 'POST');
    expect(post).toBeDefined();
    const b = post?.body as { form?: boolean; data?: { title: string; anchor: unknown }; file?: unknown };
    expect(b.form).toBe(true);
    expect(b.data?.title).toBe('With a screenshot');
    expect(b.data?.anchor).toBeTruthy();
    expect(b.file).toBeInstanceOf(Blob);
    expect(post?.headers['Content-Type']).toBeUndefined(); // browser sets the multipart boundary
    delete window.FBCCapture;
  });

  it('Remove screenshot sends the item without one', async () => {
    window.FBCCapture = { captureViewport: async () => new Blob([new Uint8Array([1])], { type: 'image/jpeg' }) };
    const app = new App({ ...cfg(), shots: true, assetsUrl: 'x/' });
    app.init();
    await app.setMode(true);
    document.getElementById('cta')?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 150, clientY: 210 }));
    (shadow()?.querySelector('.menu button') as HTMLButtonElement).click();
    await tick();
    const form = shadow()?.querySelector('form.composer') as HTMLFormElement;
    const remove = [...form.querySelectorAll('button')].find((b) => b.textContent === 'Remove screenshot') as HTMLButtonElement;
    remove.click();
    expect(form.querySelector('.shot img')).toBeNull();
    (form.querySelector('input[name="title"]') as HTMLInputElement).value = 'No screenshot';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await tick();
    await tick();
    const post = calls.find((c) => c.method === 'POST');
    expect((post?.body as { title?: string })?.title).toBe('No screenshot'); // plain JSON body, no multipart
    delete window.FBCCapture;
  });
});
