/*
  Warnings:

  - You are about to drop the `armarios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `controle_fieiras` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estoque_fieiras` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `requisicao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `requisicao_posicao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reserva_fieira` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusFieira" AS ENUM ('new', 'requested', 'dead', 'polished');

-- DropForeignKey
ALTER TABLE "controle_fieiras" DROP CONSTRAINT "controle_fieiras_armario_id_fkey";

-- DropForeignKey
ALTER TABLE "estoque_fieiras" DROP CONSTRAINT "estoque_fieiras_id_armario_fkey";

-- DropForeignKey
ALTER TABLE "requisicao" DROP CONSTRAINT "requisicao_id_armario_fkey";

-- DropForeignKey
ALTER TABLE "requisicao_posicao" DROP CONSTRAINT "requisicao_posicao_id_fieira_fkey";

-- DropForeignKey
ALTER TABLE "requisicao_posicao" DROP CONSTRAINT "requisicao_posicao_id_requisicao_fkey";

-- DropForeignKey
ALTER TABLE "reserva_fieira" DROP CONSTRAINT "reserva_fieira_id_fieira_fkey";

-- DropForeignKey
ALTER TABLE "reserva_fieira" DROP CONSTRAINT "reserva_fieira_id_ordem_fkey";

-- DropTable
DROP TABLE "armarios";

-- DropTable
DROP TABLE "controle_fieiras";

-- DropTable
DROP TABLE "estoque_fieiras";

-- DropTable
DROP TABLE "requisicao";

-- DropTable
DROP TABLE "requisicao_posicao";

-- DropTable
DROP TABLE "reserva_fieira";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Cabinet" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "width" DECIMAL(10,2) NOT NULL,
    "thickness" DECIMAL(10,2) NOT NULL,
    "nominalFieiraCapacity" INTEGER NOT NULL,
    "averageFieiraProduction" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cabinet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlFieira" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "wireType" TEXT NOT NULL,
    "tension" INTEGER NOT NULL,
    "width" DECIMAL(10,2) NOT NULL,
    "thickness" DECIMAL(10,2) NOT NULL,
    "cabinetId" INTEGER NOT NULL,
    "orderStartDate" TIMESTAMP(3) NOT NULL,
    "orderEndDate" TIMESTAMP(3) NOT NULL,
    "orderQuantity" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ControlFieira_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockFieira" (
    "id" SERIAL NOT NULL,
    "cabinetId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "status" "StatusFieira" NOT NULL,
    "currentThickness" DECIMAL(10,2),
    "currentWidth" DECIMAL(10,2),
    "utilization" INTEGER,
    "production" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockFieira_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requisition" (
    "id" SERIAL NOT NULL,
    "cabinetId" INTEGER NOT NULL,
    "currentStockQty" INTEGER NOT NULL,
    "requisitionQty" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Requisition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequisitionItem" (
    "id" SERIAL NOT NULL,
    "requisitionId" INTEGER NOT NULL,
    "fieiraId" INTEGER NOT NULL,

    CONSTRAINT "RequisitionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservationFieira" (
    "id" SERIAL NOT NULL,
    "controlId" INTEGER NOT NULL,
    "fieiraId" INTEGER NOT NULL,

    CONSTRAINT "ReservationFieira_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cabinet_name_key" ON "Cabinet"("name");

-- AddForeignKey
ALTER TABLE "ControlFieira" ADD CONSTRAINT "ControlFieira_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "Cabinet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockFieira" ADD CONSTRAINT "StockFieira_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "Cabinet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requisition" ADD CONSTRAINT "Requisition_cabinetId_fkey" FOREIGN KEY ("cabinetId") REFERENCES "Cabinet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequisitionItem" ADD CONSTRAINT "RequisitionItem_fieiraId_fkey" FOREIGN KEY ("fieiraId") REFERENCES "StockFieira"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequisitionItem" ADD CONSTRAINT "RequisitionItem_requisitionId_fkey" FOREIGN KEY ("requisitionId") REFERENCES "Requisition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationFieira" ADD CONSTRAINT "ReservationFieira_fieiraId_fkey" FOREIGN KEY ("fieiraId") REFERENCES "StockFieira"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationFieira" ADD CONSTRAINT "ReservationFieira_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "ControlFieira"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
