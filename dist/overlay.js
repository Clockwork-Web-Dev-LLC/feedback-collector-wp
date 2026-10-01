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
`;var D="fbc-root";var op=["ember","react-","__next","radix-","headlessui-","mui-","yui_","ext-gen"],bp=/[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i,gp=/^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;function fp(p){let n=/[a-z]/i.test(p),x=/[0-9]/.test(p);if(!n||!x)return!1;if(p.length>=6&&/^[0-9a-f]+$/i.test(p))return!0;return p.length>=8&&/^[0-9a-z]+$/i.test(p)&&rp(p)>=2}function rp(p){let n=0;for(let x=1;x<p.length;x++){let o=/[0-9]/.test(p.charAt(x-1)),b=/[0-9]/.test(p.charAt(x));if(o!==b)n++}return n}function up(p){if(p.trim()===""||/\s/.test(p))return!1;if(/^[0-9]/.test(p))return!1;if(/[0-9]{5,}/.test(p))return!1;if(bp.test(p))return!1;if(gp.test(p))return!1;let n=p.toLowerCase();if(op.some((x)=>n.startsWith(x)))return!1;return!p.split(/[-_:.]/).some(fp)}function ap(p){let n="",x=p.length,o=p.charCodeAt(0);for(let b=0;b<x;b++){let f=p.charCodeAt(b),r=p.charAt(b);if(f===0)n+="�";else if(f>=1&&f<=31||f===127||b===0&&f>=48&&f<=57||b===1&&f>=48&&f<=57&&o===45)n+=`\\${f.toString(16)} `;else if(b===0&&x===1&&f===45)n+=`\\${r}`;else if(f>=128||f===45||f===95||f>=48&&f<=57||f>=65&&f<=90||f>=97&&f<=122)n+=r;else n+=`\\${r}`}return n}function q(p,n){let x=n?n.CSS:void 0,o=globalThis.CSS,b=x?.escape??o?.escape;return b?b(p):ap(p)}function kp(p){return p.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}function H(p){return p.localName.toLowerCase()}function dp(p){return p.ownerDocument.defaultView}function ip(p){if(!p)return{x:0,y:0};let n=Number.isFinite(p.scrollX)?p.scrollX:0,x=Number.isFinite(p.scrollY)?p.scrollY:0;return{x:n,y:x}}function O(p){if(!Number.isFinite(p))return 0.5;return Math.min(1,Math.max(0,p))}function G(p){let n=p;while(n){if(n.id==="fbc-root")return!0;if(n.parentElement)n=n.parentElement;else{let x=n.getRootNode();n=x instanceof ShadowRoot?x.host:null}}return!1}function N(p){if(p===null)return null;let n=p.replace(/\s+/g," ").trim();if(n==="")return null;let x=Array.from(n);return x.length>120?x.slice(0,120).join(""):n}var wp=/^fl-node-(?!content$)[a-z0-9]+$/i,vp=/^[a-z0-9]+$/i;function I(p){let n=1,x=p.previousElementSibling;while(x){if(x.localName===p.localName&&x.namespaceURI===p.namespaceURI)n++;x=x.previousElementSibling}return n}function P(p,n){if(!p.id||!up(p.id))return null;let x=`#${q(p.id,n.defaultView)}`,o=n.querySelectorAll(x);return o.length===1&&o[0]===p?x:null}function zp(p,n){if(p===n.documentElement)return"html";let x=p.localName,o=p.getAttribute("data-id");if(o!==null&&p.classList.contains("elementor-element")&&vp.test(o))return`${x}[data-id="${kp(o)}"]`;let b=Array.from(p.classList).find((f)=>wp.test(f));if(b!==void 0)return`${x}.${q(b,n.defaultView)}`;return`${x}:nth-of-type(${I(p)})`}function jp(p,n,x){let o=x.querySelectorAll(p);return o.length===1&&o[0]===n}function Zp(p,n){let x=[],o=p;while(o){let b=P(o,n);if(b!==null)return x.unshift(b),x.join(" > ");x.unshift(zp(o,n));let f=x.join(" > ");if(jp(f,p,n))return f;o=o.parentElement}return x.join(" > ")}function $p(p,n){let x=[],o=p;while(o){let b=H(o),f=o.parentElement,r=o===n.documentElement||f===n.documentElement&&(b==="head"||b==="body");x.unshift(r?b:`${b}[${I(o)}]`),o=f}return`/${x.join("/")}`}var Jp=/^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i,Qp=/^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;function Fp(p,n){if(!Jp.test(p))return null;let x=p.slice(1).split("/"),o=null;for(let b of x){let f=Qp.exec(b);if(!f)return null;let r=(f[1]??"").toLowerCase(),u=f[2]===void 0?1:Number(f[2]),a=o?Array.from(o.children):n.documentElement?[n.documentElement]:[],k=0,d=null;for(let w of a){if(H(w)!==r)continue;if(k++,k===u){d=w;break}}if(!d)return null;o=d}return o}function R(p,n,x){if(!Number.isFinite(n)||!Number.isFinite(x))throw RangeError(`createAnchor: click coordinates must be finite (got ${n}, ${x})`);if(!p.isConnected)throw Error("createAnchor: element is not connected to a document");if(G(p))throw Error("createAnchor: refusing to anchor an element inside #fbc-root");let o=p.ownerDocument;if(p.getRootNode()!==o)throw Error("createAnchor: element is inside a shadow root; anchor its shadow host instead");let b=p.getBoundingClientRect(),f=ip(o.defaultView),r=b.width>0?O((n-b.left)/b.width):0.5,u=b.height>0?O((x-b.top)/b.height):0.5;return{id:P(p,o)!==null?p.id:null,selector:Zp(p,o),xpath:$p(p,o),text:N(p.textContent),tag:H(p),offsetX:r,offsetY:u,docX:n+f.x,docY:x+f.y}}function U(p,n){return p!==null&&H(p)===n&&!G(p)}function Mp(p){return p instanceof DOMException||p instanceof Error&&p.name==="SyntaxError"}function Wp(p,n){if(typeof p.id!=="string"||p.id==="")return null;let x=n.getElementById(p.id);if(!x)return null;return n.querySelectorAll(`#${q(p.id,n.defaultView)}`).length===1?x:null}function Kp(p,n){if(typeof p.selector!=="string"||p.selector.trim()==="")return null;let x;try{x=n.querySelectorAll(p.selector)}catch(o){if(Mp(o))return null;throw o}return x.length===1?x[0]??null:null}function Hp(p,n){if(typeof p.xpath!=="string")return null;return Fp(p.xpath,n)}function Lp(p,n){if(typeof p.text!=="string"||p.text==="")return null;let x=null;for(let o of Array.from(n.getElementsByTagName("*"))){if(H(o)!==p.tag||G(o))continue;if(N(o.textContent)!==p.text)continue;if(x)return null;x=o}return x}function S(p,n=document){if(typeof p.tag!=="string"||p.tag==="")return{el:null,strategy:"none"};let x=p.tag.toLowerCase(),o=Wp(p,n);if(U(o,x))return{el:o,strategy:"id"};let b,f=()=>{if(b===void 0)b=Lp({...p,tag:x},n);return U(b,x)?b:null},r=(d)=>{if(p.text===null||N(d.textContent)===p.text)return null;let w=f();return w&&w!==d?w:null},u=Kp(p,n);if(U(u,x)){let d=r(u);return d?{el:d,strategy:"text"}:{el:u,strategy:"selector"}}let a=Hp(p,n);if(U(a,x)){let d=r(a);return d?{el:d,strategy:"text"}:{el:a,strategy:"xpath"}}let k=f();if(k)return{el:k,strategy:"text"};return{el:null,strategy:"none"}}function T(p){if(!p.isConnected)return!1;let n=dp(p);if(!n)return!1;let x=n.getComputedStyle(p);if(x.visibility==="hidden"||x.visibility==="collapse")return!1;let o=p;while(o){if(n.getComputedStyle(o).display==="none")return!1;o=o.parentElement}let b=p.getBoundingClientRect();return!(b.width===0&&b.height===0)}class y extends Error{status;constructor(p,n){super(p);this.status=n}}class X{cfg;constructor(p){this.cfg=p}url(p,n){let x=this.cfg.restUrl.replace(/\/$/,"")+p;if(n){let o=new URLSearchParams(n).toString();if(o)x+=(x.includes("?")?"&":"?")+o}return x}async request(p,n,x,o){let b=typeof FormData<"u"&&x instanceof FormData,f=await fetch(this.url(n,o),{method:p,credentials:"same-origin",headers:{"X-WP-Nonce":this.cfg.nonce,...x!==void 0&&!b?{"Content-Type":"application/json"}:{}},body:x===void 0?void 0:b?x:JSON.stringify(x)}),r=await f.json().catch(()=>null);if(!f.ok){let u=r&&typeof r==="object"&&"message"in r?String(r.message):f.statusText;throw new y(u,f.status)}return r}listItems(p){return this.request("GET","/items",void 0,p?{page_path:p}:void 0)}getItem(p){return this.request("GET",`/items/${p}`)}createItem(p,n){if(!n)return this.request("POST","/items",p);let x=new FormData;return x.append("data",JSON.stringify(p)),x.append("screenshot",n,"screenshot.jpg"),this.request("POST","/items",x)}replaceScreenshot(p,n){let x=new FormData;return x.append("screenshot",n,"screenshot.jpg"),this.request("POST",`/items/${p}/screenshot`,x)}updateItem(p,n){return this.request("PATCH",`/items/${p}`,n)}deleteItem(p){return this.request("DELETE",`/items/${p}`)}addComment(p,n){return this.request("POST",`/items/${p}/comments`,{body:n})}}function L(p=window.innerWidth){if(p<768)return"mobile";if(p<=1024)return"tablet";return"desktop"}function Cp(p){let n=[[/Edg\/([\d.]+)/,"Edge"],[/OPR\/([\d.]+)/,"Opera"],[/Firefox\/([\d.]+)/,"Firefox"],[/CriOS\/([\d.]+)/,"Chrome iOS"],[/Chrome\/([\d.]+)/,"Chrome"],[/Version\/([\d.]+).*Safari/,"Safari"]];for(let[x,o]of n){let b=p.match(x);if(b)return`${o} ${b[1].split(".")[0]}`}return"Unknown"}function Up(p){let n=p.match(/(iPhone|iPad).*OS ([\d_]+)/);if(n)return`iOS ${n[2].replace(/_/g,".")}`;if(n=p.match(/Android ([\d.]+)/),n)return`Android ${n[1]}`;if(n=p.match(/Windows NT ([\d.]+)/),n)return n[1]==="10.0"?"Windows 10/11":`Windows NT ${n[1]}`;if(n=p.match(/Mac OS X ([\d_]+)/),n)return`macOS ${n[1].replace(/_/g,".")}`;if(/CrOS/.test(p))return"ChromeOS";if(/Linux/.test(p))return"Linux";return"Unknown"}var V=null;function E(){let p=navigator.userAgentData;if(!p)return;p.getHighEntropyValues(["platform","platformVersion"]).then(({platform:n,platformVersion:x})=>{if(!n||!x)return;let[o,b]=x.split(".");if(n==="macOS")V=`macOS ${o}.${b??"0"}`;else if(n==="Windows")V=Number(o)>=13?"Windows 11":"Windows 10";else if(n==="Android"||n==="Chrome OS"||n==="Linux")V=`${n} ${x}`.trim()}).catch(()=>{})}function t(p){let n=navigator.userAgent;return{viewport_w:window.innerWidth,viewport_h:window.innerHeight,dpr:Math.round((window.devicePixelRatio||1)*100)/100,breakpoint:L(),browser:Cp(n),os:V??Up(n),user_agent:n,post_id:p.page.postId,post_type:p.page.postType,theme:p.page.theme,js_errors:(window.__fbcErrors??[]).slice(-20)}}function m(p){let n=window.location.pathname,x=p.replace(/\/$/,"");if(x&&n.startsWith(x))n=n.slice(x.length);return n="/"+n.replace(/^\/+/,""),n==="/"?"/":n.replace(/\/?$/,"/")}function l(){let p=new URLSearchParams(window.location.search);return p.delete("fbc_item"),p.toString()}function s(){if(window.__fbcErrors)return;let p=window.__fbcErrors=[],n=(x)=>{if(p.push(x.slice(0,500)),p.length>20)p.shift()};window.addEventListener("error",(x)=>{if(x.message)n(`${x.message}${x.filename?` (${x.filename}:${x.lineno})`:""}`)}),window.addEventListener("unhandledrejection",(x)=>{let o=x.reason;n(`Unhandled rejection: ${o instanceof Error?o.message:String(o)}`)})}function g(p,n={},...x){let o=document.createElement(p);for(let[b,f]of Object.entries(n)){if(f===null||f===void 0||f===!1)continue;if(b.startsWith("on")&&typeof f==="function")o.addEventListener(b.slice(2).toLowerCase(),f);else if(b==="text")o.textContent=String(f);else if(b==="value"&&"value"in o)o.value=String(f);else if(f===!0)o.setAttribute(b,"");else o.setAttribute(b,String(f))}for(let b of x){if(b===null||b===void 0||b===!1)continue;o.append(typeof b==="number"?String(b):b)}return o}function z(p,n,x,o={}){let b=g("select",{name:p,...o});for(let[f,r]of n){let u=g("option",{value:f,text:r});if(f===x)u.selected=!0;b.append(u)}return b}function Y(p){let n=new Date(p).getTime();if(Number.isNaN(n))return"";let x=Math.round((Date.now()-n)/1000);if(x<60)return"just now";let o=Math.round(x/60);if(o<60)return`${o}m ago`;let b=Math.round(o/60);if(b<24)return`${b}h ago`;let f=Math.round(b/24);if(f<30)return`${f}d ago`;return new Date(p).toLocaleDateString()}var C=["bug","tweak","change","comment"],c="fbc:mode",h="fbc:corner",M=16,e=360,Vp=["tl","tr","bl","br"];class B{cfg;api;host;root;pinsLayer;outline;outlineTag;toolbar=null;sidebar=null;card=null;hintEl=null;bannerEl=null;mode=!1;showResolved=!1;pinMode=null;states=new Map;allItems=null;filters={scope:"page",type:"",status:"unresolved",mine:!1,round:0};pagePath;framePending=!1;refreshTimer=0;lastWidth=window.innerWidth;mutationObserver=null;loaded=!1;corner="br";dragging=!1;ghost=null;pendingShot=null;constructor(p){this.cfg=p;this.api=new X(p),this.pagePath=p.pagePath??m(p.homePath)}init(){this.mount(),this.bindGlobalEvents(),this.bindAdminBar();let p=!1;try{p=window.localStorage.getItem(c)==="1";let n=window.localStorage.getItem(h);if(n&&Vp.includes(n))this.corner=n}catch{p=!1}if(this.cfg.openItem||p)this.setMode(!0)}mount(){this.host=g("div",{id:D}),this.host.setAttribute("style","all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;");let p=this.host.attachShadow({mode:"open"});p.append(g("style",{text:A})),this.root=g("div",{class:"fbc"});let n=this.cfg.brand;if(n){let o=[["--primary",n.primary],["--on-primary",n.onPrimary],["--dark",n.dark],["--on-dark",n.onDark],["--brand-accent",n.accent],["--ink-primary",n.ink??""]];for(let[b,f]of o)if(f)this.root.style.setProperty(b,f)}let x=g("div",{class:"layer"});this.outlineTag=g("span",{class:"outline-tag"}),this.outline=g("div",{class:"outline"},this.outlineTag),this.pinsLayer=g("div"),x.append(this.outline,this.pinsLayer),this.root.append(x),p.append(this.root),document.body.append(this.host)}inOverlay(p){return p.composedPath().includes(this.host)}bindGlobalEvents(){document.addEventListener("contextmenu",(p)=>this.onContextMenu(p),!0),document.addEventListener("mousemove",(p)=>this.onMouseMove(p),{capture:!0,passive:!0});for(let p of["pointerdown","mousedown","mouseup","click"])document.addEventListener(p,(n)=>this.onPinModeEvent(n),!0);document.addEventListener("mousedown",(p)=>this.onOutsideMouseDown(p),!1),document.addEventListener("keydown",(p)=>this.onKeyDown(p),!0),window.addEventListener("scroll",()=>this.schedulePosition(),{passive:!0,capture:!0}),window.addEventListener("resize",()=>{let p=window.innerWidth!==this.lastWidth;if(this.lastWidth=window.innerWidth,p)this.scheduleRefresh(80);else this.schedulePosition()})}bindAdminBar(){document.querySelector("#wp-admin-bar-fbc-toggle > a")?.addEventListener("click",(n)=>{n.preventDefault(),this.setMode(!this.mode)})}async setMode(p){this.mode=p;try{window.localStorage.setItem(c,p?"1":"0")}catch{}if(document.querySelector("#wp-admin-bar-fbc-toggle")?.classList.toggle("fbc-on",p),!p){this.exitPinMode(),this.closeCard(),this.closeSidebar(),this.hideOutline(),this.toolbar?.remove(),this.toolbar=null,this.bannerEl?.remove(),this.bannerEl=null,this.pinsLayer.replaceChildren();for(let n of this.states.values())n.pin=null;this.mutationObserver?.disconnect();return}if(this.renderToolbar(),this.observeMutations(),!this.loaded)await this.loadItems();else this.refresh();if(this.cfg.openItem){let n=this.cfg.openItem;this.cfg.openItem=0,this.stripDeepLinkParam(),this.openDeepLink(n)}}stripDeepLinkParam(){let p=new URL(window.location.href);if(p.searchParams.has("fbc_item"))p.searchParams.delete("fbc_item"),window.history.replaceState(window.history.state,"",p.toString())}async loadItems(){try{let{items:p}=await this.api.listItems(this.pagePath);this.states.clear();for(let n of p)this.states.set(n.id,{item:n,el:null,placement:"orphan",pin:null});this.loaded=!0,this.refresh()}catch(p){this.toast(`Could not load feedback: ${p.message}`,!0)}}upsert(p){let n=this.states.get(p.id);if(n)n.item=p;else this.states.set(p.id,{item:p,el:null,placement:"orphan",pin:null});if(this.allItems){let x=this.allItems.findIndex((o)=>o.id===p.id);if(x>=0)this.allItems[x]=p;else this.allItems.push(p)}}remove(p){if(this.states.get(p)?.pin?.remove(),this.states.delete(p),this.allItems)this.allItems=this.allItems.filter((x)=>x.id!==p)}refresh(){for(let p of this.states.values()){if(!p.item.anchor){p.el=null,p.placement="note";continue}let n=p.el&&p.el.isConnected?p.el:S(p.item.anchor).el;p.el=n,p.placement=!n?"orphan":T(n)?"pinned":"hidden"}if(this.drawPins(),this.updateToolbarCount(),this.sidebar)this.renderSidebarList()}drawPins(){if(!this.mode)return;for(let p of this.states.values()){if(!(p.placement==="pinned"&&(this.showResolved||p.item.status!=="resolved"))){p.pin?.remove(),p.pin=null;continue}if(!p.pin){let b=g("button",{class:"pin",type:"button","aria-label":`Feedback #${p.item.id}: ${p.item.title}`,onclick:(f)=>{f.stopPropagation(),this.openPopover(p.item.id)}});p.pin=b,this.pinsLayer.append(b)}let x=p.item.status==="resolved",o=p.pin.classList.contains("pulse");p.pin.className=`pin ${p.item.type}${x?" resolved":""}${o?" pulse":""}`,p.pin.textContent=x?"✓":String(p.item.id),p.pin.title=`#${p.item.id} ${p.item.title}`}this.positionPins()}schedulePosition(){if(this.framePending||!this.mode)return;this.framePending=!0,requestAnimationFrame(()=>{this.framePending=!1,this.positionPins(),this.positionChrome()})}scheduleRefresh(p=250){window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.mode&&this.refresh(),p)}positionPins(){for(let p of this.states.values()){if(!p.pin||!p.el||!p.item.anchor)continue;let n=p.el.getBoundingClientRect(),x=n.left+p.item.anchor.offsetX*n.width,o=n.top+p.item.anchor.offsetY*n.height;p.pin.style.transform=`translate(${Math.round(x)}px, ${Math.round(o)}px)`}}observeMutations(){if(!this.mutationObserver)this.mutationObserver=new MutationObserver((p)=>{if(p.every((n)=>n.target===this.host||this.host.contains(n.target)))return;this.schedulePosition(),this.scheduleRefresh(300)});this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden","open"]})}onContextMenu(p){if(!this.mode||p.altKey||this.inOverlay(p))return;let n=this.eventTarget(p);if(!n)return;p.preventDefault(),p.stopPropagation(),this.exitPinMode(),this.openTypeMenu(n,p.clientX,p.clientY)}onPinModeEvent(p){if(!this.pinMode||this.inOverlay(p)||p.button!==0)return;if(p.preventDefault(),p.stopImmediatePropagation(),p.type!=="click")return;let n=this.eventTarget(p),x=this.pinMode;if(this.exitPinMode(),n)x.done(n,p.clientX,p.clientY)}onOutsideMouseDown(p){if(this.card&&!this.inOverlay(p))this.closeCard()}onMouseMove(p){if(!this.mode||this.card&&!this.pinMode||this.inOverlay(p)){if(!this.pinMode)this.hideOutline();return}let n=this.eventTarget(p);if(!n||n===document.documentElement||n===document.body){this.hideOutline();return}let x=n.getBoundingClientRect();Object.assign(this.outline.style,{left:`${x.left}px`,top:`${x.top}px`,width:`${x.width}px`,height:`${x.height}px`});let o=n.id?`#${n.id}`:"";this.outlineTag.textContent=`${n.tagName.toLowerCase()}${o}`,this.outline.classList.add("on")}onKeyDown(p){let n=p.composedPath()[0],x=n instanceof HTMLElement&&(n.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(n.tagName));if(p.altKey&&p.shiftKey&&p.code==="KeyF"&&!x){p.preventDefault(),this.setMode(!this.mode);return}if(p.key==="Escape"&&this.mode){if(this.pinMode)this.exitPinMode(),p.preventDefault();else if(this.card)this.closeCard(),p.preventDefault();else if(this.sidebar)this.closeSidebar(),p.preventDefault()}}eventTarget(p){let n=p.target;if(n instanceof Element)return n;if(n instanceof Node)return n.parentElement;return null}hideOutline(){this.outline.classList.remove("on")}enterPinMode(p){this.closeCard(),this.pinMode=p,this.hintEl?.remove(),this.hintEl=g("div",{class:"crosshair-hint",text:`${p.hint} · Esc to cancel`}),this.root.append(this.hintEl),document.documentElement.style.cursor="crosshair",this.renderToolbar()}exitPinMode(){if(!this.pinMode)return;this.pinMode=null,this.hintEl?.remove(),this.hintEl=null,document.documentElement.style.cursor="",this.hideOutline(),this.renderToolbar()}scripts=new Map;loadBundle(p){let n=this.scripts.get(p);if(n)return n;let x=this.cfg.assetsUrl??"",o=new Promise((b,f)=>{let r=document.createElement("script");r.src=`${x}${p}${this.cfg.version?`?ver=${encodeURIComponent(this.cfg.version)}`:""}`,r.async=!0,r.onload=()=>b(),r.onerror=()=>{this.scripts.delete(p),f(Error(`Could not load ${p}`))},document.head.append(r)});return this.scripts.set(p,o),o}async startCapture(p){if(!this.cfg.shots||!this.cfg.assetsUrl)return null;try{if(!window.FBCCapture)await this.loadBundle("capture.js");let n=window.FBCCapture;if(!n)return null;return await n.captureViewport({marker:p,color:this.cfg.brand?.primary??"#6953c4"})}catch{return null}}assigneeOptions(){return[["0","Unassigned"],...this.cfg.assignees.people.map((p)=>[String(p.id),p.name])]}assigneeLabel(){return this.cfg.assignees.source==="teamwork"?"Assignee (Teamwork)":"Assignee"}safeAnchor(p,n,x){try{return R(p,n,x)}catch{return this.toast("Can't pin to that element. Try its container, or add a page note.",!0),null}}closeCard(){this.card?.remove(),this.card=null}showCard(p,n,x){this.closeCard(),this.hideOutline(),this.card=p,p.style.left="0px",p.style.top="0px",p.style.visibility="hidden",this.root.append(p);let{offsetWidth:o,offsetHeight:b}=p,f=Math.max(12,Math.min(n+8,window.innerWidth-o-12)),r=Math.max(this.topOffset()+12,Math.min(x+8,window.innerHeight-b-12));p.style.left=`${f}px`,p.style.top=`${r}px`,p.style.visibility=""}openTypeMenu(p,n,x){this.pendingShot=this.startCapture({x:n,y:x});let o=this.cfg.labels.type,b=(u)=>this.openComposer(u,p,n,x),f=C.map((u,a)=>g("button",{type:"button",onclick:()=>b(u)},g("span",{class:`dot ${u}`}),o[u],g("kbd",{text:String(a+1)}))),r=g("div",{class:"card menu",role:"menu",onkeydown:(u)=>{let a=u.key,k=Number(a);if(k>=1&&k<=C.length)u.preventDefault(),b(C[k-1])}},g("div",{class:"menu-title",text:"Add feedback"}),...f,g("hr"),g("button",{type:"button",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},"Note for the whole page"));this.showCard(r,n,x),f[0].focus()}openComposer(p,n,x,o){let b=null;if(n){if(b=this.safeAnchor(n,x,o),!b)return}let f=this.cfg.labels,r=z("type",C.map((v)=>[v,f.type[v]]),p),u=g("input",{type:"text",name:"title",maxlength:255,required:!0,placeholder:"What needs attention?",autocomplete:"off"}),a=g("textarea",{name:"description",placeholder:"Details, steps to reproduce, what you expected… (optional)"}),k=z("priority",Object.keys(f.priority).map((v)=>[v,f.priority[v]]),"medium"),d=z("assignee_id",this.assigneeOptions(),"0"),w=g("div",{class:"error",role:"alert"}),j=g("button",{class:"btn primary",type:"submit",text:"Add"}),W=this.pendingShot??this.startCapture(n?{x,y:o}:null);this.pendingShot=null;let Z=null,$="",J=g("div",{class:"shot","aria-live":"polite"}),Q=()=>{if($)URL.revokeObjectURL($);$=Z?URL.createObjectURL(Z):"",J.replaceChildren(...Z?[g("img",{src:$,alt:"Screenshot that will be attached"}),g("div",{class:"shot-actions"},this.cfg.shots?g("button",{type:"button",class:"btn link",text:"Remove screenshot",onclick:()=>{Z=null,W=Promise.resolve(null),Q()}}):null)]:[]),J.hidden=!Z};if(this.cfg.shots)J.textContent="Capturing screenshot…",W.then((v)=>{if(Z=v,Q(),!v)J.hidden=!0});else J.hidden=!0;let i=g("form",{class:"card composer",novalidate:!0,onsubmit:(v)=>{v.preventDefault(),K()}},g("div",{class:"head"},g("span",{class:"chip"},g("span",{class:`dot ${p}`}),n?`<${n.tagName.toLowerCase()}>`:"Whole page"),g("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),g("label",{class:"field"},g("span",{text:"Title"}),u),w,g("label",{class:"field"},g("span",{text:"Description"}),a),g("div",{class:"row"},g("label",{class:"field"},g("span",{text:"Type"}),r),g("label",{class:"field"},g("span",{text:"Priority"}),k)),g("label",{class:"field"},g("span",{text:this.assigneeLabel()}),d),J,g("div",{class:"actions"},g("button",{class:"btn link",type:"button",text:"Cancel",onclick:()=>this.closeCard()}),j)),K=async()=>{if(!u.value.trim()){w.textContent="Add a short title.",u.focus();return}j.disabled=!0;try{let v=this.cfg.shots?await Promise.race([W,new Promise((np)=>window.setTimeout(()=>np(null),1e4))]):null,F=await this.api.createItem({type:r.value,title:u.value.trim(),description:a.value,priority:k.value,assignee_id:Number(d.value),page_path:this.pagePath,page_query:l(),page_title:document.title,anchor:b,context:t(this.cfg)},Z??v);if($)URL.revokeObjectURL($);this.closeCard(),this.upsert(F);let _=this.states.get(F.id);if(_&&n)_.el=n;if(this.refresh(),F.screenshot_error)this.toast(`Added #${F.id}, but the screenshot wasn’t saved: ${F.screenshot_error}`,!0);else this.toast(`Added #${F.id}`)}catch(v){w.textContent=v.message,j.disabled=!1}};this.showCard(i,x,o),u.focus()}async openPopover(p,n){let x;try{x=await this.api.getItem(p)}catch(i){this.toast(i.message,!0);return}this.upsert(x);let o=this.cfg.labels,b=this.states.get(p),f=b?.pin?.getBoundingClientRect(),r=n?.x??(f?f.right:window.innerWidth/2-170),u=n?.y??(f?f.top:100),a=async(i)=>{try{let K=await this.api.updateItem(p,i);this.upsert(K),this.refresh(),this.openPopover(p,{x:parseFloat(Q.style.left)-8,y:parseFloat(Q.style.top)-8})}catch(K){this.toast(K.message,!0)}},k=z("status",Object.keys(o.status).map((i)=>[i,o.status[i]]),x.status,{onchange:()=>void a({status:k.value})}),d=z("assignee_id",this.assigneeOptions(),String(x.assignee_id),{onchange:()=>void a({assignee_id:Number(d.value)})}),w=z("priority",Object.keys(o.priority).map((i)=>[i,o.priority[i]]),x.priority,{onchange:()=>void a({priority:w.value})}),j=g("textarea",{placeholder:"Reply…",rows:2}),W=g("ul",{class:"thread"},...(x.comments??[]).map((i)=>g("li",{class:i.kind},g("span",{class:"who",text:i.user_name}),g("span",{class:"when",text:Y(i.created_at)}),g("div",{class:"body",text:i.body})))),Z=L(),$=x.breakpoint&&x.breakpoint!==Z?g("div",{class:"notice",text:`Logged at ${x.breakpoint} (${x.context?.viewport_w??"?"}px). You are on ${Z} (${window.innerWidth}px).`}):null,J=b?.placement==="orphan"?g("div",{class:"notice",text:"The element this was pinned to can’t be found on the page anymore. Re-anchor it."}):null,Q=g("div",{class:"card popover",role:"dialog","aria-label":`Feedback #${x.id}`},g("div",{class:"head"},g("span",{class:"chip"},g("span",{class:`dot ${x.type}`}),`${o.type[x.type]} #${x.id}`),g("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),g("div",{class:"t",style:"font-weight:700;font-size:15px;margin-bottom:4px",text:x.title}),g("div",{class:"meta",text:`Round ${x.round} · ${x.reporter_name} · ${Y(x.created_at)}${x.breakpoint?` · ${x.breakpoint}`:""}`}),x.tw_task_url?g("div",{class:"meta"},g("a",{href:x.tw_task_url,target:"_blank",rel:"noopener",text:`Teamwork task #${x.tw_task_id} ↗`}),x.status==="resolved"?" · completed":" · status syncs from Teamwork"):null,$,J,x.description?g("p",{class:"desc",text:x.description}):null,x.screenshot_url?g("a",{class:"shot",href:x.screenshot_url,target:"_blank",rel:"noopener",title:"Open full screenshot"},g("img",{src:x.screenshot_url,alt:"Screenshot from when this was filed"})):null,g("div",{class:"row"},g("label",{class:"field"},g("span",{text:"Status"}),k),g("label",{class:"field"},g("span",{text:"Priority"}),w)),x.assignee_locked?g("div",{class:"field"},g("span",{text:this.assigneeLabel()}),g("div",{text:x.assignee_name||"Unassigned"}),g("div",{class:"meta",text:"In Teamwork now: change the assignee there."})):g("label",{class:"field"},g("span",{text:this.assigneeLabel()}),d),W,g("label",{class:"field"},j),g("div",{class:"actions"},x.anchor||b?.placement==="note"?g("button",{class:"btn link left",type:"button",text:"Re-anchor",onclick:()=>this.reanchor(x.id)}):null,g("a",{class:"btn link",href:`${this.cfg.adminUrl}&item=${x.id}`,target:"_blank",rel:"noopener",text:"Admin"}),x.can_delete?g("button",{class:"btn danger",type:"button",text:"Delete",onclick:()=>void this.deleteItem(x.id)}):null,g("button",{class:"btn primary",type:"button",text:"Reply",onclick:async()=>{if(!j.value.trim())return;try{await this.api.addComment(x.id,j.value),this.openPopover(p,{x:parseFloat(Q.style.left)-8,y:parseFloat(Q.style.top)-8})}catch(i){this.toast(i.message,!0)}}})));this.showCard(Q,r,u)}reanchor(p){this.enterPinMode({hint:`Click the element #${p} belongs to`,done:async(n,x,o)=>{try{let b=this.safeAnchor(n,x,o);if(!b)return;let f=await this.api.updateItem(p,{anchor:b});this.upsert(f);let r=this.states.get(p);if(r)r.el=n;this.refresh(),this.toast(`Re-anchored #${p}`)}catch(b){this.toast(b.message,!0)}}})}async deleteItem(p){if(!window.confirm(`Delete feedback #${p}? This can’t be undone.`))return;try{await this.api.deleteItem(p),this.closeCard(),this.remove(p),this.refresh(),this.toast(`Deleted #${p}`)}catch(n){this.toast(n.message,!0)}}async openDeepLink(p){let n=this.states.get(p);if(n?.el&&n.placement==="pinned")n.el.scrollIntoView({block:"center",behavior:"auto"}),await new Promise((o)=>requestAnimationFrame(()=>o(null))),this.positionPins(),n.pin?.classList.add("pulse");let x=n?.item;if(x?.breakpoint&&x.breakpoint!==L())this.showBanner(`#${p} was logged at ${x.breakpoint} (${x.context?.viewport_w??"?"}px wide). You're viewing at ${L()} (${window.innerWidth}px). Resize to reproduce.`);await this.openPopover(p)}unresolvedCount(){let p=0;for(let n of this.states.values())if(n.item.status!=="resolved")p++;return p}renderToolbar(){if(!this.mode)return;let p=this.unresolvedCount(),n=g("div",{class:"toolbar",role:"toolbar","aria-label":this.cfg.brand?.name??"Feedback"},g("button",{type:"button",class:"grip",title:"Drag to move · arrow keys snap to a corner","aria-label":"Move toolbar: drag, or use arrow keys to snap to a corner",text:"⠿",onpointerdown:(o)=>this.startDrag(o),onkeydown:(o)=>this.onGripKey(o)}),this.cfg.brand?.logo?g("span",{class:"brand",title:`${this.cfg.brand.name} · drag to move`,onpointerdown:(o)=>this.startDrag(o)},g("img",{src:this.cfg.brand.logo,alt:this.cfg.brand.name})):g("span",{class:"brand",title:"Drag to move",text:this.cfg.brand?.label??"Feedback",onpointerdown:(o)=>this.startDrag(o)}),g("button",{type:"button",class:this.pinMode?"on":"",title:"Click an element to pin feedback (or right-click anywhere)",text:"+ Add",onclick:()=>this.pinMode?this.exitPinMode():this.enterPinMode({hint:"Click any element to add feedback",done:(o,b,f)=>this.openTypeMenu(o,b,f)})}),g("button",{type:"button",text:"Page note",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)}),g("button",{type:"button",class:this.sidebar?"on":"",onclick:()=>this.sidebar?this.closeSidebar():this.openSidebar()},g("span",{class:"label",text:"List"}),p?g("span",{class:"count",text:String(p)}):null),g("button",{type:"button",class:this.showResolved?"on":"",title:"Show resolved pins",text:"✓ Resolved",onclick:()=>{this.showResolved=!this.showResolved,this.drawPins(),this.renderToolbar()}}),g("button",{type:"button",title:"Exit Feedback mode (Alt+Shift+F)","aria-label":"Exit Feedback mode",text:"×",onclick:()=>void this.setMode(!1)})),x=!!this.toolbar;if(this.toolbar)this.toolbar.replaceWith(n);else this.root.append(n);if(this.toolbar=n,this.positionToolbar(!1),!x)this.positionChrome()}updateToolbarCount(){this.renderToolbar()}topOffset(){let p=document.getElementById("wpadminbar");if(!p)return 0;let n=p.getBoundingClientRect();return n.height>0?Math.max(0,Math.round(n.bottom)):0}toolbarTarget(p){let n=this.toolbar,x=n?.offsetWidth??0,o=n?.offsetHeight??0,b=this.topOffset(),f=p.endsWith("l")?M:window.innerWidth-x-M;if(p.endsWith("r")&&this.sidebar&&window.innerWidth>=e+x+M*2)f-=e;let r=p.startsWith("t")?b+M:window.innerHeight-o-M;return{x:Math.max(0,f),y:Math.max(b,r)}}nearestCorner(p,n){let x=this.topOffset(),o=n<x+(window.innerHeight-x)/2?"t":"b",b=p<window.innerWidth/2?"l":"r";return`${o}${b}`}positionToolbar(p=!1){let n=this.toolbar;if(!n||this.dragging)return;let{x,y:o}=this.toolbarTarget(this.corner);n.classList.toggle("snapping",p),n.style.left=`${x}px`,n.style.top=`${o}px`,n.dataset.corner=this.corner}positionChrome(){this.root.style.setProperty("--top-offset",`${this.topOffset()}px`);let p=this.toolbar?.offsetHeight??0,n=this.toolbar&&this.corner.startsWith("b")?p+M*2:24;this.root.style.setProperty("--toast-bottom",`${n}px`),this.positionToolbar(!1)}setCorner(p){this.corner=p;try{window.localStorage.setItem(h,p)}catch{}this.positionToolbar(!0),this.positionChrome()}startDrag(p){let n=this.toolbar;if(!n||p.button!==0)return;p.preventDefault(),p.stopPropagation();let x=n.getBoundingClientRect(),o=p.clientX-x.left,b=p.clientY-x.top;this.dragging=!0,n.classList.remove("snapping"),n.classList.add("dragging"),this.ghost?.remove(),this.ghost=g("div",{class:"snap-ghost"}),Object.assign(this.ghost.style,{width:`${x.width}px`,height:`${x.height}px`}),this.root.append(this.ghost);let f=(u)=>{let a=this.topOffset(),k=Math.min(Math.max(u.clientX-o,0),window.innerWidth-x.width),d=Math.min(Math.max(u.clientY-b,a),window.innerHeight-x.height);n.style.left=`${k}px`,n.style.top=`${d}px`;let w=this.nearestCorner(k+x.width/2,d+x.height/2),j=this.toolbarTarget(w);if(this.ghost)Object.assign(this.ghost.style,{left:`${j.x}px`,top:`${j.y}px`});n.dataset.target=w},r=(u)=>{window.removeEventListener("pointermove",f,!0),window.removeEventListener("pointerup",r,!0),window.removeEventListener("pointercancel",r,!0);let a=n.getBoundingClientRect();this.dragging=!1,n.classList.remove("dragging"),this.ghost?.remove(),this.ghost=null,delete n.dataset.target,this.setCorner(u.type==="pointercancel"?this.corner:this.nearestCorner(a.left+a.width/2,a.top+a.height/2))};window.addEventListener("pointermove",f,!0),window.addEventListener("pointerup",r,!0),window.addEventListener("pointercancel",r,!0)}onGripKey(p){let x={ArrowLeft:(o)=>`${o[0]}l`,ArrowRight:(o)=>`${o[0]}r`,ArrowUp:(o)=>`t${o[1]}`,ArrowDown:(o)=>`b${o[1]}`}[p.key];if(!x)return;p.preventDefault(),this.setCorner(x(this.corner)),this.toolbar?.querySelector(".grip")?.focus()}openSidebar(){this.sidebar?.remove();let p=this.filters,n=this.cfg.labels,x=z("scope",[["page","This page"],["all","All pages"]],p.scope,{onchange:()=>{p.scope=x.value,this.renderSidebarList()}}),o=z("type",[["","All types"],...C.map((a)=>[a,n.type[a]])],p.type,{onchange:()=>{p.type=o.value,this.renderSidebarList()}}),b=z("status",[["unresolved","Unresolved"],["","Any status"],...Object.keys(n.status).map((a)=>[a,n.status[a]])],p.status,{onchange:()=>{p.status=b.value,this.renderSidebarList()}}),f=[["0","All rounds"]];for(let a=this.cfg.round;a>=1;a--)f.push([String(a),a===this.cfg.round?`Round ${a} (current)`:`Round ${a}`]);let r=z("round",f,String(p.round),{onchange:()=>{p.round=Number(r.value),this.renderSidebarList()}}),u=g("input",{type:"checkbox",onchange:()=>{p.mine=u.checked,this.renderSidebarList()}});u.checked=p.mine,this.sidebar=g("div",{class:"sidebar",role:"complementary","aria-label":"Feedback list"},g("header",{},g("h2",{},this.cfg.brand?.label??"Feedback",g("button",{class:"x",type:"button","aria-label":"Close list",text:"×",onclick:()=>this.closeSidebar()})),g("div",{class:"filters"},x,o,b,r,g("label",{},u,"Assigned to me"))),g("div",{class:"list"})),this.root.append(this.sidebar),this.renderToolbar(),this.renderSidebarList()}closeSidebar(){this.sidebar?.remove(),this.sidebar=null,this.renderToolbar()}matches(p){let n=this.filters;if(n.type&&p.type!==n.type)return!1;if(n.round&&p.round!==n.round)return!1;if(n.status==="unresolved"&&p.status==="resolved")return!1;if(n.status&&n.status!=="unresolved"&&p.status!==n.status)return!1;if(n.mine&&(!this.cfg.assignees.me||p.assignee_id!==this.cfg.assignees.me))return!1;return!0}async renderSidebarList(){let p=this.sidebar?.querySelector(".list");if(!p)return;let n=(b,f,r)=>g("button",{class:"entry",type:"button",onclick:f},g("span",{class:`num ${b.status==="resolved"?"resolved":b.type}`,text:`#${b.id}`}),g("span",{},g("span",{class:"t",text:b.title}),g("span",{class:"s",text:`Round ${b.round} · ${this.cfg.labels.status[b.status]}${b.assignee_name?` · ${b.assignee_name}`:""}${b.breakpoint?` · ${b.breakpoint}`:""}`})),r??null);if(this.filters.scope==="all"){if(!this.allItems){p.replaceChildren(g("div",{class:"empty",text:"Loading…"}));try{this.allItems=(await this.api.listItems()).items}catch(r){p.replaceChildren(g("div",{class:"empty",text:r.message}));return}}let b=new Map;for(let r of this.allItems.filter((u)=>this.matches(u))){let u=b.get(r.page_path)??[];u.push(r),b.set(r.page_path,u)}let f=[];for(let[r,u]of b){f.push(g("h3",{text:r===this.pagePath?`${r} (this page)`:r}));for(let a of u)f.push(n(a,()=>{if(a.page_path===this.pagePath)this.focusItem(a.id);else{let k=new URL(a.page_url,window.location.origin);k.searchParams.set("fbc_item",String(a.id)),window.location.href=k.toString()}}))}p.replaceChildren(...f.length?f:[g("div",{class:"empty",text:"Nothing matches these filters."})]);return}let x={pinned:{title:"On this page",nodes:[]},note:{title:"Page notes",nodes:[]},hidden:{title:"At other breakpoints",nodes:[]},orphan:{title:"Orphaned — element not found",nodes:[]}};for(let b of[...this.states.values()].sort((f,r)=>f.item.id-r.item.id)){if(!this.matches(b.item))continue;let f=b.placement==="orphan"?g("span",{class:"btn link reanchor",role:"button",text:"Re-anchor",onclick:(r)=>{r.stopPropagation(),this.reanchor(b.item.id)}}):null;x[b.placement].nodes.push(n(b.item,()=>this.focusItem(b.item.id),f))}let o=[];for(let b of["pinned","note","hidden","orphan"]){let f=x[b];if(!f.nodes.length)continue;let r=b==="hidden"?`${f.nodes.length} at other breakpoints`:f.title;o.push(g("h3",{text:r}),...f.nodes)}p.replaceChildren(...o.length?o:[g("div",{class:"empty",text:"No feedback on this page yet. Right-click anything to add some."})])}focusItem(p){let n=this.states.get(p);if(!n)return;if(n.placement==="pinned"&&n.el){if(n.item.status==="resolved"&&!this.showResolved)this.showResolved=!0,this.drawPins();n.el.scrollIntoView({block:"center",behavior:"smooth"}),window.setTimeout(()=>{this.positionPins(),n.pin?.classList.remove("pulse"),n.pin?.offsetWidth,n.pin?.classList.add("pulse"),this.openPopover(p)},450)}else this.openPopover(p,{x:window.innerWidth-720,y:80})}toast(p,n=!1){let x=g("div",{class:`toast${n?" err":""}`,role:"status",text:p});this.root.append(x),window.setTimeout(()=>x.remove(),n?5000:2200)}showBanner(p){this.bannerEl?.remove(),this.bannerEl=g("div",{class:"banner",role:"status"},g("span",{text:p}),g("button",{type:"button",text:"Dismiss",onclick:()=>{this.bannerEl?.remove(),this.bannerEl=null}})),this.root.append(this.bannerEl)}}s();E();function pp(){let p=window.fbcConfig;if(!p||window.self!==window.top)return;new B(p).init()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",pp,{once:!0});else pp();})();
