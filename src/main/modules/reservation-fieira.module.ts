import prisma from "../../config/db.js";
import { CreateReservationFieiraRoute } from "../../infra/api/express/routes/reservation-fieira/create-reservation-fieira/create-reservation-fieira.express.route.js";
import { ListReservationFieiraPendingRoute } from "../../infra/api/express/routes/reservation-fieira/list-reservation-fieira-pending/list-reservation-fieira-pending.express.route.js";
import { ControlFieiraRepositoryPrisma } from "../../infra/repositories/control-fieira/prisma/control-fieira.repository.prisma.js";
import { FieiraRepositoryPrisma } from "../../infra/repositories/fieira/prisma/fieira.repository.prisma.js";
import { ReservationFieiraRepositoryPrisma } from "../../infra/repositories/reservation-fieira/reservation-fieira.repository.prisma.js";
import { StockReposistoryPrisma } from "../../infra/repositories/stock/prisma/stock.repository.prisma.js";
import { CreateReservationFieiraUseCase } from "../../usecases/reservation-fieira/create-reservation-fieira/create-reservation-fieira.usecase.js";
import { ListReservationFieiraPendingUseCase } from "../../usecases/reservation-fieira/list-reservation-fieira-pending/list-reservation-fieira-pending.usecase.js";

const reservationFieiraRepository = ReservationFieiraRepositoryPrisma.build(prisma);
const controlFieiraRepository = ControlFieiraRepositoryPrisma.build(prisma);
const stockFieiraRepository = StockReposistoryPrisma.build(prisma);
const fieraRepository = FieiraRepositoryPrisma.build(prisma);

const listReservationFieiraPending = ListReservationFieiraPendingUseCase.create(
    controlFieiraRepository,
    reservationFieiraRepository,
);
const createReservationFieira = CreateReservationFieiraUseCase.create(
    controlFieiraRepository,
    stockFieiraRepository,
    reservationFieiraRepository,
    fieraRepository,
);

const listReservationFieiraPendingRoute = ListReservationFieiraPendingRoute.create(
    listReservationFieiraPending,
);
const createReservationFieiraRoute = CreateReservationFieiraRoute.create(
    createReservationFieira,
);

export const reservationFieiraRoutes = [
    listReservationFieiraPendingRoute,
    createReservationFieiraRoute,
];
