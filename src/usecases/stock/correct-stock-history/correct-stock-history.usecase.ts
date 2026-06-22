import type { StatusFieira } from "../../../domain/stock/entity/stock.js";
import type { StockHistoryGateway } from "../../../domain/stock/gateway/stock-history.gateway.js";
import type { Usecase } from "../../usecase.js";

export type CorrectStockHistoryInputDto = {
    ind: number;
    status: StatusFieira;
    thickness: number | null;
    width: number | null;
    production: number;
    utilization: number;
};

export type CorrectStockHistoryOutputDto = {
    ind: number;
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
    constructor(private readonly historyGateway: StockHistoryGateway) {}

    public async execute(input: CorrectStockHistoryInputDto) {}
}
