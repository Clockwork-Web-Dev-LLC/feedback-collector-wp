# Feedback Collector

Internal QA for **staging** WordPress sites. A teammate turns on Feedback mode, right-clicks the thing that's wrong, and picks **Bug**, **Tweak**, **Change Request** or **Comment**. The feedback is pinned to that element with the page, breakpoint, browser and JS errors captured automatically. Items can be pushed to a Teamwork QA task list, and completing a task in Teamwork marks the item Resolved here.

> Staging only. Remove the plugin before go-live. While unresolved items haven't been pushed to Teamwork, the Plugins screen shows a warning.

## Install

1. Copy the plugin folder to `wp-content/plugins/feedback-collector/` (the built `dist/overlay.js` must be present) and activate it.
2. Administrators and editors can leave feedback by default. Change this under **Feedback → Settings → Who can leave feedback**.

## Using it

- **Turn on Feedback mode:** click **Feedback** in the admin bar, or press **Alt+Shift+F**. A toolbar appears at the bottom right.
- **Right-click** any element, choose a type (or press 1–4), type a title and press **Enter**.
  - **Alt+right-click** always opens the normal browser menu.
- **+ Add** pins with a normal click instead, for trackpads and touch screens. **Page note** creates feedback for the whole page.
- **Pins** are colored by type and turn into a green ✓ when resolved. **✓ Resolved** shows or hides resolved pins.
  - Click a pin to change its status, priority or assignee, reply, re-anchor or delete.
- **List** opens the sidebar: this page or all pages, filtered by type, status or "assigned to me".
  - Items whose element is hidden at the current breakpoint are listed separately.
  - Items whose element can't be found anymore are listed as **Orphaned**, with a Re-anchor button.
- **Feedback** in wp-admin holds the full list: filters, search, sorting, bulk status changes, a detail screen with all captured context, and **View on page**, which opens the page with the pin open.

## Teamwork

Create a dedicated Teamwork user (e.g. "QA Bot") and add it only to the projects it needs. Log in to Teamwork as that user, click the profile icon, then **Edit My Details** → **API & Mobile** → **Show your Token**, and copy the key.

In **Feedback → Settings**, paste the Teamwork site URL and the key. The key is stored **encrypted in the database** and is never shown again or sent to the browser. If the site's security salts change (e.g. after a migration), Settings asks you to paste it again. Advanced, optional: `FBC_TEAMWORK_API_KEY` / `FBC_TEAMWORK_SITE` constants in `wp-config.php` override the stored values.

Then, in **Feedback → Settings**:

1. Click **Test connection**.
2. Choose the **Project**.
3. Click **Create "QA – Round N" list**, or pick an existing task list.
4. Optionally turn on **Auto-push** for new feedback.

Push items from the detail screen, or select several in the list and use **Bulk actions → Push to Teamwork**.

- **Each task gets:**
  - `[Type] Title` as its name
  - an HTML description with the details, a link to the pin, the page, breakpoint, browser and element, plus any JS errors
  - a tag for its type
  - priority (Critical maps to High)
  - an assignee, matched by email to people on the project
- **Pushing twice never creates a duplicate.**
- **Large bulk pushes** continue in the background and back off when Teamwork's rate limit is hit.

**Status sync:** every 15 minutes (WP-Cron), or on demand with **Sync with Teamwork**:
- A task completed in Teamwork marks the item **Resolved**.
- A reopened task marks it **Open** again.
- Items that were never pushed are never touched.

## Development

```sh
bun install
bun run build      # dist/overlay.js
bun run watch
bun test           # anchor engine
bun run typecheck
```

- **PHP:** `phpcs` with the bundled `phpcs.xml.dist` (WordPress standard).
- **REST contract:** see [docs/rest-api.md](docs/rest-api.md).
- **Plan and acceptance criteria:** see [ISA.md](ISA.md).
