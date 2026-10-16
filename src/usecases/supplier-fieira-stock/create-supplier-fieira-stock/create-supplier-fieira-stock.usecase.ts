import type { Usecase } from "../../usecase.js";
import type { SupplierFieiraStockGateway } from "../../../domain/supplier-fieira-stock/gateway/supplier-fieira-stock.gateway.js";
import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";
import { SupplierFieiraStock } from "../../../domain/supplier-fieira-stock/entity/supplier-fieira-stock.js";
import NotFound from "../../../core/shared/errors/notFound.js";

export type CreateSupplierFieiraStockInputDto = {
    thickness: number;
    width: number;
    quantitySent: number;
};

export type CreateSupplierStockFieiraOutputDto = {
    id: number;
    thickness: number;
    width: number;
    quantitySent: number;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateSupplierStockFieiraUseCase implements Usecase<
    CreateSupplierFieiraStockInputDto,
    CreateSupplierStockFieiraOutputDto
> {
    private constructor(
        private readonly supplierFieiraStockGateway: SupplierFieiraStockGateway,
    ) {}

    public static create(supplierFieiraStockGateway: SupplierFieiraStockGateway) {
        return new CreateSupplierStockFieiraUseCase(supplierFieiraStockGateway);
    }

    public async execute(
        input: CreateSupplierFieiraStockInputDto,
    ): Promise<CreateSupplierStockFieiraOutputDto> {
        const fieiraExisting = await this.supplierFieiraStockGateway.findByDimensions(
            input.width,
            input.thickness,
        );

        if (fieiraExisting) {
            throw new IncorrectRequest(
                `O fieira com as dimensões ${input.width}x${input.thickness} já existe`,
            );
        }

        const newSupplierFieiraStock = SupplierFieiraStock.create({
            thickness: input.thickness,
            width: input.width,
            quantitySent: input.quantitySent,
            quantityUsed: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await this.supplierFieiraStockGateway.save(newSupplierFieiraStock);

        const idFromSupplierFieiraStock =
            await this.supplierFieiraStockGateway.findByDimensions(
                input.width,
                input.thickness,
            );

        if (!idFromSupplierFieiraStock) {
            throw new NotFound(
                `Não foi possível recuperar a fieira criada para o histórico.`,
            );
        }

        await this.supplierFieiraStockGateway.saveHistory({
            supplierFieiraStockId: idFromSupplierFieiraStock.id!,
            quantitySent: newSupplierFieiraStock.quantitySent,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const output = this.presentOutput(newSupplierFieiraStock);

        return output;
    }

    private presentOutput(
        supplierFieiraStock: SupplierFieiraStock,
    ): CreateSupplierStockFieiraOutputDto {
        const output: CreateSupplierStockFieiraOutputDto = {
            id: supplierFieiraStock.id!,
            thickness: supplierFieiraStock.thickness,
            width: supplierFieiraStock.width,
            quantitySent: supplierFieiraStock.quantitySent,
            createdAt: supplierFieiraStock.createdAt,
            updatedAt: supplierFieiraStock.updatedAt,
        };

        return output;
    }
}
