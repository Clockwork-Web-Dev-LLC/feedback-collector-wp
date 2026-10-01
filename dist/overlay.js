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
`;var _="fbc-root";var c=["ember","react-","__next","radix-","headlessui-","mui-","yui_","ext-gen"],s=/[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i,h=/^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;function e(x){let p=/[a-z]/i.test(x),n=/[0-9]/.test(x);if(!p||!n)return!1;if(x.length>=6&&/^[0-9a-f]+$/i.test(x))return!0;return x.length>=8&&/^[0-9a-z]+$/i.test(x)&&xx(x)>=2}function xx(x){let p=0;for(let n=1;n<x.length;n++){let f=/[0-9]/.test(x.charAt(n-1)),b=/[0-9]/.test(x.charAt(n));if(f!==b)p++}return p}function px(x){if(x.trim()===""||/\s/.test(x))return!1;if(/^[0-9]/.test(x))return!1;if(/[0-9]{5,}/.test(x))return!1;if(s.test(x))return!1;if(h.test(x))return!1;let p=x.toLowerCase();if(c.some((n)=>p.startsWith(n)))return!1;return!x.split(/[-_:.]/).some(e)}function nx(x){let p="",n=x.length,f=x.charCodeAt(0);for(let b=0;b<n;b++){let g=x.charCodeAt(b),u=x.charAt(b);if(g===0)p+="�";else if(g>=1&&g<=31||g===127||b===0&&g>=48&&g<=57||b===1&&g>=48&&g<=57&&f===45)p+=`\\${g.toString(16)} `;else if(b===0&&n===1&&g===45)p+=`\\${u}`;else if(g>=128||g===45||g===95||g>=48&&g<=57||g>=65&&g<=90||g>=97&&g<=122)p+=u;else p+=`\\${u}`}return p}function L(x,p){let n=p?p.CSS:void 0,f=globalThis.CSS,b=n?.escape??f?.escape;return b?b(x):nx(x)}function bx(x){return x.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}function Q(x){return x.localName.toLowerCase()}function fx(x){return x.ownerDocument.defaultView}function ox(x){if(!x)return{x:0,y:0};let p=Number.isFinite(x.scrollX)?x.scrollX:0,n=Number.isFinite(x.scrollY)?x.scrollY:0;return{x:p,y:n}}function Y(x){if(!Number.isFinite(x))return 0.5;return Math.min(1,Math.max(0,x))}function N(x){let p=x;while(p){if(p.id==="fbc-root")return!0;if(p.parentElement)p=p.parentElement;else{let n=p.getRootNode();p=n instanceof ShadowRoot?n.host:null}}return!1}function q(x){if(x===null)return null;let p=x.replace(/\s+/g," ").trim();if(p==="")return null;let n=Array.from(p);return n.length>120?n.slice(0,120).join(""):p}var gx=/^fl-node-(?!content$)[a-z0-9]+$/i,ux=/^[a-z0-9]+$/i;function A(x){let p=1,n=x.previousElementSibling;while(n){if(n.localName===x.localName&&n.namespaceURI===x.namespaceURI)p++;n=n.previousElementSibling}return p}function I(x,p){if(!x.id||!px(x.id))return null;let n=`#${L(x.id,p.defaultView)}`,f=p.querySelectorAll(n);return f.length===1&&f[0]===x?n:null}function kx(x,p){if(x===p.documentElement)return"html";let n=x.localName,f=x.getAttribute("data-id");if(f!==null&&x.classList.contains("elementor-element")&&ux.test(f))return`${n}[data-id="${bx(f)}"]`;let b=Array.from(x.classList).find((g)=>gx.test(g));if(b!==void 0)return`${n}.${L(b,p.defaultView)}`;return`${n}:nth-of-type(${A(x)})`}function zx(x,p,n){let f=n.querySelectorAll(x);return f.length===1&&f[0]===p}function wx(x,p){let n=[],f=x;while(f){let b=I(f,p);if(b!==null)return n.unshift(b),n.join(" > ");n.unshift(kx(f,p));let g=n.join(" > ");if(zx(g,x,p))return g;f=f.parentElement}return n.join(" > ")}function vx(x,p){let n=[],f=x;while(f){let b=Q(f),g=f.parentElement,u=f===p.documentElement||g===p.documentElement&&(b==="head"||b==="body");n.unshift(u?b:`${b}[${A(f)}]`),f=g}return`/${n.join("/")}`}var Jx=/^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i,Wx=/^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;function Zx(x,p){if(!Jx.test(x))return null;let n=x.slice(1).split("/"),f=null;for(let b of n){let g=Wx.exec(b);if(!g)return null;let u=(g[1]??"").toLowerCase(),k=g[2]===void 0?1:Number(g[2]),z=f?Array.from(f.children):p.documentElement?[p.documentElement]:[],v=0,J=null;for(let Z of z){if(Q(Z)!==u)continue;if(v++,v===k){J=Z;break}}if(!J)return null;f=J}return f}function O(x,p,n){if(!Number.isFinite(p)||!Number.isFinite(n))throw RangeError(`createAnchor: click coordinates must be finite (got ${p}, ${n})`);if(!x.isConnected)throw Error("createAnchor: element is not connected to a document");if(N(x))throw Error("createAnchor: refusing to anchor an element inside #fbc-root");let f=x.ownerDocument;if(x.getRootNode()!==f)throw Error("createAnchor: element is inside a shadow root; anchor its shadow host instead");let b=x.getBoundingClientRect(),g=ox(f.defaultView),u=b.width>0?Y((p-b.left)/b.width):0.5,k=b.height>0?Y((n-b.top)/b.height):0.5;return{id:I(x,f)!==null?x.id:null,selector:wx(x,f),xpath:vx(x,f),text:q(x.textContent),tag:Q(x),offsetX:u,offsetY:k,docX:p+g.x,docY:n+g.y}}function G(x,p){return x!==null&&Q(x)===p&&!N(x)}function $x(x){return x instanceof DOMException||x instanceof Error&&x.name==="SyntaxError"}function jx(x,p){if(typeof x.id!=="string"||x.id==="")return null;let n=p.getElementById(x.id);if(!n)return null;return p.querySelectorAll(`#${L(x.id,p.defaultView)}`).length===1?n:null}function Fx(x,p){if(typeof x.selector!=="string"||x.selector.trim()==="")return null;let n;try{n=p.querySelectorAll(x.selector)}catch(f){if($x(f))return null;throw f}return n.length===1?n[0]??null:null}function Qx(x,p){if(typeof x.xpath!=="string")return null;return Zx(x.xpath,p)}function rx(x,p){if(typeof x.text!=="string"||x.text==="")return null;let n=null;for(let f of Array.from(p.getElementsByTagName("*"))){if(Q(f)!==x.tag||N(f))continue;if(q(f.textContent)!==x.text)continue;if(n)return null;n=f}return n}function R(x,p=document){if(typeof x.tag!=="string"||x.tag==="")return{el:null,strategy:"none"};let n=x.tag.toLowerCase(),f=jx(x,p);if(G(f,n))return{el:f,strategy:"id"};let b,g=()=>{if(b===void 0)b=rx({...x,tag:n},p);return G(b,n)?b:null},u=(J)=>{if(x.text===null||q(J.textContent)===x.text)return null;let Z=g();return Z&&Z!==J?Z:null},k=Fx(x,p);if(G(k,n)){let J=u(k);return J?{el:J,strategy:"text"}:{el:k,strategy:"selector"}}let z=Qx(x,p);if(G(z,n)){let J=u(z);return J?{el:J,strategy:"text"}:{el:z,strategy:"xpath"}}let v=g();if(v)return{el:v,strategy:"text"};return{el:null,strategy:"none"}}function P(x){if(!x.isConnected)return!1;let p=fx(x);if(!p)return!1;let n=p.getComputedStyle(x);if(n.visibility==="hidden"||n.visibility==="collapse")return!1;let f=x;while(f){if(p.getComputedStyle(f).display==="none")return!1;f=f.parentElement}let b=x.getBoundingClientRect();return!(b.width===0&&b.height===0)}class S extends Error{status;constructor(x,p){super(x);this.status=p}}class V{cfg;constructor(x){this.cfg=x}url(x,p){let n=this.cfg.restUrl.replace(/\/$/,"")+x;if(p){let f=new URLSearchParams(p).toString();if(f)n+=(n.includes("?")?"&":"?")+f}return n}async request(x,p,n,f){let b=await fetch(this.url(p,f),{method:x,credentials:"same-origin",headers:{"X-WP-Nonce":this.cfg.nonce,...n!==void 0?{"Content-Type":"application/json"}:{}},body:n!==void 0?JSON.stringify(n):void 0}),g=await b.json().catch(()=>null);if(!b.ok){let u=g&&typeof g==="object"&&"message"in g?String(g.message):b.statusText;throw new S(u,b.status)}return g}listItems(x){return this.request("GET","/items",void 0,x?{page_path:x}:void 0)}getItem(x){return this.request("GET",`/items/${x}`)}createItem(x){return this.request("POST","/items",x)}updateItem(x,p){return this.request("PATCH",`/items/${x}`,p)}deleteItem(x){return this.request("DELETE",`/items/${x}`)}addComment(x,p){return this.request("POST",`/items/${x}/comments`,{body:p})}}function r(x=window.innerWidth){if(x<768)return"mobile";if(x<=1024)return"tablet";return"desktop"}function Kx(x){let p=[[/Edg\/([\d.]+)/,"Edge"],[/OPR\/([\d.]+)/,"Opera"],[/Firefox\/([\d.]+)/,"Firefox"],[/CriOS\/([\d.]+)/,"Chrome iOS"],[/Chrome\/([\d.]+)/,"Chrome"],[/Version\/([\d.]+).*Safari/,"Safari"]];for(let[n,f]of p){let b=x.match(n);if(b)return`${f} ${b[1].split(".")[0]}`}return"Unknown"}function Hx(x){let p=x.match(/(iPhone|iPad).*OS ([\d_]+)/);if(p)return`iOS ${p[2].replace(/_/g,".")}`;if(p=x.match(/Android ([\d.]+)/),p)return`Android ${p[1]}`;if(p=x.match(/Windows NT ([\d.]+)/),p)return p[1]==="10.0"?"Windows 10/11":`Windows NT ${p[1]}`;if(p=x.match(/Mac OS X ([\d_]+)/),p)return`macOS ${p[1].replace(/_/g,".")}`;if(/CrOS/.test(x))return"ChromeOS";if(/Linux/.test(x))return"Linux";return"Unknown"}var M=null;function E(){let x=navigator.userAgentData;if(!x)return;x.getHighEntropyValues(["platform","platformVersion"]).then(({platform:p,platformVersion:n})=>{if(!p||!n)return;let[f,b]=n.split(".");if(p==="macOS")M=`macOS ${f}.${b??"0"}`;else if(p==="Windows")M=Number(f)>=13?"Windows 11":"Windows 10";else if(p==="Android"||p==="Chrome OS"||p==="Linux")M=`${p} ${n}`.trim()}).catch(()=>{})}function T(x){let p=navigator.userAgent;return{viewport_w:window.innerWidth,viewport_h:window.innerHeight,dpr:Math.round((window.devicePixelRatio||1)*100)/100,breakpoint:r(),browser:Kx(p),os:M??Hx(p),user_agent:p,post_id:x.page.postId,post_type:x.page.postType,theme:x.page.theme,js_errors:(window.__fbcErrors??[]).slice(-20)}}function i(x){let p=window.location.pathname,n=x.replace(/\/$/,"");if(n&&p.startsWith(n))p=p.slice(n.length);return p="/"+p.replace(/^\/+/,""),p==="/"?"/":p.replace(/\/?$/,"/")}function a(){let x=new URLSearchParams(window.location.search);return x.delete("fbc_item"),x.toString()}function y(){if(window.__fbcErrors)return;let x=window.__fbcErrors=[],p=(n)=>{if(x.push(n.slice(0,500)),x.length>20)x.shift()};window.addEventListener("error",(n)=>{if(n.message)p(`${n.message}${n.filename?` (${n.filename}:${n.lineno})`:""}`)}),window.addEventListener("unhandledrejection",(n)=>{let f=n.reason;p(`Unhandled rejection: ${f instanceof Error?f.message:String(f)}`)})}function o(x,p={},...n){let f=document.createElement(x);for(let[b,g]of Object.entries(p)){if(g===null||g===void 0||g===!1)continue;if(b.startsWith("on")&&typeof g==="function")f.addEventListener(b.slice(2).toLowerCase(),g);else if(b==="text")f.textContent=String(g);else if(b==="value"&&"value"in f)f.value=String(g);else if(g===!0)f.setAttribute(b,"");else f.setAttribute(b,String(g))}for(let b of n){if(b===null||b===void 0||b===!1)continue;f.append(typeof b==="number"?String(b):b)}return f}function $(x,p,n,f={}){let b=o("select",{name:x,...f});for(let[g,u]of p){let k=o("option",{value:g,text:u});if(g===n)k.selected=!0;b.append(k)}return b}function D(x){let p=new Date(x).getTime();if(Number.isNaN(p))return"";let n=Math.round((Date.now()-p)/1000);if(n<60)return"just now";let f=Math.round(n/60);if(f<60)return`${f}m ago`;let b=Math.round(f/60);if(b<24)return`${b}h ago`;let g=Math.round(b/24);if(g<30)return`${g}d ago`;return new Date(x).toLocaleDateString()}var K=["bug","tweak","change","comment"],m="fbc:mode";class d{cfg;api;host;root;pinsLayer;outline;outlineTag;toolbar=null;sidebar=null;card=null;hintEl=null;bannerEl=null;mode=!1;showResolved=!1;pinMode=null;states=new Map;allItems=null;filters={scope:"page",type:"",status:"unresolved",mine:!1};pagePath;framePending=!1;refreshTimer=0;lastWidth=window.innerWidth;mutationObserver=null;loaded=!1;constructor(x){this.cfg=x;this.api=new V(x),this.pagePath=x.pagePath??i(x.homePath)}init(){this.mount(),this.bindGlobalEvents(),this.bindAdminBar();let x=!1;try{x=window.localStorage.getItem(m)==="1"}catch{x=!1}if(this.cfg.openItem||x)this.setMode(!0)}mount(){this.host=o("div",{id:_}),this.host.setAttribute("style","all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;");let x=this.host.attachShadow({mode:"open"});x.append(o("style",{text:X})),this.root=o("div",{class:"fbc"});let p=o("div",{class:"layer"});this.outlineTag=o("span",{class:"outline-tag"}),this.outline=o("div",{class:"outline"},this.outlineTag),this.pinsLayer=o("div"),p.append(this.outline,this.pinsLayer),this.root.append(p),x.append(this.root),document.body.append(this.host)}inOverlay(x){return x.composedPath().includes(this.host)}bindGlobalEvents(){document.addEventListener("contextmenu",(x)=>this.onContextMenu(x),!0),document.addEventListener("mousemove",(x)=>this.onMouseMove(x),{capture:!0,passive:!0});for(let x of["pointerdown","mousedown","mouseup","click"])document.addEventListener(x,(p)=>this.onPinModeEvent(p),!0);document.addEventListener("mousedown",(x)=>this.onOutsideMouseDown(x),!1),document.addEventListener("keydown",(x)=>this.onKeyDown(x),!0),window.addEventListener("scroll",()=>this.schedulePosition(),{passive:!0,capture:!0}),window.addEventListener("resize",()=>{let x=window.innerWidth!==this.lastWidth;if(this.lastWidth=window.innerWidth,x)this.scheduleRefresh(80);else this.schedulePosition()})}bindAdminBar(){document.querySelector("#wp-admin-bar-fbc-toggle > a")?.addEventListener("click",(p)=>{p.preventDefault(),this.setMode(!this.mode)})}async setMode(x){this.mode=x;try{window.localStorage.setItem(m,x?"1":"0")}catch{}if(document.querySelector("#wp-admin-bar-fbc-toggle")?.classList.toggle("fbc-on",x),!x){this.exitPinMode(),this.closeCard(),this.closeSidebar(),this.hideOutline(),this.toolbar?.remove(),this.toolbar=null,this.bannerEl?.remove(),this.bannerEl=null,this.pinsLayer.replaceChildren();for(let p of this.states.values())p.pin=null;this.mutationObserver?.disconnect();return}if(this.renderToolbar(),this.observeMutations(),!this.loaded)await this.loadItems();else this.refresh();if(this.cfg.openItem){let p=this.cfg.openItem;this.cfg.openItem=0,this.stripDeepLinkParam(),this.openDeepLink(p)}}stripDeepLinkParam(){let x=new URL(window.location.href);if(x.searchParams.has("fbc_item"))x.searchParams.delete("fbc_item"),window.history.replaceState(window.history.state,"",x.toString())}async loadItems(){try{let{items:x}=await this.api.listItems(this.pagePath);this.states.clear();for(let p of x)this.states.set(p.id,{item:p,el:null,placement:"orphan",pin:null});this.loaded=!0,this.refresh()}catch(x){this.toast(`Could not load feedback: ${x.message}`,!0)}}upsert(x){let p=this.states.get(x.id);if(p)p.item=x;else this.states.set(x.id,{item:x,el:null,placement:"orphan",pin:null});if(this.allItems){let n=this.allItems.findIndex((f)=>f.id===x.id);if(n>=0)this.allItems[n]=x;else this.allItems.push(x)}}remove(x){if(this.states.get(x)?.pin?.remove(),this.states.delete(x),this.allItems)this.allItems=this.allItems.filter((n)=>n.id!==x)}refresh(){for(let x of this.states.values()){if(!x.item.anchor){x.el=null,x.placement="note";continue}let p=x.el&&x.el.isConnected?x.el:R(x.item.anchor).el;x.el=p,x.placement=!p?"orphan":P(p)?"pinned":"hidden"}if(this.drawPins(),this.updateToolbarCount(),this.sidebar)this.renderSidebarList()}drawPins(){if(!this.mode)return;for(let x of this.states.values()){if(!(x.placement==="pinned"&&(this.showResolved||x.item.status!=="resolved"))){x.pin?.remove(),x.pin=null;continue}if(!x.pin){let b=o("button",{class:"pin",type:"button","aria-label":`Feedback #${x.item.id}: ${x.item.title}`,onclick:(g)=>{g.stopPropagation(),this.openPopover(x.item.id)}});x.pin=b,this.pinsLayer.append(b)}let n=x.item.status==="resolved",f=x.pin.classList.contains("pulse");x.pin.className=`pin ${x.item.type}${n?" resolved":""}${f?" pulse":""}`,x.pin.textContent=n?"✓":String(x.item.id),x.pin.title=`#${x.item.id} ${x.item.title}`}this.positionPins()}schedulePosition(){if(this.framePending||!this.mode)return;this.framePending=!0,requestAnimationFrame(()=>{this.framePending=!1,this.positionPins()})}scheduleRefresh(x=250){window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.mode&&this.refresh(),x)}positionPins(){for(let x of this.states.values()){if(!x.pin||!x.el||!x.item.anchor)continue;let p=x.el.getBoundingClientRect(),n=p.left+x.item.anchor.offsetX*p.width,f=p.top+x.item.anchor.offsetY*p.height;x.pin.style.transform=`translate(${Math.round(n)}px, ${Math.round(f)}px)`}}observeMutations(){if(!this.mutationObserver)this.mutationObserver=new MutationObserver((x)=>{if(x.every((p)=>p.target===this.host||this.host.contains(p.target)))return;this.schedulePosition(),this.scheduleRefresh(300)});this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden","open"]})}onContextMenu(x){if(!this.mode||x.altKey||this.inOverlay(x))return;let p=this.eventTarget(x);if(!p)return;x.preventDefault(),x.stopPropagation(),this.exitPinMode(),this.openTypeMenu(p,x.clientX,x.clientY)}onPinModeEvent(x){if(!this.pinMode||this.inOverlay(x)||x.button!==0)return;if(x.preventDefault(),x.stopImmediatePropagation(),x.type!=="click")return;let p=this.eventTarget(x),n=this.pinMode;if(this.exitPinMode(),p)n.done(p,x.clientX,x.clientY)}onOutsideMouseDown(x){if(this.card&&!this.inOverlay(x))this.closeCard()}onMouseMove(x){if(!this.mode||this.card&&!this.pinMode||this.inOverlay(x)){if(!this.pinMode)this.hideOutline();return}let p=this.eventTarget(x);if(!p||p===document.documentElement||p===document.body){this.hideOutline();return}let n=p.getBoundingClientRect();Object.assign(this.outline.style,{left:`${n.left}px`,top:`${n.top}px`,width:`${n.width}px`,height:`${n.height}px`});let f=p.id?`#${p.id}`:"";this.outlineTag.textContent=`${p.tagName.toLowerCase()}${f}`,this.outline.classList.add("on")}onKeyDown(x){let p=x.composedPath()[0],n=p instanceof HTMLElement&&(p.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(p.tagName));if(x.altKey&&x.shiftKey&&x.code==="KeyF"&&!n){x.preventDefault(),this.setMode(!this.mode);return}if(x.key==="Escape"&&this.mode){if(this.pinMode)this.exitPinMode(),x.preventDefault();else if(this.card)this.closeCard(),x.preventDefault();else if(this.sidebar)this.closeSidebar(),x.preventDefault()}}eventTarget(x){let p=x.target;if(p instanceof Element)return p;if(p instanceof Node)return p.parentElement;return null}hideOutline(){this.outline.classList.remove("on")}enterPinMode(x){this.closeCard(),this.pinMode=x,this.hintEl?.remove(),this.hintEl=o("div",{class:"crosshair-hint",text:`${x.hint} · Esc to cancel`}),this.root.append(this.hintEl),document.documentElement.style.cursor="crosshair",this.renderToolbar()}exitPinMode(){if(!this.pinMode)return;this.pinMode=null,this.hintEl?.remove(),this.hintEl=null,document.documentElement.style.cursor="",this.hideOutline(),this.renderToolbar()}safeAnchor(x,p,n){try{return O(x,p,n)}catch{return this.toast("Can't pin to that element. Try its container, or add a page note.",!0),null}}closeCard(){this.card?.remove(),this.card=null}showCard(x,p,n){this.closeCard(),this.hideOutline(),this.card=x,x.style.left="0px",x.style.top="0px",x.style.visibility="hidden",this.root.append(x);let{offsetWidth:f,offsetHeight:b}=x,g=Math.max(12,Math.min(p+8,window.innerWidth-f-12)),u=Math.max(12,Math.min(n+8,window.innerHeight-b-12));x.style.left=`${g}px`,x.style.top=`${u}px`,x.style.visibility=""}openTypeMenu(x,p,n){let f=this.cfg.labels.type,b=(k)=>this.openComposer(k,x,p,n),g=K.map((k,z)=>o("button",{type:"button",onclick:()=>b(k)},o("span",{class:`dot ${k}`}),f[k],o("kbd",{text:String(z+1)}))),u=o("div",{class:"card menu",role:"menu",onkeydown:(k)=>{let z=k.key,v=Number(z);if(v>=1&&v<=K.length)k.preventDefault(),b(K[v-1])}},o("div",{class:"menu-title",text:"Add feedback"}),...g,o("hr"),o("button",{type:"button",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},"Note for the whole page"));this.showCard(u,p,n),g[0].focus()}openComposer(x,p,n,f){let b=null;if(p){if(b=this.safeAnchor(p,n,f),!b)return}let g=this.cfg.labels,u=$("type",K.map((W)=>[W,g.type[W]]),x),k=o("input",{type:"text",name:"title",maxlength:255,required:!0,placeholder:"What needs attention?",autocomplete:"off"}),z=o("textarea",{name:"description",placeholder:"Details, steps to reproduce, what you expected… (optional)"}),v=$("priority",Object.keys(g.priority).map((W)=>[W,g.priority[W]]),"medium"),J=$("assignee_id",[["0","Unassigned"],...this.cfg.reviewers.map((W)=>[String(W.id),W.name])],"0"),Z=o("div",{class:"error",role:"alert"}),j=o("button",{class:"btn primary",type:"submit",text:"Add"}),B=o("form",{class:"card composer",novalidate:!0,onsubmit:(W)=>{W.preventDefault(),H()}},o("div",{class:"head"},o("span",{class:"chip"},o("span",{class:`dot ${x}`}),p?`<${p.tagName.toLowerCase()}>`:"Whole page"),o("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),o("label",{class:"field"},o("span",{text:"Title"}),k),Z,o("label",{class:"field"},o("span",{text:"Description"}),z),o("div",{class:"row"},o("label",{class:"field"},o("span",{text:"Type"}),u),o("label",{class:"field"},o("span",{text:"Priority"}),v)),o("label",{class:"field"},o("span",{text:"Assignee"}),J),o("div",{class:"actions"},o("button",{class:"btn link",type:"button",text:"Cancel",onclick:()=>this.closeCard()}),j)),H=async()=>{if(!k.value.trim()){Z.textContent="Add a short title.",k.focus();return}j.disabled=!0;try{let W=await this.api.createItem({type:u.value,title:k.value.trim(),description:z.value,priority:v.value,assignee_id:Number(J.value),page_path:this.pagePath,page_query:a(),page_title:document.title,anchor:b,context:T(this.cfg)});this.closeCard(),this.upsert(W);let U=this.states.get(W.id);if(U&&p)U.el=p;this.refresh(),this.toast(`Added #${W.id}`)}catch(W){Z.textContent=W.message,j.disabled=!1}};this.showCard(B,n,f),k.focus()}async openPopover(x,p){let n;try{n=await this.api.getItem(x)}catch(w){this.toast(w.message,!0);return}this.upsert(n);let f=this.cfg.labels,b=this.states.get(x),g=b?.pin?.getBoundingClientRect(),u=p?.x??(g?g.right:window.innerWidth/2-170),k=p?.y??(g?g.top:100),z=async(w)=>{try{let C=await this.api.updateItem(x,w);this.upsert(C),this.refresh(),this.openPopover(x,{x:parseFloat(F.style.left)-8,y:parseFloat(F.style.top)-8})}catch(C){this.toast(C.message,!0)}},v=$("status",Object.keys(f.status).map((w)=>[w,f.status[w]]),n.status,{onchange:()=>void z({status:v.value})}),J=$("assignee_id",[["0","Unassigned"],...this.cfg.reviewers.map((w)=>[String(w.id),w.name])],String(n.assignee_id),{onchange:()=>void z({assignee_id:Number(J.value)})}),Z=$("priority",Object.keys(f.priority).map((w)=>[w,f.priority[w]]),n.priority,{onchange:()=>void z({priority:Z.value})}),j=o("textarea",{placeholder:"Reply…",rows:2}),B=o("ul",{class:"thread"},...(n.comments??[]).map((w)=>o("li",{class:w.kind},o("span",{class:"who",text:w.user_name}),o("span",{class:"when",text:D(w.created_at)}),o("div",{class:"body",text:w.body})))),H=r(),W=n.breakpoint&&n.breakpoint!==H?o("div",{class:"notice",text:`Logged at ${n.breakpoint} (${n.context?.viewport_w??"?"}px). You are on ${H} (${window.innerWidth}px).`}):null,U=b?.placement==="orphan"?o("div",{class:"notice",text:"The element this was pinned to can’t be found on the page anymore. Re-anchor it."}):null,F=o("div",{class:"card popover",role:"dialog","aria-label":`Feedback #${n.id}`},o("div",{class:"head"},o("span",{class:"chip"},o("span",{class:`dot ${n.type}`}),`${f.type[n.type]} #${n.id}`),o("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),o("div",{class:"t",style:"font-weight:700;font-size:15px;margin-bottom:4px",text:n.title}),o("div",{class:"meta",text:`${n.reporter_name} · ${D(n.created_at)}${n.breakpoint?` · ${n.breakpoint}`:""}`}),n.tw_task_url?o("div",{class:"meta"},o("a",{href:n.tw_task_url,target:"_blank",rel:"noopener",text:`Teamwork task #${n.tw_task_id} ↗`}),n.status==="resolved"?" · completed":" · status syncs from Teamwork"):null,W,U,n.description?o("p",{class:"desc",text:n.description}):null,o("div",{class:"row"},o("label",{class:"field"},o("span",{text:"Status"}),v),o("label",{class:"field"},o("span",{text:"Priority"}),Z)),o("label",{class:"field"},o("span",{text:"Assignee"}),J),B,o("label",{class:"field"},j),o("div",{class:"actions"},n.anchor||b?.placement==="note"?o("button",{class:"btn link left",type:"button",text:"Re-anchor",onclick:()=>this.reanchor(n.id)}):null,o("a",{class:"btn link",href:`${this.cfg.adminUrl}&item=${n.id}`,target:"_blank",rel:"noopener",text:"Admin"}),n.can_delete?o("button",{class:"btn danger",type:"button",text:"Delete",onclick:()=>void this.deleteItem(n.id)}):null,o("button",{class:"btn primary",type:"button",text:"Reply",onclick:async()=>{if(!j.value.trim())return;try{await this.api.addComment(n.id,j.value),this.openPopover(x,{x:parseFloat(F.style.left)-8,y:parseFloat(F.style.top)-8})}catch(w){this.toast(w.message,!0)}}})));this.showCard(F,u,k)}reanchor(x){this.enterPinMode({hint:`Click the element #${x} belongs to`,done:async(p,n,f)=>{try{let b=this.safeAnchor(p,n,f);if(!b)return;let g=await this.api.updateItem(x,{anchor:b});this.upsert(g);let u=this.states.get(x);if(u)u.el=p;this.refresh(),this.toast(`Re-anchored #${x}`)}catch(b){this.toast(b.message,!0)}}})}async deleteItem(x){if(!window.confirm(`Delete feedback #${x}? This can’t be undone.`))return;try{await this.api.deleteItem(x),this.closeCard(),this.remove(x),this.refresh(),this.toast(`Deleted #${x}`)}catch(p){this.toast(p.message,!0)}}async openDeepLink(x){let p=this.states.get(x);if(p?.el&&p.placement==="pinned")p.el.scrollIntoView({block:"center",behavior:"auto"}),await new Promise((f)=>requestAnimationFrame(()=>f(null))),this.positionPins(),p.pin?.classList.add("pulse");let n=p?.item;if(n?.breakpoint&&n.breakpoint!==r())this.showBanner(`#${x} was logged at ${n.breakpoint} (${n.context?.viewport_w??"?"}px wide). You're viewing at ${r()} (${window.innerWidth}px). Resize to reproduce.`);await this.openPopover(x)}unresolvedCount(){let x=0;for(let p of this.states.values())if(p.item.status!=="resolved")x++;return x}renderToolbar(){if(!this.mode)return;let x=this.unresolvedCount(),p=o("div",{class:"toolbar",role:"toolbar","aria-label":"Feedback"},o("span",{class:"brand",text:"Feedback"}),o("button",{type:"button",class:this.pinMode?"on":"",title:"Click an element to pin feedback (or right-click anywhere)",text:"+ Add",onclick:()=>this.pinMode?this.exitPinMode():this.enterPinMode({hint:"Click any element to add feedback",done:(n,f,b)=>this.openTypeMenu(n,f,b)})}),o("button",{type:"button",text:"Page note",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)}),o("button",{type:"button",class:this.sidebar?"on":"",onclick:()=>this.sidebar?this.closeSidebar():this.openSidebar()},o("span",{class:"label",text:"List"}),x?o("span",{class:"count",text:String(x)}):null),o("button",{type:"button",class:this.showResolved?"on":"",title:"Show resolved pins",text:"✓ Resolved",onclick:()=>{this.showResolved=!this.showResolved,this.drawPins(),this.renderToolbar()}}),o("button",{type:"button",title:"Exit Feedback mode (Alt+Shift+F)","aria-label":"Exit Feedback mode",text:"×",onclick:()=>void this.setMode(!1)}));if(this.toolbar)this.toolbar.replaceWith(p);else this.root.append(p);this.toolbar=p}updateToolbarCount(){this.renderToolbar()}openSidebar(){this.sidebar?.remove();let x=this.filters,p=this.cfg.labels,n=$("scope",[["page","This page"],["all","All pages"]],x.scope,{onchange:()=>{x.scope=n.value,this.renderSidebarList()}}),f=$("type",[["","All types"],...K.map((u)=>[u,p.type[u]])],x.type,{onchange:()=>{x.type=f.value,this.renderSidebarList()}}),b=$("status",[["unresolved","Unresolved"],["","Any status"],...Object.keys(p.status).map((u)=>[u,p.status[u]])],x.status,{onchange:()=>{x.status=b.value,this.renderSidebarList()}}),g=o("input",{type:"checkbox",onchange:()=>{x.mine=g.checked,this.renderSidebarList()}});g.checked=x.mine,this.sidebar=o("div",{class:"sidebar",role:"complementary","aria-label":"Feedback list"},o("header",{},o("h2",{},"Feedback",o("button",{class:"x",type:"button","aria-label":"Close list",text:"×",onclick:()=>this.closeSidebar()})),o("div",{class:"filters"},n,f,b,o("span"),o("label",{},g,"Assigned to me"))),o("div",{class:"list"})),this.root.append(this.sidebar),this.renderToolbar(),this.renderSidebarList()}closeSidebar(){this.sidebar?.remove(),this.sidebar=null,this.renderToolbar()}matches(x){let p=this.filters;if(p.type&&x.type!==p.type)return!1;if(p.status==="unresolved"&&x.status==="resolved")return!1;if(p.status&&p.status!=="unresolved"&&x.status!==p.status)return!1;if(p.mine&&x.assignee_id!==this.cfg.user.id)return!1;return!0}async renderSidebarList(){let x=this.sidebar?.querySelector(".list");if(!x)return;let p=(b,g,u)=>o("button",{class:"entry",type:"button",onclick:g},o("span",{class:`num ${b.status==="resolved"?"resolved":b.type}`,text:`#${b.id}`}),o("span",{},o("span",{class:"t",text:b.title}),o("span",{class:"s",text:`${this.cfg.labels.status[b.status]}${b.assignee_name?` · ${b.assignee_name}`:""}${b.breakpoint?` · ${b.breakpoint}`:""}`})),u??null);if(this.filters.scope==="all"){if(!this.allItems){x.replaceChildren(o("div",{class:"empty",text:"Loading…"}));try{this.allItems=(await this.api.listItems()).items}catch(u){x.replaceChildren(o("div",{class:"empty",text:u.message}));return}}let b=new Map;for(let u of this.allItems.filter((k)=>this.matches(k))){let k=b.get(u.page_path)??[];k.push(u),b.set(u.page_path,k)}let g=[];for(let[u,k]of b){g.push(o("h3",{text:u===this.pagePath?`${u} (this page)`:u}));for(let z of k)g.push(p(z,()=>{if(z.page_path===this.pagePath)this.focusItem(z.id);else{let v=new URL(z.page_url,window.location.origin);v.searchParams.set("fbc_item",String(z.id)),window.location.href=v.toString()}}))}x.replaceChildren(...g.length?g:[o("div",{class:"empty",text:"Nothing matches these filters."})]);return}let n={pinned:{title:"On this page",nodes:[]},note:{title:"Page notes",nodes:[]},hidden:{title:"At other breakpoints",nodes:[]},orphan:{title:"Orphaned — element not found",nodes:[]}};for(let b of[...this.states.values()].sort((g,u)=>g.item.id-u.item.id)){if(!this.matches(b.item))continue;let g=b.placement==="orphan"?o("span",{class:"btn link reanchor",role:"button",text:"Re-anchor",onclick:(u)=>{u.stopPropagation(),this.reanchor(b.item.id)}}):null;n[b.placement].nodes.push(p(b.item,()=>this.focusItem(b.item.id),g))}let f=[];for(let b of["pinned","note","hidden","orphan"]){let g=n[b];if(!g.nodes.length)continue;let u=b==="hidden"?`${g.nodes.length} at other breakpoints`:g.title;f.push(o("h3",{text:u}),...g.nodes)}x.replaceChildren(...f.length?f:[o("div",{class:"empty",text:"No feedback on this page yet. Right-click anything to add some."})])}focusItem(x){let p=this.states.get(x);if(!p)return;if(p.placement==="pinned"&&p.el){if(p.item.status==="resolved"&&!this.showResolved)this.showResolved=!0,this.drawPins();p.el.scrollIntoView({block:"center",behavior:"smooth"}),window.setTimeout(()=>{this.positionPins(),p.pin?.classList.remove("pulse"),p.pin?.offsetWidth,p.pin?.classList.add("pulse"),this.openPopover(x)},450)}else this.openPopover(x,{x:window.innerWidth-720,y:80})}toast(x,p=!1){let n=o("div",{class:`toast${p?" err":""}`,role:"status",text:x});this.root.append(n),window.setTimeout(()=>n.remove(),p?5000:2200)}showBanner(x){this.bannerEl?.remove(),this.bannerEl=o("div",{class:"banner",role:"status"},o("span",{text:x}),o("button",{type:"button",text:"Dismiss",onclick:()=>{this.bannerEl?.remove(),this.bannerEl=null}})),this.root.append(this.bannerEl)}}y();E();function t(){let x=window.fbcConfig;if(!x||window.self!==window.top)return;new d(x).init()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",t,{once:!0});else t();})();
