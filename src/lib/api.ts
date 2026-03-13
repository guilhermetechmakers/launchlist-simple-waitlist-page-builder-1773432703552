/**
 * Lightweight fetch-based API client for non-Supabase endpoints.
 * Supabase data/auth use the Supabase client; Edge Functions are invoked via supabase.functions.invoke.
 */

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const base =
    import.meta.env.VITE_API_URL ?? import.meta.env.VITE_SUPABASE_URL ?? "";
  const url = endpoint.startsWith("http") ? endpoint : `${base}${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    if (res.status === 401) {
      window.location.href = "/login";
    }
    throw new Error(`API Error: ${res.status}`);
  }
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) =>
    apiRequest<T>(endpoint, { method: "POST", body: JSON.stringify(data) }),
  put: <T>(endpoint: string, data: unknown) =>
    apiRequest<T>(endpoint, { method: "PUT", body: JSON.stringify(data) }),
  patch: <T>(endpoint: string, data: unknown) =>
    apiRequest<T>(endpoint, { method: "PATCH", body: JSON.stringify(data) }),
  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: "DELETE" }),
};
