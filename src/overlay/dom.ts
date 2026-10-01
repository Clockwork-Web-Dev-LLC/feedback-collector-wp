type Child = Node | string | number | null | undefined | false;
type AttrValue = string | number | boolean | null | undefined | EventListener;

/** Tiny element builder. `on*` keys become listeners; `text` sets textContent. Never uses innerHTML. */
export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Record<string, AttrValue> = {}, ...children: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === undefined || value === false) continue;
    if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'text') {
      el.textContent = String(value);
    } else if (key === 'value' && 'value' in el) {
      (el as HTMLInputElement).value = String(value);
    } else if (value === true) {
      el.setAttribute(key, '');
    } else {
      el.setAttribute(key, String(value));
    }
  }
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    el.append(typeof child === 'number' ? String(child) : child);
  }
  return el;
}

export function select(name: string, options: Array<[string, string]>, selected: string, attrs: Record<string, AttrValue> = {}): HTMLSelectElement {
  const el = h('select', { name, ...attrs });
  for (const [value, label] of options) {
    const opt = h('option', { value, text: label });
    if (value === selected) opt.selected = true;
    el.append(opt);
  }
  return el;
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const s = Math.round((Date.now() - then) / 1000);
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const hr = Math.round(m / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.round(hr / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}
