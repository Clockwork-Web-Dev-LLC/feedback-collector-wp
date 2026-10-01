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
  right: 16px;
  bottom: 16px;
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
  bottom: 76px;
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
  top: 44px;
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
`;var Y="fbc-root";var c=["ember","react-","__next","radix-","headlessui-","mui-","yui_","ext-gen"],s=/[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i,h=/^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;function e(x){let p=/[a-z]/i.test(x),n=/[0-9]/.test(x);if(!p||!n)return!1;if(x.length>=6&&/^[0-9a-f]+$/i.test(x))return!0;return x.length>=8&&/^[0-9a-z]+$/i.test(x)&&xx(x)>=2}function xx(x){let p=0;for(let n=1;n<x.length;n++){let b=/[0-9]/.test(x.charAt(n-1)),o=/[0-9]/.test(x.charAt(n));if(b!==o)p++}return p}function px(x){if(x.trim()===""||/\s/.test(x))return!1;if(/^[0-9]/.test(x))return!1;if(/[0-9]{5,}/.test(x))return!1;if(s.test(x))return!1;if(h.test(x))return!1;let p=x.toLowerCase();if(c.some((n)=>p.startsWith(n)))return!1;return!x.split(/[-_:.]/).some(e)}function nx(x){let p="",n=x.length,b=x.charCodeAt(0);for(let o=0;o<n;o++){let r=x.charCodeAt(o),g=x.charAt(o);if(r===0)p+="�";else if(r>=1&&r<=31||r===127||o===0&&r>=48&&r<=57||o===1&&r>=48&&r<=57&&b===45)p+=`\\${r.toString(16)} `;else if(o===0&&n===1&&r===45)p+=`\\${g}`;else if(r>=128||r===45||r===95||r>=48&&r<=57||r>=65&&r<=90||r>=97&&r<=122)p+=g;else p+=`\\${g}`}return p}function C(x,p){let n=p?p.CSS:void 0,b=globalThis.CSS,o=n?.escape??b?.escape;return o?o(x):nx(x)}function ox(x){return x.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}function F(x){return x.localName.toLowerCase()}function bx(x){return x.ownerDocument.defaultView}function fx(x){if(!x)return{x:0,y:0};let p=Number.isFinite(x.scrollX)?x.scrollX:0,n=Number.isFinite(x.scrollY)?x.scrollY:0;return{x:p,y:n}}function X(x){if(!Number.isFinite(x))return 0.5;return Math.min(1,Math.max(0,x))}function L(x){let p=x;while(p){if(p.id==="fbc-root")return!0;if(p.parentElement)p=p.parentElement;else{let n=p.getRootNode();p=n instanceof ShadowRoot?n.host:null}}return!1}function a(x){if(x===null)return null;let p=x.replace(/\s+/g," ").trim();if(p==="")return null;let n=Array.from(p);return n.length>120?n.slice(0,120).join(""):p}var rx=/^fl-node-(?!content$)[a-z0-9]+$/i,gx=/^[a-z0-9]+$/i;function _(x){let p=1,n=x.previousElementSibling;while(n){if(n.localName===x.localName&&n.namespaceURI===x.namespaceURI)p++;n=n.previousElementSibling}return p}function A(x,p){if(!x.id||!px(x.id))return null;let n=`#${C(x.id,p.defaultView)}`,b=p.querySelectorAll(n);return b.length===1&&b[0]===x?n:null}function kx(x,p){if(x===p.documentElement)return"html";let n=x.localName,b=x.getAttribute("data-id");if(b!==null&&x.classList.contains("elementor-element")&&gx.test(b))return`${n}[data-id="${ox(b)}"]`;let o=Array.from(x.classList).find((r)=>rx.test(r));if(o!==void 0)return`${n}.${C(o,p.defaultView)}`;return`${n}:nth-of-type(${_(x)})`}function ux(x,p,n){let b=n.querySelectorAll(x);return b.length===1&&b[0]===p}function zx(x,p){let n=[],b=x;while(b){let o=A(b,p);if(o!==null)return n.unshift(o),n.join(" > ");n.unshift(kx(b,p));let r=n.join(" > ");if(ux(r,x,p))return r;b=b.parentElement}return n.join(" > ")}function wx(x,p){let n=[],b=x;while(b){let o=F(b),r=b.parentElement,g=b===p.documentElement||r===p.documentElement&&(o==="head"||o==="body");n.unshift(g?o:`${o}[${_(b)}]`),b=r}return`/${n.join("/")}`}var vx=/^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i,Jx=/^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;function Wx(x,p){if(!vx.test(x))return null;let n=x.slice(1).split("/"),b=null;for(let o of n){let r=Jx.exec(o);if(!r)return null;let g=(r[1]??"").toLowerCase(),k=r[2]===void 0?1:Number(r[2]),u=b?Array.from(b.children):p.documentElement?[p.documentElement]:[],z=0,w=null;for(let W of u){if(F(W)!==g)continue;if(z++,z===k){w=W;break}}if(!w)return null;b=w}return b}function I(x,p,n){if(!Number.isFinite(p)||!Number.isFinite(n))throw RangeError(`createAnchor: click coordinates must be finite (got ${p}, ${n})`);if(!x.isConnected)throw Error("createAnchor: element is not connected to a document");if(L(x))throw Error("createAnchor: refusing to anchor an element inside #fbc-root");let b=x.ownerDocument;if(x.getRootNode()!==b)throw Error("createAnchor: element is inside a shadow root; anchor its shadow host instead");let o=x.getBoundingClientRect(),r=fx(b.defaultView),g=o.width>0?X((p-o.left)/o.width):0.5,k=o.height>0?X((n-o.top)/o.height):0.5;return{id:A(x,b)!==null?x.id:null,selector:zx(x,b),xpath:wx(x,b),text:a(x.textContent),tag:F(x),offsetX:g,offsetY:k,docX:p+r.x,docY:n+r.y}}function U(x,p){return x!==null&&F(x)===p&&!L(x)}function Zx(x){return x instanceof DOMException||x instanceof Error&&x.name==="SyntaxError"}function $x(x,p){if(typeof x.id!=="string"||x.id==="")return null;let n=p.getElementById(x.id);if(!n)return null;return p.querySelectorAll(`#${C(x.id,p.defaultView)}`).length===1?n:null}function jx(x,p){if(typeof x.selector!=="string"||x.selector.trim()==="")return null;let n;try{n=p.querySelectorAll(x.selector)}catch(b){if(Zx(b))return null;throw b}return n.length===1?n[0]??null:null}function Fx(x,p){if(typeof x.xpath!=="string")return null;return Wx(x.xpath,p)}function Qx(x,p){if(typeof x.text!=="string"||x.text==="")return null;let n=null;for(let b of Array.from(p.getElementsByTagName("*"))){if(F(b)!==x.tag||L(b))continue;if(a(b.textContent)!==x.text)continue;if(n)return null;n=b}return n}function O(x,p=document){if(typeof x.tag!=="string"||x.tag==="")return{el:null,strategy:"none"};let n=x.tag.toLowerCase(),b=$x(x,p);if(U(b,n))return{el:b,strategy:"id"};let o,r=()=>{if(o===void 0)o=Qx({...x,tag:n},p);return U(o,n)?o:null},g=(w)=>{if(x.text===null||a(w.textContent)===x.text)return null;let W=r();return W&&W!==w?W:null},k=jx(x,p);if(U(k,n)){let w=g(k);return w?{el:w,strategy:"text"}:{el:k,strategy:"selector"}}let u=Fx(x,p);if(U(u,n)){let w=g(u);return w?{el:w,strategy:"text"}:{el:u,strategy:"xpath"}}let z=r();if(z)return{el:z,strategy:"text"};return{el:null,strategy:"none"}}function i(x){if(!x.isConnected)return!1;let p=bx(x);if(!p)return!1;let n=p.getComputedStyle(x);if(n.visibility==="hidden"||n.visibility==="collapse")return!1;let b=x;while(b){if(p.getComputedStyle(b).display==="none")return!1;b=b.parentElement}let o=x.getBoundingClientRect();return!(o.width===0&&o.height===0)}class R extends Error{status;constructor(x,p){super(x);this.status=p}}class N{cfg;constructor(x){this.cfg=x}url(x,p){let n=this.cfg.restUrl.replace(/\/$/,"")+x;if(p){let b=new URLSearchParams(p).toString();if(b)n+=(n.includes("?")?"&":"?")+b}return n}async request(x,p,n,b){let o=await fetch(this.url(p,b),{method:x,credentials:"same-origin",headers:{"X-WP-Nonce":this.cfg.nonce,...n!==void 0?{"Content-Type":"application/json"}:{}},body:n!==void 0?JSON.stringify(n):void 0}),r=await o.json().catch(()=>null);if(!o.ok){let g=r&&typeof r==="object"&&"message"in r?String(r.message):o.statusText;throw new R(g,o.status)}return r}listItems(x){return this.request("GET","/items",void 0,x?{page_path:x}:void 0)}getItem(x){return this.request("GET",`/items/${x}`)}createItem(x){return this.request("POST","/items",x)}updateItem(x,p){return this.request("PATCH",`/items/${x}`,p)}deleteItem(x){return this.request("DELETE",`/items/${x}`)}addComment(x,p){return this.request("POST",`/items/${x}/comments`,{body:p})}}function Q(x=window.innerWidth){if(x<768)return"mobile";if(x<=1024)return"tablet";return"desktop"}function dx(x){let p=[[/Edg\/([\d.]+)/,"Edge"],[/OPR\/([\d.]+)/,"Opera"],[/Firefox\/([\d.]+)/,"Firefox"],[/CriOS\/([\d.]+)/,"Chrome iOS"],[/Chrome\/([\d.]+)/,"Chrome"],[/Version\/([\d.]+).*Safari/,"Safari"]];for(let[n,b]of p){let o=x.match(n);if(o)return`${b} ${o[1].split(".")[0]}`}return"Unknown"}function Kx(x){let p=x.match(/(iPhone|iPad).*OS ([\d_]+)/);if(p)return`iOS ${p[2].replace(/_/g,".")}`;if(p=x.match(/Android ([\d.]+)/),p)return`Android ${p[1]}`;if(p=x.match(/Windows NT ([\d.]+)/),p)return p[1]==="10.0"?"Windows 10/11":`Windows NT ${p[1]}`;if(p=x.match(/Mac OS X ([\d_]+)/),p)return`macOS ${p[1].replace(/_/g,".")}`;if(/CrOS/.test(x))return"ChromeOS";if(/Linux/.test(x))return"Linux";return"Unknown"}var G=null;function P(){let x=navigator.userAgentData;if(!x)return;x.getHighEntropyValues(["platform","platformVersion"]).then(({platform:p,platformVersion:n})=>{if(!p||!n)return;let[b,o]=n.split(".");if(p==="macOS")G=`macOS ${b}.${o??"0"}`;else if(p==="Windows")G=Number(b)>=13?"Windows 11":"Windows 10";else if(p==="Android"||p==="Chrome OS"||p==="Linux")G=`${p} ${n}`.trim()}).catch(()=>{})}function S(x){let p=navigator.userAgent;return{viewport_w:window.innerWidth,viewport_h:window.innerHeight,dpr:Math.round((window.devicePixelRatio||1)*100)/100,breakpoint:Q(),browser:dx(p),os:G??Kx(p),user_agent:p,post_id:x.page.postId,post_type:x.page.postType,theme:x.page.theme,js_errors:(window.__fbcErrors??[]).slice(-20)}}function E(x){let p=window.location.pathname,n=x.replace(/\/$/,"");if(n&&p.startsWith(n))p=p.slice(n.length);return p="/"+p.replace(/^\/+/,""),p==="/"?"/":p.replace(/\/?$/,"/")}function T(){let x=new URLSearchParams(window.location.search);return x.delete("fbc_item"),x.toString()}function y(){if(window.__fbcErrors)return;let x=window.__fbcErrors=[],p=(n)=>{if(x.push(n.slice(0,500)),x.length>20)x.shift()};window.addEventListener("error",(n)=>{if(n.message)p(`${n.message}${n.filename?` (${n.filename}:${n.lineno})`:""}`)}),window.addEventListener("unhandledrejection",(n)=>{let b=n.reason;p(`Unhandled rejection: ${b instanceof Error?b.message:String(b)}`)})}function f(x,p={},...n){let b=document.createElement(x);for(let[o,r]of Object.entries(p)){if(r===null||r===void 0||r===!1)continue;if(o.startsWith("on")&&typeof r==="function")b.addEventListener(o.slice(2).toLowerCase(),r);else if(o==="text")b.textContent=String(r);else if(o==="value"&&"value"in b)b.value=String(r);else if(r===!0)b.setAttribute(o,"");else b.setAttribute(o,String(r))}for(let o of n){if(o===null||o===void 0||o===!1)continue;b.append(typeof o==="number"?String(o):o)}return b}function Z(x,p,n,b={}){let o=f("select",{name:x,...b});for(let[r,g]of p){let k=f("option",{value:r,text:g});if(r===n)k.selected=!0;o.append(k)}return o}function q(x){let p=new Date(x).getTime();if(Number.isNaN(p))return"";let n=Math.round((Date.now()-p)/1000);if(n<60)return"just now";let b=Math.round(n/60);if(b<60)return`${b}m ago`;let o=Math.round(b/60);if(o<24)return`${o}h ago`;let r=Math.round(o/24);if(r<30)return`${r}d ago`;return new Date(x).toLocaleDateString()}var d=["bug","tweak","change","comment"],m="fbc:mode";class V{cfg;api;host;root;pinsLayer;outline;outlineTag;toolbar=null;sidebar=null;card=null;hintEl=null;bannerEl=null;mode=!1;showResolved=!1;pinMode=null;states=new Map;allItems=null;filters={scope:"page",type:"",status:"unresolved",mine:!1};pagePath;framePending=!1;refreshTimer=0;lastWidth=window.innerWidth;mutationObserver=null;loaded=!1;constructor(x){this.cfg=x;this.api=new N(x),this.pagePath=x.pagePath??E(x.homePath)}init(){this.mount(),this.bindGlobalEvents(),this.bindAdminBar();let x=!1;try{x=window.localStorage.getItem(m)==="1"}catch{x=!1}if(this.cfg.openItem||x)this.setMode(!0)}mount(){this.host=f("div",{id:Y}),this.host.setAttribute("style","all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;");let x=this.host.attachShadow({mode:"open"});x.append(f("style",{text:D})),this.root=f("div",{class:"fbc"});let p=this.cfg.brand;if(p){let b=[["--primary",p.primary],["--on-primary",p.onPrimary],["--dark",p.dark],["--on-dark",p.onDark],["--brand-accent",p.accent],["--ink-primary",p.ink??""]];for(let[o,r]of b)if(r)this.root.style.setProperty(o,r)}let n=f("div",{class:"layer"});this.outlineTag=f("span",{class:"outline-tag"}),this.outline=f("div",{class:"outline"},this.outlineTag),this.pinsLayer=f("div"),n.append(this.outline,this.pinsLayer),this.root.append(n),x.append(this.root),document.body.append(this.host)}inOverlay(x){return x.composedPath().includes(this.host)}bindGlobalEvents(){document.addEventListener("contextmenu",(x)=>this.onContextMenu(x),!0),document.addEventListener("mousemove",(x)=>this.onMouseMove(x),{capture:!0,passive:!0});for(let x of["pointerdown","mousedown","mouseup","click"])document.addEventListener(x,(p)=>this.onPinModeEvent(p),!0);document.addEventListener("mousedown",(x)=>this.onOutsideMouseDown(x),!1),document.addEventListener("keydown",(x)=>this.onKeyDown(x),!0),window.addEventListener("scroll",()=>this.schedulePosition(),{passive:!0,capture:!0}),window.addEventListener("resize",()=>{let x=window.innerWidth!==this.lastWidth;if(this.lastWidth=window.innerWidth,x)this.scheduleRefresh(80);else this.schedulePosition()})}bindAdminBar(){document.querySelector("#wp-admin-bar-fbc-toggle > a")?.addEventListener("click",(p)=>{p.preventDefault(),this.setMode(!this.mode)})}async setMode(x){this.mode=x;try{window.localStorage.setItem(m,x?"1":"0")}catch{}if(document.querySelector("#wp-admin-bar-fbc-toggle")?.classList.toggle("fbc-on",x),!x){this.exitPinMode(),this.closeCard(),this.closeSidebar(),this.hideOutline(),this.toolbar?.remove(),this.toolbar=null,this.bannerEl?.remove(),this.bannerEl=null,this.pinsLayer.replaceChildren();for(let p of this.states.values())p.pin=null;this.mutationObserver?.disconnect();return}if(this.renderToolbar(),this.observeMutations(),!this.loaded)await this.loadItems();else this.refresh();if(this.cfg.openItem){let p=this.cfg.openItem;this.cfg.openItem=0,this.stripDeepLinkParam(),this.openDeepLink(p)}}stripDeepLinkParam(){let x=new URL(window.location.href);if(x.searchParams.has("fbc_item"))x.searchParams.delete("fbc_item"),window.history.replaceState(window.history.state,"",x.toString())}async loadItems(){try{let{items:x}=await this.api.listItems(this.pagePath);this.states.clear();for(let p of x)this.states.set(p.id,{item:p,el:null,placement:"orphan",pin:null});this.loaded=!0,this.refresh()}catch(x){this.toast(`Could not load feedback: ${x.message}`,!0)}}upsert(x){let p=this.states.get(x.id);if(p)p.item=x;else this.states.set(x.id,{item:x,el:null,placement:"orphan",pin:null});if(this.allItems){let n=this.allItems.findIndex((b)=>b.id===x.id);if(n>=0)this.allItems[n]=x;else this.allItems.push(x)}}remove(x){if(this.states.get(x)?.pin?.remove(),this.states.delete(x),this.allItems)this.allItems=this.allItems.filter((n)=>n.id!==x)}refresh(){for(let x of this.states.values()){if(!x.item.anchor){x.el=null,x.placement="note";continue}let p=x.el&&x.el.isConnected?x.el:O(x.item.anchor).el;x.el=p,x.placement=!p?"orphan":i(p)?"pinned":"hidden"}if(this.drawPins(),this.updateToolbarCount(),this.sidebar)this.renderSidebarList()}drawPins(){if(!this.mode)return;for(let x of this.states.values()){if(!(x.placement==="pinned"&&(this.showResolved||x.item.status!=="resolved"))){x.pin?.remove(),x.pin=null;continue}if(!x.pin){let o=f("button",{class:"pin",type:"button","aria-label":`Feedback #${x.item.id}: ${x.item.title}`,onclick:(r)=>{r.stopPropagation(),this.openPopover(x.item.id)}});x.pin=o,this.pinsLayer.append(o)}let n=x.item.status==="resolved",b=x.pin.classList.contains("pulse");x.pin.className=`pin ${x.item.type}${n?" resolved":""}${b?" pulse":""}`,x.pin.textContent=n?"✓":String(x.item.id),x.pin.title=`#${x.item.id} ${x.item.title}`}this.positionPins()}schedulePosition(){if(this.framePending||!this.mode)return;this.framePending=!0,requestAnimationFrame(()=>{this.framePending=!1,this.positionPins()})}scheduleRefresh(x=250){window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.mode&&this.refresh(),x)}positionPins(){for(let x of this.states.values()){if(!x.pin||!x.el||!x.item.anchor)continue;let p=x.el.getBoundingClientRect(),n=p.left+x.item.anchor.offsetX*p.width,b=p.top+x.item.anchor.offsetY*p.height;x.pin.style.transform=`translate(${Math.round(n)}px, ${Math.round(b)}px)`}}observeMutations(){if(!this.mutationObserver)this.mutationObserver=new MutationObserver((x)=>{if(x.every((p)=>p.target===this.host||this.host.contains(p.target)))return;this.schedulePosition(),this.scheduleRefresh(300)});this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden","open"]})}onContextMenu(x){if(!this.mode||x.altKey||this.inOverlay(x))return;let p=this.eventTarget(x);if(!p)return;x.preventDefault(),x.stopPropagation(),this.exitPinMode(),this.openTypeMenu(p,x.clientX,x.clientY)}onPinModeEvent(x){if(!this.pinMode||this.inOverlay(x)||x.button!==0)return;if(x.preventDefault(),x.stopImmediatePropagation(),x.type!=="click")return;let p=this.eventTarget(x),n=this.pinMode;if(this.exitPinMode(),p)n.done(p,x.clientX,x.clientY)}onOutsideMouseDown(x){if(this.card&&!this.inOverlay(x))this.closeCard()}onMouseMove(x){if(!this.mode||this.card&&!this.pinMode||this.inOverlay(x)){if(!this.pinMode)this.hideOutline();return}let p=this.eventTarget(x);if(!p||p===document.documentElement||p===document.body){this.hideOutline();return}let n=p.getBoundingClientRect();Object.assign(this.outline.style,{left:`${n.left}px`,top:`${n.top}px`,width:`${n.width}px`,height:`${n.height}px`});let b=p.id?`#${p.id}`:"";this.outlineTag.textContent=`${p.tagName.toLowerCase()}${b}`,this.outline.classList.add("on")}onKeyDown(x){let p=x.composedPath()[0],n=p instanceof HTMLElement&&(p.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(p.tagName));if(x.altKey&&x.shiftKey&&x.code==="KeyF"&&!n){x.preventDefault(),this.setMode(!this.mode);return}if(x.key==="Escape"&&this.mode){if(this.pinMode)this.exitPinMode(),x.preventDefault();else if(this.card)this.closeCard(),x.preventDefault();else if(this.sidebar)this.closeSidebar(),x.preventDefault()}}eventTarget(x){let p=x.target;if(p instanceof Element)return p;if(p instanceof Node)return p.parentElement;return null}hideOutline(){this.outline.classList.remove("on")}enterPinMode(x){this.closeCard(),this.pinMode=x,this.hintEl?.remove(),this.hintEl=f("div",{class:"crosshair-hint",text:`${x.hint} · Esc to cancel`}),this.root.append(this.hintEl),document.documentElement.style.cursor="crosshair",this.renderToolbar()}exitPinMode(){if(!this.pinMode)return;this.pinMode=null,this.hintEl?.remove(),this.hintEl=null,document.documentElement.style.cursor="",this.hideOutline(),this.renderToolbar()}assigneeOptions(){return[["0","Unassigned"],...this.cfg.assignees.people.map((x)=>[String(x.id),x.name])]}assigneeLabel(){return this.cfg.assignees.source==="teamwork"?"Assignee (Teamwork)":"Assignee"}safeAnchor(x,p,n){try{return I(x,p,n)}catch{return this.toast("Can't pin to that element. Try its container, or add a page note.",!0),null}}closeCard(){this.card?.remove(),this.card=null}showCard(x,p,n){this.closeCard(),this.hideOutline(),this.card=x,x.style.left="0px",x.style.top="0px",x.style.visibility="hidden",this.root.append(x);let{offsetWidth:b,offsetHeight:o}=x,r=Math.max(12,Math.min(p+8,window.innerWidth-b-12)),g=Math.max(12,Math.min(n+8,window.innerHeight-o-12));x.style.left=`${r}px`,x.style.top=`${g}px`,x.style.visibility=""}openTypeMenu(x,p,n){let b=this.cfg.labels.type,o=(k)=>this.openComposer(k,x,p,n),r=d.map((k,u)=>f("button",{type:"button",onclick:()=>o(k)},f("span",{class:`dot ${k}`}),b[k],f("kbd",{text:String(u+1)}))),g=f("div",{class:"card menu",role:"menu",onkeydown:(k)=>{let u=k.key,z=Number(u);if(z>=1&&z<=d.length)k.preventDefault(),o(d[z-1])}},f("div",{class:"menu-title",text:"Add feedback"}),...r,f("hr"),f("button",{type:"button",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},"Note for the whole page"));this.showCard(g,p,n),r[0].focus()}openComposer(x,p,n,b){let o=null;if(p){if(o=this.safeAnchor(p,n,b),!o)return}let r=this.cfg.labels,g=Z("type",d.map((J)=>[J,r.type[J]]),x),k=f("input",{type:"text",name:"title",maxlength:255,required:!0,placeholder:"What needs attention?",autocomplete:"off"}),u=f("textarea",{name:"description",placeholder:"Details, steps to reproduce, what you expected… (optional)"}),z=Z("priority",Object.keys(r.priority).map((J)=>[J,r.priority[J]]),"medium"),w=Z("assignee_id",this.assigneeOptions(),"0"),W=f("div",{class:"error",role:"alert"}),$=f("button",{class:"btn primary",type:"submit",text:"Add"}),M=f("form",{class:"card composer",novalidate:!0,onsubmit:(J)=>{J.preventDefault(),K()}},f("div",{class:"head"},f("span",{class:"chip"},f("span",{class:`dot ${x}`}),p?`<${p.tagName.toLowerCase()}>`:"Whole page"),f("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),f("label",{class:"field"},f("span",{text:"Title"}),k),W,f("label",{class:"field"},f("span",{text:"Description"}),u),f("div",{class:"row"},f("label",{class:"field"},f("span",{text:"Type"}),g),f("label",{class:"field"},f("span",{text:"Priority"}),z)),f("label",{class:"field"},f("span",{text:this.assigneeLabel()}),w),f("div",{class:"actions"},f("button",{class:"btn link",type:"button",text:"Cancel",onclick:()=>this.closeCard()}),$)),K=async()=>{if(!k.value.trim()){W.textContent="Add a short title.",k.focus();return}$.disabled=!0;try{let J=await this.api.createItem({type:g.value,title:k.value.trim(),description:u.value,priority:z.value,assignee_id:Number(w.value),page_path:this.pagePath,page_query:T(),page_title:document.title,anchor:o,context:S(this.cfg)});this.closeCard(),this.upsert(J);let H=this.states.get(J.id);if(H&&p)H.el=p;this.refresh(),this.toast(`Added #${J.id}`)}catch(J){W.textContent=J.message,$.disabled=!1}};this.showCard(M,n,b),k.focus()}async openPopover(x,p){let n;try{n=await this.api.getItem(x)}catch(v){this.toast(v.message,!0);return}this.upsert(n);let b=this.cfg.labels,o=this.states.get(x),r=o?.pin?.getBoundingClientRect(),g=p?.x??(r?r.right:window.innerWidth/2-170),k=p?.y??(r?r.top:100),u=async(v)=>{try{let B=await this.api.updateItem(x,v);this.upsert(B),this.refresh(),this.openPopover(x,{x:parseFloat(j.style.left)-8,y:parseFloat(j.style.top)-8})}catch(B){this.toast(B.message,!0)}},z=Z("status",Object.keys(b.status).map((v)=>[v,b.status[v]]),n.status,{onchange:()=>void u({status:z.value})}),w=Z("assignee_id",this.assigneeOptions(),String(n.assignee_id),{onchange:()=>void u({assignee_id:Number(w.value)})}),W=Z("priority",Object.keys(b.priority).map((v)=>[v,b.priority[v]]),n.priority,{onchange:()=>void u({priority:W.value})}),$=f("textarea",{placeholder:"Reply…",rows:2}),M=f("ul",{class:"thread"},...(n.comments??[]).map((v)=>f("li",{class:v.kind},f("span",{class:"who",text:v.user_name}),f("span",{class:"when",text:q(v.created_at)}),f("div",{class:"body",text:v.body})))),K=Q(),J=n.breakpoint&&n.breakpoint!==K?f("div",{class:"notice",text:`Logged at ${n.breakpoint} (${n.context?.viewport_w??"?"}px). You are on ${K} (${window.innerWidth}px).`}):null,H=o?.placement==="orphan"?f("div",{class:"notice",text:"The element this was pinned to can’t be found on the page anymore. Re-anchor it."}):null,j=f("div",{class:"card popover",role:"dialog","aria-label":`Feedback #${n.id}`},f("div",{class:"head"},f("span",{class:"chip"},f("span",{class:`dot ${n.type}`}),`${b.type[n.type]} #${n.id}`),f("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),f("div",{class:"t",style:"font-weight:700;font-size:15px;margin-bottom:4px",text:n.title}),f("div",{class:"meta",text:`${n.reporter_name} · ${q(n.created_at)}${n.breakpoint?` · ${n.breakpoint}`:""}`}),n.tw_task_url?f("div",{class:"meta"},f("a",{href:n.tw_task_url,target:"_blank",rel:"noopener",text:`Teamwork task #${n.tw_task_id} ↗`}),n.status==="resolved"?" · completed":" · status syncs from Teamwork"):null,J,H,n.description?f("p",{class:"desc",text:n.description}):null,f("div",{class:"row"},f("label",{class:"field"},f("span",{text:"Status"}),z),f("label",{class:"field"},f("span",{text:"Priority"}),W)),n.assignee_locked?f("div",{class:"field"},f("span",{text:this.assigneeLabel()}),f("div",{text:n.assignee_name||"Unassigned"}),f("div",{class:"meta",text:"In Teamwork now: change the assignee there."})):f("label",{class:"field"},f("span",{text:this.assigneeLabel()}),w),M,f("label",{class:"field"},$),f("div",{class:"actions"},n.anchor||o?.placement==="note"?f("button",{class:"btn link left",type:"button",text:"Re-anchor",onclick:()=>this.reanchor(n.id)}):null,f("a",{class:"btn link",href:`${this.cfg.adminUrl}&item=${n.id}`,target:"_blank",rel:"noopener",text:"Admin"}),n.can_delete?f("button",{class:"btn danger",type:"button",text:"Delete",onclick:()=>void this.deleteItem(n.id)}):null,f("button",{class:"btn primary",type:"button",text:"Reply",onclick:async()=>{if(!$.value.trim())return;try{await this.api.addComment(n.id,$.value),this.openPopover(x,{x:parseFloat(j.style.left)-8,y:parseFloat(j.style.top)-8})}catch(v){this.toast(v.message,!0)}}})));this.showCard(j,g,k)}reanchor(x){this.enterPinMode({hint:`Click the element #${x} belongs to`,done:async(p,n,b)=>{try{let o=this.safeAnchor(p,n,b);if(!o)return;let r=await this.api.updateItem(x,{anchor:o});this.upsert(r);let g=this.states.get(x);if(g)g.el=p;this.refresh(),this.toast(`Re-anchored #${x}`)}catch(o){this.toast(o.message,!0)}}})}async deleteItem(x){if(!window.confirm(`Delete feedback #${x}? This can’t be undone.`))return;try{await this.api.deleteItem(x),this.closeCard(),this.remove(x),this.refresh(),this.toast(`Deleted #${x}`)}catch(p){this.toast(p.message,!0)}}async openDeepLink(x){let p=this.states.get(x);if(p?.el&&p.placement==="pinned")p.el.scrollIntoView({block:"center",behavior:"auto"}),await new Promise((b)=>requestAnimationFrame(()=>b(null))),this.positionPins(),p.pin?.classList.add("pulse");let n=p?.item;if(n?.breakpoint&&n.breakpoint!==Q())this.showBanner(`#${x} was logged at ${n.breakpoint} (${n.context?.viewport_w??"?"}px wide). You're viewing at ${Q()} (${window.innerWidth}px). Resize to reproduce.`);await this.openPopover(x)}unresolvedCount(){let x=0;for(let p of this.states.values())if(p.item.status!=="resolved")x++;return x}renderToolbar(){if(!this.mode)return;let x=this.unresolvedCount(),p=f("div",{class:"toolbar",role:"toolbar","aria-label":this.cfg.brand?.name??"Feedback"},this.cfg.brand?.logo?f("span",{class:"brand",title:this.cfg.brand.name},f("img",{src:this.cfg.brand.logo,alt:this.cfg.brand.name})):f("span",{class:"brand",text:this.cfg.brand?.label??"Feedback"}),f("button",{type:"button",class:this.pinMode?"on":"",title:"Click an element to pin feedback (or right-click anywhere)",text:"+ Add",onclick:()=>this.pinMode?this.exitPinMode():this.enterPinMode({hint:"Click any element to add feedback",done:(n,b,o)=>this.openTypeMenu(n,b,o)})}),f("button",{type:"button",text:"Page note",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)}),f("button",{type:"button",class:this.sidebar?"on":"",onclick:()=>this.sidebar?this.closeSidebar():this.openSidebar()},f("span",{class:"label",text:"List"}),x?f("span",{class:"count",text:String(x)}):null),f("button",{type:"button",class:this.showResolved?"on":"",title:"Show resolved pins",text:"✓ Resolved",onclick:()=>{this.showResolved=!this.showResolved,this.drawPins(),this.renderToolbar()}}),f("button",{type:"button",title:"Exit Feedback mode (Alt+Shift+F)","aria-label":"Exit Feedback mode",text:"×",onclick:()=>void this.setMode(!1)}));if(this.toolbar)this.toolbar.replaceWith(p);else this.root.append(p);this.toolbar=p}updateToolbarCount(){this.renderToolbar()}openSidebar(){this.sidebar?.remove();let x=this.filters,p=this.cfg.labels,n=Z("scope",[["page","This page"],["all","All pages"]],x.scope,{onchange:()=>{x.scope=n.value,this.renderSidebarList()}}),b=Z("type",[["","All types"],...d.map((g)=>[g,p.type[g]])],x.type,{onchange:()=>{x.type=b.value,this.renderSidebarList()}}),o=Z("status",[["unresolved","Unresolved"],["","Any status"],...Object.keys(p.status).map((g)=>[g,p.status[g]])],x.status,{onchange:()=>{x.status=o.value,this.renderSidebarList()}}),r=f("input",{type:"checkbox",onchange:()=>{x.mine=r.checked,this.renderSidebarList()}});r.checked=x.mine,this.sidebar=f("div",{class:"sidebar",role:"complementary","aria-label":"Feedback list"},f("header",{},f("h2",{},this.cfg.brand?.label??"Feedback",f("button",{class:"x",type:"button","aria-label":"Close list",text:"×",onclick:()=>this.closeSidebar()})),f("div",{class:"filters"},n,b,o,f("span"),f("label",{},r,"Assigned to me"))),f("div",{class:"list"})),this.root.append(this.sidebar),this.renderToolbar(),this.renderSidebarList()}closeSidebar(){this.sidebar?.remove(),this.sidebar=null,this.renderToolbar()}matches(x){let p=this.filters;if(p.type&&x.type!==p.type)return!1;if(p.status==="unresolved"&&x.status==="resolved")return!1;if(p.status&&p.status!=="unresolved"&&x.status!==p.status)return!1;if(p.mine&&(!this.cfg.assignees.me||x.assignee_id!==this.cfg.assignees.me))return!1;return!0}async renderSidebarList(){let x=this.sidebar?.querySelector(".list");if(!x)return;let p=(o,r,g)=>f("button",{class:"entry",type:"button",onclick:r},f("span",{class:`num ${o.status==="resolved"?"resolved":o.type}`,text:`#${o.id}`}),f("span",{},f("span",{class:"t",text:o.title}),f("span",{class:"s",text:`${this.cfg.labels.status[o.status]}${o.assignee_name?` · ${o.assignee_name}`:""}${o.breakpoint?` · ${o.breakpoint}`:""}`})),g??null);if(this.filters.scope==="all"){if(!this.allItems){x.replaceChildren(f("div",{class:"empty",text:"Loading…"}));try{this.allItems=(await this.api.listItems()).items}catch(g){x.replaceChildren(f("div",{class:"empty",text:g.message}));return}}let o=new Map;for(let g of this.allItems.filter((k)=>this.matches(k))){let k=o.get(g.page_path)??[];k.push(g),o.set(g.page_path,k)}let r=[];for(let[g,k]of o){r.push(f("h3",{text:g===this.pagePath?`${g} (this page)`:g}));for(let u of k)r.push(p(u,()=>{if(u.page_path===this.pagePath)this.focusItem(u.id);else{let z=new URL(u.page_url,window.location.origin);z.searchParams.set("fbc_item",String(u.id)),window.location.href=z.toString()}}))}x.replaceChildren(...r.length?r:[f("div",{class:"empty",text:"Nothing matches these filters."})]);return}let n={pinned:{title:"On this page",nodes:[]},note:{title:"Page notes",nodes:[]},hidden:{title:"At other breakpoints",nodes:[]},orphan:{title:"Orphaned — element not found",nodes:[]}};for(let o of[...this.states.values()].sort((r,g)=>r.item.id-g.item.id)){if(!this.matches(o.item))continue;let r=o.placement==="orphan"?f("span",{class:"btn link reanchor",role:"button",text:"Re-anchor",onclick:(g)=>{g.stopPropagation(),this.reanchor(o.item.id)}}):null;n[o.placement].nodes.push(p(o.item,()=>this.focusItem(o.item.id),r))}let b=[];for(let o of["pinned","note","hidden","orphan"]){let r=n[o];if(!r.nodes.length)continue;let g=o==="hidden"?`${r.nodes.length} at other breakpoints`:r.title;b.push(f("h3",{text:g}),...r.nodes)}x.replaceChildren(...b.length?b:[f("div",{class:"empty",text:"No feedback on this page yet. Right-click anything to add some."})])}focusItem(x){let p=this.states.get(x);if(!p)return;if(p.placement==="pinned"&&p.el){if(p.item.status==="resolved"&&!this.showResolved)this.showResolved=!0,this.drawPins();p.el.scrollIntoView({block:"center",behavior:"smooth"}),window.setTimeout(()=>{this.positionPins(),p.pin?.classList.remove("pulse"),p.pin?.offsetWidth,p.pin?.classList.add("pulse"),this.openPopover(x)},450)}else this.openPopover(x,{x:window.innerWidth-720,y:80})}toast(x,p=!1){let n=f("div",{class:`toast${p?" err":""}`,role:"status",text:x});this.root.append(n),window.setTimeout(()=>n.remove(),p?5000:2200)}showBanner(x){this.bannerEl?.remove(),this.bannerEl=f("div",{class:"banner",role:"status"},f("span",{text:x}),f("button",{type:"button",text:"Dismiss",onclick:()=>{this.bannerEl?.remove(),this.bannerEl=null}})),this.root.append(this.bannerEl)}}y();P();function t(){let x=window.fbcConfig;if(!x||window.self!==window.top)return;new V(x).init()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",t,{once:!0});else t();})();
