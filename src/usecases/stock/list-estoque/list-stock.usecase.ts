import { Stock, StatusFieira } from "../../../domain/stock/entity/stock.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import type { Usecase } from "../../usecase.js";

export type ListStockInputDto = void;

export type ListStockOutputDto = {
    stock: {
        id?: number | undefined;
        fieiraId: number;
        code: string;
        status: StatusFieira;
        currentThickness?: number | null;
        currentWidth?: number | null;
        utilization?: number;
        production?: number;
        createdAt: Date;
        updatedAt: Date;
    }[];
};

export class ListStockUseCase implements Usecase<ListStockInputDto, ListStockOutputDto> {
    private constructor(private readonly stockGateway: StockGateway) {}

    public static create(stockGatway: StockGateway) {
        return new ListStockUseCase(stockGatway);
    }

    public async execute(): Promise<ListStockOutputDto> {
        const stockEntity = await this.stockGateway.list();

        const output = this.presentOutput(stockEntity);

        return output;
    }

    private presentOutput(stock: Stock[]): ListStockOutputDto {
        return {
            stock: stock.map((stock) => {
                return {
                    id: stock.id,
                    fieiraId: stock.fieiraId,
                    code: stock.code,
                    status: stock.status,
                    currentThickness: stock.currentThickness ?? null,
                    currentWidth: stock.currentWidth ?? null,
                    utilization: stock.utilization ?? 0,
                    production: stock.production ?? 0,
                    createdAt: stock.createdAt,
                    updatedAt: stock.updatedAt,
                };
            }),
        };
    }
}
