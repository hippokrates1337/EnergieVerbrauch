/*
  Warnings:

  - Added the required column `type` to the `Consumer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Consumer" ADD COLUMN     "type" TEXT NOT NULL;
