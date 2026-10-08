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
`;var no="fbc-root";var Uo=["ember","react-","__next","radix-","headlessui-","mui-","yui_","ext-gen"],Lo=/[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}/i,Ko=/^(:[rR][0-9a-zA-Z]*:|«[rR][0-9a-zA-Z]*»)$/;function Wo(o){let n=/[a-z]/i.test(o),p=/[0-9]/.test(o);if(!n||!p)return!1;if(o.length>=6&&/^[0-9a-f]+$/i.test(o))return!0;return o.length>=8&&/^[0-9a-z]+$/i.test(o)&&Fo(o)>=2}function Fo(o){let n=0;for(let p=1;p<o.length;p++){let r=/[0-9]/.test(o.charAt(p-1)),a=/[0-9]/.test(o.charAt(p));if(r!==a)n++}return n}function qo(o){if(o.trim()===""||/\s/.test(o))return!1;if(/^[0-9]/.test(o))return!1;if(/[0-9]{5,}/.test(o))return!1;if(Lo.test(o))return!1;if(Ko.test(o))return!1;let n=o.toLowerCase();if(Uo.some((p)=>n.startsWith(p)))return!1;return!o.split(/[-_:.]/).some(Wo)}function Go(o){let n="",p=o.length,r=o.charCodeAt(0);for(let a=0;a<p;a++){let x=o.charCodeAt(a),b=o.charAt(a);if(x===0)n+="�";else if(x>=1&&x<=31||x===127||a===0&&x>=48&&x<=57||a===1&&x>=48&&x<=57&&r===45)n+=`\\${x.toString(16)} `;else if(a===0&&p===1&&x===45)n+=`\\${b}`;else if(x>=128||x===45||x===95||x>=48&&x<=57||x>=65&&x<=90||x>=97&&x<=122)n+=b;else n+=`\\${b}`}return n}function T(o,n){let p=n?n.CSS:void 0,r=globalThis.CSS,a=p?.escape??r?.escape;return a?a(o):Go(o)}function Xo(o){return o.replace(/\\/g,"\\\\").replace(/"/g,"\\\"")}function Y(o){return o.localName.toLowerCase()}function Mo(o){return o.ownerDocument.defaultView}function Yo(o){if(!o)return{x:0,y:0};let n=Number.isFinite(o.scrollX)?o.scrollX:0,p=Number.isFinite(o.scrollY)?o.scrollY:0;return{x:n,y:p}}function oo(o){if(!Number.isFinite(o))return 0.5;return Math.min(1,Math.max(0,o))}function S(o){let n=o;while(n){if(n.id==="fbc-root")return!0;if(n.parentElement)n=n.parentElement;else{let p=n.getRootNode();n=p instanceof ShadowRoot?p.host:null}}return!1}function m(o){if(o===null)return null;let n=o.replace(/\s+/g," ").trim();if(n==="")return null;let p=Array.from(n);return p.length>120?p.slice(0,120).join(""):n}var No=/^fl-node-(?!content$)[a-z0-9]+$/i,co=/^[a-z0-9]+$/i;function po(o){let n=1,p=o.previousElementSibling;while(p){if(p.localName===o.localName&&p.namespaceURI===o.namespaceURI)n++;p=p.previousElementSibling}return n}function ro(o,n){if(!o.id||!qo(o.id))return null;let p=`#${T(o.id,n.defaultView)}`,r=n.querySelectorAll(p);return r.length===1&&r[0]===o?p:null}function Bo(o,n){if(o===n.documentElement)return"html";let p=o.localName,r=o.getAttribute("data-id");if(r!==null&&o.classList.contains("elementor-element")&&co.test(r))return`${p}[data-id="${Xo(r)}"]`;let a=Array.from(o.classList).find((x)=>No.test(x));if(a!==void 0)return`${p}.${T(a,n.defaultView)}`;return`${p}:nth-of-type(${po(o)})`}function Vo(o,n,p){let r=p.querySelectorAll(o);return r.length===1&&r[0]===n}function Co(o,n){let p=[],r=o;while(r){let a=ro(r,n);if(a!==null)return p.unshift(a),p.join(" > ");p.unshift(Bo(r,n));let x=p.join(" > ");if(Vo(x,o,n))return x;r=r.parentElement}return p.join(" > ")}function Oo(o,n){let p=[],r=o;while(r){let a=Y(r),x=r.parentElement,b=r===n.documentElement||x===n.documentElement&&(a==="head"||a==="body");p.unshift(b?a:`${a}[${po(r)}]`),r=x}return`/${p.join("/")}`}var _o=/^(\/[a-z][a-z0-9._-]*(\[[1-9][0-9]*\])?)+$/i,Po=/^([a-z][a-z0-9._-]*)(?:\[([1-9][0-9]*)\])?$/i;function Do(o,n){if(!_o.test(o))return null;let p=o.slice(1).split("/"),r=null;for(let a of p){let x=Po.exec(a);if(!x)return null;let b=(x[1]??"").toLowerCase(),g=x[2]===void 0?1:Number(x[2]),t=r?Array.from(r.children):n.documentElement?[n.documentElement]:[],s=0,d=null;for(let f of t){if(Y(f)!==b)continue;if(s++,s===g){d=f;break}}if(!d)return null;r=d}return r}function io(o,n,p){if(!Number.isFinite(n)||!Number.isFinite(p))throw RangeError(`createAnchor: click coordinates must be finite (got ${n}, ${p})`);if(!o.isConnected)throw Error("createAnchor: element is not connected to a document");if(S(o))throw Error("createAnchor: refusing to anchor an element inside #fbc-root");let r=o.ownerDocument;if(o.getRootNode()!==r)throw Error("createAnchor: element is inside a shadow root; anchor its shadow host instead");let a=o.getBoundingClientRect(),x=Yo(r.defaultView),b=a.width>0?oo((n-a.left)/a.width):0.5,g=a.height>0?oo((p-a.top)/a.height):0.5;return{id:ro(o,r)!==null?o.id:null,selector:Co(o,r),xpath:Oo(o,r),text:m(o.textContent),tag:Y(o),offsetX:b,offsetY:g,docX:n+x.x,docY:p+x.y}}function O(o,n){return o!==null&&Y(o)===n&&!S(o)}function Ro(o){return o instanceof DOMException||o instanceof Error&&o.name==="SyntaxError"}function To(o,n){if(typeof o.id!=="string"||o.id==="")return null;let p=n.getElementById(o.id);if(!p)return null;return n.querySelectorAll(`#${T(o.id,n.defaultView)}`).length===1?p:null}function So(o,n){if(typeof o.selector!=="string"||o.selector.trim()==="")return null;let p;try{p=n.querySelectorAll(o.selector)}catch(r){if(Ro(r))return null;throw r}return p.length===1?p[0]??null:null}function mo(o,n){if(typeof o.xpath!=="string")return null;return Do(o.xpath,n)}function Ao(o,n){if(typeof o.text!=="string"||o.text==="")return null;let p=null;for(let r of Array.from(n.getElementsByTagName("*"))){if(Y(r)!==o.tag||S(r))continue;if(m(r.textContent)!==o.text)continue;if(p)return null;p=r}return p}function ao(o,n=document){if(typeof o.tag!=="string"||o.tag==="")return{el:null,strategy:"none"};let p=o.tag.toLowerCase(),r=To(o,n);if(O(r,p))return{el:r,strategy:"id"};let a,x=()=>{if(a===void 0)a=Ao({...o,tag:p},n);return O(a,p)?a:null},b=(d)=>{if(o.text===null||m(d.textContent)===o.text)return null;let f=x();return f&&f!==d?f:null},g=So(o,n);if(O(g,p)){let d=b(g);return d?{el:d,strategy:"text"}:{el:g,strategy:"selector"}}let t=mo(o,n);if(O(t,p)){let d=b(t);return d?{el:d,strategy:"text"}:{el:t,strategy:"xpath"}}let s=x();if(s)return{el:s,strategy:"text"};return{el:null,strategy:"none"}}function xo(o){if(!o.isConnected)return!1;let n=Mo(o);if(!n)return!1;let p=n.getComputedStyle(o);if(p.visibility==="hidden"||p.visibility==="collapse")return!1;let r=o;while(r){if(n.getComputedStyle(r).display==="none")return!1;r=r.parentElement}let a=o.getBoundingClientRect();return!(a.width===0&&a.height===0)}class N extends Error{status;data;constructor(o,n,p){super(o);this.status=n;this.data=p}}class A{cfg;constructor(o){this.cfg=o}url(o,n){let p=this.cfg.restUrl.replace(/\/$/,"")+o;if(n){let r=new URLSearchParams(n).toString();if(r)p+=(p.includes("?")?"&":"?")+r}return p}async request(o,n,p,r){let a=typeof FormData<"u"&&p instanceof FormData,x=typeof Blob<"u"&&p instanceof Blob,b=await fetch(this.url(n,r),{method:o,credentials:"same-origin",headers:{"X-WP-Nonce":this.cfg.nonce,...p!==void 0&&!a?{"Content-Type":x?"application/octet-stream":"application/json"}:{}},body:p===void 0?void 0:a||x?p:JSON.stringify(p)}),g=await b.json().catch(()=>null);if(!b.ok){let t=g&&typeof g==="object"&&"message"in g?String(g.message):b.statusText,s=g&&typeof g==="object"&&"data"in g?g.data:void 0;throw new N(t,b.status,s)}return g}listItems(o){return this.request("GET","/items",void 0,o?{page_path:o}:void 0)}getItem(o){return this.request("GET",`/items/${o}`)}createItem(o,n){if(!n)return this.request("POST","/items",o);let p=new FormData;return p.append("data",JSON.stringify(o)),p.append("screenshot",n,"screenshot.jpg"),this.request("POST","/items",p)}savePrefs(o){return this.request("POST","/me/prefs",o)}replaceScreenshot(o,n){let p=new FormData;return p.append("screenshot",n,"screenshot.jpg"),this.request("POST",`/items/${o}/screenshot`,p)}startRecording(){return this.request("POST","/recordings")}appendRecording(o,n,p){return this.request("POST",`/recordings/${o}`,p,{offset:String(n)})}discardRecording(o){return this.request("DELETE",`/recordings/${o}`)}updateItem(o,n){return this.request("PATCH",`/items/${o}`,n)}deleteItem(o){return this.request("DELETE",`/items/${o}`)}addComment(o,n){return this.request("POST",`/items/${o}/comments`,{body:n})}}function c(o=window.innerWidth){if(o<768)return"mobile";if(o<=1024)return"tablet";return"desktop"}function Io(o){let n=[[/Edg\/([\d.]+)/,"Edge"],[/OPR\/([\d.]+)/,"Opera"],[/Firefox\/([\d.]+)/,"Firefox"],[/CriOS\/([\d.]+)/,"Chrome iOS"],[/Chrome\/([\d.]+)/,"Chrome"],[/Version\/([\d.]+).*Safari/,"Safari"]];for(let[p,r]of n){let a=o.match(p);if(a)return`${r} ${a[1].split(".")[0]}`}return"Unknown"}function ho(o){let n=o.match(/(iPhone|iPad).*OS ([\d_]+)/);if(n)return`iOS ${n[2].replace(/_/g,".")}`;if(n=o.match(/Android ([\d.]+)/),n)return`Android ${n[1]}`;if(n=o.match(/Windows NT ([\d.]+)/),n)return n[1]==="10.0"?"Windows 10/11":`Windows NT ${n[1]}`;if(n=o.match(/Mac OS X ([\d_]+)/),n)return`macOS ${n[1].replace(/_/g,".")}`;if(/CrOS/.test(o))return"ChromeOS";if(/Linux/.test(o))return"Linux";return"Unknown"}var _=null;function bo(){let o=navigator.userAgentData;if(!o)return;o.getHighEntropyValues(["platform","platformVersion"]).then(({platform:n,platformVersion:p})=>{if(!n||!p)return;let[r,a]=p.split(".");if(n==="macOS")_=`macOS ${r}.${a??"0"}`;else if(n==="Windows")_=Number(r)>=13?"Windows 11":"Windows 10";else if(n==="Android"||n==="Chrome OS"||n==="Linux")_=`${n} ${p}`.trim()}).catch(()=>{})}function go(o){let n=navigator.userAgent;return{viewport_w:window.innerWidth,viewport_h:window.innerHeight,dpr:Math.round((window.devicePixelRatio||1)*100)/100,breakpoint:c(),browser:Io(n),os:_??ho(n),user_agent:n,post_id:o.page.postId,post_type:o.page.postType,theme:o.page.theme,js_errors:(window.__fbcErrors??[]).slice(-20),preview:Eo()}}function Eo(){try{return window.self!==window.top?window.frameElement?.getAttribute("data-device")??"":""}catch{return""}}function to(o){let n=window.location.pathname,p=o.replace(/\/$/,"");if(p&&n.startsWith(p))n=n.slice(p.length);return n="/"+n.replace(/^\/+/,""),n==="/"?"/":n.replace(/\/?$/,"/")}function fo(){let o=new URLSearchParams(window.location.search);return o.delete("fbc_item"),o.toString()}function so(){if(window.__fbcErrors)return;let o=window.__fbcErrors=[],n=(p)=>{if(o.push(p.slice(0,500)),o.length>20)o.shift()};window.addEventListener("error",(p)=>{if(p.message)n(`${p.message}${p.filename?` (${p.filename}:${p.lineno})`:""}`)}),window.addEventListener("unhandledrejection",(p)=>{let r=p.reason;n(`Unhandled rejection: ${r instanceof Error?r.message:String(r)}`)})}function i(o,n={},...p){let r=document.createElement(o);for(let[a,x]of Object.entries(n)){if(x===null||x===void 0||x===!1)continue;if(a.startsWith("on")&&typeof x==="function")r.addEventListener(a.slice(2).toLowerCase(),x);else if(a==="text")r.textContent=String(x);else if(a==="value"&&"value"in r)r.value=String(x);else if(x===!0)r.setAttribute(a,"");else r.setAttribute(a,String(x))}for(let a of p){if(a===null||a===void 0||a===!1)continue;r.append(typeof a==="number"?String(a):a)}return r}function Q(o,n,p,r={}){let a=i("select",{name:o,...r});for(let[x,b]of n){let g=i("option",{value:x,text:b});if(x===p)g.selected=!0;a.append(g)}return a}function I(o){let n=new Date(o).getTime();if(Number.isNaN(n))return"";let p=Math.round((Date.now()-n)/1000);if(p<60)return"just now";let r=Math.round(p/60);if(r<60)return`${r}m ago`;let a=Math.round(r/60);if(a<24)return`${a}h ago`;let x=Math.round(a/24);if(x<30)return`${x}d ago`;return new Date(o).toLocaleDateString()}var eo={phone:'<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',tablet:'<rect x="4" y="2.5" width="16" height="19" rx="2"/><path d="M11 18.5h2"/>',desktop:'<rect x="2.5" y="4" width="19" height="12.5" rx="1.5"/><path d="M8.5 20.5h7M12 16.5v4"/>',add:'<path d="M12 5v14M5 12h14"/>',note:'<path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5z"/><path d="M15 3v5a1 1 0 0 0 1 1h5M7.5 13h7M7.5 17h4"/>',camera:'<path d="M14.5 4h-5L8 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.5"/>',record:'<circle cx="12" cy="12" r="7" fill="#ff5a5f" stroke="none"/>'};function W(o){let n=document.createElement("span");return n.className="icon",n.setAttribute("aria-hidden","true"),n.innerHTML=`<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${eo[o]??""}</svg>`,n}function uo(){let o=document.createElement("span");return o.className="shot-toggle-icon",o.setAttribute("aria-hidden","true"),o.innerHTML='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',o}function wo(){let o=document.createElement("span");return o.className="shot-toggle-chevron",o.setAttribute("aria-hidden","true"),o.innerHTML='<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',o}var vo=["video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"],on=2000,ko=4194304,nn=300;function lo(){return typeof navigator<"u"&&!!navigator.mediaDevices&&typeof navigator.mediaDevices.getDisplayMedia==="function"&&typeof MediaRecorder<"u"&&vo.some((o)=>MediaRecorder.isTypeSupported(o))}function F(o){let n=Math.max(0,Math.floor(o/1000));return`${Math.floor(n/60)}:${String(n%60).padStart(2,"0")}`}function pn(o){let n=o.closest('a, button, [role="button"], input, select, textarea, label, summary')??o,p=n.tagName.toLowerCase(),r=n.id?`${p}#${n.id}`:`${p}${[...n.classList].slice(0,2).map((x)=>`.${x}`).join("")}`,a="";if(n instanceof HTMLInputElement||n instanceof HTMLTextAreaElement||n instanceof HTMLSelectElement)a=n.getAttribute("aria-label")||n.getAttribute("placeholder")||n.getAttribute("name")||"";else a=n.getAttribute("aria-label")||n.innerText||n.textContent||"";return a=a.replace(/\s+/g," ").trim().slice(0,60),a?`"${a}" (${r})`:r}class h{api;opts;streams=[];audioCtx=null;rec=null;pieces=[];events=[];token="";queued=0;confirmed=0;queue=Promise.resolve();failed=null;startedAt=0;endedAt=0;tickTimer=0;limitTimer=0;unbinds=[];mic=!1;stopping=!1;cancelled=!1;constructor(o,n){this.api=o;this.opts=n}async start(){let o=await this.api.startRecording();this.token=o.token;let n=Math.min(this.opts.maxSeconds,o.max_seconds||this.opts.maxSeconds),p=null;try{p=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!0,noiseSuppression:!0},video:!1})}catch{p=null}let r;try{r=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:{ideal:30,max:30}},audio:!0,preferCurrentTab:!0,selfBrowserSurface:"include",surfaceSwitching:"exclude",systemAudio:"exclude",monitorTypeSurfaces:"exclude"})}catch(t){throw p?.getTracks().forEach((s)=>s.stop()),this.api.discardRecording(this.token).catch(()=>{return}),t}if(this.cancelled){for(let t of[r,p])t?.getTracks().forEach((s)=>s.stop());throw new DOMException("Recording discarded","AbortError")}this.streams=[r,...p?[p]:[]],this.mic=!!p;let a=[...r.getVideoTracks()],x=[r,p].filter((t)=>!!t&&t.getAudioTracks().length>0);if(x.length){this.audioCtx=new AudioContext;let t=this.audioCtx.createMediaStreamDestination();for(let s of x)this.audioCtx.createMediaStreamSource(s).connect(t);a.push(...t.stream.getAudioTracks())}let b=vo.find((t)=>MediaRecorder.isTypeSupported(t))??"video/webm",g=new MediaRecorder(new MediaStream(a),{mimeType:b,videoBitsPerSecond:1500000,audioBitsPerSecond:96000});this.rec=g,g.ondataavailable=(t)=>{if(t.data.size)this.enqueue(t.data)},g.onstop=()=>this.finish(),r.getVideoTracks()[0]?.addEventListener("ended",()=>this.stop()),this.bindEvents(),g.start(on),this.startedAt=performance.now(),this.tickTimer=window.setInterval(()=>this.opts.onTick(this.elapsed()),250),this.limitTimer=window.setTimeout(()=>this.stop(),n*1000),this.opts.onTick(0)}get recording(){return!!this.rec&&this.rec.state!=="inactive"&&!this.stopping}elapsed(){return(this.endedAt||performance.now())-this.startedAt}stop(){if(!this.rec||this.stopping)return;this.stopping=!0,this.endedAt=performance.now(),window.clearInterval(this.tickTimer),window.clearTimeout(this.limitTimer);for(let o of this.unbinds)o();if(this.unbinds=[],this.rec.state!=="inactive")this.rec.stop();else this.finish()}async discard(){this.cancelled=!0,this.opts.onStop=()=>{return},this.stop(),await this.queue,await this.api.discardRecording(this.token).catch(()=>{return})}finish(){for(let n of this.streams)n.getTracks().forEach((p)=>p.stop());this.streams=[],this.audioCtx?.close().catch(()=>{return}),this.audioCtx=null;let o=new Blob(this.pieces,{type:"video/webm"});this.opts.onStop({blob:o,durationMs:Math.round(this.elapsed()),events:this.events.slice(),mic:this.mic,progress:()=>this.queued?Math.min(1,this.confirmed/this.queued):1,uploaded:()=>this.uploaded(o),discard:()=>this.discard()})}enqueue(o){this.pieces.push(o);let n=this.queued;this.queued+=o.size,this.queue=this.queue.then(async()=>{if(this.failed)return;try{await this.send(this.token,n,o)}catch(p){this.failed=p}})}async send(o,n,p){for(let r=0;;r++)try{let{size:a}=await this.api.appendRecording(o,n,p);this.confirmed=Math.max(this.confirmed,a);return}catch(a){if(a instanceof N&&a.status===409&&Number(a.data?.size)>=n+p.size){this.confirmed=Math.max(this.confirmed,Number(a.data?.size));return}if(!(!(a instanceof N)||a.status>=500||a.status===429)||r>=3)throw a;await new Promise((b)=>window.setTimeout(b,800*2**r))}}async uploaded(o){if(await this.queue,!this.failed)return this.token;this.api.discardRecording(this.token).catch(()=>{return});let n=await this.api.startRecording();this.token=n.token,this.failed=null,this.confirmed=0,this.queued=o.size;for(let p=0;p<o.size;p+=ko)await this.send(this.token,p,o.slice(p,p+ko));return this.token}log(o,n){if(this.events.length>=nn||!this.recording)return;this.events.push({t:Math.round(this.elapsed()),kind:o,label:n.slice(0,200)})}bindEvents(){let o=(n,p,r)=>{n.addEventListener(p,r,!0),this.unbinds.push(()=>n.removeEventListener(p,r,!0))};o(document,"pointerdown",(n)=>{if(n.button!==0||this.opts.isOverlay(n)||!(n.target instanceof Element))return;this.log("click",pn(n.target))}),o(window,"error",(n)=>{if(n.message)this.log("error",`${n.message}${n.filename?` (${n.filename}:${n.lineno})`:""}`)}),o(window,"unhandledrejection",(n)=>{let p=n.reason;this.log("error",`Unhandled rejection: ${p instanceof Error?p.message:String(p)}`)}),o(window,"beforeunload",(n)=>{n.preventDefault(),n.returnValue=""})}}function zo(o){let n=document.createElement("div");n.className="rec-pointer",n.hidden=!0,o.append(n);let p=(x)=>{n.hidden=!1,n.style.transform=`translate(${x.clientX}px, ${x.clientY}px)`},r=(x)=>{p(x);let b=document.createElement("div");b.className="rec-ripple",b.style.left=`${x.clientX}px`,b.style.top=`${x.clientY}px`,o.append(b),window.setTimeout(()=>b.remove(),700)},a=()=>{n.hidden=!0};return document.addEventListener("pointermove",p,{capture:!0,passive:!0}),document.addEventListener("pointerdown",r,{capture:!0,passive:!0}),document.documentElement.addEventListener("pointerleave",a),()=>{document.removeEventListener("pointermove",p,{capture:!0}),document.removeEventListener("pointerdown",r,{capture:!0}),document.documentElement.removeEventListener("pointerleave",a),n.remove()}}var B=["bug","tweak","change","comment"],jo="fbc:mode",yo="fbc:corner",V="fbc-preview",P=[{id:"phone",label:"Mobile",w:390,h:844},{id:"tablet",label:"Tablet",w:820,h:1180},{id:"desktop",label:"Desktop",w:1440,h:900}],q=16,Ho=360,rn=["tl","tr","bl","br"];function an(){let o=new Date;return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`}function xn(o,n){let[p,r,a]=o.split("-").map(Number);return new Date(Date.UTC(p,r-1,a+n)).toISOString().slice(0,10)}function $o(o,n=Date.now()){if(!o)return"";if(o.batchUntil&&n<o.batchUntil*1000)return o.suggest;if(!o.batchUntil&&o.suggest)return o.suggest;return xn(an(),o.days)}function Jo(o,n){let p=i("video",{src:o,controls:!0,preload:"metadata",playsinline:!0,title:`Screen recording (${F(n*1000)})`});return p.addEventListener("loadedmetadata",()=>{if(p.duration!==1/0)return;let r=()=>{p.removeEventListener("durationchange",r),p.currentTime=0};p.addEventListener("durationchange",r),p.currentTime=1e9},{once:!0}),p}class E{cfg;api;host;root;pinsLayer;outline;outlineTag;toolbar=null;sidebar=null;card=null;hintEl=null;bannerEl=null;mode=!1;pinMode=null;states=new Map;allItems=null;filters={scope:"page",type:"",status:"unresolved",mine:!1,round:0,bp:""};pagePath;framePending=!1;refreshTimer=0;lastWidth=window.innerWidth;mutationObserver=null;loaded=!1;corner="br";dragging=!1;ghost=null;inPreview=window.self!==window.top&&window.name===V;previewEl=null;selectedEl=null;unbinds=[];cardCleanup=null;cardGuard=null;recorder=null;recClock=null;stopTrail=null;recDone=null;constructor(o){this.cfg=o;this.api=new A(o),this.pagePath=o.pagePath??to(o.homePath)}destroy(){if(this.recorder)this.recorder.discard();if(this.stopTrail?.(),this.cardCleanup)this.cardCleanup(),this.cardCleanup=null;for(let o of this.unbinds)o();if(this.unbinds=[],this.mutationObserver)this.mutationObserver.disconnect(),this.mutationObserver=null;if(this.refreshTimer)window.clearTimeout(this.refreshTimer),this.refreshTimer=0;this.host?.remove()}listen(o,n,p,r){o.addEventListener(n,p,r),this.unbinds.push(()=>o.removeEventListener(n,p,r))}init(){this.mount(),this.bindGlobalEvents(),this.bindAdminBar();let o=!1,n=null;try{o=window.localStorage.getItem(jo)==="1";let r=window.localStorage.getItem(yo);if(r&&rn.includes(r))n=r}catch{o=!1}let p=this.cfg.prefs??{};if(this.corner=p.corner??n??this.corner,!this.inPreview){let r={};if(!p.corner&&n)r.corner=n;if(Object.keys(r).length)this.savePrefs(r)}if(this.inPreview){let r=document.createElement("style");r.textContent="#wpadminbar{display:none!important}html{margin-top:0!important}",document.head.append(r),this.corner="bl",this.setMode(!0);return}if(this.cfg.openItem||o)this.setMode(!0)}mount(){this.host=i("div",{id:no}),this.host.setAttribute("style","all: initial !important; position: fixed !important; inset: 0 !important; z-index: 2147483000 !important; pointer-events: none !important; display: block !important;");let o=this.host.attachShadow({mode:"open"});o.append(i("style",{text:e})),this.root=i("div",{class:"fbc"});let n=this.cfg.brand;if(n){let r=[["--primary",n.primary],["--on-primary",n.onPrimary],["--dark",n.dark],["--on-dark",n.onDark],["--brand-accent",n.accent],["--ink-primary",n.ink??""]];for(let[a,x]of r)if(x)this.root.style.setProperty(a,x)}let p=i("div",{class:"layer"});this.outlineTag=i("span",{class:"outline-tag"}),this.outline=i("div",{class:"outline"},this.outlineTag),this.pinsLayer=i("div"),p.append(this.outline,this.pinsLayer),this.root.append(p),o.append(this.root),document.body.append(this.host)}inOverlay(o){return o.composedPath().includes(this.host)}bindGlobalEvents(){this.listen(document,"contextmenu",(o)=>this.onContextMenu(o),!0),this.listen(document,"mousemove",(o)=>this.onMouseMove(o),{capture:!0,passive:!0});for(let o of["pointerdown","mousedown","mouseup","click"])this.listen(document,o,(n)=>this.onPinModeEvent(n),!0);this.listen(document,"mousedown",(o)=>this.onOutsideMouseDown(o),!1),this.listen(document,"keydown",(o)=>this.onKeyDown(o),!0),this.listen(window,"scroll",()=>this.schedulePosition(),{passive:!0,capture:!0}),this.listen(window,"resize",()=>{let o=window.innerWidth!==this.lastWidth;if(this.lastWidth=window.innerWidth,this.card?.classList.contains("popover")||this.card?.classList.contains("composer"))this.card.style.maxHeight=`${Math.max(160,window.innerHeight-this.topOffset()-24)}px`,this.moveCard(this.card,this.card.offsetLeft,this.card.offsetTop);if(o)this.scheduleRefresh(80);else this.schedulePosition()})}bindAdminBar(){let o=document.querySelector("#wp-admin-bar-fbc-toggle > a");if(o)this.listen(o,"click",(n)=>{n.preventDefault(),this.setMode(!this.mode)})}async setMode(o){if(!o&&this.recorder){this.toast("Stop or discard the recording first",!0);return}if(this.mode=o,!this.inPreview)try{window.localStorage.setItem(jo,o?"1":"0")}catch{}if(document.querySelector("#wp-admin-bar-fbc-toggle")?.classList.toggle("fbc-on",o),!o){this.exitPinMode(),this.closeCard(),this.closeSidebar(),this.hideOutline(),this.toolbar?.remove(),this.toolbar=null,this.bannerEl?.remove(),this.bannerEl=null,this.pinsLayer.replaceChildren();for(let n of this.states.values())n.pin=null;this.mutationObserver?.disconnect();return}if(this.renderToolbar(),this.observeMutations(),!this.loaded)await this.loadItems();else this.refresh();if(this.cfg.openItem){let n=this.cfg.openItem;this.cfg.openItem=0,this.stripDeepLinkParam(),this.openDeepLink(n)}}stripDeepLinkParam(){let o=new URL(window.location.href);if(o.searchParams.has("fbc_item"))o.searchParams.delete("fbc_item"),window.history.replaceState(window.history.state,"",o.toString())}async loadItems(){try{let{items:o}=await this.api.listItems(this.pagePath),n=new Map(this.states);this.states.clear();for(let p of o){let r=n.get(p.id);n.delete(p.id),this.states.set(p.id,{item:p,el:r?.el??null,placement:"orphan",pin:r?.pin??null})}for(let p of n.values())p.pin?.remove();this.loaded=!0,this.refresh()}catch(o){this.toast(`Could not load feedback: ${o.message}`,!0)}}upsert(o){let n=this.states.get(o.id);if(n)n.item=o;else this.states.set(o.id,{item:o,el:null,placement:"orphan",pin:null});if(this.allItems){let p=this.allItems.findIndex((r)=>r.id===o.id);if(p>=0)this.allItems[p]=o;else this.allItems.push(o)}this.updateScopeBadges()}remove(o){if(this.states.get(o)?.pin?.remove(),this.states.delete(o),this.allItems)this.allItems=this.allItems.filter((p)=>p.id!==o);this.updateScopeBadges()}refresh(){for(let o of this.states.values()){if(!o.item.anchor){o.el=null,o.placement="note";continue}let n=o.el&&o.el.isConnected?o.el:ao(o.item.anchor).el;o.el=n,o.placement=!n?"orphan":xo(n)?"pinned":"hidden"}if(this.drawPins(),this.updateToolbarCount(),this.sidebar)this.renderSidebarList()}drawPins(){if(!this.mode)return;for(let o of this.states.values()){if(!(o.placement==="pinned"&&this.matchesStatus(o.item))){o.pin?.remove(),o.pin=null;continue}if(!o.pin){let a=i("button",{class:"pin",type:"button","aria-label":`Feedback #${o.item.id}: ${o.item.title}`,onclick:(x)=>{x.stopPropagation(),this.openPopover(o.item.id)}});o.pin=a,this.pinsLayer.append(a)}let p=o.item.status==="resolved",r=o.pin.classList.contains("pulse");o.pin.className=`pin ${o.item.type}${p?" resolved":""}${r?" pulse":""}`,o.pin.textContent=p?"✓":String(o.item.id),o.pin.title=`#${o.item.id} ${o.item.title}`}this.positionPins()}schedulePosition(){if(this.framePending||!this.mode)return;this.framePending=!0,requestAnimationFrame(()=>{if(this.framePending=!1,this.positionPins(),this.positionChrome(),this.selectedEl)this.hideOutline()})}scheduleRefresh(o=250){window.clearTimeout(this.refreshTimer),this.refreshTimer=window.setTimeout(()=>this.mode&&this.refresh(),o)}positionPins(){for(let o of this.states.values()){if(!o.pin||!o.el||!o.item.anchor)continue;let n=o.el.getBoundingClientRect(),p=n.left+o.item.anchor.offsetX*n.width,r=n.top+o.item.anchor.offsetY*n.height;o.pin.style.transform=`translate(${Math.round(p)}px, ${Math.round(r)}px)`}}observeMutations(){if(!this.mutationObserver)this.mutationObserver=new MutationObserver((o)=>{if(o.every((n)=>n.target===this.host||this.host.contains(n.target)))return;this.schedulePosition(),this.scheduleRefresh(300)});this.mutationObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["class","style","hidden","open"]})}onContextMenu(o){if(!this.mode||this.recorder||o.altKey||this.inOverlay(o))return;let n=this.eventTarget(o);if(!n)return;o.preventDefault(),o.stopPropagation(),this.exitPinMode(),this.openTypeMenu(n,o.clientX,o.clientY)}onPinModeEvent(o){if(!this.pinMode||this.inOverlay(o)||o.button!==0)return;if(o.preventDefault(),o.stopImmediatePropagation(),o.type!=="click")return;let n=this.eventTarget(o),p=this.pinMode;if(this.exitPinMode(),n)p.done(n,o.clientX,o.clientY)}onOutsideMouseDown(o){if(this.card&&!this.inOverlay(o)&&!this.cardGuard&&!this.recorder)this.closeCard()}onMouseMove(o){if(!this.mode||this.recorder||!this.pinMode||this.inOverlay(o)){if(!this.pinMode)this.hideOutline();return}let n=this.eventTarget(o);if(!n||n===document.documentElement||n===document.body){this.hideOutline();return}this.drawOutline(n)}drawOutline(o){let n=o.getBoundingClientRect();Object.assign(this.outline.style,{left:`${n.left}px`,top:`${n.top}px`,width:`${n.width}px`,height:`${n.height}px`});let p=o.id?`#${o.id}`:"";this.outlineTag.textContent=`${o.tagName.toLowerCase()}${p}`,this.outline.classList.add("on")}onKeyDown(o){if(this.annotating)return;let n=o.composedPath()[0],p=n instanceof HTMLElement&&(n.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(n.tagName));if(o.altKey&&o.shiftKey&&o.code==="KeyF"&&!p){o.preventDefault(),this.setMode(!this.mode);return}if(o.key==="Escape"&&this.previewEl){o.preventDefault(),this.closePreview();return}if(o.key==="Escape"&&this.mode){if(this.pinMode)this.exitPinMode(),o.preventDefault();else if(this.card)this.closeCard(),o.preventDefault();else if(this.sidebar)this.closeSidebar(),o.preventDefault()}}eventTarget(o){let n=o.target;if(n instanceof Element)return n;if(n instanceof Node)return n.parentElement;return null}hideOutline(){if(this.selectedEl?.isConnected){this.drawOutline(this.selectedEl),this.outline.classList.add("locked");return}this.outline.classList.remove("on","locked")}enterPinMode(o){this.closeCard(),this.pinMode=o,this.hintEl?.remove(),this.hintEl=i("div",{class:"crosshair-hint",text:`${o.hint} · Esc to cancel`}),this.root.append(this.hintEl),document.documentElement.style.cursor="crosshair",this.renderToolbar()}exitPinMode(){if(!this.pinMode)return;this.pinMode=null,this.hintEl?.remove(),this.hintEl=null,document.documentElement.style.cursor="",this.hideOutline(),this.renderToolbar()}scripts=new Map;annotating=!1;async annotate(o){if(this.annotating)return null;this.annotating=!0;try{if(!window.FBCAnnotator)await this.loadBundle("annotator.js");let n=window.FBCAnnotator;if(!n)throw Error("The annotator could not load.");let p=this.cfg.brand?.primary??"#6953c4";return await n.open({image:o,mount:this.root,colors:["#e5383b",p,"#ffb703","#ffffff","#111111"]})}catch(n){return this.toast(n.message,!0),null}finally{this.annotating=!1}}loadBundle(o){let n=this.scripts.get(o);if(n)return n;let p=this.cfg.assetsUrl??"",r=new Promise((a,x)=>{let b=document.createElement("script");b.src=`${p}${o}${this.cfg.version?`?ver=${encodeURIComponent(this.cfg.version)}`:""}`,b.async=!0,b.onload=()=>a(),b.onerror=()=>{this.scripts.delete(o),x(Error(`Could not load ${o}`))},document.head.append(b)});return this.scripts.set(o,r),r}async startCapture(o){if(!this.cfg.shots||!this.cfg.assetsUrl)return null;try{if(!window.FBCCapture)await this.loadBundle("capture.js");let n=window.FBCCapture;if(!n)return null;return await n.captureViewport({marker:o,color:this.cfg.brand?.primary??"#6953c4"})}catch{return null}}assigneeOptions(){return[["0","Unassigned"],...this.cfg.assignees.people.map((o)=>[String(o.id),o.name])]}assigneeLabel(){return this.cfg.assignees.source==="teamwork"?"Assignee (Teamwork)":"Assignee"}safeAnchor(o,n,p){try{return io(o,n,p)}catch{return this.toast("Can't pin to that element. Try its container, or add a page note.",!0),null}}closeCard(o=!1){if(this.cardGuard){if(!this.cardGuard())return;this.cardGuard=null}if(this.cardCleanup)this.cardCleanup(),this.cardCleanup=null;if(this.card?.remove(),this.card=null,!o)this.selectedEl=null,this.hideOutline()}releaseCard(){if(!this.card)return!0;return this.closeCard(!0),!this.card}showCard(o,n,p){if(this.closeCard(!0),this.hideOutline(),this.card=o,o.style.left="0px",o.style.top="0px",o.style.visibility="hidden",o.style.maxHeight=`${Math.max(160,window.innerHeight-this.topOffset()-24)}px`,this.root.append(o),this.moveCard(o,n+8,p+8),o.style.visibility="",typeof ResizeObserver<"u"){let a=new ResizeObserver(()=>{if(!o.isConnected)return a.disconnect();this.moveCard(o,o.offsetLeft,o.offsetTop)});a.observe(o)}o.addEventListener("load",()=>this.moveCard(o,o.offsetLeft,o.offsetTop),!0);let r=o.querySelector(":scope > .head");if(r)r.classList.add("drag"),r.title="Drag to move",r.addEventListener("pointerdown",(a)=>this.startCardDrag(o,a))}moveCard(o,n,p){let r=this.topOffset()+12,a=Math.max(12,window.innerWidth-o.offsetWidth-12),x=Math.max(r,window.innerHeight-o.offsetHeight-12);o.style.left=`${Math.round(Math.max(12,Math.min(n,a)))}px`,o.style.top=`${Math.round(Math.max(r,Math.min(p,x)))}px`}startCardDrag(o,n){if(n.button!==0||n.target.closest("button, a, input, select, textarea"))return;n.preventDefault();let p=n.currentTarget,r=n.clientX-o.offsetLeft,a=n.clientY-o.offsetTop;try{p.setPointerCapture(n.pointerId)}catch{}o.classList.add("dragging");let x=(g)=>this.moveCard(o,g.clientX-r,g.clientY-a),b=()=>{o.classList.remove("dragging"),p.removeEventListener("pointermove",x),p.removeEventListener("pointerup",b),p.removeEventListener("pointercancel",b)};p.addEventListener("pointermove",x),p.addEventListener("pointerup",b),p.addEventListener("pointercancel",b)}openTypeMenu(o,n,p){if(!this.releaseCard())return;this.selectedEl=o;let r=this.cfg.labels.type,a=(g)=>this.openComposer(g,o,n,p),x=B.map((g,t)=>i("button",{type:"button",onclick:()=>a(g)},i("span",{class:`dot ${g}`}),r[g],i("kbd",{text:String(t+1)}))),b=i("div",{class:"card menu",role:"menu",onkeydown:(g)=>{let t=g.key,s=Number(t);if(s>=1&&s<=B.length)g.preventDefault(),a(B[s-1])}},i("div",{class:"menu-title",text:"Add feedback"}),...x,i("hr"),i("button",{type:"button",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},"Note for the whole page"));this.showCard(b,n,p),x[0].focus()}openComposer(o,n,p,r){if(!this.releaseCard())return;this.selectedEl=n;let a=null;if(n){if(a=this.safeAnchor(n,p,r),!a)return}let x=this.cfg.labels,b=Q("type",B.map((u)=>[u,x.type[u]]),o),g=i("input",{type:"text",name:"title",maxlength:255,required:!0,placeholder:"What needs attention?",autocomplete:"off"}),t=i("textarea",{name:"description",placeholder:"Details, steps to reproduce, what you expected… (optional)"}),s=Q("priority",Object.keys(x.priority).map((u)=>[u,x.priority[u]]),"medium"),d=Q("assignee_id",this.assigneeOptions(),"0"),f=i("input",{type:"checkbox",name:"due_on"});f.checked=!!this.cfg.due?.onByDefault;let y=i("input",{type:"date",name:"due_date",value:$o(this.cfg.due)});y.hidden=!f.checked,f.addEventListener("change",()=>{if(y.hidden=!f.checked,f.checked&&!y.value)y.value=$o(this.cfg.due)});let k=i("div",{class:"error",role:"alert"}),z=i("button",{class:"btn primary",type:"submit",text:"Add"}),w=null,H=!1,v=!!this.cfg.shots&&!!this.cfg.assetsUrl,J=this.canRecordHere(),D=n?{x:p,y:r}:null,$=i("div",{class:"attach","aria-live":"polite"}),l=(u)=>{if(!w)return;if(URL.revokeObjectURL(w.url),w.kind==="video"){if(window.clearInterval(w.timer),u)w.rec.discard()}w=null},U=()=>{this.cardGuard=H||w?.kind==="video"?()=>{if(H)return!1;if(!window.confirm("Discard this screen recording?"))return!1;return l(!0),!0}:null},G=async()=>{$.replaceChildren(i("div",{class:"meta",text:"Capturing screenshot…"}));let u=await this.startCapture(D);if(!Z.isConnected)return;if(u)l(!0),w={kind:"shot",blob:u,url:URL.createObjectURL(u)};else this.toast("Couldn’t capture a screenshot",!0);L()},C=()=>{H=!0,U(),Z.hidden=!0,this.startRecording((u)=>{if(H=!1,!Z.isConnected){if(u)u.discard();return}if(Z.hidden=!1,u){l(!0);let K=()=>{let j=u.progress(),M=$.querySelector(".rec-status");if(M)M.textContent=j>=1?`Uploaded${u.mic?"":" · no microphone"}`:`Uploading… ${Math.round(j*100)}%`;if(j>=1&&w?.kind==="video")window.clearInterval(w.timer)};w={kind:"video",rec:u,url:URL.createObjectURL(u.blob),timer:window.setInterval(K,400)},L(),K()}else L();U(),this.moveCard(Z,Z.offsetLeft,Z.offsetTop),g.focus()})},X=(u)=>i("button",{type:"button",class:"btn link",text:u,onclick:()=>{l(!0),L(),U()}}),L=()=>{if(!w){$.replaceChildren(...v||J?[i("div",{class:"attach-pick"},i("span",{class:"attach-label",text:"Show it"}),v?i("button",{type:"button",class:"btn attach-btn",onclick:()=>void G()},W("camera"),"Screenshot"):null,J?i("button",{type:"button",class:"btn attach-btn",onclick:C},W("record"),"Video"):null)]:[]);return}if(w.kind==="shot"){let K=w;$.replaceChildren(i("div",{class:"shot"},i("img",{src:K.url,alt:"Screenshot that will be attached"}),i("div",{class:"shot-actions"},i("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{let j=await this.annotate(K.blob);if(!j||w!==K)return;URL.revokeObjectURL(K.url),w={kind:"shot",blob:j,url:URL.createObjectURL(j)},L()}}),i("button",{type:"button",class:"btn link",text:"Retake",onclick:()=>void G()}),X("Remove"))));return}let u=w;$.replaceChildren(i("div",{class:"rec-preview"},Jo(u.url,u.rec.durationMs/1000),i("div",{class:"meta"},`Screen recording · ${F(u.rec.durationMs)}`,u.rec.events.length?` · ${u.rec.events.length} click${u.rec.events.length===1?"":"s"} and errors logged`:""),i("div",{class:"meta rec-status"}),i("div",{class:"shot-actions"},J?i("button",{type:"button",class:"btn link",text:"Re-record",onclick:C}):null,X("Remove"))))};L();let Z=i("form",{class:"card composer",novalidate:!0,onsubmit:(u)=>{u.preventDefault(),R()}},i("div",{class:"head"},i("span",{class:"chip"},i("span",{class:`dot ${o}`}),n?`<${n.tagName.toLowerCase()}>`:"Whole page"),i("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),i("label",{class:"field"},i("span",{text:"Title"}),g),k,i("label",{class:"field"},i("span",{text:"Description"}),t),i("div",{class:"row"},i("label",{class:"field"},i("span",{text:"Type"}),b),i("label",{class:"field"},i("span",{text:"Priority"}),s)),i("label",{class:"field"},i("span",{text:this.assigneeLabel()}),d),this.cfg.assignees.fallback?i("div",{class:"meta hint",text:"Showing WordPress users until Teamwork is connected (Feedback → Settings). Then this lists your Teamwork project members."}):null,i("div",{class:"field due-field"},i("label",{class:"check"},f," Set date?"),y),$,i("div",{class:"actions"},i("button",{class:"btn link",type:"button",text:"Cancel",onclick:()=>this.closeCard()}),z)),R=async()=>{if(k.textContent="",!g.value.trim()){k.textContent="Add a short title.",g.focus();return}z.disabled=!0;try{let u=w,K;if(u?.kind==="video")z.textContent="Uploading…",K={token:await u.rec.uploaded(),duration:Math.round(u.rec.durationMs/1000),events:u.rec.events};let j=await this.api.createItem({type:b.value,title:g.value.trim(),description:t.value,priority:s.value,assignee_id:Number(d.value),assignee_source:this.cfg.assignees.source,due_date:f.checked&&y.value?y.value:null,page_path:this.pagePath,page_query:fo(),page_title:document.title,anchor:a,context:go(this.cfg),recording:K},u?.kind==="shot"?u.blob:null);if(l(!1),this.cardGuard=null,j.due_next)this.cfg.due=j.due_next;this.closeCard(),this.upsert(j);let M=this.states.get(j.id);if(M&&n)M.el=n;if(this.refresh(),j.video_error)this.toast(`Added #${j.id}, but the recording wasn’t saved: ${j.video_error}`,!0);else if(j.screenshot_error)this.toast(`Added #${j.id}, but the screenshot wasn’t saved: ${j.screenshot_error}`,!0);else this.toast(`Added #${j.id}`)}catch(u){k.textContent=u.message,z.disabled=!1,z.textContent="Add"}};this.showCard(Z,p,r),this.cardCleanup=()=>{if(w?.kind==="shot")l(!1)},g.focus()}async openPopover(o,n){if(!this.releaseCard())return;let p;try{p=await this.api.getItem(o)}catch(l){this.toast(l.message,!0);return}this.upsert(p);let r=this.cfg.labels,a=this.states.get(o),x=a?.pin?.getBoundingClientRect(),b=n?.x??(x?x.right:window.innerWidth/2-170),g=n?.y??(x?x.top:100),t=async(l)=>{try{let U=await this.api.updateItem(o,l);this.upsert(U),this.refresh(),this.openPopover(o,{x:parseFloat($.style.left)-8,y:parseFloat($.style.top)-8})}catch(U){this.toast(U.message,!0)}},s=Q("status",Object.keys(r.status).map((l)=>[l,r.status[l]]),p.status,{onchange:()=>void t({status:s.value})}),d=Q("assignee_id",this.assigneeOptions(),String(p.assignee_id),{onchange:()=>void t({assignee_id:Number(d.value),assignee_source:this.cfg.assignees.source})}),f=Q("priority",Object.keys(r.priority).map((l)=>[l,r.priority[l]]),p.priority,{onchange:()=>void t({priority:f.value})}),y=i("input",{type:"date",name:"due_date",value:p.due_date??"",class:p.overdue?"overdue":"",onchange:()=>void t({due_date:y.value||null})}),k=i("textarea",{placeholder:"Reply… (type @ to mention)",rows:2}),z=i("label",{class:"field mention-container"},k),w=this.setupMentions(k,z),H=i("ul",{class:"thread"},...(p.comments??[]).map((l)=>i("li",{class:l.kind},i("span",{class:"who",text:l.user_name}),i("span",{class:"when",text:I(l.created_at)}),this.renderMentionText("body",l.body)))),v=c(),J=p.breakpoint&&p.breakpoint!==v?i("div",{class:"notice",text:`Logged at ${p.breakpoint} (${p.context?.viewport_w??"?"}px). You are on ${v} (${window.innerWidth}px).`}):null,D=a?.placement==="orphan"?i("div",{class:"notice",text:"The element this was pinned to can’t be found on the page anymore. Use “Pin again” in the list to place it."}):null,$=i("div",{class:"card popover",role:"dialog","aria-label":`Feedback #${p.id}`},i("div",{class:"head"},i("span",{class:"chip"},i("span",{class:`dot ${p.type}`}),`${r.type[p.type]} #${p.id}`),i("button",{class:"x",type:"button","aria-label":"Close",text:"×",onclick:()=>this.closeCard()})),i("div",{class:"t",style:"font-weight:700;font-size:15px;margin-bottom:4px",text:p.title}),i("div",{class:"meta",text:`Round ${p.round} · ${p.reporter_name} · ${I(p.created_at)}`}),p.breakpoint?i("div",{class:"meta bp-line"},i("span",{class:"chip",text:p.breakpoint}),` ${p.context?.viewport_w??"?"}px wide${p.context?.preview?` · ${p.context.preview} preview`:""}`):null,p.tw_task_url?i("div",{class:"meta"},i("a",{href:p.tw_task_url,target:"_blank",rel:"noopener",text:`Teamwork task #${p.tw_task_id} ↗`}),p.status==="resolved"?" · completed":" · status syncs from Teamwork"):p.tw_note?i("div",{class:"notice",text:p.tw_note}):null,J,D,p.description?this.renderMentionText("desc",p.description):null,p.screenshot_url?(()=>{let l=!1,U,G=i("button",{type:"button",class:"shot-toggle","aria-expanded":"false",onclick:()=>{l=!l,X.classList.toggle("is-expanded",l),G.setAttribute("aria-expanded",l?"true":"false"),U.textContent=l?"Hide screenshot":"View screenshot"}},i("span",{class:"shot-toggle-lead"},uo(),U=i("span",{class:"shot-toggle-label",text:"View screenshot"})),wo()),C=i("div",{class:"shot-body"},i("div",{class:"shot-inner"},i("a",{href:p.screenshot_url,target:"_blank",rel:"noopener",title:"Open full screenshot"},i("img",{src:p.screenshot_url,alt:"Screenshot from when this was filed"})),i("div",{class:"shot-actions"},i("button",{type:"button",class:"btn link",text:"✎ Annotate",onclick:async()=>{try{let L=await fetch(p.screenshot_url,{credentials:"same-origin",cache:"no-store"}),Z=await this.annotate(await L.blob());if(!Z)return;let R=await this.api.replaceScreenshot(p.id,Z);this.upsert(R),this.toast(`Annotations saved on #${p.id}`),this.openPopover(o,{x:parseFloat($.style.left)-8,y:parseFloat($.style.top)-8})}catch(L){this.toast(L.message,!0)}}})))),X=i("div",{class:"shot shot--collapsible"},G,C);return X})():null,p.video_url?this.videoBlock(p):null,i("div",{class:"row"},i("label",{class:"field"},i("span",{text:"Status"}),s),i("label",{class:"field"},i("span",{text:"Priority"}),f)),i("label",{class:"field"},i("span",{text:p.overdue?"Due date · overdue":"Due date"}),y),p.assignee_locked?i("div",{class:"field"},i("span",{text:this.assigneeLabel()}),i("div",{text:p.assignee_name||"Unassigned"}),i("div",{class:"meta",text:"In Teamwork now: change the assignee there."})):i("label",{class:"field"},i("span",{text:this.assigneeLabel()}),d),H,z,i("div",{class:"actions"},i("a",{class:"btn link",href:`${this.cfg.adminUrl}&item=${p.id}`,target:"_blank",rel:"noopener",text:"Admin"}),p.can_delete?i("button",{class:"btn danger",type:"button",text:"Delete",onclick:()=>void this.deleteItem(p.id)}):null,i("button",{class:"btn primary",type:"button",text:"Reply",onclick:async()=>{if(!k.value.trim())return;try{await this.api.addComment(p.id,k.value),this.openPopover(o,{x:parseFloat($.style.left)-8,y:parseFloat($.style.top)-8})}catch(l){this.toast(l.message,!0)}}})));this.showCard($,b,g),this.cardCleanup=w}renderMentionText(o,n){let p=i("div",{class:o}),a=(this.cfg.assignees?.people??[]).map((g)=>g.name.trim().replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).filter((g)=>g.length>0).sort((g,t)=>t.length-g.length),x=a.length?new RegExp(`(@(?:${a.join("|")}|[A-Za-z0-9_.-]+))`,"g"):/(@[A-Za-z0-9_.-]+)/g,b=n.split(x);for(let g of b)if(g.startsWith("@"))p.append(i("span",{class:"mention",text:g}));else if(g)p.append(document.createTextNode(g));return p}setupMentions(o,n){let p=this.cfg.assignees?.people??[];if(!p.length)return()=>{};let r=null,a=0,x=-1,b=[],g=()=>{r?.remove(),r=null,x=-1,b=[]},t=(k)=>{let z=o.value,w=z.slice(0,x),H=z.slice(o.selectionEnd),v=`@${k.name} `;o.value=`${w}${v}${H}`;let J=w.length+v.length;o.setSelectionRange(J,J),o.focus(),g()},s=()=>{if(!r)r=i("div",{class:"mention-menu",role:"listbox"}),n.append(r);if(r.innerHTML="",!b.length){g();return}b.forEach((k,z)=>{let w=i("div",{class:`mention-item${z===a?" is-active":""}`,role:"option",text:k.name,onclick:(H)=>{H.preventDefault(),H.stopPropagation(),t(k)}});r?.append(w)})},d=()=>{let k=typeof o.selectionStart==="number"&&o.selectionStart>0?o.selectionStart:o.value.length,z=o.value.slice(0,k),w=z.lastIndexOf("@");if(w===-1||w>0&&!/\s/.test(z[w-1])){g();return}let H=z.slice(w+1).toLowerCase();if(H.includes(`
`)){g();return}if(x=w,b=p.filter((v)=>v.name.toLowerCase().includes(H)).slice(0,5),a=0,b.length)s();else g()},f=(k)=>{if(!r)return;if(k.key==="ArrowDown")k.preventDefault(),a=(a+1)%b.length,s();else if(k.key==="ArrowUp")k.preventDefault(),a=(a-1+b.length)%b.length,s();else if(k.key==="Enter"||k.key==="Tab"){if(b[a])k.preventDefault(),t(b[a])}else if(k.key==="Escape")k.preventDefault(),k.stopPropagation(),g()};o.addEventListener("input",d),o.addEventListener("keydown",f);let y=(k)=>{if(r&&!r.contains(k.target)&&k.target!==o)g()};return document.addEventListener("click",y),()=>{g(),o.removeEventListener("input",d),o.removeEventListener("keydown",f),document.removeEventListener("click",y)}}reanchor(o){this.enterPinMode({hint:`Click the element #${o} belongs to`,done:async(n,p,r)=>{try{let a=this.safeAnchor(n,p,r);if(!a)return;let x=await this.api.updateItem(o,{anchor:a});this.upsert(x);let b=this.states.get(o);if(b)b.el=n;this.refresh(),this.toast(`Pinned #${o} again`)}catch(a){this.toast(a.message,!0)}}})}async deleteItem(o){if(!window.confirm(`Delete feedback #${o}? This can’t be undone.`))return;try{await this.api.deleteItem(o),this.closeCard(),this.remove(o),this.refresh(),this.toast(`Deleted #${o}`)}catch(n){this.toast(n.message,!0)}}async openDeepLink(o){let n=this.states.get(o);if(n?.el&&n.placement==="pinned")n.el.scrollIntoView({block:"center",behavior:"auto"}),await new Promise((r)=>requestAnimationFrame(()=>r(null))),this.positionPins(),n.pin?.classList.add("pulse");let p=n?.item;if(p?.breakpoint&&p.breakpoint!==c())this.showBanner(`#${o} was logged at ${p.breakpoint} (${p.context?.viewport_w??"?"}px wide). You're viewing at ${c()} (${window.innerWidth}px). Resize to reproduce.`);await this.openPopover(o)}unresolvedCount(){let o=0;for(let n of this.states.values())if(n.item.status!=="resolved")o++;return o}videoBlock(o){let n=Jo(o.video_url,o.video_duration??0),p=o.video_events??[];return i("details",{class:"rec-block",open:!0},i("summary",{text:`Screen recording · ${F((o.video_duration??0)*1000)}`}),n,p.length?i("ol",{class:"rec-timeline"},...p.map((r)=>i("li",{class:r.kind},i("button",{type:"button",class:"btn link",text:F(r.t),title:"Play from here",onclick:()=>{n.currentTime=Math.max(0,r.t/1000-1),n.play()}}),i("span",{text:r.kind==="error"?"JS error ":"clicked "}),i("code",{text:r.label})))):null)}canRecordHere(){return!!this.cfg.video?.enabled&&!this.inPreview&&lo()}async startRecording(o){if(this.recorder)return;this.exitPinMode(),this.recDone=o;let n=new h(this.api,{maxSeconds:this.cfg.video?.maxSeconds??180,isOverlay:(p)=>this.inOverlay(p),onTick:(p)=>{if(this.recClock)this.recClock.textContent=`${F(p)} / ${F((this.cfg.video?.maxSeconds??180)*1000)}`},onStop:(p)=>this.onRecordingStopped(p)});this.recorder=n,this.renderToolbar();try{await n.start()}catch(p){if(this.recorder!==n)return;let r=p.name;if(r==="NotAllowedError"||r==="AbortError")this.toast("Recording cancelled");else this.toast(`Couldn’t start recording: ${p.message}`,!0);this.finishRecording(null);return}this.stopTrail=zo(this.root.querySelector(".layer"))}onRecordingStopped(o){if(o.durationMs<1000||!o.blob.size){o.discard(),this.toast("Recording was too short, so it was discarded",!0),this.finishRecording(null);return}this.finishRecording(o)}finishRecording(o){this.stopTrail?.(),this.stopTrail=null,this.recorder=null,this.recClock=null;let n=this.recDone;this.recDone=null,this.renderToolbar(),n?.(o)}recordingToolbar(){let o=this.recorder;return this.recClock=i("span",{class:"rec-clock",text:"Starting…"}),i("div",{class:"toolbar recording",role:"toolbar","aria-label":"Screen recording"},i("span",{class:"rec-dot","aria-hidden":"true"}),this.recClock,i("button",{type:"button",class:"rec-stop",text:"■ Stop",title:"Stop and go back to your feedback",onclick:()=>o.stop()}),i("button",{type:"button",text:"Discard",onclick:()=>{if(!window.confirm("Throw this recording away?"))return;o.discard(),this.finishRecording(null),this.toast("Recording discarded")}}))}renderToolbar(){if(!this.mode)return;let o=this.unresolvedCount(),n=this.recorder?this.recordingToolbar():i("div",{class:"toolbar",role:"toolbar","aria-label":this.cfg.brand?.name??"Feedback"},i("button",{type:"button",class:"grip",title:"Drag to move · arrow keys snap to a corner","aria-label":"Move toolbar: drag, or use arrow keys to snap to a corner",text:"⠿",onpointerdown:(r)=>this.startDrag(r),onkeydown:(r)=>this.onGripKey(r)}),this.cfg.brand?.logo?i("span",{class:"brand",title:`${this.cfg.brand.name} · drag to move`,onpointerdown:(r)=>this.startDrag(r)},i("img",{src:this.cfg.brand.logo,alt:this.cfg.brand.name})):i("span",{class:"brand",title:"Drag to move",text:this.cfg.brand?.label??"Feedback",onpointerdown:(r)=>this.startDrag(r)}),i("button",{type:"button",class:this.pinMode?"icon-btn on":"icon-btn","data-tip":"Add feedback to an element","aria-label":"Add feedback to an element",onclick:()=>this.pinMode?this.exitPinMode():this.enterPinMode({hint:"Click any element to add feedback",done:(r,a,x)=>this.openTypeMenu(r,a,x)})},W("add")),i("button",{type:"button",class:"icon-btn","data-tip":"Add a page note","aria-label":"Add a note for the whole page",onclick:()=>this.openComposer("comment",null,window.innerWidth/2-170,120)},W("note")),this.inPreview?null:i("span",{class:"devices",role:"group","aria-label":"Preview at a device size"},...P.map((r)=>r.id==="desktop"?i("button",{type:"button",class:"icon-btn","aria-pressed":"true","data-tip":"Desktop: the page as you see it now","aria-label":"Desktop view (current)",onclick:()=>this.closePreview()},W(r.id)):i("button",{type:"button",class:"icon-btn","aria-pressed":"false","data-tip":`Preview as ${r.label} (${r.w}px)`,"aria-label":`Preview as ${r.label}, ${r.w} pixels wide`,onclick:()=>this.openPreview(r.id)},W(r.id)))),i("button",{type:"button",class:this.sidebar?"on":"",onclick:()=>this.sidebar?this.closeSidebar():this.openSidebar()},i("span",{class:"label",text:"List"}),o?i("span",{class:"count",text:String(o)}):null),i("button",{type:"button","data-tip":"Exit Feedback mode (Alt+Shift+F)","aria-label":"Exit Feedback mode",text:"×",onclick:()=>void this.setMode(!1)})),p=!!this.toolbar;if(n.hidden=!!this.previewEl,this.toolbar)this.toolbar.replaceWith(n);else this.root.append(n);if(this.toolbar=n,this.positionToolbar(!1),!p)this.positionChrome()}updateToolbarCount(){this.renderToolbar()}openPreview(o,n=!1){if(o==="desktop"){this.closePreview();return}let p=P.find((v)=>v.id===o)??P[0],r=n?p.h:p.w,a=n?p.w:p.h,x=`${p.label} ${r}×${a}`;this.closeCard(),this.exitPinMode();let b=this.previewEl?.querySelector("iframe"),g=new URL(b?.contentWindow?.location.href??window.location.href);g.searchParams.delete("fbc_item"),g.searchParams.set("fbc_preview","1"),this.previewEl?.remove();let t=i("iframe",{name:V,title:`${x} preview`,"data-device":x,src:g.toString()});t.style.width=`${r}px`,t.style.height=`${a}px`;let s=i("div",{class:"preview-device"},t),d=i("div",{class:"preview-stage"},s),f=i("div",{class:"preview-blocked",hidden:!0}),y=P.map((v)=>i("button",{type:"button",class:"icon-btn","aria-pressed":String(v.id===p.id),title:v.id==="desktop"?"Desktop: back to the page itself":`${v.label} (${v.w}px)`,"aria-label":v.id==="desktop"?"Desktop: close the preview":`${v.label}, ${v.w} pixels wide`,onclick:()=>v.id==="desktop"?this.closePreview():this.openPreview(v.id,v.id===p.id?n:!1)},W(v.id),i("span",{class:"icon-label",text:v.label}))),k=()=>{window.open(g.toString(),V,`width=${r},height=${a},resizable=yes,scrollbars=yes`)},z=i("div",{class:"preview-bar",role:"toolbar","aria-label":"Device preview"},i("strong",{text:"Device preview"}),i("div",{class:"preview-devices"},...y),i("button",{type:"button",title:"Rotate",text:"⟲ Rotate",onclick:()=>this.openPreview(p.id,!n)}),i("span",{class:"preview-label",text:x}),i("span",{class:"annotator-spacer"}),i("button",{type:"button",text:"Open in a window",onclick:k}),i("button",{type:"button",class:"preview-close",text:"Done",onclick:()=>this.closePreview()})),w=i("div",{class:"preview",role:"dialog","aria-label":`Device preview: ${x}`},z,d,f);if(this.previewEl=w,this.root.append(w),requestAnimationFrame(()=>{let v=d.getBoundingClientRect(),J=Math.min(1,(v.width-32)/r,(v.height-32)/a);s.style.width=`${Math.round(r*J)}px`,s.style.height=`${Math.round(a*J)}px`,t.style.transform=`scale(${J})`}),t.addEventListener("load",()=>{let v=!1;try{v=!!t.contentDocument&&t.contentDocument.location.href!=="about:blank"}catch{v=!1}if(!v)f.hidden=!1,f.replaceChildren(i("p",{text:"This site can’t be shown in a frame here."}),i("button",{type:"button",class:"btn primary",text:`Open ${x} in a window`,onclick:k}))}),this.pinsLayer.hidden=!0,this.toolbar)this.toolbar.hidden=!0;this.closeSidebar()}closePreview(){if(!this.previewEl)return;if(this.previewEl.remove(),this.previewEl=null,this.pinsLayer.hidden=!1,this.toolbar)this.toolbar.hidden=!1;this.loaded=!1,this.loadItems()}topOffset(){let o=document.getElementById("wpadminbar");if(!o)return 0;let n=o.getBoundingClientRect();return n.height>0?Math.max(0,Math.round(n.bottom)):0}toolbarTarget(o){let n=this.toolbar,p=n?.offsetWidth??0,r=n?.offsetHeight??0,a=this.topOffset(),x=o.endsWith("l")?q:window.innerWidth-p-q;if(o.endsWith("r")&&this.sidebar&&window.innerWidth>=Ho+p+q*2)x-=Ho;let b=o.startsWith("t")?a+q:window.innerHeight-r-q;return{x:Math.max(0,x),y:Math.max(a,b)}}nearestCorner(o,n){let p=this.topOffset(),r=n<p+(window.innerHeight-p)/2?"t":"b",a=o<window.innerWidth/2?"l":"r";return`${r}${a}`}positionToolbar(o=!1){let n=this.toolbar;if(!n||this.dragging)return;let{x:p,y:r}=this.toolbarTarget(this.corner);n.classList.toggle("snapping",o),n.style.left=`${p}px`,n.style.top=`${r}px`,n.dataset.corner=this.corner}positionChrome(){this.root.style.setProperty("--top-offset",`${this.topOffset()}px`);let o=this.toolbar?.offsetHeight??0,n=this.toolbar&&this.corner.startsWith("b")?o+q*2:24;this.root.style.setProperty("--toast-bottom",`${n}px`),this.positionToolbar(!1)}savePrefs(o){this.cfg.prefs={...this.cfg.prefs??{},...o},this.api.savePrefs(o).catch(()=>{})}setCorner(o){this.corner=o;try{if(!this.inPreview)window.localStorage.setItem(yo,o)}catch{}if(!this.inPreview)this.savePrefs({corner:o});this.positionToolbar(!0),this.positionChrome()}startDrag(o){let n=this.toolbar;if(!n||o.button!==0)return;o.preventDefault(),o.stopPropagation();let p=n.getBoundingClientRect(),r=o.clientX-p.left,a=o.clientY-p.top;this.dragging=!0,n.classList.remove("snapping"),n.classList.add("dragging"),this.ghost?.remove(),this.ghost=i("div",{class:"snap-ghost"}),Object.assign(this.ghost.style,{width:`${p.width}px`,height:`${p.height}px`}),this.root.append(this.ghost);let x=(g)=>{let t=this.topOffset(),s=Math.min(Math.max(g.clientX-r,0),window.innerWidth-p.width),d=Math.min(Math.max(g.clientY-a,t),window.innerHeight-p.height);n.style.left=`${s}px`,n.style.top=`${d}px`;let f=this.nearestCorner(s+p.width/2,d+p.height/2),y=this.toolbarTarget(f);if(this.ghost)Object.assign(this.ghost.style,{left:`${y.x}px`,top:`${y.y}px`});n.dataset.target=f},b=(g)=>{window.removeEventListener("pointermove",x,!0),window.removeEventListener("pointerup",b,!0),window.removeEventListener("pointercancel",b,!0);let t=n.getBoundingClientRect();this.dragging=!1,n.classList.remove("dragging"),this.ghost?.remove(),this.ghost=null,delete n.dataset.target,this.setCorner(g.type==="pointercancel"?this.corner:this.nearestCorner(t.left+t.width/2,t.top+t.height/2))};window.addEventListener("pointermove",x,!0),window.addEventListener("pointerup",b,!0),window.addEventListener("pointercancel",b,!0)}onGripKey(o){let p={ArrowLeft:(r)=>`${r[0]}l`,ArrowRight:(r)=>`${r[0]}r`,ArrowUp:(r)=>`t${r[1]}`,ArrowDown:(r)=>`b${r[1]}`}[o.key];if(!p)return;o.preventDefault(),this.setCorner(p(this.corner)),this.toolbar?.querySelector(".grip")?.focus()}openSidebar(){this.sidebar?.remove();let o=this.filters,n=this.cfg.labels,p=i("button",{type:"button",class:`scope-tab ${o.scope==="page"?"active":""}`,"data-scope":"page","aria-selected":String(o.scope==="page"),role:"tab",onclick:()=>this.setScope("page")},i("span",{class:"tab-label",text:"This page"}),i("span",{class:"tab-badge",text:String(this.states.size)})),r=i("button",{type:"button",class:`scope-tab ${o.scope==="all"?"active":""}`,"data-scope":"all","aria-selected":String(o.scope==="all"),role:"tab",onclick:()=>this.setScope("all")},i("span",{class:"tab-label",text:"All pages"}),i("span",{class:"tab-badge",text:this.allItems?String(this.allItems.length):""})),a=i("div",{class:"scope-switch",role:"tablist","aria-label":"Feedback scope"},p,r),x=Q("type",[["","All types"],...B.map((f)=>[f,n.type[f]])],o.type,{onchange:()=>{o.type=x.value,this.renderSidebarList()}}),b=Q("status",[["unresolved","Unresolved"],["","Any status"],...Object.keys(n.status).map((f)=>[f,n.status[f]])],o.status,{onchange:()=>{o.status=b.value,this.drawPins(),this.renderSidebarList()}}),g=[["0","All rounds"]];for(let f=this.cfg.round;f>=1;f--)g.push([String(f),f===this.cfg.round?`Round ${f} (current)`:`Round ${f}`]);let t=Q("round",g,String(o.round),{onchange:()=>{o.round=Number(t.value),this.renderSidebarList()}}),s=Q("bp",[["","All breakpoints"],["mobile","Mobile"],["tablet","Tablet"],["desktop","Desktop"]],o.bp,{onchange:()=>{o.bp=s.value,this.renderSidebarList()}}),d=i("input",{type:"checkbox",onchange:()=>{o.mine=d.checked,this.renderSidebarList()}});if(d.checked=o.mine,this.sidebar=i("div",{class:"sidebar",role:"complementary","aria-label":"Feedback list"},i("header",{},i("h2",{},this.cfg.brand?.label??"Feedback",i("button",{class:"x",type:"button","aria-label":"Close list",text:"×",onclick:()=>this.closeSidebar()})),a,i("div",{class:"filters"},x,b,t,s,i("label",{},d,"Assigned to me"))),i("div",{class:"list"})),this.root.append(this.sidebar),this.renderToolbar(),this.renderSidebarList(),!this.allItems)this.api.listItems().then(({items:f})=>{if(this.allItems=f,this.updateScopeBadges(),this.filters.scope==="all"||f.length>this.states.size)this.renderSidebarList()}).catch(()=>{})}setScope(o){if(this.filters.scope===o)return;if(this.filters.scope=o,this.sidebar)this.sidebar.querySelectorAll(".scope-tab").forEach((p)=>{let r=p.dataset.scope===o;p.classList.toggle("active",r),p.setAttribute("aria-selected",String(r))});this.renderSidebarList()}updateScopeBadges(){if(!this.sidebar)return;let o=this.sidebar.querySelector('.scope-tab[data-scope="page"] .tab-badge'),n=this.sidebar.querySelector('.scope-tab[data-scope="all"] .tab-badge');if(o)o.textContent=String(this.states.size);if(n)n.textContent=this.allItems?String(this.allItems.length):""}closeSidebar(){this.sidebar?.remove(),this.sidebar=null,this.renderToolbar()}matchesStatus(o){let n=this.filters.status;if(n==="unresolved")return o.status!=="resolved";return!n||o.status===n}matches(o){let n=this.filters;if(n.type&&o.type!==n.type)return!1;if(n.round&&o.round!==n.round)return!1;if(n.bp&&o.breakpoint!==n.bp)return!1;if(!this.matchesStatus(o))return!1;if(n.mine&&(!this.cfg.assignees.me||o.assignee_id!==this.cfg.assignees.me))return!1;return!0}async renderSidebarList(){let o=this.sidebar?.querySelector(".list");if(!o)return;let n=(b,g,t)=>i("button",{class:"entry",type:"button",onclick:g},i("span",{class:`num ${b.status==="resolved"?"resolved":b.type}`,text:`#${b.id}`}),i("span",{},i("span",{class:"t",text:b.title}),i("span",{class:"s",text:`Round ${b.round} · ${this.cfg.labels.status[b.status]}${b.assignee_name?` · ${b.assignee_name}`:""}${b.breakpoint?` · ${b.breakpoint}`:""}`})),t??null);if(this.filters.scope==="all"){if(!this.allItems){o.replaceChildren(i("div",{class:"empty",text:"Loading…"}));try{this.allItems=(await this.api.listItems()).items,this.updateScopeBadges()}catch(t){o.replaceChildren(i("div",{class:"empty",text:t.message}));return}}let b=new Map;for(let t of this.allItems.filter((s)=>this.matches(s))){let s=b.get(t.page_path)??[];s.push(t),b.set(t.page_path,s)}let g=[];for(let[t,s]of b){g.push(i("h3",{text:t===this.pagePath?`${t} (this page)`:t}));for(let d of s)g.push(n(d,()=>{if(d.page_path===this.pagePath)this.focusItem(d.id);else{let f=new URL(d.page_url,window.location.origin);f.searchParams.set("fbc_item",String(d.id)),window.location.href=f.toString()}}))}o.replaceChildren(...g.length?g:[i("div",{class:"empty",text:"Nothing matches these filters."})]);return}let p={pinned:{title:"On this page",nodes:[]},note:{title:"Page notes",nodes:[]},hidden:{title:"At other breakpoints",nodes:[]},orphan:{title:"Orphaned — element not found",nodes:[]}};for(let b of[...this.states.values()].sort((g,t)=>g.item.id-t.item.id)){if(!this.matches(b.item))continue;let g=b.placement==="orphan"?i("span",{class:"btn link reanchor",role:"button",text:"Pin again",onclick:(t)=>{t.stopPropagation(),this.reanchor(b.item.id)}}):null;p[b.placement].nodes.push(n(b.item,()=>this.focusItem(b.item.id),g))}let r=[];for(let b of["pinned","note","hidden","orphan"]){let g=p[b];if(!g.nodes.length)continue;let t=b==="hidden"?`${g.nodes.length} at other breakpoints`:g.title;r.push(i("h3",{text:t}),...g.nodes)}let a=this.allItems?this.allItems.length:0,x=a-this.states.size;if(r.length>0&&x>0)r.push(i("div",{class:"list-footer-prompt"},i("button",{type:"button",class:"btn-view-all",onclick:()=>this.setScope("all")},`View ${x} more on other pages (${a} total) →`)));if(!r.length){let b=[i("div",{class:"empty",text:"No feedback on this page yet. Right-click anything to add some."})];if(a>0)b.push(i("div",{class:"list-empty-action"},i("button",{type:"button",class:"btn-view-all",onclick:()=>this.setScope("all")},`View all ${a} items on other pages →`)));o.replaceChildren(...b);return}o.replaceChildren(...r)}focusItem(o){let n=this.states.get(o);if(!n)return;if(n.placement==="pinned"&&n.el){if(!this.matchesStatus(n.item)){this.filters.status="";let p=this.sidebar?.querySelector('select[name="status"]');if(p)p.value="";this.drawPins(),this.renderSidebarList()}n.el.scrollIntoView({block:"center",behavior:"smooth"}),window.setTimeout(()=>{this.positionPins(),n.pin?.classList.remove("pulse"),n.pin?.offsetWidth,n.pin?.classList.add("pulse"),this.openPopover(o)},450)}else this.openPopover(o,{x:window.innerWidth-720,y:80})}toast(o,n=!1){let p=i("div",{class:`toast${n?" err":""}`,role:"status",text:o});this.root.append(p),window.setTimeout(()=>p.remove(),n?5000:2200)}showBanner(o){this.bannerEl?.remove(),this.bannerEl=i("div",{class:"banner",role:"status"},i("span",{text:o}),i("button",{type:"button",text:"Dismiss",onclick:()=>{this.bannerEl?.remove(),this.bannerEl=null}})),this.root.append(this.bannerEl)}}so();bo();function bn(){if(window.self===window.top)return!0;if(window.name!==V)return!1;try{return window.parent.location.origin===window.location.origin}catch{return!1}}function Zo(){let o=window.fbcConfig;if(!o||!bn())return;new E(o).init()}if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",Zo,{once:!0});else Zo();})();
