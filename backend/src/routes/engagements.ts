// backend/src/routes/engagements.ts
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db";

// Validation schema for creating an engagement
const createEngagementSchema = z.object({
  dealName: z.string().min(1),
  clientName: z.string().min(1),
  industry: z.string().optional(),
  audience: z.string().optional(),
  eventType: z.string().optional(),

  talkTitle: z.string().min(1),
  talkDate: z.string().or(z.date()), // accept ISO string or Date (we'll convert)
  format: z.enum(["IN_PERSON", "ONLINE"]),

  location: z.string().min(1)
});

// Query filters for GET /engagements
const listQuerySchema = z.object({
  from: z.string().optional(),  // ISO date string
  to: z.string().optional(),    // ISO date string
  format: z.enum(["IN_PERSON", "ONLINE"]).optional(),
  location: z.string().optional(),
  q: z.string().optional()      // free-text contains title/deal/client
});

export const engagementsRouter = Router();

// CREATE
engagementsRouter.post("/", async (req, res) => {
  const parsed = createEngagementSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const data = parsed.data;

  // normalize talkDate (string -> Date)
  const talkDate =
    typeof data.talkDate === "string" ? new Date(data.talkDate) : data.talkDate;

  try {
    const created = await prisma.engagement.create({
      data: {
        dealName: data.dealName,
        clientName: data.clientName,
        industry: data.industry,
        audience: data.audience,
        eventType: data.eventType,
        talkTitle: data.talkTitle,
        talkDate,
        format: data.format,
        location: data.location
      }
    });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create engagement" });
  }
});

// LIST
engagementsRouter.get("/", async (req, res) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  const { from, to, format, location, q } = parsed.data;

  const where: any = {};

  if (from || to) {
    where.talkDate = {};
    if (from) where.talkDate.gte = new Date(from);
    if (to) where.talkDate.lte = new Date(to);
  }
  if (format) where.format = format;
  if (location) where.location = { contains: location, mode: "insensitive" };

  if (q) {
    where.OR = [
      { talkTitle:   { contains: q, mode: "insensitive" } },
      { dealName:    { contains: q, mode: "insensitive" } },
      { clientName:  { contains: q, mode: "insensitive" } }
    ];
  }

  try {
    const rows = await prisma.engagement.findMany({
      where,
      orderBy: { talkDate: "desc" },
      take: 100
    });
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch engagements" });
  }
});
