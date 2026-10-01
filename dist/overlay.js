(()=>{var X=`:host {
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
`;var A="fbc-root";var e=["ember","react-","__next","radix-","headlessui-","mui-","yui_","ext-gen"],pp=/[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i,np=/^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;function op(p){let n=/[a-z]/i.test(p),o=/[0-9]/.test(p);if(!n||!o)return!1;if(p.length>=6&&/^[0-9a-f]+$/i.test(p))return!0;return p.length>=8&&/^[0-9a-z]+$/i.test(p)&&xp(p)>=2}function xp(p){let n=0;for(let o=1;o<p.length;o++){let x=/[0-9]/.test(p.charAt(o-1)),b=/[0-9]/.test(p.charAt(o));if(x!==b)n++}return n}function bp(p){if(p.trim()===""||/\s/.test(p))return!1;if(/^[0-9]/.test(p))return!1;if(/[0-9]{5,}/.test(p))return!1;if(pp.test(p))return!1;if(np.test(p))return!1;let n=p.toLowerCase();if(e.some((o)=>n.startsWith(o)))return!1;return!p.split(/[-_:.]/).some(op)}function rp(p){let n="",o=p.length,x=p.charCodeAt(0);for(let b=0;b<o;b++){let f=p.charCodeAt(b),g=p.charAt(b);if(f===0)n+="�";else if(f>=1&&f<=31||f===127||b===0&&f>=48&&f<=57||b===1&&f>=48&&f<=57&&x===45)n+=`\\${f.toString(16)} `;else if(b===0&&o===1&&f===45)n+=`\\${g}`;else if(f>=128||f===45||f===95||f>=48&&f<=57||f>=65&&f<=90||f>=97&&f<=122)n+=g;else n+=`\\${g}`}return n}function L(p,n){let o=n?n.CSS:void 0,x=globalThis.CSS,b=o?.escape??x?.escape;return b?b(p):rp(p)}function fp(p){return p.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}function $(p){return p.localName.toLowerCase()}function gp(p){return p.ownerDocument.defaultView}function up(p){if(!p)return{x:0,y:0};let n=Number.isFinite(p.scrollX)?p.scrollX:0,o=Number.isFinite(p.scrollY)?p.scrollY:0;return{x:n,y:o}}function Y(p){if(!Number.isFinite(p))return 0.5;return Math.min(1,Math.max(0,p))}function B(p){let n=p;while(n){if(n.id==="fbc-root")return!0;if(n.parentElement)n=n.parentElement;else{let o=n.getRootNode();n=o instanceof ShadowRoot?o.host:null}}return!1}function q(p){if(p===null)return null;let n=p.replace(/\s+/g," ").trim();if(n==="")return null;let o=Array.from(n);return o.length>120?o.slice(0,120).join(""):n}var ap=/^fl-node-(?!content$)[a-z0-9]+$/i,ip=/^[a-z0-9]+$/i;function O(p){let n=1,o=p.previousElementSibling;while(o){if(o.localName===p.localName&&o.namespaceURI===p.namespaceURI)n++;o=o.previousElementSibling}return n}function _(p,n){if(!p.id||!bp(p.id))return null;let o=`#${L(p.id,n.defaultView)}`,x=n.querySelectorAll(o);return x.length===1&&x[0]===p?o:null}function kp(p,n){if(p===n.documentElement)return"html";let o=p.localName,x=p.getAttribute("data-id");if(x!==null&&p.classList.contains("elementor-element")&&ip.test(x))return`${o}[data-id="${fp(x)}"]`;let b=Array.from(p.classList).find((f)=>ap.test(f));if(b!==void 0)return`${o}.${L(b,n.defaultView)}`;return`${o}:nth-of-type(${O(p)})`}function dp(p,n,o){let x=o.querySelectorAll(p);return x.length===1&&x[0]===n}function wp(p,n){let o=[],x=p;while(x){let b=_(x,n);if(b!==null)return o.unshift(b),o.join(" > ");o.unshift(kp(x,n));let f=o.join(" > ");if(dp(f,p,n))return f;x=x.parentElement}return o.join(" > ")}function vp(p,n){let o=[],x=p;while(x){let b=$(x),f=x.parentElement,g=x===n.documentElement||f===n.documentElement&&(b==="head"||b==="body");o.unshift(g?b:`${b}[${O(x)}]`),x=f}return`/${o.join("/")}`}var zp=/^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i,jp=/^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;function Jp(p,n){if(!zp.test(p))return null;let o=p.slice(1).split("/"),x=null;for(let b of o){let f=jp.exec(b);if(!f)return null;let g=(f[1]??"").toLowerCase(),u=f[2]===void 0?1:Number(f[2]),a=x?Array.from(x.children):n.documentElement?[n.documentElement]:[],i=0,k=null;for(let d of a){if($(d)!==g)continue;if(i++,i===u){k=d;break}}if(!k)return null;x=k}return x}function D(p,n,o){if(!Number.isFinite(n)||!Number.isFinite(o))throw RangeError(`createAnchor: click coordinates must be finite (got ${n}, ${o})`);if(!p.isConnected)throw Error("createAnchor: element is not connected to a document");if(B(p))throw Error("createAnchor: refusing to anchor an element inside #fbc-root");let x=p.ownerDocument;if(p.getRootNode()!==x)throw Error("createAnchor: element is inside a shadow root; anchor its shadow host instead");let b=p.getBoundingClientRect(),f=up(x.defaultView),g=b.width>0?Y((n-b.left)/b.width):0.5,u=b.height>0?Y((o-b.top)/b.height):0.5;return{id:_(p,x)!==null?p.id:null,selector:wp(p,x),xpath:vp(p,x),text:q(p.textContent),tag:$(p),offsetX:g,offsetY:u,docX:n+f.x,docY:o+f.y}}function U(p,n){return p!==null&&$(p)===n&&!B(p)}function Zp(p){return p instanceof DOMException||p instanceof Error&&p.name==="SyntaxError"}function $p(p,n){if(typeof p.id!=="string"||p.id==="")return null;let o=n.getElementById(p.id);if(!o)return null;return n.querySelectorAll(`#${L(p.id,n.defaultView)}`).length===1?o:null}function Fp(p,n){if(typeof p.selector!=="string"||p.selector.trim()==="")return null;let o;try{o=n.querySelectorAll(p.selector)}catch(x){if(Zp(x))return null;throw x}return o.length===1?o[0]??null:null}function Qp(p,n){if(typeof p.xpath!=="string")return null;return Jp(p.xpath,n)}function Wp(p,n){if(typeof p.text!=="string"||p.text==="")return null;let o=null;for(let x of Array.from(n.getElementsByTagName("*"))){if($(x)!==p.tag||B(x))continue;if(q(x.textContent)!==p.text)continue;if(o)return null;o=x}return o}function I(p,n=document){if(typeof p.tag!=="string"||p.tag==="")return{el:null,strategy:"none"};let o=p.tag.toLowerCase(),x=$p(p,n);if(U(x,o))return{el:x,strategy:"id"};let b,f=()=>{if(b===void 0)b=Wp({...p,tag:o},n);return U(b,o)?b:null},g=(k)=>{if(p.text===null||q(k.textContent)===p.text)return null;let d=f();return d&&d!==k?d:null},u=Fp(p,n);if(U(u,o)){let k=g(u);return k?{el:k,strategy:"text"}:{el:u,strategy:"selector"}}let a=Qp(p,n);if(U(a,o)){let k=g(a);return k?{el:k,strategy:"text"}:{el:a,strategy:"xpath"}}let i=f();if(i)return{el:i,strategy:"text"};return{el:null,strategy:"none"}}function P(p){if(!p.isConnected)return!1;let n=gp(p);if(!n)return!1;let o=n.getComputedStyle(p);if(o.visibility==="hidden"||o.visibility==="collapse")return!1;let x=p;while(x){if(n.getComputedStyle(x).display==="none")return!1;x=x.parentElement}let b=p.getBoundingClientRect();return!(b.width===0&&b.height===0)}class R extends Error{status;constructor(p,n){super(p);this.status=n}}class V{cfg;constructor(p){this.cfg=p}url(p,n){let o=this.cfg.restUrl.replace(/\/$/,"")+p;if(n){let x=new URLSearchParams(n).toString();if(x)o+=(o.includes("?")?"&":"?")+x}return o}async request(p,n,o,x){let b=await fetch(this.url(n,x),{method:p,credentials:"same-origin",headers:{"X-WP-Nonce":this.cfg.nonce,...o!==void 0?{"Content-Type":"application/json"}:{}},body:o!==void 0?JSON.stringify(o):void 0}),f=await b.json().catch(()=>null);if(!b.ok){let g=f&&typeof f==="object"&&"message"in f?String(f.message):b.statusText;throw new R(g,b.status)}return f}listItems(p){return this.request("GET","/items",void 0,p?{page_path:p}:void 0)}getItem(p){return this.request("GET",`/items/${p}`)}createItem(p){return this.request("POST","/items",p)}updateItem(p,n){return this.request("PATCH",`/items/${p}`,n)}deleteItem(p){return this.request("DELETE",`/items/${p}`)}addComment(p,n){return this.request("POST",`/items/${p}/comments`,{body:n})}}function F(p=window.innerWidth){if(p<768)return"mobile";if(p<=1024)return"tablet";return"desktop"}function Mp(p){let n=[[/Edg\/([\d.]+)/,"Edge"],[/OPR\/([\d.]+)/,"Opera"],[/Firefox\/([\d.]+)/,"Firefox"],[/CriOS\/([\d.]+)/,"Chrome iOS"],[/Chrome\/([\d.]+)/,"Chrome"],[/Version\/([\d.]+).*Safari/,"Safari"]];for(let[o,x]of n){let b=p.match(o);if(b)return`${x} ${b[1].split(".")[0]}`}return"Unknown"}function Up(p){let n=p.match(/(iPhone|iPad).*OS ([\d_]+)/);if(n)return`iOS ${n[2].replace(/_/g,".")}`;if(n=p.match(/Android ([\d.]+)/),n)return`Android ${n[1]}`;if(n=p.match(/Windows NT ([\d.]+)/),n)return n[1]==="10.0"?"Windows 10/11":`Windows NT ${n[1]}`;if(n=p.match(/Mac OS X ([\d_]+)/),n)return`macOS ${n[1].replace(/_/g,".")}`;if(/CrOS/.test(p))return"ChromeOS";if(/Linux/.test(p))return"Linux";return"Unknown"}var K=null;function S(){let p=navigator.userAgentData;if(!p)return;p.getHighEntropyValues(["platform","platformVersion"]).then(({platform:n,platformVersion:o})=>{if(!n||!o)return;let[x,b]=o.split(".");if(n==="macOS")K=`macOS ${x}.${b??"0"}`;else if(n==="Windows")K=Number(x)>=13?"Windows 11":"Windows 10";else if(n==="Android"||n==="Chrome OS"||n==="Linux")K=`${n} ${o}`.trim()}).catch(()=>{})}function y(p){let n=navigator.userAgent;return{viewport_w:window.innerWidth,viewport_h:window.innerHeight,dpr:Math.round((window.devicePixelRatio||1)*100)/100,breakpoint:F(),browser:Mp(n),os:K??Up(n),user_agent:n,post_id:p.page.postId,post_type:p.page.postType,theme:p.page.theme,js_errors:(window.__fbcErrors??[]).slice(-20)}}function T(p){let n=window.location.pathname,o=p.replace(/\/$/,"");if(o&&n.startsWith(o))n=n.slice(o.length);return n="/"+n.replace(/^\/+/,""),n==="/"?"/":n.replace(/\/?$/,"/")}function E(){let p=new URLSearchParams(window.location.search);return p.delete("fbc_item"),p.toString()}function t(){if(window.__fbcErrors)return;let p=window.__fbcErrors=[],n=(o)=>{if(p.push(o.slice(0,500)),p.length>20)p.shift()};window.addEventListener("error",(o)=>{if(o.message)n(`${o.message}${o.filename?` (${o.filename}:${o.lineno})`:""}`)}),window.addEventListener("unhandledrejection",(o)=>{let x=o.reason;n(`Unhandled rejection: ${x instanceof Error?x.message:String(x)}`)})}function r(p,n={},...o){let x=document.createElement(p);for(let[b,f]of Object.entries(n)){if(f===null||f===void 0||f===!1)continue;if(b.startsWith("on")&&typeof f==="function")x.addEventListener(b.slice(2).toLowerCase(),f);else if(b==="text")x.textContent=String(f);else if(b==="value"&&"value"in x)x.value=String(f);else if(f===!0)x.setAttribute(b,"");else x.setAttribute(b,String(f))}for(let b of o){if(b===null||b===void 0||b===!1)continue;x.append(typeof b==="number"?String(b):b)}return x}function j(p,n,o,x={}){let b=r("select",{name:p,...x});for(let[f,g]of n){let u=r("option",{value:f,text:g});if(f===o)u.selected=!0;b.append(u)}return b}function G(p){let n=new Date(p).getTime();if(Number.isNaN(n))return"";let o=Math.round((Date.now()-n)/1000);if(o<60)return"just now";let x=Math.round(o/60);if(x<60)return`${x}m ago`;let b=Math.round(x/60);if(b<24)return`${b}h ago`;let f=Math.round(b/24);if(f<30)return`${f}d ago`;return new Date(p).toLocaleDateString()}var Q=["bug","tweak","change","comment"],m="fbc:mode",s="fbc:corner",J=16,l=360,Kp=["tl","tr","bl","br"];class N{cfg;api;host;root;pinsLayer;outline;outlineTag;toolbar=null;sidebar=null;card=null;hintEl=null;bannerEl=null;mode=!1;showResolved=!1;pinMode=null;states=new Map;allItems=null;filters={scope:"page",type:"",status:"unresolved",mine:!1};pagePath;framePending=!1;refreshTimer=0;lastWidth=window.innerWidth;mutationObserver=null;loaded=!1;corner="br";dragging=!1;ghost=null;constructor(p){this.cfg=p;this.api=new V(p),this.pagePath=p.pagePath??T(p.homePath)}init(){this.mount(),this.bindGlobalEvents(),this.bindAdminBar();let p=!1;try{p=window.localStorage.getItem(m)==="1";let n=window.localStorage.getItem(s);if(n&&Kp.includes(n))this.corner=n}catch{p=!1}if(this.cfg.openItem||p)this.setMode(!0)}mount(){this.host=r("div",{id:A}),this.host.setAttribute("style","all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;");let p=this.host.attachShadow({mode:"open"});p.append(r("style",{text:X})),this.root=r("div",{class:"fbc"});let n=this.cfg.brand;if(n){let x=[["--primary",n.primary],["--on-primary",n.onPrimary],["--dark",n.dark],["--on-dark",n.onDark],["--brand-accent",n.accent],["--ink-primary",n.ink??""]];for(let[b,f]of x)if(f)this.root.style.setProperty(b,f)}let o=r("div",{class:"layer"});this.outlineTag=r("span",{class:"outline-tag"}),this.outline=r("div",{class:"outline"},this.outlineTag),this.pinsLayer=r("div"),o.append(this.outline,this.pinsLayer),this.root.append(o),p.append(this.root),document.body.append(this.host)}inOverlay(p){return p.composedPath().includes(this.host)}bindGlobalEvents(){document.addEventListener("contextmenu",(p)=>this.onContextMenu(p),!0),document.addEventListener("mousemove",(p)=>this.onMouseMove(p),{capture:!0,passive:!0});for(let p of["pointerdown","mousedown","mouseup","click"])document.addEventListener(p,(n)=>this.onPinModeEvent(n),!0);document.addEventListener("mousedown",(p)=>this.onOutsideMouseDown(p),!1),document.addEventListener("keydown",(p)=>this.onKeyDown(p),!0),window.addEventListener("scroll",()=>this.schedulePosition(),{passive:!0,capture:!0}),window.addEventListener("resize",()=>{let p=window.innerWidth!==this.lastWidth;if(this.lastWidth=window.innerWidth,p)this.scheduleRefresh(80);else this.schedulePosition()})}bindAdminBar(){document.querySelector("#wp-admin-bar-fbc-toggle > a")?.addEventListener("click",(n)=>{n.preventDefault(),this.setMode(!this.mode)})}async setMode(p){this.mode=p;try{window.localStorage.setItem(m,p?"1":"0")}catch{}if(document.querySelector("#wp-admin-bar-fbc-toggle")?.classList.toggle("fbc-on",p),!p){this.exitPinMode(),this.closeCard(),this.closeSidebar(),this.hideOutline(),this.toolbar?.remove(),this.toolbar=null,this.bannerEl?.remove(),this.bannerEl=null,this.pinsLayer.replaceChildren();for(let n of this.states.values())n.pin=null;this.mutationObserver?.disconnect();return}if(this.renderToolbar(),this.observeMutations(),!this.loaded)await this.loadItems();else this.refresh();if(this.cfg.openItem){let n=this.cfg.openItem;this.cfg.openItem=0,this.stripDeepLinkParam(),this.openDeepLink(n)}}stripDeepLinkParam(){let p=new URL(window.location.href);if(p.searchParams.has("fbc_item"))p.searchParams.delete("fbc_item"),window.history.replaceState(window.history.state,"",p.toString())}async loadItems(){try{let{items:p}=await this.api.listItems(this.pagePath);this.states.clear();for(let n of p)this.states.set(n.id,{item:n,el:null,placement:"orphan",pin:null});this.loaded=!0,this.refresh()}catch(p){this.toast(`Could not load feedback: ${p.message}`,!0)}}upsert(p){let n=this.states.get(p.id);if(n)n.item=p;else this.states.set(p.id,{item:p,el:null,placement:"orphan",pin:null});if(this.allItems){let o=this.allItems.findIndex((x)=>x.id===p.id);if(o>=0)this.allItems[o]=p;else this.allItems.push(p)}}remove(p){if(this.states.get(p)?.pin?.remove(),this.states.delete(p),this.allItems)this.allItems=this.allItems.filter((o)=>o.id!==p)}refresh(){for(let p of this.states.values()){if(!p.item.anchor){p.el=null,p.placement="note";continue}let n=p.el&&p.el.isConnected?p.el:I(p.item.anchor).el;p.el=n,p.placement=!n?"orphan":P(n)?"pinned":"hidden"}if(this.drawPins(),this.updateToolbarCount(),this.sidebar)this.renderSidebarList()}drawPins(){if(!this.mode)return;for(let p of this.states.values()){if(!(p.placement==="pinned"&&(this.showResolved||p.item.status!=="resolved"))){p.pin?.remove(),p.pin=null;continue}if(!p.pin){let b=r("button",{class:"pin",type:"button","aria-label":`Feedback #${p.item.id}: ${p.item.title}`,onclick:(f)=>{f.stopPropagation(),this.openPopover(p.item.id)}});p.pin=b,this.pinsLayer.append(b)}let o=p.item.status==="resolved",x=p.pin.classList.contains("pulse");p.pin.className=`pin ${p.item.type}${o?" resolved":""}${x?" pulse":""}`,p.pin.textContent=o?"✓":String(p.item.id),p.pin.title=`#${p.item.id} ${p.item.title}`}this.positionPins()}schedulePosition(){if(this.framePending||!this.mode)return;this.framePending=!0,requestAnimationFrame(()=>{this.framePending=!1,this.positionPins(),this.positionChrome()})}scheduleRefresh(p=250){window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.mode&&this.refresh(),p)}positionPins(){for(let p of this.states.values()){if(!p.pin||!p.el||!p.item.anchor)continue;let n=p.el.getBoundingClientRect(),o=n.left+p.item.anchor.offsetX*n.width,x=n.top+p.item.anchor.offsetY*n.height;p.pin.style.transform=`translate(${Math.round(o)}px, ${Math.round(x)}px)`}}observeMutations(){if(!this.mutationObserver)this.mutationObserver=new MutationObserver((p)=>{if(p.every((n)=>n.target===this.host||this.host.contains(n.target)))return;this.schedulePosition(),this.scheduleRefresh(300)});this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden","open"]})}onContextMenu(p){if(!this.mode||p.altKey||this.inOverlay(p))return;let n=this.eventTarget(p);if(!n)return;p.preventDefault(),p.stopPropagation(),this.exitPinMode(),this.openTypeMenu(n,p.clientX,p.clientY)}onPinModeEvent(p){if(!this.pinMode||this.inOverlay(p)||p.button!==0)return;if(p.preventDefault(),p.stopImmediatePropagation(),p.type!=="click")return;let n=this.eventTarget(p),o=this.pinMode;if(this.exitPinMode(),n)o.done(n,p.clientX,p.clientY)}onOutsideMouseDown(p){if(this.card&&!this.inOverlay(p))this.closeCard()}onMouseMove(p){if(!this.mode||this.card&&!this.pinMode||this.inOverlay(p)){if(!this.pinMode)this.hideOutline();return}let n=this.eventTarget(p);if(!n||n===document.documentElement||n===document.body){this.hideOutline();return}let o=n.getBoundingClientRect();Object.assign(this.outline.style,{left:`${o.left}px`,top:`${o.top}px`,width:`${o.width}px`,height:`${o.height}px`});let x=n.id?`#${n.id}`:"";this.outlineTag.textContent=`${n.tagName.toLowerCase()}${x}`,this.outline.classList.add("on")}onKeyDown(p){let n=p.composedPath()[0],o=n instanceof HTMLElement&&(n.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(n.tagName));if(p.altKey&&p.shiftKey&&p.code==="KeyF"&&!o){p.preventDefault(),this.setMode(!this.mode);return}if(p.key==="Escape"&&this.mode){if(this.pinMode)this.exitPinMode(),p.preventDefault();else if(this.card)this.closeCard(),p.preventDefault();else if(this.sidebar)this.closeSidebar(),p.preventDefault()}}eventTarget(p){let n=p.target;if(n instanceof Element)return n;if(n instanceof Node)return n.parentElement;return null}hideOutline(){this.outline.classList.remove("on")}enterPinMode(p){this.closeCard(),this.pinMode=p,this.hintEl?.remove(),this.hintEl=r("div",{class:"crosshair-hint",text:`${p.hint} · Esc to cancel`}),this.root.append(this.hintEl),document.documentElement.style.cursor="crosshair",this.renderToolbar()}exitPinMode(){if(!this.pinMode)return;this.pinMode=null,this.hintEl?.remove(),this.hintEl=null,document.documentElement.style.cursor="",this.hideOutline(),this.renderToolbar()}assigneeOptions(){return[["0","Unassigned"],...this.cfg.assignees.people.map((p)=>[String(p.id),p.name])]}assigneeLabel(){return this.cfg.assignees.source==="teamwork"?"Assignee (Teamwork)":"Assignee"}safeAnchor(p,n,o){try{return D(p,n,o)}catch{return this.toast("Can't pin to that element. Try its container, or add a page note.",!0),null}}closeCard(){this.card?.remove(),this.card=null}showCard(p,n,o){this.closeCard(),this.hideOutline(),this.card=p,p.style.left="0px",p.style.top="0px",p.style.visibility="hidden",this.root.append(p);let{offsetWidth:x,offsetHeight:b}=p,f=Math.max(12,Math.min(n+8,window.innerWidth-x-12)),g=Math.max(this.topOffset()+12,Math.min(o+8,window.innerHeight-b-12));p.style.left=`${f}px`,p.style.top=`${g}px`,p.style.visibility=""}openTypeMenu(p,n,o){let x=this.cfg.labels.type,b=(u)=>this.openComposer(u,p,n,o),f=Q.map((u,a)=>r("button",{type:"button",onclick:()=>b(u)},r("span",{class:`dot ${u}`}),x[u],r("kbd",{text:String(a+1)}))),g=r("div",{class:"card menu",role:"menu",onkeydown:(u)=>{let a=u.key,i=Number(a);if(i>=1&&i<=Q.length)u.preventDefault(),b(Q[i-1])}},r("div",{class:"menu-title",text:"Add feedback"}),...f,r("hr"),r("button",{type:"button",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},"Note for the whole page"));this.showCard(g,n,o),f[0].focus()}openComposer(p,n,o,x){let b=null;if(n){if(b=this.safeAnchor(n,o,x),!b)return}let f=this.cfg.labels,g=j("type",Q.map((v)=>[v,f.type[v]]),p),u=r("input",{type:"text",name:"title",maxlength:255,required:!0,placeholder:"What needs attention?",autocomplete:"off"}),a=r("textarea",{name:"description",placeholder:"Details, steps to reproduce, what you expected… (optional)"}),i=j("priority",Object.keys(f.priority).map((v)=>[v,f.priority[v]]),"medium"),k=j("assignee_id",this.assigneeOptions(),"0"),d=r("div",{class:"error",role:"alert"}),z=r("button",{class:"btn primary",type:"submit",text:"Add"}),C=r("form",{class:"card composer",novalidate:!0,onsubmit:(v)=>{v.preventDefault(),W()}},r("div",{class:"head"},r("span",{class:"chip"},r("span",{class:`dot ${p}`}),n?`<${n.tagName.toLowerCase()}>`:"Whole page"),r("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),r("label",{class:"field"},r("span",{text:"Title"}),u),d,r("label",{class:"field"},r("span",{text:"Description"}),a),r("div",{class:"row"},r("label",{class:"field"},r("span",{text:"Type"}),g),r("label",{class:"field"},r("span",{text:"Priority"}),i)),r("label",{class:"field"},r("span",{text:this.assigneeLabel()}),k),r("div",{class:"actions"},r("button",{class:"btn link",type:"button",text:"Cancel",onclick:()=>this.closeCard()}),z)),W=async()=>{if(!u.value.trim()){d.textContent="Add a short title.",u.focus();return}z.disabled=!0;try{let v=await this.api.createItem({type:g.value,title:u.value.trim(),description:a.value,priority:i.value,assignee_id:Number(k.value),page_path:this.pagePath,page_query:E(),page_title:document.title,anchor:b,context:y(this.cfg)});this.closeCard(),this.upsert(v);let M=this.states.get(v.id);if(M&&n)M.el=n;this.refresh(),this.toast(`Added #${v.id}`)}catch(v){d.textContent=v.message,z.disabled=!1}};this.showCard(C,o,x),u.focus()}async openPopover(p,n){let o;try{o=await this.api.getItem(p)}catch(w){this.toast(w.message,!0);return}this.upsert(o);let x=this.cfg.labels,b=this.states.get(p),f=b?.pin?.getBoundingClientRect(),g=n?.x??(f?f.right:window.innerWidth/2-170),u=n?.y??(f?f.top:100),a=async(w)=>{try{let H=await this.api.updateItem(p,w);this.upsert(H),this.refresh(),this.openPopover(p,{x:parseFloat(Z.style.left)-8,y:parseFloat(Z.style.top)-8})}catch(H){this.toast(H.message,!0)}},i=j("status",Object.keys(x.status).map((w)=>[w,x.status[w]]),o.status,{onchange:()=>void a({status:i.value})}),k=j("assignee_id",this.assigneeOptions(),String(o.assignee_id),{onchange:()=>void a({assignee_id:Number(k.value)})}),d=j("priority",Object.keys(x.priority).map((w)=>[w,x.priority[w]]),o.priority,{onchange:()=>void a({priority:d.value})}),z=r("textarea",{placeholder:"Reply…",rows:2}),C=r("ul",{class:"thread"},...(o.comments??[]).map((w)=>r("li",{class:w.kind},r("span",{class:"who",text:w.user_name}),r("span",{class:"when",text:G(w.created_at)}),r("div",{class:"body",text:w.body})))),W=F(),v=o.breakpoint&&o.breakpoint!==W?r("div",{class:"notice",text:`Logged at ${o.breakpoint} (${o.context?.viewport_w??"?"}px). You are on ${W} (${window.innerWidth}px).`}):null,M=b?.placement==="orphan"?r("div",{class:"notice",text:"The element this was pinned to can’t be found on the page anymore. Re-anchor it."}):null,Z=r("div",{class:"card popover",role:"dialog","aria-label":`Feedback #${o.id}`},r("div",{class:"head"},r("span",{class:"chip"},r("span",{class:`dot ${o.type}`}),`${x.type[o.type]} #${o.id}`),r("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),r("div",{class:"t",style:"font-weight:700;font-size:15px;margin-bottom:4px",text:o.title}),r("div",{class:"meta",text:`${o.reporter_name} · ${G(o.created_at)}${o.breakpoint?` · ${o.breakpoint}`:""}`}),o.tw_task_url?r("div",{class:"meta"},r("a",{href:o.tw_task_url,target:"_blank",rel:"noopener",text:`Teamwork task #${o.tw_task_id} ↗`}),o.status==="resolved"?" · completed":" · status syncs from Teamwork"):null,v,M,o.description?r("p",{class:"desc",text:o.description}):null,r("div",{class:"row"},r("label",{class:"field"},r("span",{text:"Status"}),i),r("label",{class:"field"},r("span",{text:"Priority"}),d)),o.assignee_locked?r("div",{class:"field"},r("span",{text:this.assigneeLabel()}),r("div",{text:o.assignee_name||"Unassigned"}),r("div",{class:"meta",text:"In Teamwork now: change the assignee there."})):r("label",{class:"field"},r("span",{text:this.assigneeLabel()}),k),C,r("label",{class:"field"},z),r("div",{class:"actions"},o.anchor||b?.placement==="note"?r("button",{class:"btn link left",type:"button",text:"Re-anchor",onclick:()=>this.reanchor(o.id)}):null,r("a",{class:"btn link",href:`${this.cfg.adminUrl}&item=${o.id}`,target:"_blank",rel:"noopener",text:"Admin"}),o.can_delete?r("button",{class:"btn danger",type:"button",text:"Delete",onclick:()=>void this.deleteItem(o.id)}):null,r("button",{class:"btn primary",type:"button",text:"Reply",onclick:async()=>{if(!z.value.trim())return;try{await this.api.addComment(o.id,z.value),this.openPopover(p,{x:parseFloat(Z.style.left)-8,y:parseFloat(Z.style.top)-8})}catch(w){this.toast(w.message,!0)}}})));this.showCard(Z,g,u)}reanchor(p){this.enterPinMode({hint:`Click the element #${p} belongs to`,done:async(n,o,x)=>{try{let b=this.safeAnchor(n,o,x);if(!b)return;let f=await this.api.updateItem(p,{anchor:b});this.upsert(f);let g=this.states.get(p);if(g)g.el=n;this.refresh(),this.toast(`Re-anchored #${p}`)}catch(b){this.toast(b.message,!0)}}})}async deleteItem(p){if(!window.confirm(`Delete feedback #${p}? This can’t be undone.`))return;try{await this.api.deleteItem(p),this.closeCard(),this.remove(p),this.refresh(),this.toast(`Deleted #${p}`)}catch(n){this.toast(n.message,!0)}}async openDeepLink(p){let n=this.states.get(p);if(n?.el&&n.placement==="pinned")n.el.scrollIntoView({block:"center",behavior:"auto"}),await new Promise((x)=>requestAnimationFrame(()=>x(null))),this.positionPins(),n.pin?.classList.add("pulse");let o=n?.item;if(o?.breakpoint&&o.breakpoint!==F())this.showBanner(`#${p} was logged at ${o.breakpoint} (${o.context?.viewport_w??"?"}px wide). You're viewing at ${F()} (${window.innerWidth}px). Resize to reproduce.`);await this.openPopover(p)}unresolvedCount(){let p=0;for(let n of this.states.values())if(n.item.status!=="resolved")p++;return p}renderToolbar(){if(!this.mode)return;let p=this.unresolvedCount(),n=r("div",{class:"toolbar",role:"toolbar","aria-label":this.cfg.brand?.name??"Feedback"},r("button",{type:"button",class:"grip",title:"Drag to move · arrow keys snap to a corner","aria-label":"Move toolbar: drag, or use arrow keys to snap to a corner",text:"⠿",onpointerdown:(x)=>this.startDrag(x),onkeydown:(x)=>this.onGripKey(x)}),this.cfg.brand?.logo?r("span",{class:"brand",title:`${this.cfg.brand.name} · drag to move`,onpointerdown:(x)=>this.startDrag(x)},r("img",{src:this.cfg.brand.logo,alt:this.cfg.brand.name})):r("span",{class:"brand",title:"Drag to move",text:this.cfg.brand?.label??"Feedback",onpointerdown:(x)=>this.startDrag(x)}),r("button",{type:"button",class:this.pinMode?"on":"",title:"Click an element to pin feedback (or right-click anywhere)",text:"+ Add",onclick:()=>this.pinMode?this.exitPinMode():this.enterPinMode({hint:"Click any element to add feedback",done:(x,b,f)=>this.openTypeMenu(x,b,f)})}),r("button",{type:"button",text:"Page note",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)}),r("button",{type:"button",class:this.sidebar?"on":"",onclick:()=>this.sidebar?this.closeSidebar():this.openSidebar()},r("span",{class:"label",text:"List"}),p?r("span",{class:"count",text:String(p)}):null),r("button",{type:"button",class:this.showResolved?"on":"",title:"Show resolved pins",text:"✓ Resolved",onclick:()=>{this.showResolved=!this.showResolved,this.drawPins(),this.renderToolbar()}}),r("button",{type:"button",title:"Exit Feedback mode (Alt+Shift+F)","aria-label":"Exit Feedback mode",text:"×",onclick:()=>void this.setMode(!1)})),o=!!this.toolbar;if(this.toolbar)this.toolbar.replaceWith(n);else this.root.append(n);if(this.toolbar=n,this.positionToolbar(!1),!o)this.positionChrome()}updateToolbarCount(){this.renderToolbar()}topOffset(){let p=document.getElementById("wpadminbar");if(!p)return 0;let n=p.getBoundingClientRect();return n.height>0?Math.max(0,Math.round(n.bottom)):0}toolbarTarget(p){let n=this.toolbar,o=n?.offsetWidth??0,x=n?.offsetHeight??0,b=this.topOffset(),f=p.endsWith("l")?J:window.innerWidth-o-J;if(p.endsWith("r")&&this.sidebar&&window.innerWidth>=l+o+J*2)f-=l;let g=p.startsWith("t")?b+J:window.innerHeight-x-J;return{x:Math.max(0,f),y:Math.max(b,g)}}nearestCorner(p,n){let o=this.topOffset(),x=n<o+(window.innerHeight-o)/2?"t":"b",b=p<window.innerWidth/2?"l":"r";return`${x}${b}`}positionToolbar(p=!1){let n=this.toolbar;if(!n||this.dragging)return;let{x:o,y:x}=this.toolbarTarget(this.corner);n.classList.toggle("snapping",p),n.style.left=`${o}px`,n.style.top=`${x}px`,n.dataset.corner=this.corner}positionChrome(){this.root.style.setProperty("--top-offset",`${this.topOffset()}px`);let p=this.toolbar?.offsetHeight??0,n=this.toolbar&&this.corner.startsWith("b")?p+J*2:24;this.root.style.setProperty("--toast-bottom",`${n}px`),this.positionToolbar(!1)}setCorner(p){this.corner=p;try{window.localStorage.setItem(s,p)}catch{}this.positionToolbar(!0),this.positionChrome()}startDrag(p){let n=this.toolbar;if(!n||p.button!==0)return;p.preventDefault(),p.stopPropagation();let o=n.getBoundingClientRect(),x=p.clientX-o.left,b=p.clientY-o.top;this.dragging=!0,n.classList.remove("snapping"),n.classList.add("dragging"),this.ghost?.remove(),this.ghost=r("div",{class:"snap-ghost"}),Object.assign(this.ghost.style,{width:`${o.width}px`,height:`${o.height}px`}),this.root.append(this.ghost);let f=(u)=>{let a=this.topOffset(),i=Math.min(Math.max(u.clientX-x,0),window.innerWidth-o.width),k=Math.min(Math.max(u.clientY-b,a),window.innerHeight-o.height);n.style.left=`${i}px`,n.style.top=`${k}px`;let d=this.nearestCorner(i+o.width/2,k+o.height/2),z=this.toolbarTarget(d);if(this.ghost)Object.assign(this.ghost.style,{left:`${z.x}px`,top:`${z.y}px`});n.dataset.target=d},g=(u)=>{window.removeEventListener("pointermove",f,!0),window.removeEventListener("pointerup",g,!0),window.removeEventListener("pointercancel",g,!0);let a=n.getBoundingClientRect();this.dragging=!1,n.classList.remove("dragging"),this.ghost?.remove(),this.ghost=null,delete n.dataset.target,this.setCorner(u.type==="pointercancel"?this.corner:this.nearestCorner(a.left+a.width/2,a.top+a.height/2))};window.addEventListener("pointermove",f,!0),window.addEventListener("pointerup",g,!0),window.addEventListener("pointercancel",g,!0)}onGripKey(p){let o={ArrowLeft:(x)=>`${x[0]}l`,ArrowRight:(x)=>`${x[0]}r`,ArrowUp:(x)=>`t${x[1]}`,ArrowDown:(x)=>`b${x[1]}`}[p.key];if(!o)return;p.preventDefault(),this.setCorner(o(this.corner)),this.toolbar?.querySelector(".grip")?.focus()}openSidebar(){this.sidebar?.remove();let p=this.filters,n=this.cfg.labels,o=j("scope",[["page","This page"],["all","All pages"]],p.scope,{onchange:()=>{p.scope=o.value,this.renderSidebarList()}}),x=j("type",[["","All types"],...Q.map((g)=>[g,n.type[g]])],p.type,{onchange:()=>{p.type=x.value,this.renderSidebarList()}}),b=j("status",[["unresolved","Unresolved"],["","Any status"],...Object.keys(n.status).map((g)=>[g,n.status[g]])],p.status,{onchange:()=>{p.status=b.value,this.renderSidebarList()}}),f=r("input",{type:"checkbox",onchange:()=>{p.mine=f.checked,this.renderSidebarList()}});f.checked=p.mine,this.sidebar=r("div",{class:"sidebar",role:"complementary","aria-label":"Feedback list"},r("header",{},r("h2",{},this.cfg.brand?.label??"Feedback",r("button",{class:"x",type:"button","aria-label":"Close list",text:"×",onclick:()=>this.closeSidebar()})),r("div",{class:"filters"},o,x,b,r("span"),r("label",{},f,"Assigned to me"))),r("div",{class:"list"})),this.root.append(this.sidebar),this.renderToolbar(),this.renderSidebarList()}closeSidebar(){this.sidebar?.remove(),this.sidebar=null,this.renderToolbar()}matches(p){let n=this.filters;if(n.type&&p.type!==n.type)return!1;if(n.status==="unresolved"&&p.status==="resolved")return!1;if(n.status&&n.status!=="unresolved"&&p.status!==n.status)return!1;if(n.mine&&(!this.cfg.assignees.me||p.assignee_id!==this.cfg.assignees.me))return!1;return!0}async renderSidebarList(){let p=this.sidebar?.querySelector(".list");if(!p)return;let n=(b,f,g)=>r("button",{class:"entry",type:"button",onclick:f},r("span",{class:`num ${b.status==="resolved"?"resolved":b.type}`,text:`#${b.id}`}),r("span",{},r("span",{class:"t",text:b.title}),r("span",{class:"s",text:`${this.cfg.labels.status[b.status]}${b.assignee_name?` · ${b.assignee_name}`:""}${b.breakpoint?` · ${b.breakpoint}`:""}`})),g??null);if(this.filters.scope==="all"){if(!this.allItems){p.replaceChildren(r("div",{class:"empty",text:"Loading…"}));try{this.allItems=(await this.api.listItems()).items}catch(g){p.replaceChildren(r("div",{class:"empty",text:g.message}));return}}let b=new Map;for(let g of this.allItems.filter((u)=>this.matches(u))){let u=b.get(g.page_path)??[];u.push(g),b.set(g.page_path,u)}let f=[];for(let[g,u]of b){f.push(r("h3",{text:g===this.pagePath?`${g} (this page)`:g}));for(let a of u)f.push(n(a,()=>{if(a.page_path===this.pagePath)this.focusItem(a.id);else{let i=new URL(a.page_url,window.location.origin);i.searchParams.set("fbc_item",String(a.id)),window.location.href=i.toString()}}))}p.replaceChildren(...f.length?f:[r("div",{class:"empty",text:"Nothing matches these filters."})]);return}let o={pinned:{title:"On this page",nodes:[]},note:{title:"Page notes",nodes:[]},hidden:{title:"At other breakpoints",nodes:[]},orphan:{title:"Orphaned — element not found",nodes:[]}};for(let b of[...this.states.values()].sort((f,g)=>f.item.id-g.item.id)){if(!this.matches(b.item))continue;let f=b.placement==="orphan"?r("span",{class:"btn link reanchor",role:"button",text:"Re-anchor",onclick:(g)=>{g.stopPropagation(),this.reanchor(b.item.id)}}):null;o[b.placement].nodes.push(n(b.item,()=>this.focusItem(b.item.id),f))}let x=[];for(let b of["pinned","note","hidden","orphan"]){let f=o[b];if(!f.nodes.length)continue;let g=b==="hidden"?`${f.nodes.length} at other breakpoints`:f.title;x.push(r("h3",{text:g}),...f.nodes)}p.replaceChildren(...x.length?x:[r("div",{class:"empty",text:"No feedback on this page yet. Right-click anything to add some."})])}focusItem(p){let n=this.states.get(p);if(!n)return;if(n.placement==="pinned"&&n.el){if(n.item.status==="resolved"&&!this.showResolved)this.showResolved=!0,this.drawPins();n.el.scrollIntoView({block:"center",behavior:"smooth"}),window.setTimeout(()=>{this.positionPins(),n.pin?.classList.remove("pulse"),n.pin?.offsetWidth,n.pin?.classList.add("pulse"),this.openPopover(p)},450)}else this.openPopover(p,{x:window.innerWidth-720,y:80})}toast(p,n=!1){let o=r("div",{class:`toast${n?" err":""}`,role:"status",text:p});this.root.append(o),window.setTimeout(()=>o.remove(),n?5000:2200)}showBanner(p){this.bannerEl?.remove(),this.bannerEl=r("div",{class:"banner",role:"status"},r("span",{text:p}),r("button",{type:"button",text:"Dismiss",onclick:()=>{this.bannerEl?.remove(),this.bannerEl=null}})),this.root.append(this.bannerEl)}}t();S();function c(){let p=window.fbcConfig;if(!p||window.self!==window.top)return;new N(p).init()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",c,{once:!0});else c();})();
