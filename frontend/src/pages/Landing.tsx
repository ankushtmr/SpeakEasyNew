import { Link } from "react-router-dom";
export default function Landing() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Speak Easy</h1>
      <p>Track your speaking gigs and see clear insights.</p>
      <p>
        <Link to="/dashboard">Go to Dashboard</Link> ·{" "}
        <Link to="/add">Add Engagement</Link>
      </p>
    </main>
  );
}
