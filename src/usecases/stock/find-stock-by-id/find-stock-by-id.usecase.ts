import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";

export type FindSotckByIdInputDto = {
    id: number;
};

export type FindStockOutputDto = {
    id: number;
    cabinetId: number;
    code: string;
    status: string;
    currentThickness?: number;
    currentWidth?: number;
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

    public async execute(input: FindSotckByIdInputDto): Promise<FindSotckByIdInputDto> {
        const stock = await this.StockGateway.findById(input.id);

        if (!stock) {
            throw new IncorrectRequest(
                `Ferramental com ID ${input.id} não foi encontrado no estoque.`,
            );
        }

        const data = {
            id: stock.id!,
            cabinetId: stock.cabinetId,
            code: stock.code,
            status: stock.status,
            currentThickness: stock.currentThickness,
            currentWidth: stock.currentWidth,
            utilization: stock.utilization ?? 0,
            production: stock.production ?? 0,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
        };

        return data;
    }
}
