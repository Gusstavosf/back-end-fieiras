import { prisma } from "../lib/prisma.js"
import { Apiexpress } from "./infra/api/express/api.express.js";
import { CreateStockRoute } from "./infra/api/express/routes/stock/create-stock.express.route.js";
import { ListStockRoute } from "./infra/api/express/routes/stock/list-stock.express.route.js";
import { StockReposistoryPrisma } from "./infra/repositories/stock/prisma/stock.repository.prisma.js"
import { CreateStockUseCase } from "./usecases/stock/create-stock/create-stock.usecase.js"
import { ListStockUseCase } from "./usecases/stock/list-estoque/list-stock.usecase.js";

function main() {
    const aRepository = StockReposistoryPrisma.build(prisma)

    const createStockuseCase = CreateStockUseCase.create(aRepository);
    const listStockUseCase = ListStockUseCase.create(aRepository);

    const createRoute = CreateStockRoute.create(createStockuseCase);
    const listRoute = ListStockRoute.create(listStockUseCase)

    const api = Apiexpress.create([createRoute, listRoute]);
    const port = 8000;
    api.start(port);
}

main();