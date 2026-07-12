import NotFound from "../../../core/shared/errors/notFound.js";
import type { StockHistory } from "../../../domain/stock/entity/stock-history.js";
import type { StatusFieira } from "../../../domain/stock/entity/stock.js";
import type { StockHistoryGateway } from "../../../domain/stock/gateway/stock-history.gateway.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import type { Usecase } from "../../usecase.js";

export type DeleteStockHistoryInputDto = {
    id: number;
};

export type DeleteStockHistoryOutputDto = {
    stockFieiraId: number;
    status: StatusFieira;
    thickness: number | null;
    width: number | null;
    production: number;
    utilization: number;
    createdAt: Date;
    updatedAt: Date;
};

export class DeleteStockHistoryUseCase implements Usecase<
    DeleteStockHistoryInputDto,
    DeleteStockHistoryOutputDto
> {
    constructor(
        private readonly historyGateway: StockHistoryGateway,
        private readonly stockGateway: StockGateway,
    ) {}

    public static create(
        historyGateway: StockHistoryGateway,
        stockGateway: StockGateway,
    ) {
        return new DeleteStockHistoryUseCase(historyGateway, stockGateway);
    }

    public async execute(
        input: DeleteStockHistoryInputDto,
    ): Promise<DeleteStockHistoryOutputDto> {
        const historyStockEntity = await this.historyGateway.findById(input.id);

        if (!historyStockEntity) {
            throw new NotFound(
                `O registro de histórico com ID ${input.id} não existe no sistema.`,
            );
        }

        const timeline = await this.historyGateway.listByStockId(
            historyStockEntity.stockFieiraId,
        );

        if (!timeline) {
            throw new NotFound(`A fieira vinculada a este histórico não foi encontrada.`);
        }

        historyStockEntity.validateDelete(timeline);

        await this.historyGateway.delete(historyStockEntity.id);

        const timelineFilter = timeline.filter(
            (item) => item.id !== historyStockEntity.id,
        );

        const sortedTimeLine = [...timelineFilter].sort((a, b) => a.id! - b.id!);

        const stockEntity = await this.stockGateway.findById(
            historyStockEntity.stockFieiraId,
        );

        if (!stockEntity) {
            throw new NotFound(`A fieira vinculada a este histórico não foi encontrada.`);
        }

        historyStockEntity.renderUtilizations(sortedTimeLine);

        stockEntity.recalculateFromHistory(timelineFilter);

        await this.historyGateway.updateMany(sortedTimeLine);

        await this.stockGateway.update(stockEntity);

        const output = this.presentOutput(historyStockEntity);

        return output;
    }

    private presentOutput(stockHistory: StockHistory): DeleteStockHistoryOutputDto {
        const output: DeleteStockHistoryOutputDto = {
            stockFieiraId: stockHistory.stockFieiraId,
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
