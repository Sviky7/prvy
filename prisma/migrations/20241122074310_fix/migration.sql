/*
  Warnings:

  - You are about to drop the column `email` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `Session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "email",
DROP COLUMN "emailVerified";
