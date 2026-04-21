const rawApiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").trim();

// Empty base URL uses Vite dev proxy (/api -> localhost:8383 by default).
export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
