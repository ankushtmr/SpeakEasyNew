
import { useEffect, useState } from "react";

// This describes exactly what the API returns.
// TS will warn us if the response doesn't match.
type EngagementFrequency = {
  totalTalks: number;
  byFormat: { inPerson: number; online: number };
  byLocation: { location: string; count: number }[];
  overTime: { period: string; count: number }[];
};

export default function Dashboard() {
  // Local state for data and errors
  const [data, setData] = useState<EngagementFrequency | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch once after the component mounts
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          "http://localhost:4000/analytics/engagement-frequency",
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: EngagementFrequency = await res.json();
        setData(json);
      } catch (e: unknown) {
        // Ignore abort errors when the component unmounts
        if ((e as any)?.name === "AbortError") return;
        setError(String(e));
      }
    })();

    // Cleanup: cancels the request if user leaves the page mid‑fetch
    return () => controller.abort();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h2>Dashboard</h2>

      {/* while waiting for the network request */}
      {!data && !error && <p>Loading analytics…</p>}

      {/* if something went wrong */}
      {error && <p>Failed to load: {error}</p>}

      {/* show the raw JSON for now; charts come later */}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </main>
  );
}
