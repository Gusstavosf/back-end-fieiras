import type { Usecase } from "../../usecase.js";
import type { SupplierFieiraStockGateway } from "../../../domain/supplier-fieira-stock/gateway/supplier-fieira-stock.gateway.js";
import type { SupplierFieiraStock } from "../../../domain/supplier-fieira-stock/entity/supplier-fieira-stock.js";
import NotFound from "../../../core/shared/errors/notFound.js";

export type DeleteSupplierFieiraStockInputDto = {
    id: number;
};

export type DeleteSupplierFieiraStockOutputDto = {
    id: number | undefined;
    width: number;
    thickness: number;
    quantitySent: number;
    quantityUsed: number;
    createdAt: Date;
    updatedAt: Date;
};

export class DeleteSupplierFieiraStockUseCase implements Usecase<
    DeleteSupplierFieiraStockInputDto,
    DeleteSupplierFieiraStockOutputDto
> {
    constructor(
        private readonly supplierFieiraStockGateway: SupplierFieiraStockGateway,
    ) {}

    public static create(supplierFieiraStockGateway: SupplierFieiraStockGateway) {
        return new DeleteSupplierFieiraStockUseCase(supplierFieiraStockGateway);
    }

    public async execute(
        input: DeleteSupplierFieiraStockInputDto,
    ): Promise<DeleteSupplierFieiraStockOutputDto> {
        const supplierStock = await this.supplierFieiraStockGateway.findById(input.id);

        if (!supplierStock) {
            throw new NotFound(`Fieira com id ${input.id} não encontrada.`);
        }

        await this.supplierFieiraStockGateway.delete(supplierStock.id!);

        const output = this.presentOutput(supplierStock);

        return output;
    }

    private presentOutput(
        stock: SupplierFieiraStock,
    ): DeleteSupplierFieiraStockOutputDto {
        const output: DeleteSupplierFieiraStockOutputDto = {
            id: stock.id,
            width: stock.width,
            thickness: stock.thickness,
            quantitySent: stock.quantitySent,
            quantityUsed: stock.quantityUsed,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
        };
        return output;
    }
}
