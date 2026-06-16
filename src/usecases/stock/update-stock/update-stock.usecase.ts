import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";
import { Stock } from "../../../domain/stock/entity/stock.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import { StatusFieira } from "../../../domain/stock/entity/stock.js";
import type { Usecase } from "../../usecase.js";

export type UpdateStockInputDto = {
    cabinetName: string;
    code: string;
    status: StatusFieira;
    thickness?: number | undefined;
    width?: number | undefined;
    utilization?: number | undefined;
    production?: number | undefined;
    isCorretion?: boolean;
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
            throw new IncorrectRequest(
                `O armário '${input.cabinetName}' não existe no sistema.`,
            );
        }

        const stockEntity = await this.stockGateway.findByCode(input.code, idCabinet);

        if (!stockEntity) {
            throw new IncorrectRequest(
                `A fieira ${input.code} não foi encontrada dentro do armário ${input.cabinetName} .`,
            );
        }

        if (input.isCorretion) {
            if (
                input.thickness === undefined ||
                input.width === undefined ||
                input.production === undefined ||
                input.utilization === undefined
            ) {
                throw new IncorrectRequest(
                    "Para corrigir, todos os campos (espessura, largura, produção e utilização) devem ser enviados.",
                );
            }

            stockEntity.correctMeasures({
                thickness: input.thickness,
                width: input.width,
                production: input.production,
                utilization: input.utilization,
            });

            await this.stockGateway.update(stockEntity);

            await this.stockGateway.updateLastHistory(stockEntity.id!, {
                status: stockEntity.status,
                thickness: input.thickness,
                width: input.width,
                production: input.production,
                utilization: input.utilization,
            });

            return this.presentOutput(stockEntity);
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
                : undefined;

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

        if (stock.currentThickness !== undefined) {
            output.currentThickness = stock.currentThickness;
        }

        if (stock.currentWidth !== undefined) {
            output.currentWidth = stock.currentWidth;
        }

        return output;
    }
}
