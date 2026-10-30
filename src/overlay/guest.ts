import type { GuestConfig } from './types';

/**
 * The name a guest gave (guest mode), kept in a first-party cookie so every later item and
 * reply is attributed without asking again. Not HttpOnly: only the overlay reads it.
 */
export function readGuestName(cfg: GuestConfig | undefined, cookies: string = document.cookie): string {
  if (!cfg) return '';
  const prefix = `${cfg.nameCookie}=`;
  for (const part of cookies.split(';')) {
    const c = part.trim();
    if (!c.startsWith(prefix)) continue;
    try {
      return cleanGuestName(decodeURIComponent(c.slice(prefix.length)), cfg.nameMax);
    } catch {
      return '';
    }
  }
  return '';
}

/** Collapses whitespace and trims to the server's limit, so what's shown is what's stored. */
export function cleanGuestName(raw: string, max = 60): string {
  return raw.replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

/** Cookie string that remembers the name for a year. */
export function guestNameCookie(cfg: GuestConfig, name: string, secure: boolean = location.protocol === 'https:'): string {
  return `${cfg.nameCookie}=${encodeURIComponent(name)}; path=${cfg.cookiePath || '/'}; max-age=31536000; SameSite=Lax${secure ? '; Secure' : ''}`;
}

export function saveGuestName(cfg: GuestConfig | undefined, name: string): void {
  if (!cfg) return;
  const clean = cleanGuestName(name, cfg.nameMax);
  if (!clean) return;
  try {
    document.cookie = guestNameCookie(cfg, clean);
  } catch {
    /* cookies blocked: the guest is simply asked again next time */
  }
}
