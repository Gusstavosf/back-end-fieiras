import type { Usecase } from "../../usecase.js";
import type { SupplierFieiraStockGateway } from "../../../domain/supplier-fieira-stock/gateway/supplier-fieira-stock.gateway.js";
import type { SupplierStockFieiraHistoryGateway } from "../../../domain/supplier-fieira-stock/gateway/supplier-fieira-stock-history.gateway.js";
import NotFound from "../../../core/shared/errors/notFound.js";

export type SentoToSupplierFieiraStockInputDto = {
    id: number;
    thickness: number;
    width: number;
    quantitySent: number;
};

export type SentoToSupplierFieiraStockOutputDto = void;

export class SentoToSupplierFieiraStockUseCase implements Usecase<
    SentoToSupplierFieiraStockInputDto,
    SentoToSupplierFieiraStockOutputDto
> {
    private constructor(
        private readonly supplierFieiraStockGateway: SupplierFieiraStockGateway,
        private readonly supplierFieiraStockHistoryGateway: SupplierStockFieiraHistoryGateway,
    ) {}

    public static create(
        supplierFieiraStockGateway: SupplierFieiraStockGateway,
        supplierFieiraStockHistoryGateway: SupplierStockFieiraHistoryGateway,
    ) {
        return new SentoToSupplierFieiraStockUseCase(
            supplierFieiraStockGateway,
            supplierFieiraStockHistoryGateway,
        );
    }

    public async execute(
        input: SentoToSupplierFieiraStockInputDto,
    ): Promise<SentoToSupplierFieiraStockOutputDto> {
        const supplierStock = await this.supplierFieiraStockGateway.findByDimensions(
            input.thickness,
            input.width,
        );

        if (!supplierStock) {
            throw new NotFound(
                `Não foi encontrado estoque compatível com as dimensões fornecidas.`,
            );
        }

        await this.supplierFieiraStockGateway.sentFieira(
            supplierStock.id!,
            input.quantitySent,
        );

        await this.supplierFieiraStockGateway.saveHistory({
            supplierFieiraStockId: supplierStock.id!,
            quantitySent: input.quantitySent,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}
