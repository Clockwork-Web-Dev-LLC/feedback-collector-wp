import { describe, expect, test } from 'bun:test';
import { cleanGuestName, guestNameCookie, readGuestName } from '../src/overlay/guest';

const cfg = { nameCookie: 'fbcol_guest_name', nameMax: 60, cookiePath: '/' };

describe('guest name cookie', () => {
  test('reads the remembered name among other cookies', () => {
    expect(readGuestName(cfg, 'a=1; fbcol_guest_name=Amanda%20B.; wp_fbcol_guest=v1.x')).toBe('Amanda B.');
  });
  test('missing, malformed or no guest mode → empty', () => {
    expect(readGuestName(cfg, 'a=1')).toBe('');
    expect(readGuestName(cfg, 'fbcol_guest_name=%E0%A4%A')).toBe('');
    expect(readGuestName(undefined, 'fbcol_guest_name=Bo')).toBe('');
  });
  test('does not match a cookie that merely ends with the name', () => {
    expect(readGuestName(cfg, 'xfbcol_guest_name=Eve')).toBe('');
  });
  test('cleans whitespace, angle brackets, control chars and length', () => {
    expect(cleanGuestName('  Jane \n  Doe <b> ')).toBe('Jane Doe b');
    expect(cleanGuestName('x'.repeat(100), 60)).toHaveLength(60);
  });
  test('cookie string round-trips and is a year, Lax, Secure on https', () => {
    const c = guestNameCookie(cfg, 'Zoë; O’Neil', true);
    expect(c).toContain('max-age=31536000');
    expect(c).toContain('SameSite=Lax');
    expect(c).toContain('Secure');
    expect(readGuestName(cfg, c.split(';')[0])).toBe('Zoë; O’Neil');
    expect(guestNameCookie(cfg, 'a', false)).not.toContain('Secure');
  });
});
