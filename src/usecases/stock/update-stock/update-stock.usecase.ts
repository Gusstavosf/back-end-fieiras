import { Stock, StatusFieira } from "../../../domain/stock/entity/stock.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import type { Usecase } from "../../usecase.js";
import NotFound from "../../../core/shared/errors/notFound.js";

export type UpdateStockInputDto = {
    cabinetName: string;
    code: string;
    status: StatusFieira;
    thickness?: number;
    width?: number;
    utilization?: number;
    production?: number;
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
        const idCabinet = await this.stockGateway.findIdCabinetByName(input.cabinetName);

        if (!idCabinet) {
            throw new NotFound(`O armário ${input.cabinetName} não existe no sistema.`);
        }

        const stockEntity = await this.stockGateway.findByCode(input.code, idCabinet);

        if (!stockEntity) {
            throw new NotFound(
                `A fieira ${input.code} não foi encontrada dentro do armário ${input.cabinetName} .`,
            );
        }

        const isNewStatus = input.status === StatusFieira.New;

        const details =
            !isNewStatus &&
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
                : null;

        stockEntity.update(input.status, details);

        await this.stockGateway.update(stockEntity);

        if (isNewStatus) {
            await this.stockGateway.saveHistory({
                stockFieiraId: stockEntity.id!,
                status: StatusFieira.New,
                thickness: null,
                width: null,
                production: 0,
                utilization: 0,
            });
        } else if (details) {
            await this.stockGateway.saveHistory({
                stockFieiraId: stockEntity.id!,
                status: stockEntity.status,
                thickness: details.thickness,
                width: details.width,
                production: details.production,
                utilization: stockEntity.utilization,
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

        if (stock.currentThickness !== null) {
            output.currentThickness = stock.currentThickness;
        }

        if (stock.currentWidth !== null) {
            output.currentWidth = stock.currentWidth;
        }

        return output;
    }
}
