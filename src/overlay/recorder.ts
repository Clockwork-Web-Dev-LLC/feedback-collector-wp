import { ApiError } from './api';
import type { Api } from './api';
import type { RecEvent } from './types';

/** WebM in order of preference: VP9 keeps screen text sharp at a low bitrate. */
const MIMES = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
/** A piece is sent to WordPress this often (ms), so the upload is done almost as soon as recording stops. */
const TIMESLICE = 2000;
/** Pieces re-sent after a failed upload are at most this large (well under PHP's limits). */
const RESEND_SLICE = 4 * 1024 * 1024;
const MAX_EVENTS = 300;

/** Chrome and Edge: tab capture, tab audio and WebM recording. */
export function canRecord(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getDisplayMedia === 'function' &&
    typeof MediaRecorder !== 'undefined' &&
    MIMES.some((m) => MediaRecorder.isTypeSupported(m))
  );
}

/** "m:ss" */
export function clock(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * A short, readable name for what was clicked: its text (never a form field's value) and a
 * selector-ish tag, e.g. `"Book a call" (a.nav-cta)`.
 */
export function describeElement(target: Element): string {
  const el = target.closest('a, button, [role="button"], input, select, textarea, label, summary') ?? target;
  const tag = el.tagName.toLowerCase();
  const sel = el.id ? `${tag}#${el.id}` : `${tag}${[...el.classList].slice(0, 2).map((c) => `.${c}`).join('')}`;
  let text = '';
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
    text = el.getAttribute('aria-label') || el.getAttribute('placeholder') || el.getAttribute('name') || '';
  } else {
    text = el.getAttribute('aria-label') || (el as HTMLElement).innerText || el.textContent || '';
  }
  text = text.replace(/\s+/g, ' ').trim().slice(0, 60);
  return text ? `"${text}" (${sel})` : sel;
}

export interface RecorderOptions {
  maxSeconds: number;
  /** Events inside the overlay (the recording controls) are not logged. */
  isOverlay: (e: Event) => boolean;
  onTick: (elapsedMs: number) => void;
  /** Recording stopped: by Stop, the time limit, or Chrome's own "Stop sharing". */
  onStop: (recording: Recording) => void;
}

/** A finished recording, still finishing its upload. */
export interface Recording {
  blob: Blob;
  durationMs: number;
  events: RecEvent[];
  /** True when the microphone was recorded. */
  mic: boolean;
  /** Share of the bytes WordPress has confirmed (0–1). */
  progress(): number;
  /** Resolves with the upload token once every byte is stored; re-uploads after a failure. */
  uploaded(): Promise<string>;
  discard(): Promise<void>;
}

/**
 * Records the current tab with the reviewer's microphone (and the tab's own sound) to WebM,
 * uploading it to WordPress in small pieces while it records, and logs clicks and JS errors
 * with timestamps.
 */
export class Recorder {
  private streams: MediaStream[] = [];
  private audioCtx: AudioContext | null = null;
  private rec: MediaRecorder | null = null;
  private pieces: Blob[] = [];
  private events: RecEvent[] = [];
  private token = '';
  private queued = 0;
  private confirmed = 0;
  private queue: Promise<void> = Promise.resolve();
  private failed: Error | null = null;
  private startedAt = 0;
  private endedAt = 0;
  private tickTimer = 0;
  private limitTimer = 0;
  private unbinds: Array<() => void> = [];
  private mic = false;
  private stopping = false;
  /** Discarded before the reviewer finished answering Chrome's prompts. */
  private cancelled = false;

  constructor(private api: Api, private opts: RecorderOptions) {}

  /** Asks for the microphone and the tab, then starts. Throws when the reviewer declines the tab. */
  async start(): Promise<void> {
    const session = await this.api.startRecording();
    this.token = session.token;
    const maxSeconds = Math.min(this.opts.maxSeconds, session.max_seconds || this.opts.maxSeconds);

    // One permission prompt at a time: the microphone first, then Chrome's "share this tab".
    let mic: MediaStream | null = null;
    try {
      mic = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: false });
    } catch {
      mic = null; // Recording without a voice still shows the problem.
    }
    let screen: MediaStream;
    try {
      screen = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30, max: 30 } },
        audio: true,
        // Chromium-only hints: offer this tab first, and only tabs.
        preferCurrentTab: true,
        selfBrowserSurface: 'include',
        surfaceSwitching: 'exclude',
        systemAudio: 'exclude',
        monitorTypeSurfaces: 'exclude',
      } as DisplayMediaStreamOptions);
    } catch (err) {
      mic?.getTracks().forEach((t) => t.stop());
      void this.api.discardRecording(this.token).catch(() => undefined);
      throw err;
    }
    if (this.cancelled) {
      // Discarded while Chrome's prompts were open: never start recording behind the reviewer's back.
      for (const s of [screen, mic]) s?.getTracks().forEach((t) => t.stop());
      throw new DOMException('Recording discarded', 'AbortError');
    }
    this.streams = [screen, ...(mic ? [mic] : [])];
    this.mic = !!mic;

    const tracks: MediaStreamTrack[] = [...screen.getVideoTracks()];
    const audioIn = [screen, mic].filter((s): s is MediaStream => !!s && s.getAudioTracks().length > 0);
    if (audioIn.length) {
      // Mix the voice and the tab's sound into one track.
      this.audioCtx = new AudioContext();
      const out = this.audioCtx.createMediaStreamDestination();
      for (const s of audioIn) this.audioCtx.createMediaStreamSource(s).connect(out);
      tracks.push(...out.stream.getAudioTracks());
    }

    const mimeType = MIMES.find((m) => MediaRecorder.isTypeSupported(m)) ?? 'video/webm';
    const rec = new MediaRecorder(new MediaStream(tracks), { mimeType, videoBitsPerSecond: 1_500_000, audioBitsPerSecond: 96_000 });
    this.rec = rec;
    rec.ondataavailable = (e) => {
      if (e.data.size) this.enqueue(e.data);
    };
    rec.onstop = () => this.finish();
    // Chrome's own "Stop sharing" bar ends the video track.
    screen.getVideoTracks()[0]?.addEventListener('ended', () => this.stop());

    this.bindEvents();
    rec.start(TIMESLICE);
    this.startedAt = performance.now();
    this.tickTimer = window.setInterval(() => this.opts.onTick(this.elapsed()), 250);
    this.limitTimer = window.setTimeout(() => this.stop(), maxSeconds * 1000);
    this.opts.onTick(0);
  }

  get recording(): boolean {
    return !!this.rec && this.rec.state !== 'inactive' && !this.stopping;
  }

  elapsed(): number {
    return (this.endedAt || performance.now()) - this.startedAt;
  }

  stop(): void {
    if (!this.rec || this.stopping) return;
    this.stopping = true;
    this.endedAt = performance.now();
    window.clearInterval(this.tickTimer);
    window.clearTimeout(this.limitTimer);
    for (const u of this.unbinds) u();
    this.unbinds = [];
    if (this.rec.state !== 'inactive') this.rec.stop(); // flushes the last piece, then onstop
    else this.finish();
  }

  /** Stops (if needed) and deletes the upload. */
  async discard(): Promise<void> {
    this.cancelled = true;
    this.opts.onStop = () => undefined;
    this.stop();
    await this.queue;
    await this.api.discardRecording(this.token).catch(() => undefined);
  }

  // ------------------------------------------------------------------ internals

  private finish(): void {
    for (const s of this.streams) s.getTracks().forEach((t) => t.stop());
    this.streams = [];
    void this.audioCtx?.close().catch(() => undefined);
    this.audioCtx = null;
    const blob = new Blob(this.pieces, { type: 'video/webm' });
    this.opts.onStop({
      blob,
      durationMs: Math.round(this.elapsed()),
      events: this.events.slice(),
      mic: this.mic,
      progress: () => (this.queued ? Math.min(1, this.confirmed / this.queued) : 1),
      uploaded: () => this.uploaded(blob),
      discard: () => this.discard(),
    });
  }

  private enqueue(piece: Blob): void {
    this.pieces.push(piece);
    const offset = this.queued;
    this.queued += piece.size;
    this.queue = this.queue.then(async () => {
      if (this.failed) return; // the whole file is re-sent at the end instead
      try {
        await this.send(this.token, offset, piece);
      } catch (err) {
        this.failed = err as Error;
      }
    });
  }

  /** Sends one piece, retrying network failures with backoff. */
  private async send(token: string, offset: number, piece: Blob): Promise<void> {
    for (let attempt = 0; ; attempt++) {
      try {
        const { size } = await this.api.appendRecording(token, offset, piece);
        this.confirmed = Math.max(this.confirmed, size);
        return;
      } catch (err) {
        // The server already has these bytes (an earlier try got through).
        if (err instanceof ApiError && err.status === 409 && Number(err.data?.size) >= offset + piece.size) {
          this.confirmed = Math.max(this.confirmed, Number(err.data?.size));
          return;
        }
        const retryable = !(err instanceof ApiError) || err.status >= 500 || err.status === 429;
        if (!retryable || attempt >= 3) throw err;
        await new Promise((r) => window.setTimeout(r, 800 * 2 ** attempt));
      }
    }
  }

  /** Waits for the live upload; if it broke along the way, uploads the whole file again. */
  private async uploaded(blob: Blob): Promise<string> {
    await this.queue;
    if (!this.failed) return this.token;
    void this.api.discardRecording(this.token).catch(() => undefined);
    const session = await this.api.startRecording();
    this.token = session.token;
    this.failed = null;
    this.confirmed = 0;
    this.queued = blob.size;
    for (let offset = 0; offset < blob.size; offset += RESEND_SLICE) {
      await this.send(this.token, offset, blob.slice(offset, offset + RESEND_SLICE));
    }
    return this.token;
  }

  private log(kind: RecEvent['kind'], label: string): void {
    if (this.events.length >= MAX_EVENTS || !this.recording) return;
    this.events.push({ t: Math.round(this.elapsed()), kind, label: label.slice(0, 200) });
  }

  private bindEvents(): void {
    const on = <K extends keyof WindowEventMap>(target: Window | Document, type: K, fn: (e: WindowEventMap[K]) => void) => {
      target.addEventListener(type, fn as EventListener, true);
      this.unbinds.push(() => target.removeEventListener(type, fn as EventListener, true));
    };
    on(document, 'pointerdown', (e) => {
      if (e.button !== 0 || this.opts.isOverlay(e) || !(e.target instanceof Element)) return;
      this.log('click', describeElement(e.target));
    });
    on(window, 'error', (e) => {
      if (e.message) this.log('error', `${e.message}${e.filename ? ` (${e.filename}:${e.lineno})` : ''}`);
    });
    on(window, 'unhandledrejection', (e) => {
      const r: unknown = e.reason;
      this.log('error', `Unhandled rejection: ${r instanceof Error ? r.message : String(r)}`);
    });
    // Leaving the page ends the recording; ask first.
    on(window, 'beforeunload', (e) => {
      e.preventDefault();
      e.returnValue = '';
    });
  }
}

/**
 * Shows the pointer and a ripple on every click inside the overlay layer, so they appear in
 * the recording whether or not Chrome draws the real cursor in tab captures.
 */
export function mountPointerTrail(layer: HTMLElement): () => void {
  const dot = document.createElement('div');
  dot.className = 'rec-pointer';
  dot.hidden = true;
  layer.append(dot);
  const move = (e: PointerEvent) => {
    dot.hidden = false;
    dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  };
  const down = (e: PointerEvent) => {
    move(e);
    const ripple = document.createElement('div');
    ripple.className = 'rec-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    layer.append(ripple);
    window.setTimeout(() => ripple.remove(), 700);
  };
  const leave = () => {
    dot.hidden = true;
  };
  document.addEventListener('pointermove', move, { capture: true, passive: true });
  document.addEventListener('pointerdown', down, { capture: true, passive: true });
  document.documentElement.addEventListener('pointerleave', leave);
  return () => {
    document.removeEventListener('pointermove', move, { capture: true });
    document.removeEventListener('pointerdown', down, { capture: true });
    document.documentElement.removeEventListener('pointerleave', leave);
    dot.remove();
  };
}
