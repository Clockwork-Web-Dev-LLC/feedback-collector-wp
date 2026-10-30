(()=>{var ie=`:host {
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
.preview-bar .icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.preview-bar .icon-label {
  font-size: 12px;
}

/* Screen recording */
/* "Show it": screenshot or video, chosen in the composer */
.attach {
  margin: 2px 0 10px;
}
.attach-pick {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.attach-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--muted);
  margin-right: 2px;
}
.attach-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--line);
  background: var(--soft);
  color: var(--ink);
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 13px;
}
.attach-btn:hover {
  border-color: var(--primary);
}
.attach-btn .icon svg {
  width: 16px;
  height: 16px;
  display: block;
}
.attach .shot {
  margin: 0;
}

/* Hover labels for the toolbar's icon buttons: instant (no native-tooltip delay), and they open
   away from the screen edge the toolbar is docked to. */
.toolbar [data-tip] {
  position: relative;
}
.toolbar [data-tip]::after {
  content: attr(data-tip);
  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);
  transform: translateX(-50%) translateY(4px);
  padding: 5px 9px;
  border-radius: 6px;
  background: #111;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.12s ease, transform 0.12s ease;
  z-index: 1;
}
.toolbar[data-corner^='t'] [data-tip]::after {
  bottom: auto;
  top: calc(100% + 10px);
  transform: translateX(-50%) translateY(-4px);
}
.toolbar [data-tip]:hover::after,
.toolbar [data-tip]:focus-visible::after {
  opacity: 1;
  transform: translateX(-50%);
}
/* Edge buttons: keep the label on screen. */
.toolbar[data-corner$='r'] > [data-tip]:last-child::after {
  left: auto;
  right: 0;
  transform: none;
}
.toolbar.dragging [data-tip]::after {
  display: none;
}
@media (prefers-reduced-motion: reduce) {
  .toolbar [data-tip]::after {
    transition: none;
  }
}
.toolbar.recording {
  gap: 8px;
  padding: 6px 8px 6px 12px;
}
.toolbar .rec-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff3b30;
  animation: rec-blink 1.2s ease-in-out infinite;
}
.toolbar .rec-clock {
  font-variant-numeric: tabular-nums;
  font-size: 13px;
  min-width: 82px;
}
.toolbar .rec-stop {
  background: #ff3b30;
  color: #fff;
  font-weight: 600;
}
.toolbar .rec-stop:hover {
  background: #e0302a;
}
@keyframes rec-blink {
  50% { opacity: 0.25; }
}
/* Pointer and click ripples, drawn into the page so they show in the recording */
.rec-pointer {
  position: fixed;
  left: -14px;
  top: -14px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 214, 10, 0.35);
  border: 2px solid rgba(255, 179, 0, 0.9);
  pointer-events: none;
  will-change: transform;
}
.rec-ripple {
  position: fixed;
  width: 44px;
  height: 44px;
  margin: -22px 0 0 -22px;
  border-radius: 50%;
  border: 3px solid rgba(255, 140, 0, 0.95);
  pointer-events: none;
  animation: rec-ripple 0.7s ease-out forwards;
}
@keyframes rec-ripple {
  from { transform: scale(0.3); opacity: 1; }
  to { transform: scale(1.6); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .toolbar .rec-dot { animation: none; }
}
.rec-preview {
  margin: 2px 0 10px;
}
.rec-preview video,
.rec-block video {
  display: block;
  width: 100%;
  max-height: 220px;
  border-radius: 6px;
  background: #111;
}
.rec-status {
  margin-top: 4px;
}
.rec-block {
  margin: 6px 0 10px;
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 6px;
}
.rec-block summary {
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  padding: 2px 2px 6px;
}
.rec-timeline {
  list-style: none;
  margin: 6px 0 0;
  padding: 0;
  max-height: 140px;
  overflow: auto;
  font-size: 12px;
}
.rec-timeline li {
  display: flex;
  gap: 4px;
  align-items: baseline;
  padding: 2px 0;
  border-top: 1px solid var(--line);
}
.rec-timeline .btn.link {
  padding: 0 4px;
  font-variant-numeric: tabular-nums;
}
.rec-timeline code {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rec-timeline li.error code {
  color: var(--bug);
}

/* Guest mode: the button that opens Feedback mode for logged-out guests (they have no admin bar). */
.launcher {
  position: fixed;
  right: 16px;
  bottom: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px 10px 13px;
  border: 0;
  border-radius: 999px;
  background: var(--dark);
  color: var(--on-dark);
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
  pointer-events: auto;
  transition: transform 120ms ease, box-shadow 120ms ease;
}
.launcher:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.34);
}
.launcher:focus-visible {
  outline: 3px solid var(--brand-accent);
  outline-offset: 2px;
}
.launcher svg {
  width: 18px;
  height: 18px;
}
.guest-name .posting-as {
  margin-bottom: 10px;
}
.guest-name .posting-as .btn.link {
  padding: 0;
}
.guest-status {
  margin: 8px 0;
}
`;var oe="fbcol-root";var Ae=["ember","react-","__next","radix-","headlessui-","mui-","yui_","ext-gen"],Re=/[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i,Ie=/^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;function De(e){let t=/[a-z]/i.test(e),n=/[0-9]/.test(e);if(!t||!n)return!1;if(e.length>=6&&/^[0-9a-f]+$/i.test(e))return!0;return e.length>=8&&/^[0-9a-z]+$/i.test(e)&&_e(e)>=2}function _e(e){let t=0;for(let n=1;n<e.length;n++){let i=/[0-9]/.test(e.charAt(n-1)),o=/[0-9]/.test(e.charAt(n));if(i!==o)t++}return t}function Oe(e){if(e.trim()===""||/\s/.test(e))return!1;if(/^[0-9]/.test(e))return!1;if(/[0-9]{5,}/.test(e))return!1;if(Re.test(e))return!1;if(Ie.test(e))return!1;let t=e.toLowerCase();if(Ae.some((n)=>t.startsWith(n)))return!1;return!e.split(/[-_:.]/).some(De)}function He(e){let t="",n=e.length,i=e.charCodeAt(0);for(let o=0;o<n;o++){let s=e.charCodeAt(o),a=e.charAt(o);if(s===0)t+="�";else if(s>=1&&s<=31||s===127||o===0&&s>=48&&s<=57||o===1&&s>=48&&s<=57&&i===45)t+=`\\${s.toString(16)} `;else if(o===0&&n===1&&s===45)t+=`\\${a}`;else if(s>=128||s===45||s===95||s>=48&&s<=57||s>=65&&s<=90||s>=97&&s<=122)t+=a;else t+=`\\${a}`}return t}function Y(e,t){let n=t?t.CSS:void 0,i=globalThis.CSS,o=n?.escape??i?.escape;return o?o(e):He(e)}function ze(e){return e.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}function H(e){return e.localName.toLowerCase()}function Ne(e){return e.ownerDocument.defaultView}function Be(e){if(!e)return{x:0,y:0};let t=Number.isFinite(e.scrollX)?e.scrollX:0,n=Number.isFinite(e.scrollY)?e.scrollY:0;return{x:t,y:n}}function re(e){if(!Number.isFinite(e))return 0.5;return Math.min(1,Math.max(0,e))}function K(e){let t=e;while(t){if(t.id==="fbcol-root")return!0;if(t.parentElement)t=t.parentElement;else{let n=t.getRootNode();t=n instanceof ShadowRoot?n.host:null}}return!1}function Z(e){if(e===null)return null;let t=e.replace(/\s+/g," ").trim();if(t==="")return null;let n=Array.from(t);return n.length>120?n.slice(0,120).join(""):t}var Fe=/^fl-node-(?!content$)[a-z0-9]+$/i,We=/^[a-z0-9]+$/i;function se(e){let t=1,n=e.previousElementSibling;while(n){if(n.localName===e.localName&&n.namespaceURI===e.namespaceURI)t++;n=n.previousElementSibling}return t}function ae(e,t){if(!e.id||!Oe(e.id))return null;let n=`#${Y(e.id,t.defaultView)}`,i=t.querySelectorAll(n);return i.length===1&&i[0]===e?n:null}function je(e,t){if(e===t.documentElement)return"html";let n=e.localName,i=e.getAttribute("data-id");if(i!==null&&e.classList.contains("elementor-element")&&We.test(i))return`${n}[data-id="${ze(i)}"]`;let o=Array.from(e.classList).find((s)=>Fe.test(s));if(o!==void 0)return`${n}.${Y(o,t.defaultView)}`;return`${n}:nth-of-type(${se(e)})`}function qe(e,t,n){let i=n.querySelectorAll(e);return i.length===1&&i[0]===t}function Ue(e,t){let n=[],i=e;while(i){let o=ae(i,t);if(o!==null)return n.unshift(o),n.join(" > ");n.unshift(je(i,t));let s=n.join(" > ");if(qe(s,e,t))return s;i=i.parentElement}return n.join(" > ")}function Ve(e,t){let n=[],i=e;while(i){let o=H(i),s=i.parentElement,a=i===t.documentElement||s===t.documentElement&&(o==="head"||o==="body");n.unshift(a?o:`${o}[${se(i)}]`),i=s}return`/${n.join("/")}`}var Xe=/^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i,Ge=/^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;function Ye(e,t){if(!Xe.test(e))return null;let n=e.slice(1).split("/"),i=null;for(let o of n){let s=Ge.exec(o);if(!s)return null;let a=(s[1]??"").toLowerCase(),l=s[2]===void 0?1:Number(s[2]),c=i?Array.from(i.children):t.documentElement?[t.documentElement]:[],p=0,u=null;for(let d of c){if(H(d)!==a)continue;if(p++,p===l){u=d;break}}if(!u)return null;i=u}return i}function le(e,t,n){if(!Number.isFinite(t)||!Number.isFinite(n))throw RangeError(`createAnchor: click coordinates must be finite (got ${t}, ${n})`);if(!e.isConnected)throw Error("createAnchor: element is not connected to a document");if(K(e))throw Error("createAnchor: refusing to anchor an element inside #fbcol-root");let i=e.ownerDocument;if(e.getRootNode()!==i)throw Error("createAnchor: element is inside a shadow root; anchor its shadow host instead");let o=e.getBoundingClientRect(),s=Be(i.defaultView),a=o.width>0?re((t-o.left)/o.width):0.5,l=o.height>0?re((n-o.top)/o.height):0.5;return{id:ae(e,i)!==null?e.id:null,selector:Ue(e,i),xpath:Ve(e,i),text:Z(e.textContent),tag:H(e),offsetX:a,offsetY:l,docX:t+s.x,docY:n+s.y}}function j(e,t){return e!==null&&H(e)===t&&!K(e)}function Ke(e){return e instanceof DOMException||e instanceof Error&&e.name==="SyntaxError"}function Ze(e,t){if(typeof e.id!=="string"||e.id==="")return null;let n=t.getElementById(e.id);if(!n)return null;return t.querySelectorAll(`#${Y(e.id,t.defaultView)}`).length===1?n:null}function Je(e,t){if(typeof e.selector!=="string"||e.selector.trim()==="")return null;let n;try{n=t.querySelectorAll(e.selector)}catch(i){if(Ke(i))return null;throw i}return n.length===1?n[0]??null:null}function Qe(e,t){if(typeof e.xpath!=="string")return null;return Ye(e.xpath,t)}function et(e,t){if(typeof e.text!=="string"||e.text==="")return null;let n=null;for(let i of Array.from(t.getElementsByTagName("*"))){if(H(i)!==e.tag||K(i))continue;if(Z(i.textContent)!==e.text)continue;if(n)return null;n=i}return n}function ce(e,t=document){if(typeof e.tag!=="string"||e.tag==="")return{el:null,strategy:"none"};let n=e.tag.toLowerCase(),i=Ze(e,t);if(j(i,n))return{el:i,strategy:"id"};let o,s=()=>{if(o===void 0)o=et({...e,tag:n},t);return j(o,n)?o:null},a=(u)=>{if(e.text===null||Z(u.textContent)===e.text)return null;let d=s();return d&&d!==u?d:null},l=Je(e,t);if(j(l,n)){let u=a(l);return u?{el:u,strategy:"text"}:{el:l,strategy:"selector"}}let c=Qe(e,t);if(j(c,n)){let u=a(c);return u?{el:u,strategy:"text"}:{el:c,strategy:"xpath"}}let p=s();if(p)return{el:p,strategy:"text"};return{el:null,strategy:"none"}}function de(e){if(!e.isConnected)return!1;let t=Ne(e);if(!t)return!1;let n=t.getComputedStyle(e);if(n.visibility==="hidden"||n.visibility==="collapse")return!1;let i=e;while(i){if(t.getComputedStyle(i).display==="none")return!1;i=i.parentElement}let o=e.getBoundingClientRect();return!(o.width===0&&o.height===0)}class z extends Error{status;data;constructor(e,t,n){super(e);this.status=t;this.data=n}}class J{cfg;constructor(e){this.cfg=e}url(e,t){let n=this.cfg.restUrl.replace(/\/$/,"")+e;if(t){let i=new URLSearchParams(t).toString();if(i)n+=(n.includes("?")?"&":"?")+i}return n}async request(e,t,n,i){let o=typeof FormData<"u"&&n instanceof FormData,s=typeof Blob<"u"&&n instanceof Blob,a=await fetch(this.url(t,i),{method:e,credentials:"same-origin",headers:{"X-WP-Nonce":this.cfg.nonce,...n!==void 0&&!o?{"Content-Type":s?"application/octet-stream":"application/json"}:{}},body:n===void 0?void 0:o||s?n:JSON.stringify(n)}),l=await a.json().catch(()=>null);if(!a.ok){let c=l&&typeof l==="object"&&"message"in l?String(l.message):a.statusText,p=l&&typeof l==="object"&&"data"in l?l.data:void 0;throw new z(c,a.status,p)}return l}listItems(e){return this.request("GET","/items",void 0,e?{page_path:e}:void 0)}getItem(e){return this.request("GET",`/items/${e}`)}createItem(e,t){if(!t)return this.request("POST","/items",e);let n=new FormData;return n.append("data",JSON.stringify(e)),n.append("screenshot",t,"screenshot.jpg"),this.request("POST","/items",n)}savePrefs(e){return this.request("POST","/me/prefs",e)}replaceScreenshot(e,t){let n=new FormData;return n.append("screenshot",t,"screenshot.jpg"),this.request("POST",`/items/${e}/screenshot`,n)}startRecording(){return this.request("POST","/recordings")}appendRecording(e,t,n){return this.request("POST",`/recordings/${e}`,n,{offset:String(t)})}discardRecording(e){return this.request("DELETE",`/recordings/${e}`)}updateItem(e,t){return this.request("PATCH",`/items/${e}`,t)}deleteItem(e){return this.request("DELETE",`/items/${e}`)}addComment(e,t,n){return this.request("POST",`/items/${e}/comments`,n?{body:t,guest_name:n}:{body:t})}}function N(e=window.innerWidth){if(e<768)return"mobile";if(e<=1024)return"tablet";return"desktop"}function tt(e){let t=[[/Edg\/([\d.]+)/,"Edge"],[/OPR\/([\d.]+)/,"Opera"],[/Firefox\/([\d.]+)/,"Firefox"],[/CriOS\/([\d.]+)/,"Chrome iOS"],[/Chrome\/([\d.]+)/,"Chrome"],[/Version\/([\d.]+).*Safari/,"Safari"]];for(let[n,i]of t){let o=e.match(n);if(o)return`${i} ${o[1].split(".")[0]}`}return"Unknown"}function nt(e){let t=e.match(/(iPhone|iPad).*OS ([\d_]+)/);if(t)return`iOS ${t[2].replace(/_/g,".")}`;if(t=e.match(/Android ([\d.]+)/),t)return`Android ${t[1]}`;if(t=e.match(/Windows NT ([\d.]+)/),t)return t[1]==="10.0"?"Windows 10/11":`Windows NT ${t[1]}`;if(t=e.match(/Mac OS X ([\d_]+)/),t)return`macOS ${t[1].replace(/_/g,".")}`;if(/CrOS/.test(e))return"ChromeOS";if(/Linux/.test(e))return"Linux";return"Unknown"}var q=null;function pe(){let e=navigator.userAgentData;if(!e)return;e.getHighEntropyValues(["platform","platformVersion"]).then(({platform:t,platformVersion:n})=>{if(!t||!n)return;let[i,o]=n.split(".");if(t==="macOS")q=`macOS ${i}.${o??"0"}`;else if(t==="Windows")q=Number(i)>=13?"Windows 11":"Windows 10";else if(t==="Android"||t==="Chrome OS"||t==="Linux")q=`${t} ${n}`.trim()}).catch(()=>{})}function ue(e){let t=navigator.userAgent;return{viewport_w:window.innerWidth,viewport_h:window.innerHeight,dpr:Math.round((window.devicePixelRatio||1)*100)/100,breakpoint:N(),browser:tt(t),os:q??nt(t),user_agent:t,post_id:e.page.postId,post_type:e.page.postType,theme:e.page.theme,js_errors:(window.__fbcolErrors??[]).slice(-20),preview:it()}}function it(){try{return window.self!==window.top?window.frameElement?.getAttribute("data-device")??"":""}catch{return""}}function he(e){let t=window.location.pathname,n=e.replace(/\/$/,"");if(n&&t.startsWith(n))t=t.slice(n.length);return t="/"+t.replace(/^\/+/,""),t==="/"?"/":t.replace(/\/?$/,"/")}function me(){let e=new URLSearchParams(window.location.search);return e.delete("fbcol_item"),e.delete("fbc_item"),e.toString()}function fe(){if(window.__fbcolErrors)return;let e=window.__fbcolErrors=[],t=(n)=>{if(e.push(n.slice(0,500)),e.length>20)e.shift()};window.addEventListener("error",(n)=>{if(n.message)t(`${n.message}${n.filename?` (${n.filename}:${n.lineno})`:""}`)}),window.addEventListener("unhandledrejection",(n)=>{let i=n.reason;t(`Unhandled rejection: ${i instanceof Error?i.message:String(i)}`)})}function r(e,t={},...n){let i=document.createElement(e);for(let[o,s]of Object.entries(t)){if(s===null||s===void 0||s===!1)continue;if(o.startsWith("on")&&typeof s==="function")i.addEventListener(o.slice(2).toLowerCase(),s);else if(o==="text")i.textContent=String(s);else if(o==="value"&&"value"in i)i.value=String(s);else if(s===!0)i.setAttribute(o,"");else i.setAttribute(o,String(s))}for(let o of n){if(o===null||o===void 0||o===!1)continue;i.append(typeof o==="number"?String(o):o)}return i}function M(e,t,n,i={}){let o=r("select",{name:e,...i});for(let[s,a]of t){let l=r("option",{value:s,text:a});if(s===n)l.selected=!0;o.append(l)}return o}function Q(e){let t=new Date(e).getTime();if(Number.isNaN(t))return"";let n=Math.round((Date.now()-t)/1000);if(n<60)return"just now";let i=Math.round(n/60);if(i<60)return`${i}m ago`;let o=Math.round(i/60);if(o<24)return`${o}h ago`;let s=Math.round(o/24);if(s<30)return`${s}d ago`;return new Date(e).toLocaleDateString()}var rt={phone:'<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',tablet:'<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M11 18.5h2"/>',desktop:'<rect x="2.5" y="4" width="19" height="12.5" rx="1.5"/><path d="M8.5 20.5h7M12 16.5v4"/>',add:'<path d="M12 5v14M5 12h14"/>',note:'<path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5z"/><path d="M15 3v5a1 1 0 0 0 1 1h5M7.5 13h7M7.5 17h4"/>',camera:'<path d="M14.5 4h-5L8 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.5"/>',record:'<circle cx="12" cy="12" r="7" fill="#ff5a5f" stroke="none"/>'};function A(e){let t=document.createElement("span");return t.className="icon",t.setAttribute("aria-hidden","true"),t.innerHTML=`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${rt[e]??""}</svg>`,t}function ge(){let e=document.createElement("span");return e.className="shot-toggle-icon",e.setAttribute("aria-hidden","true"),e.innerHTML='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',e}function be(){let e=document.createElement("span");return e.className="shot-toggle-chevron",e.setAttribute("aria-hidden","true"),e.innerHTML='<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',e}var xe=["video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"],ot=2000,ve=4194304,st=300;function we(){return typeof navigator<"u"&&!!navigator.mediaDevices&&typeof navigator.mediaDevices.getDisplayMedia==="function"&&typeof MediaRecorder<"u"&&xe.some((e)=>MediaRecorder.isTypeSupported(e))}function R(e){let t=Math.max(0,Math.floor(e/1000));return`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`}function at(e){let t=e.closest('a, button, [role="button"], input, select, textarea, label, summary')??e,n=t.tagName.toLowerCase(),i=t.id?`${n}#${t.id}`:`${n}${[...t.classList].slice(0,2).map((s)=>`.${s}`).join("")}`,o="";if(t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement)o=t.getAttribute("aria-label")||t.getAttribute("placeholder")||t.getAttribute("name")||"";else o=t.getAttribute("aria-label")||t.innerText||t.textContent||"";return o=o.replace(/\s+/g," ").trim().slice(0,60),o?`"${o}" (${i})`:i}class ee{api;opts;streams=[];audioCtx=null;rec=null;pieces=[];events=[];token="";queued=0;confirmed=0;queue=Promise.resolve();failed=null;startedAt=0;endedAt=0;tickTimer=0;limitTimer=0;unbinds=[];mic=!1;stopping=!1;cancelled=!1;constructor(e,t){this.api=e;this.opts=t}async start(){let e=await this.api.startRecording();this.token=e.token;let t=Math.min(this.opts.maxSeconds,e.max_seconds||this.opts.maxSeconds),n=null;try{n=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!0,noiseSuppression:!0},video:!1})}catch{n=null}let i;try{i=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:{ideal:30,max:30}},audio:!0,preferCurrentTab:!0,selfBrowserSurface:"include",surfaceSwitching:"exclude",systemAudio:"exclude",monitorTypeSurfaces:"exclude"})}catch(c){throw n?.getTracks().forEach((p)=>p.stop()),this.api.discardRecording(this.token).catch(()=>{return}),c}if(this.cancelled){for(let c of[i,n])c?.getTracks().forEach((p)=>p.stop());throw new DOMException("Recording discarded","AbortError")}this.streams=[i,...n?[n]:[]],this.mic=!!n;let o=[...i.getVideoTracks()],s=[i,n].filter((c)=>!!c&&c.getAudioTracks().length>0);if(s.length){this.audioCtx=new AudioContext;let c=this.audioCtx.createMediaStreamDestination();for(let p of s)this.audioCtx.createMediaStreamSource(p).connect(c);o.push(...c.stream.getAudioTracks())}let a=xe.find((c)=>MediaRecorder.isTypeSupported(c))??"video/webm",l=new MediaRecorder(new MediaStream(o),{mimeType:a,videoBitsPerSecond:1500000,audioBitsPerSecond:96000});this.rec=l,l.ondataavailable=(c)=>{if(c.data.size)this.enqueue(c.data)},l.onstop=()=>this.finish(),i.getVideoTracks()[0]?.addEventListener("ended",()=>this.stop()),this.bindEvents(),l.start(ot),this.startedAt=performance.now(),this.tickTimer=window.setInterval(()=>this.opts.onTick(this.elapsed()),250),this.limitTimer=window.setTimeout(()=>this.stop(),t*1000),this.opts.onTick(0)}get recording(){return!!this.rec&&this.rec.state!=="inactive"&&!this.stopping}elapsed(){return(this.endedAt||performance.now())-this.startedAt}stop(){if(!this.rec||this.stopping)return;this.stopping=!0,this.endedAt=performance.now(),window.clearInterval(this.tickTimer),window.clearTimeout(this.limitTimer);for(let e of this.unbinds)e();if(this.unbinds=[],this.rec.state!=="inactive")this.rec.stop();else this.finish()}async discard(){this.cancelled=!0,this.opts.onStop=()=>{return},this.stop(),await this.queue,await this.api.discardRecording(this.token).catch(()=>{return})}finish(){for(let t of this.streams)t.getTracks().forEach((n)=>n.stop());this.streams=[],this.audioCtx?.close().catch(()=>{return}),this.audioCtx=null;let e=new Blob(this.pieces,{type:"video/webm"});this.opts.onStop({blob:e,durationMs:Math.round(this.elapsed()),events:this.events.slice(),mic:this.mic,progress:()=>this.queued?Math.min(1,this.confirmed/this.queued):1,uploaded:()=>this.uploaded(e),discard:()=>this.discard()})}enqueue(e){this.pieces.push(e);let t=this.queued;this.queued+=e.size,this.queue=this.queue.then(async()=>{if(this.failed)return;try{await this.send(this.token,t,e)}catch(n){this.failed=n}})}async send(e,t,n){for(let i=0;;i++)try{let{size:o}=await this.api.appendRecording(e,t,n);this.confirmed=Math.max(this.confirmed,o);return}catch(o){if(o instanceof z&&o.status===409&&Number(o.data?.size)>=t+n.size){this.confirmed=Math.max(this.confirmed,Number(o.data?.size));return}if(!(!(o instanceof z)||o.status>=500||o.status===429)||i>=3)throw o;await new Promise((a)=>window.setTimeout(a,800*2**i))}}async uploaded(e){if(await this.queue,!this.failed)return this.token;this.api.discardRecording(this.token).catch(()=>{return});let t=await this.api.startRecording();this.token=t.token,this.failed=null,this.confirmed=0,this.queued=e.size;for(let n=0;n<e.size;n+=ve)await this.send(this.token,n,e.slice(n,n+ve));return this.token}log(e,t){if(this.events.length>=st||!this.recording)return;this.events.push({t:Math.round(this.elapsed()),kind:e,label:t.slice(0,200)})}bindEvents(){let e=(t,n,i)=>{t.addEventListener(n,i,!0),this.unbinds.push(()=>t.removeEventListener(n,i,!0))};e(document,"pointerdown",(t)=>{if(t.button!==0||this.opts.isOverlay(t)||!(t.target instanceof Element))return;this.log("click",at(t.target))}),e(window,"error",(t)=>{if(t.message)this.log("error",`${t.message}${t.filename?` (${t.filename}:${t.lineno})`:""}`)}),e(window,"unhandledrejection",(t)=>{let n=t.reason;this.log("error",`Unhandled rejection: ${n instanceof Error?n.message:String(n)}`)}),e(window,"beforeunload",(t)=>{t.preventDefault(),t.returnValue=""})}}function ye(e){let t=document.createElement("div");t.className="rec-pointer",t.hidden=!0,e.append(t);let n=(s)=>{t.hidden=!1,t.style.transform=`translate(${s.clientX}px, ${s.clientY}px)`},i=(s)=>{n(s);let a=document.createElement("div");a.className="rec-ripple",a.style.left=`${s.clientX}px`,a.style.top=`${s.clientY}px`,e.append(a),window.setTimeout(()=>a.remove(),700)},o=()=>{t.hidden=!0};return document.addEventListener("pointermove",n,{capture:!0,passive:!0}),document.addEventListener("pointerdown",i,{capture:!0,passive:!0}),document.documentElement.addEventListener("pointerleave",o),()=>{document.removeEventListener("pointermove",n,{capture:!0}),document.removeEventListener("pointerdown",i,{capture:!0}),document.documentElement.removeEventListener("pointerleave",o),t.remove()}}function ke(e,t=document.cookie){if(!e)return"";let n=`${e.nameCookie}=`;for(let i of t.split(";")){let o=i.trim();if(!o.startsWith(n))continue;try{return U(decodeURIComponent(o.slice(n.length)),e.nameMax)}catch{return""}}return""}function U(e,t=60){return e.replace(/[\u0000-\u001f\u007f<>]/g,"").replace(/\s+/g," ").trim().slice(0,t)}function lt(e,t,n=location.protocol==="https:"){return`${e.nameCookie}=${encodeURIComponent(t)}; path=${e.cookiePath||"/"}; max-age=31536000; SameSite=Lax${n?"; Secure":""}`}function Ee(e,t){if(!e)return;let n=U(t,e.nameMax);if(!n)return;try{document.cookie=lt(e,n)}catch{}}var B=["bug","tweak","change","comment"],Te="fbc:mode",Se="fbc:corner",F="fbc-preview",V=[{id:"phone",label:"Mobile",w:390,h:844},{id:"tablet",label:"Tablet",w:820,h:1180},{id:"desktop",label:"Desktop",w:1440,h:900}],I=16,Ce=360,ct=["tl","tr","bl","br"];function dt(){let e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`}function pt(e,t){let[n,i,o]=e.split("-").map(Number);return new Date(Date.UTC(n,i-1,o+t)).toISOString().slice(0,10)}function Me(e,t=Date.now()){if(!e)return"";if(e.batchUntil&&t<e.batchUntil*1000)return e.suggest;if(!e.batchUntil&&e.suggest)return e.suggest;return pt(dt(),e.days)}function Le(e,t){let n=r("video",{src:e,controls:!0,preload:"metadata",playsinline:!0,title:`Screen recording (${R(t*1000)})`});return n.addEventListener("loadedmetadata",()=>{if(n.duration!==1/0)return;let i=()=>{n.removeEventListener("durationchange",i),n.currentTime=0};n.addEventListener("durationchange",i),n.currentTime=1e9},{once:!0}),n}class te{cfg;api;host;root;pinsLayer;outline;outlineTag;toolbar=null;sidebar=null;card=null;hintEl=null;bannerEl=null;launcher=null;guest;mode=!1;pinMode=null;states=new Map;allItems=null;filters={scope:"page",type:"",status:"unresolved",mine:!1,round:0,bp:""};pagePath;framePending=!1;refreshTimer=0;lastWidth=window.innerWidth;mutationObserver=null;loaded=!1;corner="br";dragging=!1;ghost=null;inPreview=window.self!==window.top&&window.name===F;previewEl=null;selectedEl=null;unbinds=[];cardCleanup=null;cardGuard=null;recorder=null;recClock=null;stopTrail=null;recDone=null;constructor(e){this.cfg=e;this.api=new J(e),this.pagePath=e.pagePath??he(e.homePath),this.guest=!!e.guest}guestName(){return ke(this.cfg.guest)}guestNameField(){let e=this.cfg.guest?.nameMax??60,t=null,n=r("div",{class:"guest-name"}),i=(s)=>{t=r("input",{type:"text",name:"guest_name",maxlength:e,required:!0,autocomplete:"name",placeholder:"So the team knows who this is from",value:s}),n.replaceChildren(r("label",{class:"field"},r("span",{text:"Your name"}),t))},o=this.guestName();if(o)n.replaceChildren(r("div",{class:"meta posting-as"},"Posting as ",r("strong",{text:o})," · ",r("button",{type:"button",class:"btn link",text:"Change",onclick:()=>{i(o),t?.focus(),t?.select()}})));else i("");return{el:n,input:()=>t,value:()=>U(t?t.value:o,e),remember:()=>{if(t)Ee(this.cfg.guest,t.value)}}}destroy(){if(this.recorder)this.recorder.discard();if(this.stopTrail?.(),this.cardCleanup)this.cardCleanup(),this.cardCleanup=null;for(let e of this.unbinds)e();if(this.unbinds=[],this.mutationObserver)this.mutationObserver.disconnect(),this.mutationObserver=null;if(this.refreshTimer)window.clearTimeout(this.refreshTimer),this.refreshTimer=0;this.host?.remove()}listen(e,t,n,i){e.addEventListener(t,n,i),this.unbinds.push(()=>e.removeEventListener(t,n,i))}init(){this.mount(),this.bindGlobalEvents(),this.bindAdminBar();let e=!1,t=null;try{e=window.localStorage.getItem(Te)==="1";let i=window.localStorage.getItem(Se);if(i&&ct.includes(i))t=i}catch{e=!1}let n=this.cfg.prefs??{};if(this.corner=n.corner??t??this.corner,!this.inPreview&&!this.guest){let i={};if(!n.corner&&t)i.corner=t;if(Object.keys(i).length)this.savePrefs(i)}if(this.inPreview){let i=document.createElement("style");i.textContent="#wpadminbar{display:none!important}html{margin-top:0!important}",document.head.append(i),this.corner="bl",this.setMode(!0);return}if(this.cfg.openItem||e)this.setMode(!0);else this.renderLauncher()}renderLauncher(){if(!(this.guest||this.cfg.launcher)||this.inPreview||this.mode){this.launcher?.remove(),this.launcher=null;return}if(this.launcher)return;this.launcher=r("button",{type:"button",class:"launcher",title:"Leave feedback on this page (Alt+Shift+F)","aria-label":"Leave feedback",onclick:()=>void this.setMode(!0)},A("note"),r("span",{text:"Feedback"})),this.root.append(this.launcher)}mount(){this.host=r("div",{id:oe}),this.host.setAttribute("style","all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;");let e=this.host.attachShadow({mode:"open"});e.append(r("style",{text:ie})),this.root=r("div",{class:"fbc"});let t=this.cfg.brand;if(t){let i=[["--primary",t.primary],["--on-primary",t.onPrimary],["--dark",t.dark],["--on-dark",t.onDark],["--brand-accent",t.accent],["--ink-primary",t.ink??""]];for(let[o,s]of i)if(s)this.root.style.setProperty(o,s)}let n=r("div",{class:"layer"});this.outlineTag=r("span",{class:"outline-tag"}),this.outline=r("div",{class:"outline"},this.outlineTag),this.pinsLayer=r("div"),n.append(this.outline,this.pinsLayer),this.root.append(n),e.append(this.root),document.body.append(this.host)}inOverlay(e){return e.composedPath().includes(this.host)}bindGlobalEvents(){this.listen(document,"contextmenu",(e)=>this.onContextMenu(e),!0),this.listen(document,"mousemove",(e)=>this.onMouseMove(e),{capture:!0,passive:!0});for(let e of["pointerdown","mousedown","mouseup","click"])this.listen(document,e,(t)=>this.onPinModeEvent(t),!0);this.listen(document,"mousedown",(e)=>this.onOutsideMouseDown(e),!1),this.listen(document,"keydown",(e)=>this.onKeyDown(e),!0),this.listen(window,"scroll",()=>this.schedulePosition(),{passive:!0,capture:!0}),this.listen(window,"resize",()=>{let e=window.innerWidth!==this.lastWidth;if(this.lastWidth=window.innerWidth,this.card?.classList.contains("popover")||this.card?.classList.contains("composer"))this.card.style.maxHeight=`${Math.max(160,window.innerHeight-this.topOffset()-24)}px`,this.moveCard(this.card,this.card.offsetLeft,this.card.offsetTop);if(e)this.scheduleRefresh(80);else this.schedulePosition()})}bindAdminBar(){let e=document.querySelector("#wp-admin-bar-fbcol-toggle > a");if(e)this.listen(e,"click",(t)=>{t.preventDefault(),this.setMode(!this.mode)})}async setMode(e){if(!e&&this.recorder){this.toast("Stop or discard the recording first",!0);return}if(this.mode=e,!this.inPreview)try{window.localStorage.setItem(Te,e?"1":"0")}catch{}if(document.querySelector("#wp-admin-bar-fbcol-toggle")?.classList.toggle("fbc-on",e),this.renderLauncher(),!e){this.exitPinMode(),this.closeCard(),this.closeSidebar(),this.hideOutline(),this.toolbar?.remove(),this.toolbar=null,this.bannerEl?.remove(),this.bannerEl=null,this.pinsLayer.replaceChildren();for(let t of this.states.values())t.pin=null;this.mutationObserver?.disconnect();return}if(this.renderToolbar(),this.observeMutations(),!this.loaded)await this.loadItems();else this.refresh();if(this.cfg.openItem){let t=this.cfg.openItem;this.cfg.openItem=0,this.stripDeepLinkParam(),this.openDeepLink(t)}}stripDeepLinkParam(){let e=new URL(window.location.href);if(e.searchParams.has("fbcol_item")||e.searchParams.has("fbc_item"))e.searchParams.delete("fbcol_item"),e.searchParams.delete("fbc_item"),window.history.replaceState(window.history.state,"",e.toString())}async loadItems(){try{let{items:e}=await this.api.listItems(this.pagePath),t=new Map(this.states);this.states.clear();for(let n of e){let i=t.get(n.id);t.delete(n.id),this.states.set(n.id,{item:n,el:i?.el??null,placement:"orphan",pin:i?.pin??null})}for(let n of t.values())n.pin?.remove();this.loaded=!0,this.refresh()}catch(e){this.toast(`Could not load feedback: ${e.message}`,!0)}}upsert(e){let t=this.states.get(e.id);if(t)t.item=e;else this.states.set(e.id,{item:e,el:null,placement:"orphan",pin:null});if(this.allItems){let n=this.allItems.findIndex((i)=>i.id===e.id);if(n>=0)this.allItems[n]=e;else this.allItems.push(e)}this.updateScopeBadges()}remove(e){if(this.states.get(e)?.pin?.remove(),this.states.delete(e),this.allItems)this.allItems=this.allItems.filter((n)=>n.id!==e);this.updateScopeBadges()}refresh(){for(let e of this.states.values()){if(!e.item.anchor){e.el=null,e.placement="note";continue}let t=e.el&&e.el.isConnected?e.el:ce(e.item.anchor).el;e.el=t,e.placement=!t?"orphan":de(t)?"pinned":"hidden"}if(this.drawPins(),this.updateToolbarCount(),this.sidebar)this.renderSidebarList()}drawPins(){if(!this.mode)return;for(let e of this.states.values()){if(!(e.placement==="pinned"&&this.matchesStatus(e.item))){e.pin?.remove(),e.pin=null;continue}if(!e.pin){let o=r("button",{class:"pin",type:"button","aria-label":`Feedback #${e.item.id}: ${e.item.title}`,onclick:(s)=>{s.stopPropagation(),this.openPopover(e.item.id)}});e.pin=o,this.pinsLayer.append(o)}let n=e.item.status==="resolved",i=e.pin.classList.contains("pulse");e.pin.className=`pin ${e.item.type}${n?" resolved":""}${i?" pulse":""}`,e.pin.textContent=n?"✓":String(e.item.id),e.pin.title=`#${e.item.id} ${e.item.title}`}this.positionPins()}schedulePosition(){if(this.framePending||!this.mode)return;this.framePending=!0,requestAnimationFrame(()=>{if(this.framePending=!1,this.positionPins(),this.positionChrome(),this.selectedEl)this.hideOutline()})}scheduleRefresh(e=250){window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.mode&&this.refresh(),e)}positionPins(){for(let e of this.states.values()){if(!e.pin||!e.el||!e.item.anchor)continue;let t=e.el.getBoundingClientRect(),n=t.left+e.item.anchor.offsetX*t.width,i=t.top+e.item.anchor.offsetY*t.height;e.pin.style.transform=`translate(${Math.round(n)}px, ${Math.round(i)}px)`}}observeMutations(){if(!this.mutationObserver)this.mutationObserver=new MutationObserver((e)=>{if(e.every((t)=>t.target===this.host||this.host.contains(t.target)))return;this.schedulePosition(),this.scheduleRefresh(300)});this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden","open"]})}onContextMenu(e){if(!this.mode||this.recorder||e.altKey||this.inOverlay(e))return;let t=this.eventTarget(e);if(!t)return;e.preventDefault(),e.stopPropagation(),this.exitPinMode(),this.openTypeMenu(t,e.clientX,e.clientY)}onPinModeEvent(e){if(!this.pinMode||this.inOverlay(e)||e.button!==0)return;if(e.preventDefault(),e.stopImmediatePropagation(),e.type!=="click")return;let t=this.eventTarget(e),n=this.pinMode;if(this.exitPinMode(),t)n.done(t,e.clientX,e.clientY)}onOutsideMouseDown(e){if(this.card&&!this.inOverlay(e)&&!this.cardGuard&&!this.recorder)this.closeCard()}onMouseMove(e){if(!this.mode||this.recorder||!this.pinMode||this.inOverlay(e)){if(!this.pinMode)this.hideOutline();return}let t=this.eventTarget(e);if(!t||t===document.documentElement||t===document.body){this.hideOutline();return}this.drawOutline(t)}drawOutline(e){let t=e.getBoundingClientRect();Object.assign(this.outline.style,{left:`${t.left}px`,top:`${t.top}px`,width:`${t.width}px`,height:`${t.height}px`});let n=e.id?`#${e.id}`:"";this.outlineTag.textContent=`${e.tagName.toLowerCase()}${n}`,this.outline.classList.add("on")}onKeyDown(e){if(this.annotating)return;let t=e.composedPath()[0],n=t instanceof HTMLElement&&(t.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(t.tagName));if(e.altKey&&e.shiftKey&&e.code==="KeyF"&&!n){e.preventDefault(),this.setMode(!this.mode);return}if(e.key==="Escape"&&this.previewEl){e.preventDefault(),this.closePreview();return}if(e.key==="Escape"&&this.mode){if(this.pinMode)this.exitPinMode(),e.preventDefault();else if(this.card)this.closeCard(),e.preventDefault();else if(this.sidebar)this.closeSidebar(),e.preventDefault()}}eventTarget(e){let t=e.target;if(t instanceof Element)return t;if(t instanceof Node)return t.parentElement;return null}hideOutline(){if(this.selectedEl?.isConnected){this.drawOutline(this.selectedEl),this.outline.classList.add("locked");return}this.outline.classList.remove("on","locked")}enterPinMode(e){this.closeCard(),this.pinMode=e,this.hintEl?.remove(),this.hintEl=r("div",{class:"crosshair-hint",text:`${e.hint} · Esc to cancel`}),this.root.append(this.hintEl),document.documentElement.style.cursor="crosshair",this.renderToolbar()}exitPinMode(){if(!this.pinMode)return;this.pinMode=null,this.hintEl?.remove(),this.hintEl=null,document.documentElement.style.cursor="",this.hideOutline(),this.renderToolbar()}scripts=new Map;annotating=!1;async annotate(e){if(this.annotating)return null;this.annotating=!0;try{if(!window.FBCOLAnnotator)await this.loadBundle("annotator.js");let t=window.FBCOLAnnotator;if(!t)throw Error("The annotator could not load.");let n=this.cfg.brand?.primary??"#6953c4";return await t.open({image:e,mount:this.root,colors:["#e5383b",n,"#ffb703","#ffffff","#111111"]})}catch(t){return this.toast(t.message,!0),null}finally{this.annotating=!1}}loadBundle(e){let t=this.scripts.get(e);if(t)return t;let n=this.cfg.assetsUrl??"",i=new Promise((o,s)=>{let a=document.createElement("script");a.src=`${n}${e}${this.cfg.version?`?ver=${encodeURIComponent(this.cfg.version)}`:""}`,a.async=!0,a.onload=()=>o(),a.onerror=()=>{this.scripts.delete(e),s(Error(`Could not load ${e}`))},document.head.append(a)});return this.scripts.set(e,i),i}async startCapture(e){if(!this.cfg.shots||!this.cfg.assetsUrl)return null;try{if(!window.FBCOLCapture)await this.loadBundle("capture.js");let t=window.FBCOLCapture;if(!t)return null;return await t.captureViewport({marker:e,color:this.cfg.brand?.primary??"#6953c4"})}catch{return null}}assigneeOptions(){return[["0","Unassigned"],...this.cfg.assignees.people.map((e)=>[String(e.id),e.name])]}assigneeLabel(){return this.cfg.assignees.source==="teamwork"?"Assignee (Teamwork)":"Assignee"}safeAnchor(e,t,n){try{return le(e,t,n)}catch{return this.toast("Can't pin to that element. Try its container, or add a page note.",!0),null}}closeCard(e=!1){if(this.cardGuard){if(!this.cardGuard())return;this.cardGuard=null}if(this.cardCleanup)this.cardCleanup(),this.cardCleanup=null;if(this.card?.remove(),this.card=null,!e)this.selectedEl=null,this.hideOutline()}releaseCard(){if(!this.card)return!0;return this.closeCard(!0),!this.card}showCard(e,t,n){if(this.closeCard(!0),this.hideOutline(),this.card=e,e.style.left="0px",e.style.top="0px",e.style.visibility="hidden",e.style.maxHeight=`${Math.max(160,window.innerHeight-this.topOffset()-24)}px`,this.root.append(e),this.moveCard(e,t+8,n+8),e.style.visibility="",typeof ResizeObserver<"u"){let o=new ResizeObserver(()=>{if(!e.isConnected)return o.disconnect();this.moveCard(e,e.offsetLeft,e.offsetTop)});o.observe(e)}e.addEventListener("load",()=>this.moveCard(e,e.offsetLeft,e.offsetTop),!0);let i=e.querySelector(":scope > .head");if(i)i.classList.add("drag"),i.title="Drag to move",i.addEventListener("pointerdown",(o)=>this.startCardDrag(e,o))}moveCard(e,t,n){let i=this.topOffset()+12,o=Math.max(12,window.innerWidth-e.offsetWidth-12),s=Math.max(i,window.innerHeight-e.offsetHeight-12);e.style.left=`${Math.round(Math.max(12,Math.min(t,o)))}px`,e.style.top=`${Math.round(Math.max(i,Math.min(n,s)))}px`}startCardDrag(e,t){if(t.button!==0||t.target.closest("button, a, input, select, textarea"))return;t.preventDefault();let n=t.currentTarget,i=t.clientX-e.offsetLeft,o=t.clientY-e.offsetTop;try{n.setPointerCapture(t.pointerId)}catch{}e.classList.add("dragging");let s=(l)=>this.moveCard(e,l.clientX-i,l.clientY-o),a=()=>{e.classList.remove("dragging"),n.removeEventListener("pointermove",s),n.removeEventListener("pointerup",a),n.removeEventListener("pointercancel",a)};n.addEventListener("pointermove",s),n.addEventListener("pointerup",a),n.addEventListener("pointercancel",a)}openTypeMenu(e,t,n){if(!this.releaseCard())return;this.selectedEl=e;let i=this.cfg.labels.type,o=(l)=>this.openComposer(l,e,t,n),s=B.map((l,c)=>r("button",{type:"button",onclick:()=>o(l)},r("span",{class:`dot ${l}`}),i[l],r("kbd",{text:String(c+1)}))),a=r("div",{class:"card menu",role:"menu",onkeydown:(l)=>{let c=l.key,p=Number(c);if(p>=1&&p<=B.length)l.preventDefault(),o(B[p-1])}},r("div",{class:"menu-title",text:"Add feedback"}),...s,r("hr"),r("button",{type:"button",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},"Note for the whole page"));this.showCard(a,t,n),s[0].focus()}openComposer(e,t,n,i){if(!this.releaseCard())return;this.selectedEl=t;let o=null;if(t){if(o=this.safeAnchor(t,n,i),!o)return}let s=this.cfg.labels,a=M("type",B.map((g)=>[g,s.type[g]]),e),l=r("input",{type:"text",name:"title",maxlength:255,required:!0,placeholder:"What needs attention?",autocomplete:"off"}),c=r("textarea",{name:"description",placeholder:"Details, steps to reproduce, what you expected… (optional)"}),p=M("priority",Object.keys(s.priority).map((g)=>[g,s.priority[g]]),"medium"),u=M("assignee_id",this.assigneeOptions(),"0"),d=r("input",{type:"checkbox",name:"due_on"});d.checked=!!this.cfg.due?.onByDefault;let w=r("input",{type:"date",name:"due_date",value:Me(this.cfg.due)});w.hidden=!d.checked,d.addEventListener("change",()=>{if(w.hidden=!d.checked,d.checked&&!w.value)w.value=Me(this.cfg.due)});let m=r("div",{class:"error",role:"alert"}),x=r("button",{class:"btn primary",type:"submit",text:"Add"}),v=this.guest?this.guestNameField():null,h=null,f=!1,T=!!this.cfg.shots&&!!this.cfg.assetsUrl,D=this.canRecordHere(),X=t?{x:n,y:i}:null,k=r("div",{class:"attach","aria-live":"polite"}),b=(g)=>{if(!h)return;if(URL.revokeObjectURL(h.url),h.kind==="video"){if(window.clearInterval(h.timer),g)h.rec.discard()}h=null},S=()=>{this.cardGuard=f||h?.kind==="video"?()=>{if(f)return!1;if(!window.confirm("Discard this screen recording?"))return!1;return b(!0),!0}:null},_=async()=>{k.replaceChildren(r("div",{class:"meta",text:"Capturing screenshot…"}));let g=await this.startCapture(X);if(!C.isConnected)return;if(g)b(!0),h={kind:"shot",blob:g,url:URL.createObjectURL(g)};else this.toast("Couldn’t capture a screenshot",!0);L()},W=()=>{f=!0,S(),C.hidden=!0,this.startRecording((g)=>{if(f=!1,!C.isConnected){if(g)g.discard();return}if(C.hidden=!1,g){b(!0);let y=()=>{let P=g.progress(),E=k.querySelector(".rec-status");if(E)E.textContent=P>=1?`Uploaded${g.mic?"":" · no microphone"}`:`Uploading… ${Math.round(P*100)}%`;if(P>=1&&h?.kind==="video")window.clearInterval(h.timer)};h={kind:"video",rec:g,url:URL.createObjectURL(g.blob),timer:window.setInterval(y,400)},L(),y()}else L();S(),this.moveCard(C,C.offsetLeft,C.offsetTop),l.focus()})},O=(g)=>r("button",{type:"button",class:"btn link",text:g,onclick:()=>{b(!0),L(),S()}}),L=()=>{if(!h){k.replaceChildren(...T||D?[r("div",{class:"attach-pick"},r("span",{class:"attach-label",text:"Show it"}),T?r("button",{type:"button",class:"btn attach-btn",onclick:()=>void _()},A("camera"),"Screenshot"):null,D?r("button",{type:"button",class:"btn attach-btn",onclick:W},A("record"),"Video"):null)]:[]);return}if(h.kind==="shot"){let y=h;k.replaceChildren(r("div",{class:"shot"},r("img",{src:y.url,alt:"Screenshot that will be attached"}),r("div",{class:"shot-actions"},r("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{let P=await this.annotate(y.blob);if(!P||h!==y)return;URL.revokeObjectURL(y.url),h={kind:"shot",blob:P,url:URL.createObjectURL(P)},L()}}),r("button",{type:"button",class:"btn link",text:"Retake",onclick:()=>void _()}),O("Remove"))));return}let g=h;k.replaceChildren(r("div",{class:"rec-preview"},Le(g.url,g.rec.durationMs/1000),r("div",{class:"meta"},`Screen recording · ${R(g.rec.durationMs)}`,g.rec.events.length?` · ${g.rec.events.length} click${g.rec.events.length===1?"":"s"} and errors logged`:""),r("div",{class:"meta rec-status"}),r("div",{class:"shot-actions"},D?r("button",{type:"button",class:"btn link",text:"Re-record",onclick:W}):null,O("Remove"))))};L();let C=r("form",{class:"card composer",novalidate:!0,onsubmit:(g)=>{g.preventDefault(),G()}},r("div",{class:"head"},r("span",{class:"chip"},r("span",{class:`dot ${e}`}),t?`<${t.tagName.toLowerCase()}>`:"Whole page"),r("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),v?v.el:null,r("label",{class:"field"},r("span",{text:"Title"}),l),m,r("label",{class:"field"},r("span",{text:"Description"}),c),this.guest?r("label",{class:"field"},r("span",{text:"Type"}),a):r("div",{class:"row"},r("label",{class:"field"},r("span",{text:"Type"}),a),r("label",{class:"field"},r("span",{text:"Priority"}),p)),this.guest?null:r("label",{class:"field"},r("span",{text:this.assigneeLabel()}),u),!this.guest&&this.cfg.assignees.fallback?r("div",{class:"meta hint",text:"Showing WordPress users until Teamwork is connected (Feedback → Settings). Then this lists your Teamwork project members."}):null,this.guest?null:r("div",{class:"field due-field"},r("label",{class:"check"},d," Set date?"),w),k,r("div",{class:"actions"},r("button",{class:"btn link",type:"button",text:"Cancel",onclick:()=>this.closeCard()}),x)),G=async()=>{m.textContent="";let g=v?v.value():"";if(v&&!g){m.textContent="Please add your name.",v.input()?.focus();return}if(!l.value.trim()){m.textContent="Add a short title.",l.focus();return}x.disabled=!0;try{let y=h,P;if(y?.kind==="video")x.textContent="Uploading…",P={token:await y.rec.uploaded(),duration:Math.round(y.rec.durationMs/1000),events:y.rec.events};let E=await this.api.createItem({type:a.value,title:l.value.trim(),description:c.value,priority:p.value,assignee_id:Number(u.value),assignee_source:this.cfg.assignees.source,due_date:d.checked&&w.value?w.value:null,page_path:this.pagePath,page_query:me(),page_title:document.title,anchor:o,context:ue(this.cfg),recording:P,...v?{guest_name:g}:{}},y?.kind==="shot"?y.blob:null);if(v?.remember(),b(!1),this.cardGuard=null,E.due_next&&!this.guest)this.cfg.due=E.due_next;this.closeCard(),this.upsert(E);let ne=this.states.get(E.id);if(ne&&t)ne.el=t;if(this.refresh(),E.video_error)this.toast(`Added #${E.id}, but the recording wasn’t saved: ${E.video_error}`,!0);else if(E.screenshot_error)this.toast(`Added #${E.id}, but the screenshot wasn’t saved: ${E.screenshot_error}`,!0);else this.toast(`Added #${E.id}`)}catch(y){m.textContent=y.message,x.disabled=!1,x.textContent="Add"}};if(this.showCard(C,n,i),this.cardCleanup=()=>{if(h?.kind==="shot")b(!1)},v?.input())v.input()?.focus();else l.focus()}async openPopover(e,t){if(!this.releaseCard())return;let n;try{n=await this.api.getItem(e)}catch(b){this.toast(b.message,!0);return}this.upsert(n);let i=this.cfg.labels,o=this.states.get(e),s=o?.pin?.getBoundingClientRect(),a=t?.x??(s?s.right:window.innerWidth/2-170),l=t?.y??(s?s.top:100),c=async(b)=>{try{let S=await this.api.updateItem(e,b);this.upsert(S),this.refresh(),this.openPopover(e,{x:parseFloat(k.style.left)-8,y:parseFloat(k.style.top)-8})}catch(S){this.toast(S.message,!0)}},p=M("status",Object.keys(i.status).map((b)=>[b,i.status[b]]),n.status,{onchange:()=>void c({status:p.value})}),u=M("assignee_id",this.assigneeOptions(),String(n.assignee_id),{onchange:()=>void c({assignee_id:Number(u.value),assignee_source:this.cfg.assignees.source})}),d=M("priority",Object.keys(i.priority).map((b)=>[b,i.priority[b]]),n.priority,{onchange:()=>void c({priority:d.value})}),w=r("input",{type:"date",name:"due_date",value:n.due_date??"",class:n.overdue?"overdue":"",onchange:()=>void c({due_date:w.value||null})}),m=r("textarea",{placeholder:this.guest?"Reply…":"Reply… (type @ to mention)",rows:2}),x=r("label",{class:"field mention-container"},m),v=this.guest?()=>{}:this.setupMentions(m,x),h=this.guest?this.guestNameField():null,f=r("ul",{class:"thread"},...(n.comments??[]).map((b)=>r("li",{class:b.kind},r("span",{class:"who",text:b.user_name}),r("span",{class:"when",text:Q(b.created_at)}),this.renderMentionText("body",b.body)))),T=N(),D=n.breakpoint&&n.breakpoint!==T?r("div",{class:"notice",text:`Logged at ${n.breakpoint} (${n.context?.viewport_w??"?"}px). You are on ${T} (${window.innerWidth}px).`}):null,X=o?.placement==="orphan"?r("div",{class:"notice",text:this.guest?"The element this was pinned to can’t be found on the page anymore.":"The element this was pinned to can’t be found on the page anymore. Use “Pin again” in the list to place it."}):null,k=r("div",{class:"card popover",role:"dialog","aria-label":`Feedback #${n.id}`},r("div",{class:"head"},r("span",{class:"chip"},r("span",{class:`dot ${n.type}`}),`${i.type[n.type]} #${n.id}`),r("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),r("div",{class:"t",style:"font-weight:700;font-size:15px;margin-bottom:4px",text:n.title}),r("div",{class:"meta",text:`Round ${n.round} · ${n.reporter_name} · ${Q(n.created_at)}`}),n.breakpoint?r("div",{class:"meta bp-line"},r("span",{class:"chip",text:n.breakpoint}),` ${n.context?.viewport_w??"?"}px wide${n.context?.preview?` · ${n.context.preview} preview`:""}`):null,n.tw_task_url?r("div",{class:"meta"},r("a",{href:n.tw_task_url,target:"_blank",rel:"noopener",text:`Teamwork task #${n.tw_task_id} ↗`}),n.status==="resolved"?" · completed":" · status syncs from Teamwork"):n.tw_note?r("div",{class:"notice",text:n.tw_note}):null,D,X,n.description?this.renderMentionText("desc",n.description):null,n.screenshot_url?(()=>{let b=!1,S,_=r("button",{type:"button",class:"shot-toggle","aria-expanded":"false",onclick:()=>{b=!b,O.classList.toggle("is-expanded",b),_.setAttribute("aria-expanded",b?"true":"false"),S.textContent=b?"Hide screenshot":"View screenshot"}},r("span",{class:"shot-toggle-lead"},ge(),S=r("span",{class:"shot-toggle-label",text:"View screenshot"})),be()),W=r("div",{class:"shot-body"},r("div",{class:"shot-inner"},r("a",{href:n.screenshot_url,target:"_blank",rel:"noopener",title:"Open full screenshot"},r("img",{src:n.screenshot_url,alt:"Screenshot from when this was filed"})),r("div",{class:"shot-actions"},r("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{try{let L=await fetch(n.screenshot_url,{credentials:"same-origin",cache:"no-store"}),C=await this.annotate(await L.blob());if(!C)return;let G=await this.api.replaceScreenshot(n.id,C);this.upsert(G),this.toast(`Annotations saved on #${n.id}`),this.openPopover(e,{x:parseFloat(k.style.left)-8,y:parseFloat(k.style.top)-8})}catch(L){this.toast(L.message,!0)}}})))),O=r("div",{class:"shot shot--collapsible"},_,W);return O})():null,n.video_url?this.videoBlock(n):null,this.guest?r("div",{class:"meta guest-status"},"Status: ",r("strong",{text:i.status[n.status]??n.status})):null,this.guest?null:r("div",{class:"row"},r("label",{class:"field"},r("span",{text:"Status"}),p),r("label",{class:"field"},r("span",{text:"Priority"}),d)),this.guest?null:r("label",{class:"field"},r("span",{text:n.overdue?"Due date · overdue":"Due date"}),w),this.guest?null:n.assignee_locked?r("div",{class:"field"},r("span",{text:this.assigneeLabel()}),r("div",{text:n.assignee_name||"Unassigned"}),r("div",{class:"meta",text:"In Teamwork now: change the assignee there."})):r("label",{class:"field"},r("span",{text:this.assigneeLabel()}),u),f,h?h.el:null,x,r("div",{class:"actions"},this.guest?null:r("a",{class:"btn link",href:`${this.cfg.adminUrl}&item=${n.id}`,target:"_blank",rel:"noopener",text:"Admin"}),n.can_delete?r("button",{class:"btn danger",type:"button",text:"Delete",onclick:()=>void this.deleteItem(n.id)}):null,r("button",{class:"btn primary",type:"button",text:"Reply",onclick:async()=>{if(!m.value.trim())return;let b=h?h.value():"";if(h&&!b){this.toast("Please add your name",!0),h.input()?.focus();return}try{await this.api.addComment(n.id,m.value,h?b:void 0),h?.remember(),this.openPopover(e,{x:parseFloat(k.style.left)-8,y:parseFloat(k.style.top)-8})}catch(S){this.toast(S.message,!0)}}})));this.showCard(k,a,l),this.cardCleanup=v}renderMentionText(e,t){let n=r("div",{class:e}),o=(this.cfg.assignees?.people??[]).map((l)=>l.name.trim().replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).filter((l)=>l.length>0).sort((l,c)=>c.length-l.length),s=o.length?new RegExp(`(@(?:${o.join("|")}|[A-Za-z0-9_.-]+))`,"g"):/(@[A-Za-z0-9_.-]+)/g,a=t.split(s);for(let l of a)if(l.startsWith("@"))n.append(r("span",{class:"mention",text:l}));else if(l)n.append(document.createTextNode(l));return n}setupMentions(e,t){let n=this.cfg.assignees?.people??[];if(!n.length)return()=>{};let i=null,o=0,s=-1,a=[],l=()=>{i?.remove(),i=null,s=-1,a=[]},c=(m)=>{let x=e.value,v=x.slice(0,s),h=x.slice(e.selectionEnd),f=`@${m.name} `;e.value=`${v}${f}${h}`;let T=v.length+f.length;e.setSelectionRange(T,T),e.focus(),l()},p=()=>{if(!i)i=r("div",{class:"mention-menu",role:"listbox"}),t.append(i);if(i.innerHTML="",!a.length){l();return}a.forEach((m,x)=>{let v=r("div",{class:`mention-item${x===o?" is-active":""}`,role:"option",text:m.name,onclick:(h)=>{h.preventDefault(),h.stopPropagation(),c(m)}});i?.append(v)})},u=()=>{let m=typeof e.selectionStart==="number"&&e.selectionStart>0?e.selectionStart:e.value.length,x=e.value.slice(0,m),v=x.lastIndexOf("@");if(v===-1||v>0&&!/\s/.test(x[v-1])){l();return}let h=x.slice(v+1).toLowerCase();if(h.includes(`
`)){l();return}if(s=v,a=n.filter((f)=>f.name.toLowerCase().includes(h)).slice(0,5),o=0,a.length)p();else l()},d=(m)=>{if(!i)return;if(m.key==="ArrowDown")m.preventDefault(),o=(o+1)%a.length,p();else if(m.key==="ArrowUp")m.preventDefault(),o=(o-1+a.length)%a.length,p();else if(m.key==="Enter"||m.key==="Tab"){if(a[o])m.preventDefault(),c(a[o])}else if(m.key==="Escape")m.preventDefault(),m.stopPropagation(),l()};e.addEventListener("input",u),e.addEventListener("keydown",d);let w=(m)=>{if(i&&!i.contains(m.target)&&m.target!==e)l()};return document.addEventListener("click",w),()=>{l(),e.removeEventListener("input",u),e.removeEventListener("keydown",d),document.removeEventListener("click",w)}}reanchor(e){this.enterPinMode({hint:`Click the element #${e} belongs to`,done:async(t,n,i)=>{try{let o=this.safeAnchor(t,n,i);if(!o)return;let s=await this.api.updateItem(e,{anchor:o});this.upsert(s);let a=this.states.get(e);if(a)a.el=t;this.refresh(),this.toast(`Pinned #${e} again`)}catch(o){this.toast(o.message,!0)}}})}async deleteItem(e){if(!window.confirm(`Delete feedback #${e}? This can’t be undone.`))return;try{await this.api.deleteItem(e),this.closeCard(),this.remove(e),this.refresh(),this.toast(`Deleted #${e}`)}catch(t){this.toast(t.message,!0)}}async openDeepLink(e){let t=this.states.get(e);if(t?.el&&t.placement==="pinned")t.el.scrollIntoView({block:"center",behavior:"auto"}),await new Promise((i)=>requestAnimationFrame(()=>i(null))),this.positionPins(),t.pin?.classList.add("pulse");let n=t?.item;if(n?.breakpoint&&n.breakpoint!==N())this.showBanner(`#${e} was logged at ${n.breakpoint} (${n.context?.viewport_w??"?"}px wide). You're viewing at ${N()} (${window.innerWidth}px). Resize to reproduce.`);await this.openPopover(e)}unresolvedCount(){let e=0;for(let t of this.states.values())if(t.item.status!=="resolved")e++;return e}videoBlock(e){let t=Le(e.video_url,e.video_duration??0),n=e.video_events??[];return r("details",{class:"rec-block",open:!0},r("summary",{text:`Screen recording · ${R((e.video_duration??0)*1000)}`}),t,n.length?r("ol",{class:"rec-timeline"},...n.map((i)=>r("li",{class:i.kind},r("button",{type:"button",class:"btn link",text:R(i.t),title:"Play from here",onclick:()=>{t.currentTime=Math.max(0,i.t/1000-1),t.play()}}),r("span",{text:i.kind==="error"?"JS error ":"clicked "}),r("code",{text:i.label})))):null)}canRecordHere(){return!!this.cfg.video?.enabled&&!this.inPreview&&we()}async startRecording(e){if(this.recorder)return;this.exitPinMode(),this.recDone=e;let t=new ee(this.api,{maxSeconds:this.cfg.video?.maxSeconds??180,isOverlay:(n)=>this.inOverlay(n),onTick:(n)=>{if(this.recClock)this.recClock.textContent=`${R(n)} / ${R((this.cfg.video?.maxSeconds??180)*1000)}`},onStop:(n)=>this.onRecordingStopped(n)});this.recorder=t,this.renderToolbar();try{await t.start()}catch(n){if(this.recorder!==t)return;let i=n.name;if(i==="NotAllowedError"||i==="AbortError")this.toast("Recording cancelled");else this.toast(`Couldn’t start recording: ${n.message}`,!0);this.finishRecording(null);return}this.stopTrail=ye(this.root.querySelector(".layer"))}onRecordingStopped(e){if(e.durationMs<1000||!e.blob.size){e.discard(),this.toast("Recording was too short, so it was discarded",!0),this.finishRecording(null);return}this.finishRecording(e)}finishRecording(e){this.stopTrail?.(),this.stopTrail=null,this.recorder=null,this.recClock=null;let t=this.recDone;this.recDone=null,this.renderToolbar(),t?.(e)}recordingToolbar(){let e=this.recorder;return this.recClock=r("span",{class:"rec-clock",text:"Starting…"}),r("div",{class:"toolbar recording",role:"toolbar","aria-label":"Screen recording"},r("span",{class:"rec-dot","aria-hidden":"true"}),this.recClock,r("button",{type:"button",class:"rec-stop",text:"■ Stop",title:"Stop and go back to your feedback",onclick:()=>e.stop()}),r("button",{type:"button",text:"Discard",onclick:()=>{if(!window.confirm("Throw this recording away?"))return;e.discard(),this.finishRecording(null),this.toast("Recording discarded")}}))}renderToolbar(){if(!this.mode)return;let e=this.unresolvedCount(),t=this.recorder?this.recordingToolbar():r("div",{class:"toolbar",role:"toolbar","aria-label":this.cfg.brand?.name??"Feedback"},r("button",{type:"button",class:"grip",title:"Drag to move · arrow keys snap to a corner","aria-label":"Move toolbar: drag, or use arrow keys to snap to a corner",text:"⠿",onpointerdown:(i)=>this.startDrag(i),onkeydown:(i)=>this.onGripKey(i)}),this.cfg.brand?.logo?r("span",{class:"brand",title:`${this.cfg.brand.name} · drag to move`,onpointerdown:(i)=>this.startDrag(i)},r("img",{src:this.cfg.brand.logo,alt:this.cfg.brand.name})):r("span",{class:"brand",title:"Drag to move",text:this.cfg.brand?.label??"Feedback",onpointerdown:(i)=>this.startDrag(i)}),r("button",{type:"button",class:this.pinMode?"icon-btn on":"icon-btn","data-tip":"Add feedback to an element","aria-label":"Add feedback to an element",onclick:()=>this.pinMode?this.exitPinMode():this.enterPinMode({hint:"Click any element to add feedback",done:(i,o,s)=>this.openTypeMenu(i,o,s)})},A("add")),r("button",{type:"button",class:"icon-btn","data-tip":"Add a page note","aria-label":"Add a note for the whole page",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},A("note")),this.inPreview?null:r("span",{class:"devices",role:"group","aria-label":"Preview at a device size"},...V.map((i)=>i.id==="desktop"?r("button",{type:"button",class:"icon-btn","aria-pressed":"true","data-tip":"Desktop: the page as you see it now","aria-label":"Desktop view (current)",onclick:()=>this.closePreview()},A(i.id)):r("button",{type:"button",class:"icon-btn","aria-pressed":"false","data-tip":`Preview as ${i.label} (${i.w}px)`,"aria-label":`Preview as ${i.label}, ${i.w} pixels wide`,onclick:()=>this.openPreview(i.id)},A(i.id)))),r("button",{type:"button",class:this.sidebar?"on":"",onclick:()=>this.sidebar?this.closeSidebar():this.openSidebar()},r("span",{class:"label",text:"List"}),e?r("span",{class:"count",text:String(e)}):null),r("button",{type:"button","data-tip":"Exit Feedback mode (Alt+Shift+F)","aria-label":"Exit Feedback mode",text:"×",onclick:()=>void this.setMode(!1)})),n=!!this.toolbar;if(t.hidden=!!this.previewEl,this.toolbar)this.toolbar.replaceWith(t);else this.root.append(t);if(this.toolbar=t,this.positionToolbar(!1),!n)this.positionChrome()}updateToolbarCount(){this.renderToolbar()}openPreview(e,t=!1){if(e==="desktop"){this.closePreview();return}let n=V.find((f)=>f.id===e)??V[0],i=t?n.h:n.w,o=t?n.w:n.h,s=`${n.label} ${i}×${o}`;this.closeCard(),this.exitPinMode();let a=this.previewEl?.querySelector("iframe"),l=new URL(a?.contentWindow?.location.href??window.location.href);l.searchParams.delete("fbcol_item"),l.searchParams.set("fbcol_preview","1"),this.previewEl?.remove();let c=r("iframe",{name:F,title:`${s} preview`,"data-device":s,src:l.toString()});c.style.width=`${i}px`,c.style.height=`${o}px`;let p=r("div",{class:"preview-device"},c),u=r("div",{class:"preview-stage"},p),d=r("div",{class:"preview-blocked",hidden:!0}),w=V.map((f)=>r("button",{type:"button",class:"icon-btn","aria-pressed":String(f.id===n.id),title:f.id==="desktop"?"Desktop: back to the page itself":`${f.label} (${f.w}px)`,"aria-label":f.id==="desktop"?"Desktop: close the preview":`${f.label}, ${f.w} pixels wide`,onclick:()=>f.id==="desktop"?this.closePreview():this.openPreview(f.id,f.id===n.id?t:!1)},A(f.id),r("span",{class:"icon-label",text:f.label}))),m=()=>{window.open(l.toString(),F,`width=${i},height=${o},resizable=yes,scrollbars=yes`)},x=r("div",{class:"preview-bar",role:"toolbar","aria-label":"Device preview"},r("strong",{text:"Device preview"}),r("div",{class:"preview-devices"},...w),r("button",{type:"button",title:"Rotate",text:"⟲ Rotate",onclick:()=>this.openPreview(n.id,!t)}),r("span",{class:"preview-label",text:s}),r("span",{class:"annotator-spacer"}),r("button",{type:"button",text:"Open in a window",onclick:m}),r("button",{type:"button",class:"preview-close",text:"Done",onclick:()=>this.closePreview()})),v=r("div",{class:"preview",role:"dialog","aria-label":`Device preview: ${s}`},x,u,d);if(this.previewEl=v,this.root.append(v),requestAnimationFrame(()=>{let f=u.getBoundingClientRect(),T=Math.min(1,(f.width-32)/i,(f.height-32)/o);p.style.width=`${Math.round(i*T)}px`,p.style.height=`${Math.round(o*T)}px`,c.style.transform=`scale(${T})`}),c.addEventListener("load",()=>{let f=!1;try{f=!!c.contentDocument&&c.contentDocument.location.href!=="about:blank"}catch{f=!1}if(!f)d.hidden=!1,d.replaceChildren(r("p",{text:"This site can’t be shown in a frame here."}),r("button",{type:"button",class:"btn primary",text:`Open ${s} in a window`,onclick:m}))}),this.pinsLayer.hidden=!0,this.toolbar)this.toolbar.hidden=!0;this.closeSidebar()}closePreview(){if(!this.previewEl)return;if(this.previewEl.remove(),this.previewEl=null,this.pinsLayer.hidden=!1,this.toolbar)this.toolbar.hidden=!1;this.loaded=!1,this.loadItems()}topOffset(){let e=document.getElementById("wpadminbar");if(!e)return 0;let t=e.getBoundingClientRect();return t.height>0?Math.max(0,Math.round(t.bottom)):0}toolbarTarget(e){let t=this.toolbar,n=t?.offsetWidth??0,i=t?.offsetHeight??0,o=this.topOffset(),s=e.endsWith("l")?I:window.innerWidth-n-I;if(e.endsWith("r")&&this.sidebar&&window.innerWidth>=Ce+n+I*2)s-=Ce;let a=e.startsWith("t")?o+I:window.innerHeight-i-I;return{x:Math.max(0,s),y:Math.max(o,a)}}nearestCorner(e,t){let n=this.topOffset(),i=t<n+(window.innerHeight-n)/2?"t":"b",o=e<window.innerWidth/2?"l":"r";return`${i}${o}`}positionToolbar(e=!1){let t=this.toolbar;if(!t||this.dragging)return;let{x:n,y:i}=this.toolbarTarget(this.corner);t.classList.toggle("snapping",e),t.style.left=`${n}px`,t.style.top=`${i}px`,t.dataset.corner=this.corner}positionChrome(){this.root.style.setProperty("--top-offset",`${this.topOffset()}px`);let e=this.toolbar?.offsetHeight??0,t=this.toolbar&&this.corner.startsWith("b")?e+I*2:24;this.root.style.setProperty("--toast-bottom",`${t}px`),this.positionToolbar(!1)}savePrefs(e){if(this.cfg.prefs={...this.cfg.prefs??{},...e},this.guest)return;this.api.savePrefs(e).catch(()=>{})}setCorner(e){this.corner=e;try{if(!this.inPreview)window.localStorage.setItem(Se,e)}catch{}if(!this.inPreview)this.savePrefs({corner:e});this.positionToolbar(!0),this.positionChrome()}startDrag(e){let t=this.toolbar;if(!t||e.button!==0)return;e.preventDefault(),e.stopPropagation();let n=t.getBoundingClientRect(),i=e.clientX-n.left,o=e.clientY-n.top;this.dragging=!0,t.classList.remove("snapping"),t.classList.add("dragging"),this.ghost?.remove(),this.ghost=r("div",{class:"snap-ghost"}),Object.assign(this.ghost.style,{width:`${n.width}px`,height:`${n.height}px`}),this.root.append(this.ghost);let s=(l)=>{let c=this.topOffset(),p=Math.min(Math.max(l.clientX-i,0),window.innerWidth-n.width),u=Math.min(Math.max(l.clientY-o,c),window.innerHeight-n.height);t.style.left=`${p}px`,t.style.top=`${u}px`;let d=this.nearestCorner(p+n.width/2,u+n.height/2),w=this.toolbarTarget(d);if(this.ghost)Object.assign(this.ghost.style,{left:`${w.x}px`,top:`${w.y}px`});t.dataset.target=d},a=(l)=>{window.removeEventListener("pointermove",s,!0),window.removeEventListener("pointerup",a,!0),window.removeEventListener("pointercancel",a,!0);let c=t.getBoundingClientRect();this.dragging=!1,t.classList.remove("dragging"),this.ghost?.remove(),this.ghost=null,delete t.dataset.target,this.setCorner(l.type==="pointercancel"?this.corner:this.nearestCorner(c.left+c.width/2,c.top+c.height/2))};window.addEventListener("pointermove",s,!0),window.addEventListener("pointerup",a,!0),window.addEventListener("pointercancel",a,!0)}onGripKey(e){let n={ArrowLeft:(i)=>`${i[0]}l`,ArrowRight:(i)=>`${i[0]}r`,ArrowUp:(i)=>`t${i[1]}`,ArrowDown:(i)=>`b${i[1]}`}[e.key];if(!n)return;e.preventDefault(),this.setCorner(n(this.corner)),this.toolbar?.querySelector(".grip")?.focus()}openSidebar(){this.sidebar?.remove();let e=this.filters,t=this.cfg.labels,n=r("button",{type:"button",class:`scope-tab ${e.scope==="page"?"active":""}`,"data-scope":"page","aria-selected":String(e.scope==="page"),role:"tab",onclick:()=>this.setScope("page")},r("span",{class:"tab-label",text:"This page"}),r("span",{class:"tab-badge",text:String(this.states.size)})),i=r("button",{type:"button",class:`scope-tab ${e.scope==="all"?"active":""}`,"data-scope":"all","aria-selected":String(e.scope==="all"),role:"tab",onclick:()=>this.setScope("all")},r("span",{class:"tab-label",text:"All pages"}),r("span",{class:"tab-badge",text:this.allItems?String(this.allItems.length):""})),o=r("div",{class:"scope-switch",role:"tablist","aria-label":"Feedback scope"},n,i),s=M("type",[["","All types"],...B.map((d)=>[d,t.type[d]])],e.type,{onchange:()=>{e.type=s.value,this.renderSidebarList()}}),a=M("status",[["unresolved","Unresolved"],["","Any status"],...Object.keys(t.status).map((d)=>[d,t.status[d]])],e.status,{onchange:()=>{e.status=a.value,this.drawPins(),this.renderSidebarList()}}),l=[["0","All rounds"]];for(let d=this.cfg.round;d>=1;d--)l.push([String(d),d===this.cfg.round?`Round ${d} (current)`:`Round ${d}`]);let c=M("round",l,String(e.round),{onchange:()=>{e.round=Number(c.value),this.renderSidebarList()}}),p=M("bp",[["","All breakpoints"],["mobile","Mobile"],["tablet","Tablet"],["desktop","Desktop"]],e.bp,{onchange:()=>{e.bp=p.value,this.renderSidebarList()}}),u=r("input",{type:"checkbox",onchange:()=>{e.mine=u.checked,this.renderSidebarList()}});if(u.checked=e.mine,this.sidebar=r("div",{class:"sidebar",role:"complementary","aria-label":"Feedback list"},r("header",{},r("h2",{},this.cfg.brand?.label??"Feedback",r("button",{class:"x",type:"button","aria-label":"Close list",text:"×",onclick:()=>this.closeSidebar()})),o,r("div",{class:"filters"},s,a,c,p,this.guest?null:r("label",{},u,"Assigned to me"))),r("div",{class:"list"})),this.root.append(this.sidebar),this.renderToolbar(),this.renderSidebarList(),!this.allItems)this.api.listItems().then(({items:d})=>{if(this.allItems=d,this.updateScopeBadges(),this.filters.scope==="all"||d.length>this.states.size)this.renderSidebarList()}).catch(()=>{})}setScope(e){if(this.filters.scope===e)return;if(this.filters.scope=e,this.sidebar)this.sidebar.querySelectorAll(".scope-tab").forEach((n)=>{let i=n.dataset.scope===e;n.classList.toggle("active",i),n.setAttribute("aria-selected",String(i))});this.renderSidebarList()}updateScopeBadges(){if(!this.sidebar)return;let e=this.sidebar.querySelector('.scope-tab[data-scope="page"] .tab-badge'),t=this.sidebar.querySelector('.scope-tab[data-scope="all"] .tab-badge');if(e)e.textContent=String(this.states.size);if(t)t.textContent=this.allItems?String(this.allItems.length):""}closeSidebar(){this.sidebar?.remove(),this.sidebar=null,this.renderToolbar()}matchesStatus(e){let t=this.filters.status;if(t==="unresolved")return e.status!=="resolved";return!t||e.status===t}matches(e){let t=this.filters;if(t.type&&e.type!==t.type)return!1;if(t.round&&e.round!==t.round)return!1;if(t.bp&&e.breakpoint!==t.bp)return!1;if(!this.matchesStatus(e))return!1;if(t.mine&&(!this.cfg.assignees.me||e.assignee_id!==this.cfg.assignees.me))return!1;return!0}async renderSidebarList(){let e=this.sidebar?.querySelector(".list");if(!e)return;let t=(a,l,c)=>r("button",{class:"entry",type:"button",onclick:l},r("span",{class:`num ${a.status==="resolved"?"resolved":a.type}`,text:`#${a.id}`}),r("span",{},r("span",{class:"t",text:a.title}),r("span",{class:"s",text:`Round ${a.round} · ${this.cfg.labels.status[a.status]}${a.assignee_name?` · ${a.assignee_name}`:""}${a.breakpoint?` · ${a.breakpoint}`:""}`})),c??null);if(this.filters.scope==="all"){if(!this.allItems){e.replaceChildren(r("div",{class:"empty",text:"Loading…"}));try{this.allItems=(await this.api.listItems()).items,this.updateScopeBadges()}catch(c){e.replaceChildren(r("div",{class:"empty",text:c.message}));return}}let a=new Map;for(let c of this.allItems.filter((p)=>this.matches(p))){let p=a.get(c.page_path)??[];p.push(c),a.set(c.page_path,p)}let l=[];for(let[c,p]of a){l.push(r("h3",{text:c===this.pagePath?`${c} (this page)`:c}));for(let u of p)l.push(t(u,()=>{if(u.page_path===this.pagePath)this.focusItem(u.id);else{let d=new URL(u.page_url,window.location.origin);d.searchParams.set("fbcol_item",String(u.id)),window.location.href=d.toString()}}))}e.replaceChildren(...l.length?l:[r("div",{class:"empty",text:"Nothing matches these filters."})]);return}let n={pinned:{title:"On this page",nodes:[]},note:{title:"Page notes",nodes:[]},hidden:{title:"At other breakpoints",nodes:[]},orphan:{title:"Orphaned — element not found",nodes:[]}};for(let a of[...this.states.values()].sort((l,c)=>l.item.id-c.item.id)){if(!this.matches(a.item))continue;let l=a.placement==="orphan"&&!this.guest?r("span",{class:"btn link reanchor",role:"button",text:"Pin again",onclick:(c)=>{c.stopPropagation(),this.reanchor(a.item.id)}}):null;n[a.placement].nodes.push(t(a.item,()=>this.focusItem(a.item.id),l))}let i=[];for(let a of["pinned","note","hidden","orphan"]){let l=n[a];if(!l.nodes.length)continue;let c=a==="hidden"?`${l.nodes.length} at other breakpoints`:l.title;i.push(r("h3",{text:c}),...l.nodes)}let o=this.allItems?this.allItems.length:0,s=o-this.states.size;if(i.length>0&&s>0)i.push(r("div",{class:"list-footer-prompt"},r("button",{type:"button",class:"btn-view-all",onclick:()=>this.setScope("all")},`View ${s} more on other pages (${o} total) →`)));if(!i.length){let a=[r("div",{class:"empty",text:"No feedback on this page yet. Right-click anything to add some."})];if(o>0)a.push(r("div",{class:"list-empty-action"},r("button",{type:"button",class:"btn-view-all",onclick:()=>this.setScope("all")},`View all ${o} items on other pages →`)));e.replaceChildren(...a);return}e.replaceChildren(...i)}focusItem(e){let t=this.states.get(e);if(!t)return;if(t.placement==="pinned"&&t.el){if(!this.matchesStatus(t.item)){this.filters.status="";let n=this.sidebar?.querySelector('select[name="status"]');if(n)n.value="";this.drawPins(),this.renderSidebarList()}t.el.scrollIntoView({block:"center",behavior:"smooth"}),window.setTimeout(()=>{this.positionPins(),t.pin?.classList.remove("pulse"),t.pin?.offsetWidth,t.pin?.classList.add("pulse"),this.openPopover(e)},450)}else this.openPopover(e,{x:window.innerWidth-720,y:80})}toast(e,t=!1){let n=r("div",{class:`toast${t?" err":""}`,role:"status",text:e});this.root.append(n),window.setTimeout(()=>n.remove(),t?5000:2200)}showBanner(e){this.bannerEl?.remove(),this.bannerEl=r("div",{class:"banner",role:"status"},r("span",{text:e}),r("button",{type:"button",text:"Dismiss",onclick:()=>{this.bannerEl?.remove(),this.bannerEl=null}})),this.root.append(this.bannerEl)}}fe();pe();function ut(){if(window.self===window.top)return!0;if(window.name!==F)return!1;try{return window.parent.location.origin===window.location.origin}catch{return!1}}function $e(){let e=window.fbcolConfig;if(!e||!ut())return;new te(e).init()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",$e,{once:!0});else $e();})();
