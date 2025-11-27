export async function fetchJson<T = unknown>(
    input: RequestInfo | URL,
    init: RequestInit = {}
  ): Promise<T> {
    const headers = new Headers(init.headers || {});
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    
    const url = process.env.NEXT_PUBLIC_JARAYID_API_URL;
    if(!url) {
      throw new Error("Invalid url provided");
    }
    
    const finalUrl = url + input;
    
    const res = await fetch(finalUrl, { ...init, headers });
    let body: unknown = null;
    try { body = await res.json(); } catch { /* non-JSON res */ }
  
    if (!res.ok) {
      const message = (body && typeof body === 'object' && ('message' in body || 'error' in body))
        ? (body as { message?: string; error?: string }).message || (body as { message?: string; error?: string }).error
        : `HTTP ${res.status}`;
      const err = new Error(message) as Error & { status?: number; body?: unknown };
      err.status = res.status;
      err.body = body;
      throw err;
    }
    return body as T;
  }
