// frontend/src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import type { EngagementFrequency } from "../api";          // type‑only import
import { getEngagementFrequency } from "../api";            // API helper that needs a token
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, ResponsiveContainer
} from "recharts";

// (We won't set custom colors in this POC; Recharts defaults are fine)

export default function Dashboard() {
  const { getAccessTokenSilently } = useAuth0();

  const [data, setData] = useState<EngagementFrequency | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      // 🔐 Get a JWT for our API's audience, then call the endpoint
      const token = await getAccessTokenSilently({
  authorizationParams: {
    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
    scope: "openid profile email"
  }
});
      const json = await getEngagementFrequency(token);

      setData(json);
    } catch (e: any) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h2>Dashboard</h2>

      <div style={{ marginBottom: 12 }}>
        <button onClick={load} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {!data && !error && <p>Loading analytics…</p>}
      {error && <p style={{ color: "crimson" }}>Failed to load: {error}</p>}
      {data && <DashboardContent data={data} />}
    </main>
  );
}

function DashboardContent({ data }: { data: EngagementFrequency }) {
  // Transform analytics JSON into chart-friendly arrays
  const kpis = [{ label: "Total Talks", value: data.totalTalks }];

  const formatData = [
    { name: "In‑Person", value: data.byFormat.inPerson },
    { name: "Online", value: data.byFormat.online }
  ];

  const locationData = data.byLocation.map(d => ({
    name: d.location,
    value: d.count
  }));

  const timeData = data.overTime.map(d => ({
    period: d.period,
    value: d.count
  }));

  return (
    <section style={{ display: "grid", gap: 24, gridTemplateColumns: "1fr" }}>
      {/* KPI tile */}
      <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h3 style={{ margin: "0 0 8px" }}>Total Talks</h3>
        <div style={{ fontSize: 32, fontWeight: 700 }}>{kpis[0].value}</div>
      </div>

      {/* Talks by Format (Donut) */}
      <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h3 style={{ margin: "0 0 8px" }}>Talks by Format</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={formatData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              label
            >
              {formatData.map((_, i) => <Cell key={i} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top Locations (Bar) */}
      <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h3 style={{ margin: "0 0 8px" }}>Top Locations</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={locationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={60} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Talks Over Time (Line) */}
      <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h3 style={{ margin: "0 0 8px" }}>Talks Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="value" dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
