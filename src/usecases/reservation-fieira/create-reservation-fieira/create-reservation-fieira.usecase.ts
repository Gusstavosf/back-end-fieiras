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
    order: number;
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
        const controlFieira = await this.controlFieiraGateway.findByOrder(input.order);

        if (!controlFieira) {
            throw new NotFound(`Ordem ${input.order} não encontrada`);
        }

        const orderQuantity = controlFieira.orderQuantity;

        const fieira = await this.fieiraGateway.findByDimensions(
            controlFieira.width,
            controlFieira.thickness,
            controlFieira.tension,
        );

        if (!fieira) {
            throw new NotFound(`Fieira não encontrada`);
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

        if (!controlFieira.id) {
            throw new NotFound("Id não encontrado");
        }

        const reservationOrder = await this.reservationFieiraGateway.findByControlFieira(
            controlFieira.id,
        );

        const totalReserved = reservationOrder.reduce(
            (total, reservation) => total + reservation.quantity!,
            0,
        );

        const remainingQuantity = orderQuantity - totalReserved;

        const quantity = Math.min(availableCapacity, remainingQuantity);

        const reservation = ReservationFieira.create({
            controlId: controlFieira.id,
            stockFieiraId: stockFieira.id!,
            quantity: quantity,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const savedReservation = await this.reservationFieiraGateway.update(reservation);

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
