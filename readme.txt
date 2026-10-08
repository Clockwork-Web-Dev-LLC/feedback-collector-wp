=== Feedback Collector ===
Contributors: areimann
Tags: feedback, qa, bug tracking, screen recording, teamwork
Requires at least: 6.5
Tested up to: 7.1
Requires PHP: 8.1
Stable tag: 0.4.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Visual QA for staging sites: pin feedback to any element with a screenshot or a screen recording, then push it to Teamwork.

== Description ==

Feedback Collector turns a staging site into a QA board. Your team switches on Feedback mode, right-clicks whatever is wrong, and files a **Bug**, **Tweak**, **Change Request** or **Comment** pinned to that exact element. The page, breakpoint, browser and any JavaScript errors are captured automatically.

**Built for staging sites.** Remove the plugin before go-live; the Plugins screen warns you while unresolved feedback hasn't been sent anywhere.

= Leave feedback =

* **Right-click** any element (or use **+** on the toolbar), pick a type, type a title and press Enter.
* **Page notes** for feedback about the whole page.
* **Show it:** attach a **Screenshot** (with arrows, boxes, highlights, blur and text) or a **Video**, a recording of the page with your voice, like a quick Loom. Nothing is captured until you ask.
* **Pins** stay on their element across visits and breakpoints, colored by type; click one to change status, priority, assignee or due date, or reply.
* **Device previews** at phone and tablet widths, so feedback records the right breakpoint.

= Screen recordings =

* Records the current tab with your microphone (Chrome and Edge on desktop).
* Your pointer and every click are drawn into the video.
* Clicks and JavaScript errors are listed with timestamps under the player; click one to jump there.
* Uploads while you record, in small pieces, so saving is near-instant and host upload limits never get in the way.
* Up to 3 minutes by default (1–10 in Settings).

= Manage it =

* A full list in wp-admin with filters, search, sorting, bulk status changes and CSV export.
* **QA rounds**, **due dates** (with per-reviewer batches) and **assignees**.
* **Teamwork integration** (optional): push items as tasks with the screenshot or video attached, and completing a task in Teamwork resolves the item here. Assignees, due dates and replies stay in sync.
* **White-label branding**: your name, logo and colors on the toolbar and admin screens.
* **WP-CLI** commands for listing, creating, updating, pushing to Teamwork and cleaning up.

= Privacy =

Screenshots mask anything typed into form fields. Click logs in recordings record what was clicked, never what was typed. Screenshots and recordings are stored in your uploads folder under unguessable file names. Deleting the plugin always deletes every recording; **Settings → Remove all data** deletes everything the plugin created.

== External services ==

This plugin connects to **Teamwork** (teamwork.com) only if you set it up under **Feedback → Settings → Teamwork** with your own Teamwork site address and API key. Without that, it makes no external requests.

When Teamwork is connected, the plugin sends requests from your server to *your* Teamwork site (for example `https://yourcompany.teamwork.com`):

* **To set up the connection:** it reads your Teamwork projects, task lists, people and tags so you can choose where feedback goes and who it's assigned to.
* **When an item is pushed** (by you, or automatically if you turn on Auto-push): it creates a task with the item's type, title, description, page URL, breakpoint, browser, the CSS selector of the pinned element, any JavaScript errors, the reporter's name, priority, due date and assignee. Its screenshot or screen recording is uploaded to Teamwork's file storage through a one-time upload address that Teamwork provides, and attached to the task.
* **When items change:** replies, due dates and status changes are sent to the matching task.
* **On a schedule** (every 5 to 60 minutes, as you choose): it reads the tasks it created, to mirror completion, assignee, due-date and comment changes back to the site.

The Teamwork API key is stored encrypted in your database and is never sent to the browser.

Teamwork is provided by Teamwork.com: [Terms of Service](https://www.teamwork.com/legal/terms-of-service/), [Privacy Notice](https://www.teamwork.com/legal/privacy-notice/).

== Source code ==

The browser scripts in `dist/` are built from the TypeScript sources in the plugin's public repository: [github.com/Clockwork-Web-Dev-LLC/feedback-collector-wp](https://github.com/Clockwork-Web-Dev-LLC/feedback-collector-wp) (`src/overlay/`). To build them yourself: install [Bun](https://bun.sh), then run `bun install` and `bun run build`.

They include these open-source libraries:

* [snapDOM](https://github.com/zumerlab/snapdom) 3.2.0 (MIT): screenshots of the page, in `dist/capture.js`.
* [Fabric.js](https://github.com/fabricjs/fabric.js) 7.4.0 (MIT): the screenshot annotator, in `dist/annotator.js`.

== Installation ==

1. Install and activate the plugin on your **staging** site (Plugins → Add New, search for "Feedback Collector").
2. Administrators and editors can leave feedback right away. Choose other roles under **Feedback → Settings → Who can leave feedback**.
3. Turn on Feedback mode from **Feedback** in the admin bar (or press Alt+Shift+F), then right-click anything on the site.
4. Optional: connect Teamwork under **Feedback → Settings**. Create a dedicated Teamwork user for this, add it only to the projects it needs, and paste its API key (Teamwork: profile → Edit My Details → API & Mobile).

== Frequently Asked Questions ==

= Is this for live sites? =

No. It's designed for staging sites during a build or a redesign. Remove it before launch; until then the Plugins screen warns you if unresolved feedback hasn't been pushed anywhere.

= Who can see the toolbar and the pins? =

Only logged-in users with the "Leave feedback" capability (administrators and editors by default). Visitors never see anything.

= Which browsers can record video? =

Chrome and Edge on desktop. Other browsers simply don't show the Video button; screenshots work everywhere.

= Where are screenshots and recordings stored? =

In `wp-content/uploads/fbc-screenshots/` and `wp-content/uploads/fbc-videos/`, with unguessable file names. A recording is about 10–15 MB a minute.

= Do I need Teamwork? =

No. Everything works on its own; Teamwork is an optional place to send the feedback.

= How do I remove everything? =

**Feedback → Settings → Remove all data** deletes the plugin's tables, settings, screenshots and recordings, then deactivates it. Deleting the plugin always deletes every recording, and deletes everything else too if you tick "Delete all feedback data when the plugin is deleted".

== Changelog ==

= 0.4.0 =
* New: choose a **Screenshot** or a **Video** in the feedback form. Recordings can be pinned to an element and keep their type, priority and assignee. Nothing is captured automatically any more.
* New: icon toolbar with instant hover labels; the hover-highlight toggle is gone (the outline shows while picking an element).
* Changed: plain "Feedback Collector" branding by default; custom branding (logo, colors, names) is one switch in Feedback → Branding.
* Changed: everything the plugin stores now uses the `fbcol_` prefix. Sites updating from 0.3 are migrated automatically on the first page load, keeping all feedback, settings, the Teamwork connection and permissions.

= 0.3.0 =
* New: screen recordings with voice, click and error timeline, and Teamwork attachment.

== Upgrade Notice ==

= 0.4.0 =
Feedback form gains Screenshot and Video choices. Stored data is renamed to the fbcol_ prefix automatically on update; nothing is lost.
