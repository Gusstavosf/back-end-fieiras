/*
  Warnings:

  - You are about to drop the column `FieiraId` on the `ControlFieira` table. All the data in the column will be lost.
  - You are about to alter the column `orderQuantity` on the `ControlFieira` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,3)`.
  - You are about to drop the column `averageFieiraProduction` on the `Fieira` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Fieira` table. All the data in the column will be lost.
  - You are about to drop the column `FieiraId` on the `Requisition` table. All the data in the column will be lost.
  - You are about to drop the column `requisitionQty` on the `Requisition` table. All the data in the column will be lost.
  - You are about to drop the column `fieiraId` on the `RequisitionItem` table. All the data in the column will be lost.
  - You are about to drop the column `fieiraId` on the `ReservationFieira` table. All the data in the column will be lost.
  - You are about to drop the column `FieiraId` on the `StockFieira` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order]` on the table `ControlFieira` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cabinetId]` on the table `Fieira` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[width,thickness,tension]` on the table `Fieira` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[controlId,stockFieiraId]` on the table `ReservationFieira` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fieiraId,code]` on the table `StockFieira` will be added. If there are existing duplicate values, this will fail.
  - Made the column `createdAt` on table `Cabinet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Cabinet` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `material` to the `ControlFieira` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metal` to the `ControlFieira` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderCreateDate` to the `ControlFieira` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qtdFieiraNec` to the `ControlFieira` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `ControlFieira` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tension` to the `Fieira` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `Fieira` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Fieira` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `currentStockCapacity` to the `Requisition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fieiraId` to the `Requisition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `necessaryQty` to the `Requisition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestedQty` to the `Requisition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Requisition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `RequisitionItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fieiraId` to the `StockFieira` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequisitionType" AS ENUM ('production', 'free_stock');

-- CreateEnum
CREATE TYPE "RequisitionItemType" AS ENUM ('new', 'rework');

-- CreateEnum
CREATE TYPE "Metal" AS ENUM ('cu', 'al');

-- CreateEnum
CREATE TYPE "ControlStatus" AS ENUM ('open', 'released_printed', 'released_not_printed', 'completed', 'canceled');

-- DropForeignKey
ALTER TABLE "ControlFieira" DROP CONSTRAINT "ControlFieira_FieiraId_fkey";

-- DropForeignKey
ALTER TABLE "Requisition" DROP CONSTRAINT "Requisition_FieiraId_fkey";

-- DropForeignKey
ALTER TABLE "RequisitionItem" DROP CONSTRAINT "RequisitionItem_fieiraId_fkey";

-- DropForeignKey
ALTER TABLE "ReservationFieira" DROP CONSTRAINT "ReservationFieira_fieiraId_fkey";

-- DropForeignKey
ALTER TABLE "StockFieira" DROP CONSTRAINT "StockFieira_FieiraId_fkey";

-- DropIndex
DROP INDEX "Fieira_name_key";

-- DropIndex
DROP INDEX "StockFieira_FieiraId_code_key";

-- AlterTable
ALTER TABLE "Cabinet" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "ControlFieira" DROP COLUMN "FieiraId",
ADD COLUMN     "fieiraId" INTEGER,
ADD COLUMN     "material" INTEGER NOT NULL,
ADD COLUMN     "metal" "Metal" NOT NULL,
ADD COLUMN     "orderCreateDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "qtdFieiraNec" INTEGER NOT NULL,
ADD COLUMN     "status" "ControlStatus" NOT NULL,
ALTER COLUMN "orderQuantity" SET DATA TYPE DECIMAL(10,3);

-- AlterTable
ALTER TABLE "Fieira" DROP COLUMN "averageFieiraProduction",
DROP COLUMN "name",
ADD COLUMN     "tension" INTEGER NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Requisition" DROP COLUMN "FieiraId",
DROP COLUMN "requisitionQty",
ADD COLUMN     "currentStockCapacity" INTEGER NOT NULL,
ADD COLUMN     "fieiraId" INTEGER NOT NULL,
ADD COLUMN     "necessaryQty" INTEGER NOT NULL,
ADD COLUMN     "requestedQty" INTEGER NOT NULL,
ADD COLUMN     "type" "RequisitionType" NOT NULL;

-- AlterTable
ALTER TABLE "RequisitionItem" DROP COLUMN "fieiraId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "stockFieiraId" INTEGER,
ADD COLUMN     "supplierFieiraStockId" INTEGER,
ADD COLUMN     "type" "RequisitionItemType" NOT NULL;

-- AlterTable
ALTER TABLE "ReservationFieira" DROP COLUMN "fieiraId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "quantity" DECIMAL(10,3),
ADD COLUMN     "stockFieiraId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "StockFieira" DROP COLUMN "FieiraId",
ADD COLUMN     "fieiraId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "RequisitionControl" (
    "id" SERIAL NOT NULL,
    "requisitionId" INTEGER NOT NULL,
    "controlFieiraId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RequisitionControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierFieiraStock" (
    "id" SERIAL NOT NULL,
    "thickness" DECIMAL(10,2) NOT NULL,
    "width" DECIMAL(10,2) NOT NULL,
    "quantitySent" INTEGER NOT NULL,
    "quantityUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplierFieiraStock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierFieiraStockHistory" (
    "id" SERIAL NOT NULL,
    "supplierFieiraStockId" INTEGER NOT NULL,
    "quantitySent" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplierFieiraStockHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RequisitionControl_requisitionId_controlFieiraId_key" ON "RequisitionControl"("requisitionId", "controlFieiraId");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierFieiraStock_width_thickness_key" ON "SupplierFieiraStock"("width", "thickness");

-- CreateIndex
CREATE UNIQUE INDEX "ControlFieira_order_key" ON "ControlFieira"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Fieira_cabinetId_key" ON "Fieira"("cabinetId");

-- CreateIndex
CREATE UNIQUE INDEX "Fieira_width_thickness_tension_key" ON "Fieira"("width", "thickness", "tension");

-- CreateIndex
CREATE UNIQUE INDEX "ReservationFieira_controlId_stockFieiraId_key" ON "ReservationFieira"("controlId", "stockFieiraId");

-- CreateIndex
CREATE UNIQUE INDEX "StockFieira_fieiraId_code_key" ON "StockFieira"("fieiraId", "code");

-- AddForeignKey
ALTER TABLE "ControlFieira" ADD CONSTRAINT "ControlFieira_fieiraId_fkey" FOREIGN KEY ("fieiraId") REFERENCES "Fieira"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockFieira" ADD CONSTRAINT "StockFieira_fieiraId_fkey" FOREIGN KEY ("fieiraId") REFERENCES "Fieira"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requisition" ADD CONSTRAINT "Requisition_fieiraId_fkey" FOREIGN KEY ("fieiraId") REFERENCES "Fieira"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequisitionItem" ADD CONSTRAINT "RequisitionItem_stockFieiraId_fkey" FOREIGN KEY ("stockFieiraId") REFERENCES "StockFieira"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequisitionItem" ADD CONSTRAINT "RequisitionItem_supplierFieiraStockId_fkey" FOREIGN KEY ("supplierFieiraStockId") REFERENCES "SupplierFieiraStock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequisitionControl" ADD CONSTRAINT "RequisitionControl_requisitionId_fkey" FOREIGN KEY ("requisitionId") REFERENCES "Requisition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequisitionControl" ADD CONSTRAINT "RequisitionControl_controlFieiraId_fkey" FOREIGN KEY ("controlFieiraId") REFERENCES "ControlFieira"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationFieira" ADD CONSTRAINT "ReservationFieira_stockFieiraId_fkey" FOREIGN KEY ("stockFieiraId") REFERENCES "StockFieira"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierFieiraStockHistory" ADD CONSTRAINT "SupplierFieiraStockHistory_supplierFieiraStockId_fkey" FOREIGN KEY ("supplierFieiraStockId") REFERENCES "SupplierFieiraStock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
