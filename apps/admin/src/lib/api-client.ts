const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ??
  "http://localhost:3000";

export interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  meta: { page: number; per_page: number; total: number; total_pages: number } | null;
  error: { code: string; message: string; details?: Record<string, unknown> } | null;
}

export class ApiError extends Error {
  code: string;
  details?: Record<string, unknown>;

  constructor(code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.details = details;
  }
}

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken") || localStorage.getItem("token") || null;
  }
  return null;
}

async function doFetch<T>(path: string, init: RequestInit): Promise<{ status: number; envelope: ApiEnvelope<T> }> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) headers.set("Content-Type", "application/json");

  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    const fullUrl = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
    response = await fetch(fullUrl, { ...init, headers, credentials: "include" });
  } catch {
    return {
      status: 0,
      envelope: {
        success: false,
        data: null,
        meta: null,
        error: {
          code: "NETWORK_ERROR",
          message: `Unable to connect to server at ${API_BASE_URL}. Ensure backend is running.`,
        },
      },
    };
  }

  let envelope: ApiEnvelope<T>;
  try {
    envelope = (await response.json()) as ApiEnvelope<T>;
  } catch {
    envelope = {
      success: false,
      data: null,
      meta: null,
      error: { code: "NETWORK_ERROR", message: "Couldn't reach the server." },
    };
  }

  return { status: response.status, envelope };
}

export async function tryRefresh(): Promise<boolean> {
  const { status, envelope } = await doFetch<{ access_token: string }>("/api/v1/auth/refresh", {
    method: "POST",
  });
  if (status === 200 && envelope.data?.access_token) {
    setAccessToken(envelope.data.access_token);
    return true;
  }
  return false;
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  opts: { skipRefreshRetry?: boolean } = {}
): Promise<T> {
  let { status, envelope } = await doFetch<T>(path, init);

  if (!opts.skipRefreshRetry && status === 401 && path !== "/api/v1/auth/refresh") {
    const refreshed = await tryRefresh();
    if (refreshed) {
      ({ status, envelope } = await doFetch<T>(path, init));
    }
  }

  if (!envelope.success || envelope.error) {
    throw new ApiError(
      envelope.error?.code ?? "UNKNOWN_ERROR",
      envelope.error?.message ?? "Something went wrong.",
      envelope.error?.details
    );
  }

  return envelope.data as T;
}

export async function apiFetchBlob(path: string): Promise<Blob> {
  const headers = new Headers();
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE_URL}${path}`, { headers, credentials: "include" });
  if (!response.ok) throw new ApiError("EXPORT_FAILED", "Couldn't export the file.");
  return response.blob();
}
