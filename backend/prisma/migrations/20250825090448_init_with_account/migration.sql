/*
  Warnings:

  - Added the required column `accountId` to the `Engagement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Engagement" ADD COLUMN     "accountId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_authUserId_key" ON "public"."Account"("authUserId");

-- AddForeignKey
ALTER TABLE "public"."Engagement" ADD CONSTRAINT "Engagement_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "public"."Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
