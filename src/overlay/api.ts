import type { Comment, Config, Item, NewItem } from './types';

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export class Api {
  constructor(private cfg: Config) {}

  private url(path: string, params?: Record<string, string>): string {
    // rest_url() may be pretty (/wp-json/ns) or plain (?rest_route=/ns); both accept a path suffix.
    let url = this.cfg.restUrl.replace(/\/$/, '') + path;
    if (params) {
      const qs = new URLSearchParams(params).toString();
      if (qs) url += (url.includes('?') ? '&' : '?') + qs;
    }
    return url;
  }

  private async request<T>(method: string, path: string, body?: unknown, params?: Record<string, string>): Promise<T> {
    const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
    const res = await fetch(this.url(path, params), {
      method,
      credentials: 'same-origin',
      headers: {
        'X-WP-Nonce': this.cfg.nonce,
        // FormData sets its own multipart boundary header.
        ...(body !== undefined && !isForm ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
    });
    const data: unknown = await res.json().catch(() => null);
    if (!res.ok) {
      const message = data && typeof data === 'object' && 'message' in data ? String((data as { message: unknown }).message) : res.statusText;
      throw new ApiError(message, res.status);
    }
    return data as T;
  }

  listItems(pagePath?: string): Promise<{ items: Item[]; total: number }> {
    return this.request('GET', '/items', undefined, pagePath ? { page_path: pagePath } : undefined);
  }

  getItem(id: number): Promise<Item> {
    return this.request('GET', `/items/${id}`);
  }

  /**
   * Creates an item. With a screenshot, sends one multipart request (fields as a JSON "data"
   * part plus the image), so the item and its screenshot arrive together.
   */
  createItem(item: NewItem, screenshot?: Blob | null): Promise<Item> {
    if (!screenshot) return this.request('POST', '/items', item);
    const form = new FormData();
    form.append('data', JSON.stringify(item));
    form.append('screenshot', screenshot, 'screenshot.jpg');
    return this.request('POST', '/items', form);
  }

  /** Saves the reviewer's own overlay preferences to their WordPress user. */
  savePrefs(prefs: NonNullable<Config['prefs']>): Promise<NonNullable<Config['prefs']>> {
    return this.request('POST', '/me/prefs', prefs);
  }

  replaceScreenshot(id: number, screenshot: Blob): Promise<Item> {
    const form = new FormData();
    form.append('screenshot', screenshot, 'screenshot.jpg');
    return this.request('POST', `/items/${id}/screenshot`, form);
  }

  updateItem(
    id: number,
    changes: Partial<Pick<Item, 'title' | 'description' | 'status' | 'priority' | 'type' | 'assignee_id' | 'anchor' | 'due_date'>> & { assignee_source?: 'teamwork' | 'wordpress' }
  ): Promise<Item> {
    return this.request('PATCH', `/items/${id}`, changes);
  }

  deleteItem(id: number): Promise<{ deleted: boolean }> {
    return this.request('DELETE', `/items/${id}`);
  }

  addComment(id: number, body: string): Promise<{ comments: Comment[] }> {
    return this.request('POST', `/items/${id}/comments`, { body });
  }
}
