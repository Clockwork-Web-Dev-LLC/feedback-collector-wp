// Screenshot capture, built separately as dist/capture.js and loaded only when a reviewer
// files feedback, so the core overlay stays small. Exposes window.FBCCapture.
import { snapdom } from '@zumer/snapdom';

export interface CaptureOptions {
  /** Viewport point to mark (the click), or null for a page note. */
  marker: { x: number; y: number } | null;
  /** Marker color (brand primary). */
  color: string;
  /** Output width cap in px. */
  maxWidth?: number;
  /** Output byte budget; JPEG quality steps down until it fits. */
  maxBytes?: number;
}

const TEXT_INPUTS = new Set(['', 'text', 'email', 'password', 'search', 'tel', 'url', 'number', 'date', 'datetime-local', 'month', 'time', 'week']);

/** Masks typed values in the cloned page so screenshots never carry what someone entered in a form. */
const redactInputs = {
  name: 'fbc-redact-inputs',
  afterClone(ctx: { clone?: Element | null }): void {
    const root = ctx.clone;
    if (!root) return;
    for (const el of root.querySelectorAll('input')) {
      const input = el as HTMLInputElement;
      if (!TEXT_INPUTS.has((input.getAttribute('type') ?? '').toLowerCase())) continue;
      const len = (input.value || input.getAttribute('value') || '').length;
      const mask = len ? '•'.repeat(Math.min(len, 12)) : '';
      input.value = mask;
      input.setAttribute('value', mask);
    }
    for (const el of root.querySelectorAll('textarea')) {
      const area = el as HTMLTextAreaElement;
      const len = (area.value || area.textContent || '').length;
      const mask = len ? '•'.repeat(Math.min(len, 24)) : '';
      area.value = mask;
      area.textContent = mask;
    }
  },
};

function drawMarker(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, k: number): void {
  const r = 11 * k;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, r * 2.1, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 3 * k;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  ctx.restore();
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not encode screenshot'))), 'image/jpeg', quality);
  });
}

/** Captures what the reviewer currently sees, minus the overlay and the admin bar. */
export async function captureViewport(opts: CaptureOptions): Promise<Blob> {
  const maxWidth = opts.maxWidth ?? 1600;
  const maxBytes = opts.maxBytes ?? 1_000_000;
  const width = Math.min(window.innerWidth, maxWidth);

  // SnapDOM maps the clip into <body> coordinates by subtracting body's page offset, then
  // rasterizes as if body started at the page origin. WordPress offsets body by the admin
  // bar's html margin (32px), so the image came out 32px above the screen and the marker
  // missed. Adding that offset back makes the image exactly what's on screen.
  const bodyRect = document.body.getBoundingClientRect();
  const offsetX = bodyRect.left + window.scrollX;
  const offsetY = bodyRect.top + window.scrollY;
  const result = await snapdom(document.body, {
    clip: { x: window.scrollX + offsetX, y: window.scrollY + offsetY, width: window.innerWidth, height: window.innerHeight },
    exclude: ['#fbc-root', '#wpadminbar'],
    excludeMode: 'hide',
    backgroundColor: getComputedStyle(document.body).backgroundColor || '#ffffff',
    plugins: [redactInputs],
  });
  const canvas = await result.toCanvas({ width, dpr: 1 });

  if (opts.marker) {
    const ctx = canvas.getContext('2d');
    const k = canvas.width / window.innerWidth;
    if (ctx) drawMarker(ctx, opts.marker.x * k, opts.marker.y * k, opts.color, Math.max(1, k));
  }

  let quality = 0.85;
  let blob = await toBlob(canvas, quality);
  while (blob.size > maxBytes && quality > 0.45) {
    quality -= 0.1;
    blob = await toBlob(canvas, quality);
  }
  return blob;
}

declare global {
  interface Window {
    FBCCapture?: { captureViewport: typeof captureViewport };
  }
}

window.FBCCapture = { captureViewport };
