import express from "express";
import cors from "cors";
import { engagementsRouter } from "./routes/engagements";
import { analyticsRouter } from "./routes/analytics";
import { requireJwt, attachAccount } from "./auth";

const app = express();
app.use(express.json());
app.use(cors());


// Health
app.get("/health", (_req, res) => res.json({ ok: true, service: "api" }));

//Everything below requires a valid JWT and will set req.accountId
app.use(requireJwt, attachAccount);

// Protected routers
app.use("/engagements", engagementsRouter);
app.use("/analytics", analyticsRouter);


const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
