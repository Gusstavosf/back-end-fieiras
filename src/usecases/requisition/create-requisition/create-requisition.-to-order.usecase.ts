import type { Usecase } from "../../usecase.js";
import type { RequisitionGateway } from "../../../domain/requisition/gateway/requisition.gateway.js";
import type { FieiraGateway } from "../../../domain/fieira/gateway/fieira.gateway.js";
import NotFound from "../../../core/shared/errors/notFound.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import type { ReservationFieiraGateway } from "../../../domain/reservation-fieira/gateway/reservation-fieira.gateway.js";
import type { Tension } from "../../../domain/control-fieira/entity/control-fieira.js";
import type { ControlFieiraGateway } from "../../../domain/control-fieira/gateway/control-fieira.gateway.js";
import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";

export type CreateRequisitionToOrderInputDto = {
    order: number;
    requestedQty: number;
    qtyRework?: number;
};

export type CreateRequisitionToOrderOutputDto = {
    cabinetName: string;
    dimension: string;
    wireType: string;
    tension: Tension;
    destination: number;
    material: number;
    necessaryTotalQty: number;
    currentStockQty: number;
    currentStockCapacity: number;
    necessaryRequisitionQty: number;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateRequisitionToOrderUseCase implements Usecase<
    CreateRequisitionToOrderInputDto,
    CreateRequisitionToOrderOutputDto
> {
    private constructor(
        private readonly requisitionGateway: RequisitionGateway,
        private readonly fieraGateway: FieiraGateway,
        private readonly controlFieiraGateway: ControlFieiraGateway,
        private readonly stockGateway: StockGateway,
        private readonly reservationFieiraGateway: ReservationFieiraGateway,
    ) {}

    public static create(
        requisitionGateway: RequisitionGateway,
        fieraGateway: FieiraGateway,
        controlFieiraGateway: ControlFieiraGateway,
        stockGateway: StockGateway,
        reservationFieiraGateway: ReservationFieiraGateway,
    ) {
        return new CreateRequisitionToOrderUseCase(
            requisitionGateway,
            fieraGateway,
            controlFieiraGateway,
            stockGateway,
            reservationFieiraGateway,
        );
    }

    public async execute(
        input: CreateRequisitionToOrderInputDto,
    ): Promise<CreateRequisitionToOrderOutputDto> {
        const order = await this.controlFieiraGateway.findByOrder(input.order);

        if (!order) {
            throw new NotFound("Ordem não encontrada.");
        }

        if (!order.fieiraId) {
            throw new NotFound("Ordem sem fieira associada.");
        }

        const existing = await this.requisitionGateway.findByOrder(input.order);

        if (existing) {
            throw new IncorrectRequest("Já existe uma requisição para essa ordem.");
        }
    }
}
