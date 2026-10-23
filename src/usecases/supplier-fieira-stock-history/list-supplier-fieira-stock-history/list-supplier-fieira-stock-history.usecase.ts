import NotFound from "../../../core/shared/errors/notFound.js";
import type { SupplierStockFieiraHistoryGateway } from "../../../domain/supplier-fieira-stock/gateway/supplier-fieira-stock-history.gateway.js";
import type { SupplierFieiraStockHistory } from "../../../generated/prisma/browser.js";
import type { Usecase } from "../../usecase.js";

export type ListSupplierFieiraStockHistoryInputDto = {
    supplierFieiraStockId: number;
};

export type ListSupplierFieiraStockHistoryOutputDto = {
    supplierFieiraStockHistory: {
        id: number;
        supplierFieiraStockId: number;
        quantitySent: number;
        createdAt: Date;
        updatedAt: Date;
    }[];
};

export class ListSupplierFieiraStockHistoryUseCase implements Usecase<
    ListSupplierFieiraStockHistoryInputDto,
    ListSupplierFieiraStockHistoryOutputDto
> {
    private constructor(
        private readonly supplierFieiraStockHistoryGateway: SupplierStockFieiraHistoryGateway,
    ) {}

    public static create(
        supplierFieiraStockHistoryGateway: SupplierStockFieiraHistoryGateway,
    ): ListSupplierFieiraStockHistoryUseCase {
        return new ListSupplierFieiraStockHistoryUseCase(
            supplierFieiraStockHistoryGateway,
        );
    }

    public async execute(
        input: ListSupplierFieiraStockHistoryInputDto,
    ): Promise<ListSupplierFieiraStockHistoryOutputDto> {
        const supplierFieiraStockHistory =
            await this.supplierFieiraStockHistoryGateway.listBySupplierFieiraStockId(
                input.supplierFieiraStockId,
            );

        if (!supplierFieiraStockHistory) {
            throw new NotFound(
                `Não foi encontrado histórico para o dimensional em questão`,
            );
        }

        return this.presentOutput(supplierFieiraStockHistory);
    }

    private presentOutput(
        supplierFieiraStockHistory: SupplierFieiraStockHistory[],
    ): ListSupplierFieiraStockHistoryOutputDto {
        return {
            supplierFieiraStockHistory: supplierFieiraStockHistory.map((history) => {
                return {
                    id: history.id,
                    supplierFieiraStockId: history.supplierFieiraStockId,
                    quantitySent: history.quantitySent,
                    createdAt: history.createdAt,
                    updatedAt: history.updatedAt,
                };
            }),
        };
    }
}
