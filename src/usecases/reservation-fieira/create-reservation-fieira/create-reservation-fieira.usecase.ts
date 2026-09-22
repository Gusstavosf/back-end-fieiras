import NotFound from "../../../core/shared/errors/notFound.js";
import type { ControlFieiraGateway } from "../../../domain/control-fieira/gateway/control-fieira.gateway.js";
import type { FieiraGateway } from "../../../domain/fieira/gateway/fieira.gateway.js";
import type { ReservationFieiraGateway } from "../../../domain/reservation-fieira/gateway/reservation-fieira.gateway.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import type { Usecase } from "../../usecase.js";
import { StatusFieira } from "../../../domain/stock/entity/stock.js";
import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";
import { ReservationFieira } from "../../../domain/reservation-fieira/entity/reservation-fieira.js";

export type CreateReservationFieiraInputDto = {
    controlId: number;
    stockFieiraId: number;
};

export type CreateReservationFieiraOutputDto = {
    controlId: number;
    stockFieiraId: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateReservationFieiraUseCase implements Usecase<
    CreateReservationFieiraInputDto,
    CreateReservationFieiraOutputDto
> {
    private constructor(
        private readonly controlFieiraGateway: ControlFieiraGateway,
        private readonly stockFieiraGateway: StockGateway,
        private readonly reservationFieiraGateway: ReservationFieiraGateway,
        private readonly fieiraGateway: FieiraGateway,
    ) {}

    public static create(
        controlFieiraGateway: ControlFieiraGateway,
        stockFieiraGateway: StockGateway,
        reservationFieiraGateway: ReservationFieiraGateway,
        fieiraGateway: FieiraGateway,
    ) {
        return new CreateReservationFieiraUseCase(
            controlFieiraGateway,
            stockFieiraGateway,
            reservationFieiraGateway,
            fieiraGateway,
        );
    }

    public async execute(
        input: CreateReservationFieiraInputDto,
    ): Promise<CreateReservationFieiraOutputDto> {
        const controlFieira = await this.controlFieiraGateway.findById(input.controlId);

        const order = controlFieira?.order;

        if (!controlFieira) {
            throw new NotFound(`Ordem ${order} não encontrada`);
        }

        const orderQuantity = controlFieira.orderQuantity;

        const fieiraId = controlFieira.fieiraId;

        if (!fieiraId) {
            throw new NotFound(
                `A ordem ${controlFieira.order} não possui uma Fieira associada.`,
            );
        }

        const fieira = await this.fieiraGateway.findById(controlFieira.fieiraId);

        if (!fieira) {
            throw new NotFound(`Fieira ${controlFieira.fieiraId} não encontrada.`);
        }

        const nominalCapacity = fieira.nominalFieiraCapacity;

        const stockFieira = await this.stockFieiraGateway.findById(input.stockFieiraId);

        if (!stockFieira) {
            throw new NotFound(`Fieira ${input.stockFieiraId} não encontrada`);
        }

        const reservationFieiraQuantity =
            await this.reservationFieiraGateway.findByStockFieira(input.stockFieiraId);

        const totalReservedStock = reservationFieiraQuantity.reduce(
            (total, reservation) => total + reservation.quantity!,
            0,
        );

        if (
            stockFieira.status == StatusFieira.Dead ||
            stockFieira.status == StatusFieira.Requested
        ) {
            throw new IncorrectRequest(
                "Não é possível reservar fieiras em requisição ou mortas.",
            );
        }

        const availableCapacity =
            nominalCapacity - stockFieira.production - totalReservedStock;

        const reservationOrder = await this.reservationFieiraGateway.findByControlFieira(
            input.controlId,
        );

        const totalReserved = reservationOrder.reduce(
            (total, reservation) => total + reservation.quantity!,
            0,
        );

        const remainingQuantity = orderQuantity - totalReserved;

        const quantity = Math.min(availableCapacity, remainingQuantity);

        if (quantity <= 0) {
            throw new IncorrectRequest(
                "Não há quantidade disponível para realizar esta reserva.",
            );
        }

        const pendingReservation = reservationOrder.find(
            (reservation) =>
                reservation.stockFieiraId === null && reservation.quantity === null,
        );

        let savedReservation: ReservationFieira;

        if (pendingReservation) {
            pendingReservation.attachStockFieira(stockFieira.id!, quantity);

            savedReservation =
                await this.reservationFieiraGateway.update(pendingReservation);
        } else {
            const reservation = ReservationFieira.create({
                controlId: controlFieira.id!,
                stockFieiraId: stockFieira.id!,
                quantity,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            savedReservation = await this.reservationFieiraGateway.save(reservation);
        }

        const output = this.presentOutput(savedReservation);

        return output;
    }

    public presentOutput(
        reservation: ReservationFieira,
    ): CreateReservationFieiraOutputDto {
        if (reservation.stockFieiraId === null || reservation.quantity === null) {
            throw new IncorrectRequest(
                "Reserva de fieira não possui Estoque ou Quantidade.",
            );
        }

        return {
            controlId: reservation.controlId,
            stockFieiraId: reservation.stockFieiraId,
            quantity: reservation.quantity,
            createdAt: reservation.createdAt,
            updatedAt: reservation.updatedAt,
        };
    }
}
