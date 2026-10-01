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
`;var Y="fbc-root";var c=["ember","react-","__next","radix-","headlessui-","mui-","yui_","ext-gen"],s=/[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i,h=/^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;function e(p){let x=/[a-z]/i.test(p),n=/[0-9]/.test(p);if(!x||!n)return!1;if(p.length>=6&&/^[0-9a-f]+$/i.test(p))return!0;return p.length>=8&&/^[0-9a-z]+$/i.test(p)&&pp(p)>=2}function pp(p){let x=0;for(let n=1;n<p.length;n++){let b=/[0-9]/.test(p.charAt(n-1)),o=/[0-9]/.test(p.charAt(n));if(b!==o)x++}return x}function xp(p){if(p.trim()===""||/\s/.test(p))return!1;if(/^[0-9]/.test(p))return!1;if(/[0-9]{5,}/.test(p))return!1;if(s.test(p))return!1;if(h.test(p))return!1;let x=p.toLowerCase();if(c.some((n)=>x.startsWith(n)))return!1;return!p.split(/[-_:.]/).some(e)}function np(p){let x="",n=p.length,b=p.charCodeAt(0);for(let o=0;o<n;o++){let r=p.charCodeAt(o),g=p.charAt(o);if(r===0)x+="�";else if(r>=1&&r<=31||r===127||o===0&&r>=48&&r<=57||o===1&&r>=48&&r<=57&&b===45)x+=`\\${r.toString(16)} `;else if(o===0&&n===1&&r===45)x+=`\\${g}`;else if(r>=128||r===45||r===95||r>=48&&r<=57||r>=65&&r<=90||r>=97&&r<=122)x+=g;else x+=`\\${g}`}return x}function C(p,x){let n=x?x.CSS:void 0,b=globalThis.CSS,o=n?.escape??b?.escape;return o?o(p):np(p)}function op(p){return p.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}function F(p){return p.localName.toLowerCase()}function bp(p){return p.ownerDocument.defaultView}function fp(p){if(!p)return{x:0,y:0};let x=Number.isFinite(p.scrollX)?p.scrollX:0,n=Number.isFinite(p.scrollY)?p.scrollY:0;return{x,y:n}}function X(p){if(!Number.isFinite(p))return 0.5;return Math.min(1,Math.max(0,p))}function L(p){let x=p;while(x){if(x.id==="fbc-root")return!0;if(x.parentElement)x=x.parentElement;else{let n=x.getRootNode();x=n instanceof ShadowRoot?n.host:null}}return!1}function a(p){if(p===null)return null;let x=p.replace(/\s+/g," ").trim();if(x==="")return null;let n=Array.from(x);return n.length>120?n.slice(0,120).join(""):x}var rp=/^fl-node-(?!content$)[a-z0-9]+$/i,gp=/^[a-z0-9]+$/i;function _(p){let x=1,n=p.previousElementSibling;while(n){if(n.localName===p.localName&&n.namespaceURI===p.namespaceURI)x++;n=n.previousElementSibling}return x}function i(p,x){if(!p.id||!xp(p.id))return null;let n=`#${C(p.id,x.defaultView)}`,b=x.querySelectorAll(n);return b.length===1&&b[0]===p?n:null}function kp(p,x){if(p===x.documentElement)return"html";let n=p.localName,b=p.getAttribute("data-id");if(b!==null&&p.classList.contains("elementor-element")&&gp.test(b))return`${n}[data-id="${op(b)}"]`;let o=Array.from(p.classList).find((r)=>rp.test(r));if(o!==void 0)return`${n}.${C(o,x.defaultView)}`;return`${n}:nth-of-type(${_(p)})`}function up(p,x,n){let b=n.querySelectorAll(p);return b.length===1&&b[0]===x}function zp(p,x){let n=[],b=p;while(b){let o=i(b,x);if(o!==null)return n.unshift(o),n.join(" > ");n.unshift(kp(b,x));let r=n.join(" > ");if(up(r,p,x))return r;b=b.parentElement}return n.join(" > ")}function wp(p,x){let n=[],b=p;while(b){let o=F(b),r=b.parentElement,g=b===x.documentElement||r===x.documentElement&&(o==="head"||o==="body");n.unshift(g?o:`${o}[${_(b)}]`),b=r}return`/${n.join("/")}`}var vp=/^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i,Jp=/^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;function Wp(p,x){if(!vp.test(p))return null;let n=p.slice(1).split("/"),b=null;for(let o of n){let r=Jp.exec(o);if(!r)return null;let g=(r[1]??"").toLowerCase(),k=r[2]===void 0?1:Number(r[2]),u=b?Array.from(b.children):x.documentElement?[x.documentElement]:[],w=0,v=null;for(let W of u){if(F(W)!==g)continue;if(w++,w===k){v=W;break}}if(!v)return null;b=v}return b}function A(p,x,n){if(!Number.isFinite(x)||!Number.isFinite(n))throw RangeError(`createAnchor: click coordinates must be finite (got ${x}, ${n})`);if(!p.isConnected)throw Error("createAnchor: element is not connected to a document");if(L(p))throw Error("createAnchor: refusing to anchor an element inside #fbc-root");let b=p.ownerDocument;if(p.getRootNode()!==b)throw Error("createAnchor: element is inside a shadow root; anchor its shadow host instead");let o=p.getBoundingClientRect(),r=fp(b.defaultView),g=o.width>0?X((x-o.left)/o.width):0.5,k=o.height>0?X((n-o.top)/o.height):0.5;return{id:i(p,b)!==null?p.id:null,selector:zp(p,b),xpath:wp(p,b),text:a(p.textContent),tag:F(p),offsetX:g,offsetY:k,docX:x+r.x,docY:n+r.y}}function U(p,x){return p!==null&&F(p)===x&&!L(p)}function Zp(p){return p instanceof DOMException||p instanceof Error&&p.name==="SyntaxError"}function $p(p,x){if(typeof p.id!=="string"||p.id==="")return null;let n=x.getElementById(p.id);if(!n)return null;return x.querySelectorAll(`#${C(p.id,x.defaultView)}`).length===1?n:null}function jp(p,x){if(typeof p.selector!=="string"||p.selector.trim()==="")return null;let n;try{n=x.querySelectorAll(p.selector)}catch(b){if(Zp(b))return null;throw b}return n.length===1?n[0]??null:null}function Fp(p,x){if(typeof p.xpath!=="string")return null;return Wp(p.xpath,x)}function Qp(p,x){if(typeof p.text!=="string"||p.text==="")return null;let n=null;for(let b of Array.from(x.getElementsByTagName("*"))){if(F(b)!==p.tag||L(b))continue;if(a(b.textContent)!==p.text)continue;if(n)return null;n=b}return n}function I(p,x=document){if(typeof p.tag!=="string"||p.tag==="")return{el:null,strategy:"none"};let n=p.tag.toLowerCase(),b=$p(p,x);if(U(b,n))return{el:b,strategy:"id"};let o,r=()=>{if(o===void 0)o=Qp({...p,tag:n},x);return U(o,n)?o:null},g=(v)=>{if(p.text===null||a(v.textContent)===p.text)return null;let W=r();return W&&W!==v?W:null},k=jp(p,x);if(U(k,n)){let v=g(k);return v?{el:v,strategy:"text"}:{el:k,strategy:"selector"}}let u=Fp(p,x);if(U(u,n)){let v=g(u);return v?{el:v,strategy:"text"}:{el:u,strategy:"xpath"}}let w=r();if(w)return{el:w,strategy:"text"};return{el:null,strategy:"none"}}function O(p){if(!p.isConnected)return!1;let x=bp(p);if(!x)return!1;let n=x.getComputedStyle(p);if(n.visibility==="hidden"||n.visibility==="collapse")return!1;let b=p;while(b){if(x.getComputedStyle(b).display==="none")return!1;b=b.parentElement}let o=p.getBoundingClientRect();return!(o.width===0&&o.height===0)}class R extends Error{status;constructor(p,x){super(p);this.status=x}}class N{cfg;constructor(p){this.cfg=p}url(p,x){let n=this.cfg.restUrl.replace(/\/$/,"")+p;if(x){let b=new URLSearchParams(x).toString();if(b)n+=(n.includes("?")?"&":"?")+b}return n}async request(p,x,n,b){let o=await fetch(this.url(x,b),{method:p,credentials:"same-origin",headers:{"X-WP-Nonce":this.cfg.nonce,...n!==void 0?{"Content-Type":"application/json"}:{}},body:n!==void 0?JSON.stringify(n):void 0}),r=await o.json().catch(()=>null);if(!o.ok){let g=r&&typeof r==="object"&&"message"in r?String(r.message):o.statusText;throw new R(g,o.status)}return r}listItems(p){return this.request("GET","/items",void 0,p?{page_path:p}:void 0)}getItem(p){return this.request("GET",`/items/${p}`)}createItem(p){return this.request("POST","/items",p)}updateItem(p,x){return this.request("PATCH",`/items/${p}`,x)}deleteItem(p){return this.request("DELETE",`/items/${p}`)}addComment(p,x){return this.request("POST",`/items/${p}/comments`,{body:x})}}function Q(p=window.innerWidth){if(p<768)return"mobile";if(p<=1024)return"tablet";return"desktop"}function dp(p){let x=[[/Edg\/([\d.]+)/,"Edge"],[/OPR\/([\d.]+)/,"Opera"],[/Firefox\/([\d.]+)/,"Firefox"],[/CriOS\/([\d.]+)/,"Chrome iOS"],[/Chrome\/([\d.]+)/,"Chrome"],[/Version\/([\d.]+).*Safari/,"Safari"]];for(let[n,b]of x){let o=p.match(n);if(o)return`${b} ${o[1].split(".")[0]}`}return"Unknown"}function Kp(p){let x=p.match(/(iPhone|iPad).*OS ([\d_]+)/);if(x)return`iOS ${x[2].replace(/_/g,".")}`;if(x=p.match(/Android ([\d.]+)/),x)return`Android ${x[1]}`;if(x=p.match(/Windows NT ([\d.]+)/),x)return x[1]==="10.0"?"Windows 10/11":`Windows NT ${x[1]}`;if(x=p.match(/Mac OS X ([\d_]+)/),x)return`macOS ${x[1].replace(/_/g,".")}`;if(/CrOS/.test(p))return"ChromeOS";if(/Linux/.test(p))return"Linux";return"Unknown"}var G=null;function P(){let p=navigator.userAgentData;if(!p)return;p.getHighEntropyValues(["platform","platformVersion"]).then(({platform:x,platformVersion:n})=>{if(!x||!n)return;let[b,o]=n.split(".");if(x==="macOS")G=`macOS ${b}.${o??"0"}`;else if(x==="Windows")G=Number(b)>=13?"Windows 11":"Windows 10";else if(x==="Android"||x==="Chrome OS"||x==="Linux")G=`${x} ${n}`.trim()}).catch(()=>{})}function S(p){let x=navigator.userAgent;return{viewport_w:window.innerWidth,viewport_h:window.innerHeight,dpr:Math.round((window.devicePixelRatio||1)*100)/100,breakpoint:Q(),browser:dp(x),os:G??Kp(x),user_agent:x,post_id:p.page.postId,post_type:p.page.postType,theme:p.page.theme,js_errors:(window.__fbcErrors??[]).slice(-20)}}function E(p){let x=window.location.pathname,n=p.replace(/\/$/,"");if(n&&x.startsWith(n))x=x.slice(n.length);return x="/"+x.replace(/^\/+/,""),x==="/"?"/":x.replace(/\/?$/,"/")}function T(){let p=new URLSearchParams(window.location.search);return p.delete("fbc_item"),p.toString()}function y(){if(window.__fbcErrors)return;let p=window.__fbcErrors=[],x=(n)=>{if(p.push(n.slice(0,500)),p.length>20)p.shift()};window.addEventListener("error",(n)=>{if(n.message)x(`${n.message}${n.filename?` (${n.filename}:${n.lineno})`:""}`)}),window.addEventListener("unhandledrejection",(n)=>{let b=n.reason;x(`Unhandled rejection: ${b instanceof Error?b.message:String(b)}`)})}function f(p,x={},...n){let b=document.createElement(p);for(let[o,r]of Object.entries(x)){if(r===null||r===void 0||r===!1)continue;if(o.startsWith("on")&&typeof r==="function")b.addEventListener(o.slice(2).toLowerCase(),r);else if(o==="text")b.textContent=String(r);else if(o==="value"&&"value"in b)b.value=String(r);else if(r===!0)b.setAttribute(o,"");else b.setAttribute(o,String(r))}for(let o of n){if(o===null||o===void 0||o===!1)continue;b.append(typeof o==="number"?String(o):o)}return b}function Z(p,x,n,b={}){let o=f("select",{name:p,...b});for(let[r,g]of x){let k=f("option",{value:r,text:g});if(r===n)k.selected=!0;o.append(k)}return o}function q(p){let x=new Date(p).getTime();if(Number.isNaN(x))return"";let n=Math.round((Date.now()-x)/1000);if(n<60)return"just now";let b=Math.round(n/60);if(b<60)return`${b}m ago`;let o=Math.round(b/60);if(o<24)return`${o}h ago`;let r=Math.round(o/24);if(r<30)return`${r}d ago`;return new Date(p).toLocaleDateString()}var d=["bug","tweak","change","comment"],m="fbc:mode";class V{cfg;api;host;root;pinsLayer;outline;outlineTag;toolbar=null;sidebar=null;card=null;hintEl=null;bannerEl=null;mode=!1;showResolved=!1;pinMode=null;states=new Map;allItems=null;filters={scope:"page",type:"",status:"unresolved",mine:!1};pagePath;framePending=!1;refreshTimer=0;lastWidth=window.innerWidth;mutationObserver=null;loaded=!1;constructor(p){this.cfg=p;this.api=new N(p),this.pagePath=p.pagePath??E(p.homePath)}init(){this.mount(),this.bindGlobalEvents(),this.bindAdminBar();let p=!1;try{p=window.localStorage.getItem(m)==="1"}catch{p=!1}if(this.cfg.openItem||p)this.setMode(!0)}mount(){this.host=f("div",{id:Y}),this.host.setAttribute("style","all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;");let p=this.host.attachShadow({mode:"open"});p.append(f("style",{text:D})),this.root=f("div",{class:"fbc"});let x=this.cfg.brand;if(x){let b=[["--primary",x.primary],["--on-primary",x.onPrimary],["--dark",x.dark],["--on-dark",x.onDark],["--brand-accent",x.accent],["--ink-primary",x.ink??""]];for(let[o,r]of b)if(r)this.root.style.setProperty(o,r)}let n=f("div",{class:"layer"});this.outlineTag=f("span",{class:"outline-tag"}),this.outline=f("div",{class:"outline"},this.outlineTag),this.pinsLayer=f("div"),n.append(this.outline,this.pinsLayer),this.root.append(n),p.append(this.root),document.body.append(this.host)}inOverlay(p){return p.composedPath().includes(this.host)}bindGlobalEvents(){document.addEventListener("contextmenu",(p)=>this.onContextMenu(p),!0),document.addEventListener("mousemove",(p)=>this.onMouseMove(p),{capture:!0,passive:!0});for(let p of["pointerdown","mousedown","mouseup","click"])document.addEventListener(p,(x)=>this.onPinModeEvent(x),!0);document.addEventListener("mousedown",(p)=>this.onOutsideMouseDown(p),!1),document.addEventListener("keydown",(p)=>this.onKeyDown(p),!0),window.addEventListener("scroll",()=>this.schedulePosition(),{passive:!0,capture:!0}),window.addEventListener("resize",()=>{let p=window.innerWidth!==this.lastWidth;if(this.lastWidth=window.innerWidth,p)this.scheduleRefresh(80);else this.schedulePosition()})}bindAdminBar(){document.querySelector("#wp-admin-bar-fbc-toggle > a")?.addEventListener("click",(x)=>{x.preventDefault(),this.setMode(!this.mode)})}async setMode(p){this.mode=p;try{window.localStorage.setItem(m,p?"1":"0")}catch{}if(document.querySelector("#wp-admin-bar-fbc-toggle")?.classList.toggle("fbc-on",p),!p){this.exitPinMode(),this.closeCard(),this.closeSidebar(),this.hideOutline(),this.toolbar?.remove(),this.toolbar=null,this.bannerEl?.remove(),this.bannerEl=null,this.pinsLayer.replaceChildren();for(let x of this.states.values())x.pin=null;this.mutationObserver?.disconnect();return}if(this.renderToolbar(),this.observeMutations(),!this.loaded)await this.loadItems();else this.refresh();if(this.cfg.openItem){let x=this.cfg.openItem;this.cfg.openItem=0,this.stripDeepLinkParam(),this.openDeepLink(x)}}stripDeepLinkParam(){let p=new URL(window.location.href);if(p.searchParams.has("fbc_item"))p.searchParams.delete("fbc_item"),window.history.replaceState(window.history.state,"",p.toString())}async loadItems(){try{let{items:p}=await this.api.listItems(this.pagePath);this.states.clear();for(let x of p)this.states.set(x.id,{item:x,el:null,placement:"orphan",pin:null});this.loaded=!0,this.refresh()}catch(p){this.toast(`Could not load feedback: ${p.message}`,!0)}}upsert(p){let x=this.states.get(p.id);if(x)x.item=p;else this.states.set(p.id,{item:p,el:null,placement:"orphan",pin:null});if(this.allItems){let n=this.allItems.findIndex((b)=>b.id===p.id);if(n>=0)this.allItems[n]=p;else this.allItems.push(p)}}remove(p){if(this.states.get(p)?.pin?.remove(),this.states.delete(p),this.allItems)this.allItems=this.allItems.filter((n)=>n.id!==p)}refresh(){for(let p of this.states.values()){if(!p.item.anchor){p.el=null,p.placement="note";continue}let x=p.el&&p.el.isConnected?p.el:I(p.item.anchor).el;p.el=x,p.placement=!x?"orphan":O(x)?"pinned":"hidden"}if(this.drawPins(),this.updateToolbarCount(),this.sidebar)this.renderSidebarList()}drawPins(){if(!this.mode)return;for(let p of this.states.values()){if(!(p.placement==="pinned"&&(this.showResolved||p.item.status!=="resolved"))){p.pin?.remove(),p.pin=null;continue}if(!p.pin){let o=f("button",{class:"pin",type:"button","aria-label":`Feedback #${p.item.id}: ${p.item.title}`,onclick:(r)=>{r.stopPropagation(),this.openPopover(p.item.id)}});p.pin=o,this.pinsLayer.append(o)}let n=p.item.status==="resolved",b=p.pin.classList.contains("pulse");p.pin.className=`pin ${p.item.type}${n?" resolved":""}${b?" pulse":""}`,p.pin.textContent=n?"✓":String(p.item.id),p.pin.title=`#${p.item.id} ${p.item.title}`}this.positionPins()}schedulePosition(){if(this.framePending||!this.mode)return;this.framePending=!0,requestAnimationFrame(()=>{this.framePending=!1,this.positionPins()})}scheduleRefresh(p=250){window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.mode&&this.refresh(),p)}positionPins(){for(let p of this.states.values()){if(!p.pin||!p.el||!p.item.anchor)continue;let x=p.el.getBoundingClientRect(),n=x.left+p.item.anchor.offsetX*x.width,b=x.top+p.item.anchor.offsetY*x.height;p.pin.style.transform=`translate(${Math.round(n)}px, ${Math.round(b)}px)`}}observeMutations(){if(!this.mutationObserver)this.mutationObserver=new MutationObserver((p)=>{if(p.every((x)=>x.target===this.host||this.host.contains(x.target)))return;this.schedulePosition(),this.scheduleRefresh(300)});this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden","open"]})}onContextMenu(p){if(!this.mode||p.altKey||this.inOverlay(p))return;let x=this.eventTarget(p);if(!x)return;p.preventDefault(),p.stopPropagation(),this.exitPinMode(),this.openTypeMenu(x,p.clientX,p.clientY)}onPinModeEvent(p){if(!this.pinMode||this.inOverlay(p)||p.button!==0)return;if(p.preventDefault(),p.stopImmediatePropagation(),p.type!=="click")return;let x=this.eventTarget(p),n=this.pinMode;if(this.exitPinMode(),x)n.done(x,p.clientX,p.clientY)}onOutsideMouseDown(p){if(this.card&&!this.inOverlay(p))this.closeCard()}onMouseMove(p){if(!this.mode||this.card&&!this.pinMode||this.inOverlay(p)){if(!this.pinMode)this.hideOutline();return}let x=this.eventTarget(p);if(!x||x===document.documentElement||x===document.body){this.hideOutline();return}let n=x.getBoundingClientRect();Object.assign(this.outline.style,{left:`${n.left}px`,top:`${n.top}px`,width:`${n.width}px`,height:`${n.height}px`});let b=x.id?`#${x.id}`:"";this.outlineTag.textContent=`${x.tagName.toLowerCase()}${b}`,this.outline.classList.add("on")}onKeyDown(p){let x=p.composedPath()[0],n=x instanceof HTMLElement&&(x.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(x.tagName));if(p.altKey&&p.shiftKey&&p.code==="KeyF"&&!n){p.preventDefault(),this.setMode(!this.mode);return}if(p.key==="Escape"&&this.mode){if(this.pinMode)this.exitPinMode(),p.preventDefault();else if(this.card)this.closeCard(),p.preventDefault();else if(this.sidebar)this.closeSidebar(),p.preventDefault()}}eventTarget(p){let x=p.target;if(x instanceof Element)return x;if(x instanceof Node)return x.parentElement;return null}hideOutline(){this.outline.classList.remove("on")}enterPinMode(p){this.closeCard(),this.pinMode=p,this.hintEl?.remove(),this.hintEl=f("div",{class:"crosshair-hint",text:`${p.hint} · Esc to cancel`}),this.root.append(this.hintEl),document.documentElement.style.cursor="crosshair",this.renderToolbar()}exitPinMode(){if(!this.pinMode)return;this.pinMode=null,this.hintEl?.remove(),this.hintEl=null,document.documentElement.style.cursor="",this.hideOutline(),this.renderToolbar()}safeAnchor(p,x,n){try{return A(p,x,n)}catch{return this.toast("Can't pin to that element. Try its container, or add a page note.",!0),null}}closeCard(){this.card?.remove(),this.card=null}showCard(p,x,n){this.closeCard(),this.hideOutline(),this.card=p,p.style.left="0px",p.style.top="0px",p.style.visibility="hidden",this.root.append(p);let{offsetWidth:b,offsetHeight:o}=p,r=Math.max(12,Math.min(x+8,window.innerWidth-b-12)),g=Math.max(12,Math.min(n+8,window.innerHeight-o-12));p.style.left=`${r}px`,p.style.top=`${g}px`,p.style.visibility=""}openTypeMenu(p,x,n){let b=this.cfg.labels.type,o=(k)=>this.openComposer(k,p,x,n),r=d.map((k,u)=>f("button",{type:"button",onclick:()=>o(k)},f("span",{class:`dot ${k}`}),b[k],f("kbd",{text:String(u+1)}))),g=f("div",{class:"card menu",role:"menu",onkeydown:(k)=>{let u=k.key,w=Number(u);if(w>=1&&w<=d.length)k.preventDefault(),o(d[w-1])}},f("div",{class:"menu-title",text:"Add feedback"}),...r,f("hr"),f("button",{type:"button",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},"Note for the whole page"));this.showCard(g,x,n),r[0].focus()}openComposer(p,x,n,b){let o=null;if(x){if(o=this.safeAnchor(x,n,b),!o)return}let r=this.cfg.labels,g=Z("type",d.map((J)=>[J,r.type[J]]),p),k=f("input",{type:"text",name:"title",maxlength:255,required:!0,placeholder:"What needs attention?",autocomplete:"off"}),u=f("textarea",{name:"description",placeholder:"Details, steps to reproduce, what you expected… (optional)"}),w=Z("priority",Object.keys(r.priority).map((J)=>[J,r.priority[J]]),"medium"),v=Z("assignee_id",[["0","Unassigned"],...this.cfg.reviewers.map((J)=>[String(J.id),J.name])],"0"),W=f("div",{class:"error",role:"alert"}),$=f("button",{class:"btn primary",type:"submit",text:"Add"}),M=f("form",{class:"card composer",novalidate:!0,onsubmit:(J)=>{J.preventDefault(),K()}},f("div",{class:"head"},f("span",{class:"chip"},f("span",{class:`dot ${p}`}),x?`<${x.tagName.toLowerCase()}>`:"Whole page"),f("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),f("label",{class:"field"},f("span",{text:"Title"}),k),W,f("label",{class:"field"},f("span",{text:"Description"}),u),f("div",{class:"row"},f("label",{class:"field"},f("span",{text:"Type"}),g),f("label",{class:"field"},f("span",{text:"Priority"}),w)),f("label",{class:"field"},f("span",{text:"Assignee"}),v),f("div",{class:"actions"},f("button",{class:"btn link",type:"button",text:"Cancel",onclick:()=>this.closeCard()}),$)),K=async()=>{if(!k.value.trim()){W.textContent="Add a short title.",k.focus();return}$.disabled=!0;try{let J=await this.api.createItem({type:g.value,title:k.value.trim(),description:u.value,priority:w.value,assignee_id:Number(v.value),page_path:this.pagePath,page_query:T(),page_title:document.title,anchor:o,context:S(this.cfg)});this.closeCard(),this.upsert(J);let H=this.states.get(J.id);if(H&&x)H.el=x;this.refresh(),this.toast(`Added #${J.id}`)}catch(J){W.textContent=J.message,$.disabled=!1}};this.showCard(M,n,b),k.focus()}async openPopover(p,x){let n;try{n=await this.api.getItem(p)}catch(z){this.toast(z.message,!0);return}this.upsert(n);let b=this.cfg.labels,o=this.states.get(p),r=o?.pin?.getBoundingClientRect(),g=x?.x??(r?r.right:window.innerWidth/2-170),k=x?.y??(r?r.top:100),u=async(z)=>{try{let B=await this.api.updateItem(p,z);this.upsert(B),this.refresh(),this.openPopover(p,{x:parseFloat(j.style.left)-8,y:parseFloat(j.style.top)-8})}catch(B){this.toast(B.message,!0)}},w=Z("status",Object.keys(b.status).map((z)=>[z,b.status[z]]),n.status,{onchange:()=>void u({status:w.value})}),v=Z("assignee_id",[["0","Unassigned"],...this.cfg.reviewers.map((z)=>[String(z.id),z.name])],String(n.assignee_id),{onchange:()=>void u({assignee_id:Number(v.value)})}),W=Z("priority",Object.keys(b.priority).map((z)=>[z,b.priority[z]]),n.priority,{onchange:()=>void u({priority:W.value})}),$=f("textarea",{placeholder:"Reply…",rows:2}),M=f("ul",{class:"thread"},...(n.comments??[]).map((z)=>f("li",{class:z.kind},f("span",{class:"who",text:z.user_name}),f("span",{class:"when",text:q(z.created_at)}),f("div",{class:"body",text:z.body})))),K=Q(),J=n.breakpoint&&n.breakpoint!==K?f("div",{class:"notice",text:`Logged at ${n.breakpoint} (${n.context?.viewport_w??"?"}px). You are on ${K} (${window.innerWidth}px).`}):null,H=o?.placement==="orphan"?f("div",{class:"notice",text:"The element this was pinned to can’t be found on the page anymore. Re-anchor it."}):null,j=f("div",{class:"card popover",role:"dialog","aria-label":`Feedback #${n.id}`},f("div",{class:"head"},f("span",{class:"chip"},f("span",{class:`dot ${n.type}`}),`${b.type[n.type]} #${n.id}`),f("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),f("div",{class:"t",style:"font-weight:700;font-size:15px;margin-bottom:4px",text:n.title}),f("div",{class:"meta",text:`${n.reporter_name} · ${q(n.created_at)}${n.breakpoint?` · ${n.breakpoint}`:""}`}),n.tw_task_url?f("div",{class:"meta"},f("a",{href:n.tw_task_url,target:"_blank",rel:"noopener",text:`Teamwork task #${n.tw_task_id} ↗`}),n.status==="resolved"?" · completed":" · status syncs from Teamwork"):null,J,H,n.description?f("p",{class:"desc",text:n.description}):null,f("div",{class:"row"},f("label",{class:"field"},f("span",{text:"Status"}),w),f("label",{class:"field"},f("span",{text:"Priority"}),W)),f("label",{class:"field"},f("span",{text:"Assignee"}),v),M,f("label",{class:"field"},$),f("div",{class:"actions"},n.anchor||o?.placement==="note"?f("button",{class:"btn link left",type:"button",text:"Re-anchor",onclick:()=>this.reanchor(n.id)}):null,f("a",{class:"btn link",href:`${this.cfg.adminUrl}&item=${n.id}`,target:"_blank",rel:"noopener",text:"Admin"}),n.can_delete?f("button",{class:"btn danger",type:"button",text:"Delete",onclick:()=>void this.deleteItem(n.id)}):null,f("button",{class:"btn primary",type:"button",text:"Reply",onclick:async()=>{if(!$.value.trim())return;try{await this.api.addComment(n.id,$.value),this.openPopover(p,{x:parseFloat(j.style.left)-8,y:parseFloat(j.style.top)-8})}catch(z){this.toast(z.message,!0)}}})));this.showCard(j,g,k)}reanchor(p){this.enterPinMode({hint:`Click the element #${p} belongs to`,done:async(x,n,b)=>{try{let o=this.safeAnchor(x,n,b);if(!o)return;let r=await this.api.updateItem(p,{anchor:o});this.upsert(r);let g=this.states.get(p);if(g)g.el=x;this.refresh(),this.toast(`Re-anchored #${p}`)}catch(o){this.toast(o.message,!0)}}})}async deleteItem(p){if(!window.confirm(`Delete feedback #${p}? This can’t be undone.`))return;try{await this.api.deleteItem(p),this.closeCard(),this.remove(p),this.refresh(),this.toast(`Deleted #${p}`)}catch(x){this.toast(x.message,!0)}}async openDeepLink(p){let x=this.states.get(p);if(x?.el&&x.placement==="pinned")x.el.scrollIntoView({block:"center",behavior:"auto"}),await new Promise((b)=>requestAnimationFrame(()=>b(null))),this.positionPins(),x.pin?.classList.add("pulse");let n=x?.item;if(n?.breakpoint&&n.breakpoint!==Q())this.showBanner(`#${p} was logged at ${n.breakpoint} (${n.context?.viewport_w??"?"}px wide). You're viewing at ${Q()} (${window.innerWidth}px). Resize to reproduce.`);await this.openPopover(p)}unresolvedCount(){let p=0;for(let x of this.states.values())if(x.item.status!=="resolved")p++;return p}renderToolbar(){if(!this.mode)return;let p=this.unresolvedCount(),x=f("div",{class:"toolbar",role:"toolbar","aria-label":this.cfg.brand?.name??"Feedback"},this.cfg.brand?.logo?f("span",{class:"brand",title:this.cfg.brand.name},f("img",{src:this.cfg.brand.logo,alt:this.cfg.brand.name})):f("span",{class:"brand",text:this.cfg.brand?.label??"Feedback"}),f("button",{type:"button",class:this.pinMode?"on":"",title:"Click an element to pin feedback (or right-click anywhere)",text:"+ Add",onclick:()=>this.pinMode?this.exitPinMode():this.enterPinMode({hint:"Click any element to add feedback",done:(n,b,o)=>this.openTypeMenu(n,b,o)})}),f("button",{type:"button",text:"Page note",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)}),f("button",{type:"button",class:this.sidebar?"on":"",onclick:()=>this.sidebar?this.closeSidebar():this.openSidebar()},f("span",{class:"label",text:"List"}),p?f("span",{class:"count",text:String(p)}):null),f("button",{type:"button",class:this.showResolved?"on":"",title:"Show resolved pins",text:"✓ Resolved",onclick:()=>{this.showResolved=!this.showResolved,this.drawPins(),this.renderToolbar()}}),f("button",{type:"button",title:"Exit Feedback mode (Alt+Shift+F)","aria-label":"Exit Feedback mode",text:"×",onclick:()=>void this.setMode(!1)}));if(this.toolbar)this.toolbar.replaceWith(x);else this.root.append(x);this.toolbar=x}updateToolbarCount(){this.renderToolbar()}openSidebar(){this.sidebar?.remove();let p=this.filters,x=this.cfg.labels,n=Z("scope",[["page","This page"],["all","All pages"]],p.scope,{onchange:()=>{p.scope=n.value,this.renderSidebarList()}}),b=Z("type",[["","All types"],...d.map((g)=>[g,x.type[g]])],p.type,{onchange:()=>{p.type=b.value,this.renderSidebarList()}}),o=Z("status",[["unresolved","Unresolved"],["","Any status"],...Object.keys(x.status).map((g)=>[g,x.status[g]])],p.status,{onchange:()=>{p.status=o.value,this.renderSidebarList()}}),r=f("input",{type:"checkbox",onchange:()=>{p.mine=r.checked,this.renderSidebarList()}});r.checked=p.mine,this.sidebar=f("div",{class:"sidebar",role:"complementary","aria-label":"Feedback list"},f("header",{},f("h2",{},this.cfg.brand?.label??"Feedback",f("button",{class:"x",type:"button","aria-label":"Close list",text:"×",onclick:()=>this.closeSidebar()})),f("div",{class:"filters"},n,b,o,f("span"),f("label",{},r,"Assigned to me"))),f("div",{class:"list"})),this.root.append(this.sidebar),this.renderToolbar(),this.renderSidebarList()}closeSidebar(){this.sidebar?.remove(),this.sidebar=null,this.renderToolbar()}matches(p){let x=this.filters;if(x.type&&p.type!==x.type)return!1;if(x.status==="unresolved"&&p.status==="resolved")return!1;if(x.status&&x.status!=="unresolved"&&p.status!==x.status)return!1;if(x.mine&&p.assignee_id!==this.cfg.user.id)return!1;return!0}async renderSidebarList(){let p=this.sidebar?.querySelector(".list");if(!p)return;let x=(o,r,g)=>f("button",{class:"entry",type:"button",onclick:r},f("span",{class:`num ${o.status==="resolved"?"resolved":o.type}`,text:`#${o.id}`}),f("span",{},f("span",{class:"t",text:o.title}),f("span",{class:"s",text:`${this.cfg.labels.status[o.status]}${o.assignee_name?` · ${o.assignee_name}`:""}${o.breakpoint?` · ${o.breakpoint}`:""}`})),g??null);if(this.filters.scope==="all"){if(!this.allItems){p.replaceChildren(f("div",{class:"empty",text:"Loading…"}));try{this.allItems=(await this.api.listItems()).items}catch(g){p.replaceChildren(f("div",{class:"empty",text:g.message}));return}}let o=new Map;for(let g of this.allItems.filter((k)=>this.matches(k))){let k=o.get(g.page_path)??[];k.push(g),o.set(g.page_path,k)}let r=[];for(let[g,k]of o){r.push(f("h3",{text:g===this.pagePath?`${g} (this page)`:g}));for(let u of k)r.push(x(u,()=>{if(u.page_path===this.pagePath)this.focusItem(u.id);else{let w=new URL(u.page_url,window.location.origin);w.searchParams.set("fbc_item",String(u.id)),window.location.href=w.toString()}}))}p.replaceChildren(...r.length?r:[f("div",{class:"empty",text:"Nothing matches these filters."})]);return}let n={pinned:{title:"On this page",nodes:[]},note:{title:"Page notes",nodes:[]},hidden:{title:"At other breakpoints",nodes:[]},orphan:{title:"Orphaned — element not found",nodes:[]}};for(let o of[...this.states.values()].sort((r,g)=>r.item.id-g.item.id)){if(!this.matches(o.item))continue;let r=o.placement==="orphan"?f("span",{class:"btn link reanchor",role:"button",text:"Re-anchor",onclick:(g)=>{g.stopPropagation(),this.reanchor(o.item.id)}}):null;n[o.placement].nodes.push(x(o.item,()=>this.focusItem(o.item.id),r))}let b=[];for(let o of["pinned","note","hidden","orphan"]){let r=n[o];if(!r.nodes.length)continue;let g=o==="hidden"?`${r.nodes.length} at other breakpoints`:r.title;b.push(f("h3",{text:g}),...r.nodes)}p.replaceChildren(...b.length?b:[f("div",{class:"empty",text:"No feedback on this page yet. Right-click anything to add some."})])}focusItem(p){let x=this.states.get(p);if(!x)return;if(x.placement==="pinned"&&x.el){if(x.item.status==="resolved"&&!this.showResolved)this.showResolved=!0,this.drawPins();x.el.scrollIntoView({block:"center",behavior:"smooth"}),window.setTimeout(()=>{this.positionPins(),x.pin?.classList.remove("pulse"),x.pin?.offsetWidth,x.pin?.classList.add("pulse"),this.openPopover(p)},450)}else this.openPopover(p,{x:window.innerWidth-720,y:80})}toast(p,x=!1){let n=f("div",{class:`toast${x?" err":""}`,role:"status",text:p});this.root.append(n),window.setTimeout(()=>n.remove(),x?5000:2200)}showBanner(p){this.bannerEl?.remove(),this.bannerEl=f("div",{class:"banner",role:"status"},f("span",{text:p}),f("button",{type:"button",text:"Dismiss",onclick:()=>{this.bannerEl?.remove(),this.bannerEl=null}})),this.root.append(this.bannerEl)}}y();P();function t(){let p=window.fbcConfig;if(!p||window.self!==window.top)return;new V(p).init()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",t,{once:!0});else t();})();
