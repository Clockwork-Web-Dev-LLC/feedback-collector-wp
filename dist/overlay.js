(()=>{var _=`:host {
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
`;var A="fbc-root";var ap=["ember","react-","__next","radix-","headlessui-","mui-","yui_","ext-gen"],bp=/[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i,gp=/^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;function fp(p){let n=/[a-z]/i.test(p),x=/[0-9]/.test(p);if(!n||!x)return!1;if(p.length>=6&&/^[0-9a-f]+$/i.test(p))return!0;return p.length>=8&&/^[0-9a-z]+$/i.test(p)&&up(p)>=2}function up(p){let n=0;for(let x=1;x<p.length;x++){let o=/[0-9]/.test(p.charAt(x-1)),a=/[0-9]/.test(p.charAt(x));if(o!==a)n++}return n}function ip(p){if(p.trim()===""||/\s/.test(p))return!1;if(/^[0-9]/.test(p))return!1;if(/[0-9]{5,}/.test(p))return!1;if(bp.test(p))return!1;if(gp.test(p))return!1;let n=p.toLowerCase();if(ap.some((x)=>n.startsWith(x)))return!1;return!p.split(/[-_:.]/).some(fp)}function kp(p){let n="",x=p.length,o=p.charCodeAt(0);for(let a=0;a<x;a++){let b=p.charCodeAt(a),g=p.charAt(a);if(b===0)n+="�";else if(b>=1&&b<=31||b===127||a===0&&b>=48&&b<=57||a===1&&b>=48&&b<=57&&o===45)n+=`\\${b.toString(16)} `;else if(a===0&&x===1&&b===45)n+=`\\${g}`;else if(b>=128||b===45||b===95||b>=48&&b<=57||b>=65&&b<=90||b>=97&&b<=122)n+=g;else n+=`\\${g}`}return n}function X(p,n){let x=n?n.CSS:void 0,o=globalThis.CSS,a=x?.escape??o?.escape;return a?a(p):kp(p)}function vp(p){return p.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}function U(p){return p.localName.toLowerCase()}function dp(p){return p.ownerDocument.defaultView}function wp(p){if(!p)return{x:0,y:0};let n=Number.isFinite(p.scrollX)?p.scrollX:0,x=Number.isFinite(p.scrollY)?p.scrollY:0;return{x:n,y:x}}function y(p){if(!Number.isFinite(p))return 0.5;return Math.min(1,Math.max(0,p))}function N(p){let n=p;while(n){if(n.id==="fbc-root")return!0;if(n.parentElement)n=n.parentElement;else{let x=n.getRootNode();n=x instanceof ShadowRoot?x.host:null}}return!1}function V(p){if(p===null)return null;let n=p.replace(/\s+/g," ").trim();if(n==="")return null;let x=Array.from(n);return x.length>120?x.slice(0,120).join(""):n}var zp=/^fl-node-(?!content$)[a-z0-9]+$/i,jp=/^[a-z0-9]+$/i;function I(p){let n=1,x=p.previousElementSibling;while(x){if(x.localName===p.localName&&x.namespaceURI===p.namespaceURI)n++;x=x.previousElementSibling}return n}function S(p,n){if(!p.id||!ip(p.id))return null;let x=`#${X(p.id,n.defaultView)}`,o=n.querySelectorAll(x);return o.length===1&&o[0]===p?x:null}function Zp(p,n){if(p===n.documentElement)return"html";let x=p.localName,o=p.getAttribute("data-id");if(o!==null&&p.classList.contains("elementor-element")&&jp.test(o))return`${x}[data-id="${vp(o)}"]`;let a=Array.from(p.classList).find((b)=>zp.test(b));if(a!==void 0)return`${x}.${X(a,n.defaultView)}`;return`${x}:nth-of-type(${I(p)})`}function $p(p,n,x){let o=x.querySelectorAll(p);return o.length===1&&o[0]===n}function Jp(p,n){let x=[],o=p;while(o){let a=S(o,n);if(a!==null)return x.unshift(a),x.join(" > ");x.unshift(Zp(o,n));let b=x.join(" > ");if($p(b,p,n))return b;o=o.parentElement}return x.join(" > ")}function Qp(p,n){let x=[],o=p;while(o){let a=U(o),b=o.parentElement,g=o===n.documentElement||b===n.documentElement&&(a==="head"||a==="body");x.unshift(g?a:`${a}[${I(o)}]`),o=b}return`/${x.join("/")}`}var Kp=/^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i,Hp=/^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;function Fp(p,n){if(!Kp.test(p))return null;let x=p.slice(1).split("/"),o=null;for(let a of x){let b=Hp.exec(a);if(!b)return null;let g=(b[1]??"").toLowerCase(),f=b[2]===void 0?1:Number(b[2]),u=o?Array.from(o.children):n.documentElement?[n.documentElement]:[],i=0,d=null;for(let w of u){if(U(w)!==g)continue;if(i++,i===f){d=w;break}}if(!d)return null;o=d}return o}function P(p,n,x){if(!Number.isFinite(n)||!Number.isFinite(x))throw RangeError(`createAnchor: click coordinates must be finite (got ${n}, ${x})`);if(!p.isConnected)throw Error("createAnchor: element is not connected to a document");if(N(p))throw Error("createAnchor: refusing to anchor an element inside #fbc-root");let o=p.ownerDocument;if(p.getRootNode()!==o)throw Error("createAnchor: element is inside a shadow root; anchor its shadow host instead");let a=p.getBoundingClientRect(),b=wp(o.defaultView),g=a.width>0?y((n-a.left)/a.width):0.5,f=a.height>0?y((x-a.top)/a.height):0.5;return{id:S(p,o)!==null?p.id:null,selector:Jp(p,o),xpath:Qp(p,o),text:V(p.textContent),tag:U(p),offsetX:g,offsetY:f,docX:n+b.x,docY:x+b.y}}function M(p,n){return p!==null&&U(p)===n&&!N(p)}function Lp(p){return p instanceof DOMException||p instanceof Error&&p.name==="SyntaxError"}function Up(p,n){if(typeof p.id!=="string"||p.id==="")return null;let x=n.getElementById(p.id);if(!x)return null;return n.querySelectorAll(`#${X(p.id,n.defaultView)}`).length===1?x:null}function Wp(p,n){if(typeof p.selector!=="string"||p.selector.trim()==="")return null;let x;try{x=n.querySelectorAll(p.selector)}catch(o){if(Lp(o))return null;throw o}return x.length===1?x[0]??null:null}function Gp(p,n){if(typeof p.xpath!=="string")return null;return Fp(p.xpath,n)}function qp(p,n){if(typeof p.text!=="string"||p.text==="")return null;let x=null;for(let o of Array.from(n.getElementsByTagName("*"))){if(U(o)!==p.tag||N(o))continue;if(V(o.textContent)!==p.text)continue;if(x)return null;x=o}return x}function R(p,n=document){if(typeof p.tag!=="string"||p.tag==="")return{el:null,strategy:"none"};let x=p.tag.toLowerCase(),o=Up(p,n);if(M(o,x))return{el:o,strategy:"id"};let a,b=()=>{if(a===void 0)a=qp({...p,tag:x},n);return M(a,x)?a:null},g=(d)=>{if(p.text===null||V(d.textContent)===p.text)return null;let w=b();return w&&w!==d?w:null},f=Wp(p,n);if(M(f,x)){let d=g(f);return d?{el:d,strategy:"text"}:{el:f,strategy:"selector"}}let u=Gp(p,n);if(M(u,x)){let d=g(u);return d?{el:d,strategy:"text"}:{el:u,strategy:"xpath"}}let i=b();if(i)return{el:i,strategy:"text"};return{el:null,strategy:"none"}}function T(p){if(!p.isConnected)return!1;let n=dp(p);if(!n)return!1;let x=n.getComputedStyle(p);if(x.visibility==="hidden"||x.visibility==="collapse")return!1;let o=p;while(o){if(n.getComputedStyle(o).display==="none")return!1;o=o.parentElement}let a=p.getBoundingClientRect();return!(a.width===0&&a.height===0)}class E extends Error{status;constructor(p,n){super(p);this.status=n}}class Y{cfg;constructor(p){this.cfg=p}url(p,n){let x=this.cfg.restUrl.replace(/\/$/,"")+p;if(n){let o=new URLSearchParams(n).toString();if(o)x+=(x.includes("?")?"&":"?")+o}return x}async request(p,n,x,o){let a=typeof FormData<"u"&&x instanceof FormData,b=await fetch(this.url(n,o),{method:p,credentials:"same-origin",headers:{"X-WP-Nonce":this.cfg.nonce,...x!==void 0&&!a?{"Content-Type":"application/json"}:{}},body:x===void 0?void 0:a?x:JSON.stringify(x)}),g=await b.json().catch(()=>null);if(!b.ok){let f=g&&typeof g==="object"&&"message"in g?String(g.message):b.statusText;throw new E(f,b.status)}return g}listItems(p){return this.request("GET","/items",void 0,p?{page_path:p}:void 0)}getItem(p){return this.request("GET",`/items/${p}`)}createItem(p,n){if(!n)return this.request("POST","/items",p);let x=new FormData;return x.append("data",JSON.stringify(p)),x.append("screenshot",n,"screenshot.jpg"),this.request("POST","/items",x)}replaceScreenshot(p,n){let x=new FormData;return x.append("screenshot",n,"screenshot.jpg"),this.request("POST",`/items/${p}/screenshot`,x)}updateItem(p,n){return this.request("PATCH",`/items/${p}`,n)}deleteItem(p){return this.request("DELETE",`/items/${p}`)}addComment(p,n){return this.request("POST",`/items/${p}/comments`,{body:n})}}function W(p=window.innerWidth){if(p<768)return"mobile";if(p<=1024)return"tablet";return"desktop"}function Mp(p){let n=[[/Edg\/([\d.]+)/,"Edge"],[/OPR\/([\d.]+)/,"Opera"],[/Firefox\/([\d.]+)/,"Firefox"],[/CriOS\/([\d.]+)/,"Chrome iOS"],[/Chrome\/([\d.]+)/,"Chrome"],[/Version\/([\d.]+).*Safari/,"Safari"]];for(let[x,o]of n){let a=p.match(x);if(a)return`${o} ${a[1].split(".")[0]}`}return"Unknown"}function Cp(p){let n=p.match(/(iPhone|iPad).*OS ([\d_]+)/);if(n)return`iOS ${n[2].replace(/_/g,".")}`;if(n=p.match(/Android ([\d.]+)/),n)return`Android ${n[1]}`;if(n=p.match(/Windows NT ([\d.]+)/),n)return n[1]==="10.0"?"Windows 10/11":`Windows NT ${n[1]}`;if(n=p.match(/Mac OS X ([\d_]+)/),n)return`macOS ${n[1].replace(/_/g,".")}`;if(/CrOS/.test(p))return"ChromeOS";if(/Linux/.test(p))return"Linux";return"Unknown"}var C=null;function s(){let p=navigator.userAgentData;if(!p)return;p.getHighEntropyValues(["platform","platformVersion"]).then(({platform:n,platformVersion:x})=>{if(!n||!x)return;let[o,a]=x.split(".");if(n==="macOS")C=`macOS ${o}.${a??"0"}`;else if(n==="Windows")C=Number(o)>=13?"Windows 11":"Windows 10";else if(n==="Android"||n==="Chrome OS"||n==="Linux")C=`${n} ${x}`.trim()}).catch(()=>{})}function c(p){let n=navigator.userAgent;return{viewport_w:window.innerWidth,viewport_h:window.innerHeight,dpr:Math.round((window.devicePixelRatio||1)*100)/100,breakpoint:W(),browser:Mp(n),os:C??Cp(n),user_agent:n,post_id:p.page.postId,post_type:p.page.postType,theme:p.page.theme,js_errors:(window.__fbcErrors??[]).slice(-20),preview:Xp()}}function Xp(){try{return window.self!==window.top?window.frameElement?.getAttribute("data-device")??"":""}catch{return""}}function l(p){let n=window.location.pathname,x=p.replace(/\/$/,"");if(x&&n.startsWith(x))n=n.slice(x.length);return n="/"+n.replace(/^\/+/,""),n==="/"?"/":n.replace(/\/?$/,"/")}function m(){let p=new URLSearchParams(window.location.search);return p.delete("fbc_item"),p.toString()}function h(){if(window.__fbcErrors)return;let p=window.__fbcErrors=[],n=(x)=>{if(p.push(x.slice(0,500)),p.length>20)p.shift()};window.addEventListener("error",(x)=>{if(x.message)n(`${x.message}${x.filename?` (${x.filename}:${x.lineno})`:""}`)}),window.addEventListener("unhandledrejection",(x)=>{let o=x.reason;n(`Unhandled rejection: ${o instanceof Error?o.message:String(o)}`)})}function r(p,n={},...x){let o=document.createElement(p);for(let[a,b]of Object.entries(n)){if(b===null||b===void 0||b===!1)continue;if(a.startsWith("on")&&typeof b==="function")o.addEventListener(a.slice(2).toLowerCase(),b);else if(a==="text")o.textContent=String(b);else if(a==="value"&&"value"in o)o.value=String(b);else if(b===!0)o.setAttribute(a,"");else o.setAttribute(a,String(b))}for(let a of x){if(a===null||a===void 0||a===!1)continue;o.append(typeof a==="number"?String(a):a)}return o}function $(p,n,x,o={}){let a=r("select",{name:p,...o});for(let[b,g]of n){let f=r("option",{value:b,text:g});if(b===x)f.selected=!0;a.append(f)}return a}function t(p){let n=new Date(p).getTime();if(Number.isNaN(n))return"";let x=Math.round((Date.now()-n)/1000);if(x<60)return"just now";let o=Math.round(x/60);if(o<60)return`${o}m ago`;let a=Math.round(o/60);if(a<24)return`${a}h ago`;let b=Math.round(a/24);if(b<30)return`${b}d ago`;return new Date(p).toLocaleDateString()}var G=["bug","tweak","change","comment"],e="fbc:mode",pp="fbc:corner",q="fbc-preview",B=[{id:"phone",label:"Phone",w:390,h:844},{id:"tablet",label:"Tablet",w:820,h:1180},{id:"laptop",label:"Laptop",w:1280,h:800}],L=16,np=360,Np=["tl","tr","bl","br"];class O{cfg;api;host;root;pinsLayer;outline;outlineTag;toolbar=null;sidebar=null;card=null;hintEl=null;bannerEl=null;mode=!1;showResolved=!1;pinMode=null;states=new Map;allItems=null;filters={scope:"page",type:"",status:"unresolved",mine:!1,round:0,bp:""};pagePath;framePending=!1;refreshTimer=0;lastWidth=window.innerWidth;mutationObserver=null;loaded=!1;corner="br";dragging=!1;ghost=null;pendingShot=null;inPreview=window.self!==window.top&&window.name===q;previewEl=null;constructor(p){this.cfg=p;this.api=new Y(p),this.pagePath=p.pagePath??l(p.homePath)}init(){this.mount(),this.bindGlobalEvents(),this.bindAdminBar();let p=!1;try{p=window.localStorage.getItem(e)==="1";let n=window.localStorage.getItem(pp);if(n&&Np.includes(n))this.corner=n}catch{p=!1}if(this.inPreview){let n=document.createElement("style");n.textContent="#wpadminbar{display:none!important}html{margin-top:0!important}",document.head.append(n),this.corner="bl",this.setMode(!0);return}if(this.cfg.openItem||p)this.setMode(!0)}mount(){this.host=r("div",{id:A}),this.host.setAttribute("style","all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;");let p=this.host.attachShadow({mode:"open"});p.append(r("style",{text:_})),this.root=r("div",{class:"fbc"});let n=this.cfg.brand;if(n){let o=[["--primary",n.primary],["--on-primary",n.onPrimary],["--dark",n.dark],["--on-dark",n.onDark],["--brand-accent",n.accent],["--ink-primary",n.ink??""]];for(let[a,b]of o)if(b)this.root.style.setProperty(a,b)}let x=r("div",{class:"layer"});this.outlineTag=r("span",{class:"outline-tag"}),this.outline=r("div",{class:"outline"},this.outlineTag),this.pinsLayer=r("div"),x.append(this.outline,this.pinsLayer),this.root.append(x),p.append(this.root),document.body.append(this.host)}inOverlay(p){return p.composedPath().includes(this.host)}bindGlobalEvents(){document.addEventListener("contextmenu",(p)=>this.onContextMenu(p),!0),document.addEventListener("mousemove",(p)=>this.onMouseMove(p),{capture:!0,passive:!0});for(let p of["pointerdown","mousedown","mouseup","click"])document.addEventListener(p,(n)=>this.onPinModeEvent(n),!0);document.addEventListener("mousedown",(p)=>this.onOutsideMouseDown(p),!1),document.addEventListener("keydown",(p)=>this.onKeyDown(p),!0),window.addEventListener("scroll",()=>this.schedulePosition(),{passive:!0,capture:!0}),window.addEventListener("resize",()=>{let p=window.innerWidth!==this.lastWidth;if(this.lastWidth=window.innerWidth,p)this.scheduleRefresh(80);else this.schedulePosition()})}bindAdminBar(){document.querySelector("#wp-admin-bar-fbc-toggle > a")?.addEventListener("click",(n)=>{n.preventDefault(),this.setMode(!this.mode)})}async setMode(p){if(this.mode=p,!this.inPreview)try{window.localStorage.setItem(e,p?"1":"0")}catch{}if(document.querySelector("#wp-admin-bar-fbc-toggle")?.classList.toggle("fbc-on",p),!p){this.exitPinMode(),this.closeCard(),this.closeSidebar(),this.hideOutline(),this.toolbar?.remove(),this.toolbar=null,this.bannerEl?.remove(),this.bannerEl=null,this.pinsLayer.replaceChildren();for(let n of this.states.values())n.pin=null;this.mutationObserver?.disconnect();return}if(this.renderToolbar(),this.observeMutations(),!this.loaded)await this.loadItems();else this.refresh();if(this.cfg.openItem){let n=this.cfg.openItem;this.cfg.openItem=0,this.stripDeepLinkParam(),this.openDeepLink(n)}}stripDeepLinkParam(){let p=new URL(window.location.href);if(p.searchParams.has("fbc_item"))p.searchParams.delete("fbc_item"),window.history.replaceState(window.history.state,"",p.toString())}async loadItems(){try{let{items:p}=await this.api.listItems(this.pagePath);this.states.clear();for(let n of p)this.states.set(n.id,{item:n,el:null,placement:"orphan",pin:null});this.loaded=!0,this.refresh()}catch(p){this.toast(`Could not load feedback: ${p.message}`,!0)}}upsert(p){let n=this.states.get(p.id);if(n)n.item=p;else this.states.set(p.id,{item:p,el:null,placement:"orphan",pin:null});if(this.allItems){let x=this.allItems.findIndex((o)=>o.id===p.id);if(x>=0)this.allItems[x]=p;else this.allItems.push(p)}}remove(p){if(this.states.get(p)?.pin?.remove(),this.states.delete(p),this.allItems)this.allItems=this.allItems.filter((x)=>x.id!==p)}refresh(){for(let p of this.states.values()){if(!p.item.anchor){p.el=null,p.placement="note";continue}let n=p.el&&p.el.isConnected?p.el:R(p.item.anchor).el;p.el=n,p.placement=!n?"orphan":T(n)?"pinned":"hidden"}if(this.drawPins(),this.updateToolbarCount(),this.sidebar)this.renderSidebarList()}drawPins(){if(!this.mode)return;for(let p of this.states.values()){if(!(p.placement==="pinned"&&(this.showResolved||p.item.status!=="resolved"))){p.pin?.remove(),p.pin=null;continue}if(!p.pin){let a=r("button",{class:"pin",type:"button","aria-label":`Feedback #${p.item.id}: ${p.item.title}`,onclick:(b)=>{b.stopPropagation(),this.openPopover(p.item.id)}});p.pin=a,this.pinsLayer.append(a)}let x=p.item.status==="resolved",o=p.pin.classList.contains("pulse");p.pin.className=`pin ${p.item.type}${x?" resolved":""}${o?" pulse":""}`,p.pin.textContent=x?"✓":String(p.item.id),p.pin.title=`#${p.item.id} ${p.item.title}`}this.positionPins()}schedulePosition(){if(this.framePending||!this.mode)return;this.framePending=!0,requestAnimationFrame(()=>{this.framePending=!1,this.positionPins(),this.positionChrome()})}scheduleRefresh(p=250){window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.mode&&this.refresh(),p)}positionPins(){for(let p of this.states.values()){if(!p.pin||!p.el||!p.item.anchor)continue;let n=p.el.getBoundingClientRect(),x=n.left+p.item.anchor.offsetX*n.width,o=n.top+p.item.anchor.offsetY*n.height;p.pin.style.transform=`translate(${Math.round(x)}px, ${Math.round(o)}px)`}}observeMutations(){if(!this.mutationObserver)this.mutationObserver=new MutationObserver((p)=>{if(p.every((n)=>n.target===this.host||this.host.contains(n.target)))return;this.schedulePosition(),this.scheduleRefresh(300)});this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden","open"]})}onContextMenu(p){if(!this.mode||p.altKey||this.inOverlay(p))return;let n=this.eventTarget(p);if(!n)return;p.preventDefault(),p.stopPropagation(),this.exitPinMode(),this.openTypeMenu(n,p.clientX,p.clientY)}onPinModeEvent(p){if(!this.pinMode||this.inOverlay(p)||p.button!==0)return;if(p.preventDefault(),p.stopImmediatePropagation(),p.type!=="click")return;let n=this.eventTarget(p),x=this.pinMode;if(this.exitPinMode(),n)x.done(n,p.clientX,p.clientY)}onOutsideMouseDown(p){if(this.card&&!this.inOverlay(p))this.closeCard()}onMouseMove(p){if(!this.mode||this.card&&!this.pinMode||this.inOverlay(p)){if(!this.pinMode)this.hideOutline();return}let n=this.eventTarget(p);if(!n||n===document.documentElement||n===document.body){this.hideOutline();return}let x=n.getBoundingClientRect();Object.assign(this.outline.style,{left:`${x.left}px`,top:`${x.top}px`,width:`${x.width}px`,height:`${x.height}px`});let o=n.id?`#${n.id}`:"";this.outlineTag.textContent=`${n.tagName.toLowerCase()}${o}`,this.outline.classList.add("on")}onKeyDown(p){if(this.annotating)return;let n=p.composedPath()[0],x=n instanceof HTMLElement&&(n.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(n.tagName));if(p.altKey&&p.shiftKey&&p.code==="KeyF"&&!x){p.preventDefault(),this.setMode(!this.mode);return}if(p.key==="Escape"&&this.previewEl){p.preventDefault(),this.closePreview();return}if(p.key==="Escape"&&this.mode){if(this.pinMode)this.exitPinMode(),p.preventDefault();else if(this.card)this.closeCard(),p.preventDefault();else if(this.sidebar)this.closeSidebar(),p.preventDefault()}}eventTarget(p){let n=p.target;if(n instanceof Element)return n;if(n instanceof Node)return n.parentElement;return null}hideOutline(){this.outline.classList.remove("on")}enterPinMode(p){this.closeCard(),this.pinMode=p,this.hintEl?.remove(),this.hintEl=r("div",{class:"crosshair-hint",text:`${p.hint} · Esc to cancel`}),this.root.append(this.hintEl),document.documentElement.style.cursor="crosshair",this.renderToolbar()}exitPinMode(){if(!this.pinMode)return;this.pinMode=null,this.hintEl?.remove(),this.hintEl=null,document.documentElement.style.cursor="",this.hideOutline(),this.renderToolbar()}scripts=new Map;annotating=!1;async annotate(p){if(this.annotating)return null;this.annotating=!0;try{if(!window.FBCAnnotator)await this.loadBundle("annotator.js");let n=window.FBCAnnotator;if(!n)throw Error("The annotator could not load.");let x=this.cfg.brand?.primary??"#6953c4";return await n.open({image:p,mount:this.root,colors:["#e5383b",x,"#ffb703","#ffffff","#111111"]})}catch(n){return this.toast(n.message,!0),null}finally{this.annotating=!1}}loadBundle(p){let n=this.scripts.get(p);if(n)return n;let x=this.cfg.assetsUrl??"",o=new Promise((a,b)=>{let g=document.createElement("script");g.src=`${x}${p}${this.cfg.version?`?ver=${encodeURIComponent(this.cfg.version)}`:""}`,g.async=!0,g.onload=()=>a(),g.onerror=()=>{this.scripts.delete(p),b(Error(`Could not load ${p}`))},document.head.append(g)});return this.scripts.set(p,o),o}async startCapture(p){if(!this.cfg.shots||!this.cfg.assetsUrl)return null;try{if(!window.FBCCapture)await this.loadBundle("capture.js");let n=window.FBCCapture;if(!n)return null;return await n.captureViewport({marker:p,color:this.cfg.brand?.primary??"#6953c4"})}catch{return null}}assigneeOptions(){return[["0","Unassigned"],...this.cfg.assignees.people.map((p)=>[String(p.id),p.name])]}assigneeLabel(){return this.cfg.assignees.source==="teamwork"?"Assignee (Teamwork)":"Assignee"}safeAnchor(p,n,x){try{return P(p,n,x)}catch{return this.toast("Can't pin to that element. Try its container, or add a page note.",!0),null}}closeCard(){this.card?.remove(),this.card=null}showCard(p,n,x){this.closeCard(),this.hideOutline(),this.card=p,p.style.left="0px",p.style.top="0px",p.style.visibility="hidden",this.root.append(p);let{offsetWidth:o,offsetHeight:a}=p,b=Math.max(12,Math.min(n+8,window.innerWidth-o-12)),g=Math.max(this.topOffset()+12,Math.min(x+8,window.innerHeight-a-12));p.style.left=`${b}px`,p.style.top=`${g}px`,p.style.visibility=""}openTypeMenu(p,n,x){this.pendingShot=this.startCapture({x:n,y:x});let o=this.cfg.labels.type,a=(f)=>this.openComposer(f,p,n,x),b=G.map((f,u)=>r("button",{type:"button",onclick:()=>a(f)},r("span",{class:`dot ${f}`}),o[f],r("kbd",{text:String(u+1)}))),g=r("div",{class:"card menu",role:"menu",onkeydown:(f)=>{let u=f.key,i=Number(u);if(i>=1&&i<=G.length)f.preventDefault(),a(G[i-1])}},r("div",{class:"menu-title",text:"Add feedback"}),...b,r("hr"),r("button",{type:"button",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},"Note for the whole page"));this.showCard(g,n,x),b[0].focus()}openComposer(p,n,x,o){let a=null;if(n){if(a=this.safeAnchor(n,x,o),!a)return}let b=this.cfg.labels,g=$("type",G.map((z)=>[z,b.type[z]]),p),f=r("input",{type:"text",name:"title",maxlength:255,required:!0,placeholder:"What needs attention?",autocomplete:"off"}),u=r("textarea",{name:"description",placeholder:"Details, steps to reproduce, what you expected… (optional)"}),i=$("priority",Object.keys(b.priority).map((z)=>[z,b.priority[z]]),"medium"),d=$("assignee_id",this.assigneeOptions(),"0"),w=r("div",{class:"error",role:"alert"}),Z=r("button",{class:"btn primary",type:"submit",text:"Add"}),Q=this.pendingShot??this.startCapture(n?{x,y:o}:null);this.pendingShot=null;let j=null,J="",K=r("div",{class:"shot","aria-live":"polite"}),k=()=>{if(J)URL.revokeObjectURL(J);J=j?URL.createObjectURL(j):"",K.replaceChildren(...j?[r("img",{src:J,alt:"Screenshot that will be attached"}),r("div",{class:"shot-actions"},r("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{if(!j)return;let z=await this.annotate(j);if(z)j=z,Q=Promise.resolve(z),k()}}),this.cfg.shots?r("button",{type:"button",class:"btn link",text:"Remove screenshot",onclick:()=>{j=null,Q=Promise.resolve(null),k()}}):null)]:[]),K.hidden=!j};if(this.cfg.shots)K.textContent="Capturing screenshot…",Q.then((z)=>{if(j=z,k(),!z)K.hidden=!0});else K.hidden=!0;let v=r("form",{class:"card composer",novalidate:!0,onsubmit:(z)=>{z.preventDefault(),H()}},r("div",{class:"head"},r("span",{class:"chip"},r("span",{class:`dot ${p}`}),n?`<${n.tagName.toLowerCase()}>`:"Whole page"),r("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),r("label",{class:"field"},r("span",{text:"Title"}),f),w,r("label",{class:"field"},r("span",{text:"Description"}),u),r("div",{class:"row"},r("label",{class:"field"},r("span",{text:"Type"}),g),r("label",{class:"field"},r("span",{text:"Priority"}),i)),r("label",{class:"field"},r("span",{text:this.assigneeLabel()}),d),K,r("div",{class:"actions"},r("button",{class:"btn link",type:"button",text:"Cancel",onclick:()=>this.closeCard()}),Z)),H=async()=>{if(!f.value.trim()){w.textContent="Add a short title.",f.focus();return}Z.disabled=!0;try{let z=this.cfg.shots?await Promise.race([Q,new Promise((op)=>window.setTimeout(()=>op(null),1e4))]):null,F=await this.api.createItem({type:g.value,title:f.value.trim(),description:u.value,priority:i.value,assignee_id:Number(d.value),page_path:this.pagePath,page_query:m(),page_title:document.title,anchor:a,context:c(this.cfg)},j??z);if(J)URL.revokeObjectURL(J);this.closeCard(),this.upsert(F);let D=this.states.get(F.id);if(D&&n)D.el=n;if(this.refresh(),F.screenshot_error)this.toast(`Added #${F.id}, but the screenshot wasn’t saved: ${F.screenshot_error}`,!0);else this.toast(`Added #${F.id}`)}catch(z){w.textContent=z.message,Z.disabled=!1}};this.showCard(v,x,o),f.focus()}async openPopover(p,n){let x;try{x=await this.api.getItem(p)}catch(v){this.toast(v.message,!0);return}this.upsert(x);let o=this.cfg.labels,a=this.states.get(p),b=a?.pin?.getBoundingClientRect(),g=n?.x??(b?b.right:window.innerWidth/2-170),f=n?.y??(b?b.top:100),u=async(v)=>{try{let H=await this.api.updateItem(p,v);this.upsert(H),this.refresh(),this.openPopover(p,{x:parseFloat(k.style.left)-8,y:parseFloat(k.style.top)-8})}catch(H){this.toast(H.message,!0)}},i=$("status",Object.keys(o.status).map((v)=>[v,o.status[v]]),x.status,{onchange:()=>void u({status:i.value})}),d=$("assignee_id",this.assigneeOptions(),String(x.assignee_id),{onchange:()=>void u({assignee_id:Number(d.value)})}),w=$("priority",Object.keys(o.priority).map((v)=>[v,o.priority[v]]),x.priority,{onchange:()=>void u({priority:w.value})}),Z=r("textarea",{placeholder:"Reply…",rows:2}),Q=r("ul",{class:"thread"},...(x.comments??[]).map((v)=>r("li",{class:v.kind},r("span",{class:"who",text:v.user_name}),r("span",{class:"when",text:t(v.created_at)}),r("div",{class:"body",text:v.body})))),j=W(),J=x.breakpoint&&x.breakpoint!==j?r("div",{class:"notice",text:`Logged at ${x.breakpoint} (${x.context?.viewport_w??"?"}px). You are on ${j} (${window.innerWidth}px).`}):null,K=a?.placement==="orphan"?r("div",{class:"notice",text:"The element this was pinned to can’t be found on the page anymore. Re-anchor it."}):null,k=r("div",{class:"card popover",role:"dialog","aria-label":`Feedback #${x.id}`},r("div",{class:"head"},r("span",{class:"chip"},r("span",{class:`dot ${x.type}`}),`${o.type[x.type]} #${x.id}`),r("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),r("div",{class:"t",style:"font-weight:700;font-size:15px;margin-bottom:4px",text:x.title}),r("div",{class:"meta",text:`Round ${x.round} · ${x.reporter_name} · ${t(x.created_at)}`}),x.breakpoint?r("div",{class:"meta bp-line"},r("span",{class:"chip",text:x.breakpoint}),` ${x.context?.viewport_w??"?"}px wide${x.context?.preview?` · ${x.context.preview} preview`:""}`):null,x.tw_task_url?r("div",{class:"meta"},r("a",{href:x.tw_task_url,target:"_blank",rel:"noopener",text:`Teamwork task #${x.tw_task_id} ↗`}),x.status==="resolved"?" · completed":" · status syncs from Teamwork"):null,J,K,x.description?r("p",{class:"desc",text:x.description}):null,x.screenshot_url?r("div",{class:"shot"},r("a",{href:x.screenshot_url,target:"_blank",rel:"noopener",title:"Open full screenshot"},r("img",{src:x.screenshot_url,alt:"Screenshot from when this was filed"})),r("div",{class:"shot-actions"},r("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{try{let v=await fetch(x.screenshot_url,{credentials:"same-origin",cache:"no-store"}),H=await this.annotate(await v.blob());if(!H)return;let z=await this.api.replaceScreenshot(x.id,H);this.upsert(z),this.toast(`Annotations saved on #${x.id}`),this.openPopover(p,{x:parseFloat(k.style.left)-8,y:parseFloat(k.style.top)-8})}catch(v){this.toast(v.message,!0)}}}))):null,r("div",{class:"row"},r("label",{class:"field"},r("span",{text:"Status"}),i),r("label",{class:"field"},r("span",{text:"Priority"}),w)),x.assignee_locked?r("div",{class:"field"},r("span",{text:this.assigneeLabel()}),r("div",{text:x.assignee_name||"Unassigned"}),r("div",{class:"meta",text:"In Teamwork now: change the assignee there."})):r("label",{class:"field"},r("span",{text:this.assigneeLabel()}),d),Q,r("label",{class:"field"},Z),r("div",{class:"actions"},x.anchor||a?.placement==="note"?r("button",{class:"btn link left",type:"button",text:"Re-anchor",onclick:()=>this.reanchor(x.id)}):null,r("a",{class:"btn link",href:`${this.cfg.adminUrl}&item=${x.id}`,target:"_blank",rel:"noopener",text:"Admin"}),x.can_delete?r("button",{class:"btn danger",type:"button",text:"Delete",onclick:()=>void this.deleteItem(x.id)}):null,r("button",{class:"btn primary",type:"button",text:"Reply",onclick:async()=>{if(!Z.value.trim())return;try{await this.api.addComment(x.id,Z.value),this.openPopover(p,{x:parseFloat(k.style.left)-8,y:parseFloat(k.style.top)-8})}catch(v){this.toast(v.message,!0)}}})));this.showCard(k,g,f)}reanchor(p){this.enterPinMode({hint:`Click the element #${p} belongs to`,done:async(n,x,o)=>{try{let a=this.safeAnchor(n,x,o);if(!a)return;let b=await this.api.updateItem(p,{anchor:a});this.upsert(b);let g=this.states.get(p);if(g)g.el=n;this.refresh(),this.toast(`Re-anchored #${p}`)}catch(a){this.toast(a.message,!0)}}})}async deleteItem(p){if(!window.confirm(`Delete feedback #${p}? This can’t be undone.`))return;try{await this.api.deleteItem(p),this.closeCard(),this.remove(p),this.refresh(),this.toast(`Deleted #${p}`)}catch(n){this.toast(n.message,!0)}}async openDeepLink(p){let n=this.states.get(p);if(n?.el&&n.placement==="pinned")n.el.scrollIntoView({block:"center",behavior:"auto"}),await new Promise((o)=>requestAnimationFrame(()=>o(null))),this.positionPins(),n.pin?.classList.add("pulse");let x=n?.item;if(x?.breakpoint&&x.breakpoint!==W())this.showBanner(`#${p} was logged at ${x.breakpoint} (${x.context?.viewport_w??"?"}px wide). You're viewing at ${W()} (${window.innerWidth}px). Resize to reproduce.`);await this.openPopover(p)}unresolvedCount(){let p=0;for(let n of this.states.values())if(n.item.status!=="resolved")p++;return p}renderToolbar(){if(!this.mode)return;let p=this.unresolvedCount(),n=r("div",{class:"toolbar",role:"toolbar","aria-label":this.cfg.brand?.name??"Feedback"},r("button",{type:"button",class:"grip",title:"Drag to move · arrow keys snap to a corner","aria-label":"Move toolbar: drag, or use arrow keys to snap to a corner",text:"⠿",onpointerdown:(o)=>this.startDrag(o),onkeydown:(o)=>this.onGripKey(o)}),this.cfg.brand?.logo?r("span",{class:"brand",title:`${this.cfg.brand.name} · drag to move`,onpointerdown:(o)=>this.startDrag(o)},r("img",{src:this.cfg.brand.logo,alt:this.cfg.brand.name})):r("span",{class:"brand",title:"Drag to move",text:this.cfg.brand?.label??"Feedback",onpointerdown:(o)=>this.startDrag(o)}),r("button",{type:"button",class:this.pinMode?"on":"",title:"Click an element to pin feedback (or right-click anywhere)",text:"+ Add",onclick:()=>this.pinMode?this.exitPinMode():this.enterPinMode({hint:"Click any element to add feedback",done:(o,a,b)=>this.openTypeMenu(o,a,b)})}),r("button",{type:"button",text:"Page note",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)}),this.inPreview?null:r("button",{type:"button",title:"Preview this page at phone, tablet and laptop sizes",text:"Devices",onclick:()=>this.openPreview("phone")}),r("button",{type:"button",class:this.sidebar?"on":"",onclick:()=>this.sidebar?this.closeSidebar():this.openSidebar()},r("span",{class:"label",text:"List"}),p?r("span",{class:"count",text:String(p)}):null),r("button",{type:"button",class:this.showResolved?"on":"",title:"Show resolved pins",text:"✓ Resolved",onclick:()=>{this.showResolved=!this.showResolved,this.drawPins(),this.renderToolbar()}}),r("button",{type:"button",title:"Exit Feedback mode (Alt+Shift+F)","aria-label":"Exit Feedback mode",text:"×",onclick:()=>void this.setMode(!1)})),x=!!this.toolbar;if(n.hidden=!!this.previewEl,this.toolbar)this.toolbar.replaceWith(n);else this.root.append(n);if(this.toolbar=n,this.positionToolbar(!1),!x)this.positionChrome()}updateToolbarCount(){this.renderToolbar()}openPreview(p,n=!1){let x=B.find((k)=>k.id===p)??B[0],o=n?x.h:x.w,a=n?x.w:x.h,b=`${x.label} ${o}×${a}`;this.closeCard(),this.exitPinMode();let g=this.previewEl?.querySelector("iframe"),f=new URL(g?.contentWindow?.location.href??window.location.href);f.searchParams.delete("fbc_item"),f.searchParams.set("fbc_preview","1"),this.previewEl?.remove();let u=r("iframe",{name:q,title:`${b} preview`,"data-device":b,src:f.toString()});u.style.width=`${o}px`,u.style.height=`${a}px`;let i=r("div",{class:"preview-device"},u),d=r("div",{class:"preview-stage"},i),w=r("div",{class:"preview-blocked",hidden:!0}),Z=B.map((k)=>r("button",{type:"button","aria-pressed":String(k.id===x.id),text:`${k.label} ${k.w}`,onclick:()=>this.openPreview(k.id,k.id===x.id?n:!1)})),Q=()=>{window.open(f.toString(),q,`width=${o},height=${a},resizable=yes,scrollbars=yes`)},j=r("div",{class:"preview-bar",role:"toolbar","aria-label":"Device preview"},r("strong",{text:"Device preview"}),r("div",{class:"preview-devices"},...Z),r("button",{type:"button",title:"Rotate",text:"⟲ Rotate",onclick:()=>this.openPreview(x.id,!n)}),r("span",{class:"preview-label",text:b}),r("span",{class:"annotator-spacer"}),r("button",{type:"button",text:"Open in a window",onclick:Q}),r("button",{type:"button",class:"preview-close",text:"Done",onclick:()=>this.closePreview()})),J=r("div",{class:"preview",role:"dialog","aria-label":`Device preview: ${b}`},j,d,w);if(this.previewEl=J,this.root.append(J),requestAnimationFrame(()=>{let k=d.getBoundingClientRect(),v=Math.min(1,(k.width-32)/o,(k.height-32)/a);i.style.width=`${Math.round(o*v)}px`,i.style.height=`${Math.round(a*v)}px`,u.style.transform=`scale(${v})`}),u.addEventListener("load",()=>{let k=!1;try{k=!!u.contentDocument&&u.contentDocument.location.href!=="about:blank"}catch{k=!1}if(!k)w.hidden=!1,w.replaceChildren(r("p",{text:"This site can’t be shown in a frame here."}),r("button",{type:"button",class:"btn primary",text:`Open ${b} in a window`,onclick:Q}))}),this.pinsLayer.hidden=!0,this.toolbar)this.toolbar.hidden=!0;this.closeSidebar()}closePreview(){if(!this.previewEl)return;if(this.previewEl.remove(),this.previewEl=null,this.pinsLayer.hidden=!1,this.toolbar)this.toolbar.hidden=!1;this.loaded=!1,this.loadItems()}topOffset(){let p=document.getElementById("wpadminbar");if(!p)return 0;let n=p.getBoundingClientRect();return n.height>0?Math.max(0,Math.round(n.bottom)):0}toolbarTarget(p){let n=this.toolbar,x=n?.offsetWidth??0,o=n?.offsetHeight??0,a=this.topOffset(),b=p.endsWith("l")?L:window.innerWidth-x-L;if(p.endsWith("r")&&this.sidebar&&window.innerWidth>=np+x+L*2)b-=np;let g=p.startsWith("t")?a+L:window.innerHeight-o-L;return{x:Math.max(0,b),y:Math.max(a,g)}}nearestCorner(p,n){let x=this.topOffset(),o=n<x+(window.innerHeight-x)/2?"t":"b",a=p<window.innerWidth/2?"l":"r";return`${o}${a}`}positionToolbar(p=!1){let n=this.toolbar;if(!n||this.dragging)return;let{x,y:o}=this.toolbarTarget(this.corner);n.classList.toggle("snapping",p),n.style.left=`${x}px`,n.style.top=`${o}px`,n.dataset.corner=this.corner}positionChrome(){this.root.style.setProperty("--top-offset",`${this.topOffset()}px`);let p=this.toolbar?.offsetHeight??0,n=this.toolbar&&this.corner.startsWith("b")?p+L*2:24;this.root.style.setProperty("--toast-bottom",`${n}px`),this.positionToolbar(!1)}setCorner(p){this.corner=p;try{if(!this.inPreview)window.localStorage.setItem(pp,p)}catch{}this.positionToolbar(!0),this.positionChrome()}startDrag(p){let n=this.toolbar;if(!n||p.button!==0)return;p.preventDefault(),p.stopPropagation();let x=n.getBoundingClientRect(),o=p.clientX-x.left,a=p.clientY-x.top;this.dragging=!0,n.classList.remove("snapping"),n.classList.add("dragging"),this.ghost?.remove(),this.ghost=r("div",{class:"snap-ghost"}),Object.assign(this.ghost.style,{width:`${x.width}px`,height:`${x.height}px`}),this.root.append(this.ghost);let b=(f)=>{let u=this.topOffset(),i=Math.min(Math.max(f.clientX-o,0),window.innerWidth-x.width),d=Math.min(Math.max(f.clientY-a,u),window.innerHeight-x.height);n.style.left=`${i}px`,n.style.top=`${d}px`;let w=this.nearestCorner(i+x.width/2,d+x.height/2),Z=this.toolbarTarget(w);if(this.ghost)Object.assign(this.ghost.style,{left:`${Z.x}px`,top:`${Z.y}px`});n.dataset.target=w},g=(f)=>{window.removeEventListener("pointermove",b,!0),window.removeEventListener("pointerup",g,!0),window.removeEventListener("pointercancel",g,!0);let u=n.getBoundingClientRect();this.dragging=!1,n.classList.remove("dragging"),this.ghost?.remove(),this.ghost=null,delete n.dataset.target,this.setCorner(f.type==="pointercancel"?this.corner:this.nearestCorner(u.left+u.width/2,u.top+u.height/2))};window.addEventListener("pointermove",b,!0),window.addEventListener("pointerup",g,!0),window.addEventListener("pointercancel",g,!0)}onGripKey(p){let x={ArrowLeft:(o)=>`${o[0]}l`,ArrowRight:(o)=>`${o[0]}r`,ArrowUp:(o)=>`t${o[1]}`,ArrowDown:(o)=>`b${o[1]}`}[p.key];if(!x)return;p.preventDefault(),this.setCorner(x(this.corner)),this.toolbar?.querySelector(".grip")?.focus()}openSidebar(){this.sidebar?.remove();let p=this.filters,n=this.cfg.labels,x=$("scope",[["page","This page"],["all","All pages"]],p.scope,{onchange:()=>{p.scope=x.value,this.renderSidebarList()}}),o=$("type",[["","All types"],...G.map((i)=>[i,n.type[i]])],p.type,{onchange:()=>{p.type=o.value,this.renderSidebarList()}}),a=$("status",[["unresolved","Unresolved"],["","Any status"],...Object.keys(n.status).map((i)=>[i,n.status[i]])],p.status,{onchange:()=>{p.status=a.value,this.renderSidebarList()}}),b=[["0","All rounds"]];for(let i=this.cfg.round;i>=1;i--)b.push([String(i),i===this.cfg.round?`Round ${i} (current)`:`Round ${i}`]);let g=$("round",b,String(p.round),{onchange:()=>{p.round=Number(g.value),this.renderSidebarList()}}),f=$("bp",[["","All breakpoints"],["mobile","Mobile"],["tablet","Tablet"],["desktop","Desktop"]],p.bp,{onchange:()=>{p.bp=f.value,this.renderSidebarList()}}),u=r("input",{type:"checkbox",onchange:()=>{p.mine=u.checked,this.renderSidebarList()}});u.checked=p.mine,this.sidebar=r("div",{class:"sidebar",role:"complementary","aria-label":"Feedback list"},r("header",{},r("h2",{},this.cfg.brand?.label??"Feedback",r("button",{class:"x",type:"button","aria-label":"Close list",text:"×",onclick:()=>this.closeSidebar()})),r("div",{class:"filters"},x,o,a,g,f,r("label",{},u,"Assigned to me"))),r("div",{class:"list"})),this.root.append(this.sidebar),this.renderToolbar(),this.renderSidebarList()}closeSidebar(){this.sidebar?.remove(),this.sidebar=null,this.renderToolbar()}matches(p){let n=this.filters;if(n.type&&p.type!==n.type)return!1;if(n.round&&p.round!==n.round)return!1;if(n.bp&&p.breakpoint!==n.bp)return!1;if(n.status==="unresolved"&&p.status==="resolved")return!1;if(n.status&&n.status!=="unresolved"&&p.status!==n.status)return!1;if(n.mine&&(!this.cfg.assignees.me||p.assignee_id!==this.cfg.assignees.me))return!1;return!0}async renderSidebarList(){let p=this.sidebar?.querySelector(".list");if(!p)return;let n=(a,b,g)=>r("button",{class:"entry",type:"button",onclick:b},r("span",{class:`num ${a.status==="resolved"?"resolved":a.type}`,text:`#${a.id}`}),r("span",{},r("span",{class:"t",text:a.title}),r("span",{class:"s",text:`Round ${a.round} · ${this.cfg.labels.status[a.status]}${a.assignee_name?` · ${a.assignee_name}`:""}${a.breakpoint?` · ${a.breakpoint}`:""}`})),g??null);if(this.filters.scope==="all"){if(!this.allItems){p.replaceChildren(r("div",{class:"empty",text:"Loading…"}));try{this.allItems=(await this.api.listItems()).items}catch(g){p.replaceChildren(r("div",{class:"empty",text:g.message}));return}}let a=new Map;for(let g of this.allItems.filter((f)=>this.matches(f))){let f=a.get(g.page_path)??[];f.push(g),a.set(g.page_path,f)}let b=[];for(let[g,f]of a){b.push(r("h3",{text:g===this.pagePath?`${g} (this page)`:g}));for(let u of f)b.push(n(u,()=>{if(u.page_path===this.pagePath)this.focusItem(u.id);else{let i=new URL(u.page_url,window.location.origin);i.searchParams.set("fbc_item",String(u.id)),window.location.href=i.toString()}}))}p.replaceChildren(...b.length?b:[r("div",{class:"empty",text:"Nothing matches these filters."})]);return}let x={pinned:{title:"On this page",nodes:[]},note:{title:"Page notes",nodes:[]},hidden:{title:"At other breakpoints",nodes:[]},orphan:{title:"Orphaned — element not found",nodes:[]}};for(let a of[...this.states.values()].sort((b,g)=>b.item.id-g.item.id)){if(!this.matches(a.item))continue;let b=a.placement==="orphan"?r("span",{class:"btn link reanchor",role:"button",text:"Re-anchor",onclick:(g)=>{g.stopPropagation(),this.reanchor(a.item.id)}}):null;x[a.placement].nodes.push(n(a.item,()=>this.focusItem(a.item.id),b))}let o=[];for(let a of["pinned","note","hidden","orphan"]){let b=x[a];if(!b.nodes.length)continue;let g=a==="hidden"?`${b.nodes.length} at other breakpoints`:b.title;o.push(r("h3",{text:g}),...b.nodes)}p.replaceChildren(...o.length?o:[r("div",{class:"empty",text:"No feedback on this page yet. Right-click anything to add some."})])}focusItem(p){let n=this.states.get(p);if(!n)return;if(n.placement==="pinned"&&n.el){if(n.item.status==="resolved"&&!this.showResolved)this.showResolved=!0,this.drawPins();n.el.scrollIntoView({block:"center",behavior:"smooth"}),window.setTimeout(()=>{this.positionPins(),n.pin?.classList.remove("pulse"),n.pin?.offsetWidth,n.pin?.classList.add("pulse"),this.openPopover(p)},450)}else this.openPopover(p,{x:window.innerWidth-720,y:80})}toast(p,n=!1){let x=r("div",{class:`toast${n?" err":""}`,role:"status",text:p});this.root.append(x),window.setTimeout(()=>x.remove(),n?5000:2200)}showBanner(p){this.bannerEl?.remove(),this.bannerEl=r("div",{class:"banner",role:"status"},r("span",{text:p}),r("button",{type:"button",text:"Dismiss",onclick:()=>{this.bannerEl?.remove(),this.bannerEl=null}})),this.root.append(this.bannerEl)}}h();s();function Vp(){if(window.self===window.top)return!0;if(window.name!==q)return!1;try{return window.parent.location.origin===window.location.origin}catch{return!1}}function xp(){let p=window.fbcConfig;if(!p||!Vp())return;new O(p).init()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",xp,{once:!0});else xp();})();
