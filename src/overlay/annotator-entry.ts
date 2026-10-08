// Screenshot annotator (Fabric.js, MIT). Built separately as dist/annotator.js and loaded
// only when someone annotates. Exposes window.FBCOLAnnotator.open().
import { Canvas, FabricImage, FabricObject, Group, IText, Line, PencilBrush, Point, Rect, Triangle } from 'fabric';
import type { TPointerEventInfo, TPointerEvent } from 'fabric';

// Fabric 7 defaults objects to a center origin. Every position here is a top-left corner
// (screenshot at 0,0; boxes from the drag start), so restore top-left origins.
FabricObject.ownDefaults.originX = 'left';
FabricObject.ownDefaults.originY = 'top';

type Tool = 'select' | 'arrow' | 'box' | 'highlight' | 'pen' | 'text' | 'blur';

export interface AnnotateOptions {
  /** Screenshot to draw on. */
  image: Blob;
  /** Element (inside the overlay's shadow root) to mount the editor in. */
  mount: HTMLElement;
  /** Swatches; the first is the default color. */
  colors: string[];
}

const TOOLS: Array<{ id: Tool; label: string; key: string }> = [
  { id: 'select', label: 'Select', key: 'V' },
  { id: 'arrow', label: 'Arrow', key: 'A' },
  { id: 'box', label: 'Box', key: 'R' },
  { id: 'highlight', label: 'Highlight', key: 'H' },
  { id: 'pen', label: 'Pen', key: 'P' },
  { id: 'text', label: 'Text', key: 'T' },
  { id: 'blur', label: 'Blur', key: 'B' },
];

function el<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, string> = {}, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text !== undefined) node.textContent = text;
  return node;
}

function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not open the screenshot'));
    img.src = url;
  });
}

/** A pixelated patch of the original image covering the rectangle (in image pixels). */
function pixelate(source: HTMLImageElement, x: number, y: number, w: number, h: number): HTMLCanvasElement {
  const out = document.createElement('canvas');
  out.width = Math.max(1, Math.round(w));
  out.height = Math.max(1, Math.round(h));
  const block = Math.max(6, Math.round(Math.min(w, h) / 10));
  const small = document.createElement('canvas');
  small.width = Math.max(1, Math.round(w / block));
  small.height = Math.max(1, Math.round(h / block));
  small.getContext('2d')?.drawImage(source, x, y, w, h, 0, 0, small.width, small.height);
  const ctx = out.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(small, 0, 0, small.width, small.height, 0, 0, out.width, out.height);
  }
  return out;
}

function arrowHead(from: Point, to: Point, color: string, width: number): Triangle {
  const angle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI + 90;
  const size = width * 4 + 6;
  return new Triangle({ left: to.x, top: to.y, width: size, height: size, fill: color, angle, originX: 'center', originY: 'center', selectable: false, evented: false });
}

/**
 * Opens the editor. Resolves with the annotated image (same size as the original), or null if
 * the reviewer cancels. Esc cancels; ⌘/Ctrl+Z undoes; Delete removes the selected mark.
 */
export function open(opts: AnnotateOptions): Promise<Blob | null> {
  return new Promise((resolve) => {
    void (async () => {
      const source = await loadImage(opts.image);
      const W = source.naturalWidth;
      const H = source.naturalHeight;

      const backdrop = el('div', { class: 'annotator', role: 'dialog', 'aria-label': 'Annotate screenshot', 'aria-modal': 'true' });
      const bar = el('div', { class: 'annotator-bar', role: 'toolbar', 'aria-label': 'Annotation tools' });
      const stage = el('div', { class: 'annotator-stage' });
      const canvasEl = el('canvas');
      stage.append(canvasEl);
      backdrop.append(bar, stage);
      opts.mount.append(backdrop);

      // Fit the image in the viewport; export later at full resolution.
      const maxW = window.innerWidth - 48;
      const maxH = window.innerHeight - 120;
      const scale = Math.min(1, maxW / W, maxH / H);
      const cw = Math.round(W * scale);
      const ch = Math.round(H * scale);

      const canvas = new Canvas(canvasEl, { width: cw, height: ch, selection: true, preserveObjectStacking: true });
      const bg = new FabricImage(source, { scaleX: scale, scaleY: scale, selectable: false, evented: false });
      canvas.backgroundImage = bg;
      canvas.requestRenderAll();

      let tool: Tool = 'arrow';
      let color = opts.colors[0] ?? '#e5383b';
      const strokeWidth = 4;
      const history: FabricObject[] = [];
      let drag: { start: Point; shape: FabricObject | null } | null = null;

      const finish = (result: Blob | null) => {
        document.removeEventListener('keydown', onKey, true);
        canvas.dispose();
        backdrop.remove();
        URL.revokeObjectURL(source.src);
        resolve(result);
      };

      const add = (obj: FabricObject) => {
        canvas.add(obj);
        history.push(obj);
      };

      const setTool = (next: Tool) => {
        tool = next;
        canvas.isDrawingMode = next === 'pen';
        if (next === 'pen') {
          const brush = new PencilBrush(canvas);
          brush.color = color;
          brush.width = strokeWidth;
          canvas.freeDrawingBrush = brush;
        }
        canvas.selection = next === 'select';
        canvas.forEachObject((o) => {
          o.selectable = next === 'select';
          o.evented = next === 'select';
        });
        canvas.defaultCursor = next === 'select' ? 'default' : 'crosshair';
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        for (const b of bar.querySelectorAll<HTMLButtonElement>('[data-tool]')) b.setAttribute('aria-pressed', String(b.dataset.tool === next));
      };

      // Toolbar: tools, swatches, undo, cancel, save.
      const toolGroup = el('div', { class: 'annotator-group' });
      for (const t of TOOLS) {
        const b = el('button', { type: 'button', 'data-tool': t.id, title: `${t.label} (${t.key})`, 'aria-pressed': 'false' }, t.label);
        b.addEventListener('click', () => setTool(t.id));
        toolGroup.append(b);
      }
      const swatches = el('div', { class: 'annotator-group', role: 'radiogroup', 'aria-label': 'Color' });
      for (const c of opts.colors) {
        const s = el('button', { type: 'button', class: 'swatch', role: 'radio', 'aria-label': `Color ${c}`, 'aria-checked': String(c === color) });
        s.style.background = c;
        s.addEventListener('click', () => {
          color = c;
          for (const o of swatches.querySelectorAll('.swatch')) o.setAttribute('aria-checked', String(o === s));
          if (tool === 'pen' && canvas.freeDrawingBrush) canvas.freeDrawingBrush.color = c;
          const active = canvas.getActiveObject();
          if (active) {
            if (active instanceof IText) active.set({ fill: c });
            else if (active.stroke) active.set({ stroke: c });
            canvas.requestRenderAll();
          }
        });
        swatches.append(s);
      }
      const undo = el('button', { type: 'button', title: 'Undo (⌘Z)' }, 'Undo');
      undo.addEventListener('click', () => {
        const last = history.pop();
        if (last) {
          canvas.remove(last);
          canvas.requestRenderAll();
        }
      });
      const cancel = el('button', { type: 'button', class: 'annotator-cancel' }, 'Cancel');
      cancel.addEventListener('click', () => finish(null));
      const save = el('button', { type: 'button', class: 'annotator-save' }, 'Save annotations');
      save.addEventListener('click', () => {
        canvas.discardActiveObject();
        canvas.renderAll();
        const data = canvas.toDataURL({ format: 'jpeg', quality: 0.86, multiplier: 1 / scale });
        void fetch(data)
          .then((r) => r.blob())
          .then((b) => finish(b))
          .catch(() => finish(null));
      });
      const spacer = el('div', { class: 'annotator-spacer' });
      bar.append(toolGroup, swatches, undo, spacer, cancel, save);

      // Pen strokes count as marks for undo.
      canvas.on('path:created', (e: { path: FabricObject }) => {
        history.push(e.path);
      });

      canvas.on('mouse:down', (opt: TPointerEventInfo<TPointerEvent>) => {
        if (tool === 'select' || tool === 'pen') return;
        const p = canvas.getScenePoint(opt.e);
        if (tool === 'text') {
          const t = new IText('Text', { left: p.x, top: p.y, fill: color, fontSize: 20, fontWeight: 'bold', fontFamily: '-apple-system, Segoe UI, Roboto, sans-serif', backgroundColor: 'rgba(255,255,255,0.85)', padding: 4 });
          // Fabric's hidden textarea must live in our shadow root, or the overlay's
          // document-level Esc/click-outside handlers would close the editor mid-typing.
          t.hiddenTextareaContainer = backdrop;
          add(t);
          canvas.setActiveObject(t);
          t.enterEditing();
          t.selectAll();
          setToolAfterText();
          return;
        }
        drag = { start: p, shape: null };
      });

      const setToolAfterText = () => {
        // Keep typing in place; switching tool happens on the next toolbar click.
        for (const b of bar.querySelectorAll<HTMLButtonElement>('[data-tool]')) b.setAttribute('aria-pressed', String(b.dataset.tool === 'text'));
      };

      canvas.on('mouse:move', (opt: TPointerEventInfo<TPointerEvent>) => {
        if (!drag) return;
        const p = canvas.getScenePoint(opt.e);
        if (drag.shape) canvas.remove(drag.shape);
        const { start } = drag;
        const left = Math.min(start.x, p.x);
        const top = Math.min(start.y, p.y);
        const width = Math.abs(p.x - start.x);
        const height = Math.abs(p.y - start.y);
        let shape: FabricObject;
        if (tool === 'arrow') {
          const line = new Line([start.x, start.y, p.x, p.y], { stroke: color, strokeWidth, strokeLineCap: 'round', selectable: false, evented: false });
          shape = new Group([line, arrowHead(start, p, color, strokeWidth)], { selectable: false, evented: false });
        } else if (tool === 'highlight') {
          shape = new Rect({ left, top, width, height, fill: color, opacity: 0.3, selectable: false, evented: false });
        } else {
          // box and blur preview
          shape = new Rect({ left, top, width, height, fill: 'transparent', stroke: tool === 'blur' ? '#ffffff' : color, strokeWidth: tool === 'blur' ? 2 : strokeWidth, strokeDashArray: tool === 'blur' ? [6, 4] : undefined, selectable: false, evented: false });
        }
        drag.shape = shape;
        canvas.add(shape);
        canvas.requestRenderAll();
      });

      canvas.on('mouse:up', () => {
        if (!drag) return;
        const shape = drag.shape;
        drag = null;
        if (!shape) return;
        const b = shape.getBoundingRect();
        if (b.width < 4 && b.height < 4) {
          canvas.remove(shape);
          return;
        }
        if (tool === 'blur') {
          canvas.remove(shape);
          // Pixelate the original pixels under the rectangle (not a filter on the whole image).
          const patch = pixelate(source, b.left / scale, b.top / scale, b.width / scale, b.height / scale);
          const img = new FabricImage(patch, { left: b.left, top: b.top, scaleX: scale, scaleY: scale, selectable: false, evented: false });
          add(img);
        } else {
          history.push(shape);
        }
        canvas.requestRenderAll();
      });

      const onKey = (e: KeyboardEvent) => {
        const active = canvas.getActiveObject();
        const editing = active instanceof IText && active.isEditing;
        if (e.key === 'Escape') {
          e.preventDefault();
          e.stopImmediatePropagation();
          if (editing) {
            (active as IText).exitEditing();
            canvas.requestRenderAll();
          } else {
            finish(null);
          }
          return;
        }
        if (editing) return;
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
          e.preventDefault();
          e.stopImmediatePropagation();
          undo.click();
          return;
        }
        if ((e.key === 'Delete' || e.key === 'Backspace') && active) {
          e.preventDefault();
          e.stopImmediatePropagation();
          canvas.remove(active);
          const i = history.indexOf(active);
          if (i >= 0) history.splice(i, 1);
          canvas.requestRenderAll();
          return;
        }
        const t = TOOLS.find((x) => x.key === e.key.toUpperCase());
        if (t && !e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          e.stopImmediatePropagation();
          setTool(t.id);
        }
      };
      document.addEventListener('keydown', onKey, true);

      setTool('arrow');
      (bar.querySelector('[data-tool="arrow"]') as HTMLButtonElement | null)?.focus();
    })().catch(() => resolve(null));
  });
}

declare global {
  interface Window {
    FBCOLAnnotator?: { open: typeof open };
  }
}

window.FBCOLAnnotator = { open };
