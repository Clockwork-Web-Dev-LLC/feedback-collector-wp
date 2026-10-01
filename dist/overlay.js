(()=>{var d=`:host {
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
  --accent: #2271b1;
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
  background: rgba(34, 113, 177, 0.08);
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
  color: #fff;
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
  0% { box-shadow: 0 0 0 0 rgba(34, 113, 177, 0.7); }
  100% { box-shadow: 0 0 0 18px rgba(34, 113, 177, 0); }
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
  color: #fff;
}
.btn.link {
  border: 0;
  background: none;
  color: var(--accent);
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
  right: 16px;
  bottom: 16px;
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 6px;
  background: var(--ink);
  color: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
}
.toolbar button {
  border: 0;
  background: transparent;
  color: #fff;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  white-space: nowrap;
}
.toolbar button:hover,
.toolbar button.on {
  background: rgba(255, 255, 255, 0.16);
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
  top: 0;
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
  top: 44px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--ink);
  color: #fff;
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
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 4px;
  padding: 3px 8px;
}
.toast {
  position: fixed;
  left: 50%;
  bottom: 76px;
  transform: translateX(-50%);
  background: var(--ink);
  color: #fff;
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
  top: 44px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent);
  color: #fff;
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
`;var O="fbc-root";var t=["ember","react-","__next","radix-","headlessui-","mui-","yui_","ext-gen"],l=/[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i,s=/^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;function c(p){let x=/[a-z]/i.test(p),n=/[0-9]/.test(p);if(!x||!n)return!1;if(p.length>=6&&/^[0-9a-f]+$/i.test(p))return!0;return p.length>=8&&/^[0-9a-z]+$/i.test(p)&&h(p)>=2}function h(p){let x=0;for(let n=1;n<p.length;n++){let o=/[0-9]/.test(p.charAt(n-1)),f=/[0-9]/.test(p.charAt(n));if(o!==f)x++}return x}function e(p){if(p.trim()===""||/\s/.test(p))return!1;if(/^[0-9]/.test(p))return!1;if(/[0-9]{5,}/.test(p))return!1;if(l.test(p))return!1;if(s.test(p))return!1;let x=p.toLowerCase();if(t.some((n)=>x.startsWith(n)))return!1;return!p.split(/[-_:.]/).some(c)}function pp(p){let x="",n=p.length,o=p.charCodeAt(0);for(let f=0;f<n;f++){let g=p.charCodeAt(f),u=p.charAt(f);if(g===0)x+="�";else if(g>=1&&g<=31||g===127||f===0&&g>=48&&g<=57||f===1&&g>=48&&g<=57&&o===45)x+=`\\${g.toString(16)} `;else if(f===0&&n===1&&g===45)x+=`\\${u}`;else if(g>=128||g===45||g===95||g>=48&&g<=57||g>=65&&g<=90||g>=97&&g<=122)x+=u;else x+=`\\${u}`}return x}function B(p,x){let n=x?x.CSS:void 0,o=globalThis.CSS,f=n?.escape??o?.escape;return f?f(p):pp(p)}function xp(p){return p.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}function F(p){return p.localName.toLowerCase()}function np(p){return p.ownerDocument.defaultView}function fp(p){if(!p)return{x:0,y:0};let x=Number.isFinite(p.scrollX)?p.scrollX:0,n=Number.isFinite(p.scrollY)?p.scrollY:0;return{x,y:n}}function X(p){if(!Number.isFinite(p))return 0.5;return Math.min(1,Math.max(0,p))}function C(p){let x=p;while(x){if(x.id==="fbc-root")return!0;if(x.parentElement)x=x.parentElement;else{let n=x.getRootNode();x=n instanceof ShadowRoot?n.host:null}}return!1}function L(p){if(p===null)return null;let x=p.replace(/\s+/g," ").trim();if(x==="")return null;let n=Array.from(x);return n.length>120?n.slice(0,120).join(""):x}var op=/^fl-node-(?!content$)[a-z0-9]+$/i,bp=/^[a-z0-9]+$/i;function Y(p){let x=1,n=p.previousElementSibling;while(n){if(n.localName===p.localName&&n.namespaceURI===p.namespaceURI)x++;n=n.previousElementSibling}return x}function _(p,x){if(!p.id||!e(p.id))return null;let n=`#${B(p.id,x.defaultView)}`,o=x.querySelectorAll(n);return o.length===1&&o[0]===p?n:null}function gp(p,x){if(p===x.documentElement)return"html";let n=p.localName,o=p.getAttribute("data-id");if(o!==null&&p.classList.contains("elementor-element")&&bp.test(o))return`${n}[data-id="${xp(o)}"]`;let f=Array.from(p.classList).find((g)=>op.test(g));if(f!==void 0)return`${n}.${B(f,x.defaultView)}`;return`${n}:nth-of-type(${Y(p)})`}function up(p,x,n){let o=n.querySelectorAll(p);return o.length===1&&o[0]===x}function kp(p,x){let n=[],o=p;while(o){let f=_(o,x);if(f!==null)return n.unshift(f),n.join(" > ");n.unshift(gp(o,x));let g=n.join(" > ");if(up(g,p,x))return g;o=o.parentElement}return n.join(" > ")}function rp(p,x){let n=[],o=p;while(o){let f=F(o),g=o.parentElement,u=o===x.documentElement||g===x.documentElement&&(f==="head"||f==="body");n.unshift(u?f:`${f}[${Y(o)}]`),o=g}return`/${n.join("/")}`}var zp=/^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i,wp=/^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;function vp(p,x){if(!zp.test(p))return null;let n=p.slice(1).split("/"),o=null;for(let f of n){let g=wp.exec(f);if(!g)return null;let u=(g[1]??"").toLowerCase(),k=g[2]===void 0?1:Number(g[2]),r=o?Array.from(o.children):x.documentElement?[x.documentElement]:[],w=0,v=null;for(let J of r){if(F(J)!==u)continue;if(w++,w===k){v=J;break}}if(!v)return null;o=v}return o}function A(p,x,n){if(!Number.isFinite(x)||!Number.isFinite(n))throw RangeError(`createAnchor: click coordinates must be finite (got ${x}, ${n})`);if(!p.isConnected)throw Error("createAnchor: element is not connected to a document");if(C(p))throw Error("createAnchor: refusing to anchor an element inside #fbc-root");let o=p.ownerDocument;if(p.getRootNode()!==o)throw Error("createAnchor: element is inside a shadow root; anchor its shadow host instead");let f=p.getBoundingClientRect(),g=fp(o.defaultView),u=f.width>0?X((x-f.left)/f.width):0.5,k=f.height>0?X((n-f.top)/f.height):0.5;return{id:_(p,o)!==null?p.id:null,selector:kp(p,o),xpath:rp(p,o),text:L(p.textContent),tag:F(p),offsetX:u,offsetY:k,docX:x+g.x,docY:n+g.y}}function V(p,x){return p!==null&&F(p)===x&&!C(p)}function jp(p){return p instanceof DOMException||p instanceof Error&&p.name==="SyntaxError"}function Jp(p,x){if(typeof p.id!=="string"||p.id==="")return null;let n=x.getElementById(p.id);if(!n)return null;return x.querySelectorAll(`#${B(p.id,x.defaultView)}`).length===1?n:null}function Wp(p,x){if(typeof p.selector!=="string"||p.selector.trim()==="")return null;let n;try{n=x.querySelectorAll(p.selector)}catch(o){if(jp(o))return null;throw o}return n.length===1?n[0]??null:null}function Zp(p,x){if(typeof p.xpath!=="string")return null;return vp(p.xpath,x)}function $p(p,x){if(typeof p.text!=="string"||p.text==="")return null;let n=null;for(let o of Array.from(x.getElementsByTagName("*"))){if(F(o)!==p.tag||C(o))continue;if(L(o.textContent)!==p.text)continue;if(n)return null;n=o}return n}function I(p,x=document){if(typeof p.tag!=="string"||p.tag==="")return{el:null,strategy:"none"};let n=p.tag.toLowerCase(),o=Jp(p,x);if(V(o,n))return{el:o,strategy:"id"};let f,g=()=>{if(f===void 0)f=$p({...p,tag:n},x);return V(f,n)?f:null},u=(v)=>{if(p.text===null||L(v.textContent)===p.text)return null;let J=g();return J&&J!==v?J:null},k=Wp(p,x);if(V(k,n)){let v=u(k);return v?{el:v,strategy:"text"}:{el:k,strategy:"selector"}}let r=Zp(p,x);if(V(r,n)){let v=u(r);return v?{el:v,strategy:"text"}:{el:r,strategy:"xpath"}}let w=g();if(w)return{el:w,strategy:"text"};return{el:null,strategy:"none"}}function R(p){if(!p.isConnected)return!1;let x=np(p);if(!x)return!1;let n=x.getComputedStyle(p);if(n.visibility==="hidden"||n.visibility==="collapse")return!1;let o=p;while(o){if(x.getComputedStyle(o).display==="none")return!1;o=o.parentElement}let f=p.getBoundingClientRect();return!(f.width===0&&f.height===0)}class a extends Error{status;constructor(p,x){super(p);this.status=x}}class N{cfg;constructor(p){this.cfg=p}url(p,x){let n=this.cfg.restUrl.replace(/\/$/,"")+p;if(x){let o=new URLSearchParams(x).toString();if(o)n+=(n.includes("?")?"&":"?")+o}return n}async request(p,x,n,o){let f=await fetch(this.url(x,o),{method:p,credentials:"same-origin",headers:{"X-WP-Nonce":this.cfg.nonce,...n!==void 0?{"Content-Type":"application/json"}:{}},body:n!==void 0?JSON.stringify(n):void 0}),g=await f.json().catch(()=>null);if(!f.ok){let u=g&&typeof g==="object"&&"message"in g?String(g.message):f.statusText;throw new a(u,f.status)}return g}listItems(p){return this.request("GET","/items",void 0,p?{page_path:p}:void 0)}getItem(p){return this.request("GET",`/items/${p}`)}createItem(p){return this.request("POST","/items",p)}updateItem(p,x){return this.request("PATCH",`/items/${p}`,x)}deleteItem(p){return this.request("DELETE",`/items/${p}`)}addComment(p,x){return this.request("POST",`/items/${p}/comments`,{body:x})}}function Q(p=window.innerWidth){if(p<768)return"mobile";if(p<=1024)return"tablet";return"desktop"}function Fp(p){let x=[[/Edg\/([\d.]+)/,"Edge"],[/OPR\/([\d.]+)/,"Opera"],[/Firefox\/([\d.]+)/,"Firefox"],[/CriOS\/([\d.]+)/,"Chrome iOS"],[/Chrome\/([\d.]+)/,"Chrome"],[/Version\/([\d.]+).*Safari/,"Safari"]];for(let[n,o]of x){let f=p.match(n);if(f)return`${o} ${f[1].split(".")[0]}`}return"Unknown"}function Qp(p){let x=p.match(/(iPhone|iPad).*OS ([\d_]+)/);if(x)return`iOS ${x[2].replace(/_/g,".")}`;if(x=p.match(/Android ([\d.]+)/),x)return`Android ${x[1]}`;if(x=p.match(/Windows NT ([\d.]+)/),x)return x[1]==="10.0"?"Windows 10/11":`Windows NT ${x[1]}`;if(x=p.match(/Mac OS X ([\d_]+)/),x)return`macOS ${x[1].replace(/_/g,".")}`;if(/CrOS/.test(p))return"ChromeOS";if(/Linux/.test(p))return"Linux";return"Unknown"}function P(p){let x=navigator.userAgent;return{viewport_w:window.innerWidth,viewport_h:window.innerHeight,dpr:Math.round((window.devicePixelRatio||1)*100)/100,breakpoint:Q(),browser:Fp(x),os:Qp(x),user_agent:x,post_id:p.page.postId,post_type:p.page.postType,theme:p.page.theme,js_errors:(window.__fbcErrors??[]).slice(-20)}}function S(p){let x=window.location.pathname,n=p.replace(/\/$/,"");if(n&&x.startsWith(n))x=x.slice(n.length);return x="/"+x.replace(/^\/+/,""),x==="/"?"/":x.replace(/\/?$/,"/")}function i(){let p=new URLSearchParams(window.location.search);return p.delete("fbc_item"),p.toString()}function E(){if(window.__fbcErrors)return;let p=window.__fbcErrors=[],x=(n)=>{if(p.push(n.slice(0,500)),p.length>20)p.shift()};window.addEventListener("error",(n)=>{if(n.message)x(`${n.message}${n.filename?` (${n.filename}:${n.lineno})`:""}`)}),window.addEventListener("unhandledrejection",(n)=>{let o=n.reason;x(`Unhandled rejection: ${o instanceof Error?o.message:String(o)}`)})}function b(p,x={},...n){let o=document.createElement(p);for(let[f,g]of Object.entries(x)){if(g===null||g===void 0||g===!1)continue;if(f.startsWith("on")&&typeof g==="function")o.addEventListener(f.slice(2).toLowerCase(),g);else if(f==="text")o.textContent=String(g);else if(f==="value"&&"value"in o)o.value=String(g);else if(g===!0)o.setAttribute(f,"");else o.setAttribute(f,String(g))}for(let f of n){if(f===null||f===void 0||f===!1)continue;o.append(typeof f==="number"?String(f):f)}return o}function W(p,x,n,o={}){let f=b("select",{name:p,...o});for(let[g,u]of x){let k=b("option",{value:g,text:u});if(g===n)k.selected=!0;f.append(k)}return f}function q(p){let x=new Date(p).getTime();if(Number.isNaN(x))return"";let n=Math.round((Date.now()-x)/1000);if(n<60)return"just now";let o=Math.round(n/60);if(o<60)return`${o}m ago`;let f=Math.round(o/60);if(f<24)return`${f}h ago`;let g=Math.round(f/24);if(g<30)return`${g}d ago`;return new Date(p).toLocaleDateString()}var K=["bug","tweak","change","comment"],T="fbc:mode";class D{cfg;api;host;root;pinsLayer;outline;outlineTag;toolbar=null;sidebar=null;card=null;hintEl=null;bannerEl=null;mode=!1;showResolved=!1;pinMode=null;states=new Map;allItems=null;filters={scope:"page",type:"",status:"unresolved",mine:!1};pagePath;framePending=!1;refreshTimer=0;lastWidth=window.innerWidth;mutationObserver=null;loaded=!1;constructor(p){this.cfg=p;this.api=new N(p),this.pagePath=p.pagePath??S(p.homePath)}init(){this.mount(),this.bindGlobalEvents(),this.bindAdminBar();let p=!1;try{p=window.localStorage.getItem(T)==="1"}catch{p=!1}if(this.cfg.openItem||p)this.setMode(!0)}mount(){this.host=b("div",{id:O}),this.host.setAttribute("style","all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;");let p=this.host.attachShadow({mode:"open"});p.append(b("style",{text:d})),this.root=b("div",{class:"fbc"});let x=b("div",{class:"layer"});this.outlineTag=b("span",{class:"outline-tag"}),this.outline=b("div",{class:"outline"},this.outlineTag),this.pinsLayer=b("div"),x.append(this.outline,this.pinsLayer),this.root.append(x),p.append(this.root),document.body.append(this.host)}inOverlay(p){return p.composedPath().includes(this.host)}bindGlobalEvents(){document.addEventListener("contextmenu",(p)=>this.onContextMenu(p),!0),document.addEventListener("mousemove",(p)=>this.onMouseMove(p),{capture:!0,passive:!0});for(let p of["pointerdown","mousedown","mouseup","click"])document.addEventListener(p,(x)=>this.onPinModeEvent(x),!0);document.addEventListener("mousedown",(p)=>this.onOutsideMouseDown(p),!1),document.addEventListener("keydown",(p)=>this.onKeyDown(p),!0),window.addEventListener("scroll",()=>this.schedulePosition(),{passive:!0,capture:!0}),window.addEventListener("resize",()=>{let p=window.innerWidth!==this.lastWidth;if(this.lastWidth=window.innerWidth,p)this.scheduleRefresh(80);else this.schedulePosition()})}bindAdminBar(){document.querySelector("#wp-admin-bar-fbc-toggle > a")?.addEventListener("click",(x)=>{x.preventDefault(),this.setMode(!this.mode)})}async setMode(p){this.mode=p;try{window.localStorage.setItem(T,p?"1":"0")}catch{}if(document.querySelector("#wp-admin-bar-fbc-toggle")?.classList.toggle("fbc-on",p),!p){this.exitPinMode(),this.closeCard(),this.closeSidebar(),this.hideOutline(),this.toolbar?.remove(),this.toolbar=null,this.bannerEl?.remove(),this.bannerEl=null,this.pinsLayer.replaceChildren();for(let x of this.states.values())x.pin=null;this.mutationObserver?.disconnect();return}if(this.renderToolbar(),this.observeMutations(),!this.loaded)await this.loadItems();else this.refresh();if(this.cfg.openItem){let x=this.cfg.openItem;this.cfg.openItem=0,this.stripDeepLinkParam(),this.openDeepLink(x)}}stripDeepLinkParam(){let p=new URL(window.location.href);if(p.searchParams.has("fbc_item"))p.searchParams.delete("fbc_item"),window.history.replaceState(window.history.state,"",p.toString())}async loadItems(){try{let{items:p}=await this.api.listItems(this.pagePath);this.states.clear();for(let x of p)this.states.set(x.id,{item:x,el:null,placement:"orphan",pin:null});this.loaded=!0,this.refresh()}catch(p){this.toast(`Could not load feedback: ${p.message}`,!0)}}upsert(p){let x=this.states.get(p.id);if(x)x.item=p;else this.states.set(p.id,{item:p,el:null,placement:"orphan",pin:null});if(this.allItems){let n=this.allItems.findIndex((o)=>o.id===p.id);if(n>=0)this.allItems[n]=p;else this.allItems.push(p)}}remove(p){if(this.states.get(p)?.pin?.remove(),this.states.delete(p),this.allItems)this.allItems=this.allItems.filter((n)=>n.id!==p)}refresh(){for(let p of this.states.values()){if(!p.item.anchor){p.el=null,p.placement="note";continue}let x=p.el&&p.el.isConnected?p.el:I(p.item.anchor).el;p.el=x,p.placement=!x?"orphan":R(x)?"pinned":"hidden"}if(this.drawPins(),this.updateToolbarCount(),this.sidebar)this.renderSidebarList()}drawPins(){if(!this.mode)return;for(let p of this.states.values()){if(!(p.placement==="pinned"&&(this.showResolved||p.item.status!=="resolved"))){p.pin?.remove(),p.pin=null;continue}if(!p.pin){let o=b("button",{class:"pin",type:"button","aria-label":`Feedback #${p.item.id}: ${p.item.title}`,onclick:(f)=>{f.stopPropagation(),this.openPopover(p.item.id)}});p.pin=o,this.pinsLayer.append(o)}let n=p.item.status==="resolved";p.pin.className=`pin ${p.item.type}${n?" resolved":""}`,p.pin.textContent=n?"✓":String(p.item.id),p.pin.title=`#${p.item.id} ${p.item.title}`}this.positionPins()}schedulePosition(){if(this.framePending||!this.mode)return;this.framePending=!0,requestAnimationFrame(()=>{this.framePending=!1,this.positionPins()})}scheduleRefresh(p=250){window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.mode&&this.refresh(),p)}positionPins(){for(let p of this.states.values()){if(!p.pin||!p.el||!p.item.anchor)continue;let x=p.el.getBoundingClientRect(),n=x.left+p.item.anchor.offsetX*x.width,o=x.top+p.item.anchor.offsetY*x.height;p.pin.style.transform=`translate(${Math.round(n)}px, ${Math.round(o)}px)`}}observeMutations(){if(!this.mutationObserver)this.mutationObserver=new MutationObserver((p)=>{if(p.every((x)=>x.target===this.host||this.host.contains(x.target)))return;this.schedulePosition(),this.scheduleRefresh(300)});this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden","open"]})}onContextMenu(p){if(!this.mode||p.altKey||this.inOverlay(p))return;let x=this.eventTarget(p);if(!x)return;p.preventDefault(),p.stopPropagation(),this.exitPinMode(),this.openTypeMenu(x,p.clientX,p.clientY)}onPinModeEvent(p){if(!this.pinMode||this.inOverlay(p)||p.button!==0)return;if(p.preventDefault(),p.stopImmediatePropagation(),p.type!=="click")return;let x=this.eventTarget(p),n=this.pinMode;if(this.exitPinMode(),x)n.done(x,p.clientX,p.clientY)}onOutsideMouseDown(p){if(this.card&&!this.inOverlay(p))this.closeCard()}onMouseMove(p){if(!this.mode||this.card&&!this.pinMode||this.inOverlay(p)){if(!this.pinMode)this.hideOutline();return}let x=this.eventTarget(p);if(!x||x===document.documentElement||x===document.body){this.hideOutline();return}let n=x.getBoundingClientRect();Object.assign(this.outline.style,{left:`${n.left}px`,top:`${n.top}px`,width:`${n.width}px`,height:`${n.height}px`});let o=x.id?`#${x.id}`:"";this.outlineTag.textContent=`${x.tagName.toLowerCase()}${o}`,this.outline.classList.add("on")}onKeyDown(p){let x=p.composedPath()[0],n=x instanceof HTMLElement&&(x.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(x.tagName));if(p.altKey&&p.shiftKey&&p.code==="KeyF"&&!n){p.preventDefault(),this.setMode(!this.mode);return}if(p.key==="Escape"&&this.mode){if(this.pinMode)this.exitPinMode(),p.preventDefault();else if(this.card)this.closeCard(),p.preventDefault();else if(this.sidebar)this.closeSidebar(),p.preventDefault()}}eventTarget(p){let x=p.target;if(x instanceof Element)return x;if(x instanceof Node)return x.parentElement;return null}hideOutline(){this.outline.classList.remove("on")}enterPinMode(p){this.closeCard(),this.pinMode=p,this.hintEl?.remove(),this.hintEl=b("div",{class:"crosshair-hint",text:`${p.hint} · Esc to cancel`}),this.root.append(this.hintEl),document.documentElement.style.cursor="crosshair",this.renderToolbar()}exitPinMode(){if(!this.pinMode)return;this.pinMode=null,this.hintEl?.remove(),this.hintEl=null,document.documentElement.style.cursor="",this.hideOutline(),this.renderToolbar()}safeAnchor(p,x,n){try{return A(p,x,n)}catch{return this.toast("Can't pin to that element. Try its container, or add a page note.",!0),null}}closeCard(){this.card?.remove(),this.card=null}showCard(p,x,n){this.closeCard(),this.hideOutline(),this.card=p,p.style.left="0px",p.style.top="0px",p.style.visibility="hidden",this.root.append(p);let{offsetWidth:o,offsetHeight:f}=p,g=Math.max(12,Math.min(x+8,window.innerWidth-o-12)),u=Math.max(12,Math.min(n+8,window.innerHeight-f-12));p.style.left=`${g}px`,p.style.top=`${u}px`,p.style.visibility=""}openTypeMenu(p,x,n){let o=this.cfg.labels.type,f=(k)=>this.openComposer(k,p,x,n),g=K.map((k,r)=>b("button",{type:"button",onclick:()=>f(k)},b("span",{class:`dot ${k}`}),o[k],b("kbd",{text:String(r+1)}))),u=b("div",{class:"card menu",role:"menu",onkeydown:(k)=>{let r=k.key,w=Number(r);if(w>=1&&w<=K.length)k.preventDefault(),f(K[w-1])}},b("div",{class:"menu-title",text:"Add feedback"}),...g,b("hr"),b("button",{type:"button",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},"Note for the whole page"));this.showCard(u,x,n),g[0].focus()}openComposer(p,x,n,o){let f=null;if(x){if(f=this.safeAnchor(x,n,o),!f)return}let g=this.cfg.labels,u=W("type",K.map((j)=>[j,g.type[j]]),p),k=b("input",{type:"text",name:"title",maxlength:255,required:!0,placeholder:"What needs attention?",autocomplete:"off"}),r=b("textarea",{name:"description",placeholder:"Details, steps to reproduce, what you expected… (optional)"}),w=W("priority",Object.keys(g.priority).map((j)=>[j,g.priority[j]]),"medium"),v=W("assignee_id",[["0","Unassigned"],...this.cfg.reviewers.map((j)=>[String(j.id),j.name])],"0"),J=b("div",{class:"error",role:"alert"}),Z=b("button",{class:"btn primary",type:"submit",text:"Add"}),G=b("form",{class:"card composer",novalidate:!0,onsubmit:(j)=>{j.preventDefault(),H()}},b("div",{class:"head"},b("span",{class:"chip"},b("span",{class:`dot ${p}`}),x?`<${x.tagName.toLowerCase()}>`:"Whole page"),b("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),b("label",{class:"field"},b("span",{text:"Title"}),k),J,b("label",{class:"field"},b("span",{text:"Description"}),r),b("div",{class:"row"},b("label",{class:"field"},b("span",{text:"Type"}),u),b("label",{class:"field"},b("span",{text:"Priority"}),w)),b("label",{class:"field"},b("span",{text:"Assignee"}),v),b("div",{class:"actions"},b("button",{class:"btn link",type:"button",text:"Cancel",onclick:()=>this.closeCard()}),Z)),H=async()=>{if(!k.value.trim()){J.textContent="Add a short title.",k.focus();return}Z.disabled=!0;try{let j=await this.api.createItem({type:u.value,title:k.value.trim(),description:r.value,priority:w.value,assignee_id:Number(v.value),page_path:this.pagePath,page_query:i(),page_title:document.title,anchor:f,context:P(this.cfg)});this.closeCard(),this.upsert(j);let U=this.states.get(j.id);if(U&&x)U.el=x;this.refresh(),this.toast(`Added #${j.id}`)}catch(j){J.textContent=j.message,Z.disabled=!1}};this.showCard(G,n,o),k.focus()}async openPopover(p,x){let n;try{n=await this.api.getItem(p)}catch(z){this.toast(z.message,!0);return}this.upsert(n);let o=this.cfg.labels,f=this.states.get(p),g=f?.pin?.getBoundingClientRect(),u=x?.x??(g?g.right:window.innerWidth/2-170),k=x?.y??(g?g.top:100),r=async(z)=>{try{let M=await this.api.updateItem(p,z);this.upsert(M),this.refresh(),this.openPopover(p,{x:parseFloat($.style.left)-8,y:parseFloat($.style.top)-8})}catch(M){this.toast(M.message,!0)}},w=W("status",Object.keys(o.status).map((z)=>[z,o.status[z]]),n.status,{onchange:()=>void r({status:w.value})}),v=W("assignee_id",[["0","Unassigned"],...this.cfg.reviewers.map((z)=>[String(z.id),z.name])],String(n.assignee_id),{onchange:()=>void r({assignee_id:Number(v.value)})}),J=W("priority",Object.keys(o.priority).map((z)=>[z,o.priority[z]]),n.priority,{onchange:()=>void r({priority:J.value})}),Z=b("textarea",{placeholder:"Reply…",rows:2}),G=b("ul",{class:"thread"},...(n.comments??[]).map((z)=>b("li",{class:z.kind},b("span",{class:"who",text:z.user_name}),b("span",{class:"when",text:q(z.created_at)}),b("div",{class:"body",text:z.body})))),H=Q(),j=n.breakpoint&&n.breakpoint!==H?b("div",{class:"notice",text:`Logged at ${n.breakpoint} (${n.context?.viewport_w??"?"}px). You are on ${H} (${window.innerWidth}px).`}):null,U=f?.placement==="orphan"?b("div",{class:"notice",text:"The element this was pinned to can’t be found on the page anymore. Re-anchor it."}):null,$=b("div",{class:"card popover",role:"dialog","aria-label":`Feedback #${n.id}`},b("div",{class:"head"},b("span",{class:"chip"},b("span",{class:`dot ${n.type}`}),`${o.type[n.type]} #${n.id}`),b("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),b("div",{class:"t",style:"font-weight:700;font-size:15px;margin-bottom:4px",text:n.title}),b("div",{class:"meta",text:`${n.reporter_name} · ${q(n.created_at)}${n.breakpoint?` · ${n.breakpoint}`:""}`}),n.tw_task_url?b("div",{class:"meta"},b("a",{href:n.tw_task_url,target:"_blank",rel:"noopener",text:`Teamwork task #${n.tw_task_id} ↗`}),n.status==="resolved"?" · completed":" · status syncs from Teamwork"):null,j,U,n.description?b("p",{class:"desc",text:n.description}):null,b("div",{class:"row"},b("label",{class:"field"},b("span",{text:"Status"}),w),b("label",{class:"field"},b("span",{text:"Priority"}),J)),b("label",{class:"field"},b("span",{text:"Assignee"}),v),G,b("label",{class:"field"},Z),b("div",{class:"actions"},n.anchor||f?.placement==="note"?b("button",{class:"btn link left",type:"button",text:"Re-anchor",onclick:()=>this.reanchor(n.id)}):null,b("a",{class:"btn link",href:`${this.cfg.adminUrl}&item=${n.id}`,target:"_blank",rel:"noopener",text:"Admin"}),n.can_delete?b("button",{class:"btn danger",type:"button",text:"Delete",onclick:()=>void this.deleteItem(n.id)}):null,b("button",{class:"btn primary",type:"button",text:"Reply",onclick:async()=>{if(!Z.value.trim())return;try{await this.api.addComment(n.id,Z.value),this.openPopover(p,{x:parseFloat($.style.left)-8,y:parseFloat($.style.top)-8})}catch(z){this.toast(z.message,!0)}}})));this.showCard($,u,k)}reanchor(p){this.enterPinMode({hint:`Click the element #${p} belongs to`,done:async(x,n,o)=>{try{let f=this.safeAnchor(x,n,o);if(!f)return;let g=await this.api.updateItem(p,{anchor:f});this.upsert(g);let u=this.states.get(p);if(u)u.el=x;this.refresh(),this.toast(`Re-anchored #${p}`)}catch(f){this.toast(f.message,!0)}}})}async deleteItem(p){if(!window.confirm(`Delete feedback #${p}? This can’t be undone.`))return;try{await this.api.deleteItem(p),this.closeCard(),this.remove(p),this.refresh(),this.toast(`Deleted #${p}`)}catch(x){this.toast(x.message,!0)}}async openDeepLink(p){let x=this.states.get(p);if(x?.el&&x.placement==="pinned")x.el.scrollIntoView({block:"center",behavior:"auto"}),await new Promise((o)=>requestAnimationFrame(()=>o(null))),this.positionPins(),x.pin?.classList.add("pulse");let n=x?.item;if(n?.breakpoint&&n.breakpoint!==Q())this.showBanner(`#${p} was logged at ${n.breakpoint} (${n.context?.viewport_w??"?"}px wide). You're viewing at ${Q()} (${window.innerWidth}px). Resize to reproduce.`);await this.openPopover(p)}unresolvedCount(){let p=0;for(let x of this.states.values())if(x.item.status!=="resolved")p++;return p}renderToolbar(){if(!this.mode)return;let p=this.unresolvedCount(),x=b("div",{class:"toolbar",role:"toolbar","aria-label":"Feedback"},b("span",{class:"brand",text:"Feedback"}),b("button",{type:"button",class:this.pinMode?"on":"",title:"Click an element to pin feedback (or right-click anywhere)",text:"+ Add",onclick:()=>this.pinMode?this.exitPinMode():this.enterPinMode({hint:"Click any element to add feedback",done:(n,o,f)=>this.openTypeMenu(n,o,f)})}),b("button",{type:"button",text:"Page note",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)}),b("button",{type:"button",class:this.sidebar?"on":"",onclick:()=>this.sidebar?this.closeSidebar():this.openSidebar()},b("span",{class:"label",text:"List"}),p?b("span",{class:"count",text:String(p)}):null),b("button",{type:"button",class:this.showResolved?"on":"",title:"Show resolved pins",text:"✓ Resolved",onclick:()=>{this.showResolved=!this.showResolved,this.drawPins(),this.renderToolbar()}}),b("button",{type:"button",title:"Exit Feedback mode (Alt+Shift+F)","aria-label":"Exit Feedback mode",text:"×",onclick:()=>void this.setMode(!1)}));if(this.toolbar)this.toolbar.replaceWith(x);else this.root.append(x);this.toolbar=x}updateToolbarCount(){this.renderToolbar()}openSidebar(){this.sidebar?.remove();let p=this.filters,x=this.cfg.labels,n=W("scope",[["page","This page"],["all","All pages"]],p.scope,{onchange:()=>{p.scope=n.value,this.renderSidebarList()}}),o=W("type",[["","All types"],...K.map((u)=>[u,x.type[u]])],p.type,{onchange:()=>{p.type=o.value,this.renderSidebarList()}}),f=W("status",[["unresolved","Unresolved"],["","Any status"],...Object.keys(x.status).map((u)=>[u,x.status[u]])],p.status,{onchange:()=>{p.status=f.value,this.renderSidebarList()}}),g=b("input",{type:"checkbox",onchange:()=>{p.mine=g.checked,this.renderSidebarList()}});g.checked=p.mine,this.sidebar=b("div",{class:"sidebar",role:"complementary","aria-label":"Feedback list"},b("header",{},b("h2",{},"Feedback",b("button",{class:"x",type:"button","aria-label":"Close list",text:"×",onclick:()=>this.closeSidebar()})),b("div",{class:"filters"},n,o,f,b("span"),b("label",{},g,"Assigned to me"))),b("div",{class:"list"})),this.root.append(this.sidebar),this.renderToolbar(),this.renderSidebarList()}closeSidebar(){this.sidebar?.remove(),this.sidebar=null,this.renderToolbar()}matches(p){let x=this.filters;if(x.type&&p.type!==x.type)return!1;if(x.status==="unresolved"&&p.status==="resolved")return!1;if(x.status&&x.status!=="unresolved"&&p.status!==x.status)return!1;if(x.mine&&p.assignee_id!==this.cfg.user.id)return!1;return!0}async renderSidebarList(){let p=this.sidebar?.querySelector(".list");if(!p)return;let x=(f,g,u)=>b("button",{class:"entry",type:"button",onclick:g},b("span",{class:`num ${f.status==="resolved"?"resolved":f.type}`,text:`#${f.id}`}),b("span",{},b("span",{class:"t",text:f.title}),b("span",{class:"s",text:`${this.cfg.labels.status[f.status]}${f.assignee_name?` · ${f.assignee_name}`:""}${f.breakpoint?` · ${f.breakpoint}`:""}`})),u??null);if(this.filters.scope==="all"){if(!this.allItems){p.replaceChildren(b("div",{class:"empty",text:"Loading…"}));try{this.allItems=(await this.api.listItems()).items}catch(u){p.replaceChildren(b("div",{class:"empty",text:u.message}));return}}let f=new Map;for(let u of this.allItems.filter((k)=>this.matches(k))){let k=f.get(u.page_path)??[];k.push(u),f.set(u.page_path,k)}let g=[];for(let[u,k]of f){g.push(b("h3",{text:u===this.pagePath?`${u} (this page)`:u}));for(let r of k)g.push(x(r,()=>{if(r.page_path===this.pagePath)this.focusItem(r.id);else{let w=new URL(r.page_url,window.location.origin);w.searchParams.set("fbc_item",String(r.id)),window.location.href=w.toString()}}))}p.replaceChildren(...g.length?g:[b("div",{class:"empty",text:"Nothing matches these filters."})]);return}let n={pinned:{title:"On this page",nodes:[]},note:{title:"Page notes",nodes:[]},hidden:{title:"At other breakpoints",nodes:[]},orphan:{title:"Orphaned — element not found",nodes:[]}};for(let f of[...this.states.values()].sort((g,u)=>g.item.id-u.item.id)){if(!this.matches(f.item))continue;let g=f.placement==="orphan"?b("span",{class:"btn link reanchor",role:"button",text:"Re-anchor",onclick:(u)=>{u.stopPropagation(),this.reanchor(f.item.id)}}):null;n[f.placement].nodes.push(x(f.item,()=>this.focusItem(f.item.id),g))}let o=[];for(let f of["pinned","note","hidden","orphan"]){let g=n[f];if(!g.nodes.length)continue;let u=f==="hidden"?`${g.nodes.length} at other breakpoints`:g.title;o.push(b("h3",{text:u}),...g.nodes)}p.replaceChildren(...o.length?o:[b("div",{class:"empty",text:"No feedback on this page yet. Right-click anything to add some."})])}focusItem(p){let x=this.states.get(p);if(!x)return;if(x.placement==="pinned"&&x.el){if(x.item.status==="resolved"&&!this.showResolved)this.showResolved=!0,this.drawPins();x.el.scrollIntoView({block:"center",behavior:"smooth"}),window.setTimeout(()=>{this.positionPins(),x.pin?.classList.remove("pulse"),x.pin?.offsetWidth,x.pin?.classList.add("pulse"),this.openPopover(p)},450)}else this.openPopover(p,{x:window.innerWidth-720,y:80})}toast(p,x=!1){let n=b("div",{class:`toast${x?" err":""}`,role:"status",text:p});this.root.append(n),window.setTimeout(()=>n.remove(),x?5000:2200)}showBanner(p){this.bannerEl?.remove(),this.bannerEl=b("div",{class:"banner",role:"status"},b("span",{text:p}),b("button",{type:"button",text:"Dismiss",onclick:()=>{this.bannerEl?.remove(),this.bannerEl=null}})),this.root.append(this.bannerEl)}}E();function y(){let p=window.fbcConfig;if(!p||window.self!==window.top)return;new D(p).init()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",y,{once:!0});else y();})();
