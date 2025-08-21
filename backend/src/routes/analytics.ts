// backend/src/routes/analytics.ts
import { Router } from "express";
import { prisma } from "../db";

// Helpers
function toYearMonth(d: Date) {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1;
  return `${y}-${String(m).padStart(2, "0")}`; // e.g., "2025-08"
}

export const analyticsRouter = Router();

// GET /analytics/engagement-frequency
analyticsRouter.get("/engagement-frequency", async (_req, res) => {
  try {
    const all = await prisma.engagement.findMany({
      select: { talkDate: true, format: true, location: true }
    });

    // total
    const totalTalks = all.length;

    // by format
    let inPerson = 0, online = 0;
    for (const row of all) {
      if (row.format === "IN_PERSON") inPerson++;
      if (row.format === "ONLINE") online++;
    }

    // by location
    const locMap = new Map<string, number>();
    for (const row of all) {
      const key = row.location.trim();
      locMap.set(key, (locMap.get(key) ?? 0) + 1);
    }
    const byLocation = Array.from(locMap.entries())
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // top 10

    // over time (bucket per YYYY-MM)
    const timeMap = new Map<string, number>();
    for (const row of all) {
      const key = toYearMonth(new Date(row.talkDate));
      timeMap.set(key, (timeMap.get(key) ?? 0) + 1);
    }
    const overTime = Array.from(timeMap.entries())
      .map(([period, count]) => ({ period, count }))
      .sort((a, b) => a.period.localeCompare(b.period));

    res.json({
      totalTalks,
      byFormat: { inPerson, online },
      byLocation,
      overTime
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to compute analytics" });
  }
});
