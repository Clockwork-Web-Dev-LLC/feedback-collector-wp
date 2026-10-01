import type { Breakpoint, Config, Context } from './types';

export function breakpoint(width = window.innerWidth): Breakpoint {
  if (width < 768) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
}

export function parseBrowser(ua: string): string {
  const rules: Array<[RegExp, string]> = [
    [/Edg\/([\d.]+)/, 'Edge'],
    [/OPR\/([\d.]+)/, 'Opera'],
    [/Firefox\/([\d.]+)/, 'Firefox'],
    [/CriOS\/([\d.]+)/, 'Chrome iOS'],
    [/Chrome\/([\d.]+)/, 'Chrome'],
    [/Version\/([\d.]+).*Safari/, 'Safari'],
  ];
  for (const [re, name] of rules) {
    const m = ua.match(re);
    if (m) return `${name} ${m[1].split('.')[0]}`;
  }
  return 'Unknown';
}

export function parseOs(ua: string): string {
  let m = ua.match(/(iPhone|iPad).*OS ([\d_]+)/);
  if (m) return `iOS ${m[2].replace(/_/g, '.')}`;
  m = ua.match(/Android ([\d.]+)/);
  if (m) return `Android ${m[1]}`;
  m = ua.match(/Windows NT ([\d.]+)/);
  if (m) return m[1] === '10.0' ? 'Windows 10/11' : `Windows NT ${m[1]}`;
  m = ua.match(/Mac OS X ([\d_]+)/);
  if (m) return `macOS ${m[1].replace(/_/g, '.')}`;
  if (/CrOS/.test(ua)) return 'ChromeOS';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Unknown';
}

/** Collects context automatically. Never reads form field values. */
export function captureContext(cfg: Config): Context {
  const ua = navigator.userAgent;
  return {
    viewport_w: window.innerWidth,
    viewport_h: window.innerHeight,
    dpr: Math.round((window.devicePixelRatio || 1) * 100) / 100,
    breakpoint: breakpoint(),
    browser: parseBrowser(ua),
    os: parseOs(ua),
    user_agent: ua,
    post_id: cfg.page.postId,
    post_type: cfg.page.postType,
    theme: cfg.page.theme,
    js_errors: (window.__fbcErrors ?? []).slice(-20),
  };
}

/** Path relative to the WordPress home, normalized with a trailing slash. */
export function currentPagePath(homePath: string): string {
  let path = window.location.pathname;
  const home = homePath.replace(/\/$/, '');
  if (home && path.startsWith(home)) path = path.slice(home.length);
  path = '/' + path.replace(/^\/+/, '');
  return path === '/' ? '/' : path.replace(/\/?$/, '/');
}

/** Query string minus our own deep-link parameter. */
export function currentQuery(): string {
  const params = new URLSearchParams(window.location.search);
  params.delete('fbc_item');
  return params.toString();
}

/** Also called from the inline head script, so errors before the bundle loads are kept. */
export function installErrorCollector(): void {
  if (window.__fbcErrors) return;
  const errors: string[] = (window.__fbcErrors = []);
  const push = (msg: string) => {
    errors.push(msg.slice(0, 500));
    if (errors.length > 20) errors.shift();
  };
  window.addEventListener('error', (e) => {
    if (e.message) push(`${e.message}${e.filename ? ` (${e.filename}:${e.lineno})` : ''}`);
  });
  window.addEventListener('unhandledrejection', (e) => {
    const r: unknown = e.reason;
    push(`Unhandled rejection: ${r instanceof Error ? r.message : String(r)}`);
  });
}
