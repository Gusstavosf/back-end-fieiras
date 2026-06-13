import { StatusFieira, Stock } from "../../../domain/stock/entity/stock.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import type { Usecase } from "../../usecase.js";

export type ListStockInputDto = void;

export type ListStockOutputDto = {
    stock: {
        id?: number | undefined;
        cabinetId: number;
        code: string;
        status: StatusFieira;
        currentThickness?: number;
        currentWidth?: number;
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
            stock: stock.map((s) => {
                return {
                    id: s.id,
                    cabinetId: s.cabinetId,
                    code: s.code,
                    status: s.status,
                    currentThickness: s.currentThickness ?? 0,
                    currentWidth: s.currentWidth ?? 0,
                    utilization: s.utilization ?? 0,
                    production: s.production ?? 0,
                    createdAt: s.createdAt,
                    updatedAt: s.updatedAt,
                };
            }),
        };
    }
}
