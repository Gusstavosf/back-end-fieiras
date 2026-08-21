import prisma from "../../config/db.js";
import { ListEligibleCabinetsForFieiraRoute } from "../../infra/api/express/routes/cabinet/list-eligible-cabinet-for-fieira/list-eligible-cabinet-for-fieira.express.route.js";
import { CabinetRepositoryPrisma } from "../../infra/repositories/cabinet/prisma/cabinet.repository.prisma.js";

import { ListEligibleCabinetForFieiraUseCase } from "../../usecases/cabinet/list-eligible-cabinet-for-fieira/list-eligible-cabinet-for-fieira.usecase.js";

const cabinetRepository = CabinetRepositoryPrisma.build(prisma);

const listEligibleCabinetsForFIeira =
    ListEligibleCabinetForFieiraUseCase.create(cabinetRepository);

const listEligibleCabinetsForFieiraRoute = ListEligibleCabinetsForFieiraRoute.create(
    listEligibleCabinetsForFIeira,
);

export const cabinetsRoutes = [listEligibleCabinetsForFieiraRoute];
