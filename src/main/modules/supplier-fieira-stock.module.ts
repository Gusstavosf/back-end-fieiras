import prisma from "../../config/db.js";
import { SupplierFieiraStockRepositoryPrisma } from "../../infra/repositories/supplier-fieira-stock/prisma/supplier-fieira-stock.repository.prisma.js";
import { SupplierFieiraStockHistoryRepositoryPrisma } from "../../infra/repositories/supplier-fieira-stock/prisma/supplier-fieira-stock-history.repository.prisma.js";
import { CreateSupplierStockFieiraUseCase } from "../../usecases/supplier-fieira-stock/create-supplier-fieira-stock/create-supplier-fieira-stock.usecase.js";
import { DeleteSupplierFieiraStockUseCase } from "../../usecases/supplier-fieira-stock/delete-supplier-fieira-stock/delete-supplier-fieira-stock.usecase.js";
import { ListSupplierFieiraStockUseCase } from "../../usecases/supplier-fieira-stock/list-supplier-fieira-stock/list-supplier-fieira-stock.usecase.js";
import { ListCompatibleSupplierFieiraStockUseCase } from "../../usecases/supplier-fieira-stock/list-compatible-supplier-fieira-stock/list-compatible-supplier-fieira-stock.usecase.js";
import { SentoToSupplierFieiraStockUseCase } from "../../usecases/supplier-fieira-stock/sent-to-supplier-fieira-stock/sent-to-supplier-fieira-stock.usecase.js";
import { CreateSupplierFieiraStockRoute } from "../../infra/api/express/routes/supplier-fieira-stock/create/create-supplier-fieira-stock.express.route.js";
import { ListSupplierFieiraStockRoute } from "../../infra/api/express/routes/supplier-fieira-stock/list/list-supplier-fieira-stock.express.route.js";
import { ListCompatibleSupplierFieiraStockRoute } from "../../infra/api/express/routes/supplier-fieira-stock/list-compatible/list-compatible-supplier-fieira-stock.express.route.js";
import { SentToSupplierFieiraStockRoute } from "../../infra/api/express/routes/supplier-fieira-stock/sent/sent-to-supplier-fieira-stock.express.route.js";
import { DeleteSupplierFieiraStockRoute } from "../../infra/api/express/routes/supplier-fieira-stock/delete/delete-supplier-fieira-stock.express.route.js";

const supplierStockFieiraRepository = SupplierFieiraStockRepositoryPrisma.build(prisma);
const supplierStockFieirahistoryRepository =
    SupplierFieiraStockHistoryRepositoryPrisma.build(prisma);

const createSupplierStockFieiraUseCase = CreateSupplierStockFieiraUseCase.create(
    supplierStockFieiraRepository,
);
const listSupplierStockFieiraUseCase = ListSupplierFieiraStockUseCase.create(
    supplierStockFieiraRepository,
);
const listCompatibleSupplierStockFieiraUseCase =
    ListCompatibleSupplierFieiraStockUseCase.create(supplierStockFieiraRepository);
const sentToSupplierStockFieiraUseCase = SentoToSupplierFieiraStockUseCase.create(
    supplierStockFieiraRepository,
    supplierStockFieirahistoryRepository,
);
const deleteSupplierStockFieiraUseCase = DeleteSupplierFieiraStockUseCase.create(
    supplierStockFieiraRepository,
);

const createSupplierStockFieiraRoute = CreateSupplierFieiraStockRoute.create(
    createSupplierStockFieiraUseCase,
);
const listSupplierStockFieiraRoute = ListSupplierFieiraStockRoute.create(
    listSupplierStockFieiraUseCase,
);
const listCompatibleSupplierStockFieiraRoute =
    ListCompatibleSupplierFieiraStockRoute.create(
        listCompatibleSupplierStockFieiraUseCase,
    );
const sentToSupplierStockFieiraRoute = SentToSupplierFieiraStockRoute.create(
    sentToSupplierStockFieiraUseCase,
);
const deleteSupplierStockFieiraRoute = DeleteSupplierFieiraStockRoute.create(
    deleteSupplierStockFieiraUseCase,
);

export const supplierStockFieiraRoutes = [
    createSupplierStockFieiraRoute,
    listSupplierStockFieiraRoute,
    listCompatibleSupplierStockFieiraRoute,
    sentToSupplierStockFieiraRoute,
    deleteSupplierStockFieiraRoute,
];
