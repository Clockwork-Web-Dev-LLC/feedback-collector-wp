import { App, PREVIEW_FRAME_NAME } from './app';
import { installErrorCollector, prefetchPlatform } from './capture';

installErrorCollector();
prefetchPlatform();

/**
 * The overlay runs in the top window, and inside our own device-preview frame. The frame is
 * recognized by window.name (which survives navigation inside the frame, unlike a query arg)
 * and only when its parent is this same site; any other frame is left alone.
 */
function allowedHere(): boolean {
  if (window.self === window.top) return true;
  if (window.name !== PREVIEW_FRAME_NAME) return false;
  try {
    return window.parent.location.origin === window.location.origin;
  } catch {
    return false;
  }
}

function start(): void {
  const cfg = window.fbcConfig;
  if (!cfg || !allowedHere()) return;
  new App(cfg).init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}
