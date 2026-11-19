import prisma from "../../config/db.js";
import { CreateRequisitionRoute } from "../../infra/api/express/routes/requisition/create/create-requisition.express.route.js";
import { CabinetRepositoryPrisma } from "../../infra/repositories/cabinet/prisma/cabinet.repository.prisma.js";
import { ControlFieiraRepositoryPrisma } from "../../infra/repositories/control-fieira/prisma/control-fieira.repository.prisma.js";
import { FieiraRepositoryPrisma } from "../../infra/repositories/fieira/prisma/fieira.repository.prisma.js";
import { RequisitionControlRepositoryPrisma } from "../../infra/repositories/requisition/requisition-control.repository.prisma.js";
import { RequisitionItemRepositoryPrisma } from "../../infra/repositories/requisition/requisition-item.repository.prisma.js";
import { RequisitionRepositoryPrisma } from "../../infra/repositories/requisition/requisition.repository.prisma.js";
import { ReservationFieiraRepositoryPrisma } from "../../infra/repositories/reservation-fieira/prisma/reservation-fieira.repository.prisma.js";
import { StockReposistoryPrisma } from "../../infra/repositories/stock/prisma/stock.repository.prisma.js";
import { SupplierFieiraStockRepositoryPrisma } from "../../infra/repositories/supplier-fieira-stock/prisma/supplier-fieira-stock.repository.prisma.js";
import { CreateRequisitionToOrderUseCase } from "../../usecases/requisition/create-requisition/create-requisition-to-order.usecase.js";

const createRequisitionUseCase = CreateRequisitionToOrderUseCase.create({
    run: (work) =>
        prisma.$transaction(
            (transaction) =>
                work({
                    requisitionGateway: RequisitionRepositoryPrisma.build(transaction),
                    controlFieiraGateway:
                        ControlFieiraRepositoryPrisma.build(transaction),
                    fieiraGateway: FieiraRepositoryPrisma.build(transaction),
                    stockFieiraGateway: StockReposistoryPrisma.build(transaction),
                    reservationFieiraGateway:
                        ReservationFieiraRepositoryPrisma.build(transaction),
                    supplierFieiraStockGateway:
                        SupplierFieiraStockRepositoryPrisma.build(transaction),
                    requisitionItemGateway:
                        RequisitionItemRepositoryPrisma.build(transaction),
                    requisitionControlGateway:
                        RequisitionControlRepositoryPrisma.build(transaction),
                    cabinetGateway: CabinetRepositoryPrisma.build(transaction),
                }),
            { isolationLevel: "Serializable" },
        ),
});

const createRequisitionRoute = CreateRequisitionRoute.create(createRequisitionUseCase);

export const requisitionRoutes = [createRequisitionRoute];
