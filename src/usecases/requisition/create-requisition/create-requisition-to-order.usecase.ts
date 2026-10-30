import type { Usecase } from "../../usecase.js";
import type { RequisitionGateway } from "../../../domain/requisition/gateway/requisition.gateway.js";
import type { FieiraGateway } from "../../../domain/fieira/gateway/fieira.gateway.js";
import NotFound from "../../../core/shared/errors/notFound.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import type { ReservationFieiraGateway } from "../../../domain/reservation-fieira/gateway/reservation-fieira.gateway.js";
import type { Tension } from "../../../domain/control-fieira/entity/control-fieira.js";
import type { ControlFieiraGateway } from "../../../domain/control-fieira/gateway/control-fieira.gateway.js";
import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";
import type { SupplierFieiraStockGateway } from "../../../domain/supplier-fieira-stock/gateway/supplier-fieira-stock.gateway.js";
import { Stock } from "../../../domain/stock/entity/stock.js";

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
        private readonly controlFieiraGateway: ControlFieiraGateway,
        private readonly fieiraGateway: FieiraGateway,
        private readonly stockFieiraGateway: StockGateway,
        private readonly reservationFieiraGateway: ReservationFieiraGateway,
        private readonly supplierFieiraStockGateway: SupplierFieiraStockGateway,
    ) {}

    public static create(
        requisitionGateway: RequisitionGateway,
        controlFieiraGateway: ControlFieiraGateway,
        fieiraGateway: FieiraGateway,
        stockFieiraGateway: StockGateway,
        reservationFieiraGateway: ReservationFieiraGateway,
        supplierFieiraStockGateway: SupplierFieiraStockGateway,
    ) {
        return new CreateRequisitionToOrderUseCase(
            requisitionGateway,
            controlFieiraGateway,
            fieiraGateway,
            stockFieiraGateway,
            reservationFieiraGateway,
            supplierFieiraStockGateway,
        );
    }

    public async execute(
        input: CreateRequisitionToOrderInputDto,
    ): Promise<CreateRequisitionToOrderOutputDto> {
        const order = await this.controlFieiraGateway.findByOrder(input.order);

        if (!order) {
            throw new NotFound("Ordem não encontrada.");
        }

        const fieiraId = order.fieiraId;

        if (!fieiraId) {
            throw new NotFound("Ordem sem fieira associada.");
        }

        const requisitionExisting = await this.requisitionGateway.findByOrder(
            input.order,
        );

        if (requisitionExisting) {
            throw new IncorrectRequest("Já existe uma requisição para essa ordem.");
        }

        const stockFieiraList = await this.stockFieiraGateway.listByFieiraId(
            order.fieiraId,
        );

        const fieirainfos = await this.fieiraGateway.findById(fieiraId);

        if (!fieirainfos) {
            throw new IncorrectRequest("informações da fieira não encontradas.");
        }

        const reservationFieira =
            await this.reservationFieiraGateway.findByStockFieira(fieiraId);

        const generateNextCode = Stock.generateNextCodes(
            stockFieiraList,
            input.codesRequested.length,
        );
    }
}
