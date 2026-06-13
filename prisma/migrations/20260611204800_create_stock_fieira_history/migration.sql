/*
  Warnings:

  - A unique constraint covering the columns `[cabinetId,code]` on the table `StockFieira` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "StockFieiraHistory" (
    "id" SERIAL NOT NULL,
    "stockFieiraId" INTEGER NOT NULL,
    "status" "StatusFieira" NOT NULL,
    "thickness" DECIMAL(10,2) NOT NULL,
    "width" DECIMAL(10,2) NOT NULL,
    "production" INTEGER NOT NULL,
    "utilization" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockFieiraHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StockFieira_cabinetId_code_key" ON "StockFieira"("cabinetId", "code");

-- AddForeignKey
ALTER TABLE "StockFieiraHistory" ADD CONSTRAINT "StockFieiraHistory_stockFieiraId_fkey" FOREIGN KEY ("stockFieiraId") REFERENCES "StockFieira"("id") ON DELETE CASCADE ON UPDATE CASCADE;
