/*
  Warnings:

  - Made the column `utilization` on table `StockFieira` required. This step will fail if there are existing NULL values in that column.
  - Made the column `production` on table `StockFieira` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "StockFieira" ALTER COLUMN "utilization" SET NOT NULL,
ALTER COLUMN "utilization" SET DEFAULT 0,
ALTER COLUMN "production" SET NOT NULL,
ALTER COLUMN "production" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "StockFieiraHistory" ALTER COLUMN "thickness" DROP NOT NULL,
ALTER COLUMN "width" DROP NOT NULL,
ALTER COLUMN "production" SET DEFAULT 0,
ALTER COLUMN "utilization" SET DEFAULT 0;
