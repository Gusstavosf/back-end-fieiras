import { Apiexpress } from "../infra/api/express/api.express.js";

import { stockRoutes } from "./modules/stock.module.js";
import { stockHistoryRoutes } from "./modules/stock-history.module.js";
import { cabinetsRoutes } from "./modules/cabinet.module.js";

const api = Apiexpress.create([...stockRoutes, ...stockHistoryRoutes, ...cabinetsRoutes]);

export const app = api.getApp();
