-- CreateEnum
CREATE TYPE "Status" AS ENUM ('nova', 'requisicao', 'morta', 'polida');

-- CreateTable
CREATE TABLE "armarios" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "largura" DECIMAL(10,2) NOT NULL,
    "espessura" DECIMAL(10,2) NOT NULL,
    "capacidade_nominal_fieira" INTEGER NOT NULL,
    "producao_media_fieira" INTEGER,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "armarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "controle_fieiras" (
    "id" SERIAL NOT NULL,
    "ordem" INTEGER NOT NULL,
    "tipo_fio" TEXT NOT NULL,
    "tensao" INTEGER NOT NULL,
    "largura" DECIMAL(10,2) NOT NULL,
    "espessura" DECIMAL(10,2) NOT NULL,
    "armario_id" INTEGER NOT NULL,
    "data_inicio_ordem" TIMESTAMP(3) NOT NULL,
    "data_fim_ordem" TIMESTAMP(3) NOT NULL,
    "qtd_ordem" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "controle_fieiras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estoque_fieiras" (
    "id" SERIAL NOT NULL,
    "id_armario" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "espessura_atual" DECIMAL(10,2),
    "largura_atual" DECIMAL(10,2),
    "utilizacao" INTEGER,
    "producao" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estoque_fieiras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requisicao" (
    "id" SERIAL NOT NULL,
    "id_armario" INTEGER NOT NULL,
    "qtd_estoque_atual" INTEGER NOT NULL,
    "qtd_requisicao" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requisicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requisicao_posicao" (
    "id" SERIAL NOT NULL,
    "id_requisicao" INTEGER NOT NULL,
    "id_fieira" INTEGER NOT NULL,

    CONSTRAINT "requisicao_posicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserva_fieira" (
    "id" SERIAL NOT NULL,
    "id_ordem" INTEGER NOT NULL,
    "id_fieira" INTEGER NOT NULL,

    CONSTRAINT "reserva_fieira_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "armarios_name_key" ON "armarios"("name");

-- AddForeignKey
ALTER TABLE "controle_fieiras" ADD CONSTRAINT "controle_fieiras_armario_id_fkey" FOREIGN KEY ("armario_id") REFERENCES "armarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estoque_fieiras" ADD CONSTRAINT "estoque_fieiras_id_armario_fkey" FOREIGN KEY ("id_armario") REFERENCES "armarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisicao" ADD CONSTRAINT "requisicao_id_armario_fkey" FOREIGN KEY ("id_armario") REFERENCES "armarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisicao_posicao" ADD CONSTRAINT "requisicao_posicao_id_fieira_fkey" FOREIGN KEY ("id_fieira") REFERENCES "estoque_fieiras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisicao_posicao" ADD CONSTRAINT "requisicao_posicao_id_requisicao_fkey" FOREIGN KEY ("id_requisicao") REFERENCES "requisicao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva_fieira" ADD CONSTRAINT "reserva_fieira_id_fieira_fkey" FOREIGN KEY ("id_fieira") REFERENCES "estoque_fieiras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva_fieira" ADD CONSTRAINT "reserva_fieira_id_ordem_fkey" FOREIGN KEY ("id_ordem") REFERENCES "controle_fieiras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
