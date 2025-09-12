// src/services/apiClient.js
const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

function buildUrl(path, params) {
  const url = new URL(BASE_URL + path, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.append(k, v);
      }
    });
  }
  return url.toString();
}

async function request(path, { method = 'GET', params, body } = {}) {
    const res = await fetch(buildUrl(path, params), {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText} — ${text}`);
  }
  // Spring devuelve JSON en todos estos endpoints
  return res.status !== 204 ? res.json() : null;
}

export const apiClient = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
