// frontend/src/api.ts
export type EngagementInput = {
  // Client Details
  dealName: string;
  clientName: string;
  industry?: string;
  audience?: string;
  eventType?: string;
  // Talk Details
  talkTitle: string;
  talkDate: string;        // ISO date (YYYY-MM-DD)
  format: "IN_PERSON" | "ONLINE"; // Only allowed 2 values
  // Region Details
  location: string;
};

const BASE_URL = "http://localhost:4000"; // swap for Cloud Run url in prod

//Function to post new engagement to backend
export async function createEngagement(payload: EngagementInput) {
  const res = await fetch(`${BASE_URL}/engagements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  // If backend returns an error (non-200 response), throw
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create failed (${res.status}): ${text}`);
  }

  // Otherwise return the created object
  return res.json();
}


// Add API helpers for dashboard

// ---- Dashboard data helpers ----
export type EngagementFrequency = {
  totalTalks: number;
  byFormat: { inPerson: number; online: number };
  byLocation: { location: string; count: number }[];
  overTime: { period: string; count: number }[];
};

export async function getAnalytics(): Promise<EngagementFrequency> {
  const res = await fetch(`${BASE_URL}/analytics/engagement-frequency`);
  if (!res.ok) throw new Error(`Analytics failed (${res.status})`);
  return res.json();
}

export async function getEngagements() {
  const res = await fetch(`${BASE_URL}/engagements`);
  if (!res.ok) throw new Error(`List failed (${res.status})`);
  return res.json();
}

