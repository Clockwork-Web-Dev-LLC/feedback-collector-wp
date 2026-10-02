// Small outline icons for the toolbar (device switcher, hover highlight). Static, trusted markup (no user data), so
// assigning it as SVG markup is safe.
const PATHS: Record<string, string> = {
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',
  tablet: '<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M11 18.5h2"/>',
  desktop: '<rect x="2.5" y="4" width="19" height="12.5" rx="1.5"/><path d="M8.5 20.5h7M12 16.5v4"/>',
  highlight: '<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3"/><path d="M11 11l9 3.5-3.8 1.4-1.4 3.8z"/>',
};

export function deviceIcon(id: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = 'icon';
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${PATHS[id] ?? ''}</svg>`;
  return span;
}

export function shotIcon(): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = 'shot-toggle-icon';
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
  return span;
}

export function chevronIcon(): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = 'shot-toggle-chevron';
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
  return span;
}

