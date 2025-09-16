const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

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

async function request(path, { method = "GET", params, body, headers } = {}) {
  const requestUrl = buildUrl(path, params);
  const init = {
    method,
    headers: {
      Accept: "application/json",
      ...headers,
    },
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers["Content-Type"] = "application/json";
  }

  let response;
  try {
    response = await fetch(requestUrl, init);
  } catch (networkError) {
    const error = new Error("Network error while contacting the API");
    error.cause = networkError;
    error.status = 0;
    throw error;
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  let payload = null;

  if (response.status !== 204) {
    try {
      payload = isJson ? await response.json() : await response.text();
    } catch (parseError) {
      payload = null;
    }
  }

  if (!response.ok) {
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

export const apiClient = {
  get: (path, opts) => request(path, { ...opts, method: "GET" }),
  post: (path, body, opts) => request(path, { ...opts, method: "POST", body }),
  put: (path, body, opts) => request(path, { ...opts, method: "PUT", body }),
  delete: (path, opts) => request(path, { ...opts, method: "DELETE" }),
};
