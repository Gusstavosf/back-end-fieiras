import NotFound from "../../../core/shared/errors/notFound.js";
import type { StatusFieira, Stock } from "../../../domain/stock/entity/stock.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import type { Usecase } from "../../usecase.js";

export type DeleteStockInputDto = {
    id: number;
};

export type DeleteStockOutputDto = {
    id: number | undefined;
    fieiraId: number;
    status: StatusFieira;
    code: string;
    currentThickness: number | null;
    cuurrentWidth: number | null;
    production: number;
    utilization: number;
    createdAt: Date;
    updatedAt: Date;
};

export class DeleteStockUseCase implements Usecase<
    DeleteStockInputDto,
    DeleteStockOutputDto
> {
    constructor(private readonly stockGateway: StockGateway) {}

    public static create(stockGateway: StockGateway) {
        return new DeleteStockUseCase(stockGateway);
    }

    public async execute(input: DeleteStockInputDto): Promise<DeleteStockOutputDto> {
        const stockEntity = await this.stockGateway.findById(input.id);

        if (!stockEntity) throw new NotFound(`Fieira com ${input.id} não encontrado.`);

        await this.stockGateway.detele(stockEntity.id!);

        const output = this.presentOutput(stockEntity);

        return output;
    }

    private presentOutput(stock: Stock): DeleteStockOutputDto {
        const output: DeleteStockOutputDto = {
            id: stock.id,
            fieiraId: stock.fieiraId,
            code: stock.code,
            status: stock.status,
            currentThickness: stock.currentThickness,
            cuurrentWidth: stock.currentWidth,
            production: stock.production,
            utilization: stock.utilization,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
        };
        return output;
    }
}
