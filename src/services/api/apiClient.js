const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
let unauthorizedHandler = null;

export function registerUnauthorizedHandler(handler) {
  unauthorizedHandler = typeof handler === "function" ? handler : null;
}

function buildUrl(path, params) {
  const url = new URL(BASE_URL + path, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.append(key, value);
      }
    });
  }
  return url.toString();
}

function authHeader() {
  const authToken = sessionStorage.getItem("authToken");
  return authToken ? { Authorization: authToken } : {};
}

async function handleResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  let payload = null;

  if (response.status !== 204) {
    try {
      payload = isJson ? await response.json() : await response.text();
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      unauthorizedHandler?.();
    }
    const error = new Error(
      (payload && payload.message) || response.statusText || "Request failed"
    );
    error.status = response.status;
    error.code = payload?.code;
    error.details = payload?.details;
    error.payload = payload;
    throw error;
  }

  return response.status === 204 ? null : payload;
}

async function request(path, { method = "GET", params, body, headers, signal } = {}) {
  const requestUrl = buildUrl(path, params);
  const init = {
    method,
    headers: {
      Accept: "application/json",
      ...authHeader(),
      ...headers,
    },
    signal,
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers["Content-Type"] = "application/json";
  }

  let response;
  try {
    response = await fetch(requestUrl, init);
  } catch (networkError) {
    if (networkError.name === "AbortError") throw networkError;
    const error = new Error("Network error while contacting the API");
    error.cause = networkError;
    error.status = 0;
    throw error;
  }

  return handleResponse(response);
}

/**
 * Multipart upload. Browser sets Content-Type with the boundary; do NOT set it manually.
 */
async function uploadRequest(path, { method = "PUT", formData, params, headers, signal } = {}) {
  const requestUrl = buildUrl(path, params);
  let response;
  try {
    response = await fetch(requestUrl, {
      method,
      headers: { Accept: "application/json", ...authHeader(), ...headers },
      body: formData,
      signal,
    });
  } catch (networkError) {
    if (networkError.name === "AbortError") throw networkError;
    const error = new Error("Network error while uploading file");
    error.cause = networkError;
    error.status = 0;
    throw error;
  }
  return handleResponse(response);
}

export const apiClient = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
  upload: (path, formData, opts) => uploadRequest(path, { ...opts, method: "PUT", formData }),
};

/**
 * Build a public image URL for an asset. Append `?v={etag}` to bust the browser cache
 * when the image is replaced.
 */
export function buildImageUrl(ownerType, ownerId, version) {
  if (!ownerType || !ownerId) return null;
  const path = `/images/${encodeURIComponent(ownerType)}/${encodeURIComponent(ownerId)}`;
  const url = buildUrl(path);
  return version ? `${url}?v=${encodeURIComponent(version)}` : url;
}
