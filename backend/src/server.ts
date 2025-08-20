// backend/src/server.ts

import express from "express"; // Web server
import cors from "cors";       // Enables cross-origin requests (frontend -> backend)

// Create one Express app instance for our API
const app = express();

// Enable JSON body parsing (so req.body works for POST/PUT later)
app.use(express.json());

// Allow our frontend (running on a different port) to call this API in the browser
app.use(cors());

// --- ROUTES ---

// 1) Health check: quick way to verify the server is running
//    GET http://localhost:4000/health
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "api" });
});

// 2) Placeholder analytics endpoint for the Dashboard to call
//    We'll replace this with real DB aggregations soon.
app.get("/analytics/engagement-frequency", (_req, res) => {
  res.json({
    // Total number of talks
    totalTalks: 0,

    // Split by format for a donut/bar chart
    byFormat: { inPerson: 0, online: 0 },

    // Top locations e.g. [{ location: "London", count: 3 }]
    byLocation: [],

    // Time series e.g. [{ period: "2025-08", count: 2 }]
    overTime: []
  });
});

// Pick a port (Cloud Run will set PORT in production)
const port = process.env.PORT || 4000;

// Start the HTTP server
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
