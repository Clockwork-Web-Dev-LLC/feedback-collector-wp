(()=>{var R=`:host {
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
/* Scope switch tabs (This page vs All pages) */
.scope-switch {
  display: flex;
  padding: 3px;
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: 6px;
  margin: 12px 14px 4px;
  gap: 3px;
}
.scope-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 13px;
  font-weight: 500;
  border: 0;
  background: transparent;
  color: var(--muted);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1.2;
}
.scope-tab:hover {
  color: var(--ink);
}
.scope-tab.active {
  background: #fff;
  color: var(--ink);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
.scope-tab .tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 9px;
  background: rgba(0, 0, 0, 0.06);
  color: var(--muted);
}
.scope-tab.active .tab-badge {
  background: var(--dark);
  color: var(--on-dark);
}
.scope-tab .tab-badge:empty {
  display: none;
}
.list-footer-prompt,
.list-empty-action {
  padding: 16px 14px 20px;
  text-align: center;
}
.btn-view-all {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid var(--line);
  background: #fff;
  color: var(--primary);
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
.btn-view-all:hover {
  background: var(--soft);
  border-color: #c3c4c7;
}
.filters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 8px 14px 12px;
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
`;var P="fbc-root";var vn=["ember","react-","__next","radix-","headlessui-","mui-","yui_","ext-gen"],un=/[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i,wn=/^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;function dn(n){let p=/[a-z]/i.test(n),o=/[0-9]/.test(n);if(!p||!o)return!1;if(n.length>=6&&/^[0-9a-f]+$/i.test(n))return!0;return n.length>=8&&/^[0-9a-z]+$/i.test(n)&&zn(n)>=2}function zn(n){let p=0;for(let o=1;o<n.length;o++){let x=/[0-9]/.test(n.charAt(o-1)),i=/[0-9]/.test(n.charAt(o));if(x!==i)p++}return p}function tn(n){if(n.trim()===""||/\s/.test(n))return!1;if(/^[0-9]/.test(n))return!1;if(/[0-9]{5,}/.test(n))return!1;if(un.test(n))return!1;if(wn.test(n))return!1;let p=n.toLowerCase();if(vn.some((o)=>p.startsWith(o)))return!1;return!n.split(/[-_:.]/).some(dn)}function jn(n){let p="",o=n.length,x=n.charCodeAt(0);for(let i=0;i<o;i++){let b=n.charCodeAt(i),a=n.charAt(i);if(b===0)p+="�";else if(b>=1&&b<=31||b===127||i===0&&b>=48&&b<=57||i===1&&b>=48&&b<=57&&x===45)p+=`\\${b.toString(16)} `;else if(i===0&&o===1&&b===45)p+=`\\${a}`;else if(b>=128||b===45||b===95||b>=48&&b<=57||b>=65&&b<=90||b>=97&&b<=122)p+=a;else p+=`\\${a}`}return p}function y(n,p){let o=p?p.CSS:void 0,x=globalThis.CSS,i=o?.escape??x?.escape;return i?i(n):jn(n)}function $n(n){return n.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}function q(n){return n.localName.toLowerCase()}function Jn(n){return n.ownerDocument.defaultView}function Zn(n){if(!n)return{x:0,y:0};let p=Number.isFinite(n.scrollX)?n.scrollX:0,o=Number.isFinite(n.scrollY)?n.scrollY:0;return{x:p,y:o}}function A(n){if(!Number.isFinite(n))return 0.5;return Math.min(1,Math.max(0,n))}function Y(n){let p=n;while(p){if(p.id==="fbc-root")return!0;if(p.parentElement)p=p.parentElement;else{let o=p.getRootNode();p=o instanceof ShadowRoot?o.host:null}}return!1}function C(n){if(n===null)return null;let p=n.replace(/\s+/g," ").trim();if(p==="")return null;let o=Array.from(p);return o.length>120?o.slice(0,120).join(""):p}var Qn=/^fl-node-(?!content$)[a-z0-9]+$/i,Kn=/^[a-z0-9]+$/i;function S(n){let p=1,o=n.previousElementSibling;while(o){if(o.localName===n.localName&&o.namespaceURI===n.namespaceURI)p++;o=o.previousElementSibling}return p}function T(n,p){if(!n.id||!tn(n.id))return null;let o=`#${y(n.id,p.defaultView)}`,x=p.querySelectorAll(o);return x.length===1&&x[0]===n?o:null}function Fn(n,p){if(n===p.documentElement)return"html";let o=n.localName,x=n.getAttribute("data-id");if(x!==null&&n.classList.contains("elementor-element")&&Kn.test(x))return`${o}[data-id="${$n(x)}"]`;let i=Array.from(n.classList).find((b)=>Qn.test(b));if(i!==void 0)return`${o}.${y(i,p.defaultView)}`;return`${o}:nth-of-type(${S(n)})`}function Ln(n,p,o){let x=o.querySelectorAll(n);return x.length===1&&x[0]===p}function Un(n,p){let o=[],x=n;while(x){let i=T(x,p);if(i!==null)return o.unshift(i),o.join(" > ");o.unshift(Fn(x,p));let b=o.join(" > ");if(Ln(b,n,p))return b;x=x.parentElement}return o.join(" > ")}function Wn(n,p){let o=[],x=n;while(x){let i=q(x),b=x.parentElement,a=x===p.documentElement||b===p.documentElement&&(i==="head"||i==="body");o.unshift(a?i:`${i}[${S(x)}]`),x=b}return`/${o.join("/")}`}var qn=/^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i,Hn=/^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;function Gn(n,p){if(!qn.test(n))return null;let o=n.slice(1).split("/"),x=null;for(let i of o){let b=Hn.exec(i);if(!b)return null;let a=(b[1]??"").toLowerCase(),g=b[2]===void 0?1:Number(b[2]),f=x?Array.from(x.children):p.documentElement?[p.documentElement]:[],u=0,v=null;for(let k of f){if(q(k)!==a)continue;if(u++,u===g){v=k;break}}if(!v)return null;x=v}return x}function I(n,p,o){if(!Number.isFinite(p)||!Number.isFinite(o))throw RangeError(`createAnchor: click coordinates must be finite (got ${p}, ${o})`);if(!n.isConnected)throw Error("createAnchor: element is not connected to a document");if(Y(n))throw Error("createAnchor: refusing to anchor an element inside #fbc-root");let x=n.ownerDocument;if(n.getRootNode()!==x)throw Error("createAnchor: element is inside a shadow root; anchor its shadow host instead");let i=n.getBoundingClientRect(),b=Zn(x.defaultView),a=i.width>0?A((p-i.left)/i.width):0.5,g=i.height>0?A((o-i.top)/i.height):0.5;return{id:T(n,x)!==null?n.id:null,selector:Un(n,x),xpath:Wn(n,x),text:C(n.textContent),tag:q(n),offsetX:a,offsetY:g,docX:p+b.x,docY:o+b.y}}function M(n,p){return n!==null&&q(n)===p&&!Y(n)}function Xn(n){return n instanceof DOMException||n instanceof Error&&n.name==="SyntaxError"}function sn(n,p){if(typeof n.id!=="string"||n.id==="")return null;let o=p.getElementById(n.id);if(!o)return null;return p.querySelectorAll(`#${y(n.id,p.defaultView)}`).length===1?o:null}function Mn(n,p){if(typeof n.selector!=="string"||n.selector.trim()==="")return null;let o;try{o=p.querySelectorAll(n.selector)}catch(x){if(Xn(x))return null;throw x}return o.length===1?o[0]??null:null}function Nn(n,p){if(typeof n.xpath!=="string")return null;return Gn(n.xpath,p)}function Vn(n,p){if(typeof n.text!=="string"||n.text==="")return null;let o=null;for(let x of Array.from(p.getElementsByTagName("*"))){if(q(x)!==n.tag||Y(x))continue;if(C(x.textContent)!==n.text)continue;if(o)return null;o=x}return o}function c(n,p=document){if(typeof n.tag!=="string"||n.tag==="")return{el:null,strategy:"none"};let o=n.tag.toLowerCase(),x=sn(n,p);if(M(x,o))return{el:x,strategy:"id"};let i,b=()=>{if(i===void 0)i=Vn({...n,tag:o},p);return M(i,o)?i:null},a=(v)=>{if(n.text===null||C(v.textContent)===n.text)return null;let k=b();return k&&k!==v?k:null},g=Mn(n,p);if(M(g,o)){let v=a(g);return v?{el:v,strategy:"text"}:{el:g,strategy:"selector"}}let f=Nn(n,p);if(M(f,o)){let v=a(f);return v?{el:v,strategy:"text"}:{el:f,strategy:"xpath"}}let u=b();if(u)return{el:u,strategy:"text"};return{el:null,strategy:"none"}}function E(n){if(!n.isConnected)return!1;let p=Jn(n);if(!p)return!1;let o=p.getComputedStyle(n);if(o.visibility==="hidden"||o.visibility==="collapse")return!1;let x=n;while(x){if(p.getComputedStyle(x).display==="none")return!1;x=x.parentElement}let i=n.getBoundingClientRect();return!(i.width===0&&i.height===0)}class l extends Error{status;constructor(n,p){super(n);this.status=p}}class B{cfg;constructor(n){this.cfg=n}url(n,p){let o=this.cfg.restUrl.replace(/\/$/,"")+n;if(p){let x=new URLSearchParams(p).toString();if(x)o+=(o.includes("?")?"&":"?")+x}return o}async request(n,p,o,x){let i=typeof FormData<"u"&&o instanceof FormData,b=await fetch(this.url(p,x),{method:n,credentials:"same-origin",headers:{"X-WP-Nonce":this.cfg.nonce,...o!==void 0&&!i?{"Content-Type":"application/json"}:{}},body:o===void 0?void 0:i?o:JSON.stringify(o)}),a=await b.json().catch(()=>null);if(!b.ok){let g=a&&typeof a==="object"&&"message"in a?String(a.message):b.statusText;throw new l(g,b.status)}return a}listItems(n){return this.request("GET","/items",void 0,n?{page_path:n}:void 0)}getItem(n){return this.request("GET",`/items/${n}`)}createItem(n,p){if(!p)return this.request("POST","/items",n);let o=new FormData;return o.append("data",JSON.stringify(n)),o.append("screenshot",p,"screenshot.jpg"),this.request("POST","/items",o)}savePrefs(n){return this.request("POST","/me/prefs",n)}replaceScreenshot(n,p){let o=new FormData;return o.append("screenshot",p,"screenshot.jpg"),this.request("POST",`/items/${n}/screenshot`,o)}updateItem(n,p){return this.request("PATCH",`/items/${n}`,p)}deleteItem(n){return this.request("DELETE",`/items/${n}`)}addComment(n,p){return this.request("POST",`/items/${n}/comments`,{body:p})}}function H(n=window.innerWidth){if(n<768)return"mobile";if(n<=1024)return"tablet";return"desktop"}function yn(n){let p=[[/Edg\/([\d.]+)/,"Edge"],[/OPR\/([\d.]+)/,"Opera"],[/Firefox\/([\d.]+)/,"Firefox"],[/CriOS\/([\d.]+)/,"Chrome iOS"],[/Chrome\/([\d.]+)/,"Chrome"],[/Version\/([\d.]+).*Safari/,"Safari"]];for(let[o,x]of p){let i=n.match(o);if(i)return`${x} ${i[1].split(".")[0]}`}return"Unknown"}function Yn(n){let p=n.match(/(iPhone|iPad).*OS ([\d_]+)/);if(p)return`iOS ${p[2].replace(/_/g,".")}`;if(p=n.match(/Android ([\d.]+)/),p)return`Android ${p[1]}`;if(p=n.match(/Windows NT ([\d.]+)/),p)return p[1]==="10.0"?"Windows 10/11":`Windows NT ${p[1]}`;if(p=n.match(/Mac OS X ([\d_]+)/),p)return`macOS ${p[1].replace(/_/g,".")}`;if(/CrOS/.test(n))return"ChromeOS";if(/Linux/.test(n))return"Linux";return"Unknown"}var N=null;function m(){let n=navigator.userAgentData;if(!n)return;n.getHighEntropyValues(["platform","platformVersion"]).then(({platform:p,platformVersion:o})=>{if(!p||!o)return;let[x,i]=o.split(".");if(p==="macOS")N=`macOS ${x}.${i??"0"}`;else if(p==="Windows")N=Number(x)>=13?"Windows 11":"Windows 10";else if(p==="Android"||p==="Chrome OS"||p==="Linux")N=`${p} ${o}`.trim()}).catch(()=>{})}function h(n){let p=navigator.userAgent;return{viewport_w:window.innerWidth,viewport_h:window.innerHeight,dpr:Math.round((window.devicePixelRatio||1)*100)/100,breakpoint:H(),browser:yn(p),os:N??Yn(p),user_agent:p,post_id:n.page.postId,post_type:n.page.postType,theme:n.page.theme,js_errors:(window.__fbcErrors??[]).slice(-20),preview:Cn()}}function Cn(){try{return window.self!==window.top?window.frameElement?.getAttribute("data-device")??"":""}catch{return""}}function e(n){let p=window.location.pathname,o=n.replace(/\/$/,"");if(o&&p.startsWith(o))p=p.slice(o.length);return p="/"+p.replace(/^\/+/,""),p==="/"?"/":p.replace(/\/?$/,"/")}function nn(){let n=new URLSearchParams(window.location.search);return n.delete("fbc_item"),n.toString()}function pn(){if(window.__fbcErrors)return;let n=window.__fbcErrors=[],p=(o)=>{if(n.push(o.slice(0,500)),n.length>20)n.shift()};window.addEventListener("error",(o)=>{if(o.message)p(`${o.message}${o.filename?` (${o.filename}:${o.lineno})`:""}`)}),window.addEventListener("unhandledrejection",(o)=>{let x=o.reason;p(`Unhandled rejection: ${x instanceof Error?x.message:String(x)}`)})}function r(n,p={},...o){let x=document.createElement(n);for(let[i,b]of Object.entries(p)){if(b===null||b===void 0||b===!1)continue;if(i.startsWith("on")&&typeof b==="function")x.addEventListener(i.slice(2).toLowerCase(),b);else if(i==="text")x.textContent=String(b);else if(i==="value"&&"value"in x)x.value=String(b);else if(b===!0)x.setAttribute(i,"");else x.setAttribute(i,String(b))}for(let i of o){if(i===null||i===void 0||i===!1)continue;x.append(typeof i==="number"?String(i):i)}return x}function K(n,p,o,x={}){let i=r("select",{name:n,...x});for(let[b,a]of p){let g=r("option",{value:b,text:a});if(b===o)g.selected=!0;i.append(g)}return i}function O(n){let p=new Date(n).getTime();if(Number.isNaN(p))return"";let o=Math.round((Date.now()-p)/1000);if(o<60)return"just now";let x=Math.round(o/60);if(x<60)return`${x}m ago`;let i=Math.round(x/60);if(i<24)return`${i}h ago`;let b=Math.round(i/24);if(b<30)return`${b}d ago`;return new Date(n).toLocaleDateString()}var Bn={phone:'<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',tablet:'<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M11 18.5h2"/>',desktop:'<rect x="2.5" y="4" width="19" height="12.5" rx="1.5"/><path d="M8.5 20.5h7M12 16.5v4"/>',highlight:'<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3"/><path d="M11 11l9 3.5-3.8 1.4-1.4 3.8z"/>'};function G(n){let p=document.createElement("span");return p.className="icon",p.setAttribute("aria-hidden","true"),p.innerHTML=`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${Bn[n]??""}</svg>`,p}var X=["bug","tweak","change","comment"],on="fbc:mode",xn="fbc:corner",rn="fbc:highlight",s="fbc-preview",V=[{id:"phone",label:"Mobile",w:390,h:844},{id:"tablet",label:"Tablet",w:820,h:1180},{id:"desktop",label:"Desktop",w:1440,h:900}],U=16,bn=360,On=["tl","tr","bl","br"];function _n(){let n=new Date;return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`}function Dn(n,p){let[o,x,i]=n.split("-").map(Number);return new Date(Date.UTC(o,x-1,i+p)).toISOString().slice(0,10)}function an(n,p=Date.now()){if(!n)return"";if(n.batchUntil&&p<n.batchUntil*1000)return n.suggest;if(!n.batchUntil&&n.suggest)return n.suggest;return Dn(_n(),n.days)}class _{cfg;api;host;root;pinsLayer;outline;outlineTag;toolbar=null;sidebar=null;card=null;hintEl=null;bannerEl=null;mode=!1;highlight=!0;pinMode=null;states=new Map;allItems=null;filters={scope:"page",type:"",status:"unresolved",mine:!1,round:0,bp:""};pagePath;framePending=!1;refreshTimer=0;lastWidth=window.innerWidth;mutationObserver=null;loaded=!1;corner="br";dragging=!1;ghost=null;pendingShot=null;inPreview=window.self!==window.top&&window.name===s;previewEl=null;selectedEl=null;unbinds=[];cardCleanup=null;constructor(n){this.cfg=n;this.api=new B(n),this.pagePath=n.pagePath??e(n.homePath)}destroy(){if(this.cardCleanup)this.cardCleanup(),this.cardCleanup=null;for(let n of this.unbinds)n();if(this.unbinds=[],this.mutationObserver)this.mutationObserver.disconnect(),this.mutationObserver=null;if(this.refreshTimer)window.clearTimeout(this.refreshTimer),this.refreshTimer=0;this.host?.remove()}listen(n,p,o,x){n.addEventListener(p,o,x),this.unbinds.push(()=>n.removeEventListener(p,o,x))}init(){this.mount(),this.bindGlobalEvents(),this.bindAdminBar();let n=!1,p=null,o=null;try{n=window.localStorage.getItem(on)==="1";let i=window.localStorage.getItem(xn);if(i&&On.includes(i))p=i;let b=window.localStorage.getItem(rn);if(b!==null)o=b!=="0"}catch{n=!1}let x=this.cfg.prefs??{};if(this.corner=x.corner??p??this.corner,this.highlight=x.highlight??o??!0,!this.inPreview){let i={};if(!x.corner&&p)i.corner=p;if(x.highlight===void 0&&o!==null)i.highlight=o;if(Object.keys(i).length)this.savePrefs(i)}if(this.inPreview){let i=document.createElement("style");i.textContent="#wpadminbar{display:none!important}html{margin-top:0!important}",document.head.append(i),this.corner="bl",this.setMode(!0);return}if(this.cfg.openItem||n)this.setMode(!0)}mount(){this.host=r("div",{id:P}),this.host.setAttribute("style","all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;");let n=this.host.attachShadow({mode:"open"});n.append(r("style",{text:R})),this.root=r("div",{class:"fbc"});let p=this.cfg.brand;if(p){let x=[["--primary",p.primary],["--on-primary",p.onPrimary],["--dark",p.dark],["--on-dark",p.onDark],["--brand-accent",p.accent],["--ink-primary",p.ink??""]];for(let[i,b]of x)if(b)this.root.style.setProperty(i,b)}let o=r("div",{class:"layer"});this.outlineTag=r("span",{class:"outline-tag"}),this.outline=r("div",{class:"outline"},this.outlineTag),this.pinsLayer=r("div"),o.append(this.outline,this.pinsLayer),this.root.append(o),n.append(this.root),document.body.append(this.host)}inOverlay(n){return n.composedPath().includes(this.host)}bindGlobalEvents(){this.listen(document,"contextmenu",(n)=>this.onContextMenu(n),!0),this.listen(document,"mousemove",(n)=>this.onMouseMove(n),{capture:!0,passive:!0});for(let n of["pointerdown","mousedown","mouseup","click"])this.listen(document,n,(p)=>this.onPinModeEvent(p),!0);this.listen(document,"mousedown",(n)=>this.onOutsideMouseDown(n),!1),this.listen(document,"keydown",(n)=>this.onKeyDown(n),!0),this.listen(window,"scroll",()=>this.schedulePosition(),{passive:!0,capture:!0}),this.listen(window,"resize",()=>{let n=window.innerWidth!==this.lastWidth;if(this.lastWidth=window.innerWidth,this.card?.classList.contains("popover")||this.card?.classList.contains("composer"))this.card.style.maxHeight=`${Math.max(160,window.innerHeight-this.topOffset()-24)}px`,this.moveCard(this.card,this.card.offsetLeft,this.card.offsetTop);if(n)this.scheduleRefresh(80);else this.schedulePosition()})}bindAdminBar(){let n=document.querySelector("#wp-admin-bar-fbc-toggle > a");if(n)this.listen(n,"click",(p)=>{p.preventDefault(),this.setMode(!this.mode)})}async setMode(n){if(this.mode=n,!this.inPreview)try{window.localStorage.setItem(on,n?"1":"0")}catch{}if(document.querySelector("#wp-admin-bar-fbc-toggle")?.classList.toggle("fbc-on",n),!n){this.exitPinMode(),this.closeCard(),this.closeSidebar(),this.hideOutline(),this.toolbar?.remove(),this.toolbar=null,this.bannerEl?.remove(),this.bannerEl=null,this.pinsLayer.replaceChildren();for(let p of this.states.values())p.pin=null;this.mutationObserver?.disconnect();return}if(this.renderToolbar(),this.observeMutations(),!this.loaded)await this.loadItems();else this.refresh();if(this.cfg.openItem){let p=this.cfg.openItem;this.cfg.openItem=0,this.stripDeepLinkParam(),this.openDeepLink(p)}}stripDeepLinkParam(){let n=new URL(window.location.href);if(n.searchParams.has("fbc_item"))n.searchParams.delete("fbc_item"),window.history.replaceState(window.history.state,"",n.toString())}async loadItems(){try{let{items:n}=await this.api.listItems(this.pagePath),p=new Map(this.states);this.states.clear();for(let o of n){let x=p.get(o.id);p.delete(o.id),this.states.set(o.id,{item:o,el:x?.el??null,placement:"orphan",pin:x?.pin??null})}for(let o of p.values())o.pin?.remove();this.loaded=!0,this.refresh()}catch(n){this.toast(`Could not load feedback: ${n.message}`,!0)}}upsert(n){let p=this.states.get(n.id);if(p)p.item=n;else this.states.set(n.id,{item:n,el:null,placement:"orphan",pin:null});if(this.allItems){let o=this.allItems.findIndex((x)=>x.id===n.id);if(o>=0)this.allItems[o]=n;else this.allItems.push(n)}this.updateScopeBadges()}remove(n){if(this.states.get(n)?.pin?.remove(),this.states.delete(n),this.allItems)this.allItems=this.allItems.filter((o)=>o.id!==n);this.updateScopeBadges()}refresh(){for(let n of this.states.values()){if(!n.item.anchor){n.el=null,n.placement="note";continue}let p=n.el&&n.el.isConnected?n.el:c(n.item.anchor).el;n.el=p,n.placement=!p?"orphan":E(p)?"pinned":"hidden"}if(this.drawPins(),this.updateToolbarCount(),this.sidebar)this.renderSidebarList()}drawPins(){if(!this.mode)return;for(let n of this.states.values()){if(!(n.placement==="pinned"&&this.matchesStatus(n.item))){n.pin?.remove(),n.pin=null;continue}if(!n.pin){let i=r("button",{class:"pin",type:"button","aria-label":`Feedback #${n.item.id}: ${n.item.title}`,onclick:(b)=>{b.stopPropagation(),this.openPopover(n.item.id)}});n.pin=i,this.pinsLayer.append(i)}let o=n.item.status==="resolved",x=n.pin.classList.contains("pulse");n.pin.className=`pin ${n.item.type}${o?" resolved":""}${x?" pulse":""}`,n.pin.textContent=o?"✓":String(n.item.id),n.pin.title=`#${n.item.id} ${n.item.title}`}this.positionPins()}schedulePosition(){if(this.framePending||!this.mode)return;this.framePending=!0,requestAnimationFrame(()=>{if(this.framePending=!1,this.positionPins(),this.positionChrome(),this.selectedEl)this.hideOutline()})}scheduleRefresh(n=250){window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.mode&&this.refresh(),n)}positionPins(){for(let n of this.states.values()){if(!n.pin||!n.el||!n.item.anchor)continue;let p=n.el.getBoundingClientRect(),o=p.left+n.item.anchor.offsetX*p.width,x=p.top+n.item.anchor.offsetY*p.height;n.pin.style.transform=`translate(${Math.round(o)}px, ${Math.round(x)}px)`}}observeMutations(){if(!this.mutationObserver)this.mutationObserver=new MutationObserver((n)=>{if(n.every((p)=>p.target===this.host||this.host.contains(p.target)))return;this.schedulePosition(),this.scheduleRefresh(300)});this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden","open"]})}onContextMenu(n){if(!this.mode||n.altKey||this.inOverlay(n))return;let p=this.eventTarget(n);if(!p)return;n.preventDefault(),n.stopPropagation(),this.exitPinMode(),this.openTypeMenu(p,n.clientX,n.clientY)}onPinModeEvent(n){if(!this.pinMode||this.inOverlay(n)||n.button!==0)return;if(n.preventDefault(),n.stopImmediatePropagation(),n.type!=="click")return;let p=this.eventTarget(n),o=this.pinMode;if(this.exitPinMode(),p)o.done(p,n.clientX,n.clientY)}onOutsideMouseDown(n){if(this.card&&!this.inOverlay(n))this.closeCard()}onMouseMove(n){if(!this.mode||this.card&&!this.pinMode||!this.highlight&&!this.pinMode||this.inOverlay(n)){if(!this.pinMode)this.hideOutline();return}let p=this.eventTarget(n);if(!p||p===document.documentElement||p===document.body){this.hideOutline();return}this.drawOutline(p)}drawOutline(n){let p=n.getBoundingClientRect();Object.assign(this.outline.style,{left:`${p.left}px`,top:`${p.top}px`,width:`${p.width}px`,height:`${p.height}px`});let o=n.id?`#${n.id}`:"";this.outlineTag.textContent=`${n.tagName.toLowerCase()}${o}`,this.outline.classList.add("on")}onKeyDown(n){if(this.annotating)return;let p=n.composedPath()[0],o=p instanceof HTMLElement&&(p.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(p.tagName));if(n.altKey&&n.shiftKey&&n.code==="KeyF"&&!o){n.preventDefault(),this.setMode(!this.mode);return}if(n.key==="Escape"&&this.previewEl){n.preventDefault(),this.closePreview();return}if(n.key==="Escape"&&this.mode){if(this.pinMode)this.exitPinMode(),n.preventDefault();else if(this.card)this.closeCard(),n.preventDefault();else if(this.sidebar)this.closeSidebar(),n.preventDefault()}}eventTarget(n){let p=n.target;if(p instanceof Element)return p;if(p instanceof Node)return p.parentElement;return null}setHighlight(n){this.highlight=n;try{window.localStorage.setItem(rn,n?"1":"0")}catch{}if(!this.inPreview)this.savePrefs({highlight:n});if(!n)this.hideOutline();this.renderToolbar()}hideOutline(){if(this.selectedEl?.isConnected){this.drawOutline(this.selectedEl),this.outline.classList.add("locked");return}this.outline.classList.remove("on","locked")}enterPinMode(n){this.closeCard(),this.pinMode=n,this.hintEl?.remove(),this.hintEl=r("div",{class:"crosshair-hint",text:`${n.hint} · Esc to cancel`}),this.root.append(this.hintEl),document.documentElement.style.cursor="crosshair",this.renderToolbar()}exitPinMode(){if(!this.pinMode)return;this.pinMode=null,this.hintEl?.remove(),this.hintEl=null,document.documentElement.style.cursor="",this.hideOutline(),this.renderToolbar()}scripts=new Map;annotating=!1;async annotate(n){if(this.annotating)return null;this.annotating=!0;try{if(!window.FBCAnnotator)await this.loadBundle("annotator.js");let p=window.FBCAnnotator;if(!p)throw Error("The annotator could not load.");let o=this.cfg.brand?.primary??"#6953c4";return await p.open({image:n,mount:this.root,colors:["#e5383b",o,"#ffb703","#ffffff","#111111"]})}catch(p){return this.toast(p.message,!0),null}finally{this.annotating=!1}}loadBundle(n){let p=this.scripts.get(n);if(p)return p;let o=this.cfg.assetsUrl??"",x=new Promise((i,b)=>{let a=document.createElement("script");a.src=`${o}${n}${this.cfg.version?`?ver=${encodeURIComponent(this.cfg.version)}`:""}`,a.async=!0,a.onload=()=>i(),a.onerror=()=>{this.scripts.delete(n),b(Error(`Could not load ${n}`))},document.head.append(a)});return this.scripts.set(n,x),x}async startCapture(n){if(!this.cfg.shots||!this.cfg.assetsUrl)return null;try{if(!window.FBCCapture)await this.loadBundle("capture.js");let p=window.FBCCapture;if(!p)return null;return await p.captureViewport({marker:n,color:this.cfg.brand?.primary??"#6953c4"})}catch{return null}}assigneeOptions(){return[["0","Unassigned"],...this.cfg.assignees.people.map((n)=>[String(n.id),n.name])]}assigneeLabel(){return this.cfg.assignees.source==="teamwork"?"Assignee (Teamwork)":"Assignee"}safeAnchor(n,p,o){try{return I(n,p,o)}catch{return this.toast("Can't pin to that element. Try its container, or add a page note.",!0),null}}closeCard(n=!1){if(this.cardCleanup)this.cardCleanup(),this.cardCleanup=null;if(this.card?.remove(),this.card=null,!n)this.selectedEl=null,this.hideOutline()}showCard(n,p,o){if(this.closeCard(!0),this.hideOutline(),this.card=n,n.style.left="0px",n.style.top="0px",n.style.visibility="hidden",n.style.maxHeight=`${Math.max(160,window.innerHeight-this.topOffset()-24)}px`,this.root.append(n),this.moveCard(n,p+8,o+8),n.style.visibility="",typeof ResizeObserver<"u"){let i=new ResizeObserver(()=>{if(!n.isConnected)return i.disconnect();this.moveCard(n,n.offsetLeft,n.offsetTop)});i.observe(n)}n.addEventListener("load",()=>this.moveCard(n,n.offsetLeft,n.offsetTop),!0);let x=n.querySelector(":scope > .head");if(x)x.classList.add("drag"),x.title="Drag to move",x.addEventListener("pointerdown",(i)=>this.startCardDrag(n,i))}moveCard(n,p,o){let x=this.topOffset()+12,i=Math.max(12,window.innerWidth-n.offsetWidth-12),b=Math.max(x,window.innerHeight-n.offsetHeight-12);n.style.left=`${Math.round(Math.max(12,Math.min(p,i)))}px`,n.style.top=`${Math.round(Math.max(x,Math.min(o,b)))}px`}startCardDrag(n,p){if(p.button!==0||p.target.closest("button, a, input, select, textarea"))return;p.preventDefault();let o=p.currentTarget,x=p.clientX-n.offsetLeft,i=p.clientY-n.offsetTop;try{o.setPointerCapture(p.pointerId)}catch{}n.classList.add("dragging");let b=(g)=>this.moveCard(n,g.clientX-x,g.clientY-i),a=()=>{n.classList.remove("dragging"),o.removeEventListener("pointermove",b),o.removeEventListener("pointerup",a),o.removeEventListener("pointercancel",a)};o.addEventListener("pointermove",b),o.addEventListener("pointerup",a),o.addEventListener("pointercancel",a)}openTypeMenu(n,p,o){this.pendingShot=this.startCapture({x:p,y:o}),this.selectedEl=n;let x=this.cfg.labels.type,i=(g)=>this.openComposer(g,n,p,o),b=X.map((g,f)=>r("button",{type:"button",onclick:()=>i(g)},r("span",{class:`dot ${g}`}),x[g],r("kbd",{text:String(f+1)}))),a=r("div",{class:"card menu",role:"menu",onkeydown:(g)=>{let f=g.key,u=Number(f);if(u>=1&&u<=X.length)g.preventDefault(),i(X[u-1])}},r("div",{class:"menu-title",text:"Add feedback"}),...b,r("hr"),r("button",{type:"button",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},"Note for the whole page"));this.showCard(a,p,o),b[0].focus()}openComposer(n,p,o,x){this.selectedEl=p;let i=null;if(p){if(i=this.safeAnchor(p,o,x),!i)return}let b=this.cfg.labels,a=K("type",X.map((z)=>[z,b.type[z]]),n),g=r("input",{type:"text",name:"title",maxlength:255,required:!0,placeholder:"What needs attention?",autocomplete:"off"}),f=r("textarea",{name:"description",placeholder:"Details, steps to reproduce, what you expected… (optional)"}),u=K("priority",Object.keys(b.priority).map((z)=>[z,b.priority[z]]),"medium"),v=K("assignee_id",this.assigneeOptions(),"0"),k=r("input",{type:"checkbox",name:"due_on"});k.checked=!!this.cfg.due?.onByDefault;let J=r("input",{type:"date",name:"due_date",value:an(this.cfg.due)});J.hidden=!k.checked,k.addEventListener("change",()=>{if(J.hidden=!k.checked,k.checked&&!J.value)J.value=an(this.cfg.due)});let d=r("div",{class:"error",role:"alert"}),Z=r("button",{class:"btn primary",type:"submit",text:"Add"}),$=this.pendingShot??this.startCapture(p?{x:o,y:x}:null);this.pendingShot=null;let j=null,w="",Q=r("div",{class:"shot","aria-live":"polite"}),W=()=>{if(w)URL.revokeObjectURL(w);w=j?URL.createObjectURL(j):"",Q.replaceChildren(...j?[r("img",{src:w,alt:"Screenshot that will be attached"}),r("div",{class:"shot-actions"},r("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{if(!j)return;let z=await this.annotate(j);if(z)j=z,$=Promise.resolve(z),W()}}),this.cfg.shots?r("button",{type:"button",class:"btn link",text:"Remove screenshot",onclick:()=>{j=null,$=Promise.resolve(null),W()}}):null)]:[]),Q.hidden=!j};if(this.cfg.shots)Q.textContent="Capturing screenshot…",$.then((z)=>{if(j=z,W(),!z)Q.hidden=!0});else Q.hidden=!0;let L=r("form",{class:"card composer",novalidate:!0,onsubmit:(z)=>{z.preventDefault(),t()}},r("div",{class:"head"},r("span",{class:"chip"},r("span",{class:`dot ${n}`}),p?`<${p.tagName.toLowerCase()}>`:"Whole page"),r("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),r("label",{class:"field"},r("span",{text:"Title"}),g),d,r("label",{class:"field"},r("span",{text:"Description"}),f),r("div",{class:"row"},r("label",{class:"field"},r("span",{text:"Type"}),a),r("label",{class:"field"},r("span",{text:"Priority"}),u)),r("label",{class:"field"},r("span",{text:this.assigneeLabel()}),v),this.cfg.assignees.fallback?r("div",{class:"meta hint",text:"Showing WordPress users until Teamwork is connected (Feedback → Settings). Then this lists your Teamwork project members."}):null,r("div",{class:"field due-field"},r("label",{class:"check"},k," Set date?"),J),Q,r("div",{class:"actions"},r("button",{class:"btn link",type:"button",text:"Cancel",onclick:()=>this.closeCard()}),Z)),t=async()=>{if(d.textContent="",!g.value.trim()){d.textContent="Add a short title.",g.focus();return}Z.disabled=!0;try{let z=this.cfg.shots?await Promise.race([$,new Promise((fn)=>window.setTimeout(()=>fn(null),1e4))]):null,F=await this.api.createItem({type:a.value,title:g.value.trim(),description:f.value,priority:u.value,assignee_id:Number(v.value),assignee_source:this.cfg.assignees.source,due_date:k.checked&&J.value?J.value:null,page_path:this.pagePath,page_query:nn(),page_title:document.title,anchor:i,context:h(this.cfg)},j??z);if(w)URL.revokeObjectURL(w);if(F.due_next)this.cfg.due=F.due_next;this.closeCard(),this.upsert(F);let D=this.states.get(F.id);if(D&&p)D.el=p;if(this.refresh(),F.screenshot_error)this.toast(`Added #${F.id}, but the screenshot wasn’t saved: ${F.screenshot_error}`,!0);else this.toast(`Added #${F.id}`)}catch(z){d.textContent=z.message,Z.disabled=!1}};this.showCard(L,o,x),g.focus()}async openPopover(n,p){let o;try{o=await this.api.getItem(n)}catch(t){this.toast(t.message,!0);return}this.upsert(o);let x=this.cfg.labels,i=this.states.get(n),b=i?.pin?.getBoundingClientRect(),a=p?.x??(b?b.right:window.innerWidth/2-170),g=p?.y??(b?b.top:100),f=async(t)=>{try{let z=await this.api.updateItem(n,t);this.upsert(z),this.refresh(),this.openPopover(n,{x:parseFloat(L.style.left)-8,y:parseFloat(L.style.top)-8})}catch(z){this.toast(z.message,!0)}},u=K("status",Object.keys(x.status).map((t)=>[t,x.status[t]]),o.status,{onchange:()=>void f({status:u.value})}),v=K("assignee_id",this.assigneeOptions(),String(o.assignee_id),{onchange:()=>void f({assignee_id:Number(v.value),assignee_source:this.cfg.assignees.source})}),k=K("priority",Object.keys(x.priority).map((t)=>[t,x.priority[t]]),o.priority,{onchange:()=>void f({priority:k.value})}),J=r("input",{type:"date",name:"due_date",value:o.due_date??"",class:o.overdue?"overdue":"",onchange:()=>void f({due_date:J.value||null})}),d=r("textarea",{placeholder:"Reply… (type @ to mention)",rows:2}),Z=r("label",{class:"field mention-container"},d),$=this.setupMentions(d,Z),j=r("ul",{class:"thread"},...(o.comments??[]).map((t)=>r("li",{class:t.kind},r("span",{class:"who",text:t.user_name}),r("span",{class:"when",text:O(t.created_at)}),this.renderMentionText("body",t.body)))),w=H(),Q=o.breakpoint&&o.breakpoint!==w?r("div",{class:"notice",text:`Logged at ${o.breakpoint} (${o.context?.viewport_w??"?"}px). You are on ${w} (${window.innerWidth}px).`}):null,W=i?.placement==="orphan"?r("div",{class:"notice",text:"The element this was pinned to can’t be found on the page anymore. Use “Pin again” in the list to place it."}):null,L=r("div",{class:"card popover",role:"dialog","aria-label":`Feedback #${o.id}`},r("div",{class:"head"},r("span",{class:"chip"},r("span",{class:`dot ${o.type}`}),`${x.type[o.type]} #${o.id}`),r("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),r("div",{class:"t",style:"font-weight:700;font-size:15px;margin-bottom:4px",text:o.title}),r("div",{class:"meta",text:`Round ${o.round} · ${o.reporter_name} · ${O(o.created_at)}`}),o.breakpoint?r("div",{class:"meta bp-line"},r("span",{class:"chip",text:o.breakpoint}),` ${o.context?.viewport_w??"?"}px wide${o.context?.preview?` · ${o.context.preview} preview`:""}`):null,o.tw_task_url?r("div",{class:"meta"},r("a",{href:o.tw_task_url,target:"_blank",rel:"noopener",text:`Teamwork task #${o.tw_task_id} ↗`}),o.status==="resolved"?" · completed":" · status syncs from Teamwork"):o.tw_note?r("div",{class:"notice",text:o.tw_note}):null,Q,W,o.description?this.renderMentionText("desc",o.description):null,o.screenshot_url?r("div",{class:"shot"},r("a",{href:o.screenshot_url,target:"_blank",rel:"noopener",title:"Open full screenshot"},r("img",{src:o.screenshot_url,alt:"Screenshot from when this was filed"})),r("div",{class:"shot-actions"},r("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{try{let t=await fetch(o.screenshot_url,{credentials:"same-origin",cache:"no-store"}),z=await this.annotate(await t.blob());if(!z)return;let F=await this.api.replaceScreenshot(o.id,z);this.upsert(F),this.toast(`Annotations saved on #${o.id}`),this.openPopover(n,{x:parseFloat(L.style.left)-8,y:parseFloat(L.style.top)-8})}catch(t){this.toast(t.message,!0)}}}))):null,r("div",{class:"row"},r("label",{class:"field"},r("span",{text:"Status"}),u),r("label",{class:"field"},r("span",{text:"Priority"}),k)),r("label",{class:"field"},r("span",{text:o.overdue?"Due date · overdue":"Due date"}),J),o.assignee_locked?r("div",{class:"field"},r("span",{text:this.assigneeLabel()}),r("div",{text:o.assignee_name||"Unassigned"}),r("div",{class:"meta",text:"In Teamwork now: change the assignee there."})):r("label",{class:"field"},r("span",{text:this.assigneeLabel()}),v),j,Z,r("div",{class:"actions"},r("a",{class:"btn link",href:`${this.cfg.adminUrl}&item=${o.id}`,target:"_blank",rel:"noopener",text:"Admin"}),o.can_delete?r("button",{class:"btn danger",type:"button",text:"Delete",onclick:()=>void this.deleteItem(o.id)}):null,r("button",{class:"btn primary",type:"button",text:"Reply",onclick:async()=>{if(!d.value.trim())return;try{await this.api.addComment(o.id,d.value),this.openPopover(n,{x:parseFloat(L.style.left)-8,y:parseFloat(L.style.top)-8})}catch(t){this.toast(t.message,!0)}}})));this.showCard(L,a,g),this.cardCleanup=$}renderMentionText(n,p){let o=r("div",{class:n}),i=(this.cfg.assignees?.people??[]).map((g)=>g.name.trim().replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).filter((g)=>g.length>0).sort((g,f)=>f.length-g.length),b=i.length?new RegExp(`(@(?:${i.join("|")}|[A-Za-z0-9_.-]+))`,"g"):/(@[A-Za-z0-9_.-]+)/g,a=p.split(b);for(let g of a)if(g.startsWith("@"))o.append(r("span",{class:"mention",text:g}));else if(g)o.append(document.createTextNode(g));return o}setupMentions(n,p){let o=this.cfg.assignees?.people??[];if(!o.length)return()=>{};let x=null,i=0,b=-1,a=[],g=()=>{x?.remove(),x=null,b=-1,a=[]},f=(d)=>{let Z=n.value,$=Z.slice(0,b),j=Z.slice(n.selectionEnd),w=`@${d.name} `;n.value=`${$}${w}${j}`;let Q=$.length+w.length;n.setSelectionRange(Q,Q),n.focus(),g()},u=()=>{if(!x)x=r("div",{class:"mention-menu",role:"listbox"}),p.append(x);if(x.innerHTML="",!a.length){g();return}a.forEach((d,Z)=>{let $=r("div",{class:`mention-item${Z===i?" is-active":""}`,role:"option",text:d.name,onclick:(j)=>{j.preventDefault(),j.stopPropagation(),f(d)}});x?.append($)})},v=()=>{let d=typeof n.selectionStart==="number"&&n.selectionStart>0?n.selectionStart:n.value.length,Z=n.value.slice(0,d),$=Z.lastIndexOf("@");if($===-1||$>0&&!/\s/.test(Z[$-1])){g();return}let j=Z.slice($+1).toLowerCase();if(j.includes(`
`)){g();return}if(b=$,a=o.filter((w)=>w.name.toLowerCase().includes(j)).slice(0,5),i=0,a.length)u();else g()},k=(d)=>{if(!x)return;if(d.key==="ArrowDown")d.preventDefault(),i=(i+1)%a.length,u();else if(d.key==="ArrowUp")d.preventDefault(),i=(i-1+a.length)%a.length,u();else if(d.key==="Enter"||d.key==="Tab"){if(a[i])d.preventDefault(),f(a[i])}else if(d.key==="Escape")d.preventDefault(),d.stopPropagation(),g()};n.addEventListener("input",v),n.addEventListener("keydown",k);let J=(d)=>{if(x&&!x.contains(d.target)&&d.target!==n)g()};return document.addEventListener("click",J),()=>{g(),n.removeEventListener("input",v),n.removeEventListener("keydown",k),document.removeEventListener("click",J)}}reanchor(n){this.enterPinMode({hint:`Click the element #${n} belongs to`,done:async(p,o,x)=>{try{let i=this.safeAnchor(p,o,x);if(!i)return;let b=await this.api.updateItem(n,{anchor:i});this.upsert(b);let a=this.states.get(n);if(a)a.el=p;this.refresh(),this.toast(`Pinned #${n} again`)}catch(i){this.toast(i.message,!0)}}})}async deleteItem(n){if(!window.confirm(`Delete feedback #${n}? This can’t be undone.`))return;try{await this.api.deleteItem(n),this.closeCard(),this.remove(n),this.refresh(),this.toast(`Deleted #${n}`)}catch(p){this.toast(p.message,!0)}}async openDeepLink(n){let p=this.states.get(n);if(p?.el&&p.placement==="pinned")p.el.scrollIntoView({block:"center",behavior:"auto"}),await new Promise((x)=>requestAnimationFrame(()=>x(null))),this.positionPins(),p.pin?.classList.add("pulse");let o=p?.item;if(o?.breakpoint&&o.breakpoint!==H())this.showBanner(`#${n} was logged at ${o.breakpoint} (${o.context?.viewport_w??"?"}px wide). You're viewing at ${H()} (${window.innerWidth}px). Resize to reproduce.`);await this.openPopover(n)}unresolvedCount(){let n=0;for(let p of this.states.values())if(p.item.status!=="resolved")n++;return n}renderToolbar(){if(!this.mode)return;let n=this.unresolvedCount(),p=r("div",{class:"toolbar",role:"toolbar","aria-label":this.cfg.brand?.name??"Feedback"},r("button",{type:"button",class:"grip",title:"Drag to move · arrow keys snap to a corner","aria-label":"Move toolbar: drag, or use arrow keys to snap to a corner",text:"⠿",onpointerdown:(x)=>this.startDrag(x),onkeydown:(x)=>this.onGripKey(x)}),this.cfg.brand?.logo?r("span",{class:"brand",title:`${this.cfg.brand.name} · drag to move`,onpointerdown:(x)=>this.startDrag(x)},r("img",{src:this.cfg.brand.logo,alt:this.cfg.brand.name})):r("span",{class:"brand",title:"Drag to move",text:this.cfg.brand?.label??"Feedback",onpointerdown:(x)=>this.startDrag(x)}),r("button",{type:"button",class:this.pinMode?"on":"",title:"Click an element to pin feedback (or right-click anywhere)",text:"+ Add",onclick:()=>this.pinMode?this.exitPinMode():this.enterPinMode({hint:"Click any element to add feedback",done:(x,i,b)=>this.openTypeMenu(x,i,b)})}),r("button",{type:"button",text:"Page note",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)}),r("button",{type:"button",class:"icon-btn toggle","aria-pressed":String(this.highlight),title:this.highlight?"Hover highlight is on: click to turn off":"Hover highlight is off: click to turn on","aria-label":"Highlight elements on hover",onclick:()=>this.setHighlight(!this.highlight)},G("highlight")),this.inPreview?null:r("span",{class:"devices",role:"group","aria-label":"Preview at a device size"},...V.map((x)=>x.id==="desktop"?r("button",{type:"button",class:"icon-btn","aria-pressed":"true",title:"Desktop: the page as you see it now","aria-label":"Desktop view (current)",onclick:()=>this.closePreview()},G(x.id)):r("button",{type:"button",class:"icon-btn","aria-pressed":"false",title:`Preview as ${x.label} (${x.w}px)`,"aria-label":`Preview as ${x.label}, ${x.w} pixels wide`,onclick:()=>this.openPreview(x.id)},G(x.id)))),r("button",{type:"button",class:this.sidebar?"on":"",onclick:()=>this.sidebar?this.closeSidebar():this.openSidebar()},r("span",{class:"label",text:"List"}),n?r("span",{class:"count",text:String(n)}):null),r("button",{type:"button",title:"Exit Feedback mode (Alt+Shift+F)","aria-label":"Exit Feedback mode",text:"×",onclick:()=>void this.setMode(!1)})),o=!!this.toolbar;if(p.hidden=!!this.previewEl,this.toolbar)this.toolbar.replaceWith(p);else this.root.append(p);if(this.toolbar=p,this.positionToolbar(!1),!o)this.positionChrome()}updateToolbarCount(){this.renderToolbar()}openPreview(n,p=!1){if(n==="desktop"){this.closePreview();return}let o=V.find((w)=>w.id===n)??V[0],x=p?o.h:o.w,i=p?o.w:o.h,b=`${o.label} ${x}×${i}`;this.closeCard(),this.exitPinMode();let a=this.previewEl?.querySelector("iframe"),g=new URL(a?.contentWindow?.location.href??window.location.href);g.searchParams.delete("fbc_item"),g.searchParams.set("fbc_preview","1"),this.previewEl?.remove();let f=r("iframe",{name:s,title:`${b} preview`,"data-device":b,src:g.toString()});f.style.width=`${x}px`,f.style.height=`${i}px`;let u=r("div",{class:"preview-device"},f),v=r("div",{class:"preview-stage"},u),k=r("div",{class:"preview-blocked",hidden:!0}),J=V.map((w)=>r("button",{type:"button",class:"icon-btn","aria-pressed":String(w.id===o.id),title:w.id==="desktop"?"Desktop: back to the page itself":`${w.label} (${w.w}px)`,"aria-label":w.id==="desktop"?"Desktop: close the preview":`${w.label}, ${w.w} pixels wide`,onclick:()=>w.id==="desktop"?this.closePreview():this.openPreview(w.id,w.id===o.id?p:!1)},G(w.id),r("span",{class:"icon-label",text:w.label}))),d=()=>{window.open(g.toString(),s,`width=${x},height=${i},resizable=yes,scrollbars=yes`)},Z=r("div",{class:"preview-bar",role:"toolbar","aria-label":"Device preview"},r("strong",{text:"Device preview"}),r("div",{class:"preview-devices"},...J),r("button",{type:"button",title:"Rotate",text:"⟲ Rotate",onclick:()=>this.openPreview(o.id,!p)}),r("span",{class:"preview-label",text:b}),r("span",{class:"annotator-spacer"}),r("button",{type:"button",text:"Open in a window",onclick:d}),r("button",{type:"button",class:"preview-close",text:"Done",onclick:()=>this.closePreview()})),$=r("div",{class:"preview",role:"dialog","aria-label":`Device preview: ${b}`},Z,v,k);if(this.previewEl=$,this.root.append($),requestAnimationFrame(()=>{let w=v.getBoundingClientRect(),Q=Math.min(1,(w.width-32)/x,(w.height-32)/i);u.style.width=`${Math.round(x*Q)}px`,u.style.height=`${Math.round(i*Q)}px`,f.style.transform=`scale(${Q})`}),f.addEventListener("load",()=>{let w=!1;try{w=!!f.contentDocument&&f.contentDocument.location.href!=="about:blank"}catch{w=!1}if(!w)k.hidden=!1,k.replaceChildren(r("p",{text:"This site can’t be shown in a frame here."}),r("button",{type:"button",class:"btn primary",text:`Open ${b} in a window`,onclick:d}))}),this.pinsLayer.hidden=!0,this.toolbar)this.toolbar.hidden=!0;this.closeSidebar()}closePreview(){if(!this.previewEl)return;if(this.previewEl.remove(),this.previewEl=null,this.pinsLayer.hidden=!1,this.toolbar)this.toolbar.hidden=!1;this.loaded=!1,this.loadItems()}topOffset(){let n=document.getElementById("wpadminbar");if(!n)return 0;let p=n.getBoundingClientRect();return p.height>0?Math.max(0,Math.round(p.bottom)):0}toolbarTarget(n){let p=this.toolbar,o=p?.offsetWidth??0,x=p?.offsetHeight??0,i=this.topOffset(),b=n.endsWith("l")?U:window.innerWidth-o-U;if(n.endsWith("r")&&this.sidebar&&window.innerWidth>=bn+o+U*2)b-=bn;let a=n.startsWith("t")?i+U:window.innerHeight-x-U;return{x:Math.max(0,b),y:Math.max(i,a)}}nearestCorner(n,p){let o=this.topOffset(),x=p<o+(window.innerHeight-o)/2?"t":"b",i=n<window.innerWidth/2?"l":"r";return`${x}${i}`}positionToolbar(n=!1){let p=this.toolbar;if(!p||this.dragging)return;let{x:o,y:x}=this.toolbarTarget(this.corner);p.classList.toggle("snapping",n),p.style.left=`${o}px`,p.style.top=`${x}px`,p.dataset.corner=this.corner}positionChrome(){this.root.style.setProperty("--top-offset",`${this.topOffset()}px`);let n=this.toolbar?.offsetHeight??0,p=this.toolbar&&this.corner.startsWith("b")?n+U*2:24;this.root.style.setProperty("--toast-bottom",`${p}px`),this.positionToolbar(!1)}savePrefs(n){this.cfg.prefs={...this.cfg.prefs??{},...n},this.api.savePrefs(n).catch(()=>{})}setCorner(n){this.corner=n;try{if(!this.inPreview)window.localStorage.setItem(xn,n)}catch{}if(!this.inPreview)this.savePrefs({corner:n});this.positionToolbar(!0),this.positionChrome()}startDrag(n){let p=this.toolbar;if(!p||n.button!==0)return;n.preventDefault(),n.stopPropagation();let o=p.getBoundingClientRect(),x=n.clientX-o.left,i=n.clientY-o.top;this.dragging=!0,p.classList.remove("snapping"),p.classList.add("dragging"),this.ghost?.remove(),this.ghost=r("div",{class:"snap-ghost"}),Object.assign(this.ghost.style,{width:`${o.width}px`,height:`${o.height}px`}),this.root.append(this.ghost);let b=(g)=>{let f=this.topOffset(),u=Math.min(Math.max(g.clientX-x,0),window.innerWidth-o.width),v=Math.min(Math.max(g.clientY-i,f),window.innerHeight-o.height);p.style.left=`${u}px`,p.style.top=`${v}px`;let k=this.nearestCorner(u+o.width/2,v+o.height/2),J=this.toolbarTarget(k);if(this.ghost)Object.assign(this.ghost.style,{left:`${J.x}px`,top:`${J.y}px`});p.dataset.target=k},a=(g)=>{window.removeEventListener("pointermove",b,!0),window.removeEventListener("pointerup",a,!0),window.removeEventListener("pointercancel",a,!0);let f=p.getBoundingClientRect();this.dragging=!1,p.classList.remove("dragging"),this.ghost?.remove(),this.ghost=null,delete p.dataset.target,this.setCorner(g.type==="pointercancel"?this.corner:this.nearestCorner(f.left+f.width/2,f.top+f.height/2))};window.addEventListener("pointermove",b,!0),window.addEventListener("pointerup",a,!0),window.addEventListener("pointercancel",a,!0)}onGripKey(n){let o={ArrowLeft:(x)=>`${x[0]}l`,ArrowRight:(x)=>`${x[0]}r`,ArrowUp:(x)=>`t${x[1]}`,ArrowDown:(x)=>`b${x[1]}`}[n.key];if(!o)return;n.preventDefault(),this.setCorner(o(this.corner)),this.toolbar?.querySelector(".grip")?.focus()}openSidebar(){this.sidebar?.remove();let n=this.filters,p=this.cfg.labels,o=r("button",{type:"button",class:`scope-tab ${n.scope==="page"?"active":""}`,"data-scope":"page","aria-selected":String(n.scope==="page"),role:"tab",onclick:()=>this.setScope("page")},r("span",{class:"tab-label",text:"This page"}),r("span",{class:"tab-badge",text:String(this.states.size)})),x=r("button",{type:"button",class:`scope-tab ${n.scope==="all"?"active":""}`,"data-scope":"all","aria-selected":String(n.scope==="all"),role:"tab",onclick:()=>this.setScope("all")},r("span",{class:"tab-label",text:"All pages"}),r("span",{class:"tab-badge",text:this.allItems?String(this.allItems.length):""})),i=r("div",{class:"scope-switch",role:"tablist","aria-label":"Feedback scope"},o,x),b=K("type",[["","All types"],...X.map((k)=>[k,p.type[k]])],n.type,{onchange:()=>{n.type=b.value,this.renderSidebarList()}}),a=K("status",[["unresolved","Unresolved"],["","Any status"],...Object.keys(p.status).map((k)=>[k,p.status[k]])],n.status,{onchange:()=>{n.status=a.value,this.drawPins(),this.renderSidebarList()}}),g=[["0","All rounds"]];for(let k=this.cfg.round;k>=1;k--)g.push([String(k),k===this.cfg.round?`Round ${k} (current)`:`Round ${k}`]);let f=K("round",g,String(n.round),{onchange:()=>{n.round=Number(f.value),this.renderSidebarList()}}),u=K("bp",[["","All breakpoints"],["mobile","Mobile"],["tablet","Tablet"],["desktop","Desktop"]],n.bp,{onchange:()=>{n.bp=u.value,this.renderSidebarList()}}),v=r("input",{type:"checkbox",onchange:()=>{n.mine=v.checked,this.renderSidebarList()}});if(v.checked=n.mine,this.sidebar=r("div",{class:"sidebar",role:"complementary","aria-label":"Feedback list"},r("header",{},r("h2",{},this.cfg.brand?.label??"Feedback",r("button",{class:"x",type:"button","aria-label":"Close list",text:"×",onclick:()=>this.closeSidebar()})),i,r("div",{class:"filters"},b,a,f,u,r("label",{},v,"Assigned to me"))),r("div",{class:"list"})),this.root.append(this.sidebar),this.renderToolbar(),this.renderSidebarList(),!this.allItems)this.api.listItems().then(({items:k})=>{if(this.allItems=k,this.updateScopeBadges(),this.filters.scope==="all"||k.length>this.states.size)this.renderSidebarList()}).catch(()=>{})}setScope(n){if(this.filters.scope===n)return;if(this.filters.scope=n,this.sidebar)this.sidebar.querySelectorAll(".scope-tab").forEach((o)=>{let x=o.dataset.scope===n;o.classList.toggle("active",x),o.setAttribute("aria-selected",String(x))});this.renderSidebarList()}updateScopeBadges(){if(!this.sidebar)return;let n=this.sidebar.querySelector('.scope-tab[data-scope="page"] .tab-badge'),p=this.sidebar.querySelector('.scope-tab[data-scope="all"] .tab-badge');if(n)n.textContent=String(this.states.size);if(p)p.textContent=this.allItems?String(this.allItems.length):""}closeSidebar(){this.sidebar?.remove(),this.sidebar=null,this.renderToolbar()}matchesStatus(n){let p=this.filters.status;if(p==="unresolved")return n.status!=="resolved";return!p||n.status===p}matches(n){let p=this.filters;if(p.type&&n.type!==p.type)return!1;if(p.round&&n.round!==p.round)return!1;if(p.bp&&n.breakpoint!==p.bp)return!1;if(!this.matchesStatus(n))return!1;if(p.mine&&(!this.cfg.assignees.me||n.assignee_id!==this.cfg.assignees.me))return!1;return!0}async renderSidebarList(){let n=this.sidebar?.querySelector(".list");if(!n)return;let p=(a,g,f)=>r("button",{class:"entry",type:"button",onclick:g},r("span",{class:`num ${a.status==="resolved"?"resolved":a.type}`,text:`#${a.id}`}),r("span",{},r("span",{class:"t",text:a.title}),r("span",{class:"s",text:`Round ${a.round} · ${this.cfg.labels.status[a.status]}${a.assignee_name?` · ${a.assignee_name}`:""}${a.breakpoint?` · ${a.breakpoint}`:""}`})),f??null);if(this.filters.scope==="all"){if(!this.allItems){n.replaceChildren(r("div",{class:"empty",text:"Loading…"}));try{this.allItems=(await this.api.listItems()).items,this.updateScopeBadges()}catch(f){n.replaceChildren(r("div",{class:"empty",text:f.message}));return}}let a=new Map;for(let f of this.allItems.filter((u)=>this.matches(u))){let u=a.get(f.page_path)??[];u.push(f),a.set(f.page_path,u)}let g=[];for(let[f,u]of a){g.push(r("h3",{text:f===this.pagePath?`${f} (this page)`:f}));for(let v of u)g.push(p(v,()=>{if(v.page_path===this.pagePath)this.focusItem(v.id);else{let k=new URL(v.page_url,window.location.origin);k.searchParams.set("fbc_item",String(v.id)),window.location.href=k.toString()}}))}n.replaceChildren(...g.length?g:[r("div",{class:"empty",text:"Nothing matches these filters."})]);return}let o={pinned:{title:"On this page",nodes:[]},note:{title:"Page notes",nodes:[]},hidden:{title:"At other breakpoints",nodes:[]},orphan:{title:"Orphaned — element not found",nodes:[]}};for(let a of[...this.states.values()].sort((g,f)=>g.item.id-f.item.id)){if(!this.matches(a.item))continue;let g=a.placement==="orphan"?r("span",{class:"btn link reanchor",role:"button",text:"Pin again",onclick:(f)=>{f.stopPropagation(),this.reanchor(a.item.id)}}):null;o[a.placement].nodes.push(p(a.item,()=>this.focusItem(a.item.id),g))}let x=[];for(let a of["pinned","note","hidden","orphan"]){let g=o[a];if(!g.nodes.length)continue;let f=a==="hidden"?`${g.nodes.length} at other breakpoints`:g.title;x.push(r("h3",{text:f}),...g.nodes)}let i=this.allItems?this.allItems.length:0,b=i-this.states.size;if(x.length>0&&b>0)x.push(r("div",{class:"list-footer-prompt"},r("button",{type:"button",class:"btn-view-all",onclick:()=>this.setScope("all")},`View ${b} more on other pages (${i} total) →`)));if(!x.length){let a=[r("div",{class:"empty",text:"No feedback on this page yet. Right-click anything to add some."})];if(i>0)a.push(r("div",{class:"list-empty-action"},r("button",{type:"button",class:"btn-view-all",onclick:()=>this.setScope("all")},`View all ${i} items on other pages →`)));n.replaceChildren(...a);return}n.replaceChildren(...x)}focusItem(n){let p=this.states.get(n);if(!p)return;if(p.placement==="pinned"&&p.el){if(!this.matchesStatus(p.item)){this.filters.status="";let o=this.sidebar?.querySelector('select[name="status"]');if(o)o.value="";this.drawPins(),this.renderSidebarList()}p.el.scrollIntoView({block:"center",behavior:"smooth"}),window.setTimeout(()=>{this.positionPins(),p.pin?.classList.remove("pulse"),p.pin?.offsetWidth,p.pin?.classList.add("pulse"),this.openPopover(n)},450)}else this.openPopover(n,{x:window.innerWidth-720,y:80})}toast(n,p=!1){let o=r("div",{class:`toast${p?" err":""}`,role:"status",text:n});this.root.append(o),window.setTimeout(()=>o.remove(),p?5000:2200)}showBanner(n){this.bannerEl?.remove(),this.bannerEl=r("div",{class:"banner",role:"status"},r("span",{text:n}),r("button",{type:"button",text:"Dismiss",onclick:()=>{this.bannerEl?.remove(),this.bannerEl=null}})),this.root.append(this.bannerEl)}}pn();m();function Rn(){if(window.self===window.top)return!0;if(window.name!==s)return!1;try{return window.parent.location.origin===window.location.origin}catch{return!1}}function gn(){let n=window.fbcConfig;if(!n||!Rn())return;new _(n).init()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",gn,{once:!0});else gn();})();
