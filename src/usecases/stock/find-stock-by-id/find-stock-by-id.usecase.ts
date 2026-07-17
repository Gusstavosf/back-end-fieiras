import NotFound from "../../../core/shared/errors/notFound.js";
import type { Stock } from "../../../domain/stock/entity/stock.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";

export type FindSotckByIdInputDto = {
    id: number;
};

export type FindStockByIDOutputDto = {
    id: number | undefined;
    fieiraId: number;
    code: string;
    status: string;
    currentThickness?: number | null;
    currentWidth?: number | null;
    utilization: number;
    production: number;
    createdAt: Date;
    updatedAt: Date;
};

export class FindStockByIdUseCase {
    constructor(private readonly StockGateway: StockGateway) {}

    public static create(stockGatway: StockGateway) {
        return new FindStockByIdUseCase(stockGatway);
    }

    public async execute(input: FindSotckByIdInputDto): Promise<FindStockByIDOutputDto> {
        const stock = await this.StockGateway.findById(input.id);

        if (!stock) {
            throw new NotFound(
                `Ferramental com ID ${input.id} não foi encontrado no estoque.`,
            );
        }

        const output = this.presentOutput(stock);

        return output;
    }

    private presentOutput(stock: Stock): FindStockByIDOutputDto {
        const output: FindStockByIDOutputDto = {
            id: stock.id!,
            fieiraId: stock.fieiraId,
            code: stock.code,
            status: stock.status,
            currentThickness: stock.currentThickness,
            currentWidth: stock.currentWidth,
            production: stock.production ?? 0,
            utilization: stock.utilization ?? 0,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
        };

        return output;
    }
}
