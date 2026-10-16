import type { Usecase } from "../../usecase.js";
import type { SupplierFieiraStockGateway } from "../../../domain/supplier-fieira-stock/gateway/supplier-fieira-stock.gateway.js";
import type { SupplierFieiraStock } from "../../../domain/supplier-fieira-stock/entity/supplier-fieira-stock.js";

export type ListSupplierFieiraStockInputDto = void;

export type ListSupplierFieiraStockOutputDto = {
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

export class ListSupplierFieiraStockUseCase implements Usecase<
    ListSupplierFieiraStockInputDto,
    ListSupplierFieiraStockOutputDto
> {
    private constructor(
        private readonly supplierFieiraStockGateway: SupplierFieiraStockGateway,
    ) {}

    public static create(supplierFieiraStockGateway: SupplierFieiraStockGateway) {
        return new ListSupplierFieiraStockUseCase(supplierFieiraStockGateway);
    }

    public async execute(): Promise<ListSupplierFieiraStockOutputDto> {
        const supplierStockEntity = await this.supplierFieiraStockGateway.list();

        const output = this.presentOutput(supplierStockEntity);

        return output;
    }

    private presentOutput(
        supplierStock: SupplierFieiraStock[],
    ): ListSupplierFieiraStockOutputDto {
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
