import prisma from "../../config/db.js";
import { CreateStockRoute } from "../../infra/api/express/routes/stock/create/create-stock.express.route.js";
import { DeleteStockRoute } from "../../infra/api/express/routes/stock/delete/delete-stock.express.route.js";
import { FindStockByIdRoute } from "../../infra/api/express/routes/stock/find-by-id/find-stock-by-id.express.route.js";
import { ListStockRoute } from "../../infra/api/express/routes/stock/list/list-stock.express.route.js";
import { UpdateStockRoute } from "../../infra/api/express/routes/stock/update/update-stock.express.route.js";
import { StockReposistoryPrisma } from "../../infra/repositories/stock/prisma/stock.repository.prisma.js";
import { CreateStockUseCase } from "../../usecases/stock/create-stock/create-stock.usecase.js";
import { DeleteStockUseCase } from "../../usecases/stock/delete-stock/delete-stock.usecase.js";
import { FindStockByIdUseCase } from "../../usecases/stock/find-stock-by-id/find-stock-by-id.usecase.js";
import { ListStockUseCase } from "../../usecases/stock/list-estoque/list-stock.usecase.js";
import { UpdateStockUseCase } from "../../usecases/stock/update-stock/update-stock.usecase.js";

const stockRepository = StockReposistoryPrisma.build(prisma);

const createStockuseCase = CreateStockUseCase.create(stockRepository);
const listStockUseCase = ListStockUseCase.create(stockRepository);
const findStockByIdUseCase = FindStockByIdUseCase.create(stockRepository);
const updateStockUseCase = UpdateStockUseCase.create(stockRepository);
const deleteStockUseCase = DeleteStockUseCase.create(stockRepository);

const createStockRoute = CreateStockRoute.create(createStockuseCase);
const listStockRoute = ListStockRoute.create(listStockUseCase);
const findByIdStockRoute = FindStockByIdRoute.create(findStockByIdUseCase);
const updateStockRoute = UpdateStockRoute.create(updateStockUseCase);
const deleteStockRoute = DeleteStockRoute.create(deleteStockUseCase);

export const stockRoutes = [
    createStockRoute,
    listStockRoute,
    findByIdStockRoute,
    updateStockRoute,
    deleteStockRoute,
];
