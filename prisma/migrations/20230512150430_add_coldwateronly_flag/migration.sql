/*
  Warnings:

  - Added the required column `coldWaterOnly` to the `Consumer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Consumer" ADD COLUMN     "coldWaterOnly" BOOLEAN NOT NULL;
