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
- **+** pins with a normal click instead, for trackpads and touch screens. The **note** icon creates feedback for the whole page. Hover any toolbar icon to see what it does.
- **Pins** are colored by type and turn into a green ✓ when resolved. Pins follow the List's status filter: resolved pins are hidden while it shows **Unresolved** (the default) and appear when you pick **Any status** or **Resolved**.
  - Click a pin to change its status, priority or assignee, reply or delete.
- The purple element outline shows while picking an element with **+**, so you can see what will be pinned.
- **List** opens the sidebar: this page or all pages, filtered by type, status or "assigned to me".
  - Items whose element is hidden at the current breakpoint are listed separately.
  - Items whose element can't be found anymore are listed as **Orphaned**, with a “Pin again” link to place them on a new element.
- **Feedback** in wp-admin holds the full list: filters, search, sorting, bulk status changes, a detail screen with all captured context, and **View on page**, which opens the page with the pin open.

## Screen recordings

The **red dot** (Record) on the toolbar records the page with your voice, like Loom, and files it as feedback.

1. Click the **red dot**. Chrome asks for the microphone, then to share **this tab**; allow both. (Without a mic it still records, silently.)
2. Show the problem and talk it through. Your pointer and every click show up in the video as a yellow dot and an orange ripple.
3. Click **■ Stop** (or Chrome's own "Stop sharing"). It stops by itself at the time limit (3 minutes by default).
4. Watch the preview, add a title and type, and click **Add**.

- **It uploads while you record**, in small pieces every 2 seconds, so saving is almost instant and no host upload limit gets in the way. If the connection drops, the whole video is sent again on save.
- **Clicks and JavaScript errors are logged with timestamps.** The pin card and the Feedback detail screen list them under the player; click a time to jump there. Field values are never logged.
- **Teamwork** gets the video attached to the task, plus a link and the timeline (e.g. "0:42 · clicked `"Pay now" (button.pay)`") in the description.
- **Chrome and Edge only**, on a desktop. Other browsers don't show the button. A recording stays on one page: leaving the page asks first, and ends the recording.
- **Storage:** `uploads/fbc-videos/`, with unguessable file names, at roughly 10–15 MB a minute. Deleting an item deletes its video. **Deleting the plugin always deletes every recording**, even when you keep the other data; pushed tasks keep their copy in Teamwork. **Remove all data** deletes them too.
- **Settings → Screen recordings:** turn the button off, or change the time limit (1–10 minutes).

## Due dates

- **Set date?** in the composer gives the item a due date. It starts ticked, with the date 3 days out filled in; untick it for no date, or pick another day.
- **Batches:** items a reviewer files in one sitting share a due date. The first item starts a batch; everything they file within 3 hours of it reuses that date. Change the date mid-batch and the rest of the batch follows. After 3 hours the next item starts a fresh batch. Batches are per reviewer.
- **Edit later** in the pin's card or on the item screen. The Feedback list has a sortable **Due** column, with overdue items in red.
- **Teamwork** gets the date on push (Teamwork dates are day-only, like these). Editing it here updates the task; changing it in Teamwork syncs back.
- **Settings → Due dates:** whether "Set date?" starts ticked, how many days out (default 3), and the batch window in hours (default 3; 0 turns batches off).

## Branding (white-label)

**Feedback → Branding** has a **Use custom branding** switch. Off (the default), the plugin shows "Feedback Collector" in small text with the default colors and no logo. On, the values below control every name, logo and color the plugin shows:
- the Plugins-screen name, author and URL
- the menu label, page titles and header band
- the on-page toolbar
- the "Reported by … (Name #id)" line in Teamwork tasks

Default colors are Clockwork's: purple `#6953C4`, header `#2D2062`, lime accent `#7EFF83`. The look matches Clockwork Companion. Switching custom branding off keeps your saved values for next time.

- **Colors:** text on any brand color is picked by contrast, so a light brand color never gets white text. Links and tabs use a darkened version of the primary color that reaches WCAG AA on white.
- **Logo:** optional; pick one from the Media Library. It sits on the header color, so use a light logo on a dark header. Without one, the header shows the label as small text.
- **Credit:** an optional "Powered by Clockwork Feedback Collector" line shows when white-labeled.
- **In code:** the `fbc_branding` filter can set any value, and overrides what's saved.

Internal identifiers stay neutral and never change with branding: the `feedback-collector` folder, text domain and REST namespace, and the `fbc_` tables, options and capability. Clockwork Companion's admin stylesheet is kept off these screens even when the menu label contains "Clockwork".

## Teamwork

Create a dedicated Teamwork user (e.g. "QA Bot") and add it only to the projects it needs. Log in to Teamwork as that user, click the profile icon, then **Edit My Details** → **API & Mobile** → **Show your Token**, and copy the key.

In **Feedback → Settings**, paste the Teamwork site URL and the key. The key is stored **encrypted in the database** and is never shown again or sent to the browser. If the site's security salts change (e.g. after a migration), Settings asks you to paste it again. Advanced, optional: `FBC_TEAMWORK_API_KEY` / `FBC_TEAMWORK_SITE` constants in `wp-config.php` override the stored values.

Then, in **Feedback → Settings**:

1. Click **Test connection**.
2. Choose the **Project**.
3. Under **QA task list**, choose **Select existing list** (or pick "+ Create new task list…") or switch to **Create new list** to create a custom or fresh "QA – Round N" list on the spot.
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

## WP-CLI

Feedback Collector includes a complete command suite under `wp feedback` for terminal-based triage, automated scripts, CI/CD pipelines, and bulk operations.

### Commands

- **`wp feedback list`**: Lists feedback items with filtering and flexible formatting.
  - **Flags:** `--status=<open|in_progress|ready|resolved|unresolved|all>` (default: `unresolved`), `--type=<bug|tweak|change|comment>`, `--priority=<low|medium|high|critical>`, `--round=<num>`, `--page-path=<path>`, `--assignee=<id>`, `--search=<query>`, `--fields=<fields>`, `--format=<table|json|csv|yaml|ids|count>`
  - **Examples:**
    ```sh
    # List unresolved feedback
    wp feedback list

    # List all high-priority bugs
    wp feedback list --status=open --type=bug --priority=high

    # Export all feedback as CSV
    wp feedback list --status=all --format=csv > feedback.csv

    # Get IDs of unpushed items
    wp feedback list --status=unresolved --format=ids
    ```

- **`wp feedback get <id>`**: Shows complete details for a feedback item (anchor, breakpoint, browser/OS, screenshot URL, Teamwork URL, and threaded comments table). Supports `--format=table|json|yaml`.
  - **Example:**
    ```sh
    wp feedback get 12
    wp feedback get 12 --format=json
    ```

- **`wp feedback stats`**: Overview of feedback items by status and type, active QA round, screenshots on disk, and unpushed tasks. Supports `--format=table|json|yaml`.
  - **Example:**
    ```sh
    wp feedback stats
    ```

- **`wp feedback create`**: Creates a feedback item from the command line.
  - **Flags:** `--title=<title>`, `[--type=<type>]`, `[--priority=<priority>]`, `[--page-path=<path>]`, `[--description=<desc>]`, `[--due-date=<YYYY-MM-DD>]`, `[--assignee=<user_id>]`, `[--round=<round>]`
  - **Example:**
    ```sh
    wp feedback create --title="Footer link 404s" --type=bug --priority=high --page-path=/the-future/
    ```

- **`wp feedback update <id>`**: Updates status, priority, due date, assignee, or title.
  - **Flags:** `[--status=<open|in_progress|ready|resolved>]`, `[--priority=<low|medium|high|critical>]`, `[--due-date=<date>]`, `[--assignee=<id>]`, `[--title=<title>]`
  - **Example:**
    ```sh
    wp feedback update 12 --status=resolved
    wp feedback update 12 --priority=critical --due-date=2026-10-15
    ```

- **`wp feedback delete <id>...`**: Deletes one or more items and their screenshots/comments.
  - **Flags:** `[--force]` skips confirmation.
  - **Example:**
    ```sh
    wp feedback delete 12 13 14 --force
    ```

- **`wp feedback push-teamwork [<id>] [--all] [--round=<round>]`**: Pushes an item or all unpushed items to Teamwork with a live CLI progress bar.
  - **Example:**
    ```sh
    # Push single item
    wp feedback push-teamwork 12

    # Push all unpushed items
    wp feedback push-teamwork --all

    # Push all unpushed items in Round 2
    wp feedback push-teamwork --all --round=2
    ```

- **`wp feedback inventory`**: Summarizes stored database rows, comments, screenshots on disk, and unpushed tasks.
  - **Example:**
    ```sh
    wp feedback inventory
    ```

- **`wp feedback purge [--yes]`**: Drops feedback tables, removes options, and deletes screenshots from disk.
  - **Example:**
    ```sh
    wp feedback purge --yes
    ```

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
- `bun run test:wp` runs the WordPress integration suites in `tests/wp/` (REST and permissions, Teamwork push/sync against a mocked API, assignees, rounds, screenshots, API-key storage, branding, due dates) through wp-cli; set `WP="php wp-cli.phar --path=/path/to/wp"` if `wp` isn't on your PATH.
- They run against a **throwaway copy** of the site's database (`*_scratch`), created fresh for each run and dropped after, so nothing a test does can touch the real site. Every suite refuses to run against any other database. One-time setup (a `DB_NAME` switch in the local `wp-config.php` and a MySQL grant) is described at the top of `tests/wp/run.sh`.
- To point wp-cli at your test site without `WP=…`, add a gitignored `wp-cli.local.yml` in the repo root containing `path: ../your-test-wp`, with the plugin symlinked into that site's `wp-content/plugins/feedback-collector`.
- Never point the WordPress suites at a real staging or production site.

- **PHP:** `phpcs` with the bundled `phpcs.xml.dist` (WordPress standard).
- **REST contract:** see [docs/rest-api.md](docs/rest-api.md).
- **Plan and acceptance criteria:** see [ISA.md](ISA.md).
