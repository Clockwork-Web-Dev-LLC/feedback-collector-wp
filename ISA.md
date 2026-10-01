---
task: "Plan v1 of Feedback Collector WordPress QA plugin"
project: feedback-collector-wp
effort: E4
effort_source: classifier
phase: verify
progress: 138/208
mode: interactive
started: 2026-09-30T00:00:00-07:00
updated: 2026-10-01T03:30:04.547Z
---

## Problem

When Clockwork finishes building a WordPress site, internal QA happens in scattered places: Slack messages, emails, screenshots, Teamwork comments typed from memory. A note like "the button on the services page looks off" has no URL, no element, no breakpoint, and no browser attached. The person fixing it has to rediscover the problem before they can solve it, and nothing tells you at a glance what is still open on a site.

Atarim solves this but is a per-seat, per-site SaaS. It has a documented reliability reputation (Trustpilot 3.8/5, "extremely buggy" Aug 2025), manual re-anchoring when the DOM changes, duplicate-push footguns, and a one-way Teamwork integration. Clockwork wants the same core experience, self-hosted, and shaped around its own Stage 5 QA process.

## Vision

A teammate turns on Feedback mode from the admin bar, right-clicks the misaligned button, picks **Tweak**, types one sentence and hits enter. A numbered pin appears on that button and stays on it through resizes and layout shifts. The developer opens the Teamwork task that was created in the project's QA list, clicks the link, and lands on the same page at the same breakpoint with the pin open. They fix it and complete the task in Teamwork. The next time anyone opens Feedback mode, that pin has turned green. Nobody had to retype, rediscover or reconcile anything.

## Out of Scope

- **Client / guest reviewers.** v1 is for the internal team only. Every reviewer has a WordPress login, so there are no magic links or guest accounts.
- **Non-WordPress sites (Astro/Vercel builds).** v1 is a WordPress plugin. The REST contract is documented so a future standalone overlay could reuse it, but that port is not built here.
- ~~Two-way comment sync with Teamwork.~~ Moved into scope 2026-10-01 (see Decisions).
- **Teamwork webhooks.** These are paid-plan only and unreachable on staging or local sites behind auth. v1 polls with WP-Cron instead.
- ~~Screenshot annotation.~~ Moved into scope 2026-10-01 (see Decisions).
- **Keyboard shortcuts for filing/stepping (B/T/C/N, J/K, R).** Declined by Aaron for now.
- **Re-editing a saved annotation.** v1 stores only the flattened image.
- **Kanban boards, page-approval workflows, AI guidance, email notifications.** Teamwork already owns notifications and boards.
- **Multisite network-level dashboards.** Per-site activation only.

## Principles

- **One fact, one home** (Clockwork Vault rule). WordPress owns *capture and location*. Once an item is pushed, Teamwork owns *task status*, and WordPress mirrors it.
- **Capture is free; describing is the only work.** Every piece of context that can be collected automatically is collected automatically.
- **Invisible unless invited.** The plugin has zero footprint for visitors, for logged-in non-reviewers, and when Feedback mode is off.
- **Reliability over features.** Atarim's biggest complaint is bugginess. A pin that lands on the wrong element is worse than no pin.
- **Degrade, don't lie.** When a pin can't be resolved it is shown as orphaned, never placed somewhere it might be wrong.

## Constraints

- WordPress ≥ 6.5, PHP ≥ 8.1. No Composer runtime dependencies.
- Front-end overlay is vanilla TypeScript built with **bun** (`bun build`). No React, no jQuery dependency, no npm/npx.
- Overlay UI lives inside a Shadow DOM root so theme CSS cannot break it and it cannot break the theme.
- All server access goes through a namespaced REST API (`feedback-collector/v1`) with nonce and capability checks. No admin-ajax.
- Storage is custom tables via `dbDelta`, not a custom post type. This keeps feedback out of search, sitemaps, SEO plugins and content exports.
- The Teamwork API key never leaves the server. Calls use `wp_remote_request`; the key is stored encrypted at rest.
- Teamwork task-list creation must use API **v1** (`POST /projects/{id}/tasklists.json`) because v3 task-lists are GET-only. Task creation, projects, people and tags use **v3**.
- Teamwork rate limit is 150 req/min shared site-wide. All pushes must be queue-friendly and back off on 429.
- Must coexist with Elementor, Beaver Builder and the block editor, and must disable itself inside builder edit iframes.

## Goal

Deliver a deactivatable WordPress plugin, "Feedback Collector". Reviewers with the `fbc_review` capability can right-click (or click-to-pin) any element in Feedback mode to file a typed item (Bug / Tweak / Change Request / Comment) with automatically captured context. Items show as element-anchored pins that survive resizes and layout shifts. They are triaged in a filterable admin list with statuses Open → In Progress → Ready for Review → Resolved, and can be pushed idempotently as tasks into a selected Teamwork project's QA task list, with completion status syncing back.

## Criteria

### Foundation
- [x] ISC-1: `feedback-collector.php` has a valid plugin header (Name "Feedback Collector", Requires at least 6.5, Requires PHP 8.1)
- [x] ISC-2: `php -l` passes on every PHP file
- [x] ISC-3: PHPCS (WordPress standard) reports 0 errors
- [x] ISC-4: Activation creates table `{prefix}fbc_items`
- [x] ISC-5: Activation creates table `{prefix}fbc_comments`
- [x] ISC-6: Option `fbc_db_version` set; mismatch triggers `dbDelta` upgrade
- [x] ISC-7: Activation grants capability `fbc_review` to administrator and editor
- [ ] ISC-8: Settings screen lets an admin grant `fbc_review` to other roles
- [x] ISC-9: All PHP lives under namespace `FeedbackCollector\`
- [x] ISC-10: Activating on WP 6.5 / PHP 8.1 writes nothing to `debug.log`
- [x] ISC-11: Deactivation leaves both tables and their rows intact
- [ ] ISC-12: Uninstall drops tables when `fbc_delete_on_uninstall` = true
- [x] ISC-13: Anti: uninstall with `fbc_delete_on_uninstall` = false deletes any row or table

### Access and footprint
- [x] ISC-14: Anti: logged-out page HTML contains any `fbc-` script or style handle
- [x] ISC-15: Anti: logged-in user without `fbc_review` receives overlay assets
- [x] ISC-16: User with `fbc_review` receives `fbc-overlay` script and style
- [x] ISC-17: Admin bar shows a "Feedback" toggle node for `fbc_review` users
- [x] ISC-18: Anti: any `feedback-collector/v1` route returns 2xx to a user without `fbc_review`
- [x] ISC-19: Anti: plugin adds cookies or cache-control headers to logged-out responses
- [x] ISC-20: Overlay bundle ≤ 60 KB gzipped, excluding the optional screenshot library
- [x] ISC-21: Overlay UI mounts inside a Shadow DOM root
- [DEFERRED-VERIFY] ISC-22: Anti: a hostile theme rule (`* { all: unset }`) changes overlay computed styles

### Feedback mode and capture UX
- [x] ISC-23: Admin bar toggle switches Feedback mode on/off
- [x] ISC-24: Feedback mode state persists per browser across page loads
- [DEFERRED-VERIFY] ISC-25: `Alt+Shift+F` toggles Feedback mode
- [DEFERRED-VERIFY] ISC-26: Anti: the shortcut fires while focus is in an input, textarea or contenteditable
- [x] ISC-27: In Feedback mode, right-click on an element opens a menu with Bug, Tweak, Change Request, Comment
- [DEFERRED-VERIFY] ISC-28: Anti: with Feedback mode off, right-click shows a custom menu
- [DEFERRED-VERIFY] ISC-29: Alt+right-click in Feedback mode shows the native browser menu
- [DEFERRED-VERIFY] ISC-30: Hover in Feedback mode outlines the target element
- [DEFERRED-VERIFY] ISC-31: Toolbar "+ Add" button enters click-to-pin mode (trackpad/touch path)
- [x] ISC-32: "Page note" option creates an item with no element anchor
- [x] ISC-33: Choosing a type opens a composer positioned next to the element
- [x] ISC-34: Composer has Title (required) and Description fields
- [DEFERRED-VERIFY] ISC-35: Composer has Priority (Low/Medium/High/Critical, default Medium)
- [DEFERRED-VERIFY] ISC-36: Composer has optional Assignee picker
- [DEFERRED-VERIFY] ISC-37: Empty title is blocked in the UI
- [DEFERRED-VERIFY] ISC-38: Empty title is rejected by the REST API with 400
- [DEFERRED-VERIFY] ISC-39: Esc closes the composer without creating an item
- [DEFERRED-VERIFY] ISC-40: Anti: in click-to-pin mode, clicking a link navigates away

### Auto-captured context (each stored per item)
- [DEFERRED-VERIFY] ISC-41: Page path relative to `home_url()`
- [DEFERRED-VERIFY] ISC-42: Query string
- [DEFERRED-VERIFY] ISC-43: Page title
- [x] ISC-44: CSS selector of target element
- [DEFERRED-VERIFY] ISC-45: XPath of target element
- [x] ISC-46: Text snippet of target element (≤ 120 chars)
- [x] ISC-47: Tag name of target element
- [DEFERRED-VERIFY] ISC-48: Click offset as ratio within the element bounding box
- [DEFERRED-VERIFY] ISC-49: Document coordinates as last-resort fallback
- [x] ISC-50: Viewport width and height
- [x] ISC-51: Breakpoint label (mobile < 768, tablet 768–1024, desktop > 1024)
- [DEFERRED-VERIFY] ISC-52: Device pixel ratio
- [x] ISC-53: Browser name and version parsed from user agent
- [x] ISC-54: OS parsed from user agent
- [DEFERRED-VERIFY] ISC-55: Reporter user ID
- [DEFERRED-VERIFY] ISC-56: `created_at` in UTC
- [DEFERRED-VERIFY] ISC-57: Last ≤ 20 JS errors since page load (`window.onerror` + `unhandledrejection`)
- [x] ISC-58: Queried object post ID and post type
- [DEFERRED-VERIFY] ISC-59: Active theme slug
- [DEFERRED-VERIFY] ISC-60: Anti: captured payload contains any form field value or password input content

### Anchoring and pins
- [x] ISC-61: Existing items render as pins on their element on page load
- [x] ISC-62: Pins are numbered by item ID sequence on the site
- [DEFERRED-VERIFY] ISC-63: Pin color encodes type (4 distinct colors)
- [DEFERRED-VERIFY] ISC-64: Pin style encodes status (Resolved = green check)
- [DEFERRED-VERIFY] ISC-65: Resolved pins hidden by default; "Show resolved" toggle reveals them
- [DEFERRED-VERIFY] ISC-66: Anti: pins are visible when Feedback mode is off
- [DEFERRED-VERIFY] ISC-67: Pins reposition after window resize within one animation frame
- [x] ISC-68: Pins follow their element after a layout shift (late-loading image above it)
- [x] ISC-69: Pins inside a sticky/fixed header stay attached while scrolling
- [x] ISC-70: Resolver tries id → selector → XPath → text-snippet → coordinates, in that order
- [x] ISC-71: Selector generator skips auto-generated/random IDs (fixture tests)
- [x] ISC-72: Selector generator prefers stable builder attributes (e.g. Elementor `data-id`)
- [x] ISC-73: Pin for an element hidden at the current breakpoint is not drawn
- [x] ISC-74: Sidebar shows "N items at other breakpoints" when any are hidden
- [x] ISC-75: Unresolvable items are flagged orphaned, never drawn at a guessed spot
- [DEFERRED-VERIFY] ISC-76: "Re-anchor" lets a reviewer click a new element and saves the new anchor
- [x] ISC-77: Clicking a pin opens the item popover
- [x] ISC-78: `bun test` anchor-resolver suite has ≥ 15 fixtures, all passing
- [x] ISC-79: Anti: pins from a different page path render on the current page
- [DEFERRED-VERIFY] ISC-80: Repositioning 50 pins takes < 16 ms (performance.now probe)

### Sidebar
- [x] ISC-81: Sidebar lists items for the current page
- [DEFERRED-VERIFY] ISC-82: Scope switch: this page / all pages
- [DEFERRED-VERIFY] ISC-83: Filter by type
- [DEFERRED-VERIFY] ISC-84: Filter by status
- [DEFERRED-VERIFY] ISC-85: "Assigned to me" filter
- [DEFERRED-VERIFY] ISC-86: Clicking a list item scrolls to its pin and pulses it
- [x] ISC-87: Orphaned items appear in their own section with a Re-anchor action

### Item thread and status
- [x] ISC-88: Status enum is exactly Open, In Progress, Ready for Review, Resolved
- [x] ISC-89: Anti: REST accepts a status outside the enum (expect 400)
- [x] ISC-90: Status change from the popover persists via REST
- [x] ISC-91: Assignee picker lists only users with `fbc_review`
- [x] ISC-92: Replies are stored as threaded comments per item
- [x] ISC-93: Status and assignee changes are logged as activity entries (who, when, from → to)
- [x] ISC-94: Delete is allowed only for the reporter or an administrator

### REST API and security
- [x] ISC-95: Routes registered under `feedback-collector/v1`
- [x] ISC-96: `GET /items?page_path=` returns only items for that path
- [x] ISC-97: `POST /items` returns 201 with the new ID
- [x] ISC-98: `PATCH /items/{id}` updates title, description, status, priority, assignee
- [x] ISC-99: `DELETE /items/{id}` enforces ISC-94
- [x] ISC-100: `POST /items/{id}/comments` creates a reply
- [x] ISC-101: Anti: a write route succeeds without a valid `wp_rest` nonce
- [x] ISC-102: Description sanitized with `wp_kses_post`; text fields with `sanitize_text_field`
- [DEFERRED-VERIFY] ISC-103: Anti: a `<script>` in a description executes in the popover
- [x] ISC-104: Anti: a `<script>` in a description executes in admin screens
- [x] ISC-105: Every SQL query with input uses `$wpdb->prepare` (PHPCS DirectDatabaseQuery sniff clean)
- [x] ISC-106: REST contract documented in `docs/rest-api.md`

### Admin
- [x] ISC-107: Top-level "Feedback" admin menu with an Open-count badge
- [x] ISC-108: List table columns: #, Title, Type, Status, Priority, Assignee, Page, Reporter, Created, Teamwork
- [x] ISC-109: Filter by type
- [x] ISC-110: Filter by status
- [x] ISC-111: Filter by assignee
- [x] ISC-112: Filter by page
- [x] ISC-113: Search across title and description
- [x] ISC-114: Sort by created date and by priority
- [x] ISC-115: Pagination at 20 per page
- [ ] ISC-116: Bulk action: change status
- [ ] ISC-117: Bulk action: push to Teamwork
- [x] ISC-118: Detail screen shows every captured context field
- [x] ISC-119: "View on page" opens `?fbc_item={id}`, enables Feedback mode, scrolls to the pin and opens it
- [DEFERRED-VERIFY] ISC-120: View-on-page shows a banner when the current breakpoint differs from the captured one
- [ ] ISC-121: CSV export of the current filtered list

### Teamwork integration
- [x] ISC-122: Settings fields: Teamwork site URL and API key
- [ ] ISC-123: "Test connection" calls `GET /projects/api/v3/me.json` and shows the user name on success
- [x] ISC-124: API key saved from Settings, stored encrypted in the DB (libsodium); `FBC_TEAMWORK_API_KEY` in wp-config is an optional override
- [x] ISC-125: Anti: the API key appears in any front-end HTML, JS or REST response
- [ ] ISC-126: Project dropdown lists all active projects (v3, loops while `meta.page.hasMore`)
- [ ] ISC-127: Selected project ID persists in site options
- [ ] ISC-128: "Create QA list" calls v1 `POST /projects/{id}/tasklists.json`, named "QA – Round N – YYYY-MM-DD"
- [ ] ISC-129: Returned `TASKLISTID` is stored as the active QA list
- [ ] ISC-130: Option to pick an existing task list instead of creating one
- [DEFERRED-VERIFY] ISC-131: Push creates a v3 task in the active QA list
- [x] ISC-132: Task name format is `[Type] Title`
- [x] ISC-133: Task description (HTML) includes description, deep link to the pin, page URL, breakpoint and viewport, browser and OS, selector, reporter, JS errors
- [DEFERRED-VERIFY] ISC-134: Task tagged with its type (tag created if missing, IDs cached)
- [DEFERRED-VERIFY] ISC-135: Priority mapped: Critical/High → high, Medium → medium, Low → low
- [DEFERRED-VERIFY] ISC-136: Assignee mapped by matching email against project people; unmatched → unassigned with a note
- [DEFERRED-VERIFY] ISC-137: Teamwork task ID and URL stored on the item and linked in admin
- [x] ISC-138: Anti: pushing an already-pushed item creates a second Teamwork task
- [x] ISC-139: API failure marks the item `sync_error` with the message, and a Retry action exists
- [x] ISC-140: On 429, pushes back off until `X-Rate-Limit-Reset`; a 100-item bulk push completes with no item lost
- [ ] ISC-141: "Auto-push new items" setting (default off) pushes on creation
- [ ] ISC-142: WP-Cron job every 15 min polls the QA list with `updatedAfter`; completed tasks → Resolved
- [DEFERRED-VERIFY] ISC-143: Reopened tasks in Teamwork → Open in WordPress
- [x] ISC-144: Anti: sync-back changes the status of an item that was never pushed

### Compatibility and experience
- [ ] ISC-145: [DROPPED — see Decisions 2026-09-30, staging-only]
- [x] ISC-146: Anti: overlay loads inside Elementor or Beaver Builder edit iframes
- [DEFERRED-VERIFY] ISC-147: Works on one block theme and one classic theme (live probe)
- [DEFERRED-VERIFY] ISC-148: Antecedent: with Feedback mode on, filing an item takes ≤ 3 interactions plus typing (right-click → type → Enter)
- [DEFERRED-VERIFY] ISC-149: Antecedent: from a Teamwork task, the developer reaches the open pin in one click

### Optional — screenshots (feature-flagged, stretch)
- [ ] ISC-150: "Capture screenshot" setting exists, default off
- [ ] ISC-151: When on, an element-area screenshot is stored under `uploads/fbc/` (not the Media Library)
- [ ] ISC-152: Screenshot attached to the Teamwork task via the presigned `pendingfiles` flow
- [ ] ISC-153: Anti: screenshot library is loaded when the setting is off

### Added after advisor review
- [x] ISC-154: A logged-out click on a `?fbc_item=` deep link redirects to wp-login with `redirect_to`, then returns to the open pin

### Added after Aaron's decisions (2026-09-30)
- [ ] ISC-155: "Sync now" button in admin runs the Teamwork status poll immediately and reports how many items changed
- [x] ISC-156: Plugins screen shows a warning on the Feedback Collector row with the count of open items not yet pushed to Teamwork (staging-only removal safeguard)

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| 1–3, 9 | static | header grep, lint, PHPCS | 0 errors | Bash (`php -l`, `phpcs --standard=WordPress`) |
| 4–8, 10–13 | lifecycle | activate/deactivate/uninstall, inspect tables, caps, debug.log | exact match | wp-cli on staging (`wp plugin activate`, `wp db query`, `wp cap list`) |
| 14–19 | footprint | fetch page as logged-out, non-reviewer and reviewer; grep handles and headers | 0 matches for anti | `curl -i` with and without auth cookie |
| 20 | perf | gzip size of `dist/overlay.js` | ≤ 60 KB | `bun build` + `gzip -c \| wc -c` |
| 21–22, 23–40 | UI | scripted flows on a staging page | each step passes | Interceptor (real Chrome) |
| 41–60 | data | file one item, read the row back | every field non-empty and correct; anti: no form values | Interceptor + `wp db query` |
| 61–69, 73–77 | UI | resize, inject layout shift, sticky header, hidden-at-breakpoint fixtures | pin within 4 px of target | Interceptor screenshots + DOM rect probe |
| 70–72, 78 | unit | anchor generator and resolver fixtures (Elementor, BB, Gutenberg, random IDs) | 100% pass, ≥ 15 fixtures | `bun test` with happy-dom |
| 79–80 | unit/perf | cross-page filter; 50-pin benchmark | 0 leaks; < 16 ms | `bun test` |
| 81–94 | UI + API | sidebar filters, status and thread round-trips | persisted value matches | Interceptor + `curl` |
| 95–105 | API/security | call every route with no cookie, wrong nonce, bad enum, XSS payload | 401/403/400; no script execution | `curl -i`, Interceptor console |
| 106 | docs | file exists and lists every route | all routes present | Read |
| 107–121 | admin UI | each filter, sort, bulk action, export, view-on-page | expected rows/state | Interceptor + CSV diff |
| 122–144 | integration | against a sandbox Teamwork project: create list, push, re-push, force errors, bulk 100, complete/reopen in Teamwork, run cron | IDs stored; no duplicates; statuses mirrored | `curl` to Teamwork API + `wp cron event run fbc_sync` |
| 145 | migration | `wp search-replace` to a new domain, reload pins | all resolve | wp-cli + Interceptor |
| 146–147 | compat | Elementor and BB editors; Twenty Twenty-Five + Blocksy | anti holds; pins correct | Interceptor |
| 148–149 | experiential | timed scripted flow; click link in pushed task | ≤ 3 interactions; 1 click | Interceptor RecordFlow |
| 150–153 | optional | toggle setting, inspect network and uploads | as stated | Interceptor + `ls uploads/fbc` |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| F1 Foundation | Plugin bootstrap, tables, caps, settings shell, uninstall, bun build pipeline, README | ISC-1–13 | — | no |
| F2 REST API | Items/comments routes, validation, sanitization, permissions, docs | ISC-18, 38, 89, 94–106 | F1 | yes (with F3, F4) |
| F3 Anchor engine | Selector/XPath/text generator and resolver, orphan detection, fixture tests | ISC-70–72, 75, 78–80 | F1 build pipeline | yes |
| F4 Overlay shell | Shadow DOM mount, Feedback mode toggle, shortcut, enqueue gating, builder-iframe guard | ISC-14–17, 19–26, 66, 146 | F1 | yes |
| F5 Capture flow | Context menu, click-to-pin, page note, composer, auto-captured context | ISC-27–60 | F2, F3, F4 | no |
| F6 Pins and sidebar | Pin rendering and repositioning, breakpoint visibility, popover, thread, sidebar filters, re-anchor | ISC-61–69, 73–77, 81–93 | F5 | no |
| F7 Admin | List table, filters, bulk actions, detail screen, view-on-page, CSV | ISC-107–121 | F2 | yes (with F6) |
| F8 Teamwork | Settings, encrypted key, project/list picker, push queue, idempotency, backoff, cron sync-back | ISC-122–144 | F2, F7 | no |
| F9 Hardening | Domain-migration test, theme compat, experiential flows, full Interceptor pass | ISC-145, 147–149 | F6, F8 | no |
| F10 Screenshots (optional) | Feature-flagged element screenshot + Teamwork attach | ISC-150–153 | F8 | yes |

Build order: F1 → (F2 ∥ F3 ∥ F4) → F5 → (F6 ∥ F7) → F8 → F9 → F10 optional.

**Shippable milestones** (each one is usable on its own):
- **M1 — Core QA loop (no Teamwork):** F1–F7. Capture, pins, sidebar, statuses, admin list. Excludes ISC-121 CSV and ISC-57 JS errors unless approved.
- **M2 — Teamwork push:** F8 minus sync-back. Settings, project picker, Create QA list, push, idempotency, backoff (ISC-122–140, 154). ISC-141 auto-push pending approval.
- **M3 — Sync-back and hardening (approved):** ISC-142–144, 155, F9.
- **M4 — Screenshots (optional):** F10.

## Decisions

- 2026-09-30: **Custom tables over a custom post type.** A CPT gives a free admin list, but feedback items then leak into search, sitemaps, SEO plugin screens, WXR exports and content-sync tools, and page-path filtering becomes slow meta queries. Two small tables (`fbc_items`, `fbc_comments`) are cleaner and portable.
- 2026-09-30: **Right-click is gated behind Feedback mode.** Hijacking right-click globally breaks copy/paste and Inspect for the whole team. Alt+right-click always passes through to the native menu.
- 2026-09-30: **Click-to-pin added alongside right-click** (from IterativeDepth constraint-inversion lens). Trackpads and touch devices have no reliable right-click.
- 2026-09-30: **Teamwork owns task status after a push** (from ApertureOscillation synthesis plus the Vault's "one fact, one home" rule). WordPress keeps status for unpushed items and mirrors Teamwork's completed/reopened state for pushed ones.
- 2026-09-30: **API-key auth, not OAuth.** OAuth needs a registered redirect URI and client secret per install, which is awkward for a self-hosted agency plugin. API key (Basic `key:x`) acts as the agency user and is stored encrypted.
- 2026-09-30: **Polling instead of webhooks for sync-back.** Teamwork webhooks are paid-plan only, and staging sites behind auth can't receive them. A WP-Cron poll with `updatedAfter` every 15 min stays well under 150 req/min.
- 2026-09-30: **Idempotent push is a hard requirement.** Atarim documents duplicate cards when auto-push and workflow push overlap, so the stored Teamwork task ID blocks re-creation.
- 2026-09-30: **Orphaned over guessed.** When no anchor strategy resolves, the item goes to an Orphaned list with Re-anchor rather than being drawn at stale coordinates. Atarim's re-anchor is also manual, but it gives no orphan signal.
- 2026-09-30: **Overlay as a standalone TS bundle with a documented REST contract.** This keeps a future Astro/non-WP port possible without building it now.
- 2026-09-30: **Teamwork key hygiene** (advisor). Encrypting with `AUTH_KEY` gives little protection, because anyone with server access can read both values, and it breaks when salts differ or rotate. Prefer a wp-config constant. Recommend a dedicated low-privilege Teamwork "QA bot" user added only to the relevant projects, not a personal admin key.
- 2026-09-30: **refined:** Scope additions not requested by Aaron (cron sync-back, CSV export, auto-push, JS error capture) are marked pending approval rather than committed to v1.
- 2026-09-30: **Aaron's decisions.** (1) Sync-back is approved: completing a task in Teamwork marks the WP item Resolved (ISC-142–144, plus a "Sync now" button, ISC-155). M3 is in scope. (2) Use a dedicated QA bot Teamwork user, with the key set as `FBC_TEAMWORK_API_KEY` in wp-config. (3) The plugin runs on staging only and is removed before go-live, so ISC-145 (domain migration) is dropped. ISC-156 adds a warning before removal while unpushed items remain.
- 2026-10-01: **refined:** Aaron wants the API key entered in the WordPress admin and stored in the DB, with no SSH or wp-config editing. The DB path (encrypted with libsodium, keyed from the auth salt) is now the primary flow, and the wp-config constant is an optional override. Settings detects an undecryptable key after a salt change and asks for it again.
- 2026-10-01: **Renamed to "Clockwork Feedback Collector" and made white-labelable,** with the Clockwork Companion look and feel per Aaron. Only the display name changed: the folder, file, text domain and REST namespace stay `feedback-collector`, so the plugin didn't deactivate and no identifier carries a brand. The Companion CSS was ported under `.fbc-*` names, not copied as-is: its `.notice{display:none}` would hide every save and Teamwork message, and its `:root` palette would override white-label colors. Companion also loads that CSS on any screen hook containing "clockwork", so Collector dequeues it at priority 100. The list table went from 11 columns to 7 after Aaron flagged it as crowded.
- 2026-10-01: **Mistake:** the mocked-Teamwork test script TRUNCATEd the feedback tables and left fake Teamwork settings on the shared test site, destroying items #35/#36 from the Chrome pass. The site was reset to empty and the script now records the high-water mark and the settings and restores both on shutdown, deleting only the rows it created.
- 2026-10-01: **Assignees from Teamwork by default** (Aaron). Picking the Teamwork person directly replaces silent email matching. After a push the assignee is read-only in WordPress, the same "Teamwork owns it" rule as status. The `taskOptions.notify` field name came from Teamwork's API conventions and isn't in the public docs; confirm it during the live round trip.
- 2026-10-01: **Mistake caught by tests:** phpcbf's `WordPress.WP.CapitalPDangit` auto-fix rewrote the identifier string 'wordpress' to 'WordPress', which broke the assignee source. The sniff is now excluded in phpcs.xml.dist.
- 2026-10-01: **refined:** Aaron approved screenshots, annotation (Fabric.js, MIT, chosen over marker.js linkware for white-label), QA rounds, breakpoint preview, two-way Teamwork comments and @mentions. He declined shortcuts; digest, lazy-content retry, pre-launch checklist and CSV are still unanswered. Build order: rounds, then screenshots, then annotation, then breakpoint preview, then comments and mentions after the live Teamwork test.
- 2026-09-30: **Delegation floor met:** two background research agents (Atarim features, Teamwork API). Forge is deferred to BUILD, where it auto-includes for E4 coding.

## Changelog

- **conjectured:** WordPress should be the single system of record for item status, with Teamwork as a mirror.
  **refuted by:** Clockwork Vault doctrine ("tasks/time → Teamwork… one fact, one home") and Atarim's documented sync confusion.
  **learned:** Capture and location belong in WordPress; task lifecycle belongs in Teamwork once pushed.
  **criterion now:** ISC-142, ISC-143, ISC-144.
- **conjectured:** Right-click is the one input for filing feedback.
  **refuted by:** IterativeDepth constraint-inversion lens, since touch and trackpad users have no dependable right-click, and Atarim itself uses click-in-comment-mode.
  **learned:** Right-click is the fast path; click-to-pin is the universal path.
  **criterion now:** ISC-31.

## Verification

Test site: local WordPress 7.1.2 on PHP 8.4 / MySQL 26.7 at `http://localhost:8899` (`~/Herd/fbc-test`, plugin symlinked from this repo). 2026-09-30.

- ISC-1, 2, 9: file read; `php -l` on every PHP file → no syntax errors; all classes under `FeedbackCollector\`.
- ISC-3, 105: `phpcs` (WordPress standard, `phpcs.xml.dist`) exits 0 with no output. Every query with input uses `$wpdb->prepare`, and table names use `%i`.
- ISC-4–7, 10: `wp plugin activate` → `wp_fbc_items` and `wp_fbc_comments` exist, `fbc_db_version` = 2 (upgraded 1→2 by dbDelta adding `tw_project_id`), `fbc_review` granted to administrator and editor. No `debug.log` was created with WP_DEBUG_LOG on.
- ISC-11: rows before and after deactivation = 34 / 34.
- ISC-13: `uninstall.php` included with `WP_UNINSTALL_PLUGIN` and the option off → 2 tables remain. (Never run `wp plugin uninstall` here: the plugin dir is a symlink to the source.)
- ISC-14, 19: logged-out page has no plugin output (the one `fbc-` grep hit is the sample page's own `fbc-test.test` link) and no Set-Cookie or Cache-Control headers.
- ISC-15: subscriber page → 0 `fbc-overlay` / `fbcConfig` / `fbc-early` matches.
- ISC-16, 17: admin page has the `fbc-overlay-js` script, the `fbc-early-errors` inline script and the `wp-admin-bar-fbc-toggle` node. CSS ships inside the bundle and is injected into the shadow root.
- ISC-18, 101: anonymous → 401; subscriber → 403; admin cookie without nonce → 401 `fbc_forbidden`; with nonce → 200.
- ISC-20: `dist/overlay.js` 39.7 KB minified, **12.8 KB gzipped**.
- ISC-70–72, 75, 78: `bun test` → 42 pass / 0 fail (120 expects), including the positional-drift fix and the edited-text keep-positional case; `tsc --noEmit` clean.
- ISC-79: `GET /items?page_path=/sample-page/` → 1 item; `/other/` → 0.
- ISC-88, 89: PATCH `status=done` → 400; valid status → 200.
- ISC-91: assigning a subscriber → 400; an editor → 200.
- ISC-92, 93: comment → 201; status and assignee changes add activity entries (thread count 2 after one PATCH).
- ISC-94, 99: editor deleting admin's item → 403; editor deleting own → 200; admin → 200; missing → 404.
- ISC-95–98, 100: REST smoke (`rest-smoke.php`): create 201; empty title / bad type → 400.
- ISC-102, 104: `<script>` stripped by `sanitize_text_field` / `sanitize_textarea_field` (stored "Line1"). Admin output is escaped and PHPCS's escaping sniffs are clean.
- ISC-106: `docs/rest-api.md` lists every route.
- ISC-107–115, 118: admin list → badge 32 (= open count); all 11 columns. Filters: type=bug 0, status=resolved 1, assignee=unassigned 30, page=/services/ 33. Search "Bulk item 3" → 2. Priority sort renders. Detail screen shows Captured context, View on page, Open task #9001, Breakpoint row.
- ISC-122, 125, 131–140, 143, 144: mocked Teamwork API via `pre_http_request` (`tw-mock-test.php`). 28 checks pass:
  - Push and payload: `[Tweak] …` name, HTML with escaped user HTML, deep link, breakpoint/browser/selector/JS errors, critical→high, type tag created and cached, assignee matched by email case-insensitively, Basic `key:x`.
  - Idempotent re-push.
  - A 30-item bulk push hitting 429 after 5 creates stops, reschedules about 30 s out, then finishes with 31 unique tasks and 31 creates.
  - A 400 marks `error` with the message, and Retry succeeds.
  - Completed → Resolved, attributed to "Teamwork"; reopened → Open; unpushed resolved item untouched.
  - v1 task-list create returns TASKLISTID.
  - API key absent from the REST item shape and from the front-end config.
- ISC-146: `?elementor-preview=2` as admin → 0 overlay matches.
- ISC-154: logged-out `?fbc_item=1` → 302 to `wp-login.php?redirect_to=…fbc_item%3D1`.
- ISC-156: Plugins screen shows "1 unresolved feedback item has not been pushed to Teamwork."
- **DEFERRED-VERIFY (follow-up FBC-BROWSER-1):** every overlay-interaction ISC (21–69 UI parts, 73–77, 80–87, 90, 103, 119–120, 147–149). The real-Chrome pass is blocked because the Interceptor extension isn't connected to its daemon ("no extensions connected" after restarting a stale daemon). It needs a reload at `chrome://extensions`.
- **Not yet verified, no live credentials:** ISC-123 (Test connection), 124 (encrypted-option fallback round trip), 126–130 (settings UI against real Teamwork), 141 (auto-push), 142 (cron schedule registers once credentials exist), 155 (Sync now over HTTP). These need a QA-bot API key and a sandbox project.
- **Not built (pending approval):** ISC-121 CSV export. ISC-57 (JS error capture) and ISC-141 (auto-push, default off) were built; say if you'd rather they go.
- **Real-Chrome pass (FBC-BROWSER-1), 2026-10-01**, using Interceptor 1.0.19 against `localhost:8899` with pretty permalinks, logged in as admin. Interceptor's screenshots don't render the Shadow-DOM overlay, so evidence is DOM state and geometry from the live tab.
  - ISC-16, 17, 21: the overlay host mounts on `<body>`, fixed and full-viewport, z-index 2147483000; `fbcConfig.pagePath` = `/sample-page/`.
  - ISC-23, 24: the admin-bar toggle turns the toolbar on and sets `fbc:mode` = 1; the toggle's background is `rgb(34,113,177)` after the late-inline-CSS fix.
  - ISC-27: a trusted right-click on a link opens the menu with Bug, Tweak, Change Request, Comment and "Note for the whole page".
  - ISC-32: a toolbar Page note saved #36 with `anchor` NULL.
  - ISC-33, 34: the composer opens next to the element, and Title plus Description submit.
  - ISC-44, 46, 47, 50, 51, 53, 54, 58: row #35 stores tag `a`, text "your dashboard", viewport 1651, desktop, Chrome 154, post 2. OS is "macOS 26.7" via UA Client Hints, a fix for Chrome's frozen "10.15.7".
  - ISC-61, 62: pin "35" renders, with its tip at (1001,949) inside the link box 925–1079 × 935–965 (the click was at 1002,950).
  - ISC-68, 69: after inserting a 240 px banner above it, the pin stays inside the link; after scrolling 300 px it still does; after inserting a same-tag decoy sibling, it still does.
  - ISC-73, 74: with the link at display:none the pin is removed and the sidebar shows "1 at other breakpoints"; once shown again it moves back under "On this page".
  - ISC-75, 87: a fake-anchor item is listed under "Orphaned — element not found".
  - ISC-77, 90: clicking the pin opens the popover; status → Ready for Review persists and logs "changed status from Open to Ready for Review"; Esc closes it.
  - ISC-81: the sidebar lists this page's items.
  - ISC-119: `?fbc_item=35` with Feedback mode off turns the mode on, scrolls (scrollY 371), opens #35's popover, pulses the pin and strips the param from the URL.

### Rebrand + white-label (2026-10-01)
- [x] ISC-157: Plugin header Name is "Clockwork Feedback Collector", Author "Clockwork Web Dev"; version 0.2.0
- [x] ISC-158: Admin screens use the Companion-style chrome (header band + logo + label + version, tab strip, cards, pills) under `.fbc-admin` names
- [x] ISC-159: Anti: Clockwork Companion's `clockwork-companion-admin` stylesheet loads on any Feedback Collector screen (including a menu label containing "Clockwork")
- [x] ISC-160: Anti: WordPress notices are hidden on Feedback Collector screens (Companion's `.notice{display:none}` not ported)
- [x] ISC-161: Branding screen saves name, header label, menu label, author, author URL, logo, 3 colors, credit toggle; Reset restores defaults
- [x] ISC-162: Invalid hex colors fall back to defaults (`sanitize_hex_color`)
- [x] ISC-163: Text on brand colors is chosen by luminance (light primary → near-black text)
- [x] ISC-164: Links/tabs use a primary darkened to ≥ 4.5:1 on white
- [x] ISC-165: Plugins screen shows the white-label name and author; the default name disappears
- [x] ISC-166: Menu label, page titles, admin-bar toggle and overlay toolbar/sidebar use the brand
- [x] ISC-167: Menu icon is the Clockwork sparkle on the default brand and a neutral bubble when white-labeled
- [x] ISC-168: Teamwork task body and task-list description use the brand name
- [x] ISC-169: List table is 7 columns (title + meta line, no striping); no pill overflows its column at 1,450px

### Teamwork email + assignees (2026-10-01)
- [x] ISC-170: Global "Email notifications" setting (default on) sends `taskOptions.notify` true/false on task create
- [x] ISC-171: Anti: the first Settings save, before the Teamwork options render, turns emails off
- [x] ISC-172: "Assign feedback to" setting: Teamwork project members (default) or WordPress users, falling back to WordPress while Teamwork isn't connected
- [x] ISC-173: Teamwork mode lists project people (sorted), stores tw_assignee_id/name, and assigns that person on push with no email matching
- [x] ISC-174: Anti: a person not on the project, or a Teamwork ID in WordPress mode, is accepted (expect 400)
- [x] ISC-175: Anti: changing a pushed item's assignee in WordPress (Teamwork mode) succeeds (expect 400; UI read-only)
- [x] ISC-176: The "Assigned to me" filter and list filter match the Teamwork person matched to the current user by email
- [x] ISC-177: WordPress integration suites live in tests/wp, run with `bun run test:wp`, and are non-destructive

### Draggable toolbar (2026-10-01)
- [x] ISC-178: The toolbar drags from its grip or logo and snaps to the nearest corner on release; a dashed ghost previews the target
- [x] ISC-179: The chosen corner persists per browser (`fbc:corner`) and is restored on the next load
- [x] ISC-180: Anti: the toolbar overlaps the WordPress admin bar, at rest or mid-drag (measured live: 32px desktop, 46px mobile, scrolled-away mobile)
- [x] ISC-181: The sidebar, hints, banner and popovers stay below the admin bar; toasts sit on the edge opposite the toolbar
- [x] ISC-182: A right-corner toolbar slides left when the sidebar opens, so the sidebar never covers it
- [x] ISC-183: Arrow keys on the grip move between corners; motion respects prefers-reduced-motion

### Phase R: QA rounds
- [x] ISC-184: Items store a `round` (existing items backfilled to 1); new items get the current round
- [x] ISC-185: The current round lives in its own option, used by both the "Create QA list" and "Start next round" flows (one counter)
- [x] ISC-186: "Start Round N+1" works without Teamwork; with Teamwork it also creates and activates "QA – Round N+1"
- [x] ISC-187: Push routes each item to its own round's task list (round → list map), not the latest list
- [x] ISC-188: The admin list and sidebar filter by round; the admin header shows the current round and a per-round summary

### Phase S: Screenshots
- [x] ISC-189: Capture happens at right-click time, with the overlay hidden and a pin marker drawn on the image at the click point
- [x] ISC-190: The screenshot uploads in the same multipart POST /items request; JPEG/WebP, ≤ 1600px wide, ≤ ~1MB
- [x] ISC-191: The server validates a real image, caps the size, uses random filenames in uploads/fbc-screenshots with index.php, and deletes the file with its item and on uninstall
- [x] ISC-192: Anti: input/textarea values appear in the screenshot (masked in the clone; amends ISC-60)
- [x] ISC-193: The capture library loads only when needed (separate dist/capture.js)
- [DEFERRED-VERIFY] ISC-194: The screenshot shows in the popover and the admin detail screen, and attaches to the Teamwork task via pendingFiles at create

### Phase A: Annotation
- [x] ISC-195: The annotator (Fabric.js, separate dist/annotator.js) opens on the captured image: arrow, box, highlight, pen, text, blur, undo, color
- [x] ISC-196: Saving flattens to the stored screenshot; Fabric's text input works inside the shadow root (Esc/click-outside don't close mid-typing)

### Phase B: Breakpoint preview
- [x] ISC-197: A device preview (phone/tablet/desktop) shows the page in a same-origin iframe; the overlay runs inside (window.name flag) and the parent's toolbar and pins pause
- [x] ISC-198: Items filed in the preview record the frame's width and breakpoint; there's a breakpoint filter in the sidebar and admin

### Phase C/M: Comments + mentions (after live Teamwork test)
- [ ] ISC-199: WordPress replies post to the Teamwork task ("From {name} via …"); Teamwork comments sync onto the item; dedupe by tw_comment_id
- [ ] ISC-200: @mentions autocomplete from the assignee source, are stored as tokens and rendered as text nodes; mentioned people are notified
- **Screenshots, 2026-10-01 (real Chrome):** right-click → capture took ~1.1s, producing a 1600×891 JPEG (85–89KB) with no overlay and no admin bar. SnapDOM's 'viewport' clip came out shifted by WP's 32px html margin; it's now an explicit page rect plus body offset, and the marker lands on the clicked link (verified from the saved file). 21 WP checks: validation, random names, index.php, multipart create, stored before fbc_item_created, bad image keeps the item, not-an-upload refused, replace/delete endpoints, file deleted with item, Teamwork pendingFiles (mock). ISC-194: display verified in the admin; Teamwork attachment verified against the mock only, pending the live test.
- **Annotation, 2026-10-01 (real Chrome):** Composer → Annotate opened the Fabric editor (93KB gz, lazy). In the saved upload: arrow, box, blur (pixelated patch over the heading), highlight; full 1600×891. Text tool: hidden textarea mounted inside the shadow root; Esc while typing exited text editing without closing the editor or composer. Fabric 7's center-origin default first misplaced the background; fixed with top-left `FabricObject.ownDefaults`.
- **Device preview, 2026-10-01 (real Chrome):** Devices → phone frame: innerWidth 390/innerHeight 844 (scaled to fit), admin bar hidden in the frame, overlay running inside (window.name + same-origin check), the parent's toolbar and pins paused. Filing inside saved #581: breakpoint mobile, viewport 390, preview "Phone 390×844", with a 390×844 screenshot and the marker on the link. Closing restores and reloads. Framing headers: Pressable none, SpinupWP SAMEORIGIN (OK); a DENY host gets the "Open in a window" fallback.

### Polish round (2026-10-01)
- [x] ISC-201: The right-clicked element stays outlined (locked) through the menu and composer, follows scroll, and clears on cancel/save (boot test)
- [x] ISC-202: The Teamwork task description leads with the full page URL as visible link text (mock test)
- [x] ISC-203: Settings → "Remove all data" (type DELETE) purges tables, options, fbc_tw_* transients, cron hooks, the fbc_review cap and the screenshots folder, then deactivates; uninstall uses the same Cleanup::purge(). Verified on the real test site: 0 tables, 0 options or transients, 0 cron, 0 cap, folder gone; then restored from backup.
- [x] ISC-204: When Teamwork is preferred but not connected, the assignee pickers say so (composer hint + admin link)
- [x] ISC-205: Device preview is three icon buttons (Mobile 390 / Tablet 820 / Desktop 1440) on the toolbar and in the preview switcher (Chrome: frame widths 820 → 1440 → 390)
- [x] ISC-206: Anti: a test suite contacts a real Teamwork account (rest.php now blocks HTTP and forces WordPress-user assignees)
- [x] ISC-207: Desktop is never framed: the Desktop icon shows the current page (active on the toolbar) and closes any preview; only Mobile and Tablet open the device frame (Chrome-verified)
- [x] ISC-208: Anti: the parent toolbar or pins show through the device preview (`[hidden]` now beats component display rules; computed display none)
