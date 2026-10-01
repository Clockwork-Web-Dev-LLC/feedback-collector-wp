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
  background: #fff;
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
  padding: 14px 14px 10px;
  border-bottom: 1px solid var(--line);
}
.sidebar h2 {
  font-size: 16px;
  margin: 0 0 10px;
  display: flex;
  align-items: center;
}
.sidebar h2 .x {
  margin-left: auto;
  border: 0;
  background: none;
  font-size: 20px;
  color: var(--muted);
}
.filters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.filters select {
  width: 100%;
  border: 1px solid #8c8f94;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 13px;
  background: #fff;
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
`;var A="fbc-root";var e=["ember","react-","__next","radix-","headlessui-","mui-","yui_","ext-gen"],pp=/[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i,xp=/^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;function np(p){let x=/[a-z]/i.test(p),n=/[0-9]/.test(p);if(!x||!n)return!1;if(p.length>=6&&/^[0-9a-f]+$/i.test(p))return!0;return p.length>=8&&/^[0-9a-z]+$/i.test(p)&&op(p)>=2}function op(p){let x=0;for(let n=1;n<p.length;n++){let o=/[0-9]/.test(p.charAt(n-1)),b=/[0-9]/.test(p.charAt(n));if(o!==b)x++}return x}function bp(p){if(p.trim()===""||/\s/.test(p))return!1;if(/^[0-9]/.test(p))return!1;if(/[0-9]{5,}/.test(p))return!1;if(pp.test(p))return!1;if(xp.test(p))return!1;let x=p.toLowerCase();if(e.some((n)=>x.startsWith(n)))return!1;return!p.split(/[-_:.]/).some(np)}function fp(p){let x="",n=p.length,o=p.charCodeAt(0);for(let b=0;b<n;b++){let g=p.charCodeAt(b),r=p.charAt(b);if(g===0)x+="�";else if(g>=1&&g<=31||g===127||b===0&&g>=48&&g<=57||b===1&&g>=48&&g<=57&&o===45)x+=`\\${g.toString(16)} `;else if(b===0&&n===1&&g===45)x+=`\\${r}`;else if(g>=128||g===45||g===95||g>=48&&g<=57||g>=65&&g<=90||g>=97&&g<=122)x+=r;else x+=`\\${r}`}return x}function B(p,x){let n=x?x.CSS:void 0,o=globalThis.CSS,b=n?.escape??o?.escape;return b?b(p):fp(p)}function gp(p){return p.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}function j(p){return p.localName.toLowerCase()}function rp(p){return p.ownerDocument.defaultView}function up(p){if(!p)return{x:0,y:0};let x=Number.isFinite(p.scrollX)?p.scrollX:0,n=Number.isFinite(p.scrollY)?p.scrollY:0;return{x,y:n}}function Y(p){if(!Number.isFinite(p))return 0.5;return Math.min(1,Math.max(0,p))}function C(p){let x=p;while(x){if(x.id==="fbc-root")return!0;if(x.parentElement)x=x.parentElement;else{let n=x.getRootNode();x=n instanceof ShadowRoot?n.host:null}}return!1}function q(p){if(p===null)return null;let x=p.replace(/\s+/g," ").trim();if(x==="")return null;let n=Array.from(x);return n.length>120?n.slice(0,120).join(""):x}var kp=/^fl-node-(?!content$)[a-z0-9]+$/i,zp=/^[a-z0-9]+$/i;function _(p){let x=1,n=p.previousElementSibling;while(n){if(n.localName===p.localName&&n.namespaceURI===p.namespaceURI)x++;n=n.previousElementSibling}return x}function O(p,x){if(!p.id||!bp(p.id))return null;let n=`#${B(p.id,x.defaultView)}`,o=x.querySelectorAll(n);return o.length===1&&o[0]===p?n:null}function wp(p,x){if(p===x.documentElement)return"html";let n=p.localName,o=p.getAttribute("data-id");if(o!==null&&p.classList.contains("elementor-element")&&zp.test(o))return`${n}[data-id="${gp(o)}"]`;let b=Array.from(p.classList).find((g)=>kp.test(g));if(b!==void 0)return`${n}.${B(b,x.defaultView)}`;return`${n}:nth-of-type(${_(p)})`}function vp(p,x,n){let o=n.querySelectorAll(p);return o.length===1&&o[0]===x}function ap(p,x){let n=[],o=p;while(o){let b=O(o,x);if(b!==null)return n.unshift(b),n.join(" > ");n.unshift(wp(o,x));let g=n.join(" > ");if(vp(g,p,x))return g;o=o.parentElement}return n.join(" > ")}function ip(p,x){let n=[],o=p;while(o){let b=j(o),g=o.parentElement,r=o===x.documentElement||g===x.documentElement&&(b==="head"||b==="body");n.unshift(r?b:`${b}[${_(o)}]`),o=g}return`/${n.join("/")}`}var dp=/^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i,Jp=/^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;function Zp(p,x){if(!dp.test(p))return null;let n=p.slice(1).split("/"),o=null;for(let b of n){let g=Jp.exec(b);if(!g)return null;let r=(g[1]??"").toLowerCase(),u=g[2]===void 0?1:Number(g[2]),k=o?Array.from(o.children):x.documentElement?[x.documentElement]:[],z=0,w=null;for(let v of k){if(j(v)!==r)continue;if(z++,z===u){w=v;break}}if(!w)return null;o=w}return o}function D(p,x,n){if(!Number.isFinite(x)||!Number.isFinite(n))throw RangeError(`createAnchor: click coordinates must be finite (got ${x}, ${n})`);if(!p.isConnected)throw Error("createAnchor: element is not connected to a document");if(C(p))throw Error("createAnchor: refusing to anchor an element inside #fbc-root");let o=p.ownerDocument;if(p.getRootNode()!==o)throw Error("createAnchor: element is inside a shadow root; anchor its shadow host instead");let b=p.getBoundingClientRect(),g=up(o.defaultView),r=b.width>0?Y((x-b.left)/b.width):0.5,u=b.height>0?Y((n-b.top)/b.height):0.5;return{id:O(p,o)!==null?p.id:null,selector:ap(p,o),xpath:ip(p,o),text:q(p.textContent),tag:j(p),offsetX:r,offsetY:u,docX:x+g.x,docY:n+g.y}}function K(p,x){return p!==null&&j(p)===x&&!C(p)}function $p(p){return p instanceof DOMException||p instanceof Error&&p.name==="SyntaxError"}function jp(p,x){if(typeof p.id!=="string"||p.id==="")return null;let n=x.getElementById(p.id);if(!n)return null;return x.querySelectorAll(`#${B(p.id,x.defaultView)}`).length===1?n:null}function Fp(p,x){if(typeof p.selector!=="string"||p.selector.trim()==="")return null;let n;try{n=x.querySelectorAll(p.selector)}catch(o){if($p(o))return null;throw o}return n.length===1?n[0]??null:null}function Qp(p,x){if(typeof p.xpath!=="string")return null;return Zp(p.xpath,x)}function Wp(p,x){if(typeof p.text!=="string"||p.text==="")return null;let n=null;for(let o of Array.from(x.getElementsByTagName("*"))){if(j(o)!==p.tag||C(o))continue;if(q(o.textContent)!==p.text)continue;if(n)return null;n=o}return n}function I(p,x=document){if(typeof p.tag!=="string"||p.tag==="")return{el:null,strategy:"none"};let n=p.tag.toLowerCase(),o=jp(p,x);if(K(o,n))return{el:o,strategy:"id"};let b,g=()=>{if(b===void 0)b=Wp({...p,tag:n},x);return K(b,n)?b:null},r=(w)=>{if(p.text===null||q(w.textContent)===p.text)return null;let v=g();return v&&v!==w?v:null},u=Fp(p,x);if(K(u,n)){let w=r(u);return w?{el:w,strategy:"text"}:{el:u,strategy:"selector"}}let k=Qp(p,x);if(K(k,n)){let w=r(k);return w?{el:w,strategy:"text"}:{el:k,strategy:"xpath"}}let z=g();if(z)return{el:z,strategy:"text"};return{el:null,strategy:"none"}}function P(p){if(!p.isConnected)return!1;let x=rp(p);if(!x)return!1;let n=x.getComputedStyle(p);if(n.visibility==="hidden"||n.visibility==="collapse")return!1;let o=p;while(o){if(x.getComputedStyle(o).display==="none")return!1;o=o.parentElement}let b=p.getBoundingClientRect();return!(b.width===0&&b.height===0)}class R extends Error{status;constructor(p,x){super(p);this.status=x}}class V{cfg;constructor(p){this.cfg=p}url(p,x){let n=this.cfg.restUrl.replace(/\/$/,"")+p;if(x){let o=new URLSearchParams(x).toString();if(o)n+=(n.includes("?")?"&":"?")+o}return n}async request(p,x,n,o){let b=await fetch(this.url(x,o),{method:p,credentials:"same-origin",headers:{"X-WP-Nonce":this.cfg.nonce,...n!==void 0?{"Content-Type":"application/json"}:{}},body:n!==void 0?JSON.stringify(n):void 0}),g=await b.json().catch(()=>null);if(!b.ok){let r=g&&typeof g==="object"&&"message"in g?String(g.message):b.statusText;throw new R(r,b.status)}return g}listItems(p){return this.request("GET","/items",void 0,p?{page_path:p}:void 0)}getItem(p){return this.request("GET",`/items/${p}`)}createItem(p){return this.request("POST","/items",p)}updateItem(p,x){return this.request("PATCH",`/items/${p}`,x)}deleteItem(p){return this.request("DELETE",`/items/${p}`)}addComment(p,x){return this.request("POST",`/items/${p}/comments`,{body:x})}}function F(p=window.innerWidth){if(p<768)return"mobile";if(p<=1024)return"tablet";return"desktop"}function Up(p){let x=[[/Edg\/([\d.]+)/,"Edge"],[/OPR\/([\d.]+)/,"Opera"],[/Firefox\/([\d.]+)/,"Firefox"],[/CriOS\/([\d.]+)/,"Chrome iOS"],[/Chrome\/([\d.]+)/,"Chrome"],[/Version\/([\d.]+).*Safari/,"Safari"]];for(let[n,o]of x){let b=p.match(n);if(b)return`${o} ${b[1].split(".")[0]}`}return"Unknown"}function Kp(p){let x=p.match(/(iPhone|iPad).*OS ([\d_]+)/);if(x)return`iOS ${x[2].replace(/_/g,".")}`;if(x=p.match(/Android ([\d.]+)/),x)return`Android ${x[1]}`;if(x=p.match(/Windows NT ([\d.]+)/),x)return x[1]==="10.0"?"Windows 10/11":`Windows NT ${x[1]}`;if(x=p.match(/Mac OS X ([\d_]+)/),x)return`macOS ${x[1].replace(/_/g,".")}`;if(/CrOS/.test(p))return"ChromeOS";if(/Linux/.test(p))return"Linux";return"Unknown"}var M=null;function S(){let p=navigator.userAgentData;if(!p)return;p.getHighEntropyValues(["platform","platformVersion"]).then(({platform:x,platformVersion:n})=>{if(!x||!n)return;let[o,b]=n.split(".");if(x==="macOS")M=`macOS ${o}.${b??"0"}`;else if(x==="Windows")M=Number(o)>=13?"Windows 11":"Windows 10";else if(x==="Android"||x==="Chrome OS"||x==="Linux")M=`${x} ${n}`.trim()}).catch(()=>{})}function T(p){let x=navigator.userAgent;return{viewport_w:window.innerWidth,viewport_h:window.innerHeight,dpr:Math.round((window.devicePixelRatio||1)*100)/100,breakpoint:F(),browser:Up(x),os:M??Kp(x),user_agent:x,post_id:p.page.postId,post_type:p.page.postType,theme:p.page.theme,js_errors:(window.__fbcErrors??[]).slice(-20)}}function y(p){let x=window.location.pathname,n=p.replace(/\/$/,"");if(n&&x.startsWith(n))x=x.slice(n.length);return x="/"+x.replace(/^\/+/,""),x==="/"?"/":x.replace(/\/?$/,"/")}function E(){let p=new URLSearchParams(window.location.search);return p.delete("fbc_item"),p.toString()}function t(){if(window.__fbcErrors)return;let p=window.__fbcErrors=[],x=(n)=>{if(p.push(n.slice(0,500)),p.length>20)p.shift()};window.addEventListener("error",(n)=>{if(n.message)x(`${n.message}${n.filename?` (${n.filename}:${n.lineno})`:""}`)}),window.addEventListener("unhandledrejection",(n)=>{let o=n.reason;x(`Unhandled rejection: ${o instanceof Error?o.message:String(o)}`)})}function f(p,x={},...n){let o=document.createElement(p);for(let[b,g]of Object.entries(x)){if(g===null||g===void 0||g===!1)continue;if(b.startsWith("on")&&typeof g==="function")o.addEventListener(b.slice(2).toLowerCase(),g);else if(b==="text")o.textContent=String(g);else if(b==="value"&&"value"in o)o.value=String(g);else if(g===!0)o.setAttribute(b,"");else o.setAttribute(b,String(g))}for(let b of n){if(b===null||b===void 0||b===!1)continue;o.append(typeof b==="number"?String(b):b)}return o}function J(p,x,n,o={}){let b=f("select",{name:p,...o});for(let[g,r]of x){let u=f("option",{value:g,text:r});if(g===n)u.selected=!0;b.append(u)}return b}function G(p){let x=new Date(p).getTime();if(Number.isNaN(x))return"";let n=Math.round((Date.now()-x)/1000);if(n<60)return"just now";let o=Math.round(n/60);if(o<60)return`${o}m ago`;let b=Math.round(o/60);if(b<24)return`${b}h ago`;let g=Math.round(b/24);if(g<30)return`${g}d ago`;return new Date(p).toLocaleDateString()}var Q=["bug","tweak","change","comment"],m="fbc:mode",s="fbc:corner",Z=16,l=360,Mp=["tl","tr","bl","br"];class N{cfg;api;host;root;pinsLayer;outline;outlineTag;toolbar=null;sidebar=null;card=null;hintEl=null;bannerEl=null;mode=!1;showResolved=!1;pinMode=null;states=new Map;allItems=null;filters={scope:"page",type:"",status:"unresolved",mine:!1};pagePath;framePending=!1;refreshTimer=0;lastWidth=window.innerWidth;mutationObserver=null;loaded=!1;corner="br";dragging=!1;ghost=null;constructor(p){this.cfg=p;this.api=new V(p),this.pagePath=p.pagePath??y(p.homePath)}init(){this.mount(),this.bindGlobalEvents(),this.bindAdminBar();let p=!1;try{p=window.localStorage.getItem(m)==="1";let x=window.localStorage.getItem(s);if(x&&Mp.includes(x))this.corner=x}catch{p=!1}if(this.cfg.openItem||p)this.setMode(!0)}mount(){this.host=f("div",{id:A}),this.host.setAttribute("style","all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;");let p=this.host.attachShadow({mode:"open"});p.append(f("style",{text:X})),this.root=f("div",{class:"fbc"});let x=this.cfg.brand;if(x){let o=[["--primary",x.primary],["--on-primary",x.onPrimary],["--dark",x.dark],["--on-dark",x.onDark],["--brand-accent",x.accent],["--ink-primary",x.ink??""]];for(let[b,g]of o)if(g)this.root.style.setProperty(b,g)}let n=f("div",{class:"layer"});this.outlineTag=f("span",{class:"outline-tag"}),this.outline=f("div",{class:"outline"},this.outlineTag),this.pinsLayer=f("div"),n.append(this.outline,this.pinsLayer),this.root.append(n),p.append(this.root),document.body.append(this.host)}inOverlay(p){return p.composedPath().includes(this.host)}bindGlobalEvents(){document.addEventListener("contextmenu",(p)=>this.onContextMenu(p),!0),document.addEventListener("mousemove",(p)=>this.onMouseMove(p),{capture:!0,passive:!0});for(let p of["pointerdown","mousedown","mouseup","click"])document.addEventListener(p,(x)=>this.onPinModeEvent(x),!0);document.addEventListener("mousedown",(p)=>this.onOutsideMouseDown(p),!1),document.addEventListener("keydown",(p)=>this.onKeyDown(p),!0),window.addEventListener("scroll",()=>this.schedulePosition(),{passive:!0,capture:!0}),window.addEventListener("resize",()=>{let p=window.innerWidth!==this.lastWidth;if(this.lastWidth=window.innerWidth,p)this.scheduleRefresh(80);else this.schedulePosition()})}bindAdminBar(){document.querySelector("#wp-admin-bar-fbc-toggle > a")?.addEventListener("click",(x)=>{x.preventDefault(),this.setMode(!this.mode)})}async setMode(p){this.mode=p;try{window.localStorage.setItem(m,p?"1":"0")}catch{}if(document.querySelector("#wp-admin-bar-fbc-toggle")?.classList.toggle("fbc-on",p),!p){this.exitPinMode(),this.closeCard(),this.closeSidebar(),this.hideOutline(),this.toolbar?.remove(),this.toolbar=null,this.bannerEl?.remove(),this.bannerEl=null,this.pinsLayer.replaceChildren();for(let x of this.states.values())x.pin=null;this.mutationObserver?.disconnect();return}if(this.renderToolbar(),this.observeMutations(),!this.loaded)await this.loadItems();else this.refresh();if(this.cfg.openItem){let x=this.cfg.openItem;this.cfg.openItem=0,this.stripDeepLinkParam(),this.openDeepLink(x)}}stripDeepLinkParam(){let p=new URL(window.location.href);if(p.searchParams.has("fbc_item"))p.searchParams.delete("fbc_item"),window.history.replaceState(window.history.state,"",p.toString())}async loadItems(){try{let{items:p}=await this.api.listItems(this.pagePath);this.states.clear();for(let x of p)this.states.set(x.id,{item:x,el:null,placement:"orphan",pin:null});this.loaded=!0,this.refresh()}catch(p){this.toast(`Could not load feedback: ${p.message}`,!0)}}upsert(p){let x=this.states.get(p.id);if(x)x.item=p;else this.states.set(p.id,{item:p,el:null,placement:"orphan",pin:null});if(this.allItems){let n=this.allItems.findIndex((o)=>o.id===p.id);if(n>=0)this.allItems[n]=p;else this.allItems.push(p)}}remove(p){if(this.states.get(p)?.pin?.remove(),this.states.delete(p),this.allItems)this.allItems=this.allItems.filter((n)=>n.id!==p)}refresh(){for(let p of this.states.values()){if(!p.item.anchor){p.el=null,p.placement="note";continue}let x=p.el&&p.el.isConnected?p.el:I(p.item.anchor).el;p.el=x,p.placement=!x?"orphan":P(x)?"pinned":"hidden"}if(this.drawPins(),this.updateToolbarCount(),this.sidebar)this.renderSidebarList()}drawPins(){if(!this.mode)return;for(let p of this.states.values()){if(!(p.placement==="pinned"&&(this.showResolved||p.item.status!=="resolved"))){p.pin?.remove(),p.pin=null;continue}if(!p.pin){let b=f("button",{class:"pin",type:"button","aria-label":`Feedback #${p.item.id}: ${p.item.title}`,onclick:(g)=>{g.stopPropagation(),this.openPopover(p.item.id)}});p.pin=b,this.pinsLayer.append(b)}let n=p.item.status==="resolved",o=p.pin.classList.contains("pulse");p.pin.className=`pin ${p.item.type}${n?" resolved":""}${o?" pulse":""}`,p.pin.textContent=n?"✓":String(p.item.id),p.pin.title=`#${p.item.id} ${p.item.title}`}this.positionPins()}schedulePosition(){if(this.framePending||!this.mode)return;this.framePending=!0,requestAnimationFrame(()=>{this.framePending=!1,this.positionPins(),this.positionChrome()})}scheduleRefresh(p=250){window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.mode&&this.refresh(),p)}positionPins(){for(let p of this.states.values()){if(!p.pin||!p.el||!p.item.anchor)continue;let x=p.el.getBoundingClientRect(),n=x.left+p.item.anchor.offsetX*x.width,o=x.top+p.item.anchor.offsetY*x.height;p.pin.style.transform=`translate(${Math.round(n)}px, ${Math.round(o)}px)`}}observeMutations(){if(!this.mutationObserver)this.mutationObserver=new MutationObserver((p)=>{if(p.every((x)=>x.target===this.host||this.host.contains(x.target)))return;this.schedulePosition(),this.scheduleRefresh(300)});this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden","open"]})}onContextMenu(p){if(!this.mode||p.altKey||this.inOverlay(p))return;let x=this.eventTarget(p);if(!x)return;p.preventDefault(),p.stopPropagation(),this.exitPinMode(),this.openTypeMenu(x,p.clientX,p.clientY)}onPinModeEvent(p){if(!this.pinMode||this.inOverlay(p)||p.button!==0)return;if(p.preventDefault(),p.stopImmediatePropagation(),p.type!=="click")return;let x=this.eventTarget(p),n=this.pinMode;if(this.exitPinMode(),x)n.done(x,p.clientX,p.clientY)}onOutsideMouseDown(p){if(this.card&&!this.inOverlay(p))this.closeCard()}onMouseMove(p){if(!this.mode||this.card&&!this.pinMode||this.inOverlay(p)){if(!this.pinMode)this.hideOutline();return}let x=this.eventTarget(p);if(!x||x===document.documentElement||x===document.body){this.hideOutline();return}let n=x.getBoundingClientRect();Object.assign(this.outline.style,{left:`${n.left}px`,top:`${n.top}px`,width:`${n.width}px`,height:`${n.height}px`});let o=x.id?`#${x.id}`:"";this.outlineTag.textContent=`${x.tagName.toLowerCase()}${o}`,this.outline.classList.add("on")}onKeyDown(p){let x=p.composedPath()[0],n=x instanceof HTMLElement&&(x.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(x.tagName));if(p.altKey&&p.shiftKey&&p.code==="KeyF"&&!n){p.preventDefault(),this.setMode(!this.mode);return}if(p.key==="Escape"&&this.mode){if(this.pinMode)this.exitPinMode(),p.preventDefault();else if(this.card)this.closeCard(),p.preventDefault();else if(this.sidebar)this.closeSidebar(),p.preventDefault()}}eventTarget(p){let x=p.target;if(x instanceof Element)return x;if(x instanceof Node)return x.parentElement;return null}hideOutline(){this.outline.classList.remove("on")}enterPinMode(p){this.closeCard(),this.pinMode=p,this.hintEl?.remove(),this.hintEl=f("div",{class:"crosshair-hint",text:`${p.hint} · Esc to cancel`}),this.root.append(this.hintEl),document.documentElement.style.cursor="crosshair",this.renderToolbar()}exitPinMode(){if(!this.pinMode)return;this.pinMode=null,this.hintEl?.remove(),this.hintEl=null,document.documentElement.style.cursor="",this.hideOutline(),this.renderToolbar()}assigneeOptions(){return[["0","Unassigned"],...this.cfg.assignees.people.map((p)=>[String(p.id),p.name])]}assigneeLabel(){return this.cfg.assignees.source==="teamwork"?"Assignee (Teamwork)":"Assignee"}safeAnchor(p,x,n){try{return D(p,x,n)}catch{return this.toast("Can't pin to that element. Try its container, or add a page note.",!0),null}}closeCard(){this.card?.remove(),this.card=null}showCard(p,x,n){this.closeCard(),this.hideOutline(),this.card=p,p.style.left="0px",p.style.top="0px",p.style.visibility="hidden",this.root.append(p);let{offsetWidth:o,offsetHeight:b}=p,g=Math.max(12,Math.min(x+8,window.innerWidth-o-12)),r=Math.max(this.topOffset()+12,Math.min(n+8,window.innerHeight-b-12));p.style.left=`${g}px`,p.style.top=`${r}px`,p.style.visibility=""}openTypeMenu(p,x,n){let o=this.cfg.labels.type,b=(u)=>this.openComposer(u,p,x,n),g=Q.map((u,k)=>f("button",{type:"button",onclick:()=>b(u)},f("span",{class:`dot ${u}`}),o[u],f("kbd",{text:String(k+1)}))),r=f("div",{class:"card menu",role:"menu",onkeydown:(u)=>{let k=u.key,z=Number(k);if(z>=1&&z<=Q.length)u.preventDefault(),b(Q[z-1])}},f("div",{class:"menu-title",text:"Add feedback"}),...g,f("hr"),f("button",{type:"button",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},"Note for the whole page"));this.showCard(r,x,n),g[0].focus()}openComposer(p,x,n,o){let b=null;if(x){if(b=this.safeAnchor(x,n,o),!b)return}let g=this.cfg.labels,r=J("type",Q.map((i)=>[i,g.type[i]]),p),u=f("input",{type:"text",name:"title",maxlength:255,required:!0,placeholder:"What needs attention?",autocomplete:"off"}),k=f("textarea",{name:"description",placeholder:"Details, steps to reproduce, what you expected… (optional)"}),z=J("priority",Object.keys(g.priority).map((i)=>[i,g.priority[i]]),"medium"),w=J("assignee_id",this.assigneeOptions(),"0"),v=f("div",{class:"error",role:"alert"}),d=f("button",{class:"btn primary",type:"submit",text:"Add"}),L=f("form",{class:"card composer",novalidate:!0,onsubmit:(i)=>{i.preventDefault(),W()}},f("div",{class:"head"},f("span",{class:"chip"},f("span",{class:`dot ${p}`}),x?`<${x.tagName.toLowerCase()}>`:"Whole page"),f("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),f("label",{class:"field"},f("span",{text:"Title"}),u),v,f("label",{class:"field"},f("span",{text:"Description"}),k),f("div",{class:"row"},f("label",{class:"field"},f("span",{text:"Type"}),r),f("label",{class:"field"},f("span",{text:"Priority"}),z)),f("label",{class:"field"},f("span",{text:this.assigneeLabel()}),w),f("div",{class:"actions"},f("button",{class:"btn link",type:"button",text:"Cancel",onclick:()=>this.closeCard()}),d)),W=async()=>{if(!u.value.trim()){v.textContent="Add a short title.",u.focus();return}d.disabled=!0;try{let i=await this.api.createItem({type:r.value,title:u.value.trim(),description:k.value,priority:z.value,assignee_id:Number(w.value),page_path:this.pagePath,page_query:E(),page_title:document.title,anchor:b,context:T(this.cfg)});this.closeCard(),this.upsert(i);let U=this.states.get(i.id);if(U&&x)U.el=x;this.refresh(),this.toast(`Added #${i.id}`)}catch(i){v.textContent=i.message,d.disabled=!1}};this.showCard(L,n,o),u.focus()}async openPopover(p,x){let n;try{n=await this.api.getItem(p)}catch(a){this.toast(a.message,!0);return}this.upsert(n);let o=this.cfg.labels,b=this.states.get(p),g=b?.pin?.getBoundingClientRect(),r=x?.x??(g?g.right:window.innerWidth/2-170),u=x?.y??(g?g.top:100),k=async(a)=>{try{let H=await this.api.updateItem(p,a);this.upsert(H),this.refresh(),this.openPopover(p,{x:parseFloat($.style.left)-8,y:parseFloat($.style.top)-8})}catch(H){this.toast(H.message,!0)}},z=J("status",Object.keys(o.status).map((a)=>[a,o.status[a]]),n.status,{onchange:()=>void k({status:z.value})}),w=J("assignee_id",this.assigneeOptions(),String(n.assignee_id),{onchange:()=>void k({assignee_id:Number(w.value)})}),v=J("priority",Object.keys(o.priority).map((a)=>[a,o.priority[a]]),n.priority,{onchange:()=>void k({priority:v.value})}),d=f("textarea",{placeholder:"Reply…",rows:2}),L=f("ul",{class:"thread"},...(n.comments??[]).map((a)=>f("li",{class:a.kind},f("span",{class:"who",text:a.user_name}),f("span",{class:"when",text:G(a.created_at)}),f("div",{class:"body",text:a.body})))),W=F(),i=n.breakpoint&&n.breakpoint!==W?f("div",{class:"notice",text:`Logged at ${n.breakpoint} (${n.context?.viewport_w??"?"}px). You are on ${W} (${window.innerWidth}px).`}):null,U=b?.placement==="orphan"?f("div",{class:"notice",text:"The element this was pinned to can’t be found on the page anymore. Re-anchor it."}):null,$=f("div",{class:"card popover",role:"dialog","aria-label":`Feedback #${n.id}`},f("div",{class:"head"},f("span",{class:"chip"},f("span",{class:`dot ${n.type}`}),`${o.type[n.type]} #${n.id}`),f("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),f("div",{class:"t",style:"font-weight:700;font-size:15px;margin-bottom:4px",text:n.title}),f("div",{class:"meta",text:`${n.reporter_name} · ${G(n.created_at)}${n.breakpoint?` · ${n.breakpoint}`:""}`}),n.tw_task_url?f("div",{class:"meta"},f("a",{href:n.tw_task_url,target:"_blank",rel:"noopener",text:`Teamwork task #${n.tw_task_id} ↗`}),n.status==="resolved"?" · completed":" · status syncs from Teamwork"):null,i,U,n.description?f("p",{class:"desc",text:n.description}):null,f("div",{class:"row"},f("label",{class:"field"},f("span",{text:"Status"}),z),f("label",{class:"field"},f("span",{text:"Priority"}),v)),n.assignee_locked?f("div",{class:"field"},f("span",{text:this.assigneeLabel()}),f("div",{text:n.assignee_name||"Unassigned"}),f("div",{class:"meta",text:"In Teamwork now: change the assignee there."})):f("label",{class:"field"},f("span",{text:this.assigneeLabel()}),w),L,f("label",{class:"field"},d),f("div",{class:"actions"},n.anchor||b?.placement==="note"?f("button",{class:"btn link left",type:"button",text:"Re-anchor",onclick:()=>this.reanchor(n.id)}):null,f("a",{class:"btn link",href:`${this.cfg.adminUrl}&item=${n.id}`,target:"_blank",rel:"noopener",text:"Admin"}),n.can_delete?f("button",{class:"btn danger",type:"button",text:"Delete",onclick:()=>void this.deleteItem(n.id)}):null,f("button",{class:"btn primary",type:"button",text:"Reply",onclick:async()=>{if(!d.value.trim())return;try{await this.api.addComment(n.id,d.value),this.openPopover(p,{x:parseFloat($.style.left)-8,y:parseFloat($.style.top)-8})}catch(a){this.toast(a.message,!0)}}})));this.showCard($,r,u)}reanchor(p){this.enterPinMode({hint:`Click the element #${p} belongs to`,done:async(x,n,o)=>{try{let b=this.safeAnchor(x,n,o);if(!b)return;let g=await this.api.updateItem(p,{anchor:b});this.upsert(g);let r=this.states.get(p);if(r)r.el=x;this.refresh(),this.toast(`Re-anchored #${p}`)}catch(b){this.toast(b.message,!0)}}})}async deleteItem(p){if(!window.confirm(`Delete feedback #${p}? This can’t be undone.`))return;try{await this.api.deleteItem(p),this.closeCard(),this.remove(p),this.refresh(),this.toast(`Deleted #${p}`)}catch(x){this.toast(x.message,!0)}}async openDeepLink(p){let x=this.states.get(p);if(x?.el&&x.placement==="pinned")x.el.scrollIntoView({block:"center",behavior:"auto"}),await new Promise((o)=>requestAnimationFrame(()=>o(null))),this.positionPins(),x.pin?.classList.add("pulse");let n=x?.item;if(n?.breakpoint&&n.breakpoint!==F())this.showBanner(`#${p} was logged at ${n.breakpoint} (${n.context?.viewport_w??"?"}px wide). You're viewing at ${F()} (${window.innerWidth}px). Resize to reproduce.`);await this.openPopover(p)}unresolvedCount(){let p=0;for(let x of this.states.values())if(x.item.status!=="resolved")p++;return p}renderToolbar(){if(!this.mode)return;let p=this.unresolvedCount(),x=f("div",{class:"toolbar",role:"toolbar","aria-label":this.cfg.brand?.name??"Feedback"},f("button",{type:"button",class:"grip",title:"Drag to move · arrow keys snap to a corner","aria-label":"Move toolbar: drag, or use arrow keys to snap to a corner",text:"⠿",onpointerdown:(o)=>this.startDrag(o),onkeydown:(o)=>this.onGripKey(o)}),this.cfg.brand?.logo?f("span",{class:"brand",title:`${this.cfg.brand.name} · drag to move`,onpointerdown:(o)=>this.startDrag(o)},f("img",{src:this.cfg.brand.logo,alt:this.cfg.brand.name})):f("span",{class:"brand",title:"Drag to move",text:this.cfg.brand?.label??"Feedback",onpointerdown:(o)=>this.startDrag(o)}),f("button",{type:"button",class:this.pinMode?"on":"",title:"Click an element to pin feedback (or right-click anywhere)",text:"+ Add",onclick:()=>this.pinMode?this.exitPinMode():this.enterPinMode({hint:"Click any element to add feedback",done:(o,b,g)=>this.openTypeMenu(o,b,g)})}),f("button",{type:"button",text:"Page note",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)}),f("button",{type:"button",class:this.sidebar?"on":"",onclick:()=>this.sidebar?this.closeSidebar():this.openSidebar()},f("span",{class:"label",text:"List"}),p?f("span",{class:"count",text:String(p)}):null),f("button",{type:"button",class:this.showResolved?"on":"",title:"Show resolved pins",text:"✓ Resolved",onclick:()=>{this.showResolved=!this.showResolved,this.drawPins(),this.renderToolbar()}}),f("button",{type:"button",title:"Exit Feedback mode (Alt+Shift+F)","aria-label":"Exit Feedback mode",text:"×",onclick:()=>void this.setMode(!1)})),n=!!this.toolbar;if(this.toolbar)this.toolbar.replaceWith(x);else this.root.append(x);if(this.toolbar=x,this.positionToolbar(!1),!n)this.positionChrome()}updateToolbarCount(){this.renderToolbar()}topOffset(){let p=document.getElementById("wpadminbar");if(!p)return 0;let x=p.getBoundingClientRect();return x.height>0?Math.max(0,Math.round(x.bottom)):0}toolbarTarget(p){let x=this.toolbar,n=x?.offsetWidth??0,o=x?.offsetHeight??0,b=this.topOffset(),g=p.endsWith("l")?Z:window.innerWidth-n-Z;if(p.endsWith("r")&&this.sidebar&&window.innerWidth>=l+n+Z*2)g-=l;let r=p.startsWith("t")?b+Z:window.innerHeight-o-Z;return{x:Math.max(0,g),y:Math.max(b,r)}}nearestCorner(p,x){let n=this.topOffset(),o=x<n+(window.innerHeight-n)/2?"t":"b",b=p<window.innerWidth/2?"l":"r";return`${o}${b}`}positionToolbar(p=!1){let x=this.toolbar;if(!x||this.dragging)return;let{x:n,y:o}=this.toolbarTarget(this.corner);x.classList.toggle("snapping",p),x.style.left=`${n}px`,x.style.top=`${o}px`,x.dataset.corner=this.corner}positionChrome(){this.root.style.setProperty("--top-offset",`${this.topOffset()}px`);let p=this.toolbar?.offsetHeight??0,x=this.toolbar&&this.corner.startsWith("b")?p+Z*2:24;this.root.style.setProperty("--toast-bottom",`${x}px`),this.positionToolbar(!1)}setCorner(p){this.corner=p;try{window.localStorage.setItem(s,p)}catch{}this.positionToolbar(!0),this.positionChrome()}startDrag(p){let x=this.toolbar;if(!x||p.button!==0)return;p.preventDefault(),p.stopPropagation();let n=x.getBoundingClientRect(),o=p.clientX-n.left,b=p.clientY-n.top;this.dragging=!0,x.classList.remove("snapping"),x.classList.add("dragging"),this.ghost?.remove(),this.ghost=f("div",{class:"snap-ghost"}),Object.assign(this.ghost.style,{width:`${n.width}px`,height:`${n.height}px`}),this.root.append(this.ghost);let g=(u)=>{let k=this.topOffset(),z=Math.min(Math.max(u.clientX-o,0),window.innerWidth-n.width),w=Math.min(Math.max(u.clientY-b,k),window.innerHeight-n.height);x.style.left=`${z}px`,x.style.top=`${w}px`;let v=this.nearestCorner(z+n.width/2,w+n.height/2),d=this.toolbarTarget(v);if(this.ghost)Object.assign(this.ghost.style,{left:`${d.x}px`,top:`${d.y}px`});x.dataset.target=v},r=(u)=>{window.removeEventListener("pointermove",g,!0),window.removeEventListener("pointerup",r,!0),window.removeEventListener("pointercancel",r,!0);let k=x.getBoundingClientRect();this.dragging=!1,x.classList.remove("dragging"),this.ghost?.remove(),this.ghost=null,delete x.dataset.target,this.setCorner(u.type==="pointercancel"?this.corner:this.nearestCorner(k.left+k.width/2,k.top+k.height/2))};window.addEventListener("pointermove",g,!0),window.addEventListener("pointerup",r,!0),window.addEventListener("pointercancel",r,!0)}onGripKey(p){let n={ArrowLeft:(o)=>`${o[0]}l`,ArrowRight:(o)=>`${o[0]}r`,ArrowUp:(o)=>`t${o[1]}`,ArrowDown:(o)=>`b${o[1]}`}[p.key];if(!n)return;p.preventDefault(),this.setCorner(n(this.corner)),this.toolbar?.querySelector(".grip")?.focus()}openSidebar(){this.sidebar?.remove();let p=this.filters,x=this.cfg.labels,n=J("scope",[["page","This page"],["all","All pages"]],p.scope,{onchange:()=>{p.scope=n.value,this.renderSidebarList()}}),o=J("type",[["","All types"],...Q.map((r)=>[r,x.type[r]])],p.type,{onchange:()=>{p.type=o.value,this.renderSidebarList()}}),b=J("status",[["unresolved","Unresolved"],["","Any status"],...Object.keys(x.status).map((r)=>[r,x.status[r]])],p.status,{onchange:()=>{p.status=b.value,this.renderSidebarList()}}),g=f("input",{type:"checkbox",onchange:()=>{p.mine=g.checked,this.renderSidebarList()}});g.checked=p.mine,this.sidebar=f("div",{class:"sidebar",role:"complementary","aria-label":"Feedback list"},f("header",{},f("h2",{},this.cfg.brand?.label??"Feedback",f("button",{class:"x",type:"button","aria-label":"Close list",text:"×",onclick:()=>this.closeSidebar()})),f("div",{class:"filters"},n,o,b,f("span"),f("label",{},g,"Assigned to me"))),f("div",{class:"list"})),this.root.append(this.sidebar),this.renderToolbar(),this.renderSidebarList()}closeSidebar(){this.sidebar?.remove(),this.sidebar=null,this.renderToolbar()}matches(p){let x=this.filters;if(x.type&&p.type!==x.type)return!1;if(x.status==="unresolved"&&p.status==="resolved")return!1;if(x.status&&x.status!=="unresolved"&&p.status!==x.status)return!1;if(x.mine&&(!this.cfg.assignees.me||p.assignee_id!==this.cfg.assignees.me))return!1;return!0}async renderSidebarList(){let p=this.sidebar?.querySelector(".list");if(!p)return;let x=(b,g,r)=>f("button",{class:"entry",type:"button",onclick:g},f("span",{class:`num ${b.status==="resolved"?"resolved":b.type}`,text:`#${b.id}`}),f("span",{},f("span",{class:"t",text:b.title}),f("span",{class:"s",text:`${this.cfg.labels.status[b.status]}${b.assignee_name?` · ${b.assignee_name}`:""}${b.breakpoint?` · ${b.breakpoint}`:""}`})),r??null);if(this.filters.scope==="all"){if(!this.allItems){p.replaceChildren(f("div",{class:"empty",text:"Loading…"}));try{this.allItems=(await this.api.listItems()).items}catch(r){p.replaceChildren(f("div",{class:"empty",text:r.message}));return}}let b=new Map;for(let r of this.allItems.filter((u)=>this.matches(u))){let u=b.get(r.page_path)??[];u.push(r),b.set(r.page_path,u)}let g=[];for(let[r,u]of b){g.push(f("h3",{text:r===this.pagePath?`${r} (this page)`:r}));for(let k of u)g.push(x(k,()=>{if(k.page_path===this.pagePath)this.focusItem(k.id);else{let z=new URL(k.page_url,window.location.origin);z.searchParams.set("fbc_item",String(k.id)),window.location.href=z.toString()}}))}p.replaceChildren(...g.length?g:[f("div",{class:"empty",text:"Nothing matches these filters."})]);return}let n={pinned:{title:"On this page",nodes:[]},note:{title:"Page notes",nodes:[]},hidden:{title:"At other breakpoints",nodes:[]},orphan:{title:"Orphaned — element not found",nodes:[]}};for(let b of[...this.states.values()].sort((g,r)=>g.item.id-r.item.id)){if(!this.matches(b.item))continue;let g=b.placement==="orphan"?f("span",{class:"btn link reanchor",role:"button",text:"Re-anchor",onclick:(r)=>{r.stopPropagation(),this.reanchor(b.item.id)}}):null;n[b.placement].nodes.push(x(b.item,()=>this.focusItem(b.item.id),g))}let o=[];for(let b of["pinned","note","hidden","orphan"]){let g=n[b];if(!g.nodes.length)continue;let r=b==="hidden"?`${g.nodes.length} at other breakpoints`:g.title;o.push(f("h3",{text:r}),...g.nodes)}p.replaceChildren(...o.length?o:[f("div",{class:"empty",text:"No feedback on this page yet. Right-click anything to add some."})])}focusItem(p){let x=this.states.get(p);if(!x)return;if(x.placement==="pinned"&&x.el){if(x.item.status==="resolved"&&!this.showResolved)this.showResolved=!0,this.drawPins();x.el.scrollIntoView({block:"center",behavior:"smooth"}),window.setTimeout(()=>{this.positionPins(),x.pin?.classList.remove("pulse"),x.pin?.offsetWidth,x.pin?.classList.add("pulse"),this.openPopover(p)},450)}else this.openPopover(p,{x:window.innerWidth-720,y:80})}toast(p,x=!1){let n=f("div",{class:`toast${x?" err":""}`,role:"status",text:p});this.root.append(n),window.setTimeout(()=>n.remove(),x?5000:2200)}showBanner(p){this.bannerEl?.remove(),this.bannerEl=f("div",{class:"banner",role:"status"},f("span",{text:p}),f("button",{type:"button",text:"Dismiss",onclick:()=>{this.bannerEl?.remove(),this.bannerEl=null}})),this.root.append(this.bannerEl)}}t();S();function c(){let p=window.fbcConfig;if(!p||window.self!==window.top)return;new N(p).init()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",c,{once:!0});else c();})();
