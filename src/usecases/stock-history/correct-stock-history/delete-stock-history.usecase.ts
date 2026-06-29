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

export class DeleteStockHistoryuseCase implements Usecase<
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
        return new DeleteStockHistoryuseCase(historyGateway, stockGateway);
    }

    public async execute(
        input: DeleteStockHistoryInputDto,
    ): Promise<DeleteStockHistoryOutputDto> {
        const historyEntity = await this.historyGateway.findById(input.id);

        if (!historyEntity) {
            throw new NotFound(
                `O registro de histórico com ID ${input.id} não existe no sistema.`,
            );
        }

        const timeline = await this.historyGateway.listByStockId(
            historyEntity.stockFieiraId,
        );

        if (!timeline) {
            throw new NotFound(`A fieira vinculada a este histórico não foi encontrada.`);
        }

        historyEntity.validateDelete(timeline);

        await this.historyGateway.delete(historyEntity.id);

        const stockEntity = await this.stockGateway.findById(historyEntity.stockFieiraId);

        if (!stockEntity) {
            throw new NotFound(`A fieira vinculada a este histórico não foi encontrada.`);
        }

        stockEntity.recalculateFromHistory(timeline);

        await this.stockGateway.update(stockEntity);

        const output = this.presentOutput(historyEntity);

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
