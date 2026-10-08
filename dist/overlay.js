(()=>{var e=`:host {
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

/* Screen recording */
.toolbar .rec-start {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
}
.toolbar .rec-start-dot {
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff5a5f;
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
`;var on="fbc-root";var Wn=["ember","react-","__next","radix-","headlessui-","mui-","yui_","ext-gen"],Fn=/[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i,qn=/^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;function Gn(n){let o=/[a-z]/i.test(n),p=/[0-9]/.test(n);if(!o||!p)return!1;if(n.length>=6&&/^[0-9a-f]+$/i.test(n))return!0;return n.length>=8&&/^[0-9a-z]+$/i.test(n)&&Un(n)>=2}function Un(n){let o=0;for(let p=1;p<n.length;p++){let i=/[0-9]/.test(n.charAt(p-1)),r=/[0-9]/.test(n.charAt(p));if(i!==r)o++}return o}function Xn(n){if(n.trim()===""||/\s/.test(n))return!1;if(/^[0-9]/.test(n))return!1;if(/[0-9]{5,}/.test(n))return!1;if(Fn.test(n))return!1;if(qn.test(n))return!1;let o=n.toLowerCase();if(Wn.some((p)=>o.startsWith(p)))return!1;return!n.split(/[-_:.]/).some(Gn)}function Nn(n){let o="",p=n.length,i=n.charCodeAt(0);for(let r=0;r<p;r++){let x=n.charCodeAt(r),b=n.charAt(r);if(x===0)o+="�";else if(x>=1&&x<=31||x===127||r===0&&x>=48&&x<=57||r===1&&x>=48&&x<=57&&i===45)o+=`\\${x.toString(16)} `;else if(r===0&&p===1&&x===45)o+=`\\${b}`;else if(x>=128||x===45||x===95||x>=48&&x<=57||x>=65&&x<=90||x>=97&&x<=122)o+=b;else o+=`\\${b}`}return o}function P(n,o){let p=o?o.CSS:void 0,i=globalThis.CSS,r=p?.escape??i?.escape;return r?r(n):Nn(n)}function Mn(n){return n.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}function X(n){return n.localName.toLowerCase()}function Vn(n){return n.ownerDocument.defaultView}function Yn(n){if(!n)return{x:0,y:0};let o=Number.isFinite(n.scrollX)?n.scrollX:0,p=Number.isFinite(n.scrollY)?n.scrollY:0;return{x:o,y:p}}function nn(n){if(!Number.isFinite(n))return 0.5;return Math.min(1,Math.max(0,n))}function R(n){let o=n;while(o){if(o.id==="fbc-root")return!0;if(o.parentElement)o=o.parentElement;else{let p=o.getRootNode();o=p instanceof ShadowRoot?p.host:null}}return!1}function T(n){if(n===null)return null;let o=n.replace(/\s+/g," ").trim();if(o==="")return null;let p=Array.from(o);return p.length>120?p.slice(0,120).join(""):o}var Cn=/^fl-node-(?!content$)[a-z0-9]+$/i,Bn=/^[a-z0-9]+$/i;function pn(n){let o=1,p=n.previousElementSibling;while(p){if(p.localName===n.localName&&p.namespaceURI===n.namespaceURI)o++;p=p.previousElementSibling}return o}function an(n,o){if(!n.id||!Xn(n.id))return null;let p=`#${P(n.id,o.defaultView)}`,i=o.querySelectorAll(p);return i.length===1&&i[0]===n?p:null}function On(n,o){if(n===o.documentElement)return"html";let p=n.localName,i=n.getAttribute("data-id");if(i!==null&&n.classList.contains("elementor-element")&&Bn.test(i))return`${p}[data-id="${Mn(i)}"]`;let r=Array.from(n.classList).find((x)=>Cn.test(x));if(r!==void 0)return`${p}.${P(r,o.defaultView)}`;return`${p}:nth-of-type(${pn(n)})`}function _n(n,o,p){let i=p.querySelectorAll(n);return i.length===1&&i[0]===o}function Dn(n,o){let p=[],i=n;while(i){let r=an(i,o);if(r!==null)return p.unshift(r),p.join(" > ");p.unshift(On(i,o));let x=p.join(" > ");if(_n(x,n,o))return x;i=i.parentElement}return p.join(" > ")}function cn(n,o){let p=[],i=n;while(i){let r=X(i),x=i.parentElement,b=i===o.documentElement||x===o.documentElement&&(r==="head"||r==="body");p.unshift(b?r:`${r}[${pn(i)}]`),i=x}return`/${p.join("/")}`}var An=/^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i,Pn=/^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;function Rn(n,o){if(!An.test(n))return null;let p=n.slice(1).split("/"),i=null;for(let r of p){let x=Pn.exec(r);if(!x)return null;let b=(x[1]??"").toLowerCase(),g=x[2]===void 0?1:Number(x[2]),f=i?Array.from(i.children):o.documentElement?[o.documentElement]:[],t=0,u=null;for(let s of f){if(X(s)!==b)continue;if(t++,t===g){u=s;break}}if(!u)return null;i=u}return i}function rn(n,o,p){if(!Number.isFinite(o)||!Number.isFinite(p))throw RangeError(`createAnchor: click coordinates must be finite (got ${o}, ${p})`);if(!n.isConnected)throw Error("createAnchor: element is not connected to a document");if(R(n))throw Error("createAnchor: refusing to anchor an element inside #fbc-root");let i=n.ownerDocument;if(n.getRootNode()!==i)throw Error("createAnchor: element is inside a shadow root; anchor its shadow host instead");let r=n.getBoundingClientRect(),x=Yn(i.defaultView),b=r.width>0?nn((o-r.left)/r.width):0.5,g=r.height>0?nn((p-r.top)/r.height):0.5;return{id:an(n,i)!==null?n.id:null,selector:Dn(n,i),xpath:cn(n,i),text:T(n.textContent),tag:X(n),offsetX:b,offsetY:g,docX:o+x.x,docY:p+x.y}}function _(n,o){return n!==null&&X(n)===o&&!R(n)}function Tn(n){return n instanceof DOMException||n instanceof Error&&n.name==="SyntaxError"}function Sn(n,o){if(typeof n.id!=="string"||n.id==="")return null;let p=o.getElementById(n.id);if(!p)return null;return o.querySelectorAll(`#${P(n.id,o.defaultView)}`).length===1?p:null}function mn(n,o){if(typeof n.selector!=="string"||n.selector.trim()==="")return null;let p;try{p=o.querySelectorAll(n.selector)}catch(i){if(Tn(i))return null;throw i}return p.length===1?p[0]??null:null}function In(n,o){if(typeof n.xpath!=="string")return null;return Rn(n.xpath,o)}function En(n,o){if(typeof n.text!=="string"||n.text==="")return null;let p=null;for(let i of Array.from(o.getElementsByTagName("*"))){if(X(i)!==n.tag||R(i))continue;if(T(i.textContent)!==n.text)continue;if(p)return null;p=i}return p}function xn(n,o=document){if(typeof n.tag!=="string"||n.tag==="")return{el:null,strategy:"none"};let p=n.tag.toLowerCase(),i=Sn(n,o);if(_(i,p))return{el:i,strategy:"id"};let r,x=()=>{if(r===void 0)r=En({...n,tag:p},o);return _(r,p)?r:null},b=(u)=>{if(n.text===null||T(u.textContent)===n.text)return null;let s=x();return s&&s!==u?s:null},g=mn(n,o);if(_(g,p)){let u=b(g);return u?{el:u,strategy:"text"}:{el:g,strategy:"selector"}}let f=In(n,o);if(_(f,p)){let u=b(f);return u?{el:u,strategy:"text"}:{el:f,strategy:"xpath"}}let t=x();if(t)return{el:t,strategy:"text"};return{el:null,strategy:"none"}}function bn(n){if(!n.isConnected)return!1;let o=Vn(n);if(!o)return!1;let p=o.getComputedStyle(n);if(p.visibility==="hidden"||p.visibility==="collapse")return!1;let i=n;while(i){if(o.getComputedStyle(i).display==="none")return!1;i=i.parentElement}let r=n.getBoundingClientRect();return!(r.width===0&&r.height===0)}class N extends Error{status;data;constructor(n,o,p){super(n);this.status=o;this.data=p}}class S{cfg;constructor(n){this.cfg=n}url(n,o){let p=this.cfg.restUrl.replace(/\/$/,"")+n;if(o){let i=new URLSearchParams(o).toString();if(i)p+=(p.includes("?")?"&":"?")+i}return p}async request(n,o,p,i){let r=typeof FormData<"u"&&p instanceof FormData,x=typeof Blob<"u"&&p instanceof Blob,b=await fetch(this.url(o,i),{method:n,credentials:"same-origin",headers:{"X-WP-Nonce":this.cfg.nonce,...p!==void 0&&!r?{"Content-Type":x?"application/octet-stream":"application/json"}:{}},body:p===void 0?void 0:r||x?p:JSON.stringify(p)}),g=await b.json().catch(()=>null);if(!b.ok){let f=g&&typeof g==="object"&&"message"in g?String(g.message):b.statusText,t=g&&typeof g==="object"&&"data"in g?g.data:void 0;throw new N(f,b.status,t)}return g}listItems(n){return this.request("GET","/items",void 0,n?{page_path:n}:void 0)}getItem(n){return this.request("GET",`/items/${n}`)}createItem(n,o){if(!o)return this.request("POST","/items",n);let p=new FormData;return p.append("data",JSON.stringify(n)),p.append("screenshot",o,"screenshot.jpg"),this.request("POST","/items",p)}savePrefs(n){return this.request("POST","/me/prefs",n)}replaceScreenshot(n,o){let p=new FormData;return p.append("screenshot",o,"screenshot.jpg"),this.request("POST",`/items/${n}/screenshot`,p)}startRecording(){return this.request("POST","/recordings")}appendRecording(n,o,p){return this.request("POST",`/recordings/${n}`,p,{offset:String(o)})}discardRecording(n){return this.request("DELETE",`/recordings/${n}`)}updateItem(n,o){return this.request("PATCH",`/items/${n}`,o)}deleteItem(n){return this.request("DELETE",`/items/${n}`)}addComment(n,o){return this.request("POST",`/items/${n}/comments`,{body:o})}}function M(n=window.innerWidth){if(n<768)return"mobile";if(n<=1024)return"tablet";return"desktop"}function hn(n){let o=[[/Edg\/([\d.]+)/,"Edge"],[/OPR\/([\d.]+)/,"Opera"],[/Firefox\/([\d.]+)/,"Firefox"],[/CriOS\/([\d.]+)/,"Chrome iOS"],[/Chrome\/([\d.]+)/,"Chrome"],[/Version\/([\d.]+).*Safari/,"Safari"]];for(let[p,i]of o){let r=n.match(p);if(r)return`${i} ${r[1].split(".")[0]}`}return"Unknown"}function en(n){let o=n.match(/(iPhone|iPad).*OS ([\d_]+)/);if(o)return`iOS ${o[2].replace(/_/g,".")}`;if(o=n.match(/Android ([\d.]+)/),o)return`Android ${o[1]}`;if(o=n.match(/Windows NT ([\d.]+)/),o)return o[1]==="10.0"?"Windows 10/11":`Windows NT ${o[1]}`;if(o=n.match(/Mac OS X ([\d_]+)/),o)return`macOS ${o[1].replace(/_/g,".")}`;if(/CrOS/.test(n))return"ChromeOS";if(/Linux/.test(n))return"Linux";return"Unknown"}var D=null;function gn(){let n=navigator.userAgentData;if(!n)return;n.getHighEntropyValues(["platform","platformVersion"]).then(({platform:o,platformVersion:p})=>{if(!o||!p)return;let[i,r]=p.split(".");if(o==="macOS")D=`macOS ${i}.${r??"0"}`;else if(o==="Windows")D=Number(i)>=13?"Windows 11":"Windows 10";else if(o==="Android"||o==="Chrome OS"||o==="Linux")D=`${o} ${p}`.trim()}).catch(()=>{})}function fn(n){let o=navigator.userAgent;return{viewport_w:window.innerWidth,viewport_h:window.innerHeight,dpr:Math.round((window.devicePixelRatio||1)*100)/100,breakpoint:M(),browser:hn(o),os:D??en(o),user_agent:o,post_id:n.page.postId,post_type:n.page.postType,theme:n.page.theme,js_errors:(window.__fbcErrors??[]).slice(-20),preview:no()}}function no(){try{return window.self!==window.top?window.frameElement?.getAttribute("data-device")??"":""}catch{return""}}function tn(n){let o=window.location.pathname,p=n.replace(/\/$/,"");if(p&&o.startsWith(p))o=o.slice(p.length);return o="/"+o.replace(/^\/+/,""),o==="/"?"/":o.replace(/\/?$/,"/")}function sn(){let n=new URLSearchParams(window.location.search);return n.delete("fbc_item"),n.toString()}function un(){if(window.__fbcErrors)return;let n=window.__fbcErrors=[],o=(p)=>{if(n.push(p.slice(0,500)),n.length>20)n.shift()};window.addEventListener("error",(p)=>{if(p.message)o(`${p.message}${p.filename?` (${p.filename}:${p.lineno})`:""}`)}),window.addEventListener("unhandledrejection",(p)=>{let i=p.reason;o(`Unhandled rejection: ${i instanceof Error?i.message:String(i)}`)})}function a(n,o={},...p){let i=document.createElement(n);for(let[r,x]of Object.entries(o)){if(x===null||x===void 0||x===!1)continue;if(r.startsWith("on")&&typeof x==="function")i.addEventListener(r.slice(2).toLowerCase(),x);else if(r==="text")i.textContent=String(x);else if(r==="value"&&"value"in i)i.value=String(x);else if(x===!0)i.setAttribute(r,"");else i.setAttribute(r,String(x))}for(let r of p){if(r===null||r===void 0||r===!1)continue;i.append(typeof r==="number"?String(r):r)}return i}function H(n,o,p,i={}){let r=a("select",{name:n,...i});for(let[x,b]of o){let g=a("option",{value:x,text:b});if(x===p)g.selected=!0;r.append(g)}return r}function m(n){let o=new Date(n).getTime();if(Number.isNaN(o))return"";let p=Math.round((Date.now()-o)/1000);if(p<60)return"just now";let i=Math.round(p/60);if(i<60)return`${i}m ago`;let r=Math.round(i/60);if(r<24)return`${r}h ago`;let x=Math.round(r/24);if(x<30)return`${x}d ago`;return new Date(n).toLocaleDateString()}var oo={phone:'<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',tablet:'<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M11 18.5h2"/>',desktop:'<rect x="2.5" y="4" width="19" height="12.5" rx="1.5"/><path d="M8.5 20.5h7M12 16.5v4"/>',highlight:'<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3"/><path d="M11 11l9 3.5-3.8 1.4-1.4 3.8z"/>'};function V(n){let o=document.createElement("span");return o.className="icon",o.setAttribute("aria-hidden","true"),o.innerHTML=`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${oo[n]??""}</svg>`,o}function kn(){let n=document.createElement("span");return n.className="shot-toggle-icon",n.setAttribute("aria-hidden","true"),n.innerHTML='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',n}function vn(){let n=document.createElement("span");return n.className="shot-toggle-chevron",n.setAttribute("aria-hidden","true"),n.innerHTML='<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',n}var dn=["video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"],po=2000,wn=4194304,io=300;function zn(){return typeof navigator<"u"&&!!navigator.mediaDevices&&typeof navigator.mediaDevices.getDisplayMedia==="function"&&typeof MediaRecorder<"u"&&dn.some((n)=>MediaRecorder.isTypeSupported(n))}function L(n){let o=Math.max(0,Math.floor(n/1000));return`${Math.floor(o/60)}:${String(o%60).padStart(2,"0")}`}function ao(n){let o=n.closest('a, button, [role="button"], input, select, textarea, label, summary')??n,p=o.tagName.toLowerCase(),i=o.id?`${p}#${o.id}`:`${p}${[...o.classList].slice(0,2).map((x)=>`.${x}`).join("")}`,r="";if(o instanceof HTMLInputElement||o instanceof HTMLTextAreaElement||o instanceof HTMLSelectElement)r=o.getAttribute("aria-label")||o.getAttribute("placeholder")||o.getAttribute("name")||"";else r=o.getAttribute("aria-label")||o.innerText||o.textContent||"";return r=r.replace(/\s+/g," ").trim().slice(0,60),r?`"${r}" (${i})`:i}class I{api;opts;streams=[];audioCtx=null;rec=null;pieces=[];events=[];token="";queued=0;confirmed=0;queue=Promise.resolve();failed=null;startedAt=0;endedAt=0;tickTimer=0;limitTimer=0;unbinds=[];mic=!1;stopping=!1;cancelled=!1;constructor(n,o){this.api=n;this.opts=o}async start(){let n=await this.api.startRecording();this.token=n.token;let o=Math.min(this.opts.maxSeconds,n.max_seconds||this.opts.maxSeconds),p=null;try{p=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!0,noiseSuppression:!0},video:!1})}catch{p=null}let i;try{i=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:{ideal:30,max:30}},audio:!0,preferCurrentTab:!0,selfBrowserSurface:"include",surfaceSwitching:"exclude",systemAudio:"exclude",monitorTypeSurfaces:"exclude"})}catch(f){throw p?.getTracks().forEach((t)=>t.stop()),this.api.discardRecording(this.token).catch(()=>{return}),f}if(this.cancelled){for(let f of[i,p])f?.getTracks().forEach((t)=>t.stop());throw new DOMException("Recording discarded","AbortError")}this.streams=[i,...p?[p]:[]],this.mic=!!p;let r=[...i.getVideoTracks()],x=[i,p].filter((f)=>!!f&&f.getAudioTracks().length>0);if(x.length){this.audioCtx=new AudioContext;let f=this.audioCtx.createMediaStreamDestination();for(let t of x)this.audioCtx.createMediaStreamSource(t).connect(f);r.push(...f.stream.getAudioTracks())}let b=dn.find((f)=>MediaRecorder.isTypeSupported(f))??"video/webm",g=new MediaRecorder(new MediaStream(r),{mimeType:b,videoBitsPerSecond:1500000,audioBitsPerSecond:96000});this.rec=g,g.ondataavailable=(f)=>{if(f.data.size)this.enqueue(f.data)},g.onstop=()=>this.finish(),i.getVideoTracks()[0]?.addEventListener("ended",()=>this.stop()),this.bindEvents(),g.start(po),this.startedAt=performance.now(),this.tickTimer=window.setInterval(()=>this.opts.onTick(this.elapsed()),250),this.limitTimer=window.setTimeout(()=>this.stop(),o*1000),this.opts.onTick(0)}get recording(){return!!this.rec&&this.rec.state!=="inactive"&&!this.stopping}elapsed(){return(this.endedAt||performance.now())-this.startedAt}stop(){if(!this.rec||this.stopping)return;this.stopping=!0,this.endedAt=performance.now(),window.clearInterval(this.tickTimer),window.clearTimeout(this.limitTimer);for(let n of this.unbinds)n();if(this.unbinds=[],this.rec.state!=="inactive")this.rec.stop();else this.finish()}async discard(){this.cancelled=!0,this.opts.onStop=()=>{return},this.stop(),await this.queue,await this.api.discardRecording(this.token).catch(()=>{return})}finish(){for(let o of this.streams)o.getTracks().forEach((p)=>p.stop());this.streams=[],this.audioCtx?.close().catch(()=>{return}),this.audioCtx=null;let n=new Blob(this.pieces,{type:"video/webm"});this.opts.onStop({blob:n,durationMs:Math.round(this.elapsed()),events:this.events.slice(),mic:this.mic,progress:()=>this.queued?Math.min(1,this.confirmed/this.queued):1,uploaded:()=>this.uploaded(n),discard:()=>this.discard()})}enqueue(n){this.pieces.push(n);let o=this.queued;this.queued+=n.size,this.queue=this.queue.then(async()=>{if(this.failed)return;try{await this.send(this.token,o,n)}catch(p){this.failed=p}})}async send(n,o,p){for(let i=0;;i++)try{let{size:r}=await this.api.appendRecording(n,o,p);this.confirmed=Math.max(this.confirmed,r);return}catch(r){if(r instanceof N&&r.status===409&&Number(r.data?.size)>=o+p.size){this.confirmed=Math.max(this.confirmed,Number(r.data?.size));return}if(!(!(r instanceof N)||r.status>=500||r.status===429)||i>=3)throw r;await new Promise((b)=>window.setTimeout(b,800*2**i))}}async uploaded(n){if(await this.queue,!this.failed)return this.token;this.api.discardRecording(this.token).catch(()=>{return});let o=await this.api.startRecording();this.token=o.token,this.failed=null,this.confirmed=0,this.queued=n.size;for(let p=0;p<n.size;p+=wn)await this.send(this.token,p,n.slice(p,p+wn));return this.token}log(n,o){if(this.events.length>=io||!this.recording)return;this.events.push({t:Math.round(this.elapsed()),kind:n,label:o.slice(0,200)})}bindEvents(){let n=(o,p,i)=>{o.addEventListener(p,i,!0),this.unbinds.push(()=>o.removeEventListener(p,i,!0))};n(document,"pointerdown",(o)=>{if(o.button!==0||this.opts.isOverlay(o)||!(o.target instanceof Element))return;this.log("click",ao(o.target))}),n(window,"error",(o)=>{if(o.message)this.log("error",`${o.message}${o.filename?` (${o.filename}:${o.lineno})`:""}`)}),n(window,"unhandledrejection",(o)=>{let p=o.reason;this.log("error",`Unhandled rejection: ${p instanceof Error?p.message:String(p)}`)}),n(window,"beforeunload",(o)=>{o.preventDefault(),o.returnValue=""})}}function ln(n){let o=document.createElement("div");o.className="rec-pointer",o.hidden=!0,n.append(o);let p=(x)=>{o.hidden=!1,o.style.transform=`translate(${x.clientX}px, ${x.clientY}px)`},i=(x)=>{p(x);let b=document.createElement("div");b.className="rec-ripple",b.style.left=`${x.clientX}px`,b.style.top=`${x.clientY}px`,n.append(b),window.setTimeout(()=>b.remove(),700)},r=()=>{o.hidden=!0};return document.addEventListener("pointermove",p,{capture:!0,passive:!0}),document.addEventListener("pointerdown",i,{capture:!0,passive:!0}),document.documentElement.addEventListener("pointerleave",r),()=>{document.removeEventListener("pointermove",p,{capture:!0}),document.removeEventListener("pointerdown",i,{capture:!0}),document.documentElement.removeEventListener("pointerleave",r),o.remove()}}var Y=["bug","tweak","change","comment"],jn="fbc:mode",yn="fbc:corner",$n="fbc:highlight",C="fbc-preview",c=[{id:"phone",label:"Mobile",w:390,h:844},{id:"tablet",label:"Tablet",w:820,h:1180},{id:"desktop",label:"Desktop",w:1440,h:900}],U=16,Jn=360,ro=["tl","tr","bl","br"];function xo(){let n=new Date;return`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`}function bo(n,o){let[p,i,r]=n.split("-").map(Number);return new Date(Date.UTC(p,i-1,r+o)).toISOString().slice(0,10)}function Zn(n,o=Date.now()){if(!n)return"";if(n.batchUntil&&o<n.batchUntil*1000)return n.suggest;if(!n.batchUntil&&n.suggest)return n.suggest;return bo(xo(),n.days)}function Qn(n,o){let p=a("video",{src:n,controls:!0,preload:"metadata",playsinline:!0,title:`Screen recording (${L(o*1000)})`});return p.addEventListener("loadedmetadata",()=>{if(p.duration!==1/0)return;let i=()=>{p.removeEventListener("durationchange",i),p.currentTime=0};p.addEventListener("durationchange",i),p.currentTime=1e9},{once:!0}),p}class E{cfg;api;host;root;pinsLayer;outline;outlineTag;toolbar=null;sidebar=null;card=null;hintEl=null;bannerEl=null;mode=!1;highlight=!0;pinMode=null;states=new Map;allItems=null;filters={scope:"page",type:"",status:"unresolved",mine:!1,round:0,bp:""};pagePath;framePending=!1;refreshTimer=0;lastWidth=window.innerWidth;mutationObserver=null;loaded=!1;corner="br";dragging=!1;ghost=null;pendingShot=null;inPreview=window.self!==window.top&&window.name===C;previewEl=null;selectedEl=null;unbinds=[];cardCleanup=null;cardGuard=null;recorder=null;recClock=null;stopTrail=null;constructor(n){this.cfg=n;this.api=new S(n),this.pagePath=n.pagePath??tn(n.homePath)}destroy(){if(this.recorder)this.recorder.discard();if(this.stopTrail?.(),this.cardCleanup)this.cardCleanup(),this.cardCleanup=null;for(let n of this.unbinds)n();if(this.unbinds=[],this.mutationObserver)this.mutationObserver.disconnect(),this.mutationObserver=null;if(this.refreshTimer)window.clearTimeout(this.refreshTimer),this.refreshTimer=0;this.host?.remove()}listen(n,o,p,i){n.addEventListener(o,p,i),this.unbinds.push(()=>n.removeEventListener(o,p,i))}init(){this.mount(),this.bindGlobalEvents(),this.bindAdminBar();let n=!1,o=null,p=null;try{n=window.localStorage.getItem(jn)==="1";let r=window.localStorage.getItem(yn);if(r&&ro.includes(r))o=r;let x=window.localStorage.getItem($n);if(x!==null)p=x!=="0"}catch{n=!1}let i=this.cfg.prefs??{};if(this.corner=i.corner??o??this.corner,this.highlight=i.highlight??p??!0,!this.inPreview){let r={};if(!i.corner&&o)r.corner=o;if(i.highlight===void 0&&p!==null)r.highlight=p;if(Object.keys(r).length)this.savePrefs(r)}if(this.inPreview){let r=document.createElement("style");r.textContent="#wpadminbar{display:none!important}html{margin-top:0!important}",document.head.append(r),this.corner="bl",this.setMode(!0);return}if(this.cfg.openItem||n)this.setMode(!0)}mount(){this.host=a("div",{id:on}),this.host.setAttribute("style","all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;");let n=this.host.attachShadow({mode:"open"});n.append(a("style",{text:e})),this.root=a("div",{class:"fbc"});let o=this.cfg.brand;if(o){let i=[["--primary",o.primary],["--on-primary",o.onPrimary],["--dark",o.dark],["--on-dark",o.onDark],["--brand-accent",o.accent],["--ink-primary",o.ink??""]];for(let[r,x]of i)if(x)this.root.style.setProperty(r,x)}let p=a("div",{class:"layer"});this.outlineTag=a("span",{class:"outline-tag"}),this.outline=a("div",{class:"outline"},this.outlineTag),this.pinsLayer=a("div"),p.append(this.outline,this.pinsLayer),this.root.append(p),n.append(this.root),document.body.append(this.host)}inOverlay(n){return n.composedPath().includes(this.host)}bindGlobalEvents(){this.listen(document,"contextmenu",(n)=>this.onContextMenu(n),!0),this.listen(document,"mousemove",(n)=>this.onMouseMove(n),{capture:!0,passive:!0});for(let n of["pointerdown","mousedown","mouseup","click"])this.listen(document,n,(o)=>this.onPinModeEvent(o),!0);this.listen(document,"mousedown",(n)=>this.onOutsideMouseDown(n),!1),this.listen(document,"keydown",(n)=>this.onKeyDown(n),!0),this.listen(window,"scroll",()=>this.schedulePosition(),{passive:!0,capture:!0}),this.listen(window,"resize",()=>{let n=window.innerWidth!==this.lastWidth;if(this.lastWidth=window.innerWidth,this.card?.classList.contains("popover")||this.card?.classList.contains("composer"))this.card.style.maxHeight=`${Math.max(160,window.innerHeight-this.topOffset()-24)}px`,this.moveCard(this.card,this.card.offsetLeft,this.card.offsetTop);if(n)this.scheduleRefresh(80);else this.schedulePosition()})}bindAdminBar(){let n=document.querySelector("#wp-admin-bar-fbc-toggle > a");if(n)this.listen(n,"click",(o)=>{o.preventDefault(),this.setMode(!this.mode)})}async setMode(n){if(!n&&this.recorder){this.toast("Stop or discard the recording first",!0);return}if(this.mode=n,!this.inPreview)try{window.localStorage.setItem(jn,n?"1":"0")}catch{}if(document.querySelector("#wp-admin-bar-fbc-toggle")?.classList.toggle("fbc-on",n),!n){this.exitPinMode(),this.closeCard(),this.closeSidebar(),this.hideOutline(),this.toolbar?.remove(),this.toolbar=null,this.bannerEl?.remove(),this.bannerEl=null,this.pinsLayer.replaceChildren();for(let o of this.states.values())o.pin=null;this.mutationObserver?.disconnect();return}if(this.renderToolbar(),this.observeMutations(),!this.loaded)await this.loadItems();else this.refresh();if(this.cfg.openItem){let o=this.cfg.openItem;this.cfg.openItem=0,this.stripDeepLinkParam(),this.openDeepLink(o)}}stripDeepLinkParam(){let n=new URL(window.location.href);if(n.searchParams.has("fbc_item"))n.searchParams.delete("fbc_item"),window.history.replaceState(window.history.state,"",n.toString())}async loadItems(){try{let{items:n}=await this.api.listItems(this.pagePath),o=new Map(this.states);this.states.clear();for(let p of n){let i=o.get(p.id);o.delete(p.id),this.states.set(p.id,{item:p,el:i?.el??null,placement:"orphan",pin:i?.pin??null})}for(let p of o.values())p.pin?.remove();this.loaded=!0,this.refresh()}catch(n){this.toast(`Could not load feedback: ${n.message}`,!0)}}upsert(n){let o=this.states.get(n.id);if(o)o.item=n;else this.states.set(n.id,{item:n,el:null,placement:"orphan",pin:null});if(this.allItems){let p=this.allItems.findIndex((i)=>i.id===n.id);if(p>=0)this.allItems[p]=n;else this.allItems.push(n)}this.updateScopeBadges()}remove(n){if(this.states.get(n)?.pin?.remove(),this.states.delete(n),this.allItems)this.allItems=this.allItems.filter((p)=>p.id!==n);this.updateScopeBadges()}refresh(){for(let n of this.states.values()){if(!n.item.anchor){n.el=null,n.placement="note";continue}let o=n.el&&n.el.isConnected?n.el:xn(n.item.anchor).el;n.el=o,n.placement=!o?"orphan":bn(o)?"pinned":"hidden"}if(this.drawPins(),this.updateToolbarCount(),this.sidebar)this.renderSidebarList()}drawPins(){if(!this.mode)return;for(let n of this.states.values()){if(!(n.placement==="pinned"&&this.matchesStatus(n.item))){n.pin?.remove(),n.pin=null;continue}if(!n.pin){let r=a("button",{class:"pin",type:"button","aria-label":`Feedback #${n.item.id}: ${n.item.title}`,onclick:(x)=>{x.stopPropagation(),this.openPopover(n.item.id)}});n.pin=r,this.pinsLayer.append(r)}let p=n.item.status==="resolved",i=n.pin.classList.contains("pulse");n.pin.className=`pin ${n.item.type}${p?" resolved":""}${i?" pulse":""}`,n.pin.textContent=p?"✓":String(n.item.id),n.pin.title=`#${n.item.id} ${n.item.title}`}this.positionPins()}schedulePosition(){if(this.framePending||!this.mode)return;this.framePending=!0,requestAnimationFrame(()=>{if(this.framePending=!1,this.positionPins(),this.positionChrome(),this.selectedEl)this.hideOutline()})}scheduleRefresh(n=250){window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.mode&&this.refresh(),n)}positionPins(){for(let n of this.states.values()){if(!n.pin||!n.el||!n.item.anchor)continue;let o=n.el.getBoundingClientRect(),p=o.left+n.item.anchor.offsetX*o.width,i=o.top+n.item.anchor.offsetY*o.height;n.pin.style.transform=`translate(${Math.round(p)}px, ${Math.round(i)}px)`}}observeMutations(){if(!this.mutationObserver)this.mutationObserver=new MutationObserver((n)=>{if(n.every((o)=>o.target===this.host||this.host.contains(o.target)))return;this.schedulePosition(),this.scheduleRefresh(300)});this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden","open"]})}onContextMenu(n){if(!this.mode||this.recorder||n.altKey||this.inOverlay(n))return;let o=this.eventTarget(n);if(!o)return;n.preventDefault(),n.stopPropagation(),this.exitPinMode(),this.openTypeMenu(o,n.clientX,n.clientY)}onPinModeEvent(n){if(!this.pinMode||this.inOverlay(n)||n.button!==0)return;if(n.preventDefault(),n.stopImmediatePropagation(),n.type!=="click")return;let o=this.eventTarget(n),p=this.pinMode;if(this.exitPinMode(),o)p.done(o,n.clientX,n.clientY)}onOutsideMouseDown(n){if(this.card&&!this.inOverlay(n)&&!this.cardGuard)this.closeCard()}onMouseMove(n){if(!this.mode||this.recorder||this.card&&!this.pinMode||!this.highlight&&!this.pinMode||this.inOverlay(n)){if(!this.pinMode)this.hideOutline();return}let o=this.eventTarget(n);if(!o||o===document.documentElement||o===document.body){this.hideOutline();return}this.drawOutline(o)}drawOutline(n){let o=n.getBoundingClientRect();Object.assign(this.outline.style,{left:`${o.left}px`,top:`${o.top}px`,width:`${o.width}px`,height:`${o.height}px`});let p=n.id?`#${n.id}`:"";this.outlineTag.textContent=`${n.tagName.toLowerCase()}${p}`,this.outline.classList.add("on")}onKeyDown(n){if(this.annotating)return;let o=n.composedPath()[0],p=o instanceof HTMLElement&&(o.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(o.tagName));if(n.altKey&&n.shiftKey&&n.code==="KeyF"&&!p){n.preventDefault(),this.setMode(!this.mode);return}if(n.key==="Escape"&&this.previewEl){n.preventDefault(),this.closePreview();return}if(n.key==="Escape"&&this.mode){if(this.pinMode)this.exitPinMode(),n.preventDefault();else if(this.card)this.closeCard(),n.preventDefault();else if(this.sidebar)this.closeSidebar(),n.preventDefault()}}eventTarget(n){let o=n.target;if(o instanceof Element)return o;if(o instanceof Node)return o.parentElement;return null}setHighlight(n){this.highlight=n;try{window.localStorage.setItem($n,n?"1":"0")}catch{}if(!this.inPreview)this.savePrefs({highlight:n});if(!n)this.hideOutline();this.renderToolbar()}hideOutline(){if(this.selectedEl?.isConnected){this.drawOutline(this.selectedEl),this.outline.classList.add("locked");return}this.outline.classList.remove("on","locked")}enterPinMode(n){this.closeCard(),this.pinMode=n,this.hintEl?.remove(),this.hintEl=a("div",{class:"crosshair-hint",text:`${n.hint} · Esc to cancel`}),this.root.append(this.hintEl),document.documentElement.style.cursor="crosshair",this.renderToolbar()}exitPinMode(){if(!this.pinMode)return;this.pinMode=null,this.hintEl?.remove(),this.hintEl=null,document.documentElement.style.cursor="",this.hideOutline(),this.renderToolbar()}scripts=new Map;annotating=!1;async annotate(n){if(this.annotating)return null;this.annotating=!0;try{if(!window.FBCAnnotator)await this.loadBundle("annotator.js");let o=window.FBCAnnotator;if(!o)throw Error("The annotator could not load.");let p=this.cfg.brand?.primary??"#6953c4";return await o.open({image:n,mount:this.root,colors:["#e5383b",p,"#ffb703","#ffffff","#111111"]})}catch(o){return this.toast(o.message,!0),null}finally{this.annotating=!1}}loadBundle(n){let o=this.scripts.get(n);if(o)return o;let p=this.cfg.assetsUrl??"",i=new Promise((r,x)=>{let b=document.createElement("script");b.src=`${p}${n}${this.cfg.version?`?ver=${encodeURIComponent(this.cfg.version)}`:""}`,b.async=!0,b.onload=()=>r(),b.onerror=()=>{this.scripts.delete(n),x(Error(`Could not load ${n}`))},document.head.append(b)});return this.scripts.set(n,i),i}async startCapture(n){if(!this.cfg.shots||!this.cfg.assetsUrl)return null;try{if(!window.FBCCapture)await this.loadBundle("capture.js");let o=window.FBCCapture;if(!o)return null;return await o.captureViewport({marker:n,color:this.cfg.brand?.primary??"#6953c4"})}catch{return null}}assigneeOptions(){return[["0","Unassigned"],...this.cfg.assignees.people.map((n)=>[String(n.id),n.name])]}assigneeLabel(){return this.cfg.assignees.source==="teamwork"?"Assignee (Teamwork)":"Assignee"}safeAnchor(n,o,p){try{return rn(n,o,p)}catch{return this.toast("Can't pin to that element. Try its container, or add a page note.",!0),null}}closeCard(n=!1){if(this.cardGuard){if(!this.cardGuard())return;this.cardGuard=null}if(this.cardCleanup)this.cardCleanup(),this.cardCleanup=null;if(this.card?.remove(),this.card=null,!n)this.selectedEl=null,this.hideOutline()}showCard(n,o,p){if(this.closeCard(!0),this.hideOutline(),this.card=n,n.style.left="0px",n.style.top="0px",n.style.visibility="hidden",n.style.maxHeight=`${Math.max(160,window.innerHeight-this.topOffset()-24)}px`,this.root.append(n),this.moveCard(n,o+8,p+8),n.style.visibility="",typeof ResizeObserver<"u"){let r=new ResizeObserver(()=>{if(!n.isConnected)return r.disconnect();this.moveCard(n,n.offsetLeft,n.offsetTop)});r.observe(n)}n.addEventListener("load",()=>this.moveCard(n,n.offsetLeft,n.offsetTop),!0);let i=n.querySelector(":scope > .head");if(i)i.classList.add("drag"),i.title="Drag to move",i.addEventListener("pointerdown",(r)=>this.startCardDrag(n,r))}moveCard(n,o,p){let i=this.topOffset()+12,r=Math.max(12,window.innerWidth-n.offsetWidth-12),x=Math.max(i,window.innerHeight-n.offsetHeight-12);n.style.left=`${Math.round(Math.max(12,Math.min(o,r)))}px`,n.style.top=`${Math.round(Math.max(i,Math.min(p,x)))}px`}startCardDrag(n,o){if(o.button!==0||o.target.closest("button, a, input, select, textarea"))return;o.preventDefault();let p=o.currentTarget,i=o.clientX-n.offsetLeft,r=o.clientY-n.offsetTop;try{p.setPointerCapture(o.pointerId)}catch{}n.classList.add("dragging");let x=(g)=>this.moveCard(n,g.clientX-i,g.clientY-r),b=()=>{n.classList.remove("dragging"),p.removeEventListener("pointermove",x),p.removeEventListener("pointerup",b),p.removeEventListener("pointercancel",b)};p.addEventListener("pointermove",x),p.addEventListener("pointerup",b),p.addEventListener("pointercancel",b)}openTypeMenu(n,o,p){this.pendingShot=this.startCapture({x:o,y:p}),this.selectedEl=n;let i=this.cfg.labels.type,r=(g)=>this.openComposer(g,n,o,p),x=Y.map((g,f)=>a("button",{type:"button",onclick:()=>r(g)},a("span",{class:`dot ${g}`}),i[g],a("kbd",{text:String(f+1)}))),b=a("div",{class:"card menu",role:"menu",onkeydown:(g)=>{let f=g.key,t=Number(f);if(t>=1&&t<=Y.length)g.preventDefault(),r(Y[t-1])}},a("div",{class:"menu-title",text:"Add feedback"}),...x,a("hr"),a("button",{type:"button",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},"Note for the whole page"));this.showCard(b,o,p),x[0].focus()}openComposer(n,o,p,i,r){this.selectedEl=o;let x=null;if(o){if(x=this.safeAnchor(o,p,i),!x)return}let b=this.cfg.labels,g=H("type",Y.map((z)=>[z,b.type[z]]),n),f=a("input",{type:"text",name:"title",maxlength:255,required:!0,placeholder:"What needs attention?",autocomplete:"off"}),t=a("textarea",{name:"description",placeholder:"Details, steps to reproduce, what you expected… (optional)"}),u=H("priority",Object.keys(b.priority).map((z)=>[z,b.priority[z]]),"medium"),s=H("assignee_id",this.assigneeOptions(),"0"),j=a("input",{type:"checkbox",name:"due_on"});j.checked=!!this.cfg.due?.onByDefault;let k=a("input",{type:"date",name:"due_date",value:Zn(this.cfg.due)});k.hidden=!j.checked,j.addEventListener("change",()=>{if(k.hidden=!j.checked,j.checked&&!k.value)k.value=Zn(this.cfg.due)});let y=a("div",{class:"error",role:"alert"}),d=a("button",{class:"btn primary",type:"submit",text:"Add"}),$=r?Promise.resolve(null):this.pendingShot??this.startCapture(o?{x:p,y:i}:null);this.pendingShot=null;let v=!!this.cfg.shots&&!r,l=null,K="",J=a("div",{class:"shot","aria-live":"polite"}),w=()=>{if(K)URL.revokeObjectURL(K);K=l?URL.createObjectURL(l):"",J.replaceChildren(...l?[a("img",{src:K,alt:"Screenshot that will be attached"}),a("div",{class:"shot-actions"},a("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{if(!l)return;let z=await this.annotate(l);if(z)l=z,$=Promise.resolve(z),w()}}),this.cfg.shots?a("button",{type:"button",class:"btn link",text:"Remove screenshot",onclick:()=>{l=null,$=Promise.resolve(null),w()}}):null)]:[]),J.hidden=!l};if(v)J.textContent="Capturing screenshot…",$.then((z)=>{if(l=z,w(),!z)J.hidden=!0});else J.hidden=!0;let Z="",W=null,B=null,F=0;if(r){Z=URL.createObjectURL(r.blob),W=a("div",{class:"meta rec-status","aria-live":"polite"});let z=()=>{let G=r.progress();if(W)W.textContent=G>=1?`Uploaded${r.mic?"":" · no microphone"}`:`Uploading… ${Math.round(G*100)}%`;if(G>=1)window.clearInterval(F)};z(),F=window.setInterval(z,400),B=a("div",{class:"rec-preview"},Qn(Z,r.durationMs/1000),r.events.length?a("div",{class:"meta",text:`${r.events.length} click${r.events.length===1?"":"s"} and errors logged with timestamps`}):null,W)}let q=()=>{if(window.clearInterval(F),Z)URL.revokeObjectURL(Z)},O=a("form",{class:"card composer",novalidate:!0,onsubmit:(z)=>{z.preventDefault(),A()}},a("div",{class:"head"},a("span",{class:"chip"},a("span",{class:`dot ${n}`}),r?`Screen recording · ${L(r.durationMs)}`:o?`<${o.tagName.toLowerCase()}>`:"Whole page"),a("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),B,a("label",{class:"field"},a("span",{text:"Title"}),f),y,a("label",{class:"field"},a("span",{text:"Description"}),t),a("div",{class:"row"},a("label",{class:"field"},a("span",{text:"Type"}),g),a("label",{class:"field"},a("span",{text:"Priority"}),u)),a("label",{class:"field"},a("span",{text:this.assigneeLabel()}),s),this.cfg.assignees.fallback?a("div",{class:"meta hint",text:"Showing WordPress users until Teamwork is connected (Feedback → Settings). Then this lists your Teamwork project members."}):null,a("div",{class:"field due-field"},a("label",{class:"check"},j," Set date?"),k),J,a("div",{class:"actions"},a("button",{class:"btn link",type:"button",text:"Cancel",onclick:()=>this.closeCard()}),d)),A=async()=>{if(y.textContent="",!f.value.trim()){y.textContent="Add a short title.",f.focus();return}d.disabled=!0;try{let z=v?await Promise.race([$,new Promise((Kn)=>window.setTimeout(()=>Kn(null),1e4))]):null,G;if(r)d.textContent="Uploading…",G={token:await r.uploaded(),duration:Math.round(r.durationMs/1000),events:r.events};let Q=await this.api.createItem({type:g.value,title:f.value.trim(),description:t.value,priority:u.value,assignee_id:Number(s.value),assignee_source:this.cfg.assignees.source,due_date:j.checked&&k.value?k.value:null,page_path:this.pagePath,page_query:sn(),page_title:document.title,anchor:x,context:fn(this.cfg),recording:G},l??z);if(K)URL.revokeObjectURL(K);if(q(),this.cardGuard=null,Q.due_next)this.cfg.due=Q.due_next;this.closeCard(),this.upsert(Q);let h=this.states.get(Q.id);if(h&&o)h.el=o;if(this.refresh(),Q.video_error)this.toast(`Added #${Q.id}, but the recording wasn’t saved: ${Q.video_error}`,!0);else if(Q.screenshot_error)this.toast(`Added #${Q.id}, but the screenshot wasn’t saved: ${Q.screenshot_error}`,!0);else this.toast(`Added #${Q.id}`)}catch(z){y.textContent=z.message,d.disabled=!1,d.textContent="Add"}};if(this.showCard(O,p,i),r)this.cardGuard=()=>{if(!window.confirm("Discard this screen recording?"))return!1;return q(),r.discard(),!0};f.focus()}async openPopover(n,o){let p;try{p=await this.api.getItem(n)}catch(w){this.toast(w.message,!0);return}this.upsert(p);let i=this.cfg.labels,r=this.states.get(n),x=r?.pin?.getBoundingClientRect(),b=o?.x??(x?x.right:window.innerWidth/2-170),g=o?.y??(x?x.top:100),f=async(w)=>{try{let Z=await this.api.updateItem(n,w);this.upsert(Z),this.refresh(),this.openPopover(n,{x:parseFloat(J.style.left)-8,y:parseFloat(J.style.top)-8})}catch(Z){this.toast(Z.message,!0)}},t=H("status",Object.keys(i.status).map((w)=>[w,i.status[w]]),p.status,{onchange:()=>void f({status:t.value})}),u=H("assignee_id",this.assigneeOptions(),String(p.assignee_id),{onchange:()=>void f({assignee_id:Number(u.value),assignee_source:this.cfg.assignees.source})}),s=H("priority",Object.keys(i.priority).map((w)=>[w,i.priority[w]]),p.priority,{onchange:()=>void f({priority:s.value})}),j=a("input",{type:"date",name:"due_date",value:p.due_date??"",class:p.overdue?"overdue":"",onchange:()=>void f({due_date:j.value||null})}),k=a("textarea",{placeholder:"Reply… (type @ to mention)",rows:2}),y=a("label",{class:"field mention-container"},k),d=this.setupMentions(k,y),$=a("ul",{class:"thread"},...(p.comments??[]).map((w)=>a("li",{class:w.kind},a("span",{class:"who",text:w.user_name}),a("span",{class:"when",text:m(w.created_at)}),this.renderMentionText("body",w.body)))),v=M(),l=p.breakpoint&&p.breakpoint!==v?a("div",{class:"notice",text:`Logged at ${p.breakpoint} (${p.context?.viewport_w??"?"}px). You are on ${v} (${window.innerWidth}px).`}):null,K=r?.placement==="orphan"?a("div",{class:"notice",text:"The element this was pinned to can’t be found on the page anymore. Use “Pin again” in the list to place it."}):null,J=a("div",{class:"card popover",role:"dialog","aria-label":`Feedback #${p.id}`},a("div",{class:"head"},a("span",{class:"chip"},a("span",{class:`dot ${p.type}`}),`${i.type[p.type]} #${p.id}`),a("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),a("div",{class:"t",style:"font-weight:700;font-size:15px;margin-bottom:4px",text:p.title}),a("div",{class:"meta",text:`Round ${p.round} · ${p.reporter_name} · ${m(p.created_at)}`}),p.breakpoint?a("div",{class:"meta bp-line"},a("span",{class:"chip",text:p.breakpoint}),` ${p.context?.viewport_w??"?"}px wide${p.context?.preview?` · ${p.context.preview} preview`:""}`):null,p.tw_task_url?a("div",{class:"meta"},a("a",{href:p.tw_task_url,target:"_blank",rel:"noopener",text:`Teamwork task #${p.tw_task_id} ↗`}),p.status==="resolved"?" · completed":" · status syncs from Teamwork"):p.tw_note?a("div",{class:"notice",text:p.tw_note}):null,l,K,p.description?this.renderMentionText("desc",p.description):null,p.screenshot_url?(()=>{let w=!1,Z,W=a("button",{type:"button",class:"shot-toggle","aria-expanded":"false",onclick:()=>{w=!w,F.classList.toggle("is-expanded",w),W.setAttribute("aria-expanded",w?"true":"false"),Z.textContent=w?"Hide screenshot":"View screenshot"}},a("span",{class:"shot-toggle-lead"},kn(),Z=a("span",{class:"shot-toggle-label",text:"View screenshot"})),vn()),B=a("div",{class:"shot-body"},a("div",{class:"shot-inner"},a("a",{href:p.screenshot_url,target:"_blank",rel:"noopener",title:"Open full screenshot"},a("img",{src:p.screenshot_url,alt:"Screenshot from when this was filed"})),a("div",{class:"shot-actions"},a("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{try{let q=await fetch(p.screenshot_url,{credentials:"same-origin",cache:"no-store"}),O=await this.annotate(await q.blob());if(!O)return;let A=await this.api.replaceScreenshot(p.id,O);this.upsert(A),this.toast(`Annotations saved on #${p.id}`),this.openPopover(n,{x:parseFloat(J.style.left)-8,y:parseFloat(J.style.top)-8})}catch(q){this.toast(q.message,!0)}}})))),F=a("div",{class:"shot shot--collapsible"},W,B);return F})():null,p.video_url?this.videoBlock(p):null,a("div",{class:"row"},a("label",{class:"field"},a("span",{text:"Status"}),t),a("label",{class:"field"},a("span",{text:"Priority"}),s)),a("label",{class:"field"},a("span",{text:p.overdue?"Due date · overdue":"Due date"}),j),p.assignee_locked?a("div",{class:"field"},a("span",{text:this.assigneeLabel()}),a("div",{text:p.assignee_name||"Unassigned"}),a("div",{class:"meta",text:"In Teamwork now: change the assignee there."})):a("label",{class:"field"},a("span",{text:this.assigneeLabel()}),u),$,y,a("div",{class:"actions"},a("a",{class:"btn link",href:`${this.cfg.adminUrl}&item=${p.id}`,target:"_blank",rel:"noopener",text:"Admin"}),p.can_delete?a("button",{class:"btn danger",type:"button",text:"Delete",onclick:()=>void this.deleteItem(p.id)}):null,a("button",{class:"btn primary",type:"button",text:"Reply",onclick:async()=>{if(!k.value.trim())return;try{await this.api.addComment(p.id,k.value),this.openPopover(n,{x:parseFloat(J.style.left)-8,y:parseFloat(J.style.top)-8})}catch(w){this.toast(w.message,!0)}}})));this.showCard(J,b,g),this.cardCleanup=d}renderMentionText(n,o){let p=a("div",{class:n}),r=(this.cfg.assignees?.people??[]).map((g)=>g.name.trim().replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).filter((g)=>g.length>0).sort((g,f)=>f.length-g.length),x=r.length?new RegExp(`(@(?:${r.join("|")}|[A-Za-z0-9_.-]+))`,"g"):/(@[A-Za-z0-9_.-]+)/g,b=o.split(x);for(let g of b)if(g.startsWith("@"))p.append(a("span",{class:"mention",text:g}));else if(g)p.append(document.createTextNode(g));return p}setupMentions(n,o){let p=this.cfg.assignees?.people??[];if(!p.length)return()=>{};let i=null,r=0,x=-1,b=[],g=()=>{i?.remove(),i=null,x=-1,b=[]},f=(k)=>{let y=n.value,d=y.slice(0,x),$=y.slice(n.selectionEnd),v=`@${k.name} `;n.value=`${d}${v}${$}`;let l=d.length+v.length;n.setSelectionRange(l,l),n.focus(),g()},t=()=>{if(!i)i=a("div",{class:"mention-menu",role:"listbox"}),o.append(i);if(i.innerHTML="",!b.length){g();return}b.forEach((k,y)=>{let d=a("div",{class:`mention-item${y===r?" is-active":""}`,role:"option",text:k.name,onclick:($)=>{$.preventDefault(),$.stopPropagation(),f(k)}});i?.append(d)})},u=()=>{let k=typeof n.selectionStart==="number"&&n.selectionStart>0?n.selectionStart:n.value.length,y=n.value.slice(0,k),d=y.lastIndexOf("@");if(d===-1||d>0&&!/\s/.test(y[d-1])){g();return}let $=y.slice(d+1).toLowerCase();if($.includes(`
`)){g();return}if(x=d,b=p.filter((v)=>v.name.toLowerCase().includes($)).slice(0,5),r=0,b.length)t();else g()},s=(k)=>{if(!i)return;if(k.key==="ArrowDown")k.preventDefault(),r=(r+1)%b.length,t();else if(k.key==="ArrowUp")k.preventDefault(),r=(r-1+b.length)%b.length,t();else if(k.key==="Enter"||k.key==="Tab"){if(b[r])k.preventDefault(),f(b[r])}else if(k.key==="Escape")k.preventDefault(),k.stopPropagation(),g()};n.addEventListener("input",u),n.addEventListener("keydown",s);let j=(k)=>{if(i&&!i.contains(k.target)&&k.target!==n)g()};return document.addEventListener("click",j),()=>{g(),n.removeEventListener("input",u),n.removeEventListener("keydown",s),document.removeEventListener("click",j)}}reanchor(n){this.enterPinMode({hint:`Click the element #${n} belongs to`,done:async(o,p,i)=>{try{let r=this.safeAnchor(o,p,i);if(!r)return;let x=await this.api.updateItem(n,{anchor:r});this.upsert(x);let b=this.states.get(n);if(b)b.el=o;this.refresh(),this.toast(`Pinned #${n} again`)}catch(r){this.toast(r.message,!0)}}})}async deleteItem(n){if(!window.confirm(`Delete feedback #${n}? This can’t be undone.`))return;try{await this.api.deleteItem(n),this.closeCard(),this.remove(n),this.refresh(),this.toast(`Deleted #${n}`)}catch(o){this.toast(o.message,!0)}}async openDeepLink(n){let o=this.states.get(n);if(o?.el&&o.placement==="pinned")o.el.scrollIntoView({block:"center",behavior:"auto"}),await new Promise((i)=>requestAnimationFrame(()=>i(null))),this.positionPins(),o.pin?.classList.add("pulse");let p=o?.item;if(p?.breakpoint&&p.breakpoint!==M())this.showBanner(`#${n} was logged at ${p.breakpoint} (${p.context?.viewport_w??"?"}px wide). You're viewing at ${M()} (${window.innerWidth}px). Resize to reproduce.`);await this.openPopover(n)}unresolvedCount(){let n=0;for(let o of this.states.values())if(o.item.status!=="resolved")n++;return n}videoBlock(n){let o=Qn(n.video_url,n.video_duration??0),p=n.video_events??[];return a("details",{class:"rec-block",open:!0},a("summary",{text:`Screen recording · ${L((n.video_duration??0)*1000)}`}),o,p.length?a("ol",{class:"rec-timeline"},...p.map((i)=>a("li",{class:i.kind},a("button",{type:"button",class:"btn link",text:L(i.t),title:"Play from here",onclick:()=>{o.currentTime=Math.max(0,i.t/1000-1),o.play()}}),a("span",{text:i.kind==="error"?"JS error ":"clicked "}),a("code",{text:i.label})))):null)}canRecordHere(){return!!this.cfg.video?.enabled&&!this.inPreview&&zn()}async startRecording(){if(this.recorder)return;if(this.exitPinMode(),this.closeCard(),this.card)return;this.closeSidebar(),this.hideOutline();let n=new I(this.api,{maxSeconds:this.cfg.video?.maxSeconds??180,isOverlay:(o)=>this.inOverlay(o),onTick:(o)=>{if(this.recClock)this.recClock.textContent=`${L(o)} / ${L((this.cfg.video?.maxSeconds??180)*1000)}`},onStop:(o)=>this.onRecordingStopped(o)});this.recorder=n,this.renderToolbar();try{await n.start()}catch(o){if(this.recorder!==n)return;this.recorder=null,this.renderToolbar();let p=o.name;if(p==="NotAllowedError"||p==="AbortError")this.toast("Recording cancelled");else this.toast(`Couldn’t start recording: ${o.message}`,!0);return}this.stopTrail=ln(this.root.querySelector(".layer"))}onRecordingStopped(n){if(this.stopTrail?.(),this.stopTrail=null,this.recorder=null,this.recClock=null,this.renderToolbar(),n.durationMs<1000||!n.blob.size){n.discard(),this.toast("Recording was too short, so it was discarded",!0);return}this.openComposer("bug",null,window.innerWidth/2-170,120,n)}recordingToolbar(){let n=this.recorder;return this.recClock=a("span",{class:"rec-clock",text:"Starting…"}),a("div",{class:"toolbar recording",role:"toolbar","aria-label":"Screen recording"},a("span",{class:"rec-dot","aria-hidden":"true"}),this.recClock,a("button",{type:"button",class:"rec-stop",text:"■ Stop",title:"Stop and describe the problem",onclick:()=>n.stop()}),a("button",{type:"button",text:"Discard",onclick:()=>{if(!window.confirm("Throw this recording away?"))return;this.stopTrail?.(),this.stopTrail=null,this.recorder=null,this.recClock=null,n.discard(),this.renderToolbar(),this.toast("Recording discarded")}}))}renderToolbar(){if(!this.mode)return;let n=this.unresolvedCount(),o=this.recorder?this.recordingToolbar():a("div",{class:"toolbar",role:"toolbar","aria-label":this.cfg.brand?.name??"Feedback"},a("button",{type:"button",class:"grip",title:"Drag to move · arrow keys snap to a corner","aria-label":"Move toolbar: drag, or use arrow keys to snap to a corner",text:"⠿",onpointerdown:(i)=>this.startDrag(i),onkeydown:(i)=>this.onGripKey(i)}),this.cfg.brand?.logo?a("span",{class:"brand",title:`${this.cfg.brand.name} · drag to move`,onpointerdown:(i)=>this.startDrag(i)},a("img",{src:this.cfg.brand.logo,alt:this.cfg.brand.name})):a("span",{class:"brand",title:"Drag to move",text:this.cfg.brand?.label??"Feedback",onpointerdown:(i)=>this.startDrag(i)}),a("button",{type:"button",class:this.pinMode?"on":"",title:"Click an element to pin feedback (or right-click anywhere)",text:"+ Add",onclick:()=>this.pinMode?this.exitPinMode():this.enterPinMode({hint:"Click any element to add feedback",done:(i,r,x)=>this.openTypeMenu(i,r,x)})}),a("button",{type:"button",text:"Page note",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)}),this.canRecordHere()?a("button",{type:"button",class:"icon-btn rec-start",title:`Record this tab with your voice (up to ${L((this.cfg.video?.maxSeconds??180)*1000)})`,"aria-label":"Record this tab with your voice",onclick:()=>void this.startRecording()},a("span",{class:"rec-start-dot","aria-hidden":"true"})):null,a("button",{type:"button",class:"icon-btn toggle","aria-pressed":String(this.highlight),title:this.highlight?"Hover highlight is on: click to turn off":"Hover highlight is off: click to turn on","aria-label":"Highlight elements on hover",onclick:()=>this.setHighlight(!this.highlight)},V("highlight")),this.inPreview?null:a("span",{class:"devices",role:"group","aria-label":"Preview at a device size"},...c.map((i)=>i.id==="desktop"?a("button",{type:"button",class:"icon-btn","aria-pressed":"true",title:"Desktop: the page as you see it now","aria-label":"Desktop view (current)",onclick:()=>this.closePreview()},V(i.id)):a("button",{type:"button",class:"icon-btn","aria-pressed":"false",title:`Preview as ${i.label} (${i.w}px)`,"aria-label":`Preview as ${i.label}, ${i.w} pixels wide`,onclick:()=>this.openPreview(i.id)},V(i.id)))),a("button",{type:"button",class:this.sidebar?"on":"",onclick:()=>this.sidebar?this.closeSidebar():this.openSidebar()},a("span",{class:"label",text:"List"}),n?a("span",{class:"count",text:String(n)}):null),a("button",{type:"button",title:"Exit Feedback mode (Alt+Shift+F)","aria-label":"Exit Feedback mode",text:"×",onclick:()=>void this.setMode(!1)})),p=!!this.toolbar;if(o.hidden=!!this.previewEl,this.toolbar)this.toolbar.replaceWith(o);else this.root.append(o);if(this.toolbar=o,this.positionToolbar(!1),!p)this.positionChrome()}updateToolbarCount(){this.renderToolbar()}openPreview(n,o=!1){if(n==="desktop"){this.closePreview();return}let p=c.find((v)=>v.id===n)??c[0],i=o?p.h:p.w,r=o?p.w:p.h,x=`${p.label} ${i}×${r}`;this.closeCard(),this.exitPinMode();let b=this.previewEl?.querySelector("iframe"),g=new URL(b?.contentWindow?.location.href??window.location.href);g.searchParams.delete("fbc_item"),g.searchParams.set("fbc_preview","1"),this.previewEl?.remove();let f=a("iframe",{name:C,title:`${x} preview`,"data-device":x,src:g.toString()});f.style.width=`${i}px`,f.style.height=`${r}px`;let t=a("div",{class:"preview-device"},f),u=a("div",{class:"preview-stage"},t),s=a("div",{class:"preview-blocked",hidden:!0}),j=c.map((v)=>a("button",{type:"button",class:"icon-btn","aria-pressed":String(v.id===p.id),title:v.id==="desktop"?"Desktop: back to the page itself":`${v.label} (${v.w}px)`,"aria-label":v.id==="desktop"?"Desktop: close the preview":`${v.label}, ${v.w} pixels wide`,onclick:()=>v.id==="desktop"?this.closePreview():this.openPreview(v.id,v.id===p.id?o:!1)},V(v.id),a("span",{class:"icon-label",text:v.label}))),k=()=>{window.open(g.toString(),C,`width=${i},height=${r},resizable=yes,scrollbars=yes`)},y=a("div",{class:"preview-bar",role:"toolbar","aria-label":"Device preview"},a("strong",{text:"Device preview"}),a("div",{class:"preview-devices"},...j),a("button",{type:"button",title:"Rotate",text:"⟲ Rotate",onclick:()=>this.openPreview(p.id,!o)}),a("span",{class:"preview-label",text:x}),a("span",{class:"annotator-spacer"}),a("button",{type:"button",text:"Open in a window",onclick:k}),a("button",{type:"button",class:"preview-close",text:"Done",onclick:()=>this.closePreview()})),d=a("div",{class:"preview",role:"dialog","aria-label":`Device preview: ${x}`},y,u,s);if(this.previewEl=d,this.root.append(d),requestAnimationFrame(()=>{let v=u.getBoundingClientRect(),l=Math.min(1,(v.width-32)/i,(v.height-32)/r);t.style.width=`${Math.round(i*l)}px`,t.style.height=`${Math.round(r*l)}px`,f.style.transform=`scale(${l})`}),f.addEventListener("load",()=>{let v=!1;try{v=!!f.contentDocument&&f.contentDocument.location.href!=="about:blank"}catch{v=!1}if(!v)s.hidden=!1,s.replaceChildren(a("p",{text:"This site can’t be shown in a frame here."}),a("button",{type:"button",class:"btn primary",text:`Open ${x} in a window`,onclick:k}))}),this.pinsLayer.hidden=!0,this.toolbar)this.toolbar.hidden=!0;this.closeSidebar()}closePreview(){if(!this.previewEl)return;if(this.previewEl.remove(),this.previewEl=null,this.pinsLayer.hidden=!1,this.toolbar)this.toolbar.hidden=!1;this.loaded=!1,this.loadItems()}topOffset(){let n=document.getElementById("wpadminbar");if(!n)return 0;let o=n.getBoundingClientRect();return o.height>0?Math.max(0,Math.round(o.bottom)):0}toolbarTarget(n){let o=this.toolbar,p=o?.offsetWidth??0,i=o?.offsetHeight??0,r=this.topOffset(),x=n.endsWith("l")?U:window.innerWidth-p-U;if(n.endsWith("r")&&this.sidebar&&window.innerWidth>=Jn+p+U*2)x-=Jn;let b=n.startsWith("t")?r+U:window.innerHeight-i-U;return{x:Math.max(0,x),y:Math.max(r,b)}}nearestCorner(n,o){let p=this.topOffset(),i=o<p+(window.innerHeight-p)/2?"t":"b",r=n<window.innerWidth/2?"l":"r";return`${i}${r}`}positionToolbar(n=!1){let o=this.toolbar;if(!o||this.dragging)return;let{x:p,y:i}=this.toolbarTarget(this.corner);o.classList.toggle("snapping",n),o.style.left=`${p}px`,o.style.top=`${i}px`,o.dataset.corner=this.corner}positionChrome(){this.root.style.setProperty("--top-offset",`${this.topOffset()}px`);let n=this.toolbar?.offsetHeight??0,o=this.toolbar&&this.corner.startsWith("b")?n+U*2:24;this.root.style.setProperty("--toast-bottom",`${o}px`),this.positionToolbar(!1)}savePrefs(n){this.cfg.prefs={...this.cfg.prefs??{},...n},this.api.savePrefs(n).catch(()=>{})}setCorner(n){this.corner=n;try{if(!this.inPreview)window.localStorage.setItem(yn,n)}catch{}if(!this.inPreview)this.savePrefs({corner:n});this.positionToolbar(!0),this.positionChrome()}startDrag(n){let o=this.toolbar;if(!o||n.button!==0)return;n.preventDefault(),n.stopPropagation();let p=o.getBoundingClientRect(),i=n.clientX-p.left,r=n.clientY-p.top;this.dragging=!0,o.classList.remove("snapping"),o.classList.add("dragging"),this.ghost?.remove(),this.ghost=a("div",{class:"snap-ghost"}),Object.assign(this.ghost.style,{width:`${p.width}px`,height:`${p.height}px`}),this.root.append(this.ghost);let x=(g)=>{let f=this.topOffset(),t=Math.min(Math.max(g.clientX-i,0),window.innerWidth-p.width),u=Math.min(Math.max(g.clientY-r,f),window.innerHeight-p.height);o.style.left=`${t}px`,o.style.top=`${u}px`;let s=this.nearestCorner(t+p.width/2,u+p.height/2),j=this.toolbarTarget(s);if(this.ghost)Object.assign(this.ghost.style,{left:`${j.x}px`,top:`${j.y}px`});o.dataset.target=s},b=(g)=>{window.removeEventListener("pointermove",x,!0),window.removeEventListener("pointerup",b,!0),window.removeEventListener("pointercancel",b,!0);let f=o.getBoundingClientRect();this.dragging=!1,o.classList.remove("dragging"),this.ghost?.remove(),this.ghost=null,delete o.dataset.target,this.setCorner(g.type==="pointercancel"?this.corner:this.nearestCorner(f.left+f.width/2,f.top+f.height/2))};window.addEventListener("pointermove",x,!0),window.addEventListener("pointerup",b,!0),window.addEventListener("pointercancel",b,!0)}onGripKey(n){let p={ArrowLeft:(i)=>`${i[0]}l`,ArrowRight:(i)=>`${i[0]}r`,ArrowUp:(i)=>`t${i[1]}`,ArrowDown:(i)=>`b${i[1]}`}[n.key];if(!p)return;n.preventDefault(),this.setCorner(p(this.corner)),this.toolbar?.querySelector(".grip")?.focus()}openSidebar(){this.sidebar?.remove();let n=this.filters,o=this.cfg.labels,p=a("button",{type:"button",class:`scope-tab ${n.scope==="page"?"active":""}`,"data-scope":"page","aria-selected":String(n.scope==="page"),role:"tab",onclick:()=>this.setScope("page")},a("span",{class:"tab-label",text:"This page"}),a("span",{class:"tab-badge",text:String(this.states.size)})),i=a("button",{type:"button",class:`scope-tab ${n.scope==="all"?"active":""}`,"data-scope":"all","aria-selected":String(n.scope==="all"),role:"tab",onclick:()=>this.setScope("all")},a("span",{class:"tab-label",text:"All pages"}),a("span",{class:"tab-badge",text:this.allItems?String(this.allItems.length):""})),r=a("div",{class:"scope-switch",role:"tablist","aria-label":"Feedback scope"},p,i),x=H("type",[["","All types"],...Y.map((s)=>[s,o.type[s]])],n.type,{onchange:()=>{n.type=x.value,this.renderSidebarList()}}),b=H("status",[["unresolved","Unresolved"],["","Any status"],...Object.keys(o.status).map((s)=>[s,o.status[s]])],n.status,{onchange:()=>{n.status=b.value,this.drawPins(),this.renderSidebarList()}}),g=[["0","All rounds"]];for(let s=this.cfg.round;s>=1;s--)g.push([String(s),s===this.cfg.round?`Round ${s} (current)`:`Round ${s}`]);let f=H("round",g,String(n.round),{onchange:()=>{n.round=Number(f.value),this.renderSidebarList()}}),t=H("bp",[["","All breakpoints"],["mobile","Mobile"],["tablet","Tablet"],["desktop","Desktop"]],n.bp,{onchange:()=>{n.bp=t.value,this.renderSidebarList()}}),u=a("input",{type:"checkbox",onchange:()=>{n.mine=u.checked,this.renderSidebarList()}});if(u.checked=n.mine,this.sidebar=a("div",{class:"sidebar",role:"complementary","aria-label":"Feedback list"},a("header",{},a("h2",{},this.cfg.brand?.label??"Feedback",a("button",{class:"x",type:"button","aria-label":"Close list",text:"×",onclick:()=>this.closeSidebar()})),r,a("div",{class:"filters"},x,b,f,t,a("label",{},u,"Assigned to me"))),a("div",{class:"list"})),this.root.append(this.sidebar),this.renderToolbar(),this.renderSidebarList(),!this.allItems)this.api.listItems().then(({items:s})=>{if(this.allItems=s,this.updateScopeBadges(),this.filters.scope==="all"||s.length>this.states.size)this.renderSidebarList()}).catch(()=>{})}setScope(n){if(this.filters.scope===n)return;if(this.filters.scope=n,this.sidebar)this.sidebar.querySelectorAll(".scope-tab").forEach((p)=>{let i=p.dataset.scope===n;p.classList.toggle("active",i),p.setAttribute("aria-selected",String(i))});this.renderSidebarList()}updateScopeBadges(){if(!this.sidebar)return;let n=this.sidebar.querySelector('.scope-tab[data-scope="page"] .tab-badge'),o=this.sidebar.querySelector('.scope-tab[data-scope="all"] .tab-badge');if(n)n.textContent=String(this.states.size);if(o)o.textContent=this.allItems?String(this.allItems.length):""}closeSidebar(){this.sidebar?.remove(),this.sidebar=null,this.renderToolbar()}matchesStatus(n){let o=this.filters.status;if(o==="unresolved")return n.status!=="resolved";return!o||n.status===o}matches(n){let o=this.filters;if(o.type&&n.type!==o.type)return!1;if(o.round&&n.round!==o.round)return!1;if(o.bp&&n.breakpoint!==o.bp)return!1;if(!this.matchesStatus(n))return!1;if(o.mine&&(!this.cfg.assignees.me||n.assignee_id!==this.cfg.assignees.me))return!1;return!0}async renderSidebarList(){let n=this.sidebar?.querySelector(".list");if(!n)return;let o=(b,g,f)=>a("button",{class:"entry",type:"button",onclick:g},a("span",{class:`num ${b.status==="resolved"?"resolved":b.type}`,text:`#${b.id}`}),a("span",{},a("span",{class:"t",text:b.title}),a("span",{class:"s",text:`Round ${b.round} · ${this.cfg.labels.status[b.status]}${b.assignee_name?` · ${b.assignee_name}`:""}${b.breakpoint?` · ${b.breakpoint}`:""}`})),f??null);if(this.filters.scope==="all"){if(!this.allItems){n.replaceChildren(a("div",{class:"empty",text:"Loading…"}));try{this.allItems=(await this.api.listItems()).items,this.updateScopeBadges()}catch(f){n.replaceChildren(a("div",{class:"empty",text:f.message}));return}}let b=new Map;for(let f of this.allItems.filter((t)=>this.matches(t))){let t=b.get(f.page_path)??[];t.push(f),b.set(f.page_path,t)}let g=[];for(let[f,t]of b){g.push(a("h3",{text:f===this.pagePath?`${f} (this page)`:f}));for(let u of t)g.push(o(u,()=>{if(u.page_path===this.pagePath)this.focusItem(u.id);else{let s=new URL(u.page_url,window.location.origin);s.searchParams.set("fbc_item",String(u.id)),window.location.href=s.toString()}}))}n.replaceChildren(...g.length?g:[a("div",{class:"empty",text:"Nothing matches these filters."})]);return}let p={pinned:{title:"On this page",nodes:[]},note:{title:"Page notes",nodes:[]},hidden:{title:"At other breakpoints",nodes:[]},orphan:{title:"Orphaned — element not found",nodes:[]}};for(let b of[...this.states.values()].sort((g,f)=>g.item.id-f.item.id)){if(!this.matches(b.item))continue;let g=b.placement==="orphan"?a("span",{class:"btn link reanchor",role:"button",text:"Pin again",onclick:(f)=>{f.stopPropagation(),this.reanchor(b.item.id)}}):null;p[b.placement].nodes.push(o(b.item,()=>this.focusItem(b.item.id),g))}let i=[];for(let b of["pinned","note","hidden","orphan"]){let g=p[b];if(!g.nodes.length)continue;let f=b==="hidden"?`${g.nodes.length} at other breakpoints`:g.title;i.push(a("h3",{text:f}),...g.nodes)}let r=this.allItems?this.allItems.length:0,x=r-this.states.size;if(i.length>0&&x>0)i.push(a("div",{class:"list-footer-prompt"},a("button",{type:"button",class:"btn-view-all",onclick:()=>this.setScope("all")},`View ${x} more on other pages (${r} total) →`)));if(!i.length){let b=[a("div",{class:"empty",text:"No feedback on this page yet. Right-click anything to add some."})];if(r>0)b.push(a("div",{class:"list-empty-action"},a("button",{type:"button",class:"btn-view-all",onclick:()=>this.setScope("all")},`View all ${r} items on other pages →`)));n.replaceChildren(...b);return}n.replaceChildren(...i)}focusItem(n){let o=this.states.get(n);if(!o)return;if(o.placement==="pinned"&&o.el){if(!this.matchesStatus(o.item)){this.filters.status="";let p=this.sidebar?.querySelector('select[name="status"]');if(p)p.value="";this.drawPins(),this.renderSidebarList()}o.el.scrollIntoView({block:"center",behavior:"smooth"}),window.setTimeout(()=>{this.positionPins(),o.pin?.classList.remove("pulse"),o.pin?.offsetWidth,o.pin?.classList.add("pulse"),this.openPopover(n)},450)}else this.openPopover(n,{x:window.innerWidth-720,y:80})}toast(n,o=!1){let p=a("div",{class:`toast${o?" err":""}`,role:"status",text:n});this.root.append(p),window.setTimeout(()=>p.remove(),o?5000:2200)}showBanner(n){this.bannerEl?.remove(),this.bannerEl=a("div",{class:"banner",role:"status"},a("span",{text:n}),a("button",{type:"button",text:"Dismiss",onclick:()=>{this.bannerEl?.remove(),this.bannerEl=null}})),this.root.append(this.bannerEl)}}un();gn();function go(){if(window.self===window.top)return!0;if(window.name!==C)return!1;try{return window.parent.location.origin===window.location.origin}catch{return!1}}function Hn(){let n=window.fbcConfig;if(!n||!go())return;new E(n).init()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",Hn,{once:!0});else Hn();})();
