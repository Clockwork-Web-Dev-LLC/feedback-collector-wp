// Small outline icons for the device switcher. Static, trusted markup (no user data), so
// assigning it as SVG markup is safe.
const PATHS: Record<string, string> = {
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',
  tablet: '<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M11 18.5h2"/>',
  desktop: '<rect x="2.5" y="4" width="19" height="12.5" rx="1.5"/><path d="M8.5 20.5h7M12 16.5v4"/>',
};

export function deviceIcon(id: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = 'icon';
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${PATHS[id] ?? ''}</svg>`;
  return span;
}
