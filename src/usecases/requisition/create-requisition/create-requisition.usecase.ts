import type { Usecase } from "../../usecase.js";
import type { RequisitionGateway } from "../../../domain/requisition/gateway/requisition.gateway.js";
import { RequisitionType } from "../../../domain/requisition/entity/requisition.js";
import type { FieiraGateway } from "../../../domain/fieira/gateway/fieira.gateway.js";
import NotFound from "../../../core/shared/errors/notFound.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import type { ReservationFieiraGateway } from "../../../domain/reservation-fieira/gateway/reservation-fieira.gateway.js";
import type { Tension } from "../../../domain/control-fieira/entity/control-fieira.js";

export type CreateRequisitionInputDto = {
    cabinetName: string;
    type: RequisitionType;
    necessaryQty: number;
};

export type CreateRequisitionOutputDto = {
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

export class CreateRequisitionUseCase implements Usecase<
    CreateRequisitionInputDto,
    CreateRequisitionOutputDto
> {
    private constructor(
        private readonly requisitionGateway: RequisitionGateway,
        private readonly fieraGateway: FieiraGateway,
        private readonly stockGateway: StockGateway,
        private readonly reservationFieiraGateway: ReservationFieiraGateway,
    ) {}

    public static create(
        requisitionGateway: RequisitionGateway,
        fieraGateway: FieiraGateway,
        stockGateway: StockGateway,
        reservationFieiraGateway: ReservationFieiraGateway,
    ) {
        return new CreateRequisitionUseCase(
            requisitionGateway,
            fieraGateway,
            stockGateway,
            reservationFieiraGateway,
        );
    }

    public async execute(
        input: CreateRequisitionInputDto,
    ): Promise<CreateRequisitionOutputDto> {
        const fieira = await this.fieraGateway.findByName(input.cabinetName);

        if (!fieira) {
            throw new NotFound(
                `Fieira pertencente ao armário ${input.cabinetName} não encontrada.`,
            );
        }

        const stockFieira = await this.stockGateway.listByFieiraId(fieira.id);
    }
}
