import type { Usecase } from "../../usecase.js";
import type { SupplierFieiraStockGateway } from "../../../domain/supplier-fieira-stock/gateway/supplier-fieira-stock.gateway.js";
import type { SupplierFieiraStock } from "../../../domain/supplier-fieira-stock/entity/supplier-fieira-stock.js";
import NotFound from "../../../core/shared/errors/notFound.js";

export type UpdateSupplierFieiraStockInputDto = {
    thickness: number;
    width: number;
    quantitySent: number;
};

export type UpdateSupplierFieiraStockOutputDto = {
    id: number;
    thickness: number;
    width: number;
    quantitySent: number;
    createdAt: Date;
    updatedAt: Date;
};

export class UpdateSupplierFieiraStockUseCase implements Usecase<
    UpdateSupplierFieiraStockInputDto,
    UpdateSupplierFieiraStockOutputDto
> {
    private constructor(
        private readonly supplierFieiraStockGateway: SupplierFieiraStockGateway,
    ) {}

    public static create(supplierFieiraStockGateway: SupplierFieiraStockGateway) {
        return new UpdateSupplierFieiraStockUseCase(supplierFieiraStockGateway);
    }

    public async execute(
        input: UpdateSupplierFieiraStockInputDto,
    ): Promise<UpdateSupplierFieiraStockOutputDto> {
        const supplierStock = await this.supplierFieiraStockGateway.findByDimensions(
            input.width,
            input.thickness,
        );

        if (!supplierStock) {
            throw new NotFound(
                `Não foi encontrado estoque compatível com as dimensões fornecidas.`,
            );
        }

        await this.supplierFieiraStockGateway.update(input.quantitySent);

        const output = this.presentOutput(supplierStock);

        return output;
    }

    private presentOutput(
        stock: SupplierFieiraStock,
    ): UpdateSupplierFieiraStockOutputDto {
        const output: UpdateSupplierFieiraStockOutputDto = {
            id: stock.id!,
            thickness: stock.thickness,
            width: stock.width,
            quantitySent: stock.quantitySent,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
        };
        return output;
    }
}
