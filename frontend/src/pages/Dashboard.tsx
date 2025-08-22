import { useEffect, useState } from "react";

type EngagementFrequency = {
  totalTalks: number;
  byFormat: { inPerson: number; online: number };
  byLocation: { location: string; count: number }[];
  overTime: { period: string; count: number }[];
};

export default function Dashboard() {
  const [data, setData] = useState<EngagementFrequency | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setError(null);
      setData(null);
      const res = await fetch("http://localhost:4000/analytics/engagement-frequency");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (e: any) {
      setError(String(e));
    }
  }

  useEffect(() => {
    load();
  }, []); // runs on mount

  return (
    <main style={{ padding: 24 }}>
      <h2>Dashboard</h2>
      <button onClick={load} style={{ marginBottom: 12 }}>Refresh</button>

      {!data && !error && <p>Loading analytics…</p>}
      {error && <p>Failed to load: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </main>
  );
}
