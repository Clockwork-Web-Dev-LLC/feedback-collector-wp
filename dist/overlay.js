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
`;var P="fbc-root";var kp=["ember","react-","__next","radix-","headlessui-","mui-","yui_","ext-gen"],vp=/[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i,up=/^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;function wp(p){let n=/[a-z]/i.test(p),o=/[0-9]/.test(p);if(!n||!o)return!1;if(p.length>=6&&/^[0-9a-f]+$/i.test(p))return!0;return p.length>=8&&/^[0-9a-z]+$/i.test(p)&&zp(p)>=2}function zp(p){let n=0;for(let o=1;o<p.length;o++){let x=/[0-9]/.test(p.charAt(o-1)),r=/[0-9]/.test(p.charAt(o));if(x!==r)n++}return n}function dp(p){if(p.trim()===""||/\s/.test(p))return!1;if(/^[0-9]/.test(p))return!1;if(/[0-9]{5,}/.test(p))return!1;if(vp.test(p))return!1;if(up.test(p))return!1;let n=p.toLowerCase();if(kp.some((o)=>n.startsWith(o)))return!1;return!p.split(/[-_:.]/).some(wp)}function jp(p){let n="",o=p.length,x=p.charCodeAt(0);for(let r=0;r<o;r++){let i=p.charCodeAt(r),g=p.charAt(r);if(i===0)n+="�";else if(i>=1&&i<=31||i===127||r===0&&i>=48&&i<=57||r===1&&i>=48&&i<=57&&x===45)n+=`\\${i.toString(16)} `;else if(r===0&&o===1&&i===45)n+=`\\${g}`;else if(i>=128||i===45||i===95||i>=48&&i<=57||i>=65&&i<=90||i>=97&&i<=122)n+=g;else n+=`\\${g}`}return n}function B(p,n){let o=n?n.CSS:void 0,x=globalThis.CSS,r=o?.escape??x?.escape;return r?r(p):jp(p)}function $p(p){return p.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}function q(p){return p.localName.toLowerCase()}function Zp(p){return p.ownerDocument.defaultView}function Jp(p){if(!p)return{x:0,y:0};let n=Number.isFinite(p.scrollX)?p.scrollX:0,o=Number.isFinite(p.scrollY)?p.scrollY:0;return{x:n,y:o}}function R(p){if(!Number.isFinite(p))return 0.5;return Math.min(1,Math.max(0,p))}function t(p){let n=p;while(n){if(n.id==="fbc-root")return!0;if(n.parentElement)n=n.parentElement;else{let o=n.getRootNode();n=o instanceof ShadowRoot?o.host:null}}return!1}function y(p){if(p===null)return null;let n=p.replace(/\s+/g," ").trim();if(n==="")return null;let o=Array.from(n);return o.length>120?o.slice(0,120).join(""):n}var Qp=/^fl-node-(?!content$)[a-z0-9]+$/i,Hp=/^[a-z0-9]+$/i;function s(p){let n=1,o=p.previousElementSibling;while(o){if(o.localName===p.localName&&o.namespaceURI===p.namespaceURI)n++;o=o.previousElementSibling}return n}function T(p,n){if(!p.id||!dp(p.id))return null;let o=`#${B(p.id,n.defaultView)}`,x=n.querySelectorAll(o);return x.length===1&&x[0]===p?o:null}function Kp(p,n){if(p===n.documentElement)return"html";let o=p.localName,x=p.getAttribute("data-id");if(x!==null&&p.classList.contains("elementor-element")&&Hp.test(x))return`${o}[data-id="${$p(x)}"]`;let r=Array.from(p.classList).find((i)=>Qp.test(i));if(r!==void 0)return`${o}.${B(r,n.defaultView)}`;return`${o}:nth-of-type(${s(p)})`}function Fp(p,n,o){let x=o.querySelectorAll(p);return x.length===1&&x[0]===n}function Lp(p,n){let o=[],x=p;while(x){let r=T(x,n);if(r!==null)return o.unshift(r),o.join(" > ");o.unshift(Kp(x,n));let i=o.join(" > ");if(Fp(i,p,n))return i;x=x.parentElement}return o.join(" > ")}function Up(p,n){let o=[],x=p;while(x){let r=q(x),i=x.parentElement,g=x===n.documentElement||i===n.documentElement&&(r==="head"||r==="body");o.unshift(g?r:`${r}[${s(x)}]`),x=i}return`/${o.join("/")}`}var Wp=/^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i,qp=/^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;function Gp(p,n){if(!Wp.test(p))return null;let o=p.slice(1).split("/"),x=null;for(let r of o){let i=qp.exec(r);if(!i)return null;let g=(i[1]??"").toLowerCase(),a=i[2]===void 0?1:Number(i[2]),f=x?Array.from(x.children):n.documentElement?[n.documentElement]:[],k=0,w=null;for(let z of f){if(q(z)!==g)continue;if(k++,k===a){w=z;break}}if(!w)return null;x=w}return x}function I(p,n,o){if(!Number.isFinite(n)||!Number.isFinite(o))throw RangeError(`createAnchor: click coordinates must be finite (got ${n}, ${o})`);if(!p.isConnected)throw Error("createAnchor: element is not connected to a document");if(t(p))throw Error("createAnchor: refusing to anchor an element inside #fbc-root");let x=p.ownerDocument;if(p.getRootNode()!==x)throw Error("createAnchor: element is inside a shadow root; anchor its shadow host instead");let r=p.getBoundingClientRect(),i=Jp(x.defaultView),g=r.width>0?R((n-r.left)/r.width):0.5,a=r.height>0?R((o-r.top)/r.height):0.5;return{id:T(p,x)!==null?p.id:null,selector:Lp(p,x),xpath:Up(p,x),text:y(p.textContent),tag:q(p),offsetX:g,offsetY:a,docX:n+i.x,docY:o+i.y}}function V(p,n){return p!==null&&q(p)===n&&!t(p)}function Np(p){return p instanceof DOMException||p instanceof Error&&p.name==="SyntaxError"}function Xp(p,n){if(typeof p.id!=="string"||p.id==="")return null;let o=n.getElementById(p.id);if(!o)return null;return n.querySelectorAll(`#${B(p.id,n.defaultView)}`).length===1?o:null}function Mp(p,n){if(typeof p.selector!=="string"||p.selector.trim()==="")return null;let o;try{o=n.querySelectorAll(p.selector)}catch(x){if(Np(x))return null;throw x}return o.length===1?o[0]??null:null}function Vp(p,n){if(typeof p.xpath!=="string")return null;return Gp(p.xpath,n)}function Cp(p,n){if(typeof p.text!=="string"||p.text==="")return null;let o=null;for(let x of Array.from(n.getElementsByTagName("*"))){if(q(x)!==p.tag||t(x))continue;if(y(x.textContent)!==p.text)continue;if(o)return null;o=x}return o}function E(p,n=document){if(typeof p.tag!=="string"||p.tag==="")return{el:null,strategy:"none"};let o=p.tag.toLowerCase(),x=Xp(p,n);if(V(x,o))return{el:x,strategy:"id"};let r,i=()=>{if(r===void 0)r=Cp({...p,tag:o},n);return V(r,o)?r:null},g=(w)=>{if(p.text===null||y(w.textContent)===p.text)return null;let z=i();return z&&z!==w?z:null},a=Mp(p,n);if(V(a,o)){let w=g(a);return w?{el:w,strategy:"text"}:{el:a,strategy:"selector"}}let f=Vp(p,n);if(V(f,o)){let w=g(f);return w?{el:w,strategy:"text"}:{el:f,strategy:"xpath"}}let k=i();if(k)return{el:k,strategy:"text"};return{el:null,strategy:"none"}}function c(p){if(!p.isConnected)return!1;let n=Zp(p);if(!n)return!1;let o=n.getComputedStyle(p);if(o.visibility==="hidden"||o.visibility==="collapse")return!1;let x=p;while(x){if(n.getComputedStyle(x).display==="none")return!1;x=x.parentElement}let r=p.getBoundingClientRect();return!(r.width===0&&r.height===0)}class l extends Error{status;constructor(p,n){super(p);this.status=n}}class _{cfg;constructor(p){this.cfg=p}url(p,n){let o=this.cfg.restUrl.replace(/\/$/,"")+p;if(n){let x=new URLSearchParams(n).toString();if(x)o+=(o.includes("?")?"&":"?")+x}return o}async request(p,n,o,x){let r=typeof FormData<"u"&&o instanceof FormData,i=await fetch(this.url(n,x),{method:p,credentials:"same-origin",headers:{"X-WP-Nonce":this.cfg.nonce,...o!==void 0&&!r?{"Content-Type":"application/json"}:{}},body:o===void 0?void 0:r?o:JSON.stringify(o)}),g=await i.json().catch(()=>null);if(!i.ok){let a=g&&typeof g==="object"&&"message"in g?String(g.message):i.statusText;throw new l(a,i.status)}return g}listItems(p){return this.request("GET","/items",void 0,p?{page_path:p}:void 0)}getItem(p){return this.request("GET",`/items/${p}`)}createItem(p,n){if(!n)return this.request("POST","/items",p);let o=new FormData;return o.append("data",JSON.stringify(p)),o.append("screenshot",n,"screenshot.jpg"),this.request("POST","/items",o)}replaceScreenshot(p,n){let o=new FormData;return o.append("screenshot",n,"screenshot.jpg"),this.request("POST",`/items/${p}/screenshot`,o)}updateItem(p,n){return this.request("PATCH",`/items/${p}`,n)}deleteItem(p){return this.request("DELETE",`/items/${p}`)}addComment(p,n){return this.request("POST",`/items/${p}/comments`,{body:n})}}function G(p=window.innerWidth){if(p<768)return"mobile";if(p<=1024)return"tablet";return"desktop"}function Yp(p){let n=[[/Edg\/([\d.]+)/,"Edge"],[/OPR\/([\d.]+)/,"Opera"],[/Firefox\/([\d.]+)/,"Firefox"],[/CriOS\/([\d.]+)/,"Chrome iOS"],[/Chrome\/([\d.]+)/,"Chrome"],[/Version\/([\d.]+).*Safari/,"Safari"]];for(let[o,x]of n){let r=p.match(o);if(r)return`${x} ${r[1].split(".")[0]}`}return"Unknown"}function Bp(p){let n=p.match(/(iPhone|iPad).*OS ([\d_]+)/);if(n)return`iOS ${n[2].replace(/_/g,".")}`;if(n=p.match(/Android ([\d.]+)/),n)return`Android ${n[1]}`;if(n=p.match(/Windows NT ([\d.]+)/),n)return n[1]==="10.0"?"Windows 10/11":`Windows NT ${n[1]}`;if(n=p.match(/Mac OS X ([\d_]+)/),n)return`macOS ${n[1].replace(/_/g,".")}`;if(/CrOS/.test(p))return"ChromeOS";if(/Linux/.test(p))return"Linux";return"Unknown"}var C=null;function m(){let p=navigator.userAgentData;if(!p)return;p.getHighEntropyValues(["platform","platformVersion"]).then(({platform:n,platformVersion:o})=>{if(!n||!o)return;let[x,r]=o.split(".");if(n==="macOS")C=`macOS ${x}.${r??"0"}`;else if(n==="Windows")C=Number(x)>=13?"Windows 11":"Windows 10";else if(n==="Android"||n==="Chrome OS"||n==="Linux")C=`${n} ${o}`.trim()}).catch(()=>{})}function h(p){let n=navigator.userAgent;return{viewport_w:window.innerWidth,viewport_h:window.innerHeight,dpr:Math.round((window.devicePixelRatio||1)*100)/100,breakpoint:G(),browser:Yp(n),os:C??Bp(n),user_agent:n,post_id:p.page.postId,post_type:p.page.postType,theme:p.page.theme,js_errors:(window.__fbcErrors??[]).slice(-20),preview:tp()}}function tp(){try{return window.self!==window.top?window.frameElement?.getAttribute("data-device")??"":""}catch{return""}}function e(p){let n=window.location.pathname,o=p.replace(/\/$/,"");if(o&&n.startsWith(o))n=n.slice(o.length);return n="/"+n.replace(/^\/+/,""),n==="/"?"/":n.replace(/\/?$/,"/")}function pp(){let p=new URLSearchParams(window.location.search);return p.delete("fbc_item"),p.toString()}function np(){if(window.__fbcErrors)return;let p=window.__fbcErrors=[],n=(o)=>{if(p.push(o.slice(0,500)),p.length>20)p.shift()};window.addEventListener("error",(o)=>{if(o.message)n(`${o.message}${o.filename?` (${o.filename}:${o.lineno})`:""}`)}),window.addEventListener("unhandledrejection",(o)=>{let x=o.reason;n(`Unhandled rejection: ${x instanceof Error?x.message:String(x)}`)})}function b(p,n={},...o){let x=document.createElement(p);for(let[r,i]of Object.entries(n)){if(i===null||i===void 0||i===!1)continue;if(r.startsWith("on")&&typeof i==="function")x.addEventListener(r.slice(2).toLowerCase(),i);else if(r==="text")x.textContent=String(i);else if(r==="value"&&"value"in x)x.value=String(i);else if(i===!0)x.setAttribute(r,"");else x.setAttribute(r,String(i))}for(let r of o){if(r===null||r===void 0||r===!1)continue;x.append(typeof r==="number"?String(r):r)}return x}function K(p,n,o,x={}){let r=b("select",{name:p,...x});for(let[i,g]of n){let a=b("option",{value:i,text:g});if(i===o)a.selected=!0;r.append(a)}return r}function O(p){let n=new Date(p).getTime();if(Number.isNaN(n))return"";let o=Math.round((Date.now()-n)/1000);if(o<60)return"just now";let x=Math.round(o/60);if(x<60)return`${x}m ago`;let r=Math.round(x/60);if(r<24)return`${r}h ago`;let i=Math.round(r/24);if(i<30)return`${i}d ago`;return new Date(p).toLocaleDateString()}var yp={phone:'<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',tablet:'<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M11 18.5h2"/>',desktop:'<rect x="2.5" y="4" width="19" height="12.5" rx="1.5"/><path d="M8.5 20.5h7M12 16.5v4"/>',highlight:'<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3"/><path d="M11 11l9 3.5-3.8 1.4-1.4 3.8z"/>'};function N(p){let n=document.createElement("span");return n.className="icon",n.setAttribute("aria-hidden","true"),n.innerHTML=`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${yp[p]??""}</svg>`,n}var X=["bug","tweak","change","comment"],op="fbc:mode",xp="fbc:corner",rp="fbc:highlight",M="fbc-preview",Y=[{id:"phone",label:"Mobile",w:390,h:844},{id:"tablet",label:"Tablet",w:820,h:1180},{id:"desktop",label:"Desktop",w:1440,h:900}],U=16,bp=360,_p=["tl","tr","bl","br"];function Op(){let p=new Date;return`${p.getFullYear()}-${String(p.getMonth()+1).padStart(2,"0")}-${String(p.getDate()).padStart(2,"0")}`}function Dp(p,n){let[o,x,r]=p.split("-").map(Number);return new Date(Date.UTC(o,x-1,r+n)).toISOString().slice(0,10)}function ip(p,n=Date.now()){if(!p)return"";if(p.batchUntil&&n<p.batchUntil*1000)return p.suggest;if(!p.batchUntil&&p.suggest)return p.suggest;return Dp(Op(),p.days)}class D{cfg;api;host;root;pinsLayer;outline;outlineTag;toolbar=null;sidebar=null;card=null;hintEl=null;bannerEl=null;mode=!1;highlight=!0;pinMode=null;states=new Map;allItems=null;filters={scope:"page",type:"",status:"unresolved",mine:!1,round:0,bp:""};pagePath;framePending=!1;refreshTimer=0;lastWidth=window.innerWidth;mutationObserver=null;loaded=!1;corner="br";dragging=!1;ghost=null;pendingShot=null;inPreview=window.self!==window.top&&window.name===M;previewEl=null;selectedEl=null;unbinds=[];cardCleanup=null;constructor(p){this.cfg=p;this.api=new _(p),this.pagePath=p.pagePath??e(p.homePath)}destroy(){if(this.cardCleanup)this.cardCleanup(),this.cardCleanup=null;for(let p of this.unbinds)p();if(this.unbinds=[],this.mutationObserver)this.mutationObserver.disconnect(),this.mutationObserver=null;if(this.refreshTimer)window.clearTimeout(this.refreshTimer),this.refreshTimer=0;this.host?.remove()}listen(p,n,o,x){p.addEventListener(n,o,x),this.unbinds.push(()=>p.removeEventListener(n,o,x))}init(){this.mount(),this.bindGlobalEvents(),this.bindAdminBar();let p=!1;try{p=window.localStorage.getItem(op)==="1";let n=window.localStorage.getItem(xp);if(n&&_p.includes(n))this.corner=n;this.highlight=window.localStorage.getItem(rp)!=="0"}catch{p=!1}if(this.inPreview){let n=document.createElement("style");n.textContent="#wpadminbar{display:none!important}html{margin-top:0!important}",document.head.append(n),this.corner="bl",this.setMode(!0);return}if(this.cfg.openItem||p)this.setMode(!0)}mount(){this.host=b("div",{id:P}),this.host.setAttribute("style","all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;");let p=this.host.attachShadow({mode:"open"});p.append(b("style",{text:S})),this.root=b("div",{class:"fbc"});let n=this.cfg.brand;if(n){let x=[["--primary",n.primary],["--on-primary",n.onPrimary],["--dark",n.dark],["--on-dark",n.onDark],["--brand-accent",n.accent],["--ink-primary",n.ink??""]];for(let[r,i]of x)if(i)this.root.style.setProperty(r,i)}let o=b("div",{class:"layer"});this.outlineTag=b("span",{class:"outline-tag"}),this.outline=b("div",{class:"outline"},this.outlineTag),this.pinsLayer=b("div"),o.append(this.outline,this.pinsLayer),this.root.append(o),p.append(this.root),document.body.append(this.host)}inOverlay(p){return p.composedPath().includes(this.host)}bindGlobalEvents(){this.listen(document,"contextmenu",(p)=>this.onContextMenu(p),!0),this.listen(document,"mousemove",(p)=>this.onMouseMove(p),{capture:!0,passive:!0});for(let p of["pointerdown","mousedown","mouseup","click"])this.listen(document,p,(n)=>this.onPinModeEvent(n),!0);this.listen(document,"mousedown",(p)=>this.onOutsideMouseDown(p),!1),this.listen(document,"keydown",(p)=>this.onKeyDown(p),!0),this.listen(window,"scroll",()=>this.schedulePosition(),{passive:!0,capture:!0}),this.listen(window,"resize",()=>{let p=window.innerWidth!==this.lastWidth;if(this.lastWidth=window.innerWidth,this.card?.classList.contains("popover")||this.card?.classList.contains("composer"))this.card.style.maxHeight=`${Math.max(160,window.innerHeight-this.topOffset()-24)}px`,this.moveCard(this.card,this.card.offsetLeft,this.card.offsetTop);if(p)this.scheduleRefresh(80);else this.schedulePosition()})}bindAdminBar(){let p=document.querySelector("#wp-admin-bar-fbc-toggle > a");if(p)this.listen(p,"click",(n)=>{n.preventDefault(),this.setMode(!this.mode)})}async setMode(p){if(this.mode=p,!this.inPreview)try{window.localStorage.setItem(op,p?"1":"0")}catch{}if(document.querySelector("#wp-admin-bar-fbc-toggle")?.classList.toggle("fbc-on",p),!p){this.exitPinMode(),this.closeCard(),this.closeSidebar(),this.hideOutline(),this.toolbar?.remove(),this.toolbar=null,this.bannerEl?.remove(),this.bannerEl=null,this.pinsLayer.replaceChildren();for(let n of this.states.values())n.pin=null;this.mutationObserver?.disconnect();return}if(this.renderToolbar(),this.observeMutations(),!this.loaded)await this.loadItems();else this.refresh();if(this.cfg.openItem){let n=this.cfg.openItem;this.cfg.openItem=0,this.stripDeepLinkParam(),this.openDeepLink(n)}}stripDeepLinkParam(){let p=new URL(window.location.href);if(p.searchParams.has("fbc_item"))p.searchParams.delete("fbc_item"),window.history.replaceState(window.history.state,"",p.toString())}async loadItems(){try{let{items:p}=await this.api.listItems(this.pagePath),n=new Map(this.states);this.states.clear();for(let o of p){let x=n.get(o.id);n.delete(o.id),this.states.set(o.id,{item:o,el:x?.el??null,placement:"orphan",pin:x?.pin??null})}for(let o of n.values())o.pin?.remove();this.loaded=!0,this.refresh()}catch(p){this.toast(`Could not load feedback: ${p.message}`,!0)}}upsert(p){let n=this.states.get(p.id);if(n)n.item=p;else this.states.set(p.id,{item:p,el:null,placement:"orphan",pin:null});if(this.allItems){let o=this.allItems.findIndex((x)=>x.id===p.id);if(o>=0)this.allItems[o]=p;else this.allItems.push(p)}}remove(p){if(this.states.get(p)?.pin?.remove(),this.states.delete(p),this.allItems)this.allItems=this.allItems.filter((o)=>o.id!==p)}refresh(){for(let p of this.states.values()){if(!p.item.anchor){p.el=null,p.placement="note";continue}let n=p.el&&p.el.isConnected?p.el:E(p.item.anchor).el;p.el=n,p.placement=!n?"orphan":c(n)?"pinned":"hidden"}if(this.drawPins(),this.updateToolbarCount(),this.sidebar)this.renderSidebarList()}drawPins(){if(!this.mode)return;for(let p of this.states.values()){if(!(p.placement==="pinned"&&this.matchesStatus(p.item))){p.pin?.remove(),p.pin=null;continue}if(!p.pin){let r=b("button",{class:"pin",type:"button","aria-label":`Feedback #${p.item.id}: ${p.item.title}`,onclick:(i)=>{i.stopPropagation(),this.openPopover(p.item.id)}});p.pin=r,this.pinsLayer.append(r)}let o=p.item.status==="resolved",x=p.pin.classList.contains("pulse");p.pin.className=`pin ${p.item.type}${o?" resolved":""}${x?" pulse":""}`,p.pin.textContent=o?"✓":String(p.item.id),p.pin.title=`#${p.item.id} ${p.item.title}`}this.positionPins()}schedulePosition(){if(this.framePending||!this.mode)return;this.framePending=!0,requestAnimationFrame(()=>{if(this.framePending=!1,this.positionPins(),this.positionChrome(),this.selectedEl)this.hideOutline()})}scheduleRefresh(p=250){window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.mode&&this.refresh(),p)}positionPins(){for(let p of this.states.values()){if(!p.pin||!p.el||!p.item.anchor)continue;let n=p.el.getBoundingClientRect(),o=n.left+p.item.anchor.offsetX*n.width,x=n.top+p.item.anchor.offsetY*n.height;p.pin.style.transform=`translate(${Math.round(o)}px, ${Math.round(x)}px)`}}observeMutations(){if(!this.mutationObserver)this.mutationObserver=new MutationObserver((p)=>{if(p.every((n)=>n.target===this.host||this.host.contains(n.target)))return;this.schedulePosition(),this.scheduleRefresh(300)});this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden","open"]})}onContextMenu(p){if(!this.mode||p.altKey||this.inOverlay(p))return;let n=this.eventTarget(p);if(!n)return;p.preventDefault(),p.stopPropagation(),this.exitPinMode(),this.openTypeMenu(n,p.clientX,p.clientY)}onPinModeEvent(p){if(!this.pinMode||this.inOverlay(p)||p.button!==0)return;if(p.preventDefault(),p.stopImmediatePropagation(),p.type!=="click")return;let n=this.eventTarget(p),o=this.pinMode;if(this.exitPinMode(),n)o.done(n,p.clientX,p.clientY)}onOutsideMouseDown(p){if(this.card&&!this.inOverlay(p))this.closeCard()}onMouseMove(p){if(!this.mode||this.card&&!this.pinMode||!this.highlight&&!this.pinMode||this.inOverlay(p)){if(!this.pinMode)this.hideOutline();return}let n=this.eventTarget(p);if(!n||n===document.documentElement||n===document.body){this.hideOutline();return}this.drawOutline(n)}drawOutline(p){let n=p.getBoundingClientRect();Object.assign(this.outline.style,{left:`${n.left}px`,top:`${n.top}px`,width:`${n.width}px`,height:`${n.height}px`});let o=p.id?`#${p.id}`:"";this.outlineTag.textContent=`${p.tagName.toLowerCase()}${o}`,this.outline.classList.add("on")}onKeyDown(p){if(this.annotating)return;let n=p.composedPath()[0],o=n instanceof HTMLElement&&(n.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(n.tagName));if(p.altKey&&p.shiftKey&&p.code==="KeyF"&&!o){p.preventDefault(),this.setMode(!this.mode);return}if(p.key==="Escape"&&this.previewEl){p.preventDefault(),this.closePreview();return}if(p.key==="Escape"&&this.mode){if(this.pinMode)this.exitPinMode(),p.preventDefault();else if(this.card)this.closeCard(),p.preventDefault();else if(this.sidebar)this.closeSidebar(),p.preventDefault()}}eventTarget(p){let n=p.target;if(n instanceof Element)return n;if(n instanceof Node)return n.parentElement;return null}setHighlight(p){this.highlight=p;try{window.localStorage.setItem(rp,p?"1":"0")}catch{}if(!p)this.hideOutline();this.renderToolbar()}hideOutline(){if(this.selectedEl?.isConnected){this.drawOutline(this.selectedEl),this.outline.classList.add("locked");return}this.outline.classList.remove("on","locked")}enterPinMode(p){this.closeCard(),this.pinMode=p,this.hintEl?.remove(),this.hintEl=b("div",{class:"crosshair-hint",text:`${p.hint} · Esc to cancel`}),this.root.append(this.hintEl),document.documentElement.style.cursor="crosshair",this.renderToolbar()}exitPinMode(){if(!this.pinMode)return;this.pinMode=null,this.hintEl?.remove(),this.hintEl=null,document.documentElement.style.cursor="",this.hideOutline(),this.renderToolbar()}scripts=new Map;annotating=!1;async annotate(p){if(this.annotating)return null;this.annotating=!0;try{if(!window.FBCAnnotator)await this.loadBundle("annotator.js");let n=window.FBCAnnotator;if(!n)throw Error("The annotator could not load.");let o=this.cfg.brand?.primary??"#6953c4";return await n.open({image:p,mount:this.root,colors:["#e5383b",o,"#ffb703","#ffffff","#111111"]})}catch(n){return this.toast(n.message,!0),null}finally{this.annotating=!1}}loadBundle(p){let n=this.scripts.get(p);if(n)return n;let o=this.cfg.assetsUrl??"",x=new Promise((r,i)=>{let g=document.createElement("script");g.src=`${o}${p}${this.cfg.version?`?ver=${encodeURIComponent(this.cfg.version)}`:""}`,g.async=!0,g.onload=()=>r(),g.onerror=()=>{this.scripts.delete(p),i(Error(`Could not load ${p}`))},document.head.append(g)});return this.scripts.set(p,x),x}async startCapture(p){if(!this.cfg.shots||!this.cfg.assetsUrl)return null;try{if(!window.FBCCapture)await this.loadBundle("capture.js");let n=window.FBCCapture;if(!n)return null;return await n.captureViewport({marker:p,color:this.cfg.brand?.primary??"#6953c4"})}catch{return null}}assigneeOptions(){return[["0","Unassigned"],...this.cfg.assignees.people.map((p)=>[String(p.id),p.name])]}assigneeLabel(){return this.cfg.assignees.source==="teamwork"?"Assignee (Teamwork)":"Assignee"}safeAnchor(p,n,o){try{return I(p,n,o)}catch{return this.toast("Can't pin to that element. Try its container, or add a page note.",!0),null}}closeCard(p=!1){if(this.cardCleanup)this.cardCleanup(),this.cardCleanup=null;if(this.card?.remove(),this.card=null,!p)this.selectedEl=null,this.hideOutline()}showCard(p,n,o){if(this.closeCard(!0),this.hideOutline(),this.card=p,p.style.left="0px",p.style.top="0px",p.style.visibility="hidden",p.style.maxHeight=`${Math.max(160,window.innerHeight-this.topOffset()-24)}px`,this.root.append(p),this.moveCard(p,n+8,o+8),p.style.visibility="",typeof ResizeObserver<"u"){let r=new ResizeObserver(()=>{if(!p.isConnected)return r.disconnect();this.moveCard(p,p.offsetLeft,p.offsetTop)});r.observe(p)}p.addEventListener("load",()=>this.moveCard(p,p.offsetLeft,p.offsetTop),!0);let x=p.querySelector(":scope > .head");if(x)x.classList.add("drag"),x.title="Drag to move",x.addEventListener("pointerdown",(r)=>this.startCardDrag(p,r))}moveCard(p,n,o){let x=this.topOffset()+12,r=Math.max(12,window.innerWidth-p.offsetWidth-12),i=Math.max(x,window.innerHeight-p.offsetHeight-12);p.style.left=`${Math.round(Math.max(12,Math.min(n,r)))}px`,p.style.top=`${Math.round(Math.max(x,Math.min(o,i)))}px`}startCardDrag(p,n){if(n.button!==0||n.target.closest("button, a, input, select, textarea"))return;n.preventDefault();let o=n.currentTarget,x=n.clientX-p.offsetLeft,r=n.clientY-p.offsetTop;try{o.setPointerCapture(n.pointerId)}catch{}p.classList.add("dragging");let i=(a)=>this.moveCard(p,a.clientX-x,a.clientY-r),g=()=>{p.classList.remove("dragging"),o.removeEventListener("pointermove",i),o.removeEventListener("pointerup",g),o.removeEventListener("pointercancel",g)};o.addEventListener("pointermove",i),o.addEventListener("pointerup",g),o.addEventListener("pointercancel",g)}openTypeMenu(p,n,o){this.pendingShot=this.startCapture({x:n,y:o}),this.selectedEl=p;let x=this.cfg.labels.type,r=(a)=>this.openComposer(a,p,n,o),i=X.map((a,f)=>b("button",{type:"button",onclick:()=>r(a)},b("span",{class:`dot ${a}`}),x[a],b("kbd",{text:String(f+1)}))),g=b("div",{class:"card menu",role:"menu",onkeydown:(a)=>{let f=a.key,k=Number(f);if(k>=1&&k<=X.length)a.preventDefault(),r(X[k-1])}},b("div",{class:"menu-title",text:"Add feedback"}),...i,b("hr"),b("button",{type:"button",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},"Note for the whole page"));this.showCard(g,n,o),i[0].focus()}openComposer(p,n,o,x){this.selectedEl=n;let r=null;if(n){if(r=this.safeAnchor(n,o,x),!r)return}let i=this.cfg.labels,g=K("type",X.map((d)=>[d,i.type[d]]),p),a=b("input",{type:"text",name:"title",maxlength:255,required:!0,placeholder:"What needs attention?",autocomplete:"off"}),f=b("textarea",{name:"description",placeholder:"Details, steps to reproduce, what you expected… (optional)"}),k=K("priority",Object.keys(i.priority).map((d)=>[d,i.priority[d]]),"medium"),w=K("assignee_id",this.assigneeOptions(),"0"),z=b("input",{type:"checkbox",name:"due_on"});z.checked=!!this.cfg.due?.onByDefault;let J=b("input",{type:"date",name:"due_date",value:ip(this.cfg.due)});J.hidden=!z.checked,z.addEventListener("change",()=>{if(J.hidden=!z.checked,z.checked&&!J.value)J.value=ip(this.cfg.due)});let u=b("div",{class:"error",role:"alert"}),Q=b("button",{class:"btn primary",type:"submit",text:"Add"}),Z=this.pendingShot??this.startCapture(n?{x:o,y:x}:null);this.pendingShot=null;let $=null,v="",H=b("div",{class:"shot","aria-live":"polite"}),W=()=>{if(v)URL.revokeObjectURL(v);v=$?URL.createObjectURL($):"",H.replaceChildren(...$?[b("img",{src:v,alt:"Screenshot that will be attached"}),b("div",{class:"shot-actions"},b("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{if(!$)return;let d=await this.annotate($);if(d)$=d,Z=Promise.resolve(d),W()}}),this.cfg.shots?b("button",{type:"button",class:"btn link",text:"Remove screenshot",onclick:()=>{$=null,Z=Promise.resolve(null),W()}}):null)]:[]),H.hidden=!$};if(this.cfg.shots)H.textContent="Capturing screenshot…",Z.then((d)=>{if($=d,W(),!d)H.hidden=!0});else H.hidden=!0;let L=b("form",{class:"card composer",novalidate:!0,onsubmit:(d)=>{d.preventDefault(),j()}},b("div",{class:"head"},b("span",{class:"chip"},b("span",{class:`dot ${p}`}),n?`<${n.tagName.toLowerCase()}>`:"Whole page"),b("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),b("label",{class:"field"},b("span",{text:"Title"}),a),u,b("label",{class:"field"},b("span",{text:"Description"}),f),b("div",{class:"row"},b("label",{class:"field"},b("span",{text:"Type"}),g),b("label",{class:"field"},b("span",{text:"Priority"}),k)),b("label",{class:"field"},b("span",{text:this.assigneeLabel()}),w),this.cfg.assignees.fallback?b("div",{class:"meta hint",text:"Showing WordPress users until Teamwork is connected (Feedback → Settings). Then this lists your Teamwork project members."}):null,b("div",{class:"field due-field"},b("label",{class:"check"},z," Set date?"),J),H,b("div",{class:"actions"},b("button",{class:"btn link",type:"button",text:"Cancel",onclick:()=>this.closeCard()}),Q)),j=async()=>{if(!a.value.trim()){u.textContent="Add a short title.",a.focus();return}Q.disabled=!0;try{let d=this.cfg.shots?await Promise.race([Z,new Promise((ap)=>window.setTimeout(()=>ap(null),1e4))]):null,F=await this.api.createItem({type:g.value,title:a.value.trim(),description:f.value,priority:k.value,assignee_id:Number(w.value),assignee_source:this.cfg.assignees.source,due_date:z.checked&&J.value?J.value:null,page_path:this.pagePath,page_query:pp(),page_title:document.title,anchor:r,context:h(this.cfg)},$??d);if(v)URL.revokeObjectURL(v);if(F.due_next)this.cfg.due=F.due_next;this.closeCard(),this.upsert(F);let A=this.states.get(F.id);if(A&&n)A.el=n;if(this.refresh(),F.screenshot_error)this.toast(`Added #${F.id}, but the screenshot wasn’t saved: ${F.screenshot_error}`,!0);else this.toast(`Added #${F.id}`)}catch(d){u.textContent=d.message,Q.disabled=!1}};this.showCard(L,o,x),a.focus()}async openPopover(p,n){let o;try{o=await this.api.getItem(p)}catch(j){this.toast(j.message,!0);return}this.upsert(o);let x=this.cfg.labels,r=this.states.get(p),i=r?.pin?.getBoundingClientRect(),g=n?.x??(i?i.right:window.innerWidth/2-170),a=n?.y??(i?i.top:100),f=async(j)=>{try{let d=await this.api.updateItem(p,j);this.upsert(d),this.refresh(),this.openPopover(p,{x:parseFloat(L.style.left)-8,y:parseFloat(L.style.top)-8})}catch(d){this.toast(d.message,!0)}},k=K("status",Object.keys(x.status).map((j)=>[j,x.status[j]]),o.status,{onchange:()=>void f({status:k.value})}),w=K("assignee_id",this.assigneeOptions(),String(o.assignee_id),{onchange:()=>void f({assignee_id:Number(w.value),assignee_source:this.cfg.assignees.source})}),z=K("priority",Object.keys(x.priority).map((j)=>[j,x.priority[j]]),o.priority,{onchange:()=>void f({priority:z.value})}),J=b("input",{type:"date",name:"due_date",value:o.due_date??"",class:o.overdue?"overdue":"",onchange:()=>void f({due_date:J.value||null})}),u=b("textarea",{placeholder:"Reply… (type @ to mention)",rows:2}),Q=b("label",{class:"field mention-container"},u),Z=this.setupMentions(u,Q),$=b("ul",{class:"thread"},...(o.comments??[]).map((j)=>b("li",{class:j.kind},b("span",{class:"who",text:j.user_name}),b("span",{class:"when",text:O(j.created_at)}),this.renderMentionText("body",j.body)))),v=G(),H=o.breakpoint&&o.breakpoint!==v?b("div",{class:"notice",text:`Logged at ${o.breakpoint} (${o.context?.viewport_w??"?"}px). You are on ${v} (${window.innerWidth}px).`}):null,W=r?.placement==="orphan"?b("div",{class:"notice",text:"The element this was pinned to can’t be found on the page anymore. Use “Pin again” in the list to place it."}):null,L=b("div",{class:"card popover",role:"dialog","aria-label":`Feedback #${o.id}`},b("div",{class:"head"},b("span",{class:"chip"},b("span",{class:`dot ${o.type}`}),`${x.type[o.type]} #${o.id}`),b("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),b("div",{class:"t",style:"font-weight:700;font-size:15px;margin-bottom:4px",text:o.title}),b("div",{class:"meta",text:`Round ${o.round} · ${o.reporter_name} · ${O(o.created_at)}`}),o.breakpoint?b("div",{class:"meta bp-line"},b("span",{class:"chip",text:o.breakpoint}),` ${o.context?.viewport_w??"?"}px wide${o.context?.preview?` · ${o.context.preview} preview`:""}`):null,o.tw_task_url?b("div",{class:"meta"},b("a",{href:o.tw_task_url,target:"_blank",rel:"noopener",text:`Teamwork task #${o.tw_task_id} ↗`}),o.status==="resolved"?" · completed":" · status syncs from Teamwork"):o.tw_note?b("div",{class:"notice",text:o.tw_note}):null,H,W,o.description?this.renderMentionText("desc",o.description):null,o.screenshot_url?b("div",{class:"shot"},b("a",{href:o.screenshot_url,target:"_blank",rel:"noopener",title:"Open full screenshot"},b("img",{src:o.screenshot_url,alt:"Screenshot from when this was filed"})),b("div",{class:"shot-actions"},b("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{try{let j=await fetch(o.screenshot_url,{credentials:"same-origin",cache:"no-store"}),d=await this.annotate(await j.blob());if(!d)return;let F=await this.api.replaceScreenshot(o.id,d);this.upsert(F),this.toast(`Annotations saved on #${o.id}`),this.openPopover(p,{x:parseFloat(L.style.left)-8,y:parseFloat(L.style.top)-8})}catch(j){this.toast(j.message,!0)}}}))):null,b("div",{class:"row"},b("label",{class:"field"},b("span",{text:"Status"}),k),b("label",{class:"field"},b("span",{text:"Priority"}),z)),b("label",{class:"field"},b("span",{text:o.overdue?"Due date · overdue":"Due date"}),J),o.assignee_locked?b("div",{class:"field"},b("span",{text:this.assigneeLabel()}),b("div",{text:o.assignee_name||"Unassigned"}),b("div",{class:"meta",text:"In Teamwork now: change the assignee there."})):b("label",{class:"field"},b("span",{text:this.assigneeLabel()}),w),$,Q,b("div",{class:"actions"},b("a",{class:"btn link",href:`${this.cfg.adminUrl}&item=${o.id}`,target:"_blank",rel:"noopener",text:"Admin"}),o.can_delete?b("button",{class:"btn danger",type:"button",text:"Delete",onclick:()=>void this.deleteItem(o.id)}):null,b("button",{class:"btn primary",type:"button",text:"Reply",onclick:async()=>{if(!u.value.trim())return;try{await this.api.addComment(o.id,u.value),this.openPopover(p,{x:parseFloat(L.style.left)-8,y:parseFloat(L.style.top)-8})}catch(j){this.toast(j.message,!0)}}})));this.showCard(L,g,a),this.cardCleanup=Z}renderMentionText(p,n){let o=b("div",{class:p}),r=(this.cfg.assignees?.people??[]).map((a)=>a.name.trim().replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).filter((a)=>a.length>0).sort((a,f)=>f.length-a.length),i=r.length?new RegExp(`(@(?:${r.join("|")}|[A-Za-z0-9_.-]+))`,"g"):/(@[A-Za-z0-9_.-]+)/g,g=n.split(i);for(let a of g)if(a.startsWith("@"))o.append(b("span",{class:"mention",text:a}));else if(a)o.append(document.createTextNode(a));return o}setupMentions(p,n){let o=this.cfg.assignees?.people??[];if(!o.length)return()=>{};let x=null,r=0,i=-1,g=[],a=()=>{x?.remove(),x=null,i=-1,g=[]},f=(u)=>{let Q=p.value,Z=Q.slice(0,i),$=Q.slice(p.selectionEnd),v=`@${u.name} `;p.value=`${Z}${v}${$}`;let H=Z.length+v.length;p.setSelectionRange(H,H),p.focus(),a()},k=()=>{if(!x)x=b("div",{class:"mention-menu",role:"listbox"}),n.append(x);if(x.innerHTML="",!g.length){a();return}g.forEach((u,Q)=>{let Z=b("div",{class:`mention-item${Q===r?" is-active":""}`,role:"option",text:u.name,onclick:($)=>{$.preventDefault(),$.stopPropagation(),f(u)}});x?.append(Z)})},w=()=>{let u=typeof p.selectionStart==="number"&&p.selectionStart>0?p.selectionStart:p.value.length,Q=p.value.slice(0,u),Z=Q.lastIndexOf("@");if(Z===-1||Z>0&&!/\s/.test(Q[Z-1])){a();return}let $=Q.slice(Z+1).toLowerCase();if($.includes(`
`)){a();return}if(i=Z,g=o.filter((v)=>v.name.toLowerCase().includes($)).slice(0,5),r=0,g.length)k();else a()},z=(u)=>{if(!x)return;if(u.key==="ArrowDown")u.preventDefault(),r=(r+1)%g.length,k();else if(u.key==="ArrowUp")u.preventDefault(),r=(r-1+g.length)%g.length,k();else if(u.key==="Enter"||u.key==="Tab"){if(g[r])u.preventDefault(),f(g[r])}else if(u.key==="Escape")u.preventDefault(),u.stopPropagation(),a()};p.addEventListener("input",w),p.addEventListener("keydown",z);let J=(u)=>{if(x&&!x.contains(u.target)&&u.target!==p)a()};return document.addEventListener("click",J),()=>{a(),p.removeEventListener("input",w),p.removeEventListener("keydown",z),document.removeEventListener("click",J)}}reanchor(p){this.enterPinMode({hint:`Click the element #${p} belongs to`,done:async(n,o,x)=>{try{let r=this.safeAnchor(n,o,x);if(!r)return;let i=await this.api.updateItem(p,{anchor:r});this.upsert(i);let g=this.states.get(p);if(g)g.el=n;this.refresh(),this.toast(`Pinned #${p} again`)}catch(r){this.toast(r.message,!0)}}})}async deleteItem(p){if(!window.confirm(`Delete feedback #${p}? This can’t be undone.`))return;try{await this.api.deleteItem(p),this.closeCard(),this.remove(p),this.refresh(),this.toast(`Deleted #${p}`)}catch(n){this.toast(n.message,!0)}}async openDeepLink(p){let n=this.states.get(p);if(n?.el&&n.placement==="pinned")n.el.scrollIntoView({block:"center",behavior:"auto"}),await new Promise((x)=>requestAnimationFrame(()=>x(null))),this.positionPins(),n.pin?.classList.add("pulse");let o=n?.item;if(o?.breakpoint&&o.breakpoint!==G())this.showBanner(`#${p} was logged at ${o.breakpoint} (${o.context?.viewport_w??"?"}px wide). You're viewing at ${G()} (${window.innerWidth}px). Resize to reproduce.`);await this.openPopover(p)}unresolvedCount(){let p=0;for(let n of this.states.values())if(n.item.status!=="resolved")p++;return p}renderToolbar(){if(!this.mode)return;let p=this.unresolvedCount(),n=b("div",{class:"toolbar",role:"toolbar","aria-label":this.cfg.brand?.name??"Feedback"},b("button",{type:"button",class:"grip",title:"Drag to move · arrow keys snap to a corner","aria-label":"Move toolbar: drag, or use arrow keys to snap to a corner",text:"⠿",onpointerdown:(x)=>this.startDrag(x),onkeydown:(x)=>this.onGripKey(x)}),this.cfg.brand?.logo?b("span",{class:"brand",title:`${this.cfg.brand.name} · drag to move`,onpointerdown:(x)=>this.startDrag(x)},b("img",{src:this.cfg.brand.logo,alt:this.cfg.brand.name})):b("span",{class:"brand",title:"Drag to move",text:this.cfg.brand?.label??"Feedback",onpointerdown:(x)=>this.startDrag(x)}),b("button",{type:"button",class:this.pinMode?"on":"",title:"Click an element to pin feedback (or right-click anywhere)",text:"+ Add",onclick:()=>this.pinMode?this.exitPinMode():this.enterPinMode({hint:"Click any element to add feedback",done:(x,r,i)=>this.openTypeMenu(x,r,i)})}),b("button",{type:"button",text:"Page note",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)}),b("button",{type:"button",class:"icon-btn toggle","aria-pressed":String(this.highlight),title:this.highlight?"Hover highlight is on: click to turn off":"Hover highlight is off: click to turn on","aria-label":"Highlight elements on hover",onclick:()=>this.setHighlight(!this.highlight)},N("highlight")),this.inPreview?null:b("span",{class:"devices",role:"group","aria-label":"Preview at a device size"},...Y.map((x)=>x.id==="desktop"?b("button",{type:"button",class:"icon-btn","aria-pressed":"true",title:"Desktop: the page as you see it now","aria-label":"Desktop view (current)",onclick:()=>this.closePreview()},N(x.id)):b("button",{type:"button",class:"icon-btn","aria-pressed":"false",title:`Preview as ${x.label} (${x.w}px)`,"aria-label":`Preview as ${x.label}, ${x.w} pixels wide`,onclick:()=>this.openPreview(x.id)},N(x.id)))),b("button",{type:"button",class:this.sidebar?"on":"",onclick:()=>this.sidebar?this.closeSidebar():this.openSidebar()},b("span",{class:"label",text:"List"}),p?b("span",{class:"count",text:String(p)}):null),b("button",{type:"button",title:"Exit Feedback mode (Alt+Shift+F)","aria-label":"Exit Feedback mode",text:"×",onclick:()=>void this.setMode(!1)})),o=!!this.toolbar;if(n.hidden=!!this.previewEl,this.toolbar)this.toolbar.replaceWith(n);else this.root.append(n);if(this.toolbar=n,this.positionToolbar(!1),!o)this.positionChrome()}updateToolbarCount(){this.renderToolbar()}openPreview(p,n=!1){if(p==="desktop"){this.closePreview();return}let o=Y.find((v)=>v.id===p)??Y[0],x=n?o.h:o.w,r=n?o.w:o.h,i=`${o.label} ${x}×${r}`;this.closeCard(),this.exitPinMode();let g=this.previewEl?.querySelector("iframe"),a=new URL(g?.contentWindow?.location.href??window.location.href);a.searchParams.delete("fbc_item"),a.searchParams.set("fbc_preview","1"),this.previewEl?.remove();let f=b("iframe",{name:M,title:`${i} preview`,"data-device":i,src:a.toString()});f.style.width=`${x}px`,f.style.height=`${r}px`;let k=b("div",{class:"preview-device"},f),w=b("div",{class:"preview-stage"},k),z=b("div",{class:"preview-blocked",hidden:!0}),J=Y.map((v)=>b("button",{type:"button",class:"icon-btn","aria-pressed":String(v.id===o.id),title:v.id==="desktop"?"Desktop: back to the page itself":`${v.label} (${v.w}px)`,"aria-label":v.id==="desktop"?"Desktop: close the preview":`${v.label}, ${v.w} pixels wide`,onclick:()=>v.id==="desktop"?this.closePreview():this.openPreview(v.id,v.id===o.id?n:!1)},N(v.id),b("span",{class:"icon-label",text:v.label}))),u=()=>{window.open(a.toString(),M,`width=${x},height=${r},resizable=yes,scrollbars=yes`)},Q=b("div",{class:"preview-bar",role:"toolbar","aria-label":"Device preview"},b("strong",{text:"Device preview"}),b("div",{class:"preview-devices"},...J),b("button",{type:"button",title:"Rotate",text:"⟲ Rotate",onclick:()=>this.openPreview(o.id,!n)}),b("span",{class:"preview-label",text:i}),b("span",{class:"annotator-spacer"}),b("button",{type:"button",text:"Open in a window",onclick:u}),b("button",{type:"button",class:"preview-close",text:"Done",onclick:()=>this.closePreview()})),Z=b("div",{class:"preview",role:"dialog","aria-label":`Device preview: ${i}`},Q,w,z);if(this.previewEl=Z,this.root.append(Z),requestAnimationFrame(()=>{let v=w.getBoundingClientRect(),H=Math.min(1,(v.width-32)/x,(v.height-32)/r);k.style.width=`${Math.round(x*H)}px`,k.style.height=`${Math.round(r*H)}px`,f.style.transform=`scale(${H})`}),f.addEventListener("load",()=>{let v=!1;try{v=!!f.contentDocument&&f.contentDocument.location.href!=="about:blank"}catch{v=!1}if(!v)z.hidden=!1,z.replaceChildren(b("p",{text:"This site can’t be shown in a frame here."}),b("button",{type:"button",class:"btn primary",text:`Open ${i} in a window`,onclick:u}))}),this.pinsLayer.hidden=!0,this.toolbar)this.toolbar.hidden=!0;this.closeSidebar()}closePreview(){if(!this.previewEl)return;if(this.previewEl.remove(),this.previewEl=null,this.pinsLayer.hidden=!1,this.toolbar)this.toolbar.hidden=!1;this.loaded=!1,this.loadItems()}topOffset(){let p=document.getElementById("wpadminbar");if(!p)return 0;let n=p.getBoundingClientRect();return n.height>0?Math.max(0,Math.round(n.bottom)):0}toolbarTarget(p){let n=this.toolbar,o=n?.offsetWidth??0,x=n?.offsetHeight??0,r=this.topOffset(),i=p.endsWith("l")?U:window.innerWidth-o-U;if(p.endsWith("r")&&this.sidebar&&window.innerWidth>=bp+o+U*2)i-=bp;let g=p.startsWith("t")?r+U:window.innerHeight-x-U;return{x:Math.max(0,i),y:Math.max(r,g)}}nearestCorner(p,n){let o=this.topOffset(),x=n<o+(window.innerHeight-o)/2?"t":"b",r=p<window.innerWidth/2?"l":"r";return`${x}${r}`}positionToolbar(p=!1){let n=this.toolbar;if(!n||this.dragging)return;let{x:o,y:x}=this.toolbarTarget(this.corner);n.classList.toggle("snapping",p),n.style.left=`${o}px`,n.style.top=`${x}px`,n.dataset.corner=this.corner}positionChrome(){this.root.style.setProperty("--top-offset",`${this.topOffset()}px`);let p=this.toolbar?.offsetHeight??0,n=this.toolbar&&this.corner.startsWith("b")?p+U*2:24;this.root.style.setProperty("--toast-bottom",`${n}px`),this.positionToolbar(!1)}setCorner(p){this.corner=p;try{if(!this.inPreview)window.localStorage.setItem(xp,p)}catch{}this.positionToolbar(!0),this.positionChrome()}startDrag(p){let n=this.toolbar;if(!n||p.button!==0)return;p.preventDefault(),p.stopPropagation();let o=n.getBoundingClientRect(),x=p.clientX-o.left,r=p.clientY-o.top;this.dragging=!0,n.classList.remove("snapping"),n.classList.add("dragging"),this.ghost?.remove(),this.ghost=b("div",{class:"snap-ghost"}),Object.assign(this.ghost.style,{width:`${o.width}px`,height:`${o.height}px`}),this.root.append(this.ghost);let i=(a)=>{let f=this.topOffset(),k=Math.min(Math.max(a.clientX-x,0),window.innerWidth-o.width),w=Math.min(Math.max(a.clientY-r,f),window.innerHeight-o.height);n.style.left=`${k}px`,n.style.top=`${w}px`;let z=this.nearestCorner(k+o.width/2,w+o.height/2),J=this.toolbarTarget(z);if(this.ghost)Object.assign(this.ghost.style,{left:`${J.x}px`,top:`${J.y}px`});n.dataset.target=z},g=(a)=>{window.removeEventListener("pointermove",i,!0),window.removeEventListener("pointerup",g,!0),window.removeEventListener("pointercancel",g,!0);let f=n.getBoundingClientRect();this.dragging=!1,n.classList.remove("dragging"),this.ghost?.remove(),this.ghost=null,delete n.dataset.target,this.setCorner(a.type==="pointercancel"?this.corner:this.nearestCorner(f.left+f.width/2,f.top+f.height/2))};window.addEventListener("pointermove",i,!0),window.addEventListener("pointerup",g,!0),window.addEventListener("pointercancel",g,!0)}onGripKey(p){let o={ArrowLeft:(x)=>`${x[0]}l`,ArrowRight:(x)=>`${x[0]}r`,ArrowUp:(x)=>`t${x[1]}`,ArrowDown:(x)=>`b${x[1]}`}[p.key];if(!o)return;p.preventDefault(),this.setCorner(o(this.corner)),this.toolbar?.querySelector(".grip")?.focus()}openSidebar(){this.sidebar?.remove();let p=this.filters,n=this.cfg.labels,o=K("scope",[["page","This page"],["all","All pages"]],p.scope,{onchange:()=>{p.scope=o.value,this.renderSidebarList()}}),x=K("type",[["","All types"],...X.map((k)=>[k,n.type[k]])],p.type,{onchange:()=>{p.type=x.value,this.renderSidebarList()}}),r=K("status",[["unresolved","Unresolved"],["","Any status"],...Object.keys(n.status).map((k)=>[k,n.status[k]])],p.status,{onchange:()=>{p.status=r.value,this.drawPins(),this.renderSidebarList()}}),i=[["0","All rounds"]];for(let k=this.cfg.round;k>=1;k--)i.push([String(k),k===this.cfg.round?`Round ${k} (current)`:`Round ${k}`]);let g=K("round",i,String(p.round),{onchange:()=>{p.round=Number(g.value),this.renderSidebarList()}}),a=K("bp",[["","All breakpoints"],["mobile","Mobile"],["tablet","Tablet"],["desktop","Desktop"]],p.bp,{onchange:()=>{p.bp=a.value,this.renderSidebarList()}}),f=b("input",{type:"checkbox",onchange:()=>{p.mine=f.checked,this.renderSidebarList()}});f.checked=p.mine,this.sidebar=b("div",{class:"sidebar",role:"complementary","aria-label":"Feedback list"},b("header",{},b("h2",{},this.cfg.brand?.label??"Feedback",b("button",{class:"x",type:"button","aria-label":"Close list",text:"×",onclick:()=>this.closeSidebar()})),b("div",{class:"filters"},o,x,r,g,a,b("label",{},f,"Assigned to me"))),b("div",{class:"list"})),this.root.append(this.sidebar),this.renderToolbar(),this.renderSidebarList()}closeSidebar(){this.sidebar?.remove(),this.sidebar=null,this.renderToolbar()}matchesStatus(p){let n=this.filters.status;if(n==="unresolved")return p.status!=="resolved";return!n||p.status===n}matches(p){let n=this.filters;if(n.type&&p.type!==n.type)return!1;if(n.round&&p.round!==n.round)return!1;if(n.bp&&p.breakpoint!==n.bp)return!1;if(!this.matchesStatus(p))return!1;if(n.mine&&(!this.cfg.assignees.me||p.assignee_id!==this.cfg.assignees.me))return!1;return!0}async renderSidebarList(){let p=this.sidebar?.querySelector(".list");if(!p)return;let n=(r,i,g)=>b("button",{class:"entry",type:"button",onclick:i},b("span",{class:`num ${r.status==="resolved"?"resolved":r.type}`,text:`#${r.id}`}),b("span",{},b("span",{class:"t",text:r.title}),b("span",{class:"s",text:`Round ${r.round} · ${this.cfg.labels.status[r.status]}${r.assignee_name?` · ${r.assignee_name}`:""}${r.breakpoint?` · ${r.breakpoint}`:""}`})),g??null);if(this.filters.scope==="all"){if(!this.allItems){p.replaceChildren(b("div",{class:"empty",text:"Loading…"}));try{this.allItems=(await this.api.listItems()).items}catch(g){p.replaceChildren(b("div",{class:"empty",text:g.message}));return}}let r=new Map;for(let g of this.allItems.filter((a)=>this.matches(a))){let a=r.get(g.page_path)??[];a.push(g),r.set(g.page_path,a)}let i=[];for(let[g,a]of r){i.push(b("h3",{text:g===this.pagePath?`${g} (this page)`:g}));for(let f of a)i.push(n(f,()=>{if(f.page_path===this.pagePath)this.focusItem(f.id);else{let k=new URL(f.page_url,window.location.origin);k.searchParams.set("fbc_item",String(f.id)),window.location.href=k.toString()}}))}p.replaceChildren(...i.length?i:[b("div",{class:"empty",text:"Nothing matches these filters."})]);return}let o={pinned:{title:"On this page",nodes:[]},note:{title:"Page notes",nodes:[]},hidden:{title:"At other breakpoints",nodes:[]},orphan:{title:"Orphaned — element not found",nodes:[]}};for(let r of[...this.states.values()].sort((i,g)=>i.item.id-g.item.id)){if(!this.matches(r.item))continue;let i=r.placement==="orphan"?b("span",{class:"btn link reanchor",role:"button",text:"Pin again",onclick:(g)=>{g.stopPropagation(),this.reanchor(r.item.id)}}):null;o[r.placement].nodes.push(n(r.item,()=>this.focusItem(r.item.id),i))}let x=[];for(let r of["pinned","note","hidden","orphan"]){let i=o[r];if(!i.nodes.length)continue;let g=r==="hidden"?`${i.nodes.length} at other breakpoints`:i.title;x.push(b("h3",{text:g}),...i.nodes)}p.replaceChildren(...x.length?x:[b("div",{class:"empty",text:"No feedback on this page yet. Right-click anything to add some."})])}focusItem(p){let n=this.states.get(p);if(!n)return;if(n.placement==="pinned"&&n.el){if(!this.matchesStatus(n.item)){this.filters.status="";let o=this.sidebar?.querySelector('select[name="status"]');if(o)o.value="";this.drawPins(),this.renderSidebarList()}n.el.scrollIntoView({block:"center",behavior:"smooth"}),window.setTimeout(()=>{this.positionPins(),n.pin?.classList.remove("pulse"),n.pin?.offsetWidth,n.pin?.classList.add("pulse"),this.openPopover(p)},450)}else this.openPopover(p,{x:window.innerWidth-720,y:80})}toast(p,n=!1){let o=b("div",{class:`toast${n?" err":""}`,role:"status",text:p});this.root.append(o),window.setTimeout(()=>o.remove(),n?5000:2200)}showBanner(p){this.bannerEl?.remove(),this.bannerEl=b("div",{class:"banner",role:"status"},b("span",{text:p}),b("button",{type:"button",text:"Dismiss",onclick:()=>{this.bannerEl?.remove(),this.bannerEl=null}})),this.root.append(this.bannerEl)}}np();m();function Ap(){if(window.self===window.top)return!0;if(window.name!==M)return!1;try{return window.parent.location.origin===window.location.origin}catch{return!1}}function gp(){let p=window.fbcConfig;if(!p||!Ap())return;new D(p).init()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",gp,{once:!0});else gp();})();
