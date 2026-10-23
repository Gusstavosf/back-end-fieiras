import type { Usecase } from "../../usecase.js";
import NotFound from "../../../core/shared/errors/notFound.js";
import type { SupplierStockFieiraHistoryGateway } from "../../../domain/supplier-fieira-stock/gateway/supplier-fieira-stock-history.gateway.js";
import type { SupplierFieiraStockGateway } from "../../../domain/supplier-fieira-stock/gateway/supplier-fieira-stock.gateway.js";
import type { SupplierFieiraStockHistory } from "../../../generated/prisma/browser.js";

export type UpdateSupplierFieiraStockHistoryInputDto = {
    id: number;
    quantitySent: number;
};

export type UpdateSupplierFieiraStockHistoryOutputDto = {
    id: number;
    supplierFieiraStockId: number;
    quantitySent: number;
    createdAt: Date;
    updatedAt: Date;
};

export class UpdateSupplierFieiraStockHistoryUseCase implements Usecase<
    UpdateSupplierFieiraStockHistoryInputDto,
    UpdateSupplierFieiraStockHistoryOutputDto
> {
    private constructor(
        private readonly supplierFieiraStockHistoryGateway: SupplierStockFieiraHistoryGateway,
        private readonly supplierFieiraStockGateway: SupplierFieiraStockGateway,
    ) {}

    public static create(
        supplierFieiraStockHistoryGateway: SupplierStockFieiraHistoryGateway,
        supplierFieiraStockGateway: SupplierFieiraStockGateway,
    ) {
        return new UpdateSupplierFieiraStockHistoryUseCase(
            supplierFieiraStockHistoryGateway,
            supplierFieiraStockGateway,
        );
    }

    public async execute(
        input: UpdateSupplierFieiraStockHistoryInputDto,
    ): Promise<UpdateSupplierFieiraStockHistoryOutputDto> {
        const historySupplierEntity =
            await this.supplierFieiraStockHistoryGateway.findById(input.id);

        if (!historySupplierEntity) {
            throw new NotFound(
                `Não foi encontrado histórico de estoque com ID ${input.id}.`,
            );
        }

        historySupplierEntity.updateQuantitySent(input.quantitySent);

        await this.supplierFieiraStockHistoryGateway.update(historySupplierEntity);

        const timeline =
            await this.supplierFieiraStockHistoryGateway.listBySupplierFieiraStockId(
                historySupplierEntity.supplierFieiraStockId,
            );

        if (!timeline) {
            throw new NotFound(
                `Não foi encontrado histórico para o estoque com ID ${historySupplierEntity.supplierFieiraStockId}.`,
            );
        }

        const stockToUpdate = await this.supplierFieiraStockGateway.findById(
            historySupplierEntity.supplierFieiraStockId,
        );

        if (!stockToUpdate) {
            throw new NotFound(
                `Não foi encontrado o estoque com ID ${historySupplierEntity.supplierFieiraStockId}.`,
            );
        }

        stockToUpdate.recalculateFromHistory(timeline);

        await this.supplierFieiraStockGateway.update(stockToUpdate);

        const output = this.presentOutput(historySupplierEntity);

        return output;
    }

    private presentOutput(
        supplierFieiraStockHistory: SupplierFieiraStockHistory,
    ): UpdateSupplierFieiraStockHistoryOutputDto {
        const output: UpdateSupplierFieiraStockHistoryOutputDto = {
            id: supplierFieiraStockHistory.id,
            supplierFieiraStockId: supplierFieiraStockHistory.supplierFieiraStockId,
            quantitySent: supplierFieiraStockHistory.quantitySent,
            createdAt: supplierFieiraStockHistory.createdAt,
            updatedAt: supplierFieiraStockHistory.updatedAt,
        };
        return output;
    }
}
