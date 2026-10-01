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
    const res = await fetch(this.url(path, params), {
      method,
      credentials: 'same-origin',
      headers: {
        'X-WP-Nonce': this.cfg.nonce,
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
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

  createItem(item: NewItem): Promise<Item> {
    return this.request('POST', '/items', item);
  }

  updateItem(id: number, changes: Partial<Pick<Item, 'title' | 'description' | 'status' | 'priority' | 'type' | 'assignee_id' | 'anchor'>>): Promise<Item> {
    return this.request('PATCH', `/items/${id}`, changes);
  }

  deleteItem(id: number): Promise<{ deleted: boolean }> {
    return this.request('DELETE', `/items/${id}`);
  }

  addComment(id: number, body: string): Promise<{ comments: Comment[] }> {
    return this.request('POST', `/items/${id}/comments`, { body });
  }
}
