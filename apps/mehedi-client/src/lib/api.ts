const API = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const BROWSER_API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export function apiUrl(path: string, opts: { server?: boolean } = {}): string {
  const base = opts.server ? API : BROWSER_API;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

type FetchOptions = RequestInit & { token?: string | null; server?: boolean };

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { token, server, headers, ...rest } = options;
  const res = await fetch(apiUrl(path, { server }), {
    ...rest,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    const message = typeof err.error === 'string' ? err.error : 'Request failed';
    throw new Error(message);
  }
  return (await res.json()) as T;
}
