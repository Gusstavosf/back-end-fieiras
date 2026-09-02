import NotFound from "../../../core/shared/errors/notFound.js";
import { ReservationFieira } from "../../../domain/reservation-fieira/entity/reservation-fieira.js";
import type { ReservationFieiraGateway } from "../../../domain/reservation-fieira/gateway/reservation-fieira.gateway.js";
import type {
    PrismaClient,
    ReservationFieira as PrismaReservationFieira,
} from "../../../generated/prisma/client.js";

export class ReservationFieiraRepositoryPrisma implements ReservationFieiraGateway {
    private constructor(private readonly prismaClient: PrismaClient) {}

    public static build(prismaClient: PrismaClient) {
        return new ReservationFieiraRepositoryPrisma(prismaClient);
    }

    private toEntity(reservation: PrismaReservationFieira): ReservationFieira {
        return ReservationFieira.restore(
            {
                controlFieiraId: reservation.controlId,
                stockFieiraId: reservation.stockFieiraId,
                quantity: Number(reservation.quantity),
                createdAt: reservation.createdAt,
                updatedAt: reservation.updatedAt,
            },
            reservation.id,
        );
    }

    private toPersistence(reservation: ReservationFieira) {
        return {
            controlId: reservation.controlFieiraId,
            stockFieiraId: reservation.stockFieiraId,
            quantity: reservation.quantity,
            createdAt: reservation.createdAt,
            updatedAt: reservation.updatedAt,
        };
    }

    public async save(reservation: ReservationFieira): Promise<ReservationFieira> {
        const reservationSaved = await this.prismaClient.reservationFieira.create({
            data: this.toPersistence(reservation),
        });

        return this.toEntity(reservationSaved);
    }

    public async update(reservation: ReservationFieira): Promise<ReservationFieira> {
        if (!reservation.id) {
            throw new NotFound("Id não encontrado");
        }

        const reservationUpdated = await this.prismaClient.reservationFieira.update({
            where: { id: reservation.id },
            data: this.toPersistence(reservation),
        });

        return this.toEntity(reservationUpdated);
    }

    public async findByControlFieira(controlId: number): Promise<ReservationFieira[]> {
        const findByControlId = await this.prismaClient.reservationFieira.findMany({
            where: { controlId },
        });

        const controlFieiraList = findByControlId.map((controlFieira) =>
            this.toEntity(controlFieira),
        );

        return controlFieiraList;
    }

    public async findByStockFieira(stockFieiraId: number): Promise<ReservationFieira[]> {
        const findByStockFieira = await this.prismaClient.reservationFieira.findMany({
            where: { stockFieiraId },
        });

        const controlFieiraList = findByStockFieira.map((controlFieira) =>
            this.toEntity(controlFieira),
        );

        return controlFieiraList;
    }
}
