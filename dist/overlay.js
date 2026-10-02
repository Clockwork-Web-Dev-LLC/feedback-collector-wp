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

/* Collapsible screenshot with cute expand animation */
.shot--collapsible {
  margin: 6px 0 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: border-color 0.24s ease, box-shadow 0.24s ease;
}
.shot--collapsible:hover {
  border-color: color-mix(in srgb, var(--brand-primary) 35%, var(--line));
}
.shot--collapsible.is-expanded {
  border-color: color-mix(in srgb, var(--brand-primary) 45%, var(--line));
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
.shot-toggle {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  background: var(--soft);
  border: 0;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  color: var(--ink);
  cursor: pointer;
  user-select: none;
  transition: background 0.18s ease, color 0.18s ease;
}
.shot-toggle:hover {
  background: color-mix(in srgb, var(--brand-primary) 8%, var(--soft));
  color: var(--brand-primary);
}
.shot-toggle:active {
  transform: scale(0.99);
}
.shot-toggle-lead {
  display: flex;
  align-items: center;
  gap: 7px;
}
.shot-toggle-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-primary);
  line-height: 1;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.shot-toggle:hover .shot-toggle-icon {
  animation: shotWiggle 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes shotWiggle {
  0%, 100% { transform: rotate(0) scale(1); }
  25% { transform: rotate(-14deg) scale(1.18); }
  75% { transform: rotate(12deg) scale(1.18); }
}
.shot--collapsible.is-expanded .shot-toggle-icon {
  transform: scale(1.1);
}
.shot-toggle-label {
  letter-spacing: 0.01em;
}
.shot-toggle-chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  line-height: 1;
  transition: transform 0.36s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease;
}
.shot--collapsible.is-expanded .shot-toggle-chevron {
  transform: rotate(180deg);
  color: var(--brand-primary);
}
.shot-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.36s cubic-bezier(0.34, 1.35, 0.64, 1);
}
.shot--collapsible.is-expanded .shot-body {
  grid-template-rows: 1fr;
}
.shot-inner {
  overflow: hidden;
  min-height: 0;
  border-top: 1px solid transparent;
  transition: border-top-color 0.2s ease;
}
.shot--collapsible.is-expanded .shot-inner {
  border-top-color: var(--line);
}
.shot-inner a,
.shot-inner img,
.shot-inner .shot-actions {
  opacity: 0;
  transform: scale(0.95) translateY(-6px);
  transition: opacity 0.24s ease, transform 0.36s cubic-bezier(0.34, 1.35, 0.64, 1);
}
.shot--collapsible.is-expanded .shot-inner a,
.shot--collapsible.is-expanded .shot-inner img,
.shot--collapsible.is-expanded .shot-inner .shot-actions {
  opacity: 1;
  transform: scale(1) translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  .shot-body,
  .shot-inner a,
  .shot-inner img,
  .shot-inner .shot-actions,
  .shot-toggle-chevron,
  .shot-toggle-icon {
    transition: none !important;
    animation: none !important;
  }
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
`;var P="fbc-root";var wn=["ember","react-","__next","radix-","headlessui-","mui-","yui_","ext-gen"],zn=/[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i,ln=/^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;function cn(n){let o=/[a-z]/i.test(n),r=/[0-9]/.test(n);if(!o||!r)return!1;if(n.length>=6&&/^[0-9a-f]+$/i.test(n))return!0;return n.length>=8&&/^[0-9a-z]+$/i.test(n)&&jn(n)>=2}function jn(n){let o=0;for(let r=1;r<n.length;r++){let p=/[0-9]/.test(n.charAt(r-1)),a=/[0-9]/.test(n.charAt(r));if(p!==a)o++}return o}function yn(n){if(n.trim()===""||/\s/.test(n))return!1;if(/^[0-9]/.test(n))return!1;if(/[0-9]{5,}/.test(n))return!1;if(zn.test(n))return!1;if(ln.test(n))return!1;let o=n.toLowerCase();if(wn.some((r)=>o.startsWith(r)))return!1;return!n.split(/[-_:.]/).some(cn)}function $n(n){let o="",r=n.length,p=n.charCodeAt(0);for(let a=0;a<r;a++){let x=n.charCodeAt(a),b=n.charAt(a);if(x===0)o+="�";else if(x>=1&&x<=31||x===127||a===0&&x>=48&&x<=57||a===1&&x>=48&&x<=57&&p===45)o+=`\\${x.toString(16)} `;else if(a===0&&r===1&&x===45)o+=`\\${b}`;else if(x>=128||x===45||x===95||x>=48&&x<=57||x>=65&&x<=90||x>=97&&x<=122)o+=b;else o+=`\\${b}`}return o}function Y(n,o){let r=o?o.CSS:void 0,p=globalThis.CSS,a=r?.escape??p?.escape;return a?a(n):$n(n)}function Jn(n){return n.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}function H(n){return n.localName.toLowerCase()}function Zn(n){return n.ownerDocument.defaultView}function Qn(n){if(!n)return{x:0,y:0};let o=Number.isFinite(n.scrollX)?n.scrollX:0,r=Number.isFinite(n.scrollY)?n.scrollY:0;return{x:o,y:r}}function S(n){if(!Number.isFinite(n))return 0.5;return Math.min(1,Math.max(0,n))}function C(n){let o=n;while(o){if(o.id==="fbc-root")return!0;if(o.parentElement)o=o.parentElement;else{let r=o.getRootNode();o=r instanceof ShadowRoot?r.host:null}}return!1}function B(n){if(n===null)return null;let o=n.replace(/\s+/g," ").trim();if(o==="")return null;let r=Array.from(o);return r.length>120?r.slice(0,120).join(""):o}var Ln=/^fl-node-(?!content$)[a-z0-9]+$/i,Hn=/^[a-z0-9]+$/i;function m(n){let o=1,r=n.previousElementSibling;while(r){if(r.localName===n.localName&&r.namespaceURI===n.namespaceURI)o++;r=r.previousElementSibling}return o}function T(n,o){if(!n.id||!yn(n.id))return null;let r=`#${Y(n.id,o.defaultView)}`,p=o.querySelectorAll(r);return p.length===1&&p[0]===n?r:null}function Kn(n,o){if(n===o.documentElement)return"html";let r=n.localName,p=n.getAttribute("data-id");if(p!==null&&n.classList.contains("elementor-element")&&Hn.test(p))return`${r}[data-id="${Jn(p)}"]`;let a=Array.from(n.classList).find((x)=>Ln.test(x));if(a!==void 0)return`${r}.${Y(a,o.defaultView)}`;return`${r}:nth-of-type(${m(n)})`}function Fn(n,o,r){let p=r.querySelectorAll(n);return p.length===1&&p[0]===o}function Un(n,o){let r=[],p=n;while(p){let a=T(p,o);if(a!==null)return r.unshift(a),r.join(" > ");r.unshift(Kn(p,o));let x=r.join(" > ");if(Fn(x,n,o))return x;p=p.parentElement}return r.join(" > ")}function Wn(n,o){let r=[],p=n;while(p){let a=H(p),x=p.parentElement,b=p===o.documentElement||x===o.documentElement&&(a==="head"||a==="body");r.unshift(b?a:`${a}[${m(p)}]`),p=x}return`/${r.join("/")}`}var qn=/^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i,Mn=/^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;function Gn(n,o){if(!qn.test(n))return null;let r=n.slice(1).split("/"),p=null;for(let a of r){let x=Mn.exec(a);if(!x)return null;let b=(x[1]??"").toLowerCase(),g=x[2]===void 0?1:Number(x[2]),t=p?Array.from(p.children):o.documentElement?[o.documentElement]:[],u=0,s=null;for(let f of t){if(H(f)!==b)continue;if(u++,u===g){s=f;break}}if(!s)return null;p=s}return p}function I(n,o,r){if(!Number.isFinite(o)||!Number.isFinite(r))throw RangeError(`createAnchor: click coordinates must be finite (got ${o}, ${r})`);if(!n.isConnected)throw Error("createAnchor: element is not connected to a document");if(C(n))throw Error("createAnchor: refusing to anchor an element inside #fbc-root");let p=n.ownerDocument;if(n.getRootNode()!==p)throw Error("createAnchor: element is inside a shadow root; anchor its shadow host instead");let a=n.getBoundingClientRect(),x=Qn(p.defaultView),b=a.width>0?S((o-a.left)/a.width):0.5,g=a.height>0?S((r-a.top)/a.height):0.5;return{id:T(n,p)!==null?n.id:null,selector:Un(n,p),xpath:Wn(n,p),text:B(n.textContent),tag:H(n),offsetX:b,offsetY:g,docX:o+x.x,docY:r+x.y}}function G(n,o){return n!==null&&H(n)===o&&!C(n)}function Nn(n){return n instanceof DOMException||n instanceof Error&&n.name==="SyntaxError"}function Xn(n,o){if(typeof n.id!=="string"||n.id==="")return null;let r=o.getElementById(n.id);if(!r)return null;return o.querySelectorAll(`#${Y(n.id,o.defaultView)}`).length===1?r:null}function Vn(n,o){if(typeof n.selector!=="string"||n.selector.trim()==="")return null;let r;try{r=o.querySelectorAll(n.selector)}catch(p){if(Nn(p))return null;throw p}return r.length===1?r[0]??null:null}function Yn(n,o){if(typeof n.xpath!=="string")return null;return Gn(n.xpath,o)}function Cn(n,o){if(typeof n.text!=="string"||n.text==="")return null;let r=null;for(let p of Array.from(o.getElementsByTagName("*"))){if(H(p)!==n.tag||C(p))continue;if(B(p.textContent)!==n.text)continue;if(r)return null;r=p}return r}function E(n,o=document){if(typeof n.tag!=="string"||n.tag==="")return{el:null,strategy:"none"};let r=n.tag.toLowerCase(),p=Xn(n,o);if(G(p,r))return{el:p,strategy:"id"};let a,x=()=>{if(a===void 0)a=Cn({...n,tag:r},o);return G(a,r)?a:null},b=(s)=>{if(n.text===null||B(s.textContent)===n.text)return null;let f=x();return f&&f!==s?f:null},g=Vn(n,o);if(G(g,r)){let s=b(g);return s?{el:s,strategy:"text"}:{el:g,strategy:"selector"}}let t=Yn(n,o);if(G(t,r)){let s=b(t);return s?{el:s,strategy:"text"}:{el:t,strategy:"xpath"}}let u=x();if(u)return{el:u,strategy:"text"};return{el:null,strategy:"none"}}function h(n){if(!n.isConnected)return!1;let o=Zn(n);if(!o)return!1;let r=o.getComputedStyle(n);if(r.visibility==="hidden"||r.visibility==="collapse")return!1;let p=n;while(p){if(o.getComputedStyle(p).display==="none")return!1;p=p.parentElement}let a=n.getBoundingClientRect();return!(a.width===0&&a.height===0)}class e extends Error{status;constructor(n,o){super(n);this.status=o}}class O{cfg;constructor(n){this.cfg=n}url(n,o){let r=this.cfg.restUrl.replace(/\/$/,"")+n;if(o){let p=new URLSearchParams(o).toString();if(p)r+=(r.includes("?")?"&":"?")+p}return r}async request(n,o,r,p){let a=typeof FormData<"u"&&r instanceof FormData,x=await fetch(this.url(o,p),{method:n,credentials:"same-origin",headers:{"X-WP-Nonce":this.cfg.nonce,...r!==void 0&&!a?{"Content-Type":"application/json"}:{}},body:r===void 0?void 0:a?r:JSON.stringify(r)}),b=await x.json().catch(()=>null);if(!x.ok){let g=b&&typeof b==="object"&&"message"in b?String(b.message):x.statusText;throw new e(g,x.status)}return b}listItems(n){return this.request("GET","/items",void 0,n?{page_path:n}:void 0)}getItem(n){return this.request("GET",`/items/${n}`)}createItem(n,o){if(!o)return this.request("POST","/items",n);let r=new FormData;return r.append("data",JSON.stringify(n)),r.append("screenshot",o,"screenshot.jpg"),this.request("POST","/items",r)}savePrefs(n){return this.request("POST","/me/prefs",n)}replaceScreenshot(n,o){let r=new FormData;return r.append("screenshot",o,"screenshot.jpg"),this.request("POST",`/items/${n}/screenshot`,r)}updateItem(n,o){return this.request("PATCH",`/items/${n}`,o)}deleteItem(n){return this.request("DELETE",`/items/${n}`)}addComment(n,o){return this.request("POST",`/items/${n}/comments`,{body:o})}}function K(n=window.innerWidth){if(n<768)return"mobile";if(n<=1024)return"tablet";return"desktop"}function Bn(n){let o=[[/Edg\/([\d.]+)/,"Edge"],[/OPR\/([\d.]+)/,"Opera"],[/Firefox\/([\d.]+)/,"Firefox"],[/CriOS\/([\d.]+)/,"Chrome iOS"],[/Chrome\/([\d.]+)/,"Chrome"],[/Version\/([\d.]+).*Safari/,"Safari"]];for(let[r,p]of o){let a=n.match(r);if(a)return`${p} ${a[1].split(".")[0]}`}return"Unknown"}function On(n){let o=n.match(/(iPhone|iPad).*OS ([\d_]+)/);if(o)return`iOS ${o[2].replace(/_/g,".")}`;if(o=n.match(/Android ([\d.]+)/),o)return`Android ${o[1]}`;if(o=n.match(/Windows NT ([\d.]+)/),o)return o[1]==="10.0"?"Windows 10/11":`Windows NT ${o[1]}`;if(o=n.match(/Mac OS X ([\d_]+)/),o)return`macOS ${o[1].replace(/_/g,".")}`;if(/CrOS/.test(n))return"ChromeOS";if(/Linux/.test(n))return"Linux";return"Unknown"}var N=null;function nn(){let n=navigator.userAgentData;if(!n)return;n.getHighEntropyValues(["platform","platformVersion"]).then(({platform:o,platformVersion:r})=>{if(!o||!r)return;let[p,a]=r.split(".");if(o==="macOS")N=`macOS ${p}.${a??"0"}`;else if(o==="Windows")N=Number(p)>=13?"Windows 11":"Windows 10";else if(o==="Android"||o==="Chrome OS"||o==="Linux")N=`${o} ${r}`.trim()}).catch(()=>{})}function on(n){let o=navigator.userAgent;return{viewport_w:window.innerWidth,viewport_h:window.innerHeight,dpr:Math.round((window.devicePixelRatio||1)*100)/100,breakpoint:K(),browser:Bn(o),os:N??On(o),user_agent:o,post_id:n.page.postId,post_type:n.page.postType,theme:n.page.theme,js_errors:(window.__fbcErrors??[]).slice(-20),preview:_n()}}function _n(){try{return window.self!==window.top?window.frameElement?.getAttribute("data-device")??"":""}catch{return""}}function rn(n){let o=window.location.pathname,r=n.replace(/\/$/,"");if(r&&o.startsWith(r))o=o.slice(r.length);return o="/"+o.replace(/^\/+/,""),o==="/"?"/":o.replace(/\/?$/,"/")}function pn(){let n=new URLSearchParams(window.location.search);return n.delete("fbc_item"),n.toString()}function an(){if(window.__fbcErrors)return;let n=window.__fbcErrors=[],o=(r)=>{if(n.push(r.slice(0,500)),n.length>20)n.shift()};window.addEventListener("error",(r)=>{if(r.message)o(`${r.message}${r.filename?` (${r.filename}:${r.lineno})`:""}`)}),window.addEventListener("unhandledrejection",(r)=>{let p=r.reason;o(`Unhandled rejection: ${p instanceof Error?p.message:String(p)}`)})}function i(n,o={},...r){let p=document.createElement(n);for(let[a,x]of Object.entries(o)){if(x===null||x===void 0||x===!1)continue;if(a.startsWith("on")&&typeof x==="function")p.addEventListener(a.slice(2).toLowerCase(),x);else if(a==="text")p.textContent=String(x);else if(a==="value"&&"value"in p)p.value=String(x);else if(x===!0)p.setAttribute(a,"");else p.setAttribute(a,String(x))}for(let a of r){if(a===null||a===void 0||a===!1)continue;p.append(typeof a==="number"?String(a):a)}return p}function J(n,o,r,p={}){let a=i("select",{name:n,...p});for(let[x,b]of o){let g=i("option",{value:x,text:b});if(x===r)g.selected=!0;a.append(g)}return a}function _(n){let o=new Date(n).getTime();if(Number.isNaN(o))return"";let r=Math.round((Date.now()-o)/1000);if(r<60)return"just now";let p=Math.round(r/60);if(p<60)return`${p}m ago`;let a=Math.round(p/60);if(a<24)return`${a}h ago`;let x=Math.round(a/24);if(x<30)return`${x}d ago`;return new Date(n).toLocaleDateString()}var Dn={phone:'<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',tablet:'<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M11 18.5h2"/>',desktop:'<rect x="2.5" y="4" width="19" height="12.5" rx="1.5"/><path d="M8.5 20.5h7M12 16.5v4"/>',highlight:'<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3"/><path d="M11 11l9 3.5-3.8 1.4-1.4 3.8z"/>'};function F(n){let o=document.createElement("span");return o.className="icon",o.setAttribute("aria-hidden","true"),o.innerHTML=`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${Dn[n]??""}</svg>`,o}function xn(){let n=document.createElement("span");return n.className="shot-toggle-icon",n.setAttribute("aria-hidden","true"),n.innerHTML='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',n}function bn(){let n=document.createElement("span");return n.className="shot-toggle-chevron",n.setAttribute("aria-hidden","true"),n.innerHTML='<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',n}var U=["bug","tweak","change","comment"],gn="fbc:mode",tn="fbc:corner",fn="fbc:highlight",W="fbc-preview",X=[{id:"phone",label:"Mobile",w:390,h:844},{id:"tablet",label:"Tablet",w:820,h:1180},{id:"desktop",label:"Desktop",w:1440,h:900}],Q=16,sn=360,An=["tl","tr","bl","br"];function Rn(){let n=new Date;return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`}function Sn(n,o){let[r,p,a]=n.split("-").map(Number);return new Date(Date.UTC(r,p-1,a+o)).toISOString().slice(0,10)}function un(n,o=Date.now()){if(!n)return"";if(n.batchUntil&&o<n.batchUntil*1000)return n.suggest;if(!n.batchUntil&&n.suggest)return n.suggest;return Sn(Rn(),n.days)}class D{cfg;api;host;root;pinsLayer;outline;outlineTag;toolbar=null;sidebar=null;card=null;hintEl=null;bannerEl=null;mode=!1;highlight=!0;pinMode=null;states=new Map;allItems=null;filters={scope:"page",type:"",status:"unresolved",mine:!1,round:0,bp:""};pagePath;framePending=!1;refreshTimer=0;lastWidth=window.innerWidth;mutationObserver=null;loaded=!1;corner="br";dragging=!1;ghost=null;pendingShot=null;inPreview=window.self!==window.top&&window.name===W;previewEl=null;selectedEl=null;unbinds=[];cardCleanup=null;constructor(n){this.cfg=n;this.api=new O(n),this.pagePath=n.pagePath??rn(n.homePath)}destroy(){if(this.cardCleanup)this.cardCleanup(),this.cardCleanup=null;for(let n of this.unbinds)n();if(this.unbinds=[],this.mutationObserver)this.mutationObserver.disconnect(),this.mutationObserver=null;if(this.refreshTimer)window.clearTimeout(this.refreshTimer),this.refreshTimer=0;this.host?.remove()}listen(n,o,r,p){n.addEventListener(o,r,p),this.unbinds.push(()=>n.removeEventListener(o,r,p))}init(){this.mount(),this.bindGlobalEvents(),this.bindAdminBar();let n=!1,o=null,r=null;try{n=window.localStorage.getItem(gn)==="1";let a=window.localStorage.getItem(tn);if(a&&An.includes(a))o=a;let x=window.localStorage.getItem(fn);if(x!==null)r=x!=="0"}catch{n=!1}let p=this.cfg.prefs??{};if(this.corner=p.corner??o??this.corner,this.highlight=p.highlight??r??!0,!this.inPreview){let a={};if(!p.corner&&o)a.corner=o;if(p.highlight===void 0&&r!==null)a.highlight=r;if(Object.keys(a).length)this.savePrefs(a)}if(this.inPreview){let a=document.createElement("style");a.textContent="#wpadminbar{display:none!important}html{margin-top:0!important}",document.head.append(a),this.corner="bl",this.setMode(!0);return}if(this.cfg.openItem||n)this.setMode(!0)}mount(){this.host=i("div",{id:P}),this.host.setAttribute("style","all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;");let n=this.host.attachShadow({mode:"open"});n.append(i("style",{text:R})),this.root=i("div",{class:"fbc"});let o=this.cfg.brand;if(o){let p=[["--primary",o.primary],["--on-primary",o.onPrimary],["--dark",o.dark],["--on-dark",o.onDark],["--brand-accent",o.accent],["--ink-primary",o.ink??""]];for(let[a,x]of p)if(x)this.root.style.setProperty(a,x)}let r=i("div",{class:"layer"});this.outlineTag=i("span",{class:"outline-tag"}),this.outline=i("div",{class:"outline"},this.outlineTag),this.pinsLayer=i("div"),r.append(this.outline,this.pinsLayer),this.root.append(r),n.append(this.root),document.body.append(this.host)}inOverlay(n){return n.composedPath().includes(this.host)}bindGlobalEvents(){this.listen(document,"contextmenu",(n)=>this.onContextMenu(n),!0),this.listen(document,"mousemove",(n)=>this.onMouseMove(n),{capture:!0,passive:!0});for(let n of["pointerdown","mousedown","mouseup","click"])this.listen(document,n,(o)=>this.onPinModeEvent(o),!0);this.listen(document,"mousedown",(n)=>this.onOutsideMouseDown(n),!1),this.listen(document,"keydown",(n)=>this.onKeyDown(n),!0),this.listen(window,"scroll",()=>this.schedulePosition(),{passive:!0,capture:!0}),this.listen(window,"resize",()=>{let n=window.innerWidth!==this.lastWidth;if(this.lastWidth=window.innerWidth,this.card?.classList.contains("popover")||this.card?.classList.contains("composer"))this.card.style.maxHeight=`${Math.max(160,window.innerHeight-this.topOffset()-24)}px`,this.moveCard(this.card,this.card.offsetLeft,this.card.offsetTop);if(n)this.scheduleRefresh(80);else this.schedulePosition()})}bindAdminBar(){let n=document.querySelector("#wp-admin-bar-fbc-toggle > a");if(n)this.listen(n,"click",(o)=>{o.preventDefault(),this.setMode(!this.mode)})}async setMode(n){if(this.mode=n,!this.inPreview)try{window.localStorage.setItem(gn,n?"1":"0")}catch{}if(document.querySelector("#wp-admin-bar-fbc-toggle")?.classList.toggle("fbc-on",n),!n){this.exitPinMode(),this.closeCard(),this.closeSidebar(),this.hideOutline(),this.toolbar?.remove(),this.toolbar=null,this.bannerEl?.remove(),this.bannerEl=null,this.pinsLayer.replaceChildren();for(let o of this.states.values())o.pin=null;this.mutationObserver?.disconnect();return}if(this.renderToolbar(),this.observeMutations(),!this.loaded)await this.loadItems();else this.refresh();if(this.cfg.openItem){let o=this.cfg.openItem;this.cfg.openItem=0,this.stripDeepLinkParam(),this.openDeepLink(o)}}stripDeepLinkParam(){let n=new URL(window.location.href);if(n.searchParams.has("fbc_item"))n.searchParams.delete("fbc_item"),window.history.replaceState(window.history.state,"",n.toString())}async loadItems(){try{let{items:n}=await this.api.listItems(this.pagePath),o=new Map(this.states);this.states.clear();for(let r of n){let p=o.get(r.id);o.delete(r.id),this.states.set(r.id,{item:r,el:p?.el??null,placement:"orphan",pin:p?.pin??null})}for(let r of o.values())r.pin?.remove();this.loaded=!0,this.refresh()}catch(n){this.toast(`Could not load feedback: ${n.message}`,!0)}}upsert(n){let o=this.states.get(n.id);if(o)o.item=n;else this.states.set(n.id,{item:n,el:null,placement:"orphan",pin:null});if(this.allItems){let r=this.allItems.findIndex((p)=>p.id===n.id);if(r>=0)this.allItems[r]=n;else this.allItems.push(n)}this.updateScopeBadges()}remove(n){if(this.states.get(n)?.pin?.remove(),this.states.delete(n),this.allItems)this.allItems=this.allItems.filter((r)=>r.id!==n);this.updateScopeBadges()}refresh(){for(let n of this.states.values()){if(!n.item.anchor){n.el=null,n.placement="note";continue}let o=n.el&&n.el.isConnected?n.el:E(n.item.anchor).el;n.el=o,n.placement=!o?"orphan":h(o)?"pinned":"hidden"}if(this.drawPins(),this.updateToolbarCount(),this.sidebar)this.renderSidebarList()}drawPins(){if(!this.mode)return;for(let n of this.states.values()){if(!(n.placement==="pinned"&&this.matchesStatus(n.item))){n.pin?.remove(),n.pin=null;continue}if(!n.pin){let a=i("button",{class:"pin",type:"button","aria-label":`Feedback #${n.item.id}: ${n.item.title}`,onclick:(x)=>{x.stopPropagation(),this.openPopover(n.item.id)}});n.pin=a,this.pinsLayer.append(a)}let r=n.item.status==="resolved",p=n.pin.classList.contains("pulse");n.pin.className=`pin ${n.item.type}${r?" resolved":""}${p?" pulse":""}`,n.pin.textContent=r?"✓":String(n.item.id),n.pin.title=`#${n.item.id} ${n.item.title}`}this.positionPins()}schedulePosition(){if(this.framePending||!this.mode)return;this.framePending=!0,requestAnimationFrame(()=>{if(this.framePending=!1,this.positionPins(),this.positionChrome(),this.selectedEl)this.hideOutline()})}scheduleRefresh(n=250){window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.mode&&this.refresh(),n)}positionPins(){for(let n of this.states.values()){if(!n.pin||!n.el||!n.item.anchor)continue;let o=n.el.getBoundingClientRect(),r=o.left+n.item.anchor.offsetX*o.width,p=o.top+n.item.anchor.offsetY*o.height;n.pin.style.transform=`translate(${Math.round(r)}px, ${Math.round(p)}px)`}}observeMutations(){if(!this.mutationObserver)this.mutationObserver=new MutationObserver((n)=>{if(n.every((o)=>o.target===this.host||this.host.contains(o.target)))return;this.schedulePosition(),this.scheduleRefresh(300)});this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden","open"]})}onContextMenu(n){if(!this.mode||n.altKey||this.inOverlay(n))return;let o=this.eventTarget(n);if(!o)return;n.preventDefault(),n.stopPropagation(),this.exitPinMode(),this.openTypeMenu(o,n.clientX,n.clientY)}onPinModeEvent(n){if(!this.pinMode||this.inOverlay(n)||n.button!==0)return;if(n.preventDefault(),n.stopImmediatePropagation(),n.type!=="click")return;let o=this.eventTarget(n),r=this.pinMode;if(this.exitPinMode(),o)r.done(o,n.clientX,n.clientY)}onOutsideMouseDown(n){if(this.card&&!this.inOverlay(n))this.closeCard()}onMouseMove(n){if(!this.mode||this.card&&!this.pinMode||!this.highlight&&!this.pinMode||this.inOverlay(n)){if(!this.pinMode)this.hideOutline();return}let o=this.eventTarget(n);if(!o||o===document.documentElement||o===document.body){this.hideOutline();return}this.drawOutline(o)}drawOutline(n){let o=n.getBoundingClientRect();Object.assign(this.outline.style,{left:`${o.left}px`,top:`${o.top}px`,width:`${o.width}px`,height:`${o.height}px`});let r=n.id?`#${n.id}`:"";this.outlineTag.textContent=`${n.tagName.toLowerCase()}${r}`,this.outline.classList.add("on")}onKeyDown(n){if(this.annotating)return;let o=n.composedPath()[0],r=o instanceof HTMLElement&&(o.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(o.tagName));if(n.altKey&&n.shiftKey&&n.code==="KeyF"&&!r){n.preventDefault(),this.setMode(!this.mode);return}if(n.key==="Escape"&&this.previewEl){n.preventDefault(),this.closePreview();return}if(n.key==="Escape"&&this.mode){if(this.pinMode)this.exitPinMode(),n.preventDefault();else if(this.card)this.closeCard(),n.preventDefault();else if(this.sidebar)this.closeSidebar(),n.preventDefault()}}eventTarget(n){let o=n.target;if(o instanceof Element)return o;if(o instanceof Node)return o.parentElement;return null}setHighlight(n){this.highlight=n;try{window.localStorage.setItem(fn,n?"1":"0")}catch{}if(!this.inPreview)this.savePrefs({highlight:n});if(!n)this.hideOutline();this.renderToolbar()}hideOutline(){if(this.selectedEl?.isConnected){this.drawOutline(this.selectedEl),this.outline.classList.add("locked");return}this.outline.classList.remove("on","locked")}enterPinMode(n){this.closeCard(),this.pinMode=n,this.hintEl?.remove(),this.hintEl=i("div",{class:"crosshair-hint",text:`${n.hint} · Esc to cancel`}),this.root.append(this.hintEl),document.documentElement.style.cursor="crosshair",this.renderToolbar()}exitPinMode(){if(!this.pinMode)return;this.pinMode=null,this.hintEl?.remove(),this.hintEl=null,document.documentElement.style.cursor="",this.hideOutline(),this.renderToolbar()}scripts=new Map;annotating=!1;async annotate(n){if(this.annotating)return null;this.annotating=!0;try{if(!window.FBCAnnotator)await this.loadBundle("annotator.js");let o=window.FBCAnnotator;if(!o)throw Error("The annotator could not load.");let r=this.cfg.brand?.primary??"#6953c4";return await o.open({image:n,mount:this.root,colors:["#e5383b",r,"#ffb703","#ffffff","#111111"]})}catch(o){return this.toast(o.message,!0),null}finally{this.annotating=!1}}loadBundle(n){let o=this.scripts.get(n);if(o)return o;let r=this.cfg.assetsUrl??"",p=new Promise((a,x)=>{let b=document.createElement("script");b.src=`${r}${n}${this.cfg.version?`?ver=${encodeURIComponent(this.cfg.version)}`:""}`,b.async=!0,b.onload=()=>a(),b.onerror=()=>{this.scripts.delete(n),x(Error(`Could not load ${n}`))},document.head.append(b)});return this.scripts.set(n,p),p}async startCapture(n){if(!this.cfg.shots||!this.cfg.assetsUrl)return null;try{if(!window.FBCCapture)await this.loadBundle("capture.js");let o=window.FBCCapture;if(!o)return null;return await o.captureViewport({marker:n,color:this.cfg.brand?.primary??"#6953c4"})}catch{return null}}assigneeOptions(){return[["0","Unassigned"],...this.cfg.assignees.people.map((n)=>[String(n.id),n.name])]}assigneeLabel(){return this.cfg.assignees.source==="teamwork"?"Assignee (Teamwork)":"Assignee"}safeAnchor(n,o,r){try{return I(n,o,r)}catch{return this.toast("Can't pin to that element. Try its container, or add a page note.",!0),null}}closeCard(n=!1){if(this.cardCleanup)this.cardCleanup(),this.cardCleanup=null;if(this.card?.remove(),this.card=null,!n)this.selectedEl=null,this.hideOutline()}showCard(n,o,r){if(this.closeCard(!0),this.hideOutline(),this.card=n,n.style.left="0px",n.style.top="0px",n.style.visibility="hidden",n.style.maxHeight=`${Math.max(160,window.innerHeight-this.topOffset()-24)}px`,this.root.append(n),this.moveCard(n,o+8,r+8),n.style.visibility="",typeof ResizeObserver<"u"){let a=new ResizeObserver(()=>{if(!n.isConnected)return a.disconnect();this.moveCard(n,n.offsetLeft,n.offsetTop)});a.observe(n)}n.addEventListener("load",()=>this.moveCard(n,n.offsetLeft,n.offsetTop),!0);let p=n.querySelector(":scope > .head");if(p)p.classList.add("drag"),p.title="Drag to move",p.addEventListener("pointerdown",(a)=>this.startCardDrag(n,a))}moveCard(n,o,r){let p=this.topOffset()+12,a=Math.max(12,window.innerWidth-n.offsetWidth-12),x=Math.max(p,window.innerHeight-n.offsetHeight-12);n.style.left=`${Math.round(Math.max(12,Math.min(o,a)))}px`,n.style.top=`${Math.round(Math.max(p,Math.min(r,x)))}px`}startCardDrag(n,o){if(o.button!==0||o.target.closest("button, a, input, select, textarea"))return;o.preventDefault();let r=o.currentTarget,p=o.clientX-n.offsetLeft,a=o.clientY-n.offsetTop;try{r.setPointerCapture(o.pointerId)}catch{}n.classList.add("dragging");let x=(g)=>this.moveCard(n,g.clientX-p,g.clientY-a),b=()=>{n.classList.remove("dragging"),r.removeEventListener("pointermove",x),r.removeEventListener("pointerup",b),r.removeEventListener("pointercancel",b)};r.addEventListener("pointermove",x),r.addEventListener("pointerup",b),r.addEventListener("pointercancel",b)}openTypeMenu(n,o,r){this.pendingShot=this.startCapture({x:o,y:r}),this.selectedEl=n;let p=this.cfg.labels.type,a=(g)=>this.openComposer(g,n,o,r),x=U.map((g,t)=>i("button",{type:"button",onclick:()=>a(g)},i("span",{class:`dot ${g}`}),p[g],i("kbd",{text:String(t+1)}))),b=i("div",{class:"card menu",role:"menu",onkeydown:(g)=>{let t=g.key,u=Number(t);if(u>=1&&u<=U.length)g.preventDefault(),a(U[u-1])}},i("div",{class:"menu-title",text:"Add feedback"}),...x,i("hr"),i("button",{type:"button",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},"Note for the whole page"));this.showCard(b,o,r),x[0].focus()}openComposer(n,o,r,p){this.selectedEl=o;let a=null;if(o){if(a=this.safeAnchor(o,r,p),!a)return}let x=this.cfg.labels,b=J("type",U.map((k)=>[k,x.type[k]]),n),g=i("input",{type:"text",name:"title",maxlength:255,required:!0,placeholder:"What needs attention?",autocomplete:"off"}),t=i("textarea",{name:"description",placeholder:"Details, steps to reproduce, what you expected… (optional)"}),u=J("priority",Object.keys(x.priority).map((k)=>[k,x.priority[k]]),"medium"),s=J("assignee_id",this.assigneeOptions(),"0"),f=i("input",{type:"checkbox",name:"due_on"});f.checked=!!this.cfg.due?.onByDefault;let c=i("input",{type:"date",name:"due_date",value:un(this.cfg.due)});c.hidden=!f.checked,f.addEventListener("change",()=>{if(c.hidden=!f.checked,f.checked&&!c.value)c.value=un(this.cfg.due)});let d=i("div",{class:"error",role:"alert"}),j=i("button",{class:"btn primary",type:"submit",text:"Add"}),l=this.pendingShot??this.startCapture(o?{x:r,y:p}:null);this.pendingShot=null;let z=null,v="",y=i("div",{class:"shot","aria-live":"polite"}),L=()=>{if(v)URL.revokeObjectURL(v);v=z?URL.createObjectURL(z):"",y.replaceChildren(...z?[i("img",{src:v,alt:"Screenshot that will be attached"}),i("div",{class:"shot-actions"},i("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{if(!z)return;let k=await this.annotate(z);if(k)z=k,l=Promise.resolve(k),L()}}),this.cfg.shots?i("button",{type:"button",class:"btn link",text:"Remove screenshot",onclick:()=>{z=null,l=Promise.resolve(null),L()}}):null)]:[]),y.hidden=!z};if(this.cfg.shots)y.textContent="Capturing screenshot…",l.then((k)=>{if(z=k,L(),!k)y.hidden=!0});else y.hidden=!0;let Z=i("form",{class:"card composer",novalidate:!0,onsubmit:(k)=>{k.preventDefault(),w()}},i("div",{class:"head"},i("span",{class:"chip"},i("span",{class:`dot ${n}`}),o?`<${o.tagName.toLowerCase()}>`:"Whole page"),i("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),i("label",{class:"field"},i("span",{text:"Title"}),g),d,i("label",{class:"field"},i("span",{text:"Description"}),t),i("div",{class:"row"},i("label",{class:"field"},i("span",{text:"Type"}),b),i("label",{class:"field"},i("span",{text:"Priority"}),u)),i("label",{class:"field"},i("span",{text:this.assigneeLabel()}),s),this.cfg.assignees.fallback?i("div",{class:"meta hint",text:"Showing WordPress users until Teamwork is connected (Feedback → Settings). Then this lists your Teamwork project members."}):null,i("div",{class:"field due-field"},i("label",{class:"check"},f," Set date?"),c),y,i("div",{class:"actions"},i("button",{class:"btn link",type:"button",text:"Cancel",onclick:()=>this.closeCard()}),j)),w=async()=>{if(d.textContent="",!g.value.trim()){d.textContent="Add a short title.",g.focus();return}j.disabled=!0;try{let k=this.cfg.shots?await Promise.race([l,new Promise((M)=>window.setTimeout(()=>M(null),1e4))]):null,$=await this.api.createItem({type:b.value,title:g.value.trim(),description:t.value,priority:u.value,assignee_id:Number(s.value),assignee_source:this.cfg.assignees.source,due_date:f.checked&&c.value?c.value:null,page_path:this.pagePath,page_query:pn(),page_title:document.title,anchor:a,context:on(this.cfg)},z??k);if(v)URL.revokeObjectURL(v);if($.due_next)this.cfg.due=$.due_next;this.closeCard(),this.upsert($);let q=this.states.get($.id);if(q&&o)q.el=o;if(this.refresh(),$.screenshot_error)this.toast(`Added #${$.id}, but the screenshot wasn’t saved: ${$.screenshot_error}`,!0);else this.toast(`Added #${$.id}`)}catch(k){d.textContent=k.message,j.disabled=!1}};this.showCard(Z,r,p),g.focus()}async openPopover(n,o){let r;try{r=await this.api.getItem(n)}catch(w){this.toast(w.message,!0);return}this.upsert(r);let p=this.cfg.labels,a=this.states.get(n),x=a?.pin?.getBoundingClientRect(),b=o?.x??(x?x.right:window.innerWidth/2-170),g=o?.y??(x?x.top:100),t=async(w)=>{try{let k=await this.api.updateItem(n,w);this.upsert(k),this.refresh(),this.openPopover(n,{x:parseFloat(Z.style.left)-8,y:parseFloat(Z.style.top)-8})}catch(k){this.toast(k.message,!0)}},u=J("status",Object.keys(p.status).map((w)=>[w,p.status[w]]),r.status,{onchange:()=>void t({status:u.value})}),s=J("assignee_id",this.assigneeOptions(),String(r.assignee_id),{onchange:()=>void t({assignee_id:Number(s.value),assignee_source:this.cfg.assignees.source})}),f=J("priority",Object.keys(p.priority).map((w)=>[w,p.priority[w]]),r.priority,{onchange:()=>void t({priority:f.value})}),c=i("input",{type:"date",name:"due_date",value:r.due_date??"",class:r.overdue?"overdue":"",onchange:()=>void t({due_date:c.value||null})}),d=i("textarea",{placeholder:"Reply… (type @ to mention)",rows:2}),j=i("label",{class:"field mention-container"},d),l=this.setupMentions(d,j),z=i("ul",{class:"thread"},...(r.comments??[]).map((w)=>i("li",{class:w.kind},i("span",{class:"who",text:w.user_name}),i("span",{class:"when",text:_(w.created_at)}),this.renderMentionText("body",w.body)))),v=K(),y=r.breakpoint&&r.breakpoint!==v?i("div",{class:"notice",text:`Logged at ${r.breakpoint} (${r.context?.viewport_w??"?"}px). You are on ${v} (${window.innerWidth}px).`}):null,L=a?.placement==="orphan"?i("div",{class:"notice",text:"The element this was pinned to can’t be found on the page anymore. Use “Pin again” in the list to place it."}):null,Z=i("div",{class:"card popover",role:"dialog","aria-label":`Feedback #${r.id}`},i("div",{class:"head"},i("span",{class:"chip"},i("span",{class:`dot ${r.type}`}),`${p.type[r.type]} #${r.id}`),i("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),i("div",{class:"t",style:"font-weight:700;font-size:15px;margin-bottom:4px",text:r.title}),i("div",{class:"meta",text:`Round ${r.round} · ${r.reporter_name} · ${_(r.created_at)}`}),r.breakpoint?i("div",{class:"meta bp-line"},i("span",{class:"chip",text:r.breakpoint}),` ${r.context?.viewport_w??"?"}px wide${r.context?.preview?` · ${r.context.preview} preview`:""}`):null,r.tw_task_url?i("div",{class:"meta"},i("a",{href:r.tw_task_url,target:"_blank",rel:"noopener",text:`Teamwork task #${r.tw_task_id} ↗`}),r.status==="resolved"?" · completed":" · status syncs from Teamwork"):r.tw_note?i("div",{class:"notice",text:r.tw_note}):null,y,L,r.description?this.renderMentionText("desc",r.description):null,r.screenshot_url?(()=>{let w=!1,k,$=i("button",{type:"button",class:"shot-toggle","aria-expanded":"false",onclick:()=>{w=!w,M.classList.toggle("is-expanded",w),$.setAttribute("aria-expanded",w?"true":"false"),k.textContent=w?"Hide screenshot":"View screenshot"}},i("span",{class:"shot-toggle-lead"},xn(),k=i("span",{class:"shot-toggle-label",text:"View screenshot"})),bn()),q=i("div",{class:"shot-body"},i("div",{class:"shot-inner"},i("a",{href:r.screenshot_url,target:"_blank",rel:"noopener",title:"Open full screenshot"},i("img",{src:r.screenshot_url,alt:"Screenshot from when this was filed"})),i("div",{class:"shot-actions"},i("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{try{let V=await fetch(r.screenshot_url,{credentials:"same-origin",cache:"no-store"}),A=await this.annotate(await V.blob());if(!A)return;let dn=await this.api.replaceScreenshot(r.id,A);this.upsert(dn),this.toast(`Annotations saved on #${r.id}`),this.openPopover(n,{x:parseFloat(Z.style.left)-8,y:parseFloat(Z.style.top)-8})}catch(V){this.toast(V.message,!0)}}})))),M=i("div",{class:"shot shot--collapsible"},$,q);return M})():null,i("div",{class:"row"},i("label",{class:"field"},i("span",{text:"Status"}),u),i("label",{class:"field"},i("span",{text:"Priority"}),f)),i("label",{class:"field"},i("span",{text:r.overdue?"Due date · overdue":"Due date"}),c),r.assignee_locked?i("div",{class:"field"},i("span",{text:this.assigneeLabel()}),i("div",{text:r.assignee_name||"Unassigned"}),i("div",{class:"meta",text:"In Teamwork now: change the assignee there."})):i("label",{class:"field"},i("span",{text:this.assigneeLabel()}),s),z,j,i("div",{class:"actions"},i("a",{class:"btn link",href:`${this.cfg.adminUrl}&item=${r.id}`,target:"_blank",rel:"noopener",text:"Admin"}),r.can_delete?i("button",{class:"btn danger",type:"button",text:"Delete",onclick:()=>void this.deleteItem(r.id)}):null,i("button",{class:"btn primary",type:"button",text:"Reply",onclick:async()=>{if(!d.value.trim())return;try{await this.api.addComment(r.id,d.value),this.openPopover(n,{x:parseFloat(Z.style.left)-8,y:parseFloat(Z.style.top)-8})}catch(w){this.toast(w.message,!0)}}})));this.showCard(Z,b,g),this.cardCleanup=l}renderMentionText(n,o){let r=i("div",{class:n}),a=(this.cfg.assignees?.people??[]).map((g)=>g.name.trim().replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).filter((g)=>g.length>0).sort((g,t)=>t.length-g.length),x=a.length?new RegExp(`(@(?:${a.join("|")}|[A-Za-z0-9_.-]+))`,"g"):/(@[A-Za-z0-9_.-]+)/g,b=o.split(x);for(let g of b)if(g.startsWith("@"))r.append(i("span",{class:"mention",text:g}));else if(g)r.append(document.createTextNode(g));return r}setupMentions(n,o){let r=this.cfg.assignees?.people??[];if(!r.length)return()=>{};let p=null,a=0,x=-1,b=[],g=()=>{p?.remove(),p=null,x=-1,b=[]},t=(d)=>{let j=n.value,l=j.slice(0,x),z=j.slice(n.selectionEnd),v=`@${d.name} `;n.value=`${l}${v}${z}`;let y=l.length+v.length;n.setSelectionRange(y,y),n.focus(),g()},u=()=>{if(!p)p=i("div",{class:"mention-menu",role:"listbox"}),o.append(p);if(p.innerHTML="",!b.length){g();return}b.forEach((d,j)=>{let l=i("div",{class:`mention-item${j===a?" is-active":""}`,role:"option",text:d.name,onclick:(z)=>{z.preventDefault(),z.stopPropagation(),t(d)}});p?.append(l)})},s=()=>{let d=typeof n.selectionStart==="number"&&n.selectionStart>0?n.selectionStart:n.value.length,j=n.value.slice(0,d),l=j.lastIndexOf("@");if(l===-1||l>0&&!/\s/.test(j[l-1])){g();return}let z=j.slice(l+1).toLowerCase();if(z.includes(`
`)){g();return}if(x=l,b=r.filter((v)=>v.name.toLowerCase().includes(z)).slice(0,5),a=0,b.length)u();else g()},f=(d)=>{if(!p)return;if(d.key==="ArrowDown")d.preventDefault(),a=(a+1)%b.length,u();else if(d.key==="ArrowUp")d.preventDefault(),a=(a-1+b.length)%b.length,u();else if(d.key==="Enter"||d.key==="Tab"){if(b[a])d.preventDefault(),t(b[a])}else if(d.key==="Escape")d.preventDefault(),d.stopPropagation(),g()};n.addEventListener("input",s),n.addEventListener("keydown",f);let c=(d)=>{if(p&&!p.contains(d.target)&&d.target!==n)g()};return document.addEventListener("click",c),()=>{g(),n.removeEventListener("input",s),n.removeEventListener("keydown",f),document.removeEventListener("click",c)}}reanchor(n){this.enterPinMode({hint:`Click the element #${n} belongs to`,done:async(o,r,p)=>{try{let a=this.safeAnchor(o,r,p);if(!a)return;let x=await this.api.updateItem(n,{anchor:a});this.upsert(x);let b=this.states.get(n);if(b)b.el=o;this.refresh(),this.toast(`Pinned #${n} again`)}catch(a){this.toast(a.message,!0)}}})}async deleteItem(n){if(!window.confirm(`Delete feedback #${n}? This can’t be undone.`))return;try{await this.api.deleteItem(n),this.closeCard(),this.remove(n),this.refresh(),this.toast(`Deleted #${n}`)}catch(o){this.toast(o.message,!0)}}async openDeepLink(n){let o=this.states.get(n);if(o?.el&&o.placement==="pinned")o.el.scrollIntoView({block:"center",behavior:"auto"}),await new Promise((p)=>requestAnimationFrame(()=>p(null))),this.positionPins(),o.pin?.classList.add("pulse");let r=o?.item;if(r?.breakpoint&&r.breakpoint!==K())this.showBanner(`#${n} was logged at ${r.breakpoint} (${r.context?.viewport_w??"?"}px wide). You're viewing at ${K()} (${window.innerWidth}px). Resize to reproduce.`);await this.openPopover(n)}unresolvedCount(){let n=0;for(let o of this.states.values())if(o.item.status!=="resolved")n++;return n}renderToolbar(){if(!this.mode)return;let n=this.unresolvedCount(),o=i("div",{class:"toolbar",role:"toolbar","aria-label":this.cfg.brand?.name??"Feedback"},i("button",{type:"button",class:"grip",title:"Drag to move · arrow keys snap to a corner","aria-label":"Move toolbar: drag, or use arrow keys to snap to a corner",text:"⠿",onpointerdown:(p)=>this.startDrag(p),onkeydown:(p)=>this.onGripKey(p)}),this.cfg.brand?.logo?i("span",{class:"brand",title:`${this.cfg.brand.name} · drag to move`,onpointerdown:(p)=>this.startDrag(p)},i("img",{src:this.cfg.brand.logo,alt:this.cfg.brand.name})):i("span",{class:"brand",title:"Drag to move",text:this.cfg.brand?.label??"Feedback",onpointerdown:(p)=>this.startDrag(p)}),i("button",{type:"button",class:this.pinMode?"on":"",title:"Click an element to pin feedback (or right-click anywhere)",text:"+ Add",onclick:()=>this.pinMode?this.exitPinMode():this.enterPinMode({hint:"Click any element to add feedback",done:(p,a,x)=>this.openTypeMenu(p,a,x)})}),i("button",{type:"button",text:"Page note",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)}),i("button",{type:"button",class:"icon-btn toggle","aria-pressed":String(this.highlight),title:this.highlight?"Hover highlight is on: click to turn off":"Hover highlight is off: click to turn on","aria-label":"Highlight elements on hover",onclick:()=>this.setHighlight(!this.highlight)},F("highlight")),this.inPreview?null:i("span",{class:"devices",role:"group","aria-label":"Preview at a device size"},...X.map((p)=>p.id==="desktop"?i("button",{type:"button",class:"icon-btn","aria-pressed":"true",title:"Desktop: the page as you see it now","aria-label":"Desktop view (current)",onclick:()=>this.closePreview()},F(p.id)):i("button",{type:"button",class:"icon-btn","aria-pressed":"false",title:`Preview as ${p.label} (${p.w}px)`,"aria-label":`Preview as ${p.label}, ${p.w} pixels wide`,onclick:()=>this.openPreview(p.id)},F(p.id)))),i("button",{type:"button",class:this.sidebar?"on":"",onclick:()=>this.sidebar?this.closeSidebar():this.openSidebar()},i("span",{class:"label",text:"List"}),n?i("span",{class:"count",text:String(n)}):null),i("button",{type:"button",title:"Exit Feedback mode (Alt+Shift+F)","aria-label":"Exit Feedback mode",text:"×",onclick:()=>void this.setMode(!1)})),r=!!this.toolbar;if(o.hidden=!!this.previewEl,this.toolbar)this.toolbar.replaceWith(o);else this.root.append(o);if(this.toolbar=o,this.positionToolbar(!1),!r)this.positionChrome()}updateToolbarCount(){this.renderToolbar()}openPreview(n,o=!1){if(n==="desktop"){this.closePreview();return}let r=X.find((v)=>v.id===n)??X[0],p=o?r.h:r.w,a=o?r.w:r.h,x=`${r.label} ${p}×${a}`;this.closeCard(),this.exitPinMode();let b=this.previewEl?.querySelector("iframe"),g=new URL(b?.contentWindow?.location.href??window.location.href);g.searchParams.delete("fbc_item"),g.searchParams.set("fbc_preview","1"),this.previewEl?.remove();let t=i("iframe",{name:W,title:`${x} preview`,"data-device":x,src:g.toString()});t.style.width=`${p}px`,t.style.height=`${a}px`;let u=i("div",{class:"preview-device"},t),s=i("div",{class:"preview-stage"},u),f=i("div",{class:"preview-blocked",hidden:!0}),c=X.map((v)=>i("button",{type:"button",class:"icon-btn","aria-pressed":String(v.id===r.id),title:v.id==="desktop"?"Desktop: back to the page itself":`${v.label} (${v.w}px)`,"aria-label":v.id==="desktop"?"Desktop: close the preview":`${v.label}, ${v.w} pixels wide`,onclick:()=>v.id==="desktop"?this.closePreview():this.openPreview(v.id,v.id===r.id?o:!1)},F(v.id),i("span",{class:"icon-label",text:v.label}))),d=()=>{window.open(g.toString(),W,`width=${p},height=${a},resizable=yes,scrollbars=yes`)},j=i("div",{class:"preview-bar",role:"toolbar","aria-label":"Device preview"},i("strong",{text:"Device preview"}),i("div",{class:"preview-devices"},...c),i("button",{type:"button",title:"Rotate",text:"⟲ Rotate",onclick:()=>this.openPreview(r.id,!o)}),i("span",{class:"preview-label",text:x}),i("span",{class:"annotator-spacer"}),i("button",{type:"button",text:"Open in a window",onclick:d}),i("button",{type:"button",class:"preview-close",text:"Done",onclick:()=>this.closePreview()})),l=i("div",{class:"preview",role:"dialog","aria-label":`Device preview: ${x}`},j,s,f);if(this.previewEl=l,this.root.append(l),requestAnimationFrame(()=>{let v=s.getBoundingClientRect(),y=Math.min(1,(v.width-32)/p,(v.height-32)/a);u.style.width=`${Math.round(p*y)}px`,u.style.height=`${Math.round(a*y)}px`,t.style.transform=`scale(${y})`}),t.addEventListener("load",()=>{let v=!1;try{v=!!t.contentDocument&&t.contentDocument.location.href!=="about:blank"}catch{v=!1}if(!v)f.hidden=!1,f.replaceChildren(i("p",{text:"This site can’t be shown in a frame here."}),i("button",{type:"button",class:"btn primary",text:`Open ${x} in a window`,onclick:d}))}),this.pinsLayer.hidden=!0,this.toolbar)this.toolbar.hidden=!0;this.closeSidebar()}closePreview(){if(!this.previewEl)return;if(this.previewEl.remove(),this.previewEl=null,this.pinsLayer.hidden=!1,this.toolbar)this.toolbar.hidden=!1;this.loaded=!1,this.loadItems()}topOffset(){let n=document.getElementById("wpadminbar");if(!n)return 0;let o=n.getBoundingClientRect();return o.height>0?Math.max(0,Math.round(o.bottom)):0}toolbarTarget(n){let o=this.toolbar,r=o?.offsetWidth??0,p=o?.offsetHeight??0,a=this.topOffset(),x=n.endsWith("l")?Q:window.innerWidth-r-Q;if(n.endsWith("r")&&this.sidebar&&window.innerWidth>=sn+r+Q*2)x-=sn;let b=n.startsWith("t")?a+Q:window.innerHeight-p-Q;return{x:Math.max(0,x),y:Math.max(a,b)}}nearestCorner(n,o){let r=this.topOffset(),p=o<r+(window.innerHeight-r)/2?"t":"b",a=n<window.innerWidth/2?"l":"r";return`${p}${a}`}positionToolbar(n=!1){let o=this.toolbar;if(!o||this.dragging)return;let{x:r,y:p}=this.toolbarTarget(this.corner);o.classList.toggle("snapping",n),o.style.left=`${r}px`,o.style.top=`${p}px`,o.dataset.corner=this.corner}positionChrome(){this.root.style.setProperty("--top-offset",`${this.topOffset()}px`);let n=this.toolbar?.offsetHeight??0,o=this.toolbar&&this.corner.startsWith("b")?n+Q*2:24;this.root.style.setProperty("--toast-bottom",`${o}px`),this.positionToolbar(!1)}savePrefs(n){this.cfg.prefs={...this.cfg.prefs??{},...n},this.api.savePrefs(n).catch(()=>{})}setCorner(n){this.corner=n;try{if(!this.inPreview)window.localStorage.setItem(tn,n)}catch{}if(!this.inPreview)this.savePrefs({corner:n});this.positionToolbar(!0),this.positionChrome()}startDrag(n){let o=this.toolbar;if(!o||n.button!==0)return;n.preventDefault(),n.stopPropagation();let r=o.getBoundingClientRect(),p=n.clientX-r.left,a=n.clientY-r.top;this.dragging=!0,o.classList.remove("snapping"),o.classList.add("dragging"),this.ghost?.remove(),this.ghost=i("div",{class:"snap-ghost"}),Object.assign(this.ghost.style,{width:`${r.width}px`,height:`${r.height}px`}),this.root.append(this.ghost);let x=(g)=>{let t=this.topOffset(),u=Math.min(Math.max(g.clientX-p,0),window.innerWidth-r.width),s=Math.min(Math.max(g.clientY-a,t),window.innerHeight-r.height);o.style.left=`${u}px`,o.style.top=`${s}px`;let f=this.nearestCorner(u+r.width/2,s+r.height/2),c=this.toolbarTarget(f);if(this.ghost)Object.assign(this.ghost.style,{left:`${c.x}px`,top:`${c.y}px`});o.dataset.target=f},b=(g)=>{window.removeEventListener("pointermove",x,!0),window.removeEventListener("pointerup",b,!0),window.removeEventListener("pointercancel",b,!0);let t=o.getBoundingClientRect();this.dragging=!1,o.classList.remove("dragging"),this.ghost?.remove(),this.ghost=null,delete o.dataset.target,this.setCorner(g.type==="pointercancel"?this.corner:this.nearestCorner(t.left+t.width/2,t.top+t.height/2))};window.addEventListener("pointermove",x,!0),window.addEventListener("pointerup",b,!0),window.addEventListener("pointercancel",b,!0)}onGripKey(n){let r={ArrowLeft:(p)=>`${p[0]}l`,ArrowRight:(p)=>`${p[0]}r`,ArrowUp:(p)=>`t${p[1]}`,ArrowDown:(p)=>`b${p[1]}`}[n.key];if(!r)return;n.preventDefault(),this.setCorner(r(this.corner)),this.toolbar?.querySelector(".grip")?.focus()}openSidebar(){this.sidebar?.remove();let n=this.filters,o=this.cfg.labels,r=i("button",{type:"button",class:`scope-tab ${n.scope==="page"?"active":""}`,"data-scope":"page","aria-selected":String(n.scope==="page"),role:"tab",onclick:()=>this.setScope("page")},i("span",{class:"tab-label",text:"This page"}),i("span",{class:"tab-badge",text:String(this.states.size)})),p=i("button",{type:"button",class:`scope-tab ${n.scope==="all"?"active":""}`,"data-scope":"all","aria-selected":String(n.scope==="all"),role:"tab",onclick:()=>this.setScope("all")},i("span",{class:"tab-label",text:"All pages"}),i("span",{class:"tab-badge",text:this.allItems?String(this.allItems.length):""})),a=i("div",{class:"scope-switch",role:"tablist","aria-label":"Feedback scope"},r,p),x=J("type",[["","All types"],...U.map((f)=>[f,o.type[f]])],n.type,{onchange:()=>{n.type=x.value,this.renderSidebarList()}}),b=J("status",[["unresolved","Unresolved"],["","Any status"],...Object.keys(o.status).map((f)=>[f,o.status[f]])],n.status,{onchange:()=>{n.status=b.value,this.drawPins(),this.renderSidebarList()}}),g=[["0","All rounds"]];for(let f=this.cfg.round;f>=1;f--)g.push([String(f),f===this.cfg.round?`Round ${f} (current)`:`Round ${f}`]);let t=J("round",g,String(n.round),{onchange:()=>{n.round=Number(t.value),this.renderSidebarList()}}),u=J("bp",[["","All breakpoints"],["mobile","Mobile"],["tablet","Tablet"],["desktop","Desktop"]],n.bp,{onchange:()=>{n.bp=u.value,this.renderSidebarList()}}),s=i("input",{type:"checkbox",onchange:()=>{n.mine=s.checked,this.renderSidebarList()}});if(s.checked=n.mine,this.sidebar=i("div",{class:"sidebar",role:"complementary","aria-label":"Feedback list"},i("header",{},i("h2",{},this.cfg.brand?.label??"Feedback",i("button",{class:"x",type:"button","aria-label":"Close list",text:"×",onclick:()=>this.closeSidebar()})),a,i("div",{class:"filters"},x,b,t,u,i("label",{},s,"Assigned to me"))),i("div",{class:"list"})),this.root.append(this.sidebar),this.renderToolbar(),this.renderSidebarList(),!this.allItems)this.api.listItems().then(({items:f})=>{if(this.allItems=f,this.updateScopeBadges(),this.filters.scope==="all"||f.length>this.states.size)this.renderSidebarList()}).catch(()=>{})}setScope(n){if(this.filters.scope===n)return;if(this.filters.scope=n,this.sidebar)this.sidebar.querySelectorAll(".scope-tab").forEach((r)=>{let p=r.dataset.scope===n;r.classList.toggle("active",p),r.setAttribute("aria-selected",String(p))});this.renderSidebarList()}updateScopeBadges(){if(!this.sidebar)return;let n=this.sidebar.querySelector('.scope-tab[data-scope="page"] .tab-badge'),o=this.sidebar.querySelector('.scope-tab[data-scope="all"] .tab-badge');if(n)n.textContent=String(this.states.size);if(o)o.textContent=this.allItems?String(this.allItems.length):""}closeSidebar(){this.sidebar?.remove(),this.sidebar=null,this.renderToolbar()}matchesStatus(n){let o=this.filters.status;if(o==="unresolved")return n.status!=="resolved";return!o||n.status===o}matches(n){let o=this.filters;if(o.type&&n.type!==o.type)return!1;if(o.round&&n.round!==o.round)return!1;if(o.bp&&n.breakpoint!==o.bp)return!1;if(!this.matchesStatus(n))return!1;if(o.mine&&(!this.cfg.assignees.me||n.assignee_id!==this.cfg.assignees.me))return!1;return!0}async renderSidebarList(){let n=this.sidebar?.querySelector(".list");if(!n)return;let o=(b,g,t)=>i("button",{class:"entry",type:"button",onclick:g},i("span",{class:`num ${b.status==="resolved"?"resolved":b.type}`,text:`#${b.id}`}),i("span",{},i("span",{class:"t",text:b.title}),i("span",{class:"s",text:`Round ${b.round} · ${this.cfg.labels.status[b.status]}${b.assignee_name?` · ${b.assignee_name}`:""}${b.breakpoint?` · ${b.breakpoint}`:""}`})),t??null);if(this.filters.scope==="all"){if(!this.allItems){n.replaceChildren(i("div",{class:"empty",text:"Loading…"}));try{this.allItems=(await this.api.listItems()).items,this.updateScopeBadges()}catch(t){n.replaceChildren(i("div",{class:"empty",text:t.message}));return}}let b=new Map;for(let t of this.allItems.filter((u)=>this.matches(u))){let u=b.get(t.page_path)??[];u.push(t),b.set(t.page_path,u)}let g=[];for(let[t,u]of b){g.push(i("h3",{text:t===this.pagePath?`${t} (this page)`:t}));for(let s of u)g.push(o(s,()=>{if(s.page_path===this.pagePath)this.focusItem(s.id);else{let f=new URL(s.page_url,window.location.origin);f.searchParams.set("fbc_item",String(s.id)),window.location.href=f.toString()}}))}n.replaceChildren(...g.length?g:[i("div",{class:"empty",text:"Nothing matches these filters."})]);return}let r={pinned:{title:"On this page",nodes:[]},note:{title:"Page notes",nodes:[]},hidden:{title:"At other breakpoints",nodes:[]},orphan:{title:"Orphaned — element not found",nodes:[]}};for(let b of[...this.states.values()].sort((g,t)=>g.item.id-t.item.id)){if(!this.matches(b.item))continue;let g=b.placement==="orphan"?i("span",{class:"btn link reanchor",role:"button",text:"Pin again",onclick:(t)=>{t.stopPropagation(),this.reanchor(b.item.id)}}):null;r[b.placement].nodes.push(o(b.item,()=>this.focusItem(b.item.id),g))}let p=[];for(let b of["pinned","note","hidden","orphan"]){let g=r[b];if(!g.nodes.length)continue;let t=b==="hidden"?`${g.nodes.length} at other breakpoints`:g.title;p.push(i("h3",{text:t}),...g.nodes)}let a=this.allItems?this.allItems.length:0,x=a-this.states.size;if(p.length>0&&x>0)p.push(i("div",{class:"list-footer-prompt"},i("button",{type:"button",class:"btn-view-all",onclick:()=>this.setScope("all")},`View ${x} more on other pages (${a} total) →`)));if(!p.length){let b=[i("div",{class:"empty",text:"No feedback on this page yet. Right-click anything to add some."})];if(a>0)b.push(i("div",{class:"list-empty-action"},i("button",{type:"button",class:"btn-view-all",onclick:()=>this.setScope("all")},`View all ${a} items on other pages →`)));n.replaceChildren(...b);return}n.replaceChildren(...p)}focusItem(n){let o=this.states.get(n);if(!o)return;if(o.placement==="pinned"&&o.el){if(!this.matchesStatus(o.item)){this.filters.status="";let r=this.sidebar?.querySelector('select[name="status"]');if(r)r.value="";this.drawPins(),this.renderSidebarList()}o.el.scrollIntoView({block:"center",behavior:"smooth"}),window.setTimeout(()=>{this.positionPins(),o.pin?.classList.remove("pulse"),o.pin?.offsetWidth,o.pin?.classList.add("pulse"),this.openPopover(n)},450)}else this.openPopover(n,{x:window.innerWidth-720,y:80})}toast(n,o=!1){let r=i("div",{class:`toast${o?" err":""}`,role:"status",text:n});this.root.append(r),window.setTimeout(()=>r.remove(),o?5000:2200)}showBanner(n){this.bannerEl?.remove(),this.bannerEl=i("div",{class:"banner",role:"status"},i("span",{text:n}),i("button",{type:"button",text:"Dismiss",onclick:()=>{this.bannerEl?.remove(),this.bannerEl=null}})),this.root.append(this.bannerEl)}}an();nn();function Pn(){if(window.self===window.top)return!0;if(window.name!==W)return!1;try{return window.parent.location.origin===window.location.origin}catch{return!1}}function vn(){let n=window.fbcConfig;if(!n||!Pn())return;new D(n).init()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",vn,{once:!0});else vn();})();
