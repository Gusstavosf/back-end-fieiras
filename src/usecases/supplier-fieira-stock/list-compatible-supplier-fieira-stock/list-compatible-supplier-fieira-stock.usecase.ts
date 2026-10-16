import type { Usecase } from "../../usecase.js";
import type { SupplierFieiraStockGateway } from "../../../domain/supplier-fieira-stock/gateway/supplier-fieira-stock.gateway.js";
import type { SupplierFieiraStock } from "../../../domain/supplier-fieira-stock/entity/supplier-fieira-stock.js";

export type ListCompatibleSupplierFieiraStockInputDto = {
    width: number;
    thickness: number;
};

export type ListCompatibleSupplierFieiraStockOutputDto = {
    supplierStock: {
        id?: number | undefined;
        thickness: number;
        width: number;
        quantitySent: number;
        quantityUsed: number;
        createdAt: Date;
        updatedAt: Date;
    }[];
};

export class ListCompatibleSupplierFieiraStockUseCase implements Usecase<
    ListCompatibleSupplierFieiraStockInputDto,
    ListCompatibleSupplierFieiraStockOutputDto
> {
    private constructor(
        private readonly supplierFieiraStockGateway: SupplierFieiraStockGateway,
    ) {}

    public static create(supplierFieiraStockGateway: SupplierFieiraStockGateway) {
        return new ListCompatibleSupplierFieiraStockUseCase(supplierFieiraStockGateway);
    }

    public async execute(
        input: ListCompatibleSupplierFieiraStockInputDto,
    ): Promise<ListCompatibleSupplierFieiraStockOutputDto> {
        const supplierStockEntity = await this.supplierFieiraStockGateway.listCompatible(
            input.width,
            input.thickness,
        );

        const output = this.presentOutput(supplierStockEntity);

        return output;
    }

    private presentOutput(
        supplierStock: SupplierFieiraStock[],
    ): ListCompatibleSupplierFieiraStockOutputDto {
        return {
            supplierStock: supplierStock.map((item) => {
                return {
                    id: item.id,
                    thickness: item.thickness,
                    width: item.width,
                    quantitySent: item.quantitySent,
                    quantityUsed: item.quantityUsed,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt,
                };
            }),
        };
    }
}
