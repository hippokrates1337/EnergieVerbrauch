/*
  Warnings:

  - Added the required column `obsUnit` to the `Observation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Observation" ADD COLUMN     "obsUnit" TEXT NOT NULL;
