// frontend/src/api.ts

// ---- Types the app uses ----
export type EngagementInput = {
  // Client Details
  dealName: string;
  clientName: string;
  industry?: string;
  audience?: string;
  eventType?: string;

  // Talk Details
  talkTitle: string;
  talkDate: string; // ISO date (YYYY-MM-DD)
  format: "IN_PERSON" | "ONLINE";

  // Region Details
  location: string;
};

export type EngagementFrequency = {
  totalTalks: number;
  byFormat: { inPerson: number; online: number };
  byLocation: { location: string; count: number }[];
  overTime: { period: string; count: number }[];
};

// ---- Base URL for your backend ----
// (In prod you'll change this to your Cloud Run URL)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// ---- Small helper to call the API ----
// If a token is provided, it sends `Authorization: Bearer <token>`
// so the backend can verify the user.
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

// ---- API functions your pages call ----

// Create an engagement (used by AddEngagement.tsx)
export function createEngagement(data: EngagementInput, token?: string) {
  return apiFetch("/engagements", { method: "POST", body: JSON.stringify(data) }, token);
}

// Get analytics for the dashboard
export function getEngagementFrequency(token?: string) {
  return apiFetch<EngagementFrequency>("/analytics/engagement-frequency", {}, token);
}

// (Optional) list engagements
export function listEngagements(token?: string) {
  return apiFetch("/engagements", {}, token);
}
