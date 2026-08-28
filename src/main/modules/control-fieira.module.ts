import prisma from "../../config/db.js";
import { DescriptionParser } from "../../domain/control-fieira/parser/description.parser.js";
import { StatusParser } from "../../domain/control-fieira/parser/status.parser.js";
import { CreateControlFieiraRoute } from "../../infra/api/express/routes/control-fieira/create/create-control-fieira.express.route.js";
import { ListControlFieiraWithoutCabinetRoute } from "../../infra/api/express/routes/control-fieira/list-control-fieira-without-cabinet/list-control-fieira-without-cabinet.express.route.js";
import { ListControlFieiraRoute } from "../../infra/api/express/routes/control-fieira/list/list-control-fieira.express.route.js";
import { ControlFieiraRepositoryPrisma } from "../../infra/repositories/control-fieira/prisma/control-fieira.repository.prisma.js";
import { FieiraRepositoryPrisma } from "../../infra/repositories/fieira/prisma/fieira.repository.prisma.js";
import { CreateControlFieiraUseCase } from "../../usecases/control-fieira/create-control-fieira/create-control-fieira.usecase.js";
import { ListControlFieiraUseCase } from "../../usecases/control-fieira/list-control-fieira/list-control-fieira.usecase.js";
import { ListControlFieiraWithoutCabinetUseCase } from "../../usecases/control-fieira/list-control-fieira-without-cabinet/list-control-fieira-without-cabinet.usecase.js";

const controlFieiraRepository = ControlFieiraRepositoryPrisma.build(prisma);
const fieiraRepository = FieiraRepositoryPrisma.build(prisma);
const descriptionParser = new DescriptionParser();
const statusParser = new StatusParser();

const createControlFieira = CreateControlFieiraUseCase.create(
    controlFieiraRepository,
    fieiraRepository,
    descriptionParser,
    statusParser,
);
const listControlFieira = ListControlFieiraUseCase.create(controlFieiraRepository);
const listControlFieiraWithoutCabinet = ListControlFieiraWithoutCabinetUseCase.create(
    controlFieiraRepository,
);

const createControlFieiraRoute = CreateControlFieiraRoute.create(createControlFieira);
const listControlFieiraWithoutCabinetRoute = ListControlFieiraWithoutCabinetRoute.create(
    listControlFieiraWithoutCabinet,
);
const listControlFieiraRoute = ListControlFieiraRoute.create(listControlFieira);

export const controlFieiraRoutes = [
    listControlFieiraWithoutCabinetRoute,
    listControlFieiraRoute,
    createControlFieiraRoute,
];
