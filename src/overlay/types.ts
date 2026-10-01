import type { Anchor } from './anchor';

export type ItemType = 'bug' | 'tweak' | 'change' | 'comment';
export type ItemStatus = 'open' | 'in_progress' | 'ready_for_review' | 'resolved';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface Context {
  viewport_w: number;
  viewport_h: number;
  dpr: number;
  breakpoint: Breakpoint;
  browser: string;
  os: string;
  user_agent: string;
  post_id: number;
  post_type: string;
  theme: string;
  js_errors: string[];
  /** Device-preview label (e.g. "Phone 390×844") when filed inside the preview frame. */
  preview?: string;
}

export interface Comment {
  id: number;
  kind: 'comment' | 'activity';
  body: string;
  user_id: number;
  user_name: string;
  created_at: string;
}

export interface Item {
  id: number;
  type: ItemType;
  status: ItemStatus;
  priority: Priority;
  title: string;
  description: string;
  page_path: string;
  page_query: string;
  page_title: string;
  page_url: string;
  anchor: Anchor | null;
  context: Context | null;
  breakpoint: Breakpoint | '';
  round: number;
  screenshot_url?: string;
  screenshot_error?: string;
  reporter_id: number;
  reporter_name: string;
  assignee_id: number;
  assignee_name: string;
  assignee_locked?: boolean;
  tw_task_id: number;
  tw_task_url: string;
  /** Why an item isn't in Teamwork yet (no QA list for its round, a failed push…). Empty when fine. */
  tw_note?: string;
  tw_sync_state: string;
  created_at: string;
  updated_at: string;
  can_delete: boolean;
  comments?: Comment[];
}

export interface Reviewer {
  id: number;
  name: string;
}

export interface Brand {
  name: string;
  label: string;
  logo: string;
  primary: string;
  onPrimary: string;
  dark: string;
  onDark: string;
  accent: string;
  ink?: string;
}

export interface Config {
  restUrl: string;
  nonce: string;
  homePath: string;
  pagePath?: string;
  adminUrl: string;
  user: { id: number; name: string; isAdmin: boolean };
  assignees: { source: 'teamwork' | 'wordpress'; people: Reviewer[]; error: string; me: number; fallback?: boolean };
  labels: {
    type: Record<ItemType, string>;
    status: Record<ItemStatus, string>;
    priority: Record<Priority, string>;
  };
  page: { postId: number; postType: string; theme: string };
  brand?: Brand;
  openItem: number;
  round: number;
  /** Base URL of dist/ for lazily loaded bundles (capture.js, annotator.js). */
  assetsUrl?: string;
  version?: string;
  /** Attach a screenshot to new items. */
  shots?: boolean;
}

export interface NewItem {
  type: ItemType;
  title: string;
  description: string;
  priority: Priority;
  assignee_id: number;
  page_path: string;
  page_query: string;
  page_title: string;
  anchor: Anchor | null;
  context: Context;
}

declare global {
  interface Window {
    FBCAnnotator?: { open(opts: { image: Blob; mount: HTMLElement; colors: string[] }): Promise<Blob | null> };
    FBCCapture?: { captureViewport(opts: { marker: { x: number; y: number } | null; color: string; maxWidth?: number; maxBytes?: number }): Promise<Blob> };
    fbcConfig?: Config;
    __fbcErrors?: string[];
  }
}
