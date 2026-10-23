import prisma from "../../config/db.js";
import { DeleteSupplierFieiraStockHistoryRoute } from "../../infra/api/express/routes/supplier-fieira-stock-history/delete/delete-supplier-fieira-stock-history.express.route.js";
import { ListSupplierFieiaStockHistoryRoute } from "../../infra/api/express/routes/supplier-fieira-stock-history/list/list-supplier-fieira-stock-history.express.route.js";
import { UpdateSupplierFieiraStockHistoryRoute } from "../../infra/api/express/routes/supplier-fieira-stock-history/update/update-supplier-fieira-stock-history.express.route.js";
import { SupplierFieiraStockHistoryRepositoryPrisma } from "../../infra/repositories/supplier-fieira-stock/prisma/supplier-fieira-stock-history.repository.prisma.js";
import { SupplierFieiraStockRepositoryPrisma } from "../../infra/repositories/supplier-fieira-stock/prisma/supplier-fieira-stock.repository.prisma.js";
import { DeleteSupplierFieiraStockHistoryUseCase } from "../../usecases/supplier-fieira-stock-history/delete-supplier-fieira-stock-history/delete-supplier-fieira-stock-history.usecase.js";
import { ListSupplierFieiraStockHistoryUseCase } from "../../usecases/supplier-fieira-stock-history/list-supplier-fieira-stock-history/list-supplier-fieira-stock-history.usecase.js";
import { UpdateSupplierFieiraStockHistoryUseCase } from "../../usecases/supplier-fieira-stock-history/update/update-supplier-fieira-stock-history.usecase.js";

const supplierStockFieiraRepository = SupplierFieiraStockRepositoryPrisma.build(prisma);
const supplierStockFieirahistoryRepository =
    SupplierFieiraStockHistoryRepositoryPrisma.build(prisma);

const deleteSupplierStockFieiraHistoryUseCase =
    DeleteSupplierFieiraStockHistoryUseCase.create(
        supplierStockFieirahistoryRepository,
        supplierStockFieiraRepository,
    );
const listSupplierStockFieiraHistoryUseCase =
    ListSupplierFieiraStockHistoryUseCase.create(supplierStockFieirahistoryRepository);
const updateSupplierStockFieiraHistoryUseCase =
    UpdateSupplierFieiraStockHistoryUseCase.create(
        supplierStockFieirahistoryRepository,
        supplierStockFieiraRepository,
    );

const deleteSupplierStockFieiraHistoryRoute =
    DeleteSupplierFieiraStockHistoryRoute.create(deleteSupplierStockFieiraHistoryUseCase);
const listSupplierStockFieiraHistoryRoute = ListSupplierFieiaStockHistoryRoute.create(
    listSupplierStockFieiraHistoryUseCase,
);
const updateSupplierStockFieiraHistoryRoute =
    UpdateSupplierFieiraStockHistoryRoute.create(updateSupplierStockFieiraHistoryUseCase);

export const supplierStockFieiraHistoryRoutes = [
    deleteSupplierStockFieiraHistoryRoute,
    listSupplierStockFieiraHistoryRoute,
    updateSupplierStockFieiraHistoryRoute,
];
