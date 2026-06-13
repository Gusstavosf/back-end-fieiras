import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";
import type { Stock } from "../../../domain/stock/entity/stock.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import { StatusFieira } from "../../../domain/stock/entity/stock.js";
import type { Usecase } from "../../usecase.js";

export type UpdateStockInputDto = {
    id: number;
    status: StatusFieira;
    thickness?: number | undefined;
    width?: number | undefined;
    utilization?: number | undefined;
    production?: number | undefined;
};

export type UpdateStockOutputDto = {
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

export class UpdateStockUseCase implements Usecase<
    UpdateStockInputDto,
    UpdateStockOutputDto
> {
    private constructor(private readonly stockGateway: StockGateway) {}

    public static create(stockGateway: StockGateway) {
        return new UpdateStockUseCase(stockGateway);
    }

    public async execute(input: UpdateStockInputDto): Promise<UpdateStockOutputDto> {
        const stockEntity = await this.stockGateway.findById(input.id);

        if (!stockEntity) {
            throw new IncorrectRequest(
                `A fieira com Id ${input.id} não foi encontrada no sistema.`,
            );
        }

        const details =
            input.thickness !== undefined &&
            input.width !== undefined &&
            input.production !== undefined &&
            input.utilization !== undefined
                ? {
                      thickness: input.thickness,
                      width: input.width,
                      production: input.production,
                      utilization: input.utilization,
                  }
                : undefined;

        stockEntity.update(input.status, details);

        await this.stockGateway.update(stockEntity);

        if (details) {
            await this.stockGateway.saveHistory({
                stockFieiraId: stockEntity.id!,
                status: stockEntity.status,
                thickness: details.thickness,
                width: details.width,
                production: details.production,
                utilization: stockEntity.utilization!,
            });
        }

        const output = this.presentOutput(stockEntity);

        return output;
    }

    private presentOutput(stock: Stock): UpdateStockOutputDto {
        const output: UpdateStockOutputDto = {
            id: stock.id!,
            cabinetId: stock.cabinetId,
            code: stock.code,
            status: stock.status,
            utilization: stock.utilization ?? 0,
            production: stock.production ?? 0,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
        };

        if (stock.currentThickness !== undefined) {
            output.currentThickness = stock.currentThickness;
        }

        if (stock.currentWidth !== undefined) {
            output.currentWidth = stock.currentWidth;
        }

        return output;
    }
}
