import type { Usecase } from "../../usecase.js";
import { Stock, StatusFieira } from "../../../domain/stock/entity/stock.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";
import NotFound from "../../../core/shared/errors/notFound.js";

export type CreateStockInputDto = {
    cabinetName: string;
    code: string;
};

export type CreateStockOutputDto = {
    cabinetId: number;
    code: string;
    status: StatusFieira;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateStockUseCase implements Usecase<
    CreateStockInputDto,
    CreateStockOutputDto
> {
    private constructor(private readonly stockGateway: StockGateway) {}

    public static create(stockGateway: StockGateway) {
        return new CreateStockUseCase(stockGateway);
    }

    public async execute(input: CreateStockInputDto): Promise<CreateStockOutputDto> {
        const idCabinet = await this.stockGateway.findIdCabinetByName(input.cabinetName);

        if (!idCabinet) {
            throw new NotFound(`O armário '${input.cabinetName}' não existe no sistema.`);
        }

        const existing = await this.stockGateway.findByCode(input.code, idCabinet);

        if (existing) {
            throw new IncorrectRequest(
                `A fieira ${input.code} já está cadastrada neste armário`,
            );
        }

        const stockEntity = Stock.create(idCabinet, input.code);

        await this.stockGateway.save(stockEntity);

        const idFromStock = await this.stockGateway.findByCode(input.code, idCabinet);

        if (!idFromStock) {
            throw new NotFound(
                `Não foi possível recuperar a fieira criada para o histórico.`,
            );
        }

        await this.stockGateway.saveHistory({
            stockFieiraId: idFromStock.id!,
            status: stockEntity.status,
            thickness: null,
            width: null,
            production: 0,
            utilization: 0,
        });

        const output = this.presentOutput(idFromStock);

        return output;
    }

    private presentOutput(stock: Stock): CreateStockOutputDto {
        const output: CreateStockOutputDto = {
            cabinetId: stock.cabinetId,
            code: stock.code,
            status: stock.status,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
        };

        return output;
    }
}
