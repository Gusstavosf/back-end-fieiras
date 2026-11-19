import type { Usecase } from "../../usecase.js";
import type { RequisitionGateway } from "../../../domain/requisition/gateway/requisition.gateway.js";
import {
    Requisition,
    RequisitionType,
} from "../../../domain/requisition/entity/requisition.js";
import {
    RequisitionItem,
    RequisitionItemType,
} from "../../../domain/requisition/entity/requisition-item.js";
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
import type { RequisitionItemGateway } from "../../../domain/requisition/gateway/requisition-item.gateway.js";
import type { RequisitionControlGateway } from "../../../domain/requisition/gateway/requisition-control.gateway.js";
import type { CabinetGateway } from "../../../domain/cabinet/gateway/cabinet.gateway.js";

export type CreateRequisitionToOrderInputDto = {
    order: number;
    requestedQty: number;
    qtyRework?: number;
    reworkSelections?: {
        supplierStockId: number;
        quantity: number;
    }[];
};

export type CreateRequisitionToOrderOutputDto = {
    cabinetName: string;
    dimension: string;
    wireType: string;
    tension: Tension;
    order: number;
    material: number;
    necessaryTotalQty: number;
    currentStockQty: number;
    currentStockCapacity: number;
    necessaryRequisitionQty: number;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateRequisitionGateways = {
    requisitionGateway: RequisitionGateway;
    controlFieiraGateway: ControlFieiraGateway;
    fieiraGateway: FieiraGateway;
    stockFieiraGateway: StockGateway;
    reservationFieiraGateway: ReservationFieiraGateway;
    supplierFieiraStockGateway: SupplierFieiraStockGateway;
    requisitionItemGateway: RequisitionItemGateway;
    requisitionControlGateway: RequisitionControlGateway;
    cabinetGateway: CabinetGateway;
};

export interface CreateRequisitionUnitOfWork {
    run<T>(work: (gateways: CreateRequisitionGateways) => Promise<T>): Promise<T>;
}

const toGrams = (kg: number): number => Math.round(kg * 1_000);

export class CreateRequisitionToOrderUseCase implements Usecase<
    CreateRequisitionToOrderInputDto,
    CreateRequisitionToOrderOutputDto
> {
    private constructor(private readonly unitOfWork: CreateRequisitionUnitOfWork) {}

    public static create(unitOfWork: CreateRequisitionUnitOfWork) {
        return new CreateRequisitionToOrderUseCase(unitOfWork);
    }

    public async execute(
        input: CreateRequisitionToOrderInputDto,
    ): Promise<CreateRequisitionToOrderOutputDto> {
        const { requestedQty } = input;

        const qtyRework = input.qtyRework ?? 0;

        if (!Number.isInteger(requestedQty) || requestedQty <= 0) {
            throw new IncorrectRequest(
                "A quantidade requisitada deve ser um inteiro maior que zero.",
            );
        }

        if (!Number.isInteger(qtyRework) || qtyRework < 0 || qtyRework > requestedQty) {
            throw new IncorrectRequest(
                "A quantidade para retrabalho deve ser um inteiro entre zero e a quantidade requisitada.",
            );
        }

        const qtyNew = requestedQty - qtyRework;

        return this.unitOfWork.run(
            async ({
                requisitionGateway,
                controlFieiraGateway,
                fieiraGateway,
                stockFieiraGateway,
                reservationFieiraGateway,
                supplierFieiraStockGateway,
                requisitionItemGateway,
                requisitionControlGateway,
                cabinetGateway,
            }) => {
                const order = await controlFieiraGateway.findByOrder(input.order);

                if (order?.id == null) {
                    throw new NotFound(
                        "Ordem sem identificação válida ou não encontrada.",
                    );
                }

                const controlId = order.id;
                const fieiraId = order.fieiraId;

                if (fieiraId == null) {
                    throw new NotFound("Ordem sem fieira associada.");
                }

                if (await requisitionGateway.findByOrder(input.order)) {
                    throw new IncorrectRequest(
                        "Já existe uma requisição para essa ordem.",
                    );
                }

                const fieira = await fieiraGateway.findById(fieiraId);

                if (!fieira) {
                    throw new NotFound("Informações da fieira não encontradas.");
                }

                if (fieira.cabinetId == null) {
                    throw new NotFound("Fieira não possui armário associado.");
                }

                const cabinet = await cabinetGateway.findById(fieira.cabinetId);

                if (!cabinet) {
                    throw new NotFound("Armário não encontrado.");
                }

                let compatibleSupplierStock;

                const reworkSelections = input.reworkSelections ?? [];

                if (qtyRework > 0) {
                    const supplierStocks =
                        await supplierFieiraStockGateway.listCompatible(
                            fieira.thickness,
                            fieira.width,
                        );

                    compatibleSupplierStock = supplierStocks.find(
                        (stock) =>
                            stock.id != null &&
                            stock.quantitySent - stock.quantityUsed >= qtyRework,
                    );

                    if (!compatibleSupplierStock) {
                        throw new IncorrectRequest(
                            "O estoque do fornecedor não cobre a quantidade escolhida para retrabalho.",
                        );
                    }
                }

                const stockList = await stockFieiraGateway.listByFieiraId(fieiraId);

                const generatedCodes = Stock.generateNextCodes(stockList, requestedQty);

                const usableStock = stockList.filter(
                    (stock) => stock.status === "new" || stock.status === "polished",
                );
                const nominalCapacityGrams = toGrams(fieira.nominalFieiraCapacity);

                const orderReservations =
                    await reservationFieiraGateway.findByControlFieira(controlId);

                const reservedForOrderGrams = orderReservations.reduce(
                    (sum, reservation) => sum + toGrams(reservation.quantity ?? 0),
                    0,
                );

                let remainingGrams = Math.max(
                    0,
                    toGrams(order.orderQuantity) - reservedForOrderGrams,
                );

                let availableTotalGrams = 0;

                for (const stock of usableStock) {
                    if (stock.id == null) {
                        throw new NotFound("Fieira em estoque sem identificação válida.");
                    }

                    const reservations = await reservationFieiraGateway.findByStockFieira(
                        stock.id,
                    );

                    const reservedForOthersGrams = reservations
                        .filter((reservation) => reservation.controlId !== controlId)
                        .reduce(
                            (sum, reservation) =>
                                sum + toGrams(reservation.quantity ?? 0),
                            0,
                        );

                    availableTotalGrams += Math.max(
                        0,
                        nominalCapacityGrams -
                            toGrams(stock.production) -
                            reservedForOthersGrams,
                    );
                }

                const currentStockQty = usableStock.length;

                const currentStockCapacity = Math.floor(availableTotalGrams / 1_000);

                const now = new Date();

                const saved = await requisitionGateway.save(
                    Requisition.create({
                        fieiraId,
                        type: RequisitionType.production,
                        currentStockQty,
                        currentStockCapacity,
                        necessaryQty: order.qtdFieiraNec,
                        requestedQty,
                        createdAt: now,
                        updatedAt: now,
                    }),
                );

                const requisitionId = saved.id;

                if (requisitionId == null) {
                    throw new NotFound("A requisição salva está sem identificação.");
                }

                await requisitionControlGateway.save({
                    requisitionId,
                    controlFieiraId: controlId,
                });

                const supplierStockId = compatibleSupplierStock?.id ?? null;

                for (const [index, code] of generatedCodes.entries()) {
                    await stockFieiraGateway.save(Stock.create(fieiraId, code));

                    const stockSaved = await stockFieiraGateway.findByCode(
                        code,
                        fieiraId,
                    );

                    if (stockSaved?.id == null) {
                        throw new NotFound(
                            `Não foi possível recuperar a fieira ${code} após a criação.`,
                        );
                    }

                    const isRework = index >= qtyNew;

                    await requisitionItemGateway.save(
                        RequisitionItem.create({
                            requisitionId,
                            stockFieiraId: stockSaved.id,
                            supplierFieiraStockId: isRework ? supplierStockId : null,
                            type: isRework
                                ? RequisitionItemType.rework
                                : RequisitionItemType.new,
                            createdAt: now,
                        }),
                    );

                    const reservedGrams = Math.min(remainingGrams, nominalCapacityGrams);

                    if (reservedGrams > 0) {
                        await reservationFieiraGateway.save(
                            ReservationFieira.create({
                                controlId,
                                stockFieiraId: stockSaved.id,
                                quantity: reservedGrams / 1_000,
                                createdAt: now,
                                updatedAt: now,
                            }),
                        );

                        remainingGrams -= reservedGrams;
                    }
                }

                if (compatibleSupplierStock) {
                    compatibleSupplierStock.increaseQuantityUsed(qtyRework);
                    await supplierFieiraStockGateway.update(compatibleSupplierStock);
                }

                return {
                    cabinetName: cabinet.name,
                    dimension: `${fieira.width}x${fieira.thickness}`,
                    wireType: order.wireType,
                    tension: order.tension,
                    order: order.order,
                    material: order.material,
                    necessaryTotalQty: order.qtdFieiraNec,
                    currentStockQty,
                    currentStockCapacity,
                    necessaryRequisitionQty: requestedQty,
                    createdAt: saved.createdAt,
                    updatedAt: saved.updatedAt,
                };
            },
        );
    }
}
