# Feedback Collector REST API

Namespace: `feedback-collector/v1` (e.g. `/wp-json/feedback-collector/v1/items`, or `/?rest_route=/feedback-collector/v1/items` with plain permalinks).

Every route requires a logged-in user with the `fbc_review` capability. Browser requests use WordPress cookie auth and **must** send `X-WP-Nonce` (from `wp_create_nonce( 'wp_rest' )`). Without the nonce, the request is treated as logged out and gets a 401.

| Status | Meaning |
|--------|---------|
| 401 | Not logged in, or cookie without a valid nonce |
| 403 | Logged in without `fbc_review`, or deleting someone else's item as a non-admin |
| 400 | Validation failed; `data.field` names the field |
| 404 | Item not found |

## Enums

- `type`: `bug` · `tweak` · `change` · `comment`
- `status`: `open` · `in_progress` · `ready_for_review` · `resolved`
- `priority`: `low` · `medium` · `high` · `critical`
- `breakpoint`: `mobile` (< 768) · `tablet` (768–1024) · `desktop` (> 1024)

## Routes

### `GET /items`

| Param | Notes |
|-------|-------|
| `page_path` | Optional. Path relative to the site home, e.g. `/services/`. Normalized server-side (leading and trailing slash). |
| `type`, `status` | Optional, single value or array. |
| `assignee_id` | Optional. `0` = unassigned. |

Returns `{ "items": Item[], "total": number }`, oldest first, capped at 500.

### `POST /items` → 201 `Item`

```json
{
  "type": "tweak",
  "title": "CTA button misaligned",
  "description": "Plain text; newlines kept, HTML stripped.",
  "priority": "medium",
  "assignee_id": 0,
  "page_path": "/services/",
  "page_query": "ref=nav",
  "page_title": "Services – Example",
  "anchor": { "id": null, "selector": "main > section:nth-of-type(2) a", "xpath": "/html/body/main[1]/section[2]/a[1]", "text": "Book a demo", "tag": "a", "offsetX": 0.42, "offsetY": 0.5, "docX": 812, "docY": 1340 },
  "context": { "viewport_w": 1440, "viewport_h": 900, "dpr": 2, "breakpoint": "desktop", "browser": "Chrome 154", "os": "macOS 15.6", "user_agent": "…", "post_id": 12, "post_type": "page", "theme": "blocksy", "js_errors": [] }
}
```

`anchor: null` creates a page note that isn't tied to an element. `title` and `type` are required. `assignee_id` must be a user with `fbc_review`.

### `GET /items/{id}` → `Item` with `comments`

### `PATCH /items/{id}` → `Item` with `comments`

Any subset of `title`, `description`, `status`, `priority`, `type`, `assignee_id`, `anchor` (send a new anchor to re-anchor). Changes to status and assignee are logged as `activity` entries in the thread.

### `DELETE /items/{id}` → `{ "deleted": true, "id": 1 }`

Only the reporter or an administrator.

### `POST /items/{id}/comments` → 201 `{ "comments": Comment[] }`

Body: `{ "body": "text" }`.

### `GET /reviewers` → `[{ "id": 1, "name": "Aaron" }]`

Users who can be assigned feedback.

## Shapes

`Item`: `id, type, status, priority, title, description, page_path, page_query, page_title, page_url, anchor, context, breakpoint, reporter_id, reporter_name, assignee_id, assignee_name, tw_task_id, tw_task_url, tw_sync_state, created_at, updated_at, can_delete` (dates in RFC 3339 UTC).

`Comment`: `id, kind ("comment" | "activity"), body, user_id, user_name, created_at`. Activity with `user_id: 0` came from Teamwork sync.

## Anchor resolution (client side)

`src/overlay/anchor.ts` resolves an anchor in this order: stable `id` → `selector` → `xpath` → unique `text`. Every candidate must match the stored `tag`.

If a positional (selector/XPath) hit's text no longer matches, but exactly one element still carries the original text, the element has moved, so the text match wins. If nothing resolves, the item is **orphaned**. It is never drawn at a guessed position.
