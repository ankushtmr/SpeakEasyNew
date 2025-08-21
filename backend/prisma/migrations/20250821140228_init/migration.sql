-- CreateEnum
CREATE TYPE "public"."Format" AS ENUM ('IN_PERSON', 'ONLINE');

-- CreateTable
CREATE TABLE "public"."Engagement" (
    "id" TEXT NOT NULL,
    "dealName" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "industry" TEXT,
    "audience" TEXT,
    "eventType" TEXT,
    "talkTitle" TEXT NOT NULL,
    "talkDate" TIMESTAMP(3) NOT NULL,
    "format" "public"."Format" NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Engagement_pkey" PRIMARY KEY ("id")
);
