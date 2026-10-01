---
task: "Plan v1 of Feedback Collector WordPress QA plugin"
project: feedback-collector-wp
effort: E4
effort_source: classifier
phase: build
progress: 0/155
mode: interactive
started: 2026-09-30T00:00:00-07:00
updated: 2026-09-30T00:00:00-07:00
---

## Problem

When Clockwork finishes building a WordPress site, internal QA happens in scattered places: Slack messages, emails, screenshots, Teamwork comments typed from memory. A note like "the button on the services page looks off" has no URL, no element, no breakpoint, and no browser attached. The person fixing it has to rediscover the problem before they can solve it, and nothing tells you at a glance what is still open on a site.

Atarim solves this but is a per-seat, per-site SaaS. It has a documented reliability reputation (Trustpilot 3.8/5, "extremely buggy" Aug 2025), manual re-anchoring when the DOM changes, duplicate-push footguns, and a one-way Teamwork integration. Clockwork wants the same core experience, self-hosted, and shaped around its own Stage 5 QA process.

## Vision

A teammate turns on Feedback mode from the admin bar, right-clicks the misaligned button, picks **Tweak**, types one sentence and hits enter. A numbered pin appears on that button and stays on it through resizes and layout shifts. The developer opens the Teamwork task that was created in the project's QA list, clicks the link, and lands on the same page at the same breakpoint with the pin open. They fix it and complete the task in Teamwork. The next time anyone opens Feedback mode, that pin has turned green. Nobody had to retype, rediscover or reconcile anything.

## Out of Scope

- **Client / guest reviewers.** v1 is for the internal team only. Every reviewer has a WordPress login, so there are no magic links or guest accounts.
- **Non-WordPress sites (Astro/Vercel builds).** v1 is a WordPress plugin. The REST contract is documented so a future standalone overlay could reuse it, but that port is not built here.
- **Two-way comment sync with Teamwork.** v1 pushes tasks and pulls back completed/reopened status only. Replies stay in WordPress.
- **Teamwork webhooks.** These are paid-plan only and unreachable on staging or local sites behind auth. v1 polls with WP-Cron instead.
- **Screenshot annotation (draw/arrow/markup).** Optional screenshot capture is a feature-flagged stretch item. Annotation is not.
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
- [ ] ISC-1: `feedback-collector.php` has a valid plugin header (Name "Feedback Collector", Requires at least 6.5, Requires PHP 8.1)
- [ ] ISC-2: `php -l` passes on every PHP file
- [ ] ISC-3: PHPCS (WordPress standard) reports 0 errors
- [ ] ISC-4: Activation creates table `{prefix}fbc_items`
- [ ] ISC-5: Activation creates table `{prefix}fbc_comments`
- [ ] ISC-6: Option `fbc_db_version` set; mismatch triggers `dbDelta` upgrade
- [ ] ISC-7: Activation grants capability `fbc_review` to administrator and editor
- [ ] ISC-8: Settings screen lets an admin grant `fbc_review` to other roles
- [ ] ISC-9: All PHP lives under namespace `FeedbackCollector\`
- [ ] ISC-10: Activating on WP 6.5 / PHP 8.1 writes nothing to `debug.log`
- [ ] ISC-11: Deactivation leaves both tables and their rows intact
- [ ] ISC-12: Uninstall drops tables when `fbc_delete_on_uninstall` = true
- [ ] ISC-13: Anti: uninstall with `fbc_delete_on_uninstall` = false deletes any row or table

### Access and footprint
- [ ] ISC-14: Anti: logged-out page HTML contains any `fbc-` script or style handle
- [ ] ISC-15: Anti: logged-in user without `fbc_review` receives overlay assets
- [ ] ISC-16: User with `fbc_review` receives `fbc-overlay` script and style
- [ ] ISC-17: Admin bar shows a "Feedback" toggle node for `fbc_review` users
- [ ] ISC-18: Anti: any `feedback-collector/v1` route returns 2xx to a user without `fbc_review`
- [ ] ISC-19: Anti: plugin adds cookies or cache-control headers to logged-out responses
- [ ] ISC-20: Overlay bundle ≤ 60 KB gzipped, excluding the optional screenshot library
- [ ] ISC-21: Overlay UI mounts inside a Shadow DOM root
- [ ] ISC-22: Anti: a hostile theme rule (`* { all: unset }`) changes overlay computed styles

### Feedback mode and capture UX
- [ ] ISC-23: Admin bar toggle switches Feedback mode on/off
- [ ] ISC-24: Feedback mode state persists per browser across page loads
- [ ] ISC-25: `Alt+Shift+F` toggles Feedback mode
- [ ] ISC-26: Anti: the shortcut fires while focus is in an input, textarea or contenteditable
- [ ] ISC-27: In Feedback mode, right-click on an element opens a menu with Bug, Tweak, Change Request, Comment
- [ ] ISC-28: Anti: with Feedback mode off, right-click shows a custom menu
- [ ] ISC-29: Alt+right-click in Feedback mode shows the native browser menu
- [ ] ISC-30: Hover in Feedback mode outlines the target element
- [ ] ISC-31: Toolbar "+ Add" button enters click-to-pin mode (trackpad/touch path)
- [ ] ISC-32: "Page note" option creates an item with no element anchor
- [ ] ISC-33: Choosing a type opens a composer positioned next to the element
- [ ] ISC-34: Composer has Title (required) and Description fields
- [ ] ISC-35: Composer has Priority (Low/Medium/High/Critical, default Medium)
- [ ] ISC-36: Composer has optional Assignee picker
- [ ] ISC-37: Empty title is blocked in the UI
- [ ] ISC-38: Empty title is rejected by the REST API with 400
- [ ] ISC-39: Esc closes the composer without creating an item
- [ ] ISC-40: Anti: in click-to-pin mode, clicking a link navigates away

### Auto-captured context (each stored per item)
- [ ] ISC-41: Page path relative to `home_url()`
- [ ] ISC-42: Query string
- [ ] ISC-43: Page title
- [ ] ISC-44: CSS selector of target element
- [ ] ISC-45: XPath of target element
- [ ] ISC-46: Text snippet of target element (≤ 120 chars)
- [ ] ISC-47: Tag name of target element
- [ ] ISC-48: Click offset as ratio within the element bounding box
- [ ] ISC-49: Document coordinates as last-resort fallback
- [ ] ISC-50: Viewport width and height
- [ ] ISC-51: Breakpoint label (mobile < 768, tablet 768–1024, desktop > 1024)
- [ ] ISC-52: Device pixel ratio
- [ ] ISC-53: Browser name and version parsed from user agent
- [ ] ISC-54: OS parsed from user agent
- [ ] ISC-55: Reporter user ID
- [ ] ISC-56: `created_at` in UTC
- [ ] ISC-57: Last ≤ 20 JS errors since page load (`window.onerror` + `unhandledrejection`)
- [ ] ISC-58: Queried object post ID and post type
- [ ] ISC-59: Active theme slug
- [ ] ISC-60: Anti: captured payload contains any form field value or password input content

### Anchoring and pins
- [ ] ISC-61: Existing items render as pins on their element on page load
- [ ] ISC-62: Pins are numbered by item ID sequence on the site
- [ ] ISC-63: Pin color encodes type (4 distinct colors)
- [ ] ISC-64: Pin style encodes status (Resolved = green check)
- [ ] ISC-65: Resolved pins hidden by default; "Show resolved" toggle reveals them
- [ ] ISC-66: Anti: pins are visible when Feedback mode is off
- [ ] ISC-67: Pins reposition after window resize within one animation frame
- [ ] ISC-68: Pins follow their element after a layout shift (late-loading image above it)
- [ ] ISC-69: Pins inside a sticky/fixed header stay attached while scrolling
- [ ] ISC-70: Resolver tries id → selector → XPath → text-snippet → coordinates, in that order
- [ ] ISC-71: Selector generator skips auto-generated/random IDs (fixture tests)
- [ ] ISC-72: Selector generator prefers stable builder attributes (e.g. Elementor `data-id`)
- [ ] ISC-73: Pin for an element hidden at the current breakpoint is not drawn
- [ ] ISC-74: Sidebar shows "N items at other breakpoints" when any are hidden
- [ ] ISC-75: Unresolvable items are flagged orphaned, never drawn at a guessed spot
- [ ] ISC-76: "Re-anchor" lets a reviewer click a new element and saves the new anchor
- [ ] ISC-77: Clicking a pin opens the item popover
- [ ] ISC-78: `bun test` anchor-resolver suite has ≥ 15 fixtures, all passing
- [ ] ISC-79: Anti: pins from a different page path render on the current page
- [ ] ISC-80: Repositioning 50 pins takes < 16 ms (performance.now probe)

### Sidebar
- [ ] ISC-81: Sidebar lists items for the current page
- [ ] ISC-82: Scope switch: this page / all pages
- [ ] ISC-83: Filter by type
- [ ] ISC-84: Filter by status
- [ ] ISC-85: "Assigned to me" filter
- [ ] ISC-86: Clicking a list item scrolls to its pin and pulses it
- [ ] ISC-87: Orphaned items appear in their own section with a Re-anchor action

### Item thread and status
- [ ] ISC-88: Status enum is exactly Open, In Progress, Ready for Review, Resolved
- [ ] ISC-89: Anti: REST accepts a status outside the enum (expect 400)
- [ ] ISC-90: Status change from the popover persists via REST
- [ ] ISC-91: Assignee picker lists only users with `fbc_review`
- [ ] ISC-92: Replies are stored as threaded comments per item
- [ ] ISC-93: Status and assignee changes are logged as activity entries (who, when, from → to)
- [ ] ISC-94: Delete is allowed only for the reporter or an administrator

### REST API and security
- [ ] ISC-95: Routes registered under `feedback-collector/v1`
- [ ] ISC-96: `GET /items?page_path=` returns only items for that path
- [ ] ISC-97: `POST /items` returns 201 with the new ID
- [ ] ISC-98: `PATCH /items/{id}` updates title, description, status, priority, assignee
- [ ] ISC-99: `DELETE /items/{id}` enforces ISC-94
- [ ] ISC-100: `POST /items/{id}/comments` creates a reply
- [ ] ISC-101: Anti: a write route succeeds without a valid `wp_rest` nonce
- [ ] ISC-102: Description sanitized with `wp_kses_post`; text fields with `sanitize_text_field`
- [ ] ISC-103: Anti: a `<script>` in a description executes in the popover
- [ ] ISC-104: Anti: a `<script>` in a description executes in admin screens
- [ ] ISC-105: Every SQL query with input uses `$wpdb->prepare` (PHPCS DirectDatabaseQuery sniff clean)
- [ ] ISC-106: REST contract documented in `docs/rest-api.md`

### Admin
- [ ] ISC-107: Top-level "Feedback" admin menu with an Open-count badge
- [ ] ISC-108: List table columns: #, Title, Type, Status, Priority, Assignee, Page, Reporter, Created, Teamwork
- [ ] ISC-109: Filter by type
- [ ] ISC-110: Filter by status
- [ ] ISC-111: Filter by assignee
- [ ] ISC-112: Filter by page
- [ ] ISC-113: Search across title and description
- [ ] ISC-114: Sort by created date and by priority
- [ ] ISC-115: Pagination at 20 per page
- [ ] ISC-116: Bulk action: change status
- [ ] ISC-117: Bulk action: push to Teamwork
- [ ] ISC-118: Detail screen shows every captured context field
- [ ] ISC-119: "View on page" opens `?fbc_item={id}`, enables Feedback mode, scrolls to the pin and opens it
- [ ] ISC-120: View-on-page shows a banner when the current breakpoint differs from the captured one
- [ ] ISC-121: CSV export of the current filtered list

### Teamwork integration
- [ ] ISC-122: Settings fields: Teamwork site URL and API key
- [ ] ISC-123: "Test connection" calls `GET /projects/api/v3/me.json` and shows the user name on success
- [ ] ISC-124: API key read from `FBC_TEAMWORK_API_KEY` in wp-config when defined (preferred); otherwise an encrypted DB option is the fallback
- [ ] ISC-125: Anti: the API key appears in any front-end HTML, JS or REST response
- [ ] ISC-126: Project dropdown lists all active projects (v3, loops while `meta.page.hasMore`)
- [ ] ISC-127: Selected project ID persists in site options
- [ ] ISC-128: "Create QA list" calls v1 `POST /projects/{id}/tasklists.json`, named "QA – Round N – YYYY-MM-DD"
- [ ] ISC-129: Returned `TASKLISTID` is stored as the active QA list
- [ ] ISC-130: Option to pick an existing task list instead of creating one
- [ ] ISC-131: Push creates a v3 task in the active QA list
- [ ] ISC-132: Task name format is `[Type] Title`
- [ ] ISC-133: Task description (HTML) includes description, deep link to the pin, page URL, breakpoint and viewport, browser and OS, selector, reporter, JS errors
- [ ] ISC-134: Task tagged with its type (tag created if missing, IDs cached)
- [ ] ISC-135: Priority mapped: Critical/High → high, Medium → medium, Low → low
- [ ] ISC-136: Assignee mapped by matching email against project people; unmatched → unassigned with a note
- [ ] ISC-137: Teamwork task ID and URL stored on the item and linked in admin
- [ ] ISC-138: Anti: pushing an already-pushed item creates a second Teamwork task
- [ ] ISC-139: API failure marks the item `sync_error` with the message, and a Retry action exists
- [ ] ISC-140: On 429, pushes back off until `X-Rate-Limit-Reset`; a 100-item bulk push completes with no item lost
- [ ] ISC-141: "Auto-push new items" setting (default off) pushes on creation
- [ ] ISC-142: WP-Cron job every 15 min polls the QA list with `updatedAfter`; completed tasks → Resolved
- [ ] ISC-143: Reopened tasks in Teamwork → Open in WordPress
- [ ] ISC-144: Anti: sync-back changes the status of an item that was never pushed

### Compatibility and experience
- [ ] ISC-145: [DROPPED — see Decisions 2026-09-30, staging-only]
- [ ] ISC-146: Anti: overlay loads inside Elementor or Beaver Builder edit iframes
- [ ] ISC-147: Works on one block theme and one classic theme (live probe)
- [ ] ISC-148: Antecedent: with Feedback mode on, filing an item takes ≤ 3 interactions plus typing (right-click → type → Enter)
- [ ] ISC-149: Antecedent: from a Teamwork task, the developer reaches the open pin in one click

### Optional — screenshots (feature-flagged, stretch)
- [ ] ISC-150: "Capture screenshot" setting exists, default off
- [ ] ISC-151: When on, an element-area screenshot is stored under `uploads/fbc/` (not the Media Library)
- [ ] ISC-152: Screenshot attached to the Teamwork task via the presigned `pendingfiles` flow
- [ ] ISC-153: Anti: screenshot library is loaded when the setting is off

### Added after advisor review
- [ ] ISC-154: A logged-out click on a `?fbc_item=` deep link redirects to wp-login with `redirect_to`, then returns to the open pin

### Added after Aaron's decisions (2026-09-30)
- [ ] ISC-155: "Sync now" button in admin runs the Teamwork status poll immediately and reports how many items changed
- [ ] ISC-156: Plugins screen shows a warning on the Feedback Collector row with the count of open items not yet pushed to Teamwork (staging-only removal safeguard)

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

- Pending: no build yet. This ISA is at `phase: plan`, waiting for approval. Evidence is recorded here per ISC during EXECUTE/VERIFY.
