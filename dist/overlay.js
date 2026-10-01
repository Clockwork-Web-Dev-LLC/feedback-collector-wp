(()=>{var D=`:host {
  all: initial;
}
* {
  box-sizing: border-box;
}
.fbc {
  all: initial;
  font: 14px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1d2327;
  --bug: #d63638;
  --tweak: #c08a00;
  --change: #2271b1;
  --comment: #8c5cc7;
  --resolved: #00a32a;
  --ink: #1d2327;
  --muted: #646970;
  --line: #dcdcde;
  --bg: #fff;
  --soft: #f6f7f7;
  --primary: #6953c4;
  --on-primary: #fff;
  --dark: #2d2062;
  --on-dark: #fff;
  --brand-accent: #7eff83;
  --accent: var(--primary);
}
/* The hidden attribute must always win over component display rules (e.g. .toolbar's flex). */
[hidden] {
  display: none !important;
}
.layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.interactive {
  pointer-events: auto;
}
button,
input,
select,
textarea {
  font: inherit;
  color: inherit;
}
button {
  cursor: pointer;
}

/* Hover outline */
.outline {
  position: fixed;
  pointer-events: none;
  border: 2px solid var(--accent);
  background: color-mix(in srgb, var(--primary) 8%, transparent);
  border-radius: 3px;
  transition: all 60ms linear;
  display: none;
}
.outline.on {
  display: block;
}
/* The element a menu or composer is open for: stays put, no hover easing. */
.outline.locked {
  transition: none;
  border-width: 2px;
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 18%, transparent);
}
.outline-tag {
  position: absolute;
  top: -22px;
  left: -2px;
  background: var(--accent);
  color: var(--on-primary);
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 3px 3px 0 0;
  white-space: nowrap;
}

/* Pins */
.pin {
  position: fixed;
  left: 0;
  top: 0;
  width: 28px;
  height: 28px;
  margin: -28px 0 0 -4px;
  border-radius: 14px 14px 14px 2px;
  border: 2px solid #fff;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  pointer-events: auto;
  cursor: pointer;
  will-change: transform;
  padding: 0;
}
.pin.bug { background: var(--bug); }
.pin.tweak { background: var(--tweak); }
.pin.change { background: var(--change); }
.pin.comment { background: var(--comment); }
.pin.resolved {
  background: var(--resolved);
}
.pin.dim {
  opacity: 0.85;
}
.pin.pulse {
  animation: pulse 0.9s ease-out 2;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--primary) 70%, transparent); }
  100% { box-shadow: 0 0 0 18px color-mix(in srgb, var(--primary) 0%, transparent); }
}

/* Cards: menu, composer, popover */
.card {
  position: fixed;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
  pointer-events: auto;
}
.menu {
  padding: 6px;
  min-width: 190px;
}
.menu-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
  padding: 4px 8px 6px;
}
.menu button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  text-align: left;
  border: 0;
  background: none;
  padding: 7px 8px;
  border-radius: 5px;
}
.menu button:hover,
.menu button:focus-visible {
  background: var(--soft);
  outline: none;
}
.menu kbd {
  margin-left: auto;
  color: var(--muted);
  font: 11px ui-monospace, monospace;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex: none;
}
.dot.bug { background: var(--bug); }
.dot.tweak { background: var(--tweak); }
.dot.change { background: var(--change); }
.dot.comment { background: var(--comment); }
.menu hr {
  border: 0;
  border-top: 1px solid var(--line);
  margin: 4px 0;
}

.composer,
.popover {
  width: 340px;
  max-width: calc(100vw - 24px);
  max-height: calc(100vh - 24px);
  overflow: auto;
  padding: 14px;
}
.head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.head .x {
  margin-left: auto;
  border: 0;
  background: none;
  font-size: 18px;
  line-height: 1;
  color: var(--muted);
  padding: 2px 6px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  background: var(--soft);
}
.field {
  display: block;
  margin-bottom: 10px;
}
.field > span {
  display: block;
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 3px;
}
.field input,
.field textarea,
.field select {
  width: 100%;
  border: 1px solid #8c8f94;
  border-radius: 4px;
  padding: 6px 8px;
  background-color: #fff;
}
/* Own chevron instead of the browser arrow: inset 12px from the edge, same in every browser. */
select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%2350575e' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 10px 6px;
  padding-right: 32px !important;
  cursor: pointer;
}
.field textarea {
  min-height: 70px;
  resize: vertical;
}
.field input:focus,
.field textarea:focus,
.field select:focus {
  outline: 2px solid var(--accent);
  outline-offset: -1px;
  border-color: var(--accent);
}
.row {
  display: flex;
  gap: 8px;
}
.row > * {
  flex: 1;
}
.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;
  margin-top: 4px;
}
.actions .left {
  margin-right: auto;
}
.btn {
  border: 1px solid #8c8f94;
  background: #fff;
  border-radius: 4px;
  padding: 5px 12px;
}
.btn.primary {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--on-primary);
}
.btn.link {
  border: 0;
  background: none;
  color: var(--ink-primary, var(--accent));
  padding: 5px 4px;
}
.btn.danger {
  color: var(--bug);
  border-color: transparent;
  background: none;
}
.btn:disabled {
  opacity: 0.6;
  cursor: default;
}
.error {
  color: var(--bug);
  font-size: 12px;
  margin: -4px 0 8px;
}
.desc {
  white-space: pre-wrap;
  margin: 0 0 10px;
  word-break: break-word;
}
.meta {
  font-size: 12px;
  color: var(--muted);
  margin-bottom: 10px;
}
.thread {
  list-style: none;
  margin: 10px 0;
  padding: 0;
  border-top: 1px solid var(--line);
}
.thread li {
  padding: 8px 0;
  border-bottom: 1px solid var(--line);
}
.thread li.activity {
  font-size: 12px;
  color: var(--muted);
}
.thread .who {
  font-weight: 600;
  font-size: 12px;
}
.thread .when {
  color: var(--muted);
  font-size: 11px;
  margin-left: 6px;
}
.thread .body {
  white-space: pre-wrap;
  word-break: break-word;
}
.notice {
  background: #fcf9e8;
  border: 1px solid #f0d78c;
  border-radius: 4px;
  padding: 6px 8px;
  font-size: 12px;
  margin-bottom: 10px;
}

/* Toolbar */
.toolbar {
  position: fixed;
  left: 0;
  top: 0;
  user-select: none;
  -webkit-user-select: none;
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 6px;
  background: var(--dark);
  color: var(--on-dark);
  border-radius: 10px;
  border-bottom: 3px solid var(--brand-accent);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
}
.toolbar button {
  border: 0;
  background: transparent;
  color: inherit;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  white-space: nowrap;
}
.toolbar button:hover,
.toolbar button.on {
  background: color-mix(in srgb, var(--on-dark) 14%, transparent);
}
.toolbar button.on {
  box-shadow: inset 0 -3px 0 var(--brand-accent);
}
.toolbar .brand img {
  height: 15px;
  width: auto;
  display: block;
}
.toolbar.snapping {
  transition: left 0.24s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.toolbar.dragging {
  cursor: grabbing;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.38);
  opacity: 0.96;
}
.toolbar .grip {
  cursor: grab;
  padding: 6px 4px;
  font-size: 15px;
  line-height: 1;
  opacity: 0.6;
  touch-action: none;
}
.toolbar .grip:hover,
.toolbar .grip:focus-visible {
  opacity: 1;
}
.toolbar.dragging .grip,
.toolbar.dragging .brand {
  cursor: grabbing;
}
.toolbar .brand {
  cursor: grab;
  touch-action: none;
}
.snap-ghost {
  position: fixed;
  border: 2px dashed var(--brand-accent);
  border-radius: 10px;
  background: color-mix(in srgb, var(--dark) 12%, transparent);
  pointer-events: none;
  transition: left 0.12s ease, top 0.12s ease;
}
@media (prefers-reduced-motion: reduce) {
  .toolbar.snapping,
  .snap-ghost {
    transition: none;
  }
}
.toolbar .brand {
  font-weight: 700;
  padding: 0 8px;
  font-size: 13px;
}
.toolbar .count {
  display: inline-block;
  min-width: 18px;
  padding: 0 5px;
  margin-left: 4px;
  border-radius: 9px;
  background: var(--bug);
  font-size: 11px;
  line-height: 18px;
  text-align: center;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: var(--top-offset, 0px);
  right: 0;
  bottom: 0;
  width: 360px;
  max-width: 100vw;
  background: var(--bg);
  border-left: 1px solid var(--line);
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  pointer-events: auto;
}
.sidebar header {
  border-bottom: 1px solid var(--line);
}
/* Header band in the brand colors, like the admin screens and the toolbar. */
.sidebar h2 {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  background: var(--dark);
  color: var(--on-dark);
  border-bottom: 3px solid var(--brand-accent);
}
.sidebar h2 .x {
  margin-left: auto;
  border: 0;
  background: none;
  font-size: 20px;
  line-height: 1;
  color: inherit;
  opacity: 0.75;
  padding: 2px 4px;
}
.sidebar h2 .x:hover,
.sidebar h2 .x:focus-visible {
  opacity: 1;
}
.filters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 12px 14px;
}
.filters select {
  width: 100%;
  border: 1px solid #8c8f94;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 13px;
  background-color: #fff;
  min-height: 30px;
}
.filters label {
  grid-column: span 2;
  font-size: 13px;
  display: flex;
  gap: 6px;
  align-items: center;
}
.list {
  overflow: auto;
  flex: 1;
  padding: 6px 0;
}
.list h3 {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted);
  margin: 12px 14px 4px;
}
.entry {
  display: flex;
  gap: 10px;
  width: 100%;
  border: 0;
  background: none;
  text-align: left;
  padding: 8px 14px;
  align-items: flex-start;
}
.entry:hover {
  background: var(--soft);
}
.entry .num {
  flex: none;
  min-width: 30px;
  font-weight: 700;
  font-size: 12px;
  color: #fff;
  border-radius: 10px;
  text-align: center;
  padding: 1px 6px;
}
.entry .num.bug { background: var(--bug); }
.entry .num.tweak { background: var(--tweak); }
.entry .num.change { background: var(--change); }
.entry .num.comment { background: var(--comment); }
.entry .num.resolved { background: var(--resolved); }
.entry .t {
  font-weight: 600;
  display: block;
}
.entry .s {
  font-size: 12px;
  color: var(--muted);
}
.empty {
  padding: 24px 14px;
  color: var(--muted);
  text-align: center;
}
.entry .reanchor {
  margin-left: auto;
  flex: none;
}

/* Banner + toast */
.banner {
  position: fixed;
  top: calc(var(--top-offset, 0px) + 12px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--dark);
  color: var(--on-dark);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  pointer-events: auto;
  display: flex;
  gap: 10px;
  align-items: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  max-width: calc(100vw - 24px);
}
.banner button {
  border: 0;
  background: color-mix(in srgb, var(--on-dark) 20%, transparent);
  color: inherit;
  border-radius: 4px;
  padding: 3px 8px;
}
.toast {
  position: fixed;
  left: 50%;
  bottom: var(--toast-bottom, 76px);
  transform: translateX(-50%);
  background: var(--dark);
  color: var(--on-dark);
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 13px;
  pointer-events: none;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}
.toast.err {
  background: var(--bug);
}
.crosshair-hint {
  position: fixed;
  top: calc(var(--top-offset, 0px) + 12px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent);
  color: var(--on-primary);
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  pointer-events: none;
}
@media (max-width: 600px) {
  .toolbar .label {
    display: none;
  }
}

/* Screenshot thumbnail in the composer and popover */
.shot {
  display: block;
  margin: 2px 0 10px;
  border: 1px solid var(--line);
  border-radius: 6px;
  overflow: hidden;
  background: var(--soft);
  font-size: 12px;
  color: var(--muted);
}
.shot:not(:has(img)) {
  padding: 10px;
}
.shot img {
  display: block;
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  object-position: top;
}
.shot-actions {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  padding: 2px 6px;
  background: #fff;
  border-top: 1px solid var(--line);
}

/* Screenshot annotator (full-screen, above everything in the overlay) */
.annotator {
  position: fixed;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  background: rgba(17, 17, 24, 0.86);
  pointer-events: auto;
}
.annotator-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: calc(var(--top-offset, 0px) + 10px) 16px 10px;
  background: var(--dark);
  color: var(--on-dark);
  border-bottom: 3px solid var(--brand-accent);
}
.annotator-group {
  display: flex;
  gap: 2px;
  align-items: center;
}
.annotator-bar button {
  border: 0;
  background: transparent;
  color: inherit;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
}
.annotator-bar button:hover,
.annotator-bar button[aria-pressed='true'] {
  background: color-mix(in srgb, var(--on-dark) 16%, transparent);
}
.annotator-bar button[aria-pressed='true'] {
  box-shadow: inset 0 -3px 0 var(--brand-accent);
}
.annotator-bar .swatch {
  width: 22px;
  height: 22px;
  padding: 0;
  border-radius: 50%;
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.6);
}
.annotator-bar .swatch[aria-checked='true'] {
  box-shadow: 0 0 0 2px var(--dark), 0 0 0 4px var(--brand-accent);
}
.annotator-spacer {
  flex: 1;
}
.annotator-bar .annotator-save {
  background: var(--primary);
  color: var(--on-primary);
  font-weight: 600;
}
.annotator-bar .annotator-save:hover {
  background: color-mix(in srgb, var(--primary) 85%, #000);
}
.annotator-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 16px;
}
.annotator-stage .canvas-container {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: hidden;
}

/* Device preview */
.preview {
  position: fixed;
  inset: 0;
  z-index: 9;
  display: flex;
  flex-direction: column;
  background: rgba(17, 17, 24, 0.9);
  pointer-events: auto;
}
.preview-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: calc(var(--top-offset, 0px) + 10px) 16px 10px;
  background: var(--dark);
  color: var(--on-dark);
  border-bottom: 3px solid var(--brand-accent);
  font-size: 13px;
}
.preview-devices {
  display: flex;
  gap: 2px;
}
.preview-bar button {
  border: 0;
  background: transparent;
  color: inherit;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
}
.preview-bar button:hover,
.preview-bar button[aria-pressed='true'] {
  background: color-mix(in srgb, var(--on-dark) 16%, transparent);
}
.preview-bar button[aria-pressed='true'] {
  box-shadow: inset 0 -3px 0 var(--brand-accent);
}
.preview-bar .preview-close {
  background: var(--primary);
  color: var(--on-primary);
  font-weight: 600;
}
.preview-label {
  opacity: 0.75;
  font-family: ui-monospace, monospace;
  font-size: 12px;
}
.preview-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.preview-device {
  position: relative;
  border-radius: 14px;
  box-shadow: 0 0 0 10px #000, 0 20px 60px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  background: #fff;
}
.preview-device iframe {
  border: 0;
  display: block;
  transform-origin: 0 0;
  background: #fff;
}
.preview-blocked:not([hidden]) {
  position: absolute;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 8px;
  padding: 18px;
  text-align: center;
}

/* Device icons (toolbar + preview switcher) */
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}
.toolbar .devices {
  display: inline-flex;
  gap: 0;
  padding: 0 2px;
  margin: 0 2px;
  border-left: 1px solid color-mix(in srgb, var(--on-dark) 22%, transparent);
  border-right: 1px solid color-mix(in srgb, var(--on-dark) 22%, transparent);
}
.toolbar .icon-btn {
  padding: 6px 7px;
}
.toolbar .icon-btn[aria-pressed='true'] {
  box-shadow: inset 0 -3px 0 var(--brand-accent);
}
.preview-bar .icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.preview-bar .icon-label {
  font-size: 12px;
}
`;var A="fbc-root";var bn=["ember","react-","__next","radix-","headlessui-","mui-","yui_","ext-gen"],gn=/[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i,fn=/^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;function un(n){let p=/[a-z]/i.test(n),o=/[0-9]/.test(n);if(!p||!o)return!1;if(n.length>=6&&/^[0-9a-f]+$/i.test(n))return!0;return n.length>=8&&/^[0-9a-z]+$/i.test(n)&&kn(n)>=2}function kn(n){let p=0;for(let o=1;o<n.length;o++){let r=/[0-9]/.test(n.charAt(o-1)),a=/[0-9]/.test(n.charAt(o));if(r!==a)p++}return p}function vn(n){if(n.trim()===""||/\s/.test(n))return!1;if(/^[0-9]/.test(n))return!1;if(/[0-9]{5,}/.test(n))return!1;if(gn.test(n))return!1;if(fn.test(n))return!1;let p=n.toLowerCase();if(bn.some((o)=>p.startsWith(o)))return!1;return!n.split(/[-_:.]/).some(un)}function dn(n){let p="",o=n.length,r=n.charCodeAt(0);for(let a=0;a<o;a++){let b=n.charCodeAt(a),i=n.charAt(a);if(b===0)p+="�";else if(b>=1&&b<=31||b===127||a===0&&b>=48&&b<=57||a===1&&b>=48&&b<=57&&r===45)p+=`\\${b.toString(16)} `;else if(a===0&&o===1&&b===45)p+=`\\${i}`;else if(b>=128||b===45||b===95||b>=48&&b<=57||b>=65&&b<=90||b>=97&&b<=122)p+=i;else p+=`\\${i}`}return p}function X(n,p){let o=p?p.CSS:void 0,r=globalThis.CSS,a=o?.escape??r?.escape;return a?a(n):dn(n)}function wn(n){return n.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}function M(n){return n.localName.toLowerCase()}function tn(n){return n.ownerDocument.defaultView}function zn(n){if(!n)return{x:0,y:0};let p=Number.isFinite(n.scrollX)?n.scrollX:0,o=Number.isFinite(n.scrollY)?n.scrollY:0;return{x:p,y:o}}function _(n){if(!Number.isFinite(n))return 0.5;return Math.min(1,Math.max(0,n))}function V(n){let p=n;while(p){if(p.id==="fbc-root")return!0;if(p.parentElement)p=p.parentElement;else{let o=p.getRootNode();p=o instanceof ShadowRoot?o.host:null}}return!1}function y(n){if(n===null)return null;let p=n.replace(/\s+/g," ").trim();if(p==="")return null;let o=Array.from(p);return o.length>120?o.slice(0,120).join(""):p}var jn=/^fl-node-(?!content$)[a-z0-9]+$/i,$n=/^[a-z0-9]+$/i;function S(n){let p=1,o=n.previousElementSibling;while(o){if(o.localName===n.localName&&o.namespaceURI===n.namespaceURI)p++;o=o.previousElementSibling}return p}function P(n,p){if(!n.id||!vn(n.id))return null;let o=`#${X(n.id,p.defaultView)}`,r=p.querySelectorAll(o);return r.length===1&&r[0]===n?o:null}function Zn(n,p){if(n===p.documentElement)return"html";let o=n.localName,r=n.getAttribute("data-id");if(r!==null&&n.classList.contains("elementor-element")&&$n.test(r))return`${o}[data-id="${wn(r)}"]`;let a=Array.from(n.classList).find((b)=>jn.test(b));if(a!==void 0)return`${o}.${X(a,p.defaultView)}`;return`${o}:nth-of-type(${S(n)})`}function Jn(n,p,o){let r=o.querySelectorAll(n);return r.length===1&&r[0]===p}function Qn(n,p){let o=[],r=n;while(r){let a=P(r,p);if(a!==null)return o.unshift(a),o.join(" > ");o.unshift(Zn(r,p));let b=o.join(" > ");if(Jn(b,n,p))return b;r=r.parentElement}return o.join(" > ")}function Hn(n,p){let o=[],r=n;while(r){let a=M(r),b=r.parentElement,i=r===p.documentElement||b===p.documentElement&&(a==="head"||a==="body");o.unshift(i?a:`${a}[${S(r)}]`),r=b}return`/${o.join("/")}`}var Kn=/^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i,Ln=/^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;function Mn(n,p){if(!Kn.test(n))return null;let o=n.slice(1).split("/"),r=null;for(let a of o){let b=Ln.exec(a);if(!b)return null;let i=(b[1]??"").toLowerCase(),g=b[2]===void 0?1:Number(b[2]),f=r?Array.from(r.children):p.documentElement?[p.documentElement]:[],u=0,d=null;for(let w of f){if(M(w)!==i)continue;if(u++,u===g){d=w;break}}if(!d)return null;r=d}return r}function R(n,p,o){if(!Number.isFinite(p)||!Number.isFinite(o))throw RangeError(`createAnchor: click coordinates must be finite (got ${p}, ${o})`);if(!n.isConnected)throw Error("createAnchor: element is not connected to a document");if(V(n))throw Error("createAnchor: refusing to anchor an element inside #fbc-root");let r=n.ownerDocument;if(n.getRootNode()!==r)throw Error("createAnchor: element is inside a shadow root; anchor its shadow host instead");let a=n.getBoundingClientRect(),b=zn(r.defaultView),i=a.width>0?_((p-a.left)/a.width):0.5,g=a.height>0?_((o-a.top)/a.height):0.5;return{id:P(n,r)!==null?n.id:null,selector:Qn(n,r),xpath:Hn(n,r),text:y(n.textContent),tag:M(n),offsetX:i,offsetY:g,docX:p+b.x,docY:o+b.y}}function W(n,p){return n!==null&&M(n)===p&&!V(n)}function Fn(n){return n instanceof DOMException||n instanceof Error&&n.name==="SyntaxError"}function Gn(n,p){if(typeof n.id!=="string"||n.id==="")return null;let o=p.getElementById(n.id);if(!o)return null;return p.querySelectorAll(`#${X(n.id,p.defaultView)}`).length===1?o:null}function Un(n,p){if(typeof n.selector!=="string"||n.selector.trim()==="")return null;let o;try{o=p.querySelectorAll(n.selector)}catch(r){if(Fn(r))return null;throw r}return o.length===1?o[0]??null:null}function Wn(n,p){if(typeof n.xpath!=="string")return null;return Mn(n.xpath,p)}function qn(n,p){if(typeof n.text!=="string"||n.text==="")return null;let o=null;for(let r of Array.from(p.getElementsByTagName("*"))){if(M(r)!==n.tag||V(r))continue;if(y(r.textContent)!==n.text)continue;if(o)return null;o=r}return o}function T(n,p=document){if(typeof n.tag!=="string"||n.tag==="")return{el:null,strategy:"none"};let o=n.tag.toLowerCase(),r=Gn(n,p);if(W(r,o))return{el:r,strategy:"id"};let a,b=()=>{if(a===void 0)a=qn({...n,tag:o},p);return W(a,o)?a:null},i=(d)=>{if(n.text===null||y(d.textContent)===n.text)return null;let w=b();return w&&w!==d?w:null},g=Un(n,p);if(W(g,o)){let d=i(g);return d?{el:d,strategy:"text"}:{el:g,strategy:"selector"}}let f=Wn(n,p);if(W(f,o)){let d=i(f);return d?{el:d,strategy:"text"}:{el:f,strategy:"xpath"}}let u=b();if(u)return{el:u,strategy:"text"};return{el:null,strategy:"none"}}function I(n){if(!n.isConnected)return!1;let p=tn(n);if(!p)return!1;let o=p.getComputedStyle(n);if(o.visibility==="hidden"||o.visibility==="collapse")return!1;let r=n;while(r){if(p.getComputedStyle(r).display==="none")return!1;r=r.parentElement}let a=n.getBoundingClientRect();return!(a.width===0&&a.height===0)}class c extends Error{status;constructor(n,p){super(n);this.status=p}}class Y{cfg;constructor(n){this.cfg=n}url(n,p){let o=this.cfg.restUrl.replace(/\/$/,"")+n;if(p){let r=new URLSearchParams(p).toString();if(r)o+=(o.includes("?")?"&":"?")+r}return o}async request(n,p,o,r){let a=typeof FormData<"u"&&o instanceof FormData,b=await fetch(this.url(p,r),{method:n,credentials:"same-origin",headers:{"X-WP-Nonce":this.cfg.nonce,...o!==void 0&&!a?{"Content-Type":"application/json"}:{}},body:o===void 0?void 0:a?o:JSON.stringify(o)}),i=await b.json().catch(()=>null);if(!b.ok){let g=i&&typeof i==="object"&&"message"in i?String(i.message):b.statusText;throw new c(g,b.status)}return i}listItems(n){return this.request("GET","/items",void 0,n?{page_path:n}:void 0)}getItem(n){return this.request("GET",`/items/${n}`)}createItem(n,p){if(!p)return this.request("POST","/items",n);let o=new FormData;return o.append("data",JSON.stringify(n)),o.append("screenshot",p,"screenshot.jpg"),this.request("POST","/items",o)}replaceScreenshot(n,p){let o=new FormData;return o.append("screenshot",p,"screenshot.jpg"),this.request("POST",`/items/${n}/screenshot`,o)}updateItem(n,p){return this.request("PATCH",`/items/${n}`,p)}deleteItem(n){return this.request("DELETE",`/items/${n}`)}addComment(n,p){return this.request("POST",`/items/${n}/comments`,{body:p})}}function F(n=window.innerWidth){if(n<768)return"mobile";if(n<=1024)return"tablet";return"desktop"}function Cn(n){let p=[[/Edg\/([\d.]+)/,"Edge"],[/OPR\/([\d.]+)/,"Opera"],[/Firefox\/([\d.]+)/,"Firefox"],[/CriOS\/([\d.]+)/,"Chrome iOS"],[/Chrome\/([\d.]+)/,"Chrome"],[/Version\/([\d.]+).*Safari/,"Safari"]];for(let[o,r]of p){let a=n.match(o);if(a)return`${r} ${a[1].split(".")[0]}`}return"Unknown"}function Nn(n){let p=n.match(/(iPhone|iPad).*OS ([\d_]+)/);if(p)return`iOS ${p[2].replace(/_/g,".")}`;if(p=n.match(/Android ([\d.]+)/),p)return`Android ${p[1]}`;if(p=n.match(/Windows NT ([\d.]+)/),p)return p[1]==="10.0"?"Windows 10/11":`Windows NT ${p[1]}`;if(p=n.match(/Mac OS X ([\d_]+)/),p)return`macOS ${p[1].replace(/_/g,".")}`;if(/CrOS/.test(n))return"ChromeOS";if(/Linux/.test(n))return"Linux";return"Unknown"}var q=null;function l(){let n=navigator.userAgentData;if(!n)return;n.getHighEntropyValues(["platform","platformVersion"]).then(({platform:p,platformVersion:o})=>{if(!p||!o)return;let[r,a]=o.split(".");if(p==="macOS")q=`macOS ${r}.${a??"0"}`;else if(p==="Windows")q=Number(r)>=13?"Windows 11":"Windows 10";else if(p==="Android"||p==="Chrome OS"||p==="Linux")q=`${p} ${o}`.trim()}).catch(()=>{})}function E(n){let p=navigator.userAgent;return{viewport_w:window.innerWidth,viewport_h:window.innerHeight,dpr:Math.round((window.devicePixelRatio||1)*100)/100,breakpoint:F(),browser:Cn(p),os:q??Nn(p),user_agent:p,post_id:n.page.postId,post_type:n.page.postType,theme:n.page.theme,js_errors:(window.__fbcErrors??[]).slice(-20),preview:Xn()}}function Xn(){try{return window.self!==window.top?window.frameElement?.getAttribute("data-device")??"":""}catch{return""}}function m(n){let p=window.location.pathname,o=n.replace(/\/$/,"");if(o&&p.startsWith(o))p=p.slice(o.length);return p="/"+p.replace(/^\/+/,""),p==="/"?"/":p.replace(/\/?$/,"/")}function h(){let n=new URLSearchParams(window.location.search);return n.delete("fbc_item"),n.toString()}function e(){if(window.__fbcErrors)return;let n=window.__fbcErrors=[],p=(o)=>{if(n.push(o.slice(0,500)),n.length>20)n.shift()};window.addEventListener("error",(o)=>{if(o.message)p(`${o.message}${o.filename?` (${o.filename}:${o.lineno})`:""}`)}),window.addEventListener("unhandledrejection",(o)=>{let r=o.reason;p(`Unhandled rejection: ${r instanceof Error?r.message:String(r)}`)})}function x(n,p={},...o){let r=document.createElement(n);for(let[a,b]of Object.entries(p)){if(b===null||b===void 0||b===!1)continue;if(a.startsWith("on")&&typeof b==="function")r.addEventListener(a.slice(2).toLowerCase(),b);else if(a==="text")r.textContent=String(b);else if(a==="value"&&"value"in r)r.value=String(b);else if(b===!0)r.setAttribute(a,"");else r.setAttribute(a,String(b))}for(let a of o){if(a===null||a===void 0||a===!1)continue;r.append(typeof a==="number"?String(a):a)}return r}function $(n,p,o,r={}){let a=x("select",{name:n,...r});for(let[b,i]of p){let g=x("option",{value:b,text:i});if(b===o)g.selected=!0;a.append(g)}return a}function B(n){let p=new Date(n).getTime();if(Number.isNaN(p))return"";let o=Math.round((Date.now()-p)/1000);if(o<60)return"just now";let r=Math.round(o/60);if(r<60)return`${r}m ago`;let a=Math.round(r/60);if(a<24)return`${a}h ago`;let b=Math.round(a/24);if(b<30)return`${b}d ago`;return new Date(n).toLocaleDateString()}var Vn={phone:'<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',tablet:'<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M11 18.5h2"/>',desktop:'<rect x="2.5" y="4" width="19" height="12.5" rx="1.5"/><path d="M8.5 20.5h7M12 16.5v4"/>'};function C(n){let p=document.createElement("span");return p.className="icon",p.setAttribute("aria-hidden","true"),p.innerHTML=`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${Vn[n]??""}</svg>`,p}var G=["bug","tweak","change","comment"],nn="fbc:mode",pn="fbc:corner",U="fbc-preview",N=[{id:"phone",label:"Mobile",w:390,h:844},{id:"tablet",label:"Tablet",w:820,h:1180},{id:"desktop",label:"Desktop",w:1440,h:900}],L=16,on=360,yn=["tl","tr","bl","br"];class s{cfg;api;host;root;pinsLayer;outline;outlineTag;toolbar=null;sidebar=null;card=null;hintEl=null;bannerEl=null;mode=!1;showResolved=!1;pinMode=null;states=new Map;allItems=null;filters={scope:"page",type:"",status:"unresolved",mine:!1,round:0,bp:""};pagePath;framePending=!1;refreshTimer=0;lastWidth=window.innerWidth;mutationObserver=null;loaded=!1;corner="br";dragging=!1;ghost=null;pendingShot=null;inPreview=window.self!==window.top&&window.name===U;previewEl=null;selectedEl=null;constructor(n){this.cfg=n;this.api=new Y(n),this.pagePath=n.pagePath??m(n.homePath)}init(){this.mount(),this.bindGlobalEvents(),this.bindAdminBar();let n=!1;try{n=window.localStorage.getItem(nn)==="1";let p=window.localStorage.getItem(pn);if(p&&yn.includes(p))this.corner=p}catch{n=!1}if(this.inPreview){let p=document.createElement("style");p.textContent="#wpadminbar{display:none!important}html{margin-top:0!important}",document.head.append(p),this.corner="bl",this.setMode(!0);return}if(this.cfg.openItem||n)this.setMode(!0)}mount(){this.host=x("div",{id:A}),this.host.setAttribute("style","all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;");let n=this.host.attachShadow({mode:"open"});n.append(x("style",{text:D})),this.root=x("div",{class:"fbc"});let p=this.cfg.brand;if(p){let r=[["--primary",p.primary],["--on-primary",p.onPrimary],["--dark",p.dark],["--on-dark",p.onDark],["--brand-accent",p.accent],["--ink-primary",p.ink??""]];for(let[a,b]of r)if(b)this.root.style.setProperty(a,b)}let o=x("div",{class:"layer"});this.outlineTag=x("span",{class:"outline-tag"}),this.outline=x("div",{class:"outline"},this.outlineTag),this.pinsLayer=x("div"),o.append(this.outline,this.pinsLayer),this.root.append(o),n.append(this.root),document.body.append(this.host)}inOverlay(n){return n.composedPath().includes(this.host)}bindGlobalEvents(){document.addEventListener("contextmenu",(n)=>this.onContextMenu(n),!0),document.addEventListener("mousemove",(n)=>this.onMouseMove(n),{capture:!0,passive:!0});for(let n of["pointerdown","mousedown","mouseup","click"])document.addEventListener(n,(p)=>this.onPinModeEvent(p),!0);document.addEventListener("mousedown",(n)=>this.onOutsideMouseDown(n),!1),document.addEventListener("keydown",(n)=>this.onKeyDown(n),!0),window.addEventListener("scroll",()=>this.schedulePosition(),{passive:!0,capture:!0}),window.addEventListener("resize",()=>{let n=window.innerWidth!==this.lastWidth;if(this.lastWidth=window.innerWidth,n)this.scheduleRefresh(80);else this.schedulePosition()})}bindAdminBar(){document.querySelector("#wp-admin-bar-fbc-toggle > a")?.addEventListener("click",(p)=>{p.preventDefault(),this.setMode(!this.mode)})}async setMode(n){if(this.mode=n,!this.inPreview)try{window.localStorage.setItem(nn,n?"1":"0")}catch{}if(document.querySelector("#wp-admin-bar-fbc-toggle")?.classList.toggle("fbc-on",n),!n){this.exitPinMode(),this.closeCard(),this.closeSidebar(),this.hideOutline(),this.toolbar?.remove(),this.toolbar=null,this.bannerEl?.remove(),this.bannerEl=null,this.pinsLayer.replaceChildren();for(let p of this.states.values())p.pin=null;this.mutationObserver?.disconnect();return}if(this.renderToolbar(),this.observeMutations(),!this.loaded)await this.loadItems();else this.refresh();if(this.cfg.openItem){let p=this.cfg.openItem;this.cfg.openItem=0,this.stripDeepLinkParam(),this.openDeepLink(p)}}stripDeepLinkParam(){let n=new URL(window.location.href);if(n.searchParams.has("fbc_item"))n.searchParams.delete("fbc_item"),window.history.replaceState(window.history.state,"",n.toString())}async loadItems(){try{let{items:n}=await this.api.listItems(this.pagePath);this.states.clear();for(let p of n)this.states.set(p.id,{item:p,el:null,placement:"orphan",pin:null});this.loaded=!0,this.refresh()}catch(n){this.toast(`Could not load feedback: ${n.message}`,!0)}}upsert(n){let p=this.states.get(n.id);if(p)p.item=n;else this.states.set(n.id,{item:n,el:null,placement:"orphan",pin:null});if(this.allItems){let o=this.allItems.findIndex((r)=>r.id===n.id);if(o>=0)this.allItems[o]=n;else this.allItems.push(n)}}remove(n){if(this.states.get(n)?.pin?.remove(),this.states.delete(n),this.allItems)this.allItems=this.allItems.filter((o)=>o.id!==n)}refresh(){for(let n of this.states.values()){if(!n.item.anchor){n.el=null,n.placement="note";continue}let p=n.el&&n.el.isConnected?n.el:T(n.item.anchor).el;n.el=p,n.placement=!p?"orphan":I(p)?"pinned":"hidden"}if(this.drawPins(),this.updateToolbarCount(),this.sidebar)this.renderSidebarList()}drawPins(){if(!this.mode)return;for(let n of this.states.values()){if(!(n.placement==="pinned"&&(this.showResolved||n.item.status!=="resolved"))){n.pin?.remove(),n.pin=null;continue}if(!n.pin){let a=x("button",{class:"pin",type:"button","aria-label":`Feedback #${n.item.id}: ${n.item.title}`,onclick:(b)=>{b.stopPropagation(),this.openPopover(n.item.id)}});n.pin=a,this.pinsLayer.append(a)}let o=n.item.status==="resolved",r=n.pin.classList.contains("pulse");n.pin.className=`pin ${n.item.type}${o?" resolved":""}${r?" pulse":""}`,n.pin.textContent=o?"✓":String(n.item.id),n.pin.title=`#${n.item.id} ${n.item.title}`}this.positionPins()}schedulePosition(){if(this.framePending||!this.mode)return;this.framePending=!0,requestAnimationFrame(()=>{if(this.framePending=!1,this.positionPins(),this.positionChrome(),this.selectedEl)this.hideOutline()})}scheduleRefresh(n=250){window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.mode&&this.refresh(),n)}positionPins(){for(let n of this.states.values()){if(!n.pin||!n.el||!n.item.anchor)continue;let p=n.el.getBoundingClientRect(),o=p.left+n.item.anchor.offsetX*p.width,r=p.top+n.item.anchor.offsetY*p.height;n.pin.style.transform=`translate(${Math.round(o)}px, ${Math.round(r)}px)`}}observeMutations(){if(!this.mutationObserver)this.mutationObserver=new MutationObserver((n)=>{if(n.every((p)=>p.target===this.host||this.host.contains(p.target)))return;this.schedulePosition(),this.scheduleRefresh(300)});this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden","open"]})}onContextMenu(n){if(!this.mode||n.altKey||this.inOverlay(n))return;let p=this.eventTarget(n);if(!p)return;n.preventDefault(),n.stopPropagation(),this.exitPinMode(),this.openTypeMenu(p,n.clientX,n.clientY)}onPinModeEvent(n){if(!this.pinMode||this.inOverlay(n)||n.button!==0)return;if(n.preventDefault(),n.stopImmediatePropagation(),n.type!=="click")return;let p=this.eventTarget(n),o=this.pinMode;if(this.exitPinMode(),p)o.done(p,n.clientX,n.clientY)}onOutsideMouseDown(n){if(this.card&&!this.inOverlay(n))this.closeCard()}onMouseMove(n){if(!this.mode||this.card&&!this.pinMode||this.inOverlay(n)){if(!this.pinMode)this.hideOutline();return}let p=this.eventTarget(n);if(!p||p===document.documentElement||p===document.body){this.hideOutline();return}this.drawOutline(p)}drawOutline(n){let p=n.getBoundingClientRect();Object.assign(this.outline.style,{left:`${p.left}px`,top:`${p.top}px`,width:`${p.width}px`,height:`${p.height}px`});let o=n.id?`#${n.id}`:"";this.outlineTag.textContent=`${n.tagName.toLowerCase()}${o}`,this.outline.classList.add("on")}onKeyDown(n){if(this.annotating)return;let p=n.composedPath()[0],o=p instanceof HTMLElement&&(p.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(p.tagName));if(n.altKey&&n.shiftKey&&n.code==="KeyF"&&!o){n.preventDefault(),this.setMode(!this.mode);return}if(n.key==="Escape"&&this.previewEl){n.preventDefault(),this.closePreview();return}if(n.key==="Escape"&&this.mode){if(this.pinMode)this.exitPinMode(),n.preventDefault();else if(this.card)this.closeCard(),n.preventDefault();else if(this.sidebar)this.closeSidebar(),n.preventDefault()}}eventTarget(n){let p=n.target;if(p instanceof Element)return p;if(p instanceof Node)return p.parentElement;return null}hideOutline(){if(this.selectedEl?.isConnected){this.drawOutline(this.selectedEl),this.outline.classList.add("locked");return}this.outline.classList.remove("on","locked")}enterPinMode(n){this.closeCard(),this.pinMode=n,this.hintEl?.remove(),this.hintEl=x("div",{class:"crosshair-hint",text:`${n.hint} · Esc to cancel`}),this.root.append(this.hintEl),document.documentElement.style.cursor="crosshair",this.renderToolbar()}exitPinMode(){if(!this.pinMode)return;this.pinMode=null,this.hintEl?.remove(),this.hintEl=null,document.documentElement.style.cursor="",this.hideOutline(),this.renderToolbar()}scripts=new Map;annotating=!1;async annotate(n){if(this.annotating)return null;this.annotating=!0;try{if(!window.FBCAnnotator)await this.loadBundle("annotator.js");let p=window.FBCAnnotator;if(!p)throw Error("The annotator could not load.");let o=this.cfg.brand?.primary??"#6953c4";return await p.open({image:n,mount:this.root,colors:["#e5383b",o,"#ffb703","#ffffff","#111111"]})}catch(p){return this.toast(p.message,!0),null}finally{this.annotating=!1}}loadBundle(n){let p=this.scripts.get(n);if(p)return p;let o=this.cfg.assetsUrl??"",r=new Promise((a,b)=>{let i=document.createElement("script");i.src=`${o}${n}${this.cfg.version?`?ver=${encodeURIComponent(this.cfg.version)}`:""}`,i.async=!0,i.onload=()=>a(),i.onerror=()=>{this.scripts.delete(n),b(Error(`Could not load ${n}`))},document.head.append(i)});return this.scripts.set(n,r),r}async startCapture(n){if(!this.cfg.shots||!this.cfg.assetsUrl)return null;try{if(!window.FBCCapture)await this.loadBundle("capture.js");let p=window.FBCCapture;if(!p)return null;return await p.captureViewport({marker:n,color:this.cfg.brand?.primary??"#6953c4"})}catch{return null}}assigneeOptions(){return[["0","Unassigned"],...this.cfg.assignees.people.map((n)=>[String(n.id),n.name])]}assigneeLabel(){return this.cfg.assignees.source==="teamwork"?"Assignee (Teamwork)":"Assignee"}safeAnchor(n,p,o){try{return R(n,p,o)}catch{return this.toast("Can't pin to that element. Try its container, or add a page note.",!0),null}}closeCard(n=!1){if(this.card?.remove(),this.card=null,!n)this.selectedEl=null,this.hideOutline()}showCard(n,p,o){this.closeCard(!0),this.hideOutline(),this.card=n,n.style.left="0px",n.style.top="0px",n.style.visibility="hidden",this.root.append(n);let{offsetWidth:r,offsetHeight:a}=n,b=Math.max(12,Math.min(p+8,window.innerWidth-r-12)),i=Math.max(this.topOffset()+12,Math.min(o+8,window.innerHeight-a-12));n.style.left=`${b}px`,n.style.top=`${i}px`,n.style.visibility=""}openTypeMenu(n,p,o){this.pendingShot=this.startCapture({x:p,y:o}),this.selectedEl=n;let r=this.cfg.labels.type,a=(g)=>this.openComposer(g,n,p,o),b=G.map((g,f)=>x("button",{type:"button",onclick:()=>a(g)},x("span",{class:`dot ${g}`}),r[g],x("kbd",{text:String(f+1)}))),i=x("div",{class:"card menu",role:"menu",onkeydown:(g)=>{let f=g.key,u=Number(f);if(u>=1&&u<=G.length)g.preventDefault(),a(G[u-1])}},x("div",{class:"menu-title",text:"Add feedback"}),...b,x("hr"),x("button",{type:"button",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},"Note for the whole page"));this.showCard(i,p,o),b[0].focus()}openComposer(n,p,o,r){this.selectedEl=p;let a=null;if(p){if(a=this.safeAnchor(p,o,r),!a)return}let b=this.cfg.labels,i=$("type",G.map((t)=>[t,b.type[t]]),n),g=x("input",{type:"text",name:"title",maxlength:255,required:!0,placeholder:"What needs attention?",autocomplete:"off"}),f=x("textarea",{name:"description",placeholder:"Details, steps to reproduce, what you expected… (optional)"}),u=$("priority",Object.keys(b.priority).map((t)=>[t,b.priority[t]]),"medium"),d=$("assignee_id",this.assigneeOptions(),"0"),w=x("div",{class:"error",role:"alert"}),j=x("button",{class:"btn primary",type:"submit",text:"Add"}),J=this.pendingShot??this.startCapture(p?{x:o,y:r}:null);this.pendingShot=null;let z=null,Z="",Q=x("div",{class:"shot","aria-live":"polite"}),k=()=>{if(Z)URL.revokeObjectURL(Z);Z=z?URL.createObjectURL(z):"",Q.replaceChildren(...z?[x("img",{src:Z,alt:"Screenshot that will be attached"}),x("div",{class:"shot-actions"},x("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{if(!z)return;let t=await this.annotate(z);if(t)z=t,J=Promise.resolve(t),k()}}),this.cfg.shots?x("button",{type:"button",class:"btn link",text:"Remove screenshot",onclick:()=>{z=null,J=Promise.resolve(null),k()}}):null)]:[]),Q.hidden=!z};if(this.cfg.shots)Q.textContent="Capturing screenshot…",J.then((t)=>{if(z=t,k(),!t)Q.hidden=!0});else Q.hidden=!0;let v=x("form",{class:"card composer",novalidate:!0,onsubmit:(t)=>{t.preventDefault(),H()}},x("div",{class:"head"},x("span",{class:"chip"},x("span",{class:`dot ${n}`}),p?`<${p.tagName.toLowerCase()}>`:"Whole page"),x("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),x("label",{class:"field"},x("span",{text:"Title"}),g),w,x("label",{class:"field"},x("span",{text:"Description"}),f),x("div",{class:"row"},x("label",{class:"field"},x("span",{text:"Type"}),i),x("label",{class:"field"},x("span",{text:"Priority"}),u)),x("label",{class:"field"},x("span",{text:this.assigneeLabel()}),d),this.cfg.assignees.fallback?x("div",{class:"meta hint",text:"Showing WordPress users until Teamwork is connected (Feedback → Settings). Then this lists your Teamwork project members."}):null,Q,x("div",{class:"actions"},x("button",{class:"btn link",type:"button",text:"Cancel",onclick:()=>this.closeCard()}),j)),H=async()=>{if(!g.value.trim()){w.textContent="Add a short title.",g.focus();return}j.disabled=!0;try{let t=this.cfg.shots?await Promise.race([J,new Promise((xn)=>window.setTimeout(()=>xn(null),1e4))]):null,K=await this.api.createItem({type:i.value,title:g.value.trim(),description:f.value,priority:u.value,assignee_id:Number(d.value),page_path:this.pagePath,page_query:h(),page_title:document.title,anchor:a,context:E(this.cfg)},z??t);if(Z)URL.revokeObjectURL(Z);this.closeCard(),this.upsert(K);let O=this.states.get(K.id);if(O&&p)O.el=p;if(this.refresh(),K.screenshot_error)this.toast(`Added #${K.id}, but the screenshot wasn’t saved: ${K.screenshot_error}`,!0);else this.toast(`Added #${K.id}`)}catch(t){w.textContent=t.message,j.disabled=!1}};this.showCard(v,o,r),g.focus()}async openPopover(n,p){let o;try{o=await this.api.getItem(n)}catch(v){this.toast(v.message,!0);return}this.upsert(o);let r=this.cfg.labels,a=this.states.get(n),b=a?.pin?.getBoundingClientRect(),i=p?.x??(b?b.right:window.innerWidth/2-170),g=p?.y??(b?b.top:100),f=async(v)=>{try{let H=await this.api.updateItem(n,v);this.upsert(H),this.refresh(),this.openPopover(n,{x:parseFloat(k.style.left)-8,y:parseFloat(k.style.top)-8})}catch(H){this.toast(H.message,!0)}},u=$("status",Object.keys(r.status).map((v)=>[v,r.status[v]]),o.status,{onchange:()=>void f({status:u.value})}),d=$("assignee_id",this.assigneeOptions(),String(o.assignee_id),{onchange:()=>void f({assignee_id:Number(d.value)})}),w=$("priority",Object.keys(r.priority).map((v)=>[v,r.priority[v]]),o.priority,{onchange:()=>void f({priority:w.value})}),j=x("textarea",{placeholder:"Reply…",rows:2}),J=x("ul",{class:"thread"},...(o.comments??[]).map((v)=>x("li",{class:v.kind},x("span",{class:"who",text:v.user_name}),x("span",{class:"when",text:B(v.created_at)}),x("div",{class:"body",text:v.body})))),z=F(),Z=o.breakpoint&&o.breakpoint!==z?x("div",{class:"notice",text:`Logged at ${o.breakpoint} (${o.context?.viewport_w??"?"}px). You are on ${z} (${window.innerWidth}px).`}):null,Q=a?.placement==="orphan"?x("div",{class:"notice",text:"The element this was pinned to can’t be found on the page anymore. Re-anchor it."}):null,k=x("div",{class:"card popover",role:"dialog","aria-label":`Feedback #${o.id}`},x("div",{class:"head"},x("span",{class:"chip"},x("span",{class:`dot ${o.type}`}),`${r.type[o.type]} #${o.id}`),x("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),x("div",{class:"t",style:"font-weight:700;font-size:15px;margin-bottom:4px",text:o.title}),x("div",{class:"meta",text:`Round ${o.round} · ${o.reporter_name} · ${B(o.created_at)}`}),o.breakpoint?x("div",{class:"meta bp-line"},x("span",{class:"chip",text:o.breakpoint}),` ${o.context?.viewport_w??"?"}px wide${o.context?.preview?` · ${o.context.preview} preview`:""}`):null,o.tw_task_url?x("div",{class:"meta"},x("a",{href:o.tw_task_url,target:"_blank",rel:"noopener",text:`Teamwork task #${o.tw_task_id} ↗`}),o.status==="resolved"?" · completed":" · status syncs from Teamwork"):null,Z,Q,o.description?x("p",{class:"desc",text:o.description}):null,o.screenshot_url?x("div",{class:"shot"},x("a",{href:o.screenshot_url,target:"_blank",rel:"noopener",title:"Open full screenshot"},x("img",{src:o.screenshot_url,alt:"Screenshot from when this was filed"})),x("div",{class:"shot-actions"},x("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{try{let v=await fetch(o.screenshot_url,{credentials:"same-origin",cache:"no-store"}),H=await this.annotate(await v.blob());if(!H)return;let t=await this.api.replaceScreenshot(o.id,H);this.upsert(t),this.toast(`Annotations saved on #${o.id}`),this.openPopover(n,{x:parseFloat(k.style.left)-8,y:parseFloat(k.style.top)-8})}catch(v){this.toast(v.message,!0)}}}))):null,x("div",{class:"row"},x("label",{class:"field"},x("span",{text:"Status"}),u),x("label",{class:"field"},x("span",{text:"Priority"}),w)),o.assignee_locked?x("div",{class:"field"},x("span",{text:this.assigneeLabel()}),x("div",{text:o.assignee_name||"Unassigned"}),x("div",{class:"meta",text:"In Teamwork now: change the assignee there."})):x("label",{class:"field"},x("span",{text:this.assigneeLabel()}),d),J,x("label",{class:"field"},j),x("div",{class:"actions"},o.anchor||a?.placement==="note"?x("button",{class:"btn link left",type:"button",text:"Re-anchor",onclick:()=>this.reanchor(o.id)}):null,x("a",{class:"btn link",href:`${this.cfg.adminUrl}&item=${o.id}`,target:"_blank",rel:"noopener",text:"Admin"}),o.can_delete?x("button",{class:"btn danger",type:"button",text:"Delete",onclick:()=>void this.deleteItem(o.id)}):null,x("button",{class:"btn primary",type:"button",text:"Reply",onclick:async()=>{if(!j.value.trim())return;try{await this.api.addComment(o.id,j.value),this.openPopover(n,{x:parseFloat(k.style.left)-8,y:parseFloat(k.style.top)-8})}catch(v){this.toast(v.message,!0)}}})));this.showCard(k,i,g)}reanchor(n){this.enterPinMode({hint:`Click the element #${n} belongs to`,done:async(p,o,r)=>{try{let a=this.safeAnchor(p,o,r);if(!a)return;let b=await this.api.updateItem(n,{anchor:a});this.upsert(b);let i=this.states.get(n);if(i)i.el=p;this.refresh(),this.toast(`Re-anchored #${n}`)}catch(a){this.toast(a.message,!0)}}})}async deleteItem(n){if(!window.confirm(`Delete feedback #${n}? This can’t be undone.`))return;try{await this.api.deleteItem(n),this.closeCard(),this.remove(n),this.refresh(),this.toast(`Deleted #${n}`)}catch(p){this.toast(p.message,!0)}}async openDeepLink(n){let p=this.states.get(n);if(p?.el&&p.placement==="pinned")p.el.scrollIntoView({block:"center",behavior:"auto"}),await new Promise((r)=>requestAnimationFrame(()=>r(null))),this.positionPins(),p.pin?.classList.add("pulse");let o=p?.item;if(o?.breakpoint&&o.breakpoint!==F())this.showBanner(`#${n} was logged at ${o.breakpoint} (${o.context?.viewport_w??"?"}px wide). You're viewing at ${F()} (${window.innerWidth}px). Resize to reproduce.`);await this.openPopover(n)}unresolvedCount(){let n=0;for(let p of this.states.values())if(p.item.status!=="resolved")n++;return n}renderToolbar(){if(!this.mode)return;let n=this.unresolvedCount(),p=x("div",{class:"toolbar",role:"toolbar","aria-label":this.cfg.brand?.name??"Feedback"},x("button",{type:"button",class:"grip",title:"Drag to move · arrow keys snap to a corner","aria-label":"Move toolbar: drag, or use arrow keys to snap to a corner",text:"⠿",onpointerdown:(r)=>this.startDrag(r),onkeydown:(r)=>this.onGripKey(r)}),this.cfg.brand?.logo?x("span",{class:"brand",title:`${this.cfg.brand.name} · drag to move`,onpointerdown:(r)=>this.startDrag(r)},x("img",{src:this.cfg.brand.logo,alt:this.cfg.brand.name})):x("span",{class:"brand",title:"Drag to move",text:this.cfg.brand?.label??"Feedback",onpointerdown:(r)=>this.startDrag(r)}),x("button",{type:"button",class:this.pinMode?"on":"",title:"Click an element to pin feedback (or right-click anywhere)",text:"+ Add",onclick:()=>this.pinMode?this.exitPinMode():this.enterPinMode({hint:"Click any element to add feedback",done:(r,a,b)=>this.openTypeMenu(r,a,b)})}),x("button",{type:"button",text:"Page note",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)}),this.inPreview?null:x("span",{class:"devices",role:"group","aria-label":"Preview at a device size"},...N.map((r)=>r.id==="desktop"?x("button",{type:"button",class:"icon-btn","aria-pressed":"true",title:"Desktop: the page as you see it now","aria-label":"Desktop view (current)",onclick:()=>this.closePreview()},C(r.id)):x("button",{type:"button",class:"icon-btn","aria-pressed":"false",title:`Preview as ${r.label} (${r.w}px)`,"aria-label":`Preview as ${r.label}, ${r.w} pixels wide`,onclick:()=>this.openPreview(r.id)},C(r.id)))),x("button",{type:"button",class:this.sidebar?"on":"",onclick:()=>this.sidebar?this.closeSidebar():this.openSidebar()},x("span",{class:"label",text:"List"}),n?x("span",{class:"count",text:String(n)}):null),x("button",{type:"button",class:this.showResolved?"on":"",title:"Show resolved pins",text:"✓ Resolved",onclick:()=>{this.showResolved=!this.showResolved,this.drawPins(),this.renderToolbar()}}),x("button",{type:"button",title:"Exit Feedback mode (Alt+Shift+F)","aria-label":"Exit Feedback mode",text:"×",onclick:()=>void this.setMode(!1)})),o=!!this.toolbar;if(p.hidden=!!this.previewEl,this.toolbar)this.toolbar.replaceWith(p);else this.root.append(p);if(this.toolbar=p,this.positionToolbar(!1),!o)this.positionChrome()}updateToolbarCount(){this.renderToolbar()}openPreview(n,p=!1){if(n==="desktop"){this.closePreview();return}let o=N.find((k)=>k.id===n)??N[0],r=p?o.h:o.w,a=p?o.w:o.h,b=`${o.label} ${r}×${a}`;this.closeCard(),this.exitPinMode();let i=this.previewEl?.querySelector("iframe"),g=new URL(i?.contentWindow?.location.href??window.location.href);g.searchParams.delete("fbc_item"),g.searchParams.set("fbc_preview","1"),this.previewEl?.remove();let f=x("iframe",{name:U,title:`${b} preview`,"data-device":b,src:g.toString()});f.style.width=`${r}px`,f.style.height=`${a}px`;let u=x("div",{class:"preview-device"},f),d=x("div",{class:"preview-stage"},u),w=x("div",{class:"preview-blocked",hidden:!0}),j=N.map((k)=>x("button",{type:"button",class:"icon-btn","aria-pressed":String(k.id===o.id),title:k.id==="desktop"?"Desktop: back to the page itself":`${k.label} (${k.w}px)`,"aria-label":k.id==="desktop"?"Desktop: close the preview":`${k.label}, ${k.w} pixels wide`,onclick:()=>k.id==="desktop"?this.closePreview():this.openPreview(k.id,k.id===o.id?p:!1)},C(k.id),x("span",{class:"icon-label",text:k.label}))),J=()=>{window.open(g.toString(),U,`width=${r},height=${a},resizable=yes,scrollbars=yes`)},z=x("div",{class:"preview-bar",role:"toolbar","aria-label":"Device preview"},x("strong",{text:"Device preview"}),x("div",{class:"preview-devices"},...j),x("button",{type:"button",title:"Rotate",text:"⟲ Rotate",onclick:()=>this.openPreview(o.id,!p)}),x("span",{class:"preview-label",text:b}),x("span",{class:"annotator-spacer"}),x("button",{type:"button",text:"Open in a window",onclick:J}),x("button",{type:"button",class:"preview-close",text:"Done",onclick:()=>this.closePreview()})),Z=x("div",{class:"preview",role:"dialog","aria-label":`Device preview: ${b}`},z,d,w);if(this.previewEl=Z,this.root.append(Z),requestAnimationFrame(()=>{let k=d.getBoundingClientRect(),v=Math.min(1,(k.width-32)/r,(k.height-32)/a);u.style.width=`${Math.round(r*v)}px`,u.style.height=`${Math.round(a*v)}px`,f.style.transform=`scale(${v})`}),f.addEventListener("load",()=>{let k=!1;try{k=!!f.contentDocument&&f.contentDocument.location.href!=="about:blank"}catch{k=!1}if(!k)w.hidden=!1,w.replaceChildren(x("p",{text:"This site can’t be shown in a frame here."}),x("button",{type:"button",class:"btn primary",text:`Open ${b} in a window`,onclick:J}))}),this.pinsLayer.hidden=!0,this.toolbar)this.toolbar.hidden=!0;this.closeSidebar()}closePreview(){if(!this.previewEl)return;if(this.previewEl.remove(),this.previewEl=null,this.pinsLayer.hidden=!1,this.toolbar)this.toolbar.hidden=!1;this.loaded=!1,this.loadItems()}topOffset(){let n=document.getElementById("wpadminbar");if(!n)return 0;let p=n.getBoundingClientRect();return p.height>0?Math.max(0,Math.round(p.bottom)):0}toolbarTarget(n){let p=this.toolbar,o=p?.offsetWidth??0,r=p?.offsetHeight??0,a=this.topOffset(),b=n.endsWith("l")?L:window.innerWidth-o-L;if(n.endsWith("r")&&this.sidebar&&window.innerWidth>=on+o+L*2)b-=on;let i=n.startsWith("t")?a+L:window.innerHeight-r-L;return{x:Math.max(0,b),y:Math.max(a,i)}}nearestCorner(n,p){let o=this.topOffset(),r=p<o+(window.innerHeight-o)/2?"t":"b",a=n<window.innerWidth/2?"l":"r";return`${r}${a}`}positionToolbar(n=!1){let p=this.toolbar;if(!p||this.dragging)return;let{x:o,y:r}=this.toolbarTarget(this.corner);p.classList.toggle("snapping",n),p.style.left=`${o}px`,p.style.top=`${r}px`,p.dataset.corner=this.corner}positionChrome(){this.root.style.setProperty("--top-offset",`${this.topOffset()}px`);let n=this.toolbar?.offsetHeight??0,p=this.toolbar&&this.corner.startsWith("b")?n+L*2:24;this.root.style.setProperty("--toast-bottom",`${p}px`),this.positionToolbar(!1)}setCorner(n){this.corner=n;try{if(!this.inPreview)window.localStorage.setItem(pn,n)}catch{}this.positionToolbar(!0),this.positionChrome()}startDrag(n){let p=this.toolbar;if(!p||n.button!==0)return;n.preventDefault(),n.stopPropagation();let o=p.getBoundingClientRect(),r=n.clientX-o.left,a=n.clientY-o.top;this.dragging=!0,p.classList.remove("snapping"),p.classList.add("dragging"),this.ghost?.remove(),this.ghost=x("div",{class:"snap-ghost"}),Object.assign(this.ghost.style,{width:`${o.width}px`,height:`${o.height}px`}),this.root.append(this.ghost);let b=(g)=>{let f=this.topOffset(),u=Math.min(Math.max(g.clientX-r,0),window.innerWidth-o.width),d=Math.min(Math.max(g.clientY-a,f),window.innerHeight-o.height);p.style.left=`${u}px`,p.style.top=`${d}px`;let w=this.nearestCorner(u+o.width/2,d+o.height/2),j=this.toolbarTarget(w);if(this.ghost)Object.assign(this.ghost.style,{left:`${j.x}px`,top:`${j.y}px`});p.dataset.target=w},i=(g)=>{window.removeEventListener("pointermove",b,!0),window.removeEventListener("pointerup",i,!0),window.removeEventListener("pointercancel",i,!0);let f=p.getBoundingClientRect();this.dragging=!1,p.classList.remove("dragging"),this.ghost?.remove(),this.ghost=null,delete p.dataset.target,this.setCorner(g.type==="pointercancel"?this.corner:this.nearestCorner(f.left+f.width/2,f.top+f.height/2))};window.addEventListener("pointermove",b,!0),window.addEventListener("pointerup",i,!0),window.addEventListener("pointercancel",i,!0)}onGripKey(n){let o={ArrowLeft:(r)=>`${r[0]}l`,ArrowRight:(r)=>`${r[0]}r`,ArrowUp:(r)=>`t${r[1]}`,ArrowDown:(r)=>`b${r[1]}`}[n.key];if(!o)return;n.preventDefault(),this.setCorner(o(this.corner)),this.toolbar?.querySelector(".grip")?.focus()}openSidebar(){this.sidebar?.remove();let n=this.filters,p=this.cfg.labels,o=$("scope",[["page","This page"],["all","All pages"]],n.scope,{onchange:()=>{n.scope=o.value,this.renderSidebarList()}}),r=$("type",[["","All types"],...G.map((u)=>[u,p.type[u]])],n.type,{onchange:()=>{n.type=r.value,this.renderSidebarList()}}),a=$("status",[["unresolved","Unresolved"],["","Any status"],...Object.keys(p.status).map((u)=>[u,p.status[u]])],n.status,{onchange:()=>{n.status=a.value,this.renderSidebarList()}}),b=[["0","All rounds"]];for(let u=this.cfg.round;u>=1;u--)b.push([String(u),u===this.cfg.round?`Round ${u} (current)`:`Round ${u}`]);let i=$("round",b,String(n.round),{onchange:()=>{n.round=Number(i.value),this.renderSidebarList()}}),g=$("bp",[["","All breakpoints"],["mobile","Mobile"],["tablet","Tablet"],["desktop","Desktop"]],n.bp,{onchange:()=>{n.bp=g.value,this.renderSidebarList()}}),f=x("input",{type:"checkbox",onchange:()=>{n.mine=f.checked,this.renderSidebarList()}});f.checked=n.mine,this.sidebar=x("div",{class:"sidebar",role:"complementary","aria-label":"Feedback list"},x("header",{},x("h2",{},this.cfg.brand?.label??"Feedback",x("button",{class:"x",type:"button","aria-label":"Close list",text:"×",onclick:()=>this.closeSidebar()})),x("div",{class:"filters"},o,r,a,i,g,x("label",{},f,"Assigned to me"))),x("div",{class:"list"})),this.root.append(this.sidebar),this.renderToolbar(),this.renderSidebarList()}closeSidebar(){this.sidebar?.remove(),this.sidebar=null,this.renderToolbar()}matches(n){let p=this.filters;if(p.type&&n.type!==p.type)return!1;if(p.round&&n.round!==p.round)return!1;if(p.bp&&n.breakpoint!==p.bp)return!1;if(p.status==="unresolved"&&n.status==="resolved")return!1;if(p.status&&p.status!=="unresolved"&&n.status!==p.status)return!1;if(p.mine&&(!this.cfg.assignees.me||n.assignee_id!==this.cfg.assignees.me))return!1;return!0}async renderSidebarList(){let n=this.sidebar?.querySelector(".list");if(!n)return;let p=(a,b,i)=>x("button",{class:"entry",type:"button",onclick:b},x("span",{class:`num ${a.status==="resolved"?"resolved":a.type}`,text:`#${a.id}`}),x("span",{},x("span",{class:"t",text:a.title}),x("span",{class:"s",text:`Round ${a.round} · ${this.cfg.labels.status[a.status]}${a.assignee_name?` · ${a.assignee_name}`:""}${a.breakpoint?` · ${a.breakpoint}`:""}`})),i??null);if(this.filters.scope==="all"){if(!this.allItems){n.replaceChildren(x("div",{class:"empty",text:"Loading…"}));try{this.allItems=(await this.api.listItems()).items}catch(i){n.replaceChildren(x("div",{class:"empty",text:i.message}));return}}let a=new Map;for(let i of this.allItems.filter((g)=>this.matches(g))){let g=a.get(i.page_path)??[];g.push(i),a.set(i.page_path,g)}let b=[];for(let[i,g]of a){b.push(x("h3",{text:i===this.pagePath?`${i} (this page)`:i}));for(let f of g)b.push(p(f,()=>{if(f.page_path===this.pagePath)this.focusItem(f.id);else{let u=new URL(f.page_url,window.location.origin);u.searchParams.set("fbc_item",String(f.id)),window.location.href=u.toString()}}))}n.replaceChildren(...b.length?b:[x("div",{class:"empty",text:"Nothing matches these filters."})]);return}let o={pinned:{title:"On this page",nodes:[]},note:{title:"Page notes",nodes:[]},hidden:{title:"At other breakpoints",nodes:[]},orphan:{title:"Orphaned — element not found",nodes:[]}};for(let a of[...this.states.values()].sort((b,i)=>b.item.id-i.item.id)){if(!this.matches(a.item))continue;let b=a.placement==="orphan"?x("span",{class:"btn link reanchor",role:"button",text:"Re-anchor",onclick:(i)=>{i.stopPropagation(),this.reanchor(a.item.id)}}):null;o[a.placement].nodes.push(p(a.item,()=>this.focusItem(a.item.id),b))}let r=[];for(let a of["pinned","note","hidden","orphan"]){let b=o[a];if(!b.nodes.length)continue;let i=a==="hidden"?`${b.nodes.length} at other breakpoints`:b.title;r.push(x("h3",{text:i}),...b.nodes)}n.replaceChildren(...r.length?r:[x("div",{class:"empty",text:"No feedback on this page yet. Right-click anything to add some."})])}focusItem(n){let p=this.states.get(n);if(!p)return;if(p.placement==="pinned"&&p.el){if(p.item.status==="resolved"&&!this.showResolved)this.showResolved=!0,this.drawPins();p.el.scrollIntoView({block:"center",behavior:"smooth"}),window.setTimeout(()=>{this.positionPins(),p.pin?.classList.remove("pulse"),p.pin?.offsetWidth,p.pin?.classList.add("pulse"),this.openPopover(n)},450)}else this.openPopover(n,{x:window.innerWidth-720,y:80})}toast(n,p=!1){let o=x("div",{class:`toast${p?" err":""}`,role:"status",text:n});this.root.append(o),window.setTimeout(()=>o.remove(),p?5000:2200)}showBanner(n){this.bannerEl?.remove(),this.bannerEl=x("div",{class:"banner",role:"status"},x("span",{text:n}),x("button",{type:"button",text:"Dismiss",onclick:()=>{this.bannerEl?.remove(),this.bannerEl=null}})),this.root.append(this.bannerEl)}}e();l();function Yn(){if(window.self===window.top)return!0;if(window.name!==U)return!1;try{return window.parent.location.origin===window.location.origin}catch{return!1}}function rn(){let n=window.fbcConfig;if(!n||!Yn())return;new s(n).init()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",rn,{once:!0});else rn();})();
