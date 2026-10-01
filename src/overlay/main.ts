import { App } from './app';
import { installErrorCollector, prefetchPlatform } from './capture';

installErrorCollector();
prefetchPlatform();

function start(): void {
  const cfg = window.fbcConfig;
  if (!cfg || window.self !== window.top) return;
  new App(cfg).init();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}
