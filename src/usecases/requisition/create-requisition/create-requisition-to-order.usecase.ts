import type { Usecase } from "../../usecase.js";
import type { RequisitionGateway } from "../../../domain/requisition/gateway/requisition.gateway.js";
import {
    Requisition,
    RequisitionType,
} from "../../../domain/requisition/entity/requisition.js";
import type { FieiraGateway } from "../../../domain/fieira/gateway/fieira.gateway.js";
import NotFound from "../../../core/shared/errors/notFound.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import type { ReservationFieiraGateway } from "../../../domain/reservation-fieira/gateway/reservation-fieira.gateway.js";
import type { Tension } from "../../../domain/control-fieira/entity/control-fieira.js";
import type { ControlFieiraGateway } from "../../../domain/control-fieira/gateway/control-fieira.gateway.js";
import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";
import type { SupplierFieiraStockGateway } from "../../../domain/supplier-fieira-stock/gateway/supplier-fieira-stock.gateway.js";
import { Stock } from "../../../domain/stock/entity/stock.js";
import { ReservationFieira } from "../../../domain/reservation-fieira/entity/reservation-fieira.js";

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

        if (!order.id) {
            throw new NotFound("Ordem sem identificação válida.");
        }

        const fieiraId = order.fieiraId;

        if (!fieiraId) {
            throw new NotFound("Ordem sem fieira associada.");
        }

        if (!Number.isInteger(input.requestedQty) || input.requestedQty <= 0) {
            throw new IncorrectRequest(
                "A quantidade requisitada deve ser um número inteiro maior que zero.",
            );
        }

        const requisitionExisting = await this.requisitionGateway.findByOrder(
            input.order,
        );

        if (requisitionExisting) {
            throw new IncorrectRequest("Já existe uma requisição para essa ordem.");
        }

        const stockFieiraList = await this.stockFieiraGateway.listByFieiraId(fieiraId);

        const fieira = await this.fieiraGateway.findById(fieiraId);

        if (!fieira) {
            throw new IncorrectRequest("Informações da fieira não encontradas.");
        }

        const generatedCodes = Stock.generateNextCodes(
            stockFieiraList,
            input.requestedQty,
        );

        const requisition = Requisition.create({
            fieiraId,
            currentStockQty: stockFieiraList.length,
            type: RequisitionType.production,
            necessaryQty: order.qtdFieiraNec,
            requestedQty: input.requestedQty,
            currentStockCapacity: fieira.nominalFieiraCapacity,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const requisitionSaved = await this.requisitionGateway.save(requisition);

        for (const code of generatedCodes) {
            const newStock = Stock.create(fieiraId, code);

            await this.stockFieiraGateway.save(newStock);

            const stockSaved = await this.stockFieiraGateway.findByCode(code, fieiraId);

            if (!stockSaved || !stockSaved.id) {
                throw new NotFound(
                    `Não foi possível recuperar a fieira ${code} após a criação.`,
                );
            }

            const reservation = ReservationFieira.create({
                controlId: order.id,
                stockFieiraId: stockSaved.id,
                quantity: input.requestedQty,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            await this.reservationFieiraGateway.save(reservation);

            await this.stockFieiraGateway.saveHistory({
                stockFieiraId: stockSaved.id,
                status: newStock.status,
                thickness: null,
                width: null,
                production: 0,
                utilization: 0,
            });
        }

        const compatibleSupplierStock = (
            await this.supplierFieiraStockGateway.listCompatible(
                fieira.thickness,
                fieira.width,
            )
        ).find(
            (supplierStock) =>
                supplierStock.quantitySent - supplierStock.quantityUsed >=
                input.requestedQty,
        );

        if (!compatibleSupplierStock || !compatibleSupplierStock.id) {
            throw new IncorrectRequest(
                "Não há estoque do fornecedor compatível com a quantidade requisitada.",
            );
        }

        compatibleSupplierStock.increaseQuantityUsed(input.requestedQty);

        await this.supplierFieiraStockGateway.update(compatibleSupplierStock);

        await this.supplierFieiraStockGateway.saveHistory({
            supplierFieiraStockId: compatibleSupplierStock.id,
            quantitySent: input.requestedQty,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return {
            cabinetName: "",
            dimension: `${fieira.width}x${fieira.thickness}`,
            wireType: order.wireType,
            tension: order.tension,
            destination: order.order,
            material: order.material,
            necessaryTotalQty: order.qtdFieiraNec,
            currentStockQty: stockFieiraList.length,
            currentStockCapacity: fieira.nominalFieiraCapacity,
            necessaryRequisitionQty: input.requestedQty,
            createdAt: requisitionSaved.createdAt,
            updatedAt: requisitionSaved.updatedAt,
        };
    }
}
