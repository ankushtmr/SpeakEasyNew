// backend/src/db.ts
import { PrismaClient } from "@prisma/client";

// Create a single shared Prisma client (avoids re-creating on reloads)
export const prisma = new PrismaClient();
