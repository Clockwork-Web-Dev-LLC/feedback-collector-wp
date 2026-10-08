// Screen recording: the recorder's upload protocol (pieces at byte offsets, retries, full re-send),
// the click/error timeline, and the overlay flow Record → Stop → composer → POST with the token.
// MediaRecorder and screen capture are faked; real capture is covered by the browser pass.
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { Api } from '../src/overlay/api';
import { App } from '../src/overlay/app';
import { OVERLAY_HOST_ID } from '../src/overlay/anchor';
import { Recorder, canRecord, clock, describeElement } from '../src/overlay/recorder';
import type { Recording } from '../src/overlay/recorder';
import type { Config, Item } from '../src/overlay/types';

const TOKEN = 'A'.repeat(32);
const TOKEN2 = 'B'.repeat(32);

const cfg = (over: Partial<Config> = {}): Config => ({
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
  round: 1,
  video: { enabled: true, maxSeconds: 180 },
  ...over,
});

// ------------------------------------------------------------------ fakes

class FakeTrack {
  stopped = false;
  private ended: (() => void) | null = null;
  constructor(public kind: 'video' | 'audio') {}
  stop() {
    this.stopped = true;
  }
  addEventListener(_t: string, fn: () => void) {
    this.ended = fn;
  }
  /** Chrome's own "Stop sharing" bar. */
  end() {
    this.ended?.();
  }
}

class FakeStream {
  constructor(public tracks: FakeTrack[] = []) {}
  getTracks() {
    return this.tracks;
  }
  getVideoTracks() {
    return this.tracks.filter((t) => t.kind === 'video');
  }
  getAudioTracks() {
    return this.tracks.filter((t) => t.kind === 'audio');
  }
}

class FakeMediaRecorder {
  static instances: FakeMediaRecorder[] = [];
  static isTypeSupported = (m: string) => m.startsWith('video/webm');
  state: 'inactive' | 'recording' = 'inactive';
  ondataavailable: ((e: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  timeslice = 0;
  constructor(public stream: FakeStream, public opts: { mimeType: string }) {
    FakeMediaRecorder.instances.push(this);
  }
  start(timeslice: number) {
    this.state = 'recording';
    this.timeslice = timeslice;
  }
  emit(text: string) {
    this.ondataavailable?.({ data: new Blob([text]) });
  }
  stop() {
    this.state = 'inactive';
    this.emit('END');
    this.onstop?.();
  }
}

let screenTrack: FakeTrack;
let displayError: Error | null = null;

function installMedia(): void {
  screenTrack = new FakeTrack('video');
  (globalThis as Record<string, unknown>).MediaRecorder = FakeMediaRecorder;
  (globalThis as Record<string, unknown>).MediaStream = FakeStream;
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: {
      getUserMedia: async () => {
        throw new DOMException('no mic', 'NotAllowedError');
      },
      getDisplayMedia: async () => {
        if (displayError) throw displayError;
        return new FakeStream([screenTrack]);
      },
    },
  });
}

interface Call {
  method: string;
  url: string;
  body: unknown;
}
let calls: Call[] = [];
/** Bytes the fake server holds per session. */
let stored: Record<string, number> = {};
/** Status codes to answer the next appends with (then 200). */
let appendFailures: number[] = [];
let sessions: string[] = [];

beforeEach(() => {
  installMedia();
  displayError = null;
  FakeMediaRecorder.instances = [];
  calls = [];
  stored = {};
  appendFailures = [];
  sessions = [TOKEN, TOKEN2];
  document.body.innerHTML = '<main><a id="cta" class="btn nav-cta" href="/contact/">Book a demo</a><input id="email" name="email" placeholder="Your email" value="secret@example.com"></main>';
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const method = init?.method ?? 'GET';
    const raw = init?.body;
    const body = raw instanceof Blob ? { bytes: raw.size } : raw ? JSON.parse(String(raw)) : undefined;
    calls.push({ method, url, body });
    const json = (status: number, data: unknown) => new Response(JSON.stringify(data), { status });
    if (method === 'POST' && /\/recordings(&|$)/.test(url)) {
      const token = sessions.shift() as string;
      stored[token] = 0;
      return json(201, { token, max_seconds: 180 });
    }
    const rec = url.match(/\/recordings\/([A-Za-z0-9]{32})/);
    if (rec && method === 'POST') {
      const fail = appendFailures.shift();
      if (fail) return json(fail, { message: 'boom' });
      const offset = Number(new URL(url).searchParams.get('offset'));
      const len = (body as { bytes: number }).bytes;
      if (offset !== stored[rec[1]]) return json(409, { message: 'out of order', data: { status: 409, size: stored[rec[1]] } });
      stored[rec[1]] += len;
      return json(200, { size: stored[rec[1]] });
    }
    if (rec && method === 'DELETE') return json(200, { deleted: true });
    if (method === 'GET' && url.includes('/items')) return json(200, { items: [], total: 0 });
    if (method === 'POST' && url.endsWith('/items')) {
      return json(201, { id: 77, title: (body as Item).title, video_url: 'http://localhost/v.webm', video_duration: 3, status: 'open', type: 'bug' });
    }
    return json(404, { message: 'nope' });
  }) as typeof fetch;
});

afterEach(() => {
  document.getElementById(OVERLAY_HOST_ID)?.remove();
});

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));
const appends = () => calls.filter((c) => c.method === 'POST' && /\/recordings\/[A-Za-z0-9]{32}/.test(c.url));

function newRecorder(onStop: (r: Recording) => void = () => undefined): Recorder {
  return new Recorder(new Api(cfg()), { maxSeconds: 180, isOverlay: () => false, onTick: () => undefined, onStop });
}

// ------------------------------------------------------------------ helpers

describe('helpers', () => {
  it('clock formats m:ss', () => {
    expect(clock(0)).toBe('0:00');
    expect(clock(61_900)).toBe('1:01');
    expect(clock(180_000)).toBe('3:00');
  });

  it('describes a click by visible text and a short selector', () => {
    expect(describeElement(document.getElementById('cta') as Element)).toBe('"Book a demo" (a#cta)');
  });

  it('Anti: never logs what was typed into a field', () => {
    const label = describeElement(document.getElementById('email') as Element);
    expect(label).toContain('Your email');
    expect(label).not.toContain('secret@example.com');
  });

  it('canRecord needs screen capture and WebM recording', () => {
    expect(canRecord()).toBe(true);
    (globalThis as Record<string, unknown>).MediaRecorder = undefined;
    expect(canRecord()).toBe(false);
  });
});

// ------------------------------------------------------------------ upload protocol

describe('Recorder', () => {
  it('records WebM and uploads each piece at its byte offset while recording', async () => {
    let done: Recording | null = null;
    const r = newRecorder((rec) => (done = rec));
    await r.start();
    const mr = FakeMediaRecorder.instances[0];
    expect(mr.opts.mimeType).toContain('video/webm');
    expect(mr.timeslice).toBe(2000);
    mr.emit('EBMLhello');
    mr.emit('world!');
    await tick(5);
    expect(appends().map((c) => new URL(c.url).searchParams.get('offset'))).toEqual(['0', '9']);

    r.stop();
    expect(done).not.toBeNull();
    const rec = done as unknown as Recording;
    expect(await rec.uploaded()).toBe(TOKEN);
    expect(stored[TOKEN]).toBe(9 + 6 + 3); // + the final "END" piece
    expect(rec.progress()).toBe(1);
    expect(rec.mic).toBe(false);
    expect(screenTrack.stopped).toBe(true);
  });

  it('retries a piece after a server error', async () => {
    let done: Recording | null = null;
    const r = newRecorder((rec) => (done = rec));
    await r.start();
    appendFailures = [500];
    FakeMediaRecorder.instances[0].emit('abc');
    r.stop();
    expect(await (done as unknown as Recording).uploaded()).toBe(TOKEN);
    expect(stored[TOKEN]).toBe(6);
  });

  it('re-uploads the whole recording in a new session when live upload gives up', async () => {
    let done: Recording | null = null;
    const r = newRecorder((rec) => (done = rec));
    await r.start();
    appendFailures = [400]; // not retryable
    FakeMediaRecorder.instances[0].emit('abc');
    FakeMediaRecorder.instances[0].emit('def');
    r.stop();
    const token = await (done as unknown as Recording).uploaded();
    expect(token).toBe(TOKEN2);
    expect(stored[TOKEN2]).toBe(9);
    expect(calls.some((c) => c.method === 'DELETE' && c.url.includes(TOKEN))).toBe(true);
  });

  it('logs clicks and JS errors with timestamps', async () => {
    let done: Recording | null = null;
    const r = newRecorder((rec) => (done = rec));
    await r.start();
    document.getElementById('cta')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
    window.dispatchEvent(new ErrorEvent('error', { message: 'x is not defined', filename: 'app.js', lineno: 3 }));
    r.stop();
    const events = (done as unknown as Recording).events;
    expect(events.map((e) => [e.kind, e.label])).toEqual([
      ['click', '"Book a demo" (a#cta)'],
      ['error', 'x is not defined (app.js:3)'],
    ]);
    expect(events.every((e) => e.t >= 0)).toBe(true);
  });

  it('stops when Chrome’s "Stop sharing" ends the tab capture', async () => {
    let done: Recording | null = null;
    const r = newRecorder((rec) => (done = rec));
    await r.start();
    screenTrack.end();
    expect(done).not.toBeNull();
    expect(r.recording).toBe(false);
  });

  it('Anti: discarding while Chrome’s prompts are open never starts recording', async () => {
    let release: (s: FakeStream) => void = () => undefined;
    (navigator.mediaDevices as unknown as Record<string, unknown>).getDisplayMedia = () => new Promise<FakeStream>((r) => (release = r));
    const r = newRecorder();
    const started = r.start();
    await tick(5);
    void r.discard();
    release(new FakeStream([screenTrack]));
    await expect(started).rejects.toThrow();
    expect(FakeMediaRecorder.instances.length).toBe(0);
    expect(screenTrack.stopped).toBe(true);
  });

  it('declining the tab picker throws and deletes the empty upload', async () => {
    displayError = new DOMException('denied', 'NotAllowedError');
    const r = newRecorder();
    await expect(r.start()).rejects.toThrow();
    await tick();
    expect(calls.some((c) => c.method === 'DELETE' && c.url.includes(TOKEN))).toBe(true);
  });
});

// ------------------------------------------------------------------ overlay flow

describe('overlay', () => {
  const shadow = () => document.getElementById(OVERLAY_HOST_ID)?.shadowRoot ?? null;
  const button = (label: string) => [...(shadow()?.querySelectorAll('.toolbar button') ?? [])].find((b) => b.textContent?.includes(label) || b.getAttribute('aria-label')?.includes(label) || b.getAttribute('data-tip')?.includes(label)) as HTMLButtonElement | undefined;
  let app: App | null = null;
  afterEach(() => {
    app?.destroy();
    app = null;
  });

  it('shows Record only when recordings are on', async () => {
    app = new App(cfg({ video: { enabled: false, maxSeconds: 180 } }));
    app.init();
    await app.setMode(true);
    expect(button('Record')).toBeUndefined();
    app.destroy();
    app = new App(cfg());
    app.init();
    await app.setMode(true);
    expect(button('Record')).toBeDefined();
  });

  it('Record → Stop → composer → POST /items carries the upload token, duration and timeline', async () => {
    app = new App(cfg());
    app.init();
    await app.setMode(true);
    button('Record')?.click();
    await tick(5);
    expect(shadow()?.querySelector('.toolbar.recording')).not.toBeNull();
    expect(shadow()?.querySelector('.rec-pointer')).not.toBeNull();
    // Right-click does nothing special while recording.
    const ctx = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    document.getElementById('cta')?.dispatchEvent(ctx);
    expect(ctx.defaultPrevented).toBe(false);

    document.getElementById('cta')?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
    FakeMediaRecorder.instances[0].emit('EBMLdata');
    await tick(1100); // long enough to keep
    button('Stop')?.click();
    await tick(5);

    const form = shadow()?.querySelector('form.composer') as HTMLFormElement;
    expect(form).not.toBeNull();
    expect(form.querySelector('video')).not.toBeNull();
    expect(form.textContent).toContain('Screen recording');
    expect(shadow()?.querySelector('.toolbar.recording')).toBeNull();

    // A stray click on the page doesn't throw the recording away.
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    expect(shadow()?.querySelector('form.composer')).not.toBeNull();

    (form.querySelector('input[name="title"]') as HTMLInputElement).value = 'Checkout breaks';
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    await tick(20);
    const post = calls.find((c) => c.method === 'POST' && c.url.endsWith('/items'));
    const body = post?.body as { recording: { token: string; duration: number; events: Array<{ kind: string }> }; title: string };
    expect(body.title).toBe('Checkout breaks');
    expect(body.recording.token).toBe(TOKEN);
    expect(body.recording.duration).toBeGreaterThanOrEqual(1);
    expect(body.recording.events[0].kind).toBe('click');
    expect(shadow()?.querySelector('form.composer')).toBeNull();
  });

  it('Anti: Feedback mode can’t be switched off mid-recording', async () => {
    app = new App(cfg());
    app.init();
    await app.setMode(true);
    button('Record')?.click();
    await tick(5);
    await app.setMode(false);
    expect(shadow()?.querySelector('.toolbar.recording')).not.toBeNull();
  });

  it('a pin card plays the recording and lists its timeline', async () => {
    globalThis.fetch = (async () =>
      new Response(
        JSON.stringify({
          id: 5, type: 'bug', status: 'open', priority: 'medium', title: 'With video', description: '', page_path: '/services/', page_query: '', page_title: '',
          page_url: '', anchor: null, context: null, breakpoint: '', round: 1, reporter_id: 1, reporter_name: 'Admin', assignee_id: 0, assignee_name: '',
          tw_task_id: 0, tw_task_url: '', tw_sync_state: '', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), can_delete: true,
          video_url: 'http://localhost/v.webm', video_duration: 75, video_events: [{ t: 42000, kind: 'click', label: '"Buy" (button)' }, { t: 51000, kind: 'error', label: 'boom' }],
        }),
        { status: 200 }
      )) as unknown as typeof fetch;
    app = new App(cfg());
    app.init();
    await app.setMode(true);
    await app.openPopover(5);
    const block = shadow()?.querySelector('.popover .rec-block');
    expect(block?.querySelector('video')?.getAttribute('src')).toBe('http://localhost/v.webm');
    expect(block?.querySelector('summary')?.textContent).toContain('1:15');
    const rows = [...(block?.querySelectorAll('.rec-timeline li') ?? [])].map((li) => li.textContent);
    expect(rows).toEqual(['0:42clicked "Buy" (button)', '0:51JS error boom']);
  });
});

describe('toolbar icons', () => {
  it('+ / page note / record are icon-only, with hover labels and accessible names', async () => {
    const app = new App(cfg());
    app.init();
    await app.setMode(true);
    const s = document.getElementById(OVERLAY_HOST_ID)?.shadowRoot;
    const byLabel = (l: string) => s?.querySelector(`.toolbar button[aria-label="${l}"]`) as HTMLButtonElement | null;
    const add = byLabel('Add feedback to an element');
    const note = byLabel('Add a note for the whole page');
    const rec = byLabel('Record this tab with your voice');
    for (const b of [add, note, rec]) {
      expect(b).not.toBeNull();
      expect(b?.textContent?.trim()).toBe('');
      expect(b?.querySelector('svg')).not.toBeNull();
      expect(b?.getAttribute('title')).toBeNull(); // no double tooltip
    }
    expect(note?.getAttribute('data-tip')).toBe('Add a page note');
    expect(add?.getAttribute('data-tip')).toBe('Add feedback to an element');
    expect(rec?.getAttribute('data-tip')).toContain('Record your screen and voice');
    note?.click();
    expect(s?.querySelector('form.composer')?.textContent).toContain('Whole page');
    app.destroy();
  });
});
