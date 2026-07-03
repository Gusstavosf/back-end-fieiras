/*
  Warnings:

  - You are about to drop the column `averageFieiraProduction` on the `Cabinet` table. All the data in the column will be lost.
  - You are about to drop the column `nominalFieiraCapacity` on the `Cabinet` table. All the data in the column will be lost.
  - You are about to drop the column `thickness` on the `Cabinet` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Cabinet` table. All the data in the column will be lost.
  - You are about to drop the column `cabinetId` on the `ControlFieira` table. All the data in the column will be lost.
  - You are about to drop the column `cabinetId` on the `Requisition` table. All the data in the column will be lost.
  - You are about to drop the column `cabinetId` on the `StockFieira` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[FieiraId,code]` on the table `StockFieira` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `FieiraId` to the `ControlFieira` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FieiraId` to the `Requisition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FieiraId` to the `StockFieira` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ControlFieira" DROP CONSTRAINT "ControlFieira_cabinetId_fkey";

-- DropForeignKey
ALTER TABLE "Requisition" DROP CONSTRAINT "Requisition_cabinetId_fkey";

-- DropForeignKey
ALTER TABLE "StockFieira" DROP CONSTRAINT "StockFieira_cabinetId_fkey";

-- DropIndex
DROP INDEX "StockFieira_cabinetId_code_key";

-- AlterTable
ALTER TABLE "Cabinet" DROP COLUMN "averageFieiraProduction",
DROP COLUMN "nominalFieiraCapacity",
DROP COLUMN "thickness",
DROP COLUMN "width";

-- AlterTable
ALTER TABLE "ControlFieira" DROP COLUMN "cabinetId",
ADD COLUMN     "FieiraId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Requisition" DROP COLUMN "cabinetId",
ADD COLUMN     "FieiraId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StockFieira" DROP COLUMN "cabinetId",
ADD COLUMN     "FieiraId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Fieira" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cabinetId" INTEGER,
    "width" DECIMAL(10,2) NOT NULL,
    "thickness" DECIMAL(10,2) NOT NULL,
    "nominalFieiraCapacity" INTEGER NOT NULL,
    "averageFieiraProduction" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fieira_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Fieira_name_key" ON "Fieira"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StockFieira_FieiraId_code_key" ON "StockFieira"("FieiraId", "code");

-- AddForeignKey
ALTER TABLE "Fieira" ADD CONSTRAINT "Fieira_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "Cabinet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlFieira" ADD CONSTRAINT "ControlFieira_FieiraId_fkey" FOREIGN KEY ("FieiraId") REFERENCES "Fieira"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockFieira" ADD CONSTRAINT "StockFieira_FieiraId_fkey" FOREIGN KEY ("FieiraId") REFERENCES "Fieira"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requisition" ADD CONSTRAINT "Requisition_FieiraId_fkey" FOREIGN KEY ("FieiraId") REFERENCES "Fieira"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
