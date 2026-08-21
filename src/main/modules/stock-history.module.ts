import prisma from "../../config/db.js";
import { StockReposistoryPrisma } from "../../infra/repositories/stock/prisma/stock.repository.prisma.js";
import { StockHistoryRepositoryPrisma } from "../../infra/repositories/stock/prisma/stock-history.repository.prisma.js";
import { ListStockHistoryUseCase } from "../../usecases/stock-history/list-stock-history/list-stock-history.usecase.js";
import { CorrectStockHistoryUseCase } from "../../usecases/stock-history/correct-stock-history/correct-stock-history.usecase.js";
import { DeleteStockHistoryUseCase } from "../../usecases/stock-history/delete-stock-history/delete-stock-history.usecase.js";
import { ListStockHistoryRoute } from "../../infra/api/express/routes/stock-history/list/list-stock-history.express.route.js";
import { DeleteStockHistoryRoute } from "../../infra/api/express/routes/stock-history/delete/delete-stock-history.express.route.js";
import { CorrectStockHistoryRoute } from "../../infra/api/express/routes/stock-history/update/update-stock-history.express.route.js";

const stockRepository = StockReposistoryPrisma.build(prisma);
const stockHistoryRepository = StockHistoryRepositoryPrisma.build(prisma);

const listStockHistoryUseCase = ListStockHistoryUseCase.create(stockHistoryRepository);
const correctStockHistoryUseCase = CorrectStockHistoryUseCase.create(
    stockHistoryRepository,
    stockRepository,
);
const deleteStockHistoryUseCase = DeleteStockHistoryUseCase.create(
    stockHistoryRepository,
    stockRepository,
);
const listStockHistoryRoute = ListStockHistoryRoute.create(listStockHistoryUseCase);
const correctStockHistoryRoute = CorrectStockHistoryRoute.create(
    correctStockHistoryUseCase,
);

const deleteStockHistoryRoute = DeleteStockHistoryRoute.create(deleteStockHistoryUseCase);

export const stockHistoryRoutes = [
    listStockHistoryRoute,
    correctStockHistoryRoute,
    deleteStockHistoryRoute,
];
