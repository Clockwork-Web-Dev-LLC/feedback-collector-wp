// Boot test for the overlay controller under happy-dom. Proves the bundle wires up
// and the right-click → menu → composer → POST flow runs. It cannot prove layout
// (happy-dom has no real rects), so pin *positions* are covered by the browser pass.
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { App, addDays, suggestDue } from '../src/overlay/app';
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

let activeApps: App[] = [];
function createApp(config = cfg()): App {
  const a = new App(config);
  activeApps.push(a);
  return a;
}

afterEach(() => {
  for (const a of activeApps) a.destroy();
  activeApps = [];
  delete window.FBCCapture;
  delete window.FBCAnnotator;
});

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
    const itemMatch = url.match(/\/items\/(\d+)/);
    if (method === 'GET' && itemMatch) {
      const id = Number(itemMatch[1]);
      const found = serverItems.find((i) => i.id === id) ?? makeItem({ id });
      return new Response(JSON.stringify(found), { status: 200 });
    }
    if (method === 'POST' && url.endsWith('/items')) {
      const b = body as Partial<Item>;
      const item = makeItem({ id: 42, type: b.type, title: b.title, anchor: b.anchor ?? null, page_path: b.page_path, due_date: b.due_date ?? null });
      // Like the server: a dated item starts/moves the reviewer's batch and returns the next suggestion.
      if (b.due_date) item.due_next = { onByDefault: true, days: 3, hours: 3, suggest: b.due_date, batchUntil: Math.floor(Date.now() / 1000) + 3 * 3600, today: '2026-10-01' };
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
    const app = createApp(cfg());
    app.init();
    expect(shadow()).not.toBeNull();
    expect(shadow()?.querySelector('.toolbar')).toBeNull();

    const ev = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 150, clientY: 210 });
    document.getElementById('cta')?.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(false); // native menu untouched when mode is off
    expect(shadow()?.querySelector('.menu')).toBeNull();
  });

  it('right-click → type menu → composer → POST with anchor, page key and context', async () => {
    const app = createApp(cfg());
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
    const app = createApp(cfg());
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
    const app = createApp(cfg());
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
    const app = createApp(cfg());
    app.init();
    await app.setMode(true);
    const pins = [...(shadow()?.querySelectorAll('.pin') ?? [])].map((p) => p.textContent);
    expect(pins).toEqual(['5']);
    const pin = shadow()?.querySelector('.pin') as HTMLElement;
    expect(pin.style.transform).toBe('translate(180px, 220px)'); // left + 0.5*width, top + 0.5*height of the stubbed rect
  });

  it('Alt+Shift+F toggles mode but not while typing in an input', async () => {
    document.body.insertAdjacentHTML('beforeend', '<input id="q" />');
    const app = createApp(cfg());
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

describe('pin reloads', () => {
  it('reloading items (e.g. after closing device preview) never duplicates pins, and drops removed ones', async () => {
    const anchor = { id: 'cta', selector: '#cta', xpath: '', text: 'Book a demo', tag: 'a', offsetX: 0.5, offsetY: 0.5, docX: 0, docY: 0 };
    serverItems = [makeItem({ id: 5, anchor }), makeItem({ id: 9, anchor })];
    const app = createApp(cfg());
    app.init();
    await app.setMode(true);
    const pins = () => [...(shadow()?.querySelectorAll('.pin') ?? [])].map((p) => p.textContent);
    expect(pins()).toEqual(['5', '9']);

    const reload = () => (app as unknown as { loadItems(): Promise<void> }).loadItems();
    await reload();
    await reload();
    expect(pins()).toEqual(['5', '9']);

    serverItems = [serverItems[0]];
    await reload();
    expect(pins()).toEqual(['5']);
  });
});

describe('resolved pins', () => {
  it('follow the List status filter; there is no separate toolbar toggle', async () => {
    const anchor = { id: 'cta', selector: '#cta', xpath: '', text: 'Book a demo', tag: 'a', offsetX: 0.5, offsetY: 0.5, docX: 0, docY: 0 };
    serverItems = [makeItem({ id: 5, anchor }), makeItem({ id: 9, anchor, status: 'resolved' })];
    const app = createApp(cfg());
    app.init();
    await app.setMode(true);
    const pins = () => [...(shadow()?.querySelectorAll('.pin') ?? [])].map((p) => p.textContent);
    expect(pins()).toEqual(['5']); // default filter is Unresolved
    const buttons = [...(shadow()?.querySelectorAll('.toolbar button') ?? [])].map((b) => b.textContent ?? '');
    expect(buttons.some((t) => t.includes('Resolved'))).toBe(false);

    const listBtn = [...(shadow()?.querySelectorAll('.toolbar button') ?? [])].find((b) => b.textContent?.startsWith('List')) as HTMLButtonElement;
    listBtn.click();
    await tick();
    const status = shadow()?.querySelector('select[name="status"]') as HTMLSelectElement;
    status.value = '';
    status.dispatchEvent(new Event('change'));
    expect(pins()).toEqual(['5', '✓']);

    status.value = 'resolved';
    status.dispatchEvent(new Event('change'));
    expect(pins()).toEqual(['✓']);
  });
});

describe('hover highlight toggle', () => {
  const outlineOn = () => !!shadow()?.querySelector('.outline.on');
  const hover = () => document.getElementById('cta')?.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 150, clientY: 210 }));
  const toggle = () => shadow()?.querySelector('.toolbar button[aria-label="Highlight elements on hover"]') as HTMLButtonElement;

  it('turns hover outlines off, still highlights in pin mode, and remembers the choice', async () => {
    const app = createApp(cfg());
    app.init();
    await app.setMode(true);
    expect(toggle().getAttribute('aria-pressed')).toBe('true');
    hover();
    expect(outlineOn()).toBe(true);

    toggle().click();
    expect(toggle().getAttribute('aria-pressed')).toBe('false');
    expect(outlineOn()).toBe(false);
    hover();
    expect(outlineOn()).toBe(false);
    expect(window.localStorage.getItem('fbc:highlight')).toBe('0');

    // + Add needs the outline to show what will be pinned.
    const add = [...(shadow()?.querySelectorAll('.toolbar button') ?? [])].find((b) => b.textContent === '+ Add') as HTMLButtonElement;
    add.click();
    hover();
    expect(outlineOn()).toBe(true);

    app.destroy();
    const again = createApp(cfg());
    again.init();
    await again.setMode(true);
    expect(toggle().getAttribute('aria-pressed')).toBe('false');
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
    const app = createApp(cfg());
    app.init();
    await app.setMode(true);
    expect(toolbar().dataset.corner).toBe('br');
    expect(px(toolbar().style.top)).toBe(window.innerHeight - toolbar().offsetHeight - 16);
  });

  it('drag snaps to the nearest corner, persists, and never sits under the admin bar', async () => {
    adminBar(32);
    const app = createApp(cfg());
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
    const app = createApp(cfg());
    app.init();
    await app.setMode(true);
    expect(toolbar().dataset.corner).toBe('tr');
    expect(px(toolbar().style.top)).toBe(46 + 16);
  });

  it('arrow keys on the grip move between corners', async () => {
    const app = createApp(cfg());
    app.init();
    await app.setMode(true);
    const grip = () => toolbar().querySelector('.grip') as HTMLElement;
    grip().dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp' }));
    expect(toolbar().dataset.corner).toBe('tr');
    grip().dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowLeft' }));
    expect(toolbar().dataset.corner).toBe('tl');
  });

  it('a right-corner toolbar moves aside when the sidebar opens', async () => {
    const app = createApp(cfg());
    app.init();
    await app.setMode(true);
    const before = px(toolbar().style.left);
    const listBtn = [...toolbar().querySelectorAll('button')].find((b) => b.textContent?.includes('List')) as HTMLButtonElement;
    listBtn.click();
    expect(px(toolbar().style.left)).toBe(before - 360);
  });

  it('keeps the sidebar and hints below the admin bar', async () => {
    adminBar(32);
    const app = createApp(cfg());
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
    const app = createApp({ ...cfg(), shots: true, assetsUrl: 'http://localhost:8899/wp-content/plugins/feedback-collector/dist/' });
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
    const app = createApp({ ...cfg(), shots: true, assetsUrl: 'x/' });
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

describe('annotation', () => {
  it('Annotate swaps in the edited image; Esc while annotating never closes the composer', async () => {
    const original = new Blob([new Uint8Array([1, 2, 3])], { type: 'image/jpeg' });
    const edited = new Blob([new Uint8Array([9, 9, 9, 9])], { type: 'image/jpeg' });
    window.FBCCapture = { captureViewport: async () => original };
    let release: (b: Blob | null) => void = () => {};
    let mountedIn: HTMLElement | null = null;
    window.FBCAnnotator = {
      open: (opts) => {
        mountedIn = opts.mount;
        expect(opts.image).toBe(original);
        return new Promise((r) => {
          release = r;
        });
      },
    };
    const app = createApp({ ...cfg(), shots: true, assetsUrl: 'x/' });
    app.init();
    await app.setMode(true);
    document.getElementById('cta')?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 150, clientY: 210 }));
    (shadow()?.querySelector('.menu button') as HTMLButtonElement).click();
    await tick();
    const form = shadow()?.querySelector('form.composer') as HTMLFormElement;
    const annotateBtn = [...form.querySelectorAll('button')].find((b) => b.textContent?.includes('Annotate')) as HTMLButtonElement;
    annotateBtn.click();
    await tick();
    expect(mountedIn === shadow()?.querySelector('.fbc')).toBe(true);
    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }));
    expect(shadow()?.querySelector('form.composer')).not.toBeNull(); // still open
    release(edited);
    await tick();
    await tick();
    (form.querySelector('input[name="title"]') as HTMLInputElement).value = 'Annotated';
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await tick();
    await tick();
    const post = calls.find((c) => c.method === 'POST');
    expect((post?.body as { file?: Blob }).file?.size).toBe(edited.size); // the annotated image was sent
    delete window.FBCCapture;
    delete window.FBCAnnotator;
  });
});

describe('selection outline', () => {
  it('keeps the right-clicked element outlined through menu and composer, clears on cancel', async () => {
    const app = createApp(cfg());
    app.init();
    await app.setMode(true);
    const outline = () => shadow()?.querySelector('.outline') as HTMLElement;
    document.getElementById('cta')?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 150, clientY: 210 }));
    expect(outline().classList.contains('on')).toBe(true);
    expect(outline().classList.contains('locked')).toBe(true);
    expect(outline().style.left).toBe('100px'); // the CTA's stubbed rect
    (shadow()?.querySelector('.menu button') as HTMLButtonElement).click();
    expect(shadow()?.querySelector('form.composer')).not.toBeNull();
    expect(outline().classList.contains('on')).toBe(true); // still selected in the composer
    const cancel = [...(shadow()?.querySelectorAll('form.composer button') ?? [])].find((b) => b.textContent === 'Cancel') as HTMLButtonElement;
    cancel.click();
    expect(outline().classList.contains('on')).toBe(false);
  });
});

describe('app lifecycle and mentions', () => {
  it('destroy() unmounts host and unbinds listeners', async () => {
    const app = createApp(cfg());
    app.init();
    await app.setMode(true);
    expect(document.getElementById(OVERLAY_HOST_ID)).not.toBeNull();
    app.destroy();
    expect(document.getElementById(OVERLAY_HOST_ID)).toBeNull();
  });

  it('popover renders @mentions wrapped in .mention tags and autocompletes', async () => {
    serverItems = [
      makeItem({
        id: 10,
        title: 'Mentions test',
        description: 'Hello @Admin, please check this.',
        comments: [
          { id: 1, kind: 'comment', body: 'CC @Admin for review', user_id: 2, user_name: 'Bob', created_at: new Date().toISOString() },
        ],
      }),
    ];
    const app = createApp(cfg());
    app.init();
    await app.setMode(true);
    await app.openPopover(10, { x: 50, y: 50 });
    const card = shadow()?.querySelector('.card.popover') as HTMLElement;
    expect(card).not.toBeNull();

    // Mentions in description and comments rendered as span.mention
    const descMentions = card.querySelectorAll('.desc .mention');
    expect(descMentions.length).toBe(1);
    expect(descMentions[0].textContent).toBe('@Admin');

    const commentMentions = card.querySelectorAll('.thread .mention');
    expect(commentMentions.length).toBe(1);
    expect(commentMentions[0].textContent).toBe('@Admin');

    // Autocomplete typing @ in reply textarea
    const reply = card.querySelector('textarea') as HTMLTextAreaElement;
    expect(reply).not.toBeNull();
    reply.value = 'Hey @Ad';
    reply.setSelectionRange(7, 7);
    reply.dispatchEvent(new Event('input', { bubbles: true }));
    await tick();

    const menu = card.querySelector('.mention-menu');
    expect(menu).not.toBeNull();
    const item = menu?.querySelector('.mention-item') as HTMLElement;
    expect(item?.textContent).toBe('Admin');
    item.click();
    expect(reply.value).toBe('Hey @Admin ');
  });
});

describe('due dates', () => {
  const due = (over: Partial<NonNullable<Config['due']>> = {}): NonNullable<Config['due']> => ({ onByDefault: true, days: 3, hours: 3, suggest: '2026-10-04', batchUntil: 0, today: '2026-10-01', ...over });
  const openComposer = async (c: Config) => {
    const app = createApp(c);
    app.init();
    await app.setMode(true);
    document.getElementById('cta')?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 150, clientY: 210 }));
    (shadow()?.querySelector('.menu button') as HTMLButtonElement).click();
    const form = shadow()?.querySelector('form.composer') as HTMLFormElement;
    return {
      form,
      on: form.querySelector('input[name="due_on"]') as HTMLInputElement,
      date: form.querySelector('input[name="due_date"]') as HTMLInputElement,
      submit: async (title: string) => {
        (form.querySelector('input[name="title"]') as HTMLInputElement).value = title;
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await tick();
        await tick();
        return calls.filter((c) => c.method === 'POST').pop()?.body as Record<string, unknown>;
      },
    };
  };

  it('suggestDue: batch date while the batch runs, N days out after it ends', () => {
    const now = Date.UTC(2026, 9, 1, 12);
    expect(suggestDue(due({ suggest: '2026-10-09', batchUntil: now / 1000 + 60 }), now)).toBe('2026-10-09');
    expect(suggestDue(due({ suggest: '2026-10-09', batchUntil: now / 1000 - 60 }), now)).not.toBe('2026-10-09');
    expect(suggestDue(due({ suggest: '2026-10-04', batchUntil: 0 }), now)).toBe('2026-10-04');
    expect(suggestDue(undefined, now)).toBe('');
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
  });

  it('"Set date?" is ticked by default and sends the suggested date', async () => {
    const c = await openComposer({ ...cfg(), due: due() });
    expect(c.on.checked).toBe(true);
    expect(c.date.hidden).toBe(false);
    expect(c.date.value).toBe('2026-10-04');
    const body = await c.submit('Dated');
    expect(body.due_date).toBe('2026-10-04');
  });

  it('off by default: unticked, no date sent; ticking fills the suggestion', async () => {
    const c = await openComposer({ ...cfg(), due: due({ onByDefault: false }) });
    expect(c.on.checked).toBe(false);
    expect(c.date.hidden).toBe(true);
    c.date.value = '';
    c.on.checked = true;
    c.on.dispatchEvent(new Event('change'));
    expect(c.date.hidden).toBe(false);
    expect(c.date.value).toBe('2026-10-04');
    c.on.checked = false;
    c.on.dispatchEvent(new Event('change'));
    const body = await c.submit('Undated');
    expect(body.due_date).toBeNull();
  });

  it('a date changed mid-batch is suggested for the next item', async () => {
    const c = await openComposer({ ...cfg(), due: due() });
    c.date.value = '2026-10-09';
    await c.submit('First of the batch');
    document.getElementById('cta')?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 150, clientY: 210 }));
    (shadow()?.querySelector('.menu button') as HTMLButtonElement).click();
    const next = shadow()?.querySelector('form.composer input[name="due_date"]') as HTMLInputElement;
    expect(next.value).toBe('2026-10-09');
  });
});
