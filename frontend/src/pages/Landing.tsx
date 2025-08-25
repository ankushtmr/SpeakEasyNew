// frontend/src/pages/Landing.tsx
import { Link } from "react-router-dom";
import AuthButtons from "../components/AuthButtons"; // Import login/logout buttons

export default function Landing() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Speak Easy</h1>
      <p>Track your speaking gigs and see clear insights.</p>

      {/* 🔹 Auth buttons (Login / Logout) */}
      <AuthButtons />

      <p style={{ marginTop: "1rem" }}>
        <Link to="/dashboard">Go to Dashboard</Link> ·{" "}
        <Link to="/add">Add Engagement</Link>
      </p>
    </main>
  );
}
