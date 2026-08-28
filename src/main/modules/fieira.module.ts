import prisma from "../../config/db.js";
import { AttachFieiraToCabinetRoute } from "../../infra/api/express/routes/fieira/attach-fieira-to-cabinet/attach-fieira-to-cabinet.express.route.js";
import { CabinetRepositoryPrisma } from "../../infra/repositories/cabinet/prisma/cabinet.repository.prisma.js";
import { FieiraRepositoryPrisma } from "../../infra/repositories/fieira/prisma/fieira.repository.prisma.js";

import { AttachFieiraToCabinetUseCase } from "../../usecases/fieira/attach-fieira-to-cabinet/attach-fieira-to-cabinet.usecase.js";

const fieiraRepository = FieiraRepositoryPrisma.build(prisma);
const cabinetRepository = CabinetRepositoryPrisma.build(prisma);

const attachFieiraToCabinet = AttachFieiraToCabinetUseCase.create(
    fieiraRepository,
    cabinetRepository,
);

const attachFieiraToCabinetaRoute =
    AttachFieiraToCabinetRoute.create(attachFieiraToCabinet);

export const fieiraRoutes = [attachFieiraToCabinetaRoute];
