import { storage } from '@/utils/storage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(path: string, params?: FetchOptions['params']) {
  const url = new URL(
    path.startsWith('http') ? path : `${BASE_URL}${path}`,
    window.location.origin,
  );
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function request<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...rest } = options;
  const token = storage.getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { 'X-Authorization': `Bearer ${token}` } : {}),
    ...rest.headers,
  };

  const resp = await fetch(buildUrl(path, params), {
    ...rest,
    headers,
    credentials: 'include',
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '请求失败');
    throw new Error(text || `HTTP ${resp.status}`);
  }

  const contentType = resp.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return (await resp.json()) as T;
  }
  return (await resp.text()) as T;
}

export const http = {
  get: <T = unknown>(path: string, options?: FetchOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T = unknown>(path: string, body?: unknown, options?: FetchOptions) =>
    request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T = unknown>(path: string, body?: unknown, options?: FetchOptions) =>
    request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T = unknown>(path: string, options?: FetchOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};

export { BASE_URL };
