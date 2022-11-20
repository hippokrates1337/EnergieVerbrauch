/*
  Warnings:

  - You are about to drop the `Observation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ObservationUnit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Observation";

-- DropTable
DROP TABLE "ObservationUnit";

-- CreateTable
CREATE TABLE "Consumer" (
    "uid" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Consumer_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Reading" (
    "uid" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "consumer" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reading_pkey" PRIMARY KEY ("uid")
);
