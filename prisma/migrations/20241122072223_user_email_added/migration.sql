/*
  Warnings:

  - Added the required column `email` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "emailVerified" TIMESTAMP(3);
