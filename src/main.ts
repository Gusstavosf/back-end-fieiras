import prisma from "./config/db.js";
import { Apiexpress } from "./infra/api/express/api.express.js";
import { CreateStockRoute } from "./infra/api/express/routes/stock/create-stock.express.route.js";
import { FindStockByIdRoute } from "./infra/api/express/routes/stock/find-stock-by-id.express.route.js";
import { ListStockRoute } from "./infra/api/express/routes/stock/list-stock.express.route.js";
import { StockReposistoryPrisma } from "./infra/repositories/stock/prisma/stock.repository.prisma.js"
import { CreateStockUseCase } from "./usecases/stock/create-stock/create-stock.usecase.js"
import { FindStockByIdUseCase } from "./usecases/stock/find-stock-by-id/find-stock-by-id.usecase.js";
import { ListStockUseCase } from "./usecases/stock/list-estoque/list-stock.usecase.js";

function main() {
    const stockRepository = StockReposistoryPrisma.build(prisma)

    const createStockuseCase = CreateStockUseCase.create(stockRepository);
    const listStockUseCase = ListStockUseCase.create(stockRepository);
    const findStockByIdUseCase = FindStockByIdUseCase.create(stockRepository)

    const createRoute = CreateStockRoute.create(createStockuseCase);
    const listRoute = ListStockRoute.create(listStockUseCase)
    const findByIdRoute = FindStockByIdRoute.create(findStockByIdUseCase);

    const api = Apiexpress.create([createRoute, listRoute, findByIdRoute]);
    const port = 8000;
    api.start(port);
}

main();