import type { StatusFieira } from "../../../domain/stock/entity/stock.js";
import type { StockHistoryGateway } from "../../../domain/stock/gateway/stock-history.gateway.js";
import type { Usecase } from "../../usecase.js";
import NotFound from "../../../core/shared/errors/notFound.js";
import { StockHistory } from "../../../domain/stock/entity/stock-history.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";

export type CorrectStockHistoryInputDto = {
    id: number;
    status: StatusFieira;
    thickness?: number | null | undefined;
    width?: number | null | undefined;
    production?: number | undefined;
};

export type CorrectStockHistoryOutputDto = {
    id: number;
    status: StatusFieira;
    thickness: number | null;
    width: number | null;
    production: number;
    utilization: number;
    createdAt: Date;
    updatedAt: Date;
};

export class CorrectStockHistoryUseCase implements Usecase<
    CorrectStockHistoryInputDto,
    CorrectStockHistoryOutputDto
> {
    constructor(
        private readonly historyGateway: StockHistoryGateway,
        private readonly stockGateway: StockGateway,
    ) {}

    public static create(
        historyGateway: StockHistoryGateway,
        stockGateway: StockGateway,
    ) {
        return new CorrectStockHistoryUseCase(historyGateway, stockGateway);
    }

    public async execute(input: CorrectStockHistoryInputDto) {
        const historyEntity = await this.historyGateway.findById(input.id);

        if (!historyEntity) {
            throw new NotFound(
                `O registro de histórico com ID ${input.id} não existe no sistema.`,
            );
        }

        const allTimeline = await this.historyGateway.listByStockId(
            historyEntity.stockFieiraId,
        );

        historyEntity.correctMeasures(
            input.status !== undefined ? input.status : historyEntity.status,
            input.thickness !== undefined ? input.thickness : historyEntity.thickness,
            input.width !== undefined ? input.width : historyEntity.width,
            input.production !== undefined ? input.production : historyEntity.production,
            allTimeline,
        );

        await this.historyGateway.update(historyEntity);

        const stockEntity = await this.stockGateway.findById(historyEntity.stockFieiraId);

        if (!stockEntity) {
            throw new NotFound(`A fieira vinculada a este histórico não foi encontrada.`);
        }

        stockEntity.recalculateFromHistory(allTimeline);

        await this.stockGateway.update(stockEntity);

        const output = this.presentOutput(historyEntity);

        return output;
    }

    private presentOutput(stockHistory: StockHistory): CorrectStockHistoryOutputDto {
        const output: CorrectStockHistoryOutputDto = {
            id: stockHistory.id!,
            status: stockHistory.status,
            thickness: stockHistory.thickness,
            width: stockHistory.width,
            production: stockHistory.production,
            utilization: stockHistory.utilization,
            createdAt: stockHistory.createdAt,
            updatedAt: stockHistory.updatedAt,
        };

        return output;
    }
}
