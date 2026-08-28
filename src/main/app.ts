import { Apiexpress } from "../infra/api/express/api.express.js";

import { stockRoutes } from "./modules/stock.module.js";
import { stockHistoryRoutes } from "./modules/stock-history.module.js";
import { cabinetsRoutes } from "./modules/cabinet.module.js";
import { controlFieiraRoutes } from "./modules/control-fieira.module.js";
import { fieiraRoutes } from "./modules/fieira.module.js";

const api = Apiexpress.create([
    ...stockRoutes,
    ...stockHistoryRoutes,
    ...cabinetsRoutes,
    ...controlFieiraRoutes,
    ...fieiraRoutes,
]);

export const app = api.getApp();
