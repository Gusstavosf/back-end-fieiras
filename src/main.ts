import prisma from "./config/db.js";
import { Apiexpress } from "./infra/api/express/api.express.js";
import { CorrectStockHistoryRoute } from "./infra/api/express/routes/stock-history/update-stock-history.express.route.js";
import { CreateStockRoute } from "./infra/api/express/routes/stock/create-stock.express.route.js";
import { FindStockByIdRoute } from "./infra/api/express/routes/stock/find-stock-by-id.express.route.js";
import { ListStockRoute } from "./infra/api/express/routes/stock/list-stock.express.route.js";
import { UpdateStockRoute } from "./infra/api/express/routes/stock/update-stock.express.route.js";
import { StockHistoryRepositoryPrisma } from "./infra/repositories/stock/prisma/stock-history.repository.prisma.js";
import { StockReposistoryPrisma } from "./infra/repositories/stock/prisma/stock.repository.prisma.js";
import { CorrectStockHistoryUseCase } from "./usecases/stock-history/correct-stock-history/correct-stock-history.usecase.js";
import { CreateStockUseCase } from "./usecases/stock/create-stock/create-stock.usecase.js";
import { FindStockByIdUseCase } from "./usecases/stock/find-stock-by-id/find-stock-by-id.usecase.js";
import { ListStockUseCase } from "./usecases/stock/list-estoque/list-stock.usecase.js";
import { UpdateStockUseCase } from "./usecases/stock/update-stock/update-stock.usecase.js";

function main() {
    const stockRepository = StockReposistoryPrisma.build(prisma);
    const stockHistoryRepository = StockHistoryRepositoryPrisma.build(prisma);

    const createStockuseCase = CreateStockUseCase.create(stockRepository);
    const listStockUseCase = ListStockUseCase.create(stockRepository);
    const findStockByIdUseCase = FindStockByIdUseCase.create(stockRepository);
    const updateStockUseCase = UpdateStockUseCase.create(stockRepository);
    const correctStockHistoryUseCase = CorrectStockHistoryUseCase.create(
        stockHistoryRepository,
        stockRepository,
    );

    const createStockRoute = CreateStockRoute.create(createStockuseCase);
    const listStockRoute = ListStockRoute.create(listStockUseCase);
    const findByIdStockRoute = FindStockByIdRoute.create(findStockByIdUseCase);
    const updateStockRoute = UpdateStockRoute.create(updateStockUseCase);
    const correctStockHistoryRoute = CorrectStockHistoryRoute.create(
        correctStockHistoryUseCase,
    );

    const api = Apiexpress.create([
        createStockRoute,
        listStockRoute,
        findByIdStockRoute,
        updateStockRoute,
        correctStockHistoryRoute,
    ]);
    const port = 8000;
    api.start(port);
}

main();
