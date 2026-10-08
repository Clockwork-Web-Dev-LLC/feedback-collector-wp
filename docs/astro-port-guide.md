# Porting Feedback Collector to Astro: Architecture & Implementation Guide

This guide explains how **Feedback Collector** is built in WordPress and provides an end-to-end blueprint for replicating its exact visual feedback, element-pinning, screenshot capture, and Teamwork triage capabilities inside an **Astro** application.

---

## 1. How Feedback Collector Works Today (WordPress Architecture)

Feedback Collector is fundamentally composed of two distinct systems that communicate over a JSON REST API:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BROWSER / CLIENT-SIDE                           │
│                                                                        │
│   Host DOM (Webpage) <─── Shadow DOM Host (<feedback-collector-host>)  │
│                                │                                       │
│                    ┌───────────┴───────────┐                           │
│                    │  4-Tier Anchor Engine │                           │
│                    │  (id → CSS → XPath    │                           │
│                    │   → unique text)      │                           │
│                    └───────────┬───────────┘                           │
│                                │                                       │
│          ┌─────────────────────┼─────────────────────┐                 │
│          ▼                     ▼                     ▼                 │
│   Toolbar & Pins        Right-Click Menu     Screenshot & Canvas       │
│   (Pin positioning,     (Type: bug/tweak/    (html2canvas capture,     │
│    status filtering)     change/comment)      cropping & annotation)   │
└────────────────────────────────┬───────────────────────────────────────┘
                                 │ HTTP / JSON REST
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND SERVER                                  │
│                                                                        │
│   WordPress REST Controller (`/wp-json/feedback-collector/v1/items`)   │
│   ├── Auth: Cookie session + X-WP-Nonce (`fbcol_review` capability)      │
│   ├── Storage: `wp_fbc_items` + `wp_fbc_comments` custom MySQL tables  │
│   ├── Screenshots: Written to `wp-content/uploads/feedback-collector/` │
│   └── Teamwork Sync: API client pushes tasks & maps completion status   │
└────────────────────────────────────────────────────────────────────────┘
```

### The Key Technical Innovations to Preserve
1. **Zero CSS Bleed (Shadow DOM)**: The toolbar, pins, right-click menu, and composer are rendered inside an isolated `ShadowRoot`. Host website styles (Tailwind, Bootstrap, themes) never corrupt the feedback UI, and the feedback UI never corrupts the website.
2. **Resilient 4-Tier Anchoring Engine (`src/overlay/anchor.ts`)**: When a user pins an element, it computes:
   - Primary: Stored DOM element `id` (ignoring dynamic/framework-generated IDs like `__next_...` or random hashes).
   - Secondary: Relative CSS selector rooted at the nearest stable ancestor (`main > section:nth-of-type(2) h2`).
   - Tertiary: Absolute XPath (`/html/body/main[1]/section[2]/h2[1]`).
   - Quaternary: Normalized text content (`"Why Think When You Can Chew?"`).
   If the DOM shifts (e.g. dynamic content or responsive reflow), the element is still found. If the element is deleted, the pin cleanly reports as **Orphaned** rather than rendering at a random coordinate.
3. **Relative Coordinate Geometry**: Pin positions are stored as ratios (`offsetX: 0.45`, `offsetY: 0.50`) relative to the target element's bounding box, so pins stick to the exact spot across responsive breakpoints.
4. **Device Context Capture**: Automatically records viewport width/height, device pixel ratio (DPR), user agent, browser, OS, and client-side console errors.

---

## 2. Replicating on Astro: High-Level Architecture

In Astro, the architecture is actually **cleaner and faster** because Astro separates static content from dynamic server routes natively.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ASTRO APPLICATION                               │
│                                                                        │
│  src/layouts/BaseLayout.astro                                          │
│  └── <FeedbackCollector /> (Only active on DEV or STAGING environments) │
│           │                                                            │
│           ├── Client Script (`src/overlay/overlay.ts`)                 │
│           │   ├── 4-Tier Anchor Engine (100% reusable from current repo)│
│           │   ├── Shadow DOM Toolbar, Menu & Pins                      │
│           │   └── Screenshot Capture Pipeline                          │
│           │                                                            │
│           └── Server Endpoints (`src/pages/api/feedback/[...route].ts`)│
│               ├── Authentication (Staging Key / Session Cookie)        │
│               ├── Database Layer (SQLite via Turso, or Neon Postgres)  │
│               ├── Screenshot Storage (Local public dir or R2/S3)       │
│               └── Teamwork / GitHub Issues / Slack Dispatcher          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Step-by-Step Implementation for Astro

### Step 1: The Client Overlay (90% Code Reuse!)
The entire TypeScript codebase in `src/overlay/` (`anchor.ts`, `screenshot.ts`, etc.) has **zero WordPress dependencies**. It is standard browser TypeScript using the Web DOM API.

Create an Astro component that mounts the overlay only in non-production environments:

```astro
---
// src/components/FeedbackCollector.astro
interface Props {
  apiBaseUrl?: string;
  round?: number;
}

const { apiBaseUrl = '/api/feedback', round = 1 } = Astro.props;

// Only enable on local dev or staging previews
const isStaging = import.meta.env.DEV || import.meta.env.PUBLIC_STAGING === 'true';
---

{isStaging && (
  <div
    id="feedback-collector-root"
    data-api-url={apiBaseUrl}
    data-round={round}
  ></div>
  <script>
    import { bootOverlay } from '../lib/feedback/boot';

    const root = document.getElementById('feedback-collector-root');
    if (root) {
      bootOverlay({
        apiUrl: root.dataset.apiUrl || '/api/feedback',
        round: Number(root.dataset.round) || 1,
      });
    }
  </script>
)}
```

Add it to your main Astro layout:

```astro
---
// src/layouts/Layout.astro
import FeedbackCollector from '../components/FeedbackCollector.astro';
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My Astro Site</title>
  </head>
  <body>
    <slot />

    <!-- Feedback Collector overlay floats here -->
    <FeedbackCollector />
  </body>
</html>
```

---

### Step 2: The Database & Storage Layer (Drizzle ORM)

In WordPress, custom SQL tables were created in MySQL. In Astro, using **Drizzle ORM** with **SQLite (LibSQL / Turso)** or **Serverless Postgres (Neon)** gives you full type safety across your entire stack.

#### `src/lib/db/schema.ts`
```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const feedbackItems = sqliteTable('feedback_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type', { enum: ['bug', 'tweak', 'change', 'comment'] }).notNull(),
  status: text('status', { enum: ['open', 'in_progress', 'ready', 'resolved'] }).default('open').notNull(),
  priority: text('priority', { enum: ['low', 'medium', 'high', 'critical'] }).default('medium').notNull(),
  title: text('title').notNull(),
  description: text('description').default(''),
  pagePath: text('page_path').notNull(),
  pageQuery: text('page_query').default(''),
  pageTitle: text('page_title').default(''),
  round: integer('round').default(1).notNull(),

  // Stored JSON payload from anchor.ts
  anchor: text('anchor', { mode: 'json' }),

  // Viewport, browser, OS, and client error metadata
  context: text('context', { mode: 'json' }),

  // Screenshot image URL
  screenshotUrl: text('screenshot_url'),

  // Teamwork task tracking
  twTaskId: integer('tw_task_id').default(0),
  twTaskUrl: text('tw_task_url').default(''),

  dueDate: text('due_date'),
  reporterName: text('reporter_name').default('Reviewer'),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP').notNull(),
  updatedAt: text('updated_at').default('CURRENT_TIMESTAMP').notNull(),
});

export const feedbackComments = sqliteTable('feedback_comments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  itemId: integer('item_id').references(() => feedbackItems.id, { onDelete: 'cascade' }).notNull(),
  kind: text('kind', { enum: ['comment', 'activity'] }).default('comment').notNull(),
  author: text('author').notNull(),
  body: text('body').notNull(),
  createdAt: text('created_at').default('CURRENT_TIMESTAMP').notNull(),
});
```

---

### Step 3: Astro Server API Endpoints

Astro Server Endpoints (`output: 'server'` or hybrid mode) replace the WordPress REST API (`/wp-json/feedback-collector/v1/...`).

#### `src/pages/api/feedback/items.ts`
```typescript
import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';
import { feedbackItems } from '../../../lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { pushToTeamwork } from '../../../lib/teamwork';

// GET /api/feedback/items
export const GET: APIRoute = async ({ url }) => {
  const pagePath = url.searchParams.get('page_path');
  const status = url.searchParams.get('status');

  let query = db.select().from(feedbackItems).orderBy(desc(feedbackItems.id));

  // Optional filtering by page path
  if (pagePath) {
    query = query.where(eq(feedbackItems.pagePath, pagePath)) as any;
  }

  const items = await query;
  return new Response(JSON.stringify({ items, total: items.length }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

// POST /api/feedback/items
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  if (!body.title || !body.type) {
    return new Response(JSON.stringify({ error: 'Title and type are required' }), { status: 400 });
  }

  const [inserted] = await db.insert(feedbackItems).values({
    title: body.title,
    type: body.type,
    priority: body.priority || 'medium',
    description: body.description || '',
    pagePath: body.page_path || '/',
    pageQuery: body.page_query || '',
    pageTitle: body.page_title || '',
    round: body.round || 1,
    anchor: body.anchor || null,
    context: body.context || {},
    screenshotUrl: body.screenshot_url || null,
    dueDate: body.due_date || null,
    reporterName: body.reporter_name || 'Reviewer',
  }).returning();

  // Asynchronously dispatch to Teamwork if configured
  if (process.env.TEAMWORK_API_KEY && process.env.TEAMWORK_PROJECT_ID) {
    pushToTeamwork(inserted.id).catch(console.error);
  }

  return new Response(JSON.stringify(inserted), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
```

---

### Step 4: Screenshot Handling in Astro

In WordPress, PHP wrote image buffers into `wp-content/uploads/feedback-collector/`.

In modern Astro deployments:
- **Self-Hosted / Node.js**: Save uploaded WebP/PNG buffers directly to `public/uploads/feedback/` using Node's `fs/promises`.
- **Cloudflare / Vercel / Netlify (Serverless)**: Stream uploads to **Cloudflare R2** or **AWS S3** via presigned URLs or direct worker upload.

Example Serverless Endpoint:
```typescript
// src/pages/api/feedback/upload.ts
import type { APIRoute } from 'astro';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });
  }

  const filename = `fbc-${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Upload to Cloudflare R2 / S3
  const s3 = new S3Client({ /* credentials */ });
  await s3.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ContentType: file.type,
  }));

  const url = `${process.env.R2_PUBLIC_DOMAIN}/${filename}`;
  return new Response(JSON.stringify({ url }), { status: 201 });
};
```

---

### Step 5: Authentication & Access Control

Unlike WordPress which has built-in users, roles, and cookie nonces, an Astro staging feedback collector can be secured through multiple clean patterns:

1. **Lightweight Staging Token (Recommended for Agency QA)**:
   - A secret URL parameter sets an HTTP-only cookie on the client:
     `https://staging.example.com/?qa_key=clockwork2026`
   - Astro middleware inspects the cookie:
     ```typescript
     // src/middleware.ts
     import { defineMiddleware } from 'astro:middleware';

     export const onRequest = defineMiddleware(async (context, next) => {
       const hasKey = context.cookies.get('qa_key')?.value === process.env.QA_SECRET_KEY;
       context.locals.isReviewer = hasKey;
       return next();
     });
     ```
2. **Turnstile / Password Gate**:
   - A simple modal asks the reviewer for their name and the team passphrase. Once entered, reviewer identity is stored in `localStorage` and sent with feedback submissions.
3. **Clerk / Supabase / Auth.js**:
   - If the Astro project already has authentication, simply verify the session JWT in the Astro API route.

---

### Step 6: Teamwork Two-Way Synchronization

The Teamwork logic in `includes/Teamwork/Client.php` translates directly into TypeScript:

```typescript
// src/lib/teamwork.ts
export async function pushToTeamwork(itemId: number) {
  const item = await db.query.feedbackItems.findFirst({ where: eq(feedbackItems.id, itemId) });
  if (!item || item.twTaskId > 0) return;

  const authHeader = 'Basic ' + Buffer.from(process.env.TEAMWORK_API_KEY + ':x').toString('base64');
  const taskListId = process.env.TEAMWORK_TASKLIST_ID;

  const response = await fetch(`https://${process.env.TEAMWORK_SITE}.teamwork.com/tasklists/${taskListId}/tasks.json`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'todo-item': {
        content: `[${item.type.toUpperCase()}] ${item.title}`,
        description: `
          <p><strong>Page:</strong> <a href="${item.pagePath}">${item.pagePath}</a></p>
          <p><strong>Priority:</strong> ${item.priority}</p>
          <p><strong>Details:</strong> ${item.description}</p>
          ${item.screenshotUrl ? `<p><img src="${item.screenshotUrl}" width="600" /></p>` : ''}
        `,
        priority: item.priority === 'critical' ? 'high' : item.priority,
        'due-date': item.dueDate ? item.dueDate.replace(/-/g, '') : '',
      },
    }),
  });

  const data = await response.json();
  const taskId = data.id;

  // Save back to DB
  await db.update(feedbackItems)
    .set({ twTaskId: taskId, twTaskUrl: `https://${process.env.TEAMWORK_SITE}.teamwork.com/#/tasks/${taskId}` })
    .where(eq(feedbackItems.id, itemId));
}
```

---

## 4. Architectural Comparison: WordPress vs. Astro

| Feature | WordPress Plugin | Astro Implementation |
| :--- | :--- | :--- |
| **Client UI & Pins** | Vanilla TS compiled with Bun to `dist/overlay.js` | Direct TS imported into `<FeedbackCollector />` |
| **CSS Encapsulation** | Shadow DOM (`#feedback-collector-host`) | Shadow DOM (Identical zero-bleed isolation) |
| **DOM Anchoring** | 4-tier engine (`anchor.ts`) | **100% reusable as-is** |
| **Screenshot Engine** | `html2canvas` + canvas cropping | **100% reusable as-is** |
| **Backend API** | PHP REST Controller (`WP_REST_Controller`) | Astro Server Endpoints (`src/pages/api/...`) |
| **Database** | Custom MySQL tables (`wp_fbc_items`) | Drizzle ORM + SQLite/Turso or Serverless Postgres |
| **Authentication** | WP User sessions + `wp_rest` nonce | HTTP-only reviewer cookie or Teamwork OAuth |
| **Staging Gate** | WordPress plugin active/inactive | `import.meta.env.DEV \|\| PUBLIC_STAGING === 'true'` |
| **CLI Management** | `wp feedback` (WP-CLI) | Node CLI script or npm task (`npm run feedback`) |

---

## 5. Summary Recommendation

Because the client overlay and anchor engine were built with **vanilla TypeScript and Shadow DOM encapsulation**, **more than 80% of this codebase can be dropped directly into an Astro project**. 

The only changes required are:
1. Wrapping the overlay boot logic inside a `<FeedbackCollector />` Astro component.
2. Replacing the PHP/MySQL REST routes with typed Astro server endpoints using Drizzle ORM.
3. Using a lightweight staging key or session cookie in place of WordPress nonces.
