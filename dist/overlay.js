(()=>{var A=`:host {
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
`;var O="fbc-root";var xn=["ember","react-","__next","radix-","headlessui-","mui-","yui_","ext-gen"],rn=/[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i,an=/^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;function bn(n){let p=/[a-z]/i.test(n),o=/[0-9]/.test(n);if(!p||!o)return!1;if(n.length>=6&&/^[0-9a-f]+$/i.test(n))return!0;return n.length>=8&&/^[0-9a-z]+$/i.test(n)&&gn(n)>=2}function gn(n){let p=0;for(let o=1;o<n.length;o++){let x=/[0-9]/.test(n.charAt(o-1)),r=/[0-9]/.test(n.charAt(o));if(x!==r)p++}return p}function fn(n){if(n.trim()===""||/\s/.test(n))return!1;if(/^[0-9]/.test(n))return!1;if(/[0-9]{5,}/.test(n))return!1;if(rn.test(n))return!1;if(an.test(n))return!1;let p=n.toLowerCase();if(xn.some((o)=>p.startsWith(o)))return!1;return!n.split(/[-_:.]/).some(bn)}function un(n){let p="",o=n.length,x=n.charCodeAt(0);for(let r=0;r<o;r++){let b=n.charCodeAt(r),g=n.charAt(r);if(b===0)p+="�";else if(b>=1&&b<=31||b===127||r===0&&b>=48&&b<=57||r===1&&b>=48&&b<=57&&x===45)p+=`\\${b.toString(16)} `;else if(r===0&&o===1&&b===45)p+=`\\${g}`;else if(b>=128||b===45||b===95||b>=48&&b<=57||b>=65&&b<=90||b>=97&&b<=122)p+=g;else p+=`\\${g}`}return p}function V(n,p){let o=p?p.CSS:void 0,x=globalThis.CSS,r=o?.escape??x?.escape;return r?r(n):un(n)}function dn(n){return n.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}function H(n){return n.localName.toLowerCase()}function kn(n){return n.ownerDocument.defaultView}function vn(n){if(!n)return{x:0,y:0};let p=Number.isFinite(n.scrollX)?n.scrollX:0,o=Number.isFinite(n.scrollY)?n.scrollY:0;return{x:p,y:o}}function B(n){if(!Number.isFinite(n))return 0.5;return Math.min(1,Math.max(0,n))}function q(n){let p=n;while(p){if(p.id==="fbc-root")return!0;if(p.parentElement)p=p.parentElement;else{let o=p.getRootNode();p=o instanceof ShadowRoot?o.host:null}}return!1}function G(n){if(n===null)return null;let p=n.replace(/\s+/g," ").trim();if(p==="")return null;let o=Array.from(p);return o.length>120?o.slice(0,120).join(""):p}var wn=/^fl-node-(?!content$)[a-z0-9]+$/i,zn=/^[a-z0-9]+$/i;function D(n){let p=1,o=n.previousElementSibling;while(o){if(o.localName===n.localName&&o.namespaceURI===n.namespaceURI)p++;o=o.previousElementSibling}return p}function I(n,p){if(!n.id||!fn(n.id))return null;let o=`#${V(n.id,p.defaultView)}`,x=p.querySelectorAll(o);return x.length===1&&x[0]===n?o:null}function jn(n,p){if(n===p.documentElement)return"html";let o=n.localName,x=n.getAttribute("data-id");if(x!==null&&n.classList.contains("elementor-element")&&zn.test(x))return`${o}[data-id="${dn(x)}"]`;let r=Array.from(n.classList).find((b)=>wn.test(b));if(r!==void 0)return`${o}.${V(r,p.defaultView)}`;return`${o}:nth-of-type(${D(n)})`}function Zn(n,p,o){let x=o.querySelectorAll(n);return x.length===1&&x[0]===p}function $n(n,p){let o=[],x=n;while(x){let r=I(x,p);if(r!==null)return o.unshift(r),o.join(" > ");o.unshift(jn(x,p));let b=o.join(" > ");if(Zn(b,n,p))return b;x=x.parentElement}return o.join(" > ")}function Jn(n,p){let o=[],x=n;while(x){let r=H(x),b=x.parentElement,g=x===p.documentElement||b===p.documentElement&&(r==="head"||r==="body");o.unshift(g?r:`${r}[${D(x)}]`),x=b}return`/${o.join("/")}`}var Qn=/^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i,Fn=/^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;function Mn(n,p){if(!Qn.test(n))return null;let o=n.slice(1).split("/"),x=null;for(let r of o){let b=Fn.exec(r);if(!b)return null;let g=(b[1]??"").toLowerCase(),f=b[2]===void 0?1:Number(b[2]),u=x?Array.from(x.children):p.documentElement?[p.documentElement]:[],d=0,k=null;for(let w of u){if(H(w)!==g)continue;if(d++,d===f){k=w;break}}if(!k)return null;x=k}return x}function R(n,p,o){if(!Number.isFinite(p)||!Number.isFinite(o))throw RangeError(`createAnchor: click coordinates must be finite (got ${p}, ${o})`);if(!n.isConnected)throw Error("createAnchor: element is not connected to a document");if(q(n))throw Error("createAnchor: refusing to anchor an element inside #fbc-root");let x=n.ownerDocument;if(n.getRootNode()!==x)throw Error("createAnchor: element is inside a shadow root; anchor its shadow host instead");let r=n.getBoundingClientRect(),b=vn(x.defaultView),g=r.width>0?B((p-r.left)/r.width):0.5,f=r.height>0?B((o-r.top)/r.height):0.5;return{id:I(n,x)!==null?n.id:null,selector:$n(n,x),xpath:Jn(n,x),text:G(n.textContent),tag:H(n),offsetX:g,offsetY:f,docX:p+b.x,docY:o+b.y}}function t(n,p){return n!==null&&H(n)===p&&!q(n)}function Wn(n){return n instanceof DOMException||n instanceof Error&&n.name==="SyntaxError"}function Kn(n,p){if(typeof n.id!=="string"||n.id==="")return null;let o=p.getElementById(n.id);if(!o)return null;return p.querySelectorAll(`#${V(n.id,p.defaultView)}`).length===1?o:null}function Hn(n,p){if(typeof n.selector!=="string"||n.selector.trim()==="")return null;let o;try{o=p.querySelectorAll(n.selector)}catch(x){if(Wn(x))return null;throw x}return o.length===1?o[0]??null:null}function Ln(n,p){if(typeof n.xpath!=="string")return null;return Mn(n.xpath,p)}function Cn(n,p){if(typeof n.text!=="string"||n.text==="")return null;let o=null;for(let x of Array.from(p.getElementsByTagName("*"))){if(H(x)!==n.tag||q(x))continue;if(G(x.textContent)!==n.text)continue;if(o)return null;o=x}return o}function P(n,p=document){if(typeof n.tag!=="string"||n.tag==="")return{el:null,strategy:"none"};let o=n.tag.toLowerCase(),x=Kn(n,p);if(t(x,o))return{el:x,strategy:"id"};let r,b=()=>{if(r===void 0)r=Cn({...n,tag:o},p);return t(r,o)?r:null},g=(k)=>{if(n.text===null||G(k.textContent)===n.text)return null;let w=b();return w&&w!==k?w:null},f=Hn(n,p);if(t(f,o)){let k=g(f);return k?{el:k,strategy:"text"}:{el:f,strategy:"selector"}}let u=Ln(n,p);if(t(u,o)){let k=g(u);return k?{el:k,strategy:"text"}:{el:u,strategy:"xpath"}}let d=b();if(d)return{el:d,strategy:"text"};return{el:null,strategy:"none"}}function S(n){if(!n.isConnected)return!1;let p=kn(n);if(!p)return!1;let o=p.getComputedStyle(n);if(o.visibility==="hidden"||o.visibility==="collapse")return!1;let x=n;while(x){if(p.getComputedStyle(x).display==="none")return!1;x=x.parentElement}let r=n.getBoundingClientRect();return!(r.width===0&&r.height===0)}class y extends Error{status;constructor(n,p){super(n);this.status=p}}class N{cfg;constructor(n){this.cfg=n}url(n,p){let o=this.cfg.restUrl.replace(/\/$/,"")+n;if(p){let x=new URLSearchParams(p).toString();if(x)o+=(o.includes("?")?"&":"?")+x}return o}async request(n,p,o,x){let r=typeof FormData<"u"&&o instanceof FormData,b=await fetch(this.url(p,x),{method:n,credentials:"same-origin",headers:{"X-WP-Nonce":this.cfg.nonce,...o!==void 0&&!r?{"Content-Type":"application/json"}:{}},body:o===void 0?void 0:r?o:JSON.stringify(o)}),g=await b.json().catch(()=>null);if(!b.ok){let f=g&&typeof g==="object"&&"message"in g?String(g.message):b.statusText;throw new y(f,b.status)}return g}listItems(n){return this.request("GET","/items",void 0,n?{page_path:n}:void 0)}getItem(n){return this.request("GET",`/items/${n}`)}createItem(n,p){if(!p)return this.request("POST","/items",n);let o=new FormData;return o.append("data",JSON.stringify(n)),o.append("screenshot",p,"screenshot.jpg"),this.request("POST","/items",o)}replaceScreenshot(n,p){let o=new FormData;return o.append("screenshot",p,"screenshot.jpg"),this.request("POST",`/items/${n}/screenshot`,o)}updateItem(n,p){return this.request("PATCH",`/items/${n}`,p)}deleteItem(n){return this.request("DELETE",`/items/${n}`)}addComment(n,p){return this.request("POST",`/items/${n}/comments`,{body:p})}}function L(n=window.innerWidth){if(n<768)return"mobile";if(n<=1024)return"tablet";return"desktop"}function tn(n){let p=[[/Edg\/([\d.]+)/,"Edge"],[/OPR\/([\d.]+)/,"Opera"],[/Firefox\/([\d.]+)/,"Firefox"],[/CriOS\/([\d.]+)/,"Chrome iOS"],[/Chrome\/([\d.]+)/,"Chrome"],[/Version\/([\d.]+).*Safari/,"Safari"]];for(let[o,x]of p){let r=n.match(o);if(r)return`${x} ${r[1].split(".")[0]}`}return"Unknown"}function Un(n){let p=n.match(/(iPhone|iPad).*OS ([\d_]+)/);if(p)return`iOS ${p[2].replace(/_/g,".")}`;if(p=n.match(/Android ([\d.]+)/),p)return`Android ${p[1]}`;if(p=n.match(/Windows NT ([\d.]+)/),p)return p[1]==="10.0"?"Windows 10/11":`Windows NT ${p[1]}`;if(p=n.match(/Mac OS X ([\d_]+)/),p)return`macOS ${p[1].replace(/_/g,".")}`;if(/CrOS/.test(n))return"ChromeOS";if(/Linux/.test(n))return"Linux";return"Unknown"}var U=null;function T(){let n=navigator.userAgentData;if(!n)return;n.getHighEntropyValues(["platform","platformVersion"]).then(({platform:p,platformVersion:o})=>{if(!p||!o)return;let[x,r]=o.split(".");if(p==="macOS")U=`macOS ${x}.${r??"0"}`;else if(p==="Windows")U=Number(x)>=13?"Windows 11":"Windows 10";else if(p==="Android"||p==="Chrome OS"||p==="Linux")U=`${p} ${o}`.trim()}).catch(()=>{})}function E(n){let p=navigator.userAgent;return{viewport_w:window.innerWidth,viewport_h:window.innerHeight,dpr:Math.round((window.devicePixelRatio||1)*100)/100,breakpoint:L(),browser:tn(p),os:U??Un(p),user_agent:p,post_id:n.page.postId,post_type:n.page.postType,theme:n.page.theme,js_errors:(window.__fbcErrors??[]).slice(-20)}}function s(n){let p=window.location.pathname,o=n.replace(/\/$/,"");if(o&&p.startsWith(o))p=p.slice(o.length);return p="/"+p.replace(/^\/+/,""),p==="/"?"/":p.replace(/\/?$/,"/")}function l(){let n=new URLSearchParams(window.location.search);return n.delete("fbc_item"),n.toString()}function c(){if(window.__fbcErrors)return;let n=window.__fbcErrors=[],p=(o)=>{if(n.push(o.slice(0,500)),n.length>20)n.shift()};window.addEventListener("error",(o)=>{if(o.message)p(`${o.message}${o.filename?` (${o.filename}:${o.lineno})`:""}`)}),window.addEventListener("unhandledrejection",(o)=>{let x=o.reason;p(`Unhandled rejection: ${x instanceof Error?x.message:String(x)}`)})}function a(n,p={},...o){let x=document.createElement(n);for(let[r,b]of Object.entries(p)){if(b===null||b===void 0||b===!1)continue;if(r.startsWith("on")&&typeof b==="function")x.addEventListener(r.slice(2).toLowerCase(),b);else if(r==="text")x.textContent=String(b);else if(r==="value"&&"value"in x)x.value=String(b);else if(b===!0)x.setAttribute(r,"");else x.setAttribute(r,String(b))}for(let r of o){if(r===null||r===void 0||r===!1)continue;x.append(typeof r==="number"?String(r):r)}return x}function Z(n,p,o,x={}){let r=a("select",{name:n,...x});for(let[b,g]of p){let f=a("option",{value:b,text:g});if(b===o)f.selected=!0;r.append(f)}return r}function X(n){let p=new Date(n).getTime();if(Number.isNaN(p))return"";let o=Math.round((Date.now()-p)/1000);if(o<60)return"just now";let x=Math.round(o/60);if(x<60)return`${x}m ago`;let r=Math.round(x/60);if(r<24)return`${r}h ago`;let b=Math.round(r/24);if(b<30)return`${b}d ago`;return new Date(n).toLocaleDateString()}var C=["bug","tweak","change","comment"],m="fbc:mode",h="fbc:corner",K=16,e=360,Vn=["tl","tr","bl","br"];class Y{cfg;api;host;root;pinsLayer;outline;outlineTag;toolbar=null;sidebar=null;card=null;hintEl=null;bannerEl=null;mode=!1;showResolved=!1;pinMode=null;states=new Map;allItems=null;filters={scope:"page",type:"",status:"unresolved",mine:!1,round:0};pagePath;framePending=!1;refreshTimer=0;lastWidth=window.innerWidth;mutationObserver=null;loaded=!1;corner="br";dragging=!1;ghost=null;pendingShot=null;constructor(n){this.cfg=n;this.api=new N(n),this.pagePath=n.pagePath??s(n.homePath)}init(){this.mount(),this.bindGlobalEvents(),this.bindAdminBar();let n=!1;try{n=window.localStorage.getItem(m)==="1";let p=window.localStorage.getItem(h);if(p&&Vn.includes(p))this.corner=p}catch{n=!1}if(this.cfg.openItem||n)this.setMode(!0)}mount(){this.host=a("div",{id:O}),this.host.setAttribute("style","all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;");let n=this.host.attachShadow({mode:"open"});n.append(a("style",{text:A})),this.root=a("div",{class:"fbc"});let p=this.cfg.brand;if(p){let x=[["--primary",p.primary],["--on-primary",p.onPrimary],["--dark",p.dark],["--on-dark",p.onDark],["--brand-accent",p.accent],["--ink-primary",p.ink??""]];for(let[r,b]of x)if(b)this.root.style.setProperty(r,b)}let o=a("div",{class:"layer"});this.outlineTag=a("span",{class:"outline-tag"}),this.outline=a("div",{class:"outline"},this.outlineTag),this.pinsLayer=a("div"),o.append(this.outline,this.pinsLayer),this.root.append(o),n.append(this.root),document.body.append(this.host)}inOverlay(n){return n.composedPath().includes(this.host)}bindGlobalEvents(){document.addEventListener("contextmenu",(n)=>this.onContextMenu(n),!0),document.addEventListener("mousemove",(n)=>this.onMouseMove(n),{capture:!0,passive:!0});for(let n of["pointerdown","mousedown","mouseup","click"])document.addEventListener(n,(p)=>this.onPinModeEvent(p),!0);document.addEventListener("mousedown",(n)=>this.onOutsideMouseDown(n),!1),document.addEventListener("keydown",(n)=>this.onKeyDown(n),!0),window.addEventListener("scroll",()=>this.schedulePosition(),{passive:!0,capture:!0}),window.addEventListener("resize",()=>{let n=window.innerWidth!==this.lastWidth;if(this.lastWidth=window.innerWidth,n)this.scheduleRefresh(80);else this.schedulePosition()})}bindAdminBar(){document.querySelector("#wp-admin-bar-fbc-toggle > a")?.addEventListener("click",(p)=>{p.preventDefault(),this.setMode(!this.mode)})}async setMode(n){this.mode=n;try{window.localStorage.setItem(m,n?"1":"0")}catch{}if(document.querySelector("#wp-admin-bar-fbc-toggle")?.classList.toggle("fbc-on",n),!n){this.exitPinMode(),this.closeCard(),this.closeSidebar(),this.hideOutline(),this.toolbar?.remove(),this.toolbar=null,this.bannerEl?.remove(),this.bannerEl=null,this.pinsLayer.replaceChildren();for(let p of this.states.values())p.pin=null;this.mutationObserver?.disconnect();return}if(this.renderToolbar(),this.observeMutations(),!this.loaded)await this.loadItems();else this.refresh();if(this.cfg.openItem){let p=this.cfg.openItem;this.cfg.openItem=0,this.stripDeepLinkParam(),this.openDeepLink(p)}}stripDeepLinkParam(){let n=new URL(window.location.href);if(n.searchParams.has("fbc_item"))n.searchParams.delete("fbc_item"),window.history.replaceState(window.history.state,"",n.toString())}async loadItems(){try{let{items:n}=await this.api.listItems(this.pagePath);this.states.clear();for(let p of n)this.states.set(p.id,{item:p,el:null,placement:"orphan",pin:null});this.loaded=!0,this.refresh()}catch(n){this.toast(`Could not load feedback: ${n.message}`,!0)}}upsert(n){let p=this.states.get(n.id);if(p)p.item=n;else this.states.set(n.id,{item:n,el:null,placement:"orphan",pin:null});if(this.allItems){let o=this.allItems.findIndex((x)=>x.id===n.id);if(o>=0)this.allItems[o]=n;else this.allItems.push(n)}}remove(n){if(this.states.get(n)?.pin?.remove(),this.states.delete(n),this.allItems)this.allItems=this.allItems.filter((o)=>o.id!==n)}refresh(){for(let n of this.states.values()){if(!n.item.anchor){n.el=null,n.placement="note";continue}let p=n.el&&n.el.isConnected?n.el:P(n.item.anchor).el;n.el=p,n.placement=!p?"orphan":S(p)?"pinned":"hidden"}if(this.drawPins(),this.updateToolbarCount(),this.sidebar)this.renderSidebarList()}drawPins(){if(!this.mode)return;for(let n of this.states.values()){if(!(n.placement==="pinned"&&(this.showResolved||n.item.status!=="resolved"))){n.pin?.remove(),n.pin=null;continue}if(!n.pin){let r=a("button",{class:"pin",type:"button","aria-label":`Feedback #${n.item.id}: ${n.item.title}`,onclick:(b)=>{b.stopPropagation(),this.openPopover(n.item.id)}});n.pin=r,this.pinsLayer.append(r)}let o=n.item.status==="resolved",x=n.pin.classList.contains("pulse");n.pin.className=`pin ${n.item.type}${o?" resolved":""}${x?" pulse":""}`,n.pin.textContent=o?"✓":String(n.item.id),n.pin.title=`#${n.item.id} ${n.item.title}`}this.positionPins()}schedulePosition(){if(this.framePending||!this.mode)return;this.framePending=!0,requestAnimationFrame(()=>{this.framePending=!1,this.positionPins(),this.positionChrome()})}scheduleRefresh(n=250){window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.mode&&this.refresh(),n)}positionPins(){for(let n of this.states.values()){if(!n.pin||!n.el||!n.item.anchor)continue;let p=n.el.getBoundingClientRect(),o=p.left+n.item.anchor.offsetX*p.width,x=p.top+n.item.anchor.offsetY*p.height;n.pin.style.transform=`translate(${Math.round(o)}px, ${Math.round(x)}px)`}}observeMutations(){if(!this.mutationObserver)this.mutationObserver=new MutationObserver((n)=>{if(n.every((p)=>p.target===this.host||this.host.contains(p.target)))return;this.schedulePosition(),this.scheduleRefresh(300)});this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden","open"]})}onContextMenu(n){if(!this.mode||n.altKey||this.inOverlay(n))return;let p=this.eventTarget(n);if(!p)return;n.preventDefault(),n.stopPropagation(),this.exitPinMode(),this.openTypeMenu(p,n.clientX,n.clientY)}onPinModeEvent(n){if(!this.pinMode||this.inOverlay(n)||n.button!==0)return;if(n.preventDefault(),n.stopImmediatePropagation(),n.type!=="click")return;let p=this.eventTarget(n),o=this.pinMode;if(this.exitPinMode(),p)o.done(p,n.clientX,n.clientY)}onOutsideMouseDown(n){if(this.card&&!this.inOverlay(n))this.closeCard()}onMouseMove(n){if(!this.mode||this.card&&!this.pinMode||this.inOverlay(n)){if(!this.pinMode)this.hideOutline();return}let p=this.eventTarget(n);if(!p||p===document.documentElement||p===document.body){this.hideOutline();return}let o=p.getBoundingClientRect();Object.assign(this.outline.style,{left:`${o.left}px`,top:`${o.top}px`,width:`${o.width}px`,height:`${o.height}px`});let x=p.id?`#${p.id}`:"";this.outlineTag.textContent=`${p.tagName.toLowerCase()}${x}`,this.outline.classList.add("on")}onKeyDown(n){if(this.annotating)return;let p=n.composedPath()[0],o=p instanceof HTMLElement&&(p.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(p.tagName));if(n.altKey&&n.shiftKey&&n.code==="KeyF"&&!o){n.preventDefault(),this.setMode(!this.mode);return}if(n.key==="Escape"&&this.mode){if(this.pinMode)this.exitPinMode(),n.preventDefault();else if(this.card)this.closeCard(),n.preventDefault();else if(this.sidebar)this.closeSidebar(),n.preventDefault()}}eventTarget(n){let p=n.target;if(p instanceof Element)return p;if(p instanceof Node)return p.parentElement;return null}hideOutline(){this.outline.classList.remove("on")}enterPinMode(n){this.closeCard(),this.pinMode=n,this.hintEl?.remove(),this.hintEl=a("div",{class:"crosshair-hint",text:`${n.hint} · Esc to cancel`}),this.root.append(this.hintEl),document.documentElement.style.cursor="crosshair",this.renderToolbar()}exitPinMode(){if(!this.pinMode)return;this.pinMode=null,this.hintEl?.remove(),this.hintEl=null,document.documentElement.style.cursor="",this.hideOutline(),this.renderToolbar()}scripts=new Map;annotating=!1;async annotate(n){if(this.annotating)return null;this.annotating=!0;try{if(!window.FBCAnnotator)await this.loadBundle("annotator.js");let p=window.FBCAnnotator;if(!p)throw Error("The annotator could not load.");let o=this.cfg.brand?.primary??"#6953c4";return await p.open({image:n,mount:this.root,colors:["#e5383b",o,"#ffb703","#ffffff","#111111"]})}catch(p){return this.toast(p.message,!0),null}finally{this.annotating=!1}}loadBundle(n){let p=this.scripts.get(n);if(p)return p;let o=this.cfg.assetsUrl??"",x=new Promise((r,b)=>{let g=document.createElement("script");g.src=`${o}${n}${this.cfg.version?`?ver=${encodeURIComponent(this.cfg.version)}`:""}`,g.async=!0,g.onload=()=>r(),g.onerror=()=>{this.scripts.delete(n),b(Error(`Could not load ${n}`))},document.head.append(g)});return this.scripts.set(n,x),x}async startCapture(n){if(!this.cfg.shots||!this.cfg.assetsUrl)return null;try{if(!window.FBCCapture)await this.loadBundle("capture.js");let p=window.FBCCapture;if(!p)return null;return await p.captureViewport({marker:n,color:this.cfg.brand?.primary??"#6953c4"})}catch{return null}}assigneeOptions(){return[["0","Unassigned"],...this.cfg.assignees.people.map((n)=>[String(n.id),n.name])]}assigneeLabel(){return this.cfg.assignees.source==="teamwork"?"Assignee (Teamwork)":"Assignee"}safeAnchor(n,p,o){try{return R(n,p,o)}catch{return this.toast("Can't pin to that element. Try its container, or add a page note.",!0),null}}closeCard(){this.card?.remove(),this.card=null}showCard(n,p,o){this.closeCard(),this.hideOutline(),this.card=n,n.style.left="0px",n.style.top="0px",n.style.visibility="hidden",this.root.append(n);let{offsetWidth:x,offsetHeight:r}=n,b=Math.max(12,Math.min(p+8,window.innerWidth-x-12)),g=Math.max(this.topOffset()+12,Math.min(o+8,window.innerHeight-r-12));n.style.left=`${b}px`,n.style.top=`${g}px`,n.style.visibility=""}openTypeMenu(n,p,o){this.pendingShot=this.startCapture({x:p,y:o});let x=this.cfg.labels.type,r=(f)=>this.openComposer(f,n,p,o),b=C.map((f,u)=>a("button",{type:"button",onclick:()=>r(f)},a("span",{class:`dot ${f}`}),x[f],a("kbd",{text:String(u+1)}))),g=a("div",{class:"card menu",role:"menu",onkeydown:(f)=>{let u=f.key,d=Number(u);if(d>=1&&d<=C.length)f.preventDefault(),r(C[d-1])}},a("div",{class:"menu-title",text:"Add feedback"}),...b,a("hr"),a("button",{type:"button",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},"Note for the whole page"));this.showCard(g,p,o),b[0].focus()}openComposer(n,p,o,x){let r=null;if(p){if(r=this.safeAnchor(p,o,x),!r)return}let b=this.cfg.labels,g=Z("type",C.map((v)=>[v,b.type[v]]),n),f=a("input",{type:"text",name:"title",maxlength:255,required:!0,placeholder:"What needs attention?",autocomplete:"off"}),u=a("textarea",{name:"description",placeholder:"Details, steps to reproduce, what you expected… (optional)"}),d=Z("priority",Object.keys(b.priority).map((v)=>[v,b.priority[v]]),"medium"),k=Z("assignee_id",this.assigneeOptions(),"0"),w=a("div",{class:"error",role:"alert"}),$=a("button",{class:"btn primary",type:"submit",text:"Add"}),M=this.pendingShot??this.startCapture(p?{x:o,y:x}:null);this.pendingShot=null;let z=null,J="",Q=a("div",{class:"shot","aria-live":"polite"}),j=()=>{if(J)URL.revokeObjectURL(J);J=z?URL.createObjectURL(z):"",Q.replaceChildren(...z?[a("img",{src:J,alt:"Screenshot that will be attached"}),a("div",{class:"shot-actions"},a("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{if(!z)return;let v=await this.annotate(z);if(v)z=v,M=Promise.resolve(v),j()}}),this.cfg.shots?a("button",{type:"button",class:"btn link",text:"Remove screenshot",onclick:()=>{z=null,M=Promise.resolve(null),j()}}):null)]:[]),Q.hidden=!z};if(this.cfg.shots)Q.textContent="Capturing screenshot…",M.then((v)=>{if(z=v,j(),!v)Q.hidden=!0});else Q.hidden=!0;let i=a("form",{class:"card composer",novalidate:!0,onsubmit:(v)=>{v.preventDefault(),F()}},a("div",{class:"head"},a("span",{class:"chip"},a("span",{class:`dot ${n}`}),p?`<${p.tagName.toLowerCase()}>`:"Whole page"),a("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),a("label",{class:"field"},a("span",{text:"Title"}),f),w,a("label",{class:"field"},a("span",{text:"Description"}),u),a("div",{class:"row"},a("label",{class:"field"},a("span",{text:"Type"}),g),a("label",{class:"field"},a("span",{text:"Priority"}),d)),a("label",{class:"field"},a("span",{text:this.assigneeLabel()}),k),Q,a("div",{class:"actions"},a("button",{class:"btn link",type:"button",text:"Cancel",onclick:()=>this.closeCard()}),$)),F=async()=>{if(!f.value.trim()){w.textContent="Add a short title.",f.focus();return}$.disabled=!0;try{let v=this.cfg.shots?await Promise.race([M,new Promise((pn)=>window.setTimeout(()=>pn(null),1e4))]):null,W=await this.api.createItem({type:g.value,title:f.value.trim(),description:u.value,priority:d.value,assignee_id:Number(k.value),page_path:this.pagePath,page_query:l(),page_title:document.title,anchor:r,context:E(this.cfg)},z??v);if(J)URL.revokeObjectURL(J);this.closeCard(),this.upsert(W);let _=this.states.get(W.id);if(_&&p)_.el=p;if(this.refresh(),W.screenshot_error)this.toast(`Added #${W.id}, but the screenshot wasn’t saved: ${W.screenshot_error}`,!0);else this.toast(`Added #${W.id}`)}catch(v){w.textContent=v.message,$.disabled=!1}};this.showCard(i,o,x),f.focus()}async openPopover(n,p){let o;try{o=await this.api.getItem(n)}catch(i){this.toast(i.message,!0);return}this.upsert(o);let x=this.cfg.labels,r=this.states.get(n),b=r?.pin?.getBoundingClientRect(),g=p?.x??(b?b.right:window.innerWidth/2-170),f=p?.y??(b?b.top:100),u=async(i)=>{try{let F=await this.api.updateItem(n,i);this.upsert(F),this.refresh(),this.openPopover(n,{x:parseFloat(j.style.left)-8,y:parseFloat(j.style.top)-8})}catch(F){this.toast(F.message,!0)}},d=Z("status",Object.keys(x.status).map((i)=>[i,x.status[i]]),o.status,{onchange:()=>void u({status:d.value})}),k=Z("assignee_id",this.assigneeOptions(),String(o.assignee_id),{onchange:()=>void u({assignee_id:Number(k.value)})}),w=Z("priority",Object.keys(x.priority).map((i)=>[i,x.priority[i]]),o.priority,{onchange:()=>void u({priority:w.value})}),$=a("textarea",{placeholder:"Reply…",rows:2}),M=a("ul",{class:"thread"},...(o.comments??[]).map((i)=>a("li",{class:i.kind},a("span",{class:"who",text:i.user_name}),a("span",{class:"when",text:X(i.created_at)}),a("div",{class:"body",text:i.body})))),z=L(),J=o.breakpoint&&o.breakpoint!==z?a("div",{class:"notice",text:`Logged at ${o.breakpoint} (${o.context?.viewport_w??"?"}px). You are on ${z} (${window.innerWidth}px).`}):null,Q=r?.placement==="orphan"?a("div",{class:"notice",text:"The element this was pinned to can’t be found on the page anymore. Re-anchor it."}):null,j=a("div",{class:"card popover",role:"dialog","aria-label":`Feedback #${o.id}`},a("div",{class:"head"},a("span",{class:"chip"},a("span",{class:`dot ${o.type}`}),`${x.type[o.type]} #${o.id}`),a("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),a("div",{class:"t",style:"font-weight:700;font-size:15px;margin-bottom:4px",text:o.title}),a("div",{class:"meta",text:`Round ${o.round} · ${o.reporter_name} · ${X(o.created_at)}${o.breakpoint?` · ${o.breakpoint}`:""}`}),o.tw_task_url?a("div",{class:"meta"},a("a",{href:o.tw_task_url,target:"_blank",rel:"noopener",text:`Teamwork task #${o.tw_task_id} ↗`}),o.status==="resolved"?" · completed":" · status syncs from Teamwork"):null,J,Q,o.description?a("p",{class:"desc",text:o.description}):null,o.screenshot_url?a("div",{class:"shot"},a("a",{href:o.screenshot_url,target:"_blank",rel:"noopener",title:"Open full screenshot"},a("img",{src:o.screenshot_url,alt:"Screenshot from when this was filed"})),a("div",{class:"shot-actions"},a("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{try{let i=await fetch(o.screenshot_url,{credentials:"same-origin",cache:"no-store"}),F=await this.annotate(await i.blob());if(!F)return;let v=await this.api.replaceScreenshot(o.id,F);this.upsert(v),this.toast(`Annotations saved on #${o.id}`),this.openPopover(n,{x:parseFloat(j.style.left)-8,y:parseFloat(j.style.top)-8})}catch(i){this.toast(i.message,!0)}}}))):null,a("div",{class:"row"},a("label",{class:"field"},a("span",{text:"Status"}),d),a("label",{class:"field"},a("span",{text:"Priority"}),w)),o.assignee_locked?a("div",{class:"field"},a("span",{text:this.assigneeLabel()}),a("div",{text:o.assignee_name||"Unassigned"}),a("div",{class:"meta",text:"In Teamwork now: change the assignee there."})):a("label",{class:"field"},a("span",{text:this.assigneeLabel()}),k),M,a("label",{class:"field"},$),a("div",{class:"actions"},o.anchor||r?.placement==="note"?a("button",{class:"btn link left",type:"button",text:"Re-anchor",onclick:()=>this.reanchor(o.id)}):null,a("a",{class:"btn link",href:`${this.cfg.adminUrl}&item=${o.id}`,target:"_blank",rel:"noopener",text:"Admin"}),o.can_delete?a("button",{class:"btn danger",type:"button",text:"Delete",onclick:()=>void this.deleteItem(o.id)}):null,a("button",{class:"btn primary",type:"button",text:"Reply",onclick:async()=>{if(!$.value.trim())return;try{await this.api.addComment(o.id,$.value),this.openPopover(n,{x:parseFloat(j.style.left)-8,y:parseFloat(j.style.top)-8})}catch(i){this.toast(i.message,!0)}}})));this.showCard(j,g,f)}reanchor(n){this.enterPinMode({hint:`Click the element #${n} belongs to`,done:async(p,o,x)=>{try{let r=this.safeAnchor(p,o,x);if(!r)return;let b=await this.api.updateItem(n,{anchor:r});this.upsert(b);let g=this.states.get(n);if(g)g.el=p;this.refresh(),this.toast(`Re-anchored #${n}`)}catch(r){this.toast(r.message,!0)}}})}async deleteItem(n){if(!window.confirm(`Delete feedback #${n}? This can’t be undone.`))return;try{await this.api.deleteItem(n),this.closeCard(),this.remove(n),this.refresh(),this.toast(`Deleted #${n}`)}catch(p){this.toast(p.message,!0)}}async openDeepLink(n){let p=this.states.get(n);if(p?.el&&p.placement==="pinned")p.el.scrollIntoView({block:"center",behavior:"auto"}),await new Promise((x)=>requestAnimationFrame(()=>x(null))),this.positionPins(),p.pin?.classList.add("pulse");let o=p?.item;if(o?.breakpoint&&o.breakpoint!==L())this.showBanner(`#${n} was logged at ${o.breakpoint} (${o.context?.viewport_w??"?"}px wide). You're viewing at ${L()} (${window.innerWidth}px). Resize to reproduce.`);await this.openPopover(n)}unresolvedCount(){let n=0;for(let p of this.states.values())if(p.item.status!=="resolved")n++;return n}renderToolbar(){if(!this.mode)return;let n=this.unresolvedCount(),p=a("div",{class:"toolbar",role:"toolbar","aria-label":this.cfg.brand?.name??"Feedback"},a("button",{type:"button",class:"grip",title:"Drag to move · arrow keys snap to a corner","aria-label":"Move toolbar: drag, or use arrow keys to snap to a corner",text:"⠿",onpointerdown:(x)=>this.startDrag(x),onkeydown:(x)=>this.onGripKey(x)}),this.cfg.brand?.logo?a("span",{class:"brand",title:`${this.cfg.brand.name} · drag to move`,onpointerdown:(x)=>this.startDrag(x)},a("img",{src:this.cfg.brand.logo,alt:this.cfg.brand.name})):a("span",{class:"brand",title:"Drag to move",text:this.cfg.brand?.label??"Feedback",onpointerdown:(x)=>this.startDrag(x)}),a("button",{type:"button",class:this.pinMode?"on":"",title:"Click an element to pin feedback (or right-click anywhere)",text:"+ Add",onclick:()=>this.pinMode?this.exitPinMode():this.enterPinMode({hint:"Click any element to add feedback",done:(x,r,b)=>this.openTypeMenu(x,r,b)})}),a("button",{type:"button",text:"Page note",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)}),a("button",{type:"button",class:this.sidebar?"on":"",onclick:()=>this.sidebar?this.closeSidebar():this.openSidebar()},a("span",{class:"label",text:"List"}),n?a("span",{class:"count",text:String(n)}):null),a("button",{type:"button",class:this.showResolved?"on":"",title:"Show resolved pins",text:"✓ Resolved",onclick:()=>{this.showResolved=!this.showResolved,this.drawPins(),this.renderToolbar()}}),a("button",{type:"button",title:"Exit Feedback mode (Alt+Shift+F)","aria-label":"Exit Feedback mode",text:"×",onclick:()=>void this.setMode(!1)})),o=!!this.toolbar;if(this.toolbar)this.toolbar.replaceWith(p);else this.root.append(p);if(this.toolbar=p,this.positionToolbar(!1),!o)this.positionChrome()}updateToolbarCount(){this.renderToolbar()}topOffset(){let n=document.getElementById("wpadminbar");if(!n)return 0;let p=n.getBoundingClientRect();return p.height>0?Math.max(0,Math.round(p.bottom)):0}toolbarTarget(n){let p=this.toolbar,o=p?.offsetWidth??0,x=p?.offsetHeight??0,r=this.topOffset(),b=n.endsWith("l")?K:window.innerWidth-o-K;if(n.endsWith("r")&&this.sidebar&&window.innerWidth>=e+o+K*2)b-=e;let g=n.startsWith("t")?r+K:window.innerHeight-x-K;return{x:Math.max(0,b),y:Math.max(r,g)}}nearestCorner(n,p){let o=this.topOffset(),x=p<o+(window.innerHeight-o)/2?"t":"b",r=n<window.innerWidth/2?"l":"r";return`${x}${r}`}positionToolbar(n=!1){let p=this.toolbar;if(!p||this.dragging)return;let{x:o,y:x}=this.toolbarTarget(this.corner);p.classList.toggle("snapping",n),p.style.left=`${o}px`,p.style.top=`${x}px`,p.dataset.corner=this.corner}positionChrome(){this.root.style.setProperty("--top-offset",`${this.topOffset()}px`);let n=this.toolbar?.offsetHeight??0,p=this.toolbar&&this.corner.startsWith("b")?n+K*2:24;this.root.style.setProperty("--toast-bottom",`${p}px`),this.positionToolbar(!1)}setCorner(n){this.corner=n;try{window.localStorage.setItem(h,n)}catch{}this.positionToolbar(!0),this.positionChrome()}startDrag(n){let p=this.toolbar;if(!p||n.button!==0)return;n.preventDefault(),n.stopPropagation();let o=p.getBoundingClientRect(),x=n.clientX-o.left,r=n.clientY-o.top;this.dragging=!0,p.classList.remove("snapping"),p.classList.add("dragging"),this.ghost?.remove(),this.ghost=a("div",{class:"snap-ghost"}),Object.assign(this.ghost.style,{width:`${o.width}px`,height:`${o.height}px`}),this.root.append(this.ghost);let b=(f)=>{let u=this.topOffset(),d=Math.min(Math.max(f.clientX-x,0),window.innerWidth-o.width),k=Math.min(Math.max(f.clientY-r,u),window.innerHeight-o.height);p.style.left=`${d}px`,p.style.top=`${k}px`;let w=this.nearestCorner(d+o.width/2,k+o.height/2),$=this.toolbarTarget(w);if(this.ghost)Object.assign(this.ghost.style,{left:`${$.x}px`,top:`${$.y}px`});p.dataset.target=w},g=(f)=>{window.removeEventListener("pointermove",b,!0),window.removeEventListener("pointerup",g,!0),window.removeEventListener("pointercancel",g,!0);let u=p.getBoundingClientRect();this.dragging=!1,p.classList.remove("dragging"),this.ghost?.remove(),this.ghost=null,delete p.dataset.target,this.setCorner(f.type==="pointercancel"?this.corner:this.nearestCorner(u.left+u.width/2,u.top+u.height/2))};window.addEventListener("pointermove",b,!0),window.addEventListener("pointerup",g,!0),window.addEventListener("pointercancel",g,!0)}onGripKey(n){let o={ArrowLeft:(x)=>`${x[0]}l`,ArrowRight:(x)=>`${x[0]}r`,ArrowUp:(x)=>`t${x[1]}`,ArrowDown:(x)=>`b${x[1]}`}[n.key];if(!o)return;n.preventDefault(),this.setCorner(o(this.corner)),this.toolbar?.querySelector(".grip")?.focus()}openSidebar(){this.sidebar?.remove();let n=this.filters,p=this.cfg.labels,o=Z("scope",[["page","This page"],["all","All pages"]],n.scope,{onchange:()=>{n.scope=o.value,this.renderSidebarList()}}),x=Z("type",[["","All types"],...C.map((u)=>[u,p.type[u]])],n.type,{onchange:()=>{n.type=x.value,this.renderSidebarList()}}),r=Z("status",[["unresolved","Unresolved"],["","Any status"],...Object.keys(p.status).map((u)=>[u,p.status[u]])],n.status,{onchange:()=>{n.status=r.value,this.renderSidebarList()}}),b=[["0","All rounds"]];for(let u=this.cfg.round;u>=1;u--)b.push([String(u),u===this.cfg.round?`Round ${u} (current)`:`Round ${u}`]);let g=Z("round",b,String(n.round),{onchange:()=>{n.round=Number(g.value),this.renderSidebarList()}}),f=a("input",{type:"checkbox",onchange:()=>{n.mine=f.checked,this.renderSidebarList()}});f.checked=n.mine,this.sidebar=a("div",{class:"sidebar",role:"complementary","aria-label":"Feedback list"},a("header",{},a("h2",{},this.cfg.brand?.label??"Feedback",a("button",{class:"x",type:"button","aria-label":"Close list",text:"×",onclick:()=>this.closeSidebar()})),a("div",{class:"filters"},o,x,r,g,a("label",{},f,"Assigned to me"))),a("div",{class:"list"})),this.root.append(this.sidebar),this.renderToolbar(),this.renderSidebarList()}closeSidebar(){this.sidebar?.remove(),this.sidebar=null,this.renderToolbar()}matches(n){let p=this.filters;if(p.type&&n.type!==p.type)return!1;if(p.round&&n.round!==p.round)return!1;if(p.status==="unresolved"&&n.status==="resolved")return!1;if(p.status&&p.status!=="unresolved"&&n.status!==p.status)return!1;if(p.mine&&(!this.cfg.assignees.me||n.assignee_id!==this.cfg.assignees.me))return!1;return!0}async renderSidebarList(){let n=this.sidebar?.querySelector(".list");if(!n)return;let p=(r,b,g)=>a("button",{class:"entry",type:"button",onclick:b},a("span",{class:`num ${r.status==="resolved"?"resolved":r.type}`,text:`#${r.id}`}),a("span",{},a("span",{class:"t",text:r.title}),a("span",{class:"s",text:`Round ${r.round} · ${this.cfg.labels.status[r.status]}${r.assignee_name?` · ${r.assignee_name}`:""}${r.breakpoint?` · ${r.breakpoint}`:""}`})),g??null);if(this.filters.scope==="all"){if(!this.allItems){n.replaceChildren(a("div",{class:"empty",text:"Loading…"}));try{this.allItems=(await this.api.listItems()).items}catch(g){n.replaceChildren(a("div",{class:"empty",text:g.message}));return}}let r=new Map;for(let g of this.allItems.filter((f)=>this.matches(f))){let f=r.get(g.page_path)??[];f.push(g),r.set(g.page_path,f)}let b=[];for(let[g,f]of r){b.push(a("h3",{text:g===this.pagePath?`${g} (this page)`:g}));for(let u of f)b.push(p(u,()=>{if(u.page_path===this.pagePath)this.focusItem(u.id);else{let d=new URL(u.page_url,window.location.origin);d.searchParams.set("fbc_item",String(u.id)),window.location.href=d.toString()}}))}n.replaceChildren(...b.length?b:[a("div",{class:"empty",text:"Nothing matches these filters."})]);return}let o={pinned:{title:"On this page",nodes:[]},note:{title:"Page notes",nodes:[]},hidden:{title:"At other breakpoints",nodes:[]},orphan:{title:"Orphaned — element not found",nodes:[]}};for(let r of[...this.states.values()].sort((b,g)=>b.item.id-g.item.id)){if(!this.matches(r.item))continue;let b=r.placement==="orphan"?a("span",{class:"btn link reanchor",role:"button",text:"Re-anchor",onclick:(g)=>{g.stopPropagation(),this.reanchor(r.item.id)}}):null;o[r.placement].nodes.push(p(r.item,()=>this.focusItem(r.item.id),b))}let x=[];for(let r of["pinned","note","hidden","orphan"]){let b=o[r];if(!b.nodes.length)continue;let g=r==="hidden"?`${b.nodes.length} at other breakpoints`:b.title;x.push(a("h3",{text:g}),...b.nodes)}n.replaceChildren(...x.length?x:[a("div",{class:"empty",text:"No feedback on this page yet. Right-click anything to add some."})])}focusItem(n){let p=this.states.get(n);if(!p)return;if(p.placement==="pinned"&&p.el){if(p.item.status==="resolved"&&!this.showResolved)this.showResolved=!0,this.drawPins();p.el.scrollIntoView({block:"center",behavior:"smooth"}),window.setTimeout(()=>{this.positionPins(),p.pin?.classList.remove("pulse"),p.pin?.offsetWidth,p.pin?.classList.add("pulse"),this.openPopover(n)},450)}else this.openPopover(n,{x:window.innerWidth-720,y:80})}toast(n,p=!1){let o=a("div",{class:`toast${p?" err":""}`,role:"status",text:n});this.root.append(o),window.setTimeout(()=>o.remove(),p?5000:2200)}showBanner(n){this.bannerEl?.remove(),this.bannerEl=a("div",{class:"banner",role:"status"},a("span",{text:n}),a("button",{type:"button",text:"Dismiss",onclick:()=>{this.bannerEl?.remove(),this.bannerEl=null}})),this.root.append(this.bannerEl)}}c();T();function nn(){let n=window.fbcConfig;if(!n||window.self!==window.top)return;new Y(n).init()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",nn,{once:!0});else nn();})();
