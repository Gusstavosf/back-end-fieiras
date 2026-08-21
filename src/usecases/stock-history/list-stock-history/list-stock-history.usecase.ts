import NotFound from "../../../core/shared/errors/notFound.js";
import type { StockHistory } from "../../../domain/stock/entity/stock-history.js";
import type { StatusFieira } from "../../../domain/stock/entity/stock.js";
import type { StockHistoryGateway } from "../../../domain/stock/gateway/stock-history.gateway.js";
import type { Usecase } from "../../usecase.js";

export type ListStockHistoryInputDto = {
    stockFieiraId: number;
};

export type ListStockHistoryOutputDto = {
    stockHistory: {
        id: number;
        stockFieiraId: number;
        status: StatusFieira;
        thickness: number | null;
        width: number | null;
        production: number;
        utilization: number;
        createdAt: Date;
        updatedAt: Date;
    }[];
};

export class ListStockHistoryUseCase implements Usecase<
    ListStockHistoryInputDto,
    ListStockHistoryOutputDto
> {
    private constructor(private readonly stockHistoryGateway: StockHistoryGateway) {}

    public static create(stockHistoryGateway: StockHistoryGateway) {
        return new ListStockHistoryUseCase(stockHistoryGateway);
    }

    public async execute(
        input: ListStockHistoryInputDto,
    ): Promise<ListStockHistoryOutputDto> {
        const stockHistory = await this.stockHistoryGateway.listByStockId(
            input.stockFieiraId,
        );

        if (!stockHistory) {
            throw new NotFound(
                `Ferramental com ID ${input.stockFieiraId} não foi encontrado no estoque.`,
            );
        }

        const output = this.presentOutput(stockHistory);

        return output;
    }

    private presentOutput(stockHistory: StockHistory[]): ListStockHistoryOutputDto {
        return {
            stockHistory: stockHistory.map((stockHistory) => {
                return {
                    id: stockHistory.id,
                    stockFieiraId: stockHistory.stockFieiraId,
                    status: stockHistory.status,
                    thickness: stockHistory.thickness,
                    width: stockHistory.width,
                    production: stockHistory.production,
                    utilization: stockHistory.utilization,
                    createdAt: stockHistory.createdAt,
                    updatedAt: stockHistory.updatedAt,
                };
            }),
        };
    }
}
