// backend/src/routes/analytics.ts
import { Router } from "express";
import { prisma } from "../db";

// Bucket a Date into "YYYY-MM"
function toYearMonth(d: Date) {
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1;
  return `${y}-${String(m).padStart(2, "0")}`;
}

export const analyticsRouter = Router();

// GET /analytics/engagement-frequency
analyticsRouter.get("/engagement-frequency", async (req, res) => {
  try {
    const accountId = req.accountId!; // set by auth middleware

    // Pull only fields we need, scoped to this account
    const rows = await prisma.engagement.findMany({
      where: { accountId },
      select: { talkDate: true, format: true, location: true }
    });

    // total
    const totalTalks = rows.length;

    // by format
    let inPerson = 0, online = 0;
    for (const r of rows) {
      if (r.format === "IN_PERSON") inPerson++;
      else if (r.format === "ONLINE") online++;
    }

    // by location
    const locMap = new Map<string, number>();
    for (const r of rows) {
      const key = r.location.trim();
      locMap.set(key, (locMap.get(key) ?? 0) + 1);
    }
    const byLocation = Array.from(locMap.entries())
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // over time (YYYY-MM buckets)
    const timeMap = new Map<string, number>();
    for (const r of rows) {
      // Prisma returns Date objects for DateTime; cast for safety then bucket
      const key = toYearMonth(new Date(r.talkDate));
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
