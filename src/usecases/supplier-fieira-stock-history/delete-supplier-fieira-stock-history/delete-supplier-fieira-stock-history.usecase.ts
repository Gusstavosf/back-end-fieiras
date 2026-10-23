import NotFound from "../../../core/shared/errors/notFound.js";
import type { Usecase } from "../../usecase.js";
import type { SupplierStockFieiraHistoryGateway } from "../../../domain/supplier-fieira-stock/gateway/supplier-fieira-stock-history.gateway.js";
import type { SupplierFieiraStockGateway } from "../../../domain/supplier-fieira-stock/gateway/supplier-fieira-stock.gateway.js";
import type { SupplierFieiraStockHistory } from "../../../generated/prisma/browser.js";

export type DeleteSupplierFieiraStockHistoryInputDto = {
    id: number;
};

export type DeleteSupplierFieiraStockHistoryOutputDto = {
    id: number;
    quantitySent: number;
    createdAt: Date;
    updatedAt: Date;
};

export class DeleteSupplierFieiraStockHistoryUseCase implements Usecase<
    DeleteSupplierFieiraStockHistoryInputDto,
    DeleteSupplierFieiraStockHistoryOutputDto
> {
    constructor(
        private readonly supplierFieiraStockHistoryGateway: SupplierStockFieiraHistoryGateway,
        private readonly supplierFieiraStockGateway: SupplierFieiraStockGateway,
    ) {}

    public static create(
        supplierFieiraStockHistoryGateway: SupplierStockFieiraHistoryGateway,
        supplierFieiraStockGateway: SupplierFieiraStockGateway,
    ) {
        return new DeleteSupplierFieiraStockHistoryUseCase(
            supplierFieiraStockHistoryGateway,
            supplierFieiraStockGateway,
        );
    }

    public async execute(
        input: DeleteSupplierFieiraStockHistoryInputDto,
    ): Promise<DeleteSupplierFieiraStockHistoryOutputDto> {
        const historySupplierEntity =
            await this.supplierFieiraStockHistoryGateway.findById(input.id);

        if (!historySupplierEntity) {
            throw new NotFound(
                `O registro de histórico com Id ${input.id} não foi encontrado.`,
            );
        }

        await this.supplierFieiraStockHistoryGateway.delete(historySupplierEntity.id);

        const timeline =
            await this.supplierFieiraStockHistoryGateway.listBySupplierFieiraStockId(
                historySupplierEntity.supplierFieiraStockId,
            );

        const stockToUpdate = await this.supplierFieiraStockGateway.findById(
            historySupplierEntity.supplierFieiraStockId,
        );

        if (!stockToUpdate) {
            throw new NotFound(
                `O estoque do fornecedor com ID ${historySupplierEntity.supplierFieiraStockId} não foi encontrado.`,
            );
        }

        stockToUpdate.recalculateFromHistory(timeline!);

        await this.supplierFieiraStockGateway.update(stockToUpdate);

        const output = this.presentOutput(historySupplierEntity);

        return output;
    }

    private presentOutput(
        supplierStockHistory: SupplierFieiraStockHistory,
    ): DeleteSupplierFieiraStockHistoryOutputDto {
        const output: DeleteSupplierFieiraStockHistoryOutputDto = {
            id: supplierStockHistory.id,
            quantitySent: supplierStockHistory.quantitySent,
            createdAt: supplierStockHistory.createdAt,
            updatedAt: supplierStockHistory.updatedAt,
        };
        return output;
    }
}
