(()=>{var S=`:host {
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
.head.drag {
  cursor: grab;
  touch-action: none;
  user-select: none;
  margin: -14px -14px 10px;
  padding: 14px 14px 8px;
}
.card.dragging,
.card.dragging .head.drag {
  cursor: grabbing;
  user-select: none;
}
.card.dragging {
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.26);
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
/* Own chevron instead of the browser arrow: inset 10px from the edge, same in every browser. */
select {
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%2350575e' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 10px 6px;
  padding-right: 30px !important;
  cursor: pointer;
}
/* Due date: "Set date?" checkbox, with the date picker beside it once ticked. */
.due-field {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 34px;
}
.due-field .check {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;
}
.due-field .check input {
  width: auto;
  margin: 0;
}
.due-field input[type='date'] {
  width: auto;
  flex: 1;
}
.field input[type='date'].overdue {
  border-color: var(--bug);
  color: var(--bug);
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
.thread .mention,
.desc .mention {
  display: inline-block;
  padding: 1px 5px;
  background: rgba(105, 83, 196, 0.12);
  color: var(--ink-primary, #6953c4);
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.95em;
}
.mention-container {
  position: relative;
}
.mention-menu {
  position: absolute;
  left: 0;
  bottom: calc(100% + 4px);
  z-index: 1000;
  background: #ffffff;
  border: 1px solid #dcdcde;
  border-radius: 6px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  max-height: 160px;
  overflow-y: auto;
  min-width: 160px;
  max-width: 240px;
  padding: 4px 0;
}
.mention-item {
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
  color: #1d2327;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mention-item:hover,
.mention-item.is-active {
  background: var(--accent, #6953c4);
  color: var(--on-primary, #ffffff);
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
  font-weight: 600;
  padding: 0 8px;
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
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
/* An on/off toggle reads as off when dimmed, not just when it lacks the underline. */
.toolbar .icon-btn.toggle[aria-pressed='false'] {
  opacity: 0.55;
}
.preview-bar .icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.preview-bar .icon-label {
  font-size: 12px;
}
`;var P="fbc-root";var un=["ember","react-","__next","radix-","headlessui-","mui-","yui_","ext-gen"],vn=/[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i,wn=/^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;function zn(n){let p=/[a-z]/i.test(n),o=/[0-9]/.test(n);if(!p||!o)return!1;if(n.length>=6&&/^[0-9a-f]+$/i.test(n))return!0;return n.length>=8&&/^[0-9a-z]+$/i.test(n)&&dn(n)>=2}function dn(n){let p=0;for(let o=1;o<n.length;o++){let x=/[0-9]/.test(n.charAt(o-1)),r=/[0-9]/.test(n.charAt(o));if(x!==r)p++}return p}function jn(n){if(n.trim()===""||/\s/.test(n))return!1;if(/^[0-9]/.test(n))return!1;if(/[0-9]{5,}/.test(n))return!1;if(vn.test(n))return!1;if(wn.test(n))return!1;let p=n.toLowerCase();if(un.some((o)=>p.startsWith(o)))return!1;return!n.split(/[-_:.]/).some(zn)}function $n(n){let p="",o=n.length,x=n.charCodeAt(0);for(let r=0;r<o;r++){let i=n.charCodeAt(r),g=n.charAt(r);if(i===0)p+="�";else if(i>=1&&i<=31||i===127||r===0&&i>=48&&i<=57||r===1&&i>=48&&i<=57&&x===45)p+=`\\${i.toString(16)} `;else if(r===0&&o===1&&i===45)p+=`\\${g}`;else if(i>=128||i===45||i===95||i>=48&&i<=57||i>=65&&i<=90||i>=97&&i<=122)p+=g;else p+=`\\${g}`}return p}function Y(n,p){let o=p?p.CSS:void 0,x=globalThis.CSS,r=o?.escape??x?.escape;return r?r(n):$n(n)}function Jn(n){return n.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}function H(n){return n.localName.toLowerCase()}function Zn(n){return n.ownerDocument.defaultView}function Qn(n){if(!n)return{x:0,y:0};let p=Number.isFinite(n.scrollX)?n.scrollX:0,o=Number.isFinite(n.scrollY)?n.scrollY:0;return{x:p,y:o}}function R(n){if(!Number.isFinite(n))return 0.5;return Math.min(1,Math.max(0,n))}function B(n){let p=n;while(p){if(p.id==="fbc-root")return!0;if(p.parentElement)p=p.parentElement;else{let o=p.getRootNode();p=o instanceof ShadowRoot?o.host:null}}return!1}function y(n){if(n===null)return null;let p=n.replace(/\s+/g," ").trim();if(p==="")return null;let o=Array.from(p);return o.length>120?o.slice(0,120).join(""):p}var Kn=/^fl-node-(?!content$)[a-z0-9]+$/i,Fn=/^[a-z0-9]+$/i;function s(n){let p=1,o=n.previousElementSibling;while(o){if(o.localName===n.localName&&o.namespaceURI===n.namespaceURI)p++;o=o.previousElementSibling}return p}function T(n,p){if(!n.id||!jn(n.id))return null;let o=`#${Y(n.id,p.defaultView)}`,x=p.querySelectorAll(o);return x.length===1&&x[0]===n?o:null}function Ln(n,p){if(n===p.documentElement)return"html";let o=n.localName,x=n.getAttribute("data-id");if(x!==null&&n.classList.contains("elementor-element")&&Fn.test(x))return`${o}[data-id="${Jn(x)}"]`;let r=Array.from(n.classList).find((i)=>Kn.test(i));if(r!==void 0)return`${o}.${Y(r,p.defaultView)}`;return`${o}:nth-of-type(${s(n)})`}function Un(n,p,o){let x=o.querySelectorAll(n);return x.length===1&&x[0]===p}function Wn(n,p){let o=[],x=n;while(x){let r=T(x,p);if(r!==null)return o.unshift(r),o.join(" > ");o.unshift(Ln(x,p));let i=o.join(" > ");if(Un(i,n,p))return i;x=x.parentElement}return o.join(" > ")}function qn(n,p){let o=[],x=n;while(x){let r=H(x),i=x.parentElement,g=x===p.documentElement||i===p.documentElement&&(r==="head"||r==="body");o.unshift(g?r:`${r}[${s(x)}]`),x=i}return`/${o.join("/")}`}var Hn=/^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i,Gn=/^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;function Nn(n,p){if(!Hn.test(n))return null;let o=n.slice(1).split("/"),x=null;for(let r of o){let i=Gn.exec(r);if(!i)return null;let g=(i[1]??"").toLowerCase(),a=i[2]===void 0?1:Number(i[2]),f=x?Array.from(x.children):p.documentElement?[p.documentElement]:[],k=0,w=null;for(let z of f){if(H(z)!==g)continue;if(k++,k===a){w=z;break}}if(!w)return null;x=w}return x}function I(n,p,o){if(!Number.isFinite(p)||!Number.isFinite(o))throw RangeError(`createAnchor: click coordinates must be finite (got ${p}, ${o})`);if(!n.isConnected)throw Error("createAnchor: element is not connected to a document");if(B(n))throw Error("createAnchor: refusing to anchor an element inside #fbc-root");let x=n.ownerDocument;if(n.getRootNode()!==x)throw Error("createAnchor: element is inside a shadow root; anchor its shadow host instead");let r=n.getBoundingClientRect(),i=Qn(x.defaultView),g=r.width>0?R((p-r.left)/r.width):0.5,a=r.height>0?R((o-r.top)/r.height):0.5;return{id:T(n,x)!==null?n.id:null,selector:Wn(n,x),xpath:qn(n,x),text:y(n.textContent),tag:H(n),offsetX:g,offsetY:a,docX:p+i.x,docY:o+i.y}}function V(n,p){return n!==null&&H(n)===p&&!B(n)}function Xn(n){return n instanceof DOMException||n instanceof Error&&n.name==="SyntaxError"}function Mn(n,p){if(typeof n.id!=="string"||n.id==="")return null;let o=p.getElementById(n.id);if(!o)return null;return p.querySelectorAll(`#${Y(n.id,p.defaultView)}`).length===1?o:null}function Vn(n,p){if(typeof n.selector!=="string"||n.selector.trim()==="")return null;let o;try{o=p.querySelectorAll(n.selector)}catch(x){if(Xn(x))return null;throw x}return o.length===1?o[0]??null:null}function tn(n,p){if(typeof n.xpath!=="string")return null;return Nn(n.xpath,p)}function Cn(n,p){if(typeof n.text!=="string"||n.text==="")return null;let o=null;for(let x of Array.from(p.getElementsByTagName("*"))){if(H(x)!==n.tag||B(x))continue;if(y(x.textContent)!==n.text)continue;if(o)return null;o=x}return o}function E(n,p=document){if(typeof n.tag!=="string"||n.tag==="")return{el:null,strategy:"none"};let o=n.tag.toLowerCase(),x=Mn(n,p);if(V(x,o))return{el:x,strategy:"id"};let r,i=()=>{if(r===void 0)r=Cn({...n,tag:o},p);return V(r,o)?r:null},g=(w)=>{if(n.text===null||y(w.textContent)===n.text)return null;let z=i();return z&&z!==w?z:null},a=Vn(n,p);if(V(a,o)){let w=g(a);return w?{el:w,strategy:"text"}:{el:a,strategy:"selector"}}let f=tn(n,p);if(V(f,o)){let w=g(f);return w?{el:w,strategy:"text"}:{el:f,strategy:"xpath"}}let k=i();if(k)return{el:k,strategy:"text"};return{el:null,strategy:"none"}}function m(n){if(!n.isConnected)return!1;let p=Zn(n);if(!p)return!1;let o=p.getComputedStyle(n);if(o.visibility==="hidden"||o.visibility==="collapse")return!1;let x=n;while(x){if(p.getComputedStyle(x).display==="none")return!1;x=x.parentElement}let r=n.getBoundingClientRect();return!(r.width===0&&r.height===0)}class c extends Error{status;constructor(n,p){super(n);this.status=p}}class O{cfg;constructor(n){this.cfg=n}url(n,p){let o=this.cfg.restUrl.replace(/\/$/,"")+n;if(p){let x=new URLSearchParams(p).toString();if(x)o+=(o.includes("?")?"&":"?")+x}return o}async request(n,p,o,x){let r=typeof FormData<"u"&&o instanceof FormData,i=await fetch(this.url(p,x),{method:n,credentials:"same-origin",headers:{"X-WP-Nonce":this.cfg.nonce,...o!==void 0&&!r?{"Content-Type":"application/json"}:{}},body:o===void 0?void 0:r?o:JSON.stringify(o)}),g=await i.json().catch(()=>null);if(!i.ok){let a=g&&typeof g==="object"&&"message"in g?String(g.message):i.statusText;throw new c(a,i.status)}return g}listItems(n){return this.request("GET","/items",void 0,n?{page_path:n}:void 0)}getItem(n){return this.request("GET",`/items/${n}`)}createItem(n,p){if(!p)return this.request("POST","/items",n);let o=new FormData;return o.append("data",JSON.stringify(n)),o.append("screenshot",p,"screenshot.jpg"),this.request("POST","/items",o)}savePrefs(n){return this.request("POST","/me/prefs",n)}replaceScreenshot(n,p){let o=new FormData;return o.append("screenshot",p,"screenshot.jpg"),this.request("POST",`/items/${n}/screenshot`,o)}updateItem(n,p){return this.request("PATCH",`/items/${n}`,p)}deleteItem(n){return this.request("DELETE",`/items/${n}`)}addComment(n,p){return this.request("POST",`/items/${n}/comments`,{body:p})}}function G(n=window.innerWidth){if(n<768)return"mobile";if(n<=1024)return"tablet";return"desktop"}function Yn(n){let p=[[/Edg\/([\d.]+)/,"Edge"],[/OPR\/([\d.]+)/,"Opera"],[/Firefox\/([\d.]+)/,"Firefox"],[/CriOS\/([\d.]+)/,"Chrome iOS"],[/Chrome\/([\d.]+)/,"Chrome"],[/Version\/([\d.]+).*Safari/,"Safari"]];for(let[o,x]of p){let r=n.match(o);if(r)return`${x} ${r[1].split(".")[0]}`}return"Unknown"}function Bn(n){let p=n.match(/(iPhone|iPad).*OS ([\d_]+)/);if(p)return`iOS ${p[2].replace(/_/g,".")}`;if(p=n.match(/Android ([\d.]+)/),p)return`Android ${p[1]}`;if(p=n.match(/Windows NT ([\d.]+)/),p)return p[1]==="10.0"?"Windows 10/11":`Windows NT ${p[1]}`;if(p=n.match(/Mac OS X ([\d_]+)/),p)return`macOS ${p[1].replace(/_/g,".")}`;if(/CrOS/.test(n))return"ChromeOS";if(/Linux/.test(n))return"Linux";return"Unknown"}var t=null;function l(){let n=navigator.userAgentData;if(!n)return;n.getHighEntropyValues(["platform","platformVersion"]).then(({platform:p,platformVersion:o})=>{if(!p||!o)return;let[x,r]=o.split(".");if(p==="macOS")t=`macOS ${x}.${r??"0"}`;else if(p==="Windows")t=Number(x)>=13?"Windows 11":"Windows 10";else if(p==="Android"||p==="Chrome OS"||p==="Linux")t=`${p} ${o}`.trim()}).catch(()=>{})}function h(n){let p=navigator.userAgent;return{viewport_w:window.innerWidth,viewport_h:window.innerHeight,dpr:Math.round((window.devicePixelRatio||1)*100)/100,breakpoint:G(),browser:Yn(p),os:t??Bn(p),user_agent:p,post_id:n.page.postId,post_type:n.page.postType,theme:n.page.theme,js_errors:(window.__fbcErrors??[]).slice(-20),preview:yn()}}function yn(){try{return window.self!==window.top?window.frameElement?.getAttribute("data-device")??"":""}catch{return""}}function e(n){let p=window.location.pathname,o=n.replace(/\/$/,"");if(o&&p.startsWith(o))p=p.slice(o.length);return p="/"+p.replace(/^\/+/,""),p==="/"?"/":p.replace(/\/?$/,"/")}function nn(){let n=new URLSearchParams(window.location.search);return n.delete("fbc_item"),n.toString()}function pn(){if(window.__fbcErrors)return;let n=window.__fbcErrors=[],p=(o)=>{if(n.push(o.slice(0,500)),n.length>20)n.shift()};window.addEventListener("error",(o)=>{if(o.message)p(`${o.message}${o.filename?` (${o.filename}:${o.lineno})`:""}`)}),window.addEventListener("unhandledrejection",(o)=>{let x=o.reason;p(`Unhandled rejection: ${x instanceof Error?x.message:String(x)}`)})}function b(n,p={},...o){let x=document.createElement(n);for(let[r,i]of Object.entries(p)){if(i===null||i===void 0||i===!1)continue;if(r.startsWith("on")&&typeof i==="function")x.addEventListener(r.slice(2).toLowerCase(),i);else if(r==="text")x.textContent=String(i);else if(r==="value"&&"value"in x)x.value=String(i);else if(i===!0)x.setAttribute(r,"");else x.setAttribute(r,String(i))}for(let r of o){if(r===null||r===void 0||r===!1)continue;x.append(typeof r==="number"?String(r):r)}return x}function F(n,p,o,x={}){let r=b("select",{name:n,...x});for(let[i,g]of p){let a=b("option",{value:i,text:g});if(i===o)a.selected=!0;r.append(a)}return r}function _(n){let p=new Date(n).getTime();if(Number.isNaN(p))return"";let o=Math.round((Date.now()-p)/1000);if(o<60)return"just now";let x=Math.round(o/60);if(x<60)return`${x}m ago`;let r=Math.round(x/60);if(r<24)return`${r}h ago`;let i=Math.round(r/24);if(i<30)return`${i}d ago`;return new Date(n).toLocaleDateString()}var On={phone:'<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',tablet:'<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M11 18.5h2"/>',desktop:'<rect x="2.5" y="4" width="19" height="12.5" rx="1.5"/><path d="M8.5 20.5h7M12 16.5v4"/>',highlight:'<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3"/><path d="M11 11l9 3.5-3.8 1.4-1.4 3.8z"/>'};function N(n){let p=document.createElement("span");return p.className="icon",p.setAttribute("aria-hidden","true"),p.innerHTML=`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${On[n]??""}</svg>`,p}var X=["bug","tweak","change","comment"],on="fbc:mode",xn="fbc:corner",rn="fbc:highlight",M="fbc-preview",C=[{id:"phone",label:"Mobile",w:390,h:844},{id:"tablet",label:"Tablet",w:820,h:1180},{id:"desktop",label:"Desktop",w:1440,h:900}],W=16,bn=360,_n=["tl","tr","bl","br"];function Dn(){let n=new Date;return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`}function An(n,p){let[o,x,r]=n.split("-").map(Number);return new Date(Date.UTC(o,x-1,r+p)).toISOString().slice(0,10)}function gn(n,p=Date.now()){if(!n)return"";if(n.batchUntil&&p<n.batchUntil*1000)return n.suggest;if(!n.batchUntil&&n.suggest)return n.suggest;return An(Dn(),n.days)}class D{cfg;api;host;root;pinsLayer;outline;outlineTag;toolbar=null;sidebar=null;card=null;hintEl=null;bannerEl=null;mode=!1;highlight=!0;pinMode=null;states=new Map;allItems=null;filters={scope:"page",type:"",status:"unresolved",mine:!1,round:0,bp:""};pagePath;framePending=!1;refreshTimer=0;lastWidth=window.innerWidth;mutationObserver=null;loaded=!1;corner="br";dragging=!1;ghost=null;pendingShot=null;inPreview=window.self!==window.top&&window.name===M;previewEl=null;selectedEl=null;unbinds=[];cardCleanup=null;constructor(n){this.cfg=n;this.api=new O(n),this.pagePath=n.pagePath??e(n.homePath)}destroy(){if(this.cardCleanup)this.cardCleanup(),this.cardCleanup=null;for(let n of this.unbinds)n();if(this.unbinds=[],this.mutationObserver)this.mutationObserver.disconnect(),this.mutationObserver=null;if(this.refreshTimer)window.clearTimeout(this.refreshTimer),this.refreshTimer=0;this.host?.remove()}listen(n,p,o,x){n.addEventListener(p,o,x),this.unbinds.push(()=>n.removeEventListener(p,o,x))}init(){this.mount(),this.bindGlobalEvents(),this.bindAdminBar();let n=!1,p=null,o=null;try{n=window.localStorage.getItem(on)==="1";let r=window.localStorage.getItem(xn);if(r&&_n.includes(r))p=r;let i=window.localStorage.getItem(rn);if(i!==null)o=i!=="0"}catch{n=!1}let x=this.cfg.prefs??{};if(this.corner=x.corner??p??this.corner,this.highlight=x.highlight??o??!0,!this.inPreview){let r={};if(!x.corner&&p)r.corner=p;if(x.highlight===void 0&&o!==null)r.highlight=o;if(Object.keys(r).length)this.savePrefs(r)}if(this.inPreview){let r=document.createElement("style");r.textContent="#wpadminbar{display:none!important}html{margin-top:0!important}",document.head.append(r),this.corner="bl",this.setMode(!0);return}if(this.cfg.openItem||n)this.setMode(!0)}mount(){this.host=b("div",{id:P}),this.host.setAttribute("style","all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;");let n=this.host.attachShadow({mode:"open"});n.append(b("style",{text:S})),this.root=b("div",{class:"fbc"});let p=this.cfg.brand;if(p){let x=[["--primary",p.primary],["--on-primary",p.onPrimary],["--dark",p.dark],["--on-dark",p.onDark],["--brand-accent",p.accent],["--ink-primary",p.ink??""]];for(let[r,i]of x)if(i)this.root.style.setProperty(r,i)}let o=b("div",{class:"layer"});this.outlineTag=b("span",{class:"outline-tag"}),this.outline=b("div",{class:"outline"},this.outlineTag),this.pinsLayer=b("div"),o.append(this.outline,this.pinsLayer),this.root.append(o),n.append(this.root),document.body.append(this.host)}inOverlay(n){return n.composedPath().includes(this.host)}bindGlobalEvents(){this.listen(document,"contextmenu",(n)=>this.onContextMenu(n),!0),this.listen(document,"mousemove",(n)=>this.onMouseMove(n),{capture:!0,passive:!0});for(let n of["pointerdown","mousedown","mouseup","click"])this.listen(document,n,(p)=>this.onPinModeEvent(p),!0);this.listen(document,"mousedown",(n)=>this.onOutsideMouseDown(n),!1),this.listen(document,"keydown",(n)=>this.onKeyDown(n),!0),this.listen(window,"scroll",()=>this.schedulePosition(),{passive:!0,capture:!0}),this.listen(window,"resize",()=>{let n=window.innerWidth!==this.lastWidth;if(this.lastWidth=window.innerWidth,this.card?.classList.contains("popover")||this.card?.classList.contains("composer"))this.card.style.maxHeight=`${Math.max(160,window.innerHeight-this.topOffset()-24)}px`,this.moveCard(this.card,this.card.offsetLeft,this.card.offsetTop);if(n)this.scheduleRefresh(80);else this.schedulePosition()})}bindAdminBar(){let n=document.querySelector("#wp-admin-bar-fbc-toggle > a");if(n)this.listen(n,"click",(p)=>{p.preventDefault(),this.setMode(!this.mode)})}async setMode(n){if(this.mode=n,!this.inPreview)try{window.localStorage.setItem(on,n?"1":"0")}catch{}if(document.querySelector("#wp-admin-bar-fbc-toggle")?.classList.toggle("fbc-on",n),!n){this.exitPinMode(),this.closeCard(),this.closeSidebar(),this.hideOutline(),this.toolbar?.remove(),this.toolbar=null,this.bannerEl?.remove(),this.bannerEl=null,this.pinsLayer.replaceChildren();for(let p of this.states.values())p.pin=null;this.mutationObserver?.disconnect();return}if(this.renderToolbar(),this.observeMutations(),!this.loaded)await this.loadItems();else this.refresh();if(this.cfg.openItem){let p=this.cfg.openItem;this.cfg.openItem=0,this.stripDeepLinkParam(),this.openDeepLink(p)}}stripDeepLinkParam(){let n=new URL(window.location.href);if(n.searchParams.has("fbc_item"))n.searchParams.delete("fbc_item"),window.history.replaceState(window.history.state,"",n.toString())}async loadItems(){try{let{items:n}=await this.api.listItems(this.pagePath),p=new Map(this.states);this.states.clear();for(let o of n){let x=p.get(o.id);p.delete(o.id),this.states.set(o.id,{item:o,el:x?.el??null,placement:"orphan",pin:x?.pin??null})}for(let o of p.values())o.pin?.remove();this.loaded=!0,this.refresh()}catch(n){this.toast(`Could not load feedback: ${n.message}`,!0)}}upsert(n){let p=this.states.get(n.id);if(p)p.item=n;else this.states.set(n.id,{item:n,el:null,placement:"orphan",pin:null});if(this.allItems){let o=this.allItems.findIndex((x)=>x.id===n.id);if(o>=0)this.allItems[o]=n;else this.allItems.push(n)}}remove(n){if(this.states.get(n)?.pin?.remove(),this.states.delete(n),this.allItems)this.allItems=this.allItems.filter((o)=>o.id!==n)}refresh(){for(let n of this.states.values()){if(!n.item.anchor){n.el=null,n.placement="note";continue}let p=n.el&&n.el.isConnected?n.el:E(n.item.anchor).el;n.el=p,n.placement=!p?"orphan":m(p)?"pinned":"hidden"}if(this.drawPins(),this.updateToolbarCount(),this.sidebar)this.renderSidebarList()}drawPins(){if(!this.mode)return;for(let n of this.states.values()){if(!(n.placement==="pinned"&&this.matchesStatus(n.item))){n.pin?.remove(),n.pin=null;continue}if(!n.pin){let r=b("button",{class:"pin",type:"button","aria-label":`Feedback #${n.item.id}: ${n.item.title}`,onclick:(i)=>{i.stopPropagation(),this.openPopover(n.item.id)}});n.pin=r,this.pinsLayer.append(r)}let o=n.item.status==="resolved",x=n.pin.classList.contains("pulse");n.pin.className=`pin ${n.item.type}${o?" resolved":""}${x?" pulse":""}`,n.pin.textContent=o?"✓":String(n.item.id),n.pin.title=`#${n.item.id} ${n.item.title}`}this.positionPins()}schedulePosition(){if(this.framePending||!this.mode)return;this.framePending=!0,requestAnimationFrame(()=>{if(this.framePending=!1,this.positionPins(),this.positionChrome(),this.selectedEl)this.hideOutline()})}scheduleRefresh(n=250){window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.mode&&this.refresh(),n)}positionPins(){for(let n of this.states.values()){if(!n.pin||!n.el||!n.item.anchor)continue;let p=n.el.getBoundingClientRect(),o=p.left+n.item.anchor.offsetX*p.width,x=p.top+n.item.anchor.offsetY*p.height;n.pin.style.transform=`translate(${Math.round(o)}px, ${Math.round(x)}px)`}}observeMutations(){if(!this.mutationObserver)this.mutationObserver=new MutationObserver((n)=>{if(n.every((p)=>p.target===this.host||this.host.contains(p.target)))return;this.schedulePosition(),this.scheduleRefresh(300)});this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden","open"]})}onContextMenu(n){if(!this.mode||n.altKey||this.inOverlay(n))return;let p=this.eventTarget(n);if(!p)return;n.preventDefault(),n.stopPropagation(),this.exitPinMode(),this.openTypeMenu(p,n.clientX,n.clientY)}onPinModeEvent(n){if(!this.pinMode||this.inOverlay(n)||n.button!==0)return;if(n.preventDefault(),n.stopImmediatePropagation(),n.type!=="click")return;let p=this.eventTarget(n),o=this.pinMode;if(this.exitPinMode(),p)o.done(p,n.clientX,n.clientY)}onOutsideMouseDown(n){if(this.card&&!this.inOverlay(n))this.closeCard()}onMouseMove(n){if(!this.mode||this.card&&!this.pinMode||!this.highlight&&!this.pinMode||this.inOverlay(n)){if(!this.pinMode)this.hideOutline();return}let p=this.eventTarget(n);if(!p||p===document.documentElement||p===document.body){this.hideOutline();return}this.drawOutline(p)}drawOutline(n){let p=n.getBoundingClientRect();Object.assign(this.outline.style,{left:`${p.left}px`,top:`${p.top}px`,width:`${p.width}px`,height:`${p.height}px`});let o=n.id?`#${n.id}`:"";this.outlineTag.textContent=`${n.tagName.toLowerCase()}${o}`,this.outline.classList.add("on")}onKeyDown(n){if(this.annotating)return;let p=n.composedPath()[0],o=p instanceof HTMLElement&&(p.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(p.tagName));if(n.altKey&&n.shiftKey&&n.code==="KeyF"&&!o){n.preventDefault(),this.setMode(!this.mode);return}if(n.key==="Escape"&&this.previewEl){n.preventDefault(),this.closePreview();return}if(n.key==="Escape"&&this.mode){if(this.pinMode)this.exitPinMode(),n.preventDefault();else if(this.card)this.closeCard(),n.preventDefault();else if(this.sidebar)this.closeSidebar(),n.preventDefault()}}eventTarget(n){let p=n.target;if(p instanceof Element)return p;if(p instanceof Node)return p.parentElement;return null}setHighlight(n){this.highlight=n;try{window.localStorage.setItem(rn,n?"1":"0")}catch{}if(!this.inPreview)this.savePrefs({highlight:n});if(!n)this.hideOutline();this.renderToolbar()}hideOutline(){if(this.selectedEl?.isConnected){this.drawOutline(this.selectedEl),this.outline.classList.add("locked");return}this.outline.classList.remove("on","locked")}enterPinMode(n){this.closeCard(),this.pinMode=n,this.hintEl?.remove(),this.hintEl=b("div",{class:"crosshair-hint",text:`${n.hint} · Esc to cancel`}),this.root.append(this.hintEl),document.documentElement.style.cursor="crosshair",this.renderToolbar()}exitPinMode(){if(!this.pinMode)return;this.pinMode=null,this.hintEl?.remove(),this.hintEl=null,document.documentElement.style.cursor="",this.hideOutline(),this.renderToolbar()}scripts=new Map;annotating=!1;async annotate(n){if(this.annotating)return null;this.annotating=!0;try{if(!window.FBCAnnotator)await this.loadBundle("annotator.js");let p=window.FBCAnnotator;if(!p)throw Error("The annotator could not load.");let o=this.cfg.brand?.primary??"#6953c4";return await p.open({image:n,mount:this.root,colors:["#e5383b",o,"#ffb703","#ffffff","#111111"]})}catch(p){return this.toast(p.message,!0),null}finally{this.annotating=!1}}loadBundle(n){let p=this.scripts.get(n);if(p)return p;let o=this.cfg.assetsUrl??"",x=new Promise((r,i)=>{let g=document.createElement("script");g.src=`${o}${n}${this.cfg.version?`?ver=${encodeURIComponent(this.cfg.version)}`:""}`,g.async=!0,g.onload=()=>r(),g.onerror=()=>{this.scripts.delete(n),i(Error(`Could not load ${n}`))},document.head.append(g)});return this.scripts.set(n,x),x}async startCapture(n){if(!this.cfg.shots||!this.cfg.assetsUrl)return null;try{if(!window.FBCCapture)await this.loadBundle("capture.js");let p=window.FBCCapture;if(!p)return null;return await p.captureViewport({marker:n,color:this.cfg.brand?.primary??"#6953c4"})}catch{return null}}assigneeOptions(){return[["0","Unassigned"],...this.cfg.assignees.people.map((n)=>[String(n.id),n.name])]}assigneeLabel(){return this.cfg.assignees.source==="teamwork"?"Assignee (Teamwork)":"Assignee"}safeAnchor(n,p,o){try{return I(n,p,o)}catch{return this.toast("Can't pin to that element. Try its container, or add a page note.",!0),null}}closeCard(n=!1){if(this.cardCleanup)this.cardCleanup(),this.cardCleanup=null;if(this.card?.remove(),this.card=null,!n)this.selectedEl=null,this.hideOutline()}showCard(n,p,o){if(this.closeCard(!0),this.hideOutline(),this.card=n,n.style.left="0px",n.style.top="0px",n.style.visibility="hidden",n.style.maxHeight=`${Math.max(160,window.innerHeight-this.topOffset()-24)}px`,this.root.append(n),this.moveCard(n,p+8,o+8),n.style.visibility="",typeof ResizeObserver<"u"){let r=new ResizeObserver(()=>{if(!n.isConnected)return r.disconnect();this.moveCard(n,n.offsetLeft,n.offsetTop)});r.observe(n)}n.addEventListener("load",()=>this.moveCard(n,n.offsetLeft,n.offsetTop),!0);let x=n.querySelector(":scope > .head");if(x)x.classList.add("drag"),x.title="Drag to move",x.addEventListener("pointerdown",(r)=>this.startCardDrag(n,r))}moveCard(n,p,o){let x=this.topOffset()+12,r=Math.max(12,window.innerWidth-n.offsetWidth-12),i=Math.max(x,window.innerHeight-n.offsetHeight-12);n.style.left=`${Math.round(Math.max(12,Math.min(p,r)))}px`,n.style.top=`${Math.round(Math.max(x,Math.min(o,i)))}px`}startCardDrag(n,p){if(p.button!==0||p.target.closest("button, a, input, select, textarea"))return;p.preventDefault();let o=p.currentTarget,x=p.clientX-n.offsetLeft,r=p.clientY-n.offsetTop;try{o.setPointerCapture(p.pointerId)}catch{}n.classList.add("dragging");let i=(a)=>this.moveCard(n,a.clientX-x,a.clientY-r),g=()=>{n.classList.remove("dragging"),o.removeEventListener("pointermove",i),o.removeEventListener("pointerup",g),o.removeEventListener("pointercancel",g)};o.addEventListener("pointermove",i),o.addEventListener("pointerup",g),o.addEventListener("pointercancel",g)}openTypeMenu(n,p,o){this.pendingShot=this.startCapture({x:p,y:o}),this.selectedEl=n;let x=this.cfg.labels.type,r=(a)=>this.openComposer(a,n,p,o),i=X.map((a,f)=>b("button",{type:"button",onclick:()=>r(a)},b("span",{class:`dot ${a}`}),x[a],b("kbd",{text:String(f+1)}))),g=b("div",{class:"card menu",role:"menu",onkeydown:(a)=>{let f=a.key,k=Number(f);if(k>=1&&k<=X.length)a.preventDefault(),r(X[k-1])}},b("div",{class:"menu-title",text:"Add feedback"}),...i,b("hr"),b("button",{type:"button",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},"Note for the whole page"));this.showCard(g,p,o),i[0].focus()}openComposer(n,p,o,x){this.selectedEl=p;let r=null;if(p){if(r=this.safeAnchor(p,o,x),!r)return}let i=this.cfg.labels,g=F("type",X.map((d)=>[d,i.type[d]]),n),a=b("input",{type:"text",name:"title",maxlength:255,required:!0,placeholder:"What needs attention?",autocomplete:"off"}),f=b("textarea",{name:"description",placeholder:"Details, steps to reproduce, what you expected… (optional)"}),k=F("priority",Object.keys(i.priority).map((d)=>[d,i.priority[d]]),"medium"),w=F("assignee_id",this.assigneeOptions(),"0"),z=b("input",{type:"checkbox",name:"due_on"});z.checked=!!this.cfg.due?.onByDefault;let Z=b("input",{type:"date",name:"due_date",value:gn(this.cfg.due)});Z.hidden=!z.checked,z.addEventListener("change",()=>{if(Z.hidden=!z.checked,z.checked&&!Z.value)Z.value=gn(this.cfg.due)});let v=b("div",{class:"error",role:"alert"}),Q=b("button",{class:"btn primary",type:"submit",text:"Add"}),J=this.pendingShot??this.startCapture(p?{x:o,y:x}:null);this.pendingShot=null;let $=null,u="",K=b("div",{class:"shot","aria-live":"polite"}),q=()=>{if(u)URL.revokeObjectURL(u);u=$?URL.createObjectURL($):"",K.replaceChildren(...$?[b("img",{src:u,alt:"Screenshot that will be attached"}),b("div",{class:"shot-actions"},b("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{if(!$)return;let d=await this.annotate($);if(d)$=d,J=Promise.resolve(d),q()}}),this.cfg.shots?b("button",{type:"button",class:"btn link",text:"Remove screenshot",onclick:()=>{$=null,J=Promise.resolve(null),q()}}):null)]:[]),K.hidden=!$};if(this.cfg.shots)K.textContent="Capturing screenshot…",J.then((d)=>{if($=d,q(),!d)K.hidden=!0});else K.hidden=!0;let U=b("form",{class:"card composer",novalidate:!0,onsubmit:(d)=>{d.preventDefault(),j()}},b("div",{class:"head"},b("span",{class:"chip"},b("span",{class:`dot ${n}`}),p?`<${p.tagName.toLowerCase()}>`:"Whole page"),b("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),b("label",{class:"field"},b("span",{text:"Title"}),a),v,b("label",{class:"field"},b("span",{text:"Description"}),f),b("div",{class:"row"},b("label",{class:"field"},b("span",{text:"Type"}),g),b("label",{class:"field"},b("span",{text:"Priority"}),k)),b("label",{class:"field"},b("span",{text:this.assigneeLabel()}),w),this.cfg.assignees.fallback?b("div",{class:"meta hint",text:"Showing WordPress users until Teamwork is connected (Feedback → Settings). Then this lists your Teamwork project members."}):null,b("div",{class:"field due-field"},b("label",{class:"check"},z," Set date?"),Z),K,b("div",{class:"actions"},b("button",{class:"btn link",type:"button",text:"Cancel",onclick:()=>this.closeCard()}),Q)),j=async()=>{if(v.textContent="",!a.value.trim()){v.textContent="Add a short title.",a.focus();return}Q.disabled=!0;try{let d=this.cfg.shots?await Promise.race([J,new Promise((fn)=>window.setTimeout(()=>fn(null),1e4))]):null,L=await this.api.createItem({type:g.value,title:a.value.trim(),description:f.value,priority:k.value,assignee_id:Number(w.value),assignee_source:this.cfg.assignees.source,due_date:z.checked&&Z.value?Z.value:null,page_path:this.pagePath,page_query:nn(),page_title:document.title,anchor:r,context:h(this.cfg)},$??d);if(u)URL.revokeObjectURL(u);if(L.due_next)this.cfg.due=L.due_next;this.closeCard(),this.upsert(L);let A=this.states.get(L.id);if(A&&p)A.el=p;if(this.refresh(),L.screenshot_error)this.toast(`Added #${L.id}, but the screenshot wasn’t saved: ${L.screenshot_error}`,!0);else this.toast(`Added #${L.id}`)}catch(d){v.textContent=d.message,Q.disabled=!1}};this.showCard(U,o,x),a.focus()}async openPopover(n,p){let o;try{o=await this.api.getItem(n)}catch(j){this.toast(j.message,!0);return}this.upsert(o);let x=this.cfg.labels,r=this.states.get(n),i=r?.pin?.getBoundingClientRect(),g=p?.x??(i?i.right:window.innerWidth/2-170),a=p?.y??(i?i.top:100),f=async(j)=>{try{let d=await this.api.updateItem(n,j);this.upsert(d),this.refresh(),this.openPopover(n,{x:parseFloat(U.style.left)-8,y:parseFloat(U.style.top)-8})}catch(d){this.toast(d.message,!0)}},k=F("status",Object.keys(x.status).map((j)=>[j,x.status[j]]),o.status,{onchange:()=>void f({status:k.value})}),w=F("assignee_id",this.assigneeOptions(),String(o.assignee_id),{onchange:()=>void f({assignee_id:Number(w.value),assignee_source:this.cfg.assignees.source})}),z=F("priority",Object.keys(x.priority).map((j)=>[j,x.priority[j]]),o.priority,{onchange:()=>void f({priority:z.value})}),Z=b("input",{type:"date",name:"due_date",value:o.due_date??"",class:o.overdue?"overdue":"",onchange:()=>void f({due_date:Z.value||null})}),v=b("textarea",{placeholder:"Reply… (type @ to mention)",rows:2}),Q=b("label",{class:"field mention-container"},v),J=this.setupMentions(v,Q),$=b("ul",{class:"thread"},...(o.comments??[]).map((j)=>b("li",{class:j.kind},b("span",{class:"who",text:j.user_name}),b("span",{class:"when",text:_(j.created_at)}),this.renderMentionText("body",j.body)))),u=G(),K=o.breakpoint&&o.breakpoint!==u?b("div",{class:"notice",text:`Logged at ${o.breakpoint} (${o.context?.viewport_w??"?"}px). You are on ${u} (${window.innerWidth}px).`}):null,q=r?.placement==="orphan"?b("div",{class:"notice",text:"The element this was pinned to can’t be found on the page anymore. Use “Pin again” in the list to place it."}):null,U=b("div",{class:"card popover",role:"dialog","aria-label":`Feedback #${o.id}`},b("div",{class:"head"},b("span",{class:"chip"},b("span",{class:`dot ${o.type}`}),`${x.type[o.type]} #${o.id}`),b("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),b("div",{class:"t",style:"font-weight:700;font-size:15px;margin-bottom:4px",text:o.title}),b("div",{class:"meta",text:`Round ${o.round} · ${o.reporter_name} · ${_(o.created_at)}`}),o.breakpoint?b("div",{class:"meta bp-line"},b("span",{class:"chip",text:o.breakpoint}),` ${o.context?.viewport_w??"?"}px wide${o.context?.preview?` · ${o.context.preview} preview`:""}`):null,o.tw_task_url?b("div",{class:"meta"},b("a",{href:o.tw_task_url,target:"_blank",rel:"noopener",text:`Teamwork task #${o.tw_task_id} ↗`}),o.status==="resolved"?" · completed":" · status syncs from Teamwork"):o.tw_note?b("div",{class:"notice",text:o.tw_note}):null,K,q,o.description?this.renderMentionText("desc",o.description):null,o.screenshot_url?b("div",{class:"shot"},b("a",{href:o.screenshot_url,target:"_blank",rel:"noopener",title:"Open full screenshot"},b("img",{src:o.screenshot_url,alt:"Screenshot from when this was filed"})),b("div",{class:"shot-actions"},b("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{try{let j=await fetch(o.screenshot_url,{credentials:"same-origin",cache:"no-store"}),d=await this.annotate(await j.blob());if(!d)return;let L=await this.api.replaceScreenshot(o.id,d);this.upsert(L),this.toast(`Annotations saved on #${o.id}`),this.openPopover(n,{x:parseFloat(U.style.left)-8,y:parseFloat(U.style.top)-8})}catch(j){this.toast(j.message,!0)}}}))):null,b("div",{class:"row"},b("label",{class:"field"},b("span",{text:"Status"}),k),b("label",{class:"field"},b("span",{text:"Priority"}),z)),b("label",{class:"field"},b("span",{text:o.overdue?"Due date · overdue":"Due date"}),Z),o.assignee_locked?b("div",{class:"field"},b("span",{text:this.assigneeLabel()}),b("div",{text:o.assignee_name||"Unassigned"}),b("div",{class:"meta",text:"In Teamwork now: change the assignee there."})):b("label",{class:"field"},b("span",{text:this.assigneeLabel()}),w),$,Q,b("div",{class:"actions"},b("a",{class:"btn link",href:`${this.cfg.adminUrl}&item=${o.id}`,target:"_blank",rel:"noopener",text:"Admin"}),o.can_delete?b("button",{class:"btn danger",type:"button",text:"Delete",onclick:()=>void this.deleteItem(o.id)}):null,b("button",{class:"btn primary",type:"button",text:"Reply",onclick:async()=>{if(!v.value.trim())return;try{await this.api.addComment(o.id,v.value),this.openPopover(n,{x:parseFloat(U.style.left)-8,y:parseFloat(U.style.top)-8})}catch(j){this.toast(j.message,!0)}}})));this.showCard(U,g,a),this.cardCleanup=J}renderMentionText(n,p){let o=b("div",{class:n}),r=(this.cfg.assignees?.people??[]).map((a)=>a.name.trim().replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).filter((a)=>a.length>0).sort((a,f)=>f.length-a.length),i=r.length?new RegExp(`(@(?:${r.join("|")}|[A-Za-z0-9_.-]+))`,"g"):/(@[A-Za-z0-9_.-]+)/g,g=p.split(i);for(let a of g)if(a.startsWith("@"))o.append(b("span",{class:"mention",text:a}));else if(a)o.append(document.createTextNode(a));return o}setupMentions(n,p){let o=this.cfg.assignees?.people??[];if(!o.length)return()=>{};let x=null,r=0,i=-1,g=[],a=()=>{x?.remove(),x=null,i=-1,g=[]},f=(v)=>{let Q=n.value,J=Q.slice(0,i),$=Q.slice(n.selectionEnd),u=`@${v.name} `;n.value=`${J}${u}${$}`;let K=J.length+u.length;n.setSelectionRange(K,K),n.focus(),a()},k=()=>{if(!x)x=b("div",{class:"mention-menu",role:"listbox"}),p.append(x);if(x.innerHTML="",!g.length){a();return}g.forEach((v,Q)=>{let J=b("div",{class:`mention-item${Q===r?" is-active":""}`,role:"option",text:v.name,onclick:($)=>{$.preventDefault(),$.stopPropagation(),f(v)}});x?.append(J)})},w=()=>{let v=typeof n.selectionStart==="number"&&n.selectionStart>0?n.selectionStart:n.value.length,Q=n.value.slice(0,v),J=Q.lastIndexOf("@");if(J===-1||J>0&&!/\s/.test(Q[J-1])){a();return}let $=Q.slice(J+1).toLowerCase();if($.includes(`
`)){a();return}if(i=J,g=o.filter((u)=>u.name.toLowerCase().includes($)).slice(0,5),r=0,g.length)k();else a()},z=(v)=>{if(!x)return;if(v.key==="ArrowDown")v.preventDefault(),r=(r+1)%g.length,k();else if(v.key==="ArrowUp")v.preventDefault(),r=(r-1+g.length)%g.length,k();else if(v.key==="Enter"||v.key==="Tab"){if(g[r])v.preventDefault(),f(g[r])}else if(v.key==="Escape")v.preventDefault(),v.stopPropagation(),a()};n.addEventListener("input",w),n.addEventListener("keydown",z);let Z=(v)=>{if(x&&!x.contains(v.target)&&v.target!==n)a()};return document.addEventListener("click",Z),()=>{a(),n.removeEventListener("input",w),n.removeEventListener("keydown",z),document.removeEventListener("click",Z)}}reanchor(n){this.enterPinMode({hint:`Click the element #${n} belongs to`,done:async(p,o,x)=>{try{let r=this.safeAnchor(p,o,x);if(!r)return;let i=await this.api.updateItem(n,{anchor:r});this.upsert(i);let g=this.states.get(n);if(g)g.el=p;this.refresh(),this.toast(`Pinned #${n} again`)}catch(r){this.toast(r.message,!0)}}})}async deleteItem(n){if(!window.confirm(`Delete feedback #${n}? This can’t be undone.`))return;try{await this.api.deleteItem(n),this.closeCard(),this.remove(n),this.refresh(),this.toast(`Deleted #${n}`)}catch(p){this.toast(p.message,!0)}}async openDeepLink(n){let p=this.states.get(n);if(p?.el&&p.placement==="pinned")p.el.scrollIntoView({block:"center",behavior:"auto"}),await new Promise((x)=>requestAnimationFrame(()=>x(null))),this.positionPins(),p.pin?.classList.add("pulse");let o=p?.item;if(o?.breakpoint&&o.breakpoint!==G())this.showBanner(`#${n} was logged at ${o.breakpoint} (${o.context?.viewport_w??"?"}px wide). You're viewing at ${G()} (${window.innerWidth}px). Resize to reproduce.`);await this.openPopover(n)}unresolvedCount(){let n=0;for(let p of this.states.values())if(p.item.status!=="resolved")n++;return n}renderToolbar(){if(!this.mode)return;let n=this.unresolvedCount(),p=b("div",{class:"toolbar",role:"toolbar","aria-label":this.cfg.brand?.name??"Feedback"},b("button",{type:"button",class:"grip",title:"Drag to move · arrow keys snap to a corner","aria-label":"Move toolbar: drag, or use arrow keys to snap to a corner",text:"⠿",onpointerdown:(x)=>this.startDrag(x),onkeydown:(x)=>this.onGripKey(x)}),this.cfg.brand?.logo?b("span",{class:"brand",title:`${this.cfg.brand.name} · drag to move`,onpointerdown:(x)=>this.startDrag(x)},b("img",{src:this.cfg.brand.logo,alt:this.cfg.brand.name})):b("span",{class:"brand",title:"Drag to move",text:this.cfg.brand?.label??"Feedback",onpointerdown:(x)=>this.startDrag(x)}),b("button",{type:"button",class:this.pinMode?"on":"",title:"Click an element to pin feedback (or right-click anywhere)",text:"+ Add",onclick:()=>this.pinMode?this.exitPinMode():this.enterPinMode({hint:"Click any element to add feedback",done:(x,r,i)=>this.openTypeMenu(x,r,i)})}),b("button",{type:"button",text:"Page note",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)}),b("button",{type:"button",class:"icon-btn toggle","aria-pressed":String(this.highlight),title:this.highlight?"Hover highlight is on: click to turn off":"Hover highlight is off: click to turn on","aria-label":"Highlight elements on hover",onclick:()=>this.setHighlight(!this.highlight)},N("highlight")),this.inPreview?null:b("span",{class:"devices",role:"group","aria-label":"Preview at a device size"},...C.map((x)=>x.id==="desktop"?b("button",{type:"button",class:"icon-btn","aria-pressed":"true",title:"Desktop: the page as you see it now","aria-label":"Desktop view (current)",onclick:()=>this.closePreview()},N(x.id)):b("button",{type:"button",class:"icon-btn","aria-pressed":"false",title:`Preview as ${x.label} (${x.w}px)`,"aria-label":`Preview as ${x.label}, ${x.w} pixels wide`,onclick:()=>this.openPreview(x.id)},N(x.id)))),b("button",{type:"button",class:this.sidebar?"on":"",onclick:()=>this.sidebar?this.closeSidebar():this.openSidebar()},b("span",{class:"label",text:"List"}),n?b("span",{class:"count",text:String(n)}):null),b("button",{type:"button",title:"Exit Feedback mode (Alt+Shift+F)","aria-label":"Exit Feedback mode",text:"×",onclick:()=>void this.setMode(!1)})),o=!!this.toolbar;if(p.hidden=!!this.previewEl,this.toolbar)this.toolbar.replaceWith(p);else this.root.append(p);if(this.toolbar=p,this.positionToolbar(!1),!o)this.positionChrome()}updateToolbarCount(){this.renderToolbar()}openPreview(n,p=!1){if(n==="desktop"){this.closePreview();return}let o=C.find((u)=>u.id===n)??C[0],x=p?o.h:o.w,r=p?o.w:o.h,i=`${o.label} ${x}×${r}`;this.closeCard(),this.exitPinMode();let g=this.previewEl?.querySelector("iframe"),a=new URL(g?.contentWindow?.location.href??window.location.href);a.searchParams.delete("fbc_item"),a.searchParams.set("fbc_preview","1"),this.previewEl?.remove();let f=b("iframe",{name:M,title:`${i} preview`,"data-device":i,src:a.toString()});f.style.width=`${x}px`,f.style.height=`${r}px`;let k=b("div",{class:"preview-device"},f),w=b("div",{class:"preview-stage"},k),z=b("div",{class:"preview-blocked",hidden:!0}),Z=C.map((u)=>b("button",{type:"button",class:"icon-btn","aria-pressed":String(u.id===o.id),title:u.id==="desktop"?"Desktop: back to the page itself":`${u.label} (${u.w}px)`,"aria-label":u.id==="desktop"?"Desktop: close the preview":`${u.label}, ${u.w} pixels wide`,onclick:()=>u.id==="desktop"?this.closePreview():this.openPreview(u.id,u.id===o.id?p:!1)},N(u.id),b("span",{class:"icon-label",text:u.label}))),v=()=>{window.open(a.toString(),M,`width=${x},height=${r},resizable=yes,scrollbars=yes`)},Q=b("div",{class:"preview-bar",role:"toolbar","aria-label":"Device preview"},b("strong",{text:"Device preview"}),b("div",{class:"preview-devices"},...Z),b("button",{type:"button",title:"Rotate",text:"⟲ Rotate",onclick:()=>this.openPreview(o.id,!p)}),b("span",{class:"preview-label",text:i}),b("span",{class:"annotator-spacer"}),b("button",{type:"button",text:"Open in a window",onclick:v}),b("button",{type:"button",class:"preview-close",text:"Done",onclick:()=>this.closePreview()})),J=b("div",{class:"preview",role:"dialog","aria-label":`Device preview: ${i}`},Q,w,z);if(this.previewEl=J,this.root.append(J),requestAnimationFrame(()=>{let u=w.getBoundingClientRect(),K=Math.min(1,(u.width-32)/x,(u.height-32)/r);k.style.width=`${Math.round(x*K)}px`,k.style.height=`${Math.round(r*K)}px`,f.style.transform=`scale(${K})`}),f.addEventListener("load",()=>{let u=!1;try{u=!!f.contentDocument&&f.contentDocument.location.href!=="about:blank"}catch{u=!1}if(!u)z.hidden=!1,z.replaceChildren(b("p",{text:"This site can’t be shown in a frame here."}),b("button",{type:"button",class:"btn primary",text:`Open ${i} in a window`,onclick:v}))}),this.pinsLayer.hidden=!0,this.toolbar)this.toolbar.hidden=!0;this.closeSidebar()}closePreview(){if(!this.previewEl)return;if(this.previewEl.remove(),this.previewEl=null,this.pinsLayer.hidden=!1,this.toolbar)this.toolbar.hidden=!1;this.loaded=!1,this.loadItems()}topOffset(){let n=document.getElementById("wpadminbar");if(!n)return 0;let p=n.getBoundingClientRect();return p.height>0?Math.max(0,Math.round(p.bottom)):0}toolbarTarget(n){let p=this.toolbar,o=p?.offsetWidth??0,x=p?.offsetHeight??0,r=this.topOffset(),i=n.endsWith("l")?W:window.innerWidth-o-W;if(n.endsWith("r")&&this.sidebar&&window.innerWidth>=bn+o+W*2)i-=bn;let g=n.startsWith("t")?r+W:window.innerHeight-x-W;return{x:Math.max(0,i),y:Math.max(r,g)}}nearestCorner(n,p){let o=this.topOffset(),x=p<o+(window.innerHeight-o)/2?"t":"b",r=n<window.innerWidth/2?"l":"r";return`${x}${r}`}positionToolbar(n=!1){let p=this.toolbar;if(!p||this.dragging)return;let{x:o,y:x}=this.toolbarTarget(this.corner);p.classList.toggle("snapping",n),p.style.left=`${o}px`,p.style.top=`${x}px`,p.dataset.corner=this.corner}positionChrome(){this.root.style.setProperty("--top-offset",`${this.topOffset()}px`);let n=this.toolbar?.offsetHeight??0,p=this.toolbar&&this.corner.startsWith("b")?n+W*2:24;this.root.style.setProperty("--toast-bottom",`${p}px`),this.positionToolbar(!1)}savePrefs(n){this.cfg.prefs={...this.cfg.prefs??{},...n},this.api.savePrefs(n).catch(()=>{})}setCorner(n){this.corner=n;try{if(!this.inPreview)window.localStorage.setItem(xn,n)}catch{}if(!this.inPreview)this.savePrefs({corner:n});this.positionToolbar(!0),this.positionChrome()}startDrag(n){let p=this.toolbar;if(!p||n.button!==0)return;n.preventDefault(),n.stopPropagation();let o=p.getBoundingClientRect(),x=n.clientX-o.left,r=n.clientY-o.top;this.dragging=!0,p.classList.remove("snapping"),p.classList.add("dragging"),this.ghost?.remove(),this.ghost=b("div",{class:"snap-ghost"}),Object.assign(this.ghost.style,{width:`${o.width}px`,height:`${o.height}px`}),this.root.append(this.ghost);let i=(a)=>{let f=this.topOffset(),k=Math.min(Math.max(a.clientX-x,0),window.innerWidth-o.width),w=Math.min(Math.max(a.clientY-r,f),window.innerHeight-o.height);p.style.left=`${k}px`,p.style.top=`${w}px`;let z=this.nearestCorner(k+o.width/2,w+o.height/2),Z=this.toolbarTarget(z);if(this.ghost)Object.assign(this.ghost.style,{left:`${Z.x}px`,top:`${Z.y}px`});p.dataset.target=z},g=(a)=>{window.removeEventListener("pointermove",i,!0),window.removeEventListener("pointerup",g,!0),window.removeEventListener("pointercancel",g,!0);let f=p.getBoundingClientRect();this.dragging=!1,p.classList.remove("dragging"),this.ghost?.remove(),this.ghost=null,delete p.dataset.target,this.setCorner(a.type==="pointercancel"?this.corner:this.nearestCorner(f.left+f.width/2,f.top+f.height/2))};window.addEventListener("pointermove",i,!0),window.addEventListener("pointerup",g,!0),window.addEventListener("pointercancel",g,!0)}onGripKey(n){let o={ArrowLeft:(x)=>`${x[0]}l`,ArrowRight:(x)=>`${x[0]}r`,ArrowUp:(x)=>`t${x[1]}`,ArrowDown:(x)=>`b${x[1]}`}[n.key];if(!o)return;n.preventDefault(),this.setCorner(o(this.corner)),this.toolbar?.querySelector(".grip")?.focus()}openSidebar(){this.sidebar?.remove();let n=this.filters,p=this.cfg.labels,o=F("scope",[["page","This page"],["all","All pages"]],n.scope,{onchange:()=>{n.scope=o.value,this.renderSidebarList()}}),x=F("type",[["","All types"],...X.map((k)=>[k,p.type[k]])],n.type,{onchange:()=>{n.type=x.value,this.renderSidebarList()}}),r=F("status",[["unresolved","Unresolved"],["","Any status"],...Object.keys(p.status).map((k)=>[k,p.status[k]])],n.status,{onchange:()=>{n.status=r.value,this.drawPins(),this.renderSidebarList()}}),i=[["0","All rounds"]];for(let k=this.cfg.round;k>=1;k--)i.push([String(k),k===this.cfg.round?`Round ${k} (current)`:`Round ${k}`]);let g=F("round",i,String(n.round),{onchange:()=>{n.round=Number(g.value),this.renderSidebarList()}}),a=F("bp",[["","All breakpoints"],["mobile","Mobile"],["tablet","Tablet"],["desktop","Desktop"]],n.bp,{onchange:()=>{n.bp=a.value,this.renderSidebarList()}}),f=b("input",{type:"checkbox",onchange:()=>{n.mine=f.checked,this.renderSidebarList()}});f.checked=n.mine,this.sidebar=b("div",{class:"sidebar",role:"complementary","aria-label":"Feedback list"},b("header",{},b("h2",{},this.cfg.brand?.label??"Feedback",b("button",{class:"x",type:"button","aria-label":"Close list",text:"×",onclick:()=>this.closeSidebar()})),b("div",{class:"filters"},o,x,r,g,a,b("label",{},f,"Assigned to me"))),b("div",{class:"list"})),this.root.append(this.sidebar),this.renderToolbar(),this.renderSidebarList()}closeSidebar(){this.sidebar?.remove(),this.sidebar=null,this.renderToolbar()}matchesStatus(n){let p=this.filters.status;if(p==="unresolved")return n.status!=="resolved";return!p||n.status===p}matches(n){let p=this.filters;if(p.type&&n.type!==p.type)return!1;if(p.round&&n.round!==p.round)return!1;if(p.bp&&n.breakpoint!==p.bp)return!1;if(!this.matchesStatus(n))return!1;if(p.mine&&(!this.cfg.assignees.me||n.assignee_id!==this.cfg.assignees.me))return!1;return!0}async renderSidebarList(){let n=this.sidebar?.querySelector(".list");if(!n)return;let p=(r,i,g)=>b("button",{class:"entry",type:"button",onclick:i},b("span",{class:`num ${r.status==="resolved"?"resolved":r.type}`,text:`#${r.id}`}),b("span",{},b("span",{class:"t",text:r.title}),b("span",{class:"s",text:`Round ${r.round} · ${this.cfg.labels.status[r.status]}${r.assignee_name?` · ${r.assignee_name}`:""}${r.breakpoint?` · ${r.breakpoint}`:""}`})),g??null);if(this.filters.scope==="all"){if(!this.allItems){n.replaceChildren(b("div",{class:"empty",text:"Loading…"}));try{this.allItems=(await this.api.listItems()).items}catch(g){n.replaceChildren(b("div",{class:"empty",text:g.message}));return}}let r=new Map;for(let g of this.allItems.filter((a)=>this.matches(a))){let a=r.get(g.page_path)??[];a.push(g),r.set(g.page_path,a)}let i=[];for(let[g,a]of r){i.push(b("h3",{text:g===this.pagePath?`${g} (this page)`:g}));for(let f of a)i.push(p(f,()=>{if(f.page_path===this.pagePath)this.focusItem(f.id);else{let k=new URL(f.page_url,window.location.origin);k.searchParams.set("fbc_item",String(f.id)),window.location.href=k.toString()}}))}n.replaceChildren(...i.length?i:[b("div",{class:"empty",text:"Nothing matches these filters."})]);return}let o={pinned:{title:"On this page",nodes:[]},note:{title:"Page notes",nodes:[]},hidden:{title:"At other breakpoints",nodes:[]},orphan:{title:"Orphaned — element not found",nodes:[]}};for(let r of[...this.states.values()].sort((i,g)=>i.item.id-g.item.id)){if(!this.matches(r.item))continue;let i=r.placement==="orphan"?b("span",{class:"btn link reanchor",role:"button",text:"Pin again",onclick:(g)=>{g.stopPropagation(),this.reanchor(r.item.id)}}):null;o[r.placement].nodes.push(p(r.item,()=>this.focusItem(r.item.id),i))}let x=[];for(let r of["pinned","note","hidden","orphan"]){let i=o[r];if(!i.nodes.length)continue;let g=r==="hidden"?`${i.nodes.length} at other breakpoints`:i.title;x.push(b("h3",{text:g}),...i.nodes)}n.replaceChildren(...x.length?x:[b("div",{class:"empty",text:"No feedback on this page yet. Right-click anything to add some."})])}focusItem(n){let p=this.states.get(n);if(!p)return;if(p.placement==="pinned"&&p.el){if(!this.matchesStatus(p.item)){this.filters.status="";let o=this.sidebar?.querySelector('select[name="status"]');if(o)o.value="";this.drawPins(),this.renderSidebarList()}p.el.scrollIntoView({block:"center",behavior:"smooth"}),window.setTimeout(()=>{this.positionPins(),p.pin?.classList.remove("pulse"),p.pin?.offsetWidth,p.pin?.classList.add("pulse"),this.openPopover(n)},450)}else this.openPopover(n,{x:window.innerWidth-720,y:80})}toast(n,p=!1){let o=b("div",{class:`toast${p?" err":""}`,role:"status",text:n});this.root.append(o),window.setTimeout(()=>o.remove(),p?5000:2200)}showBanner(n){this.bannerEl?.remove(),this.bannerEl=b("div",{class:"banner",role:"status"},b("span",{text:n}),b("button",{type:"button",text:"Dismiss",onclick:()=>{this.bannerEl?.remove(),this.bannerEl=null}})),this.root.append(this.bannerEl)}}pn();l();function Sn(){if(window.self===window.top)return!0;if(window.name!==M)return!1;try{return window.parent.location.origin===window.location.origin}catch{return!1}}function an(){let n=window.fbcConfig;if(!n||!Sn())return;new D(n).init()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",an,{once:!0});else an();})();
