import express from "express";
import cors from "cors";
import { engagementsRouter } from "./routes/engagements";

const app = express();
app.use(express.json());
app.use(cors());

// Health
app.get("/health", (_req, res) => res.json({ ok: true, service: "api" }));

// Engagements CRUD
app.use("/engagements", engagementsRouter);

// Placeholder analytics (will be replaced below)
app.get("/analytics/engagement-frequency", (_req, res) => {
  res.json({
    totalTalks: 0,
    byFormat: { inPerson: 0, online: 0 },
    byLocation: [],
    overTime: []
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
