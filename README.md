# Clockwork Feedback Collector

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
- **Pins** are colored by type and turn into a green ✓ when resolved. Pins follow the List's status filter: resolved pins are hidden while it shows **Unresolved** (the default) and appear when you pick **Any status** or **Resolved**.
  - Click a pin to change its status, priority or assignee, reply or delete.
- **Hover highlight** (the dashed-box icon on the toolbar) turns the purple element outline on or off. The choice is saved per browser. The outline always shows while picking an element with **+ Add**.
- **List** opens the sidebar: this page or all pages, filtered by type, status or "assigned to me".
  - Items whose element is hidden at the current breakpoint are listed separately.
  - Items whose element can't be found anymore are listed as **Orphaned**, with a “Pin again” link to place them on a new element.
- **Feedback** in wp-admin holds the full list: filters, search, sorting, bulk status changes, a detail screen with all captured context, and **View on page**, which opens the page with the pin open.

## Branding (white-label)

**Feedback → Branding** controls every name, logo and color the plugin shows:
- the Plugins-screen name, author and URL
- the menu label, page titles and header band
- the on-page toolbar
- the "Reported by … (Name #id)" line in Teamwork tasks

Defaults are Clockwork: logo, purple `#6953C4`, header `#2D2062`, lime accent `#7EFF83`. The look matches Clockwork Companion.

- **Colors:** text on any brand color is picked by contrast, so a light brand color never gets white text. Links and tabs use a darkened version of the primary color that reaches WCAG AA on white.
- **Logo:** the logo sits on the header color, so use a light logo on a dark header. With a custom name and no logo, the header shows the label as text, and the menu icon switches from the Clockwork sparkle to a neutral bubble.
- **Credit:** an optional "Powered by Clockwork Feedback Collector" line shows when white-labeled.
- **In code:** the `fbc_branding` filter can set any value, and overrides what's saved.

Internal identifiers stay neutral and never change with branding: the `feedback-collector` folder, text domain and REST namespace, and the `fbc_` tables, options and capability. Clockwork Companion's admin stylesheet is kept off these screens even when the menu label contains "Clockwork".

## Teamwork

Create a dedicated Teamwork user (e.g. "QA Bot") and add it only to the projects it needs. Log in to Teamwork as that user, click the profile icon, then **Edit My Details** → **API & Mobile** → **Show your Token**, and copy the key.

In **Feedback → Settings**, paste the Teamwork site URL and the key. The key is stored **encrypted in the database** and is never shown again or sent to the browser. If the site's security salts change (e.g. after a migration), Settings asks you to paste it again. Advanced, optional: `FBC_TEAMWORK_API_KEY` / `FBC_TEAMWORK_SITE` constants in `wp-config.php` override the stored values.

Then, in **Feedback → Settings**:

1. Click **Test connection**.
2. Choose the **Project**.
3. Click **Create "QA – Round N" list**, or pick an existing task list.
4. Optionally turn on **Auto-push** for new feedback.

Push items from the detail screen, or select several in the list and use **Bulk actions → Push to Teamwork**.

**Assignees:** under **Settings → Reviewers → Assign feedback to**, choose **Teamwork project members** (the default) or **WordPress users**.
- With Teamwork, the Assignee dropdowns list the people on the chosen project, and the person you pick is assigned on the task directly.
- Once an item is pushed, Teamwork owns the assignee. Change it there; the dropdown becomes read-only.
- Until Teamwork is connected with a project, WordPress users are used.

**Email notifications:** a global setting under Teamwork. Turn it off to create and assign tasks without Teamwork emailing anyone. It sends Teamwork's `taskOptions.notify`, the same switch as "Notify by email" in Teamwork.

- **Each task gets:**
  - `[Type] Title` as its name
  - an HTML description with the details, a link to the pin, the page, breakpoint, browser and element, plus any JS errors
  - a tag for its type
  - priority (Critical maps to High)
  - an assignee, matched by email to people on the project
- **Pushing twice never creates a duplicate.**
- **Large bulk pushes** continue in the background and back off when Teamwork's rate limit is hit.

**Status sync:** hourly by default (WP-Cron; Settings → Teamwork → "Sync with Teamwork" can make it every 5, 15 or 30 minutes), or on demand with **Sync now** (Settings → Teamwork tools) or **Sync with Teamwork** on the Feedback list. A manual sync also sends anything waiting in the push queue:
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

**Tests:**
- `bun test` runs the overlay suites: the pin-anchoring engine and overlay boot.
- `bun run test:wp` runs the WordPress integration suites in `tests/wp/` (REST and permissions, Teamwork push/sync against a mocked API, assignees, API-key storage). It runs inside a local WordPress with the plugin active, through wp-cli; set `WP="php wp-cli.phar --path=/path/to/wp"` if `wp` isn't on your PATH.
- Every suite deletes only the rows it created and restores the settings it changed.
- Never point the WordPress suites at a real staging or production site.

- **PHP:** `phpcs` with the bundled `phpcs.xml.dist` (WordPress standard).
- **REST contract:** see [docs/rest-api.md](docs/rest-api.md).
- **Plan and acceptance criteria:** see [ISA.md](ISA.md).
