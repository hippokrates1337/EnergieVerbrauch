/*
  Warnings:

  - Added the required column `adults` to the `Consumer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `area` to the `Consumer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `children` to the `Consumer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Consumer" ADD COLUMN     "adults" INTEGER NOT NULL,
ADD COLUMN     "area" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "children" INTEGER NOT NULL;
