import type { Usecase } from "../../usecase.js"
import { Stock, StatusFieira } from "../../../domain/stock/entity/stock.js";
import type { StockGateway } from "../../../domain/stock/gateway/stock.gateway.js";
import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";

export type CreateStockInputDto = {
    cabinet: string;
    code: string;
    status: StatusFieira;
};

export type CreateStockOutputDto = {
    cabinetId: number;
    code: string;
    status: StatusFieira;
    createdAt: Date;
    updatedAt: Date; 
};

export class CreateStockUseCase 
    implements Usecase<CreateStockInputDto, CreateStockOutputDto> {

    private constructor(private readonly stockGateway: StockGateway) {}

    public static create(stockGateway: StockGateway){
        return new CreateStockUseCase(stockGateway);
    }

    public async execute(input: CreateStockInputDto): Promise<CreateStockOutputDto>{

        const idCabinet = await this.stockGateway.findIdCabinetByName(input.cabinet)

        if (!idCabinet) {
            throw new IncorrectRequest(`O armário '${input.cabinet}' não existe no sistema.`);
        };

        const existing = await this.stockGateway.findByCode(input.code, idCabinet)

        if (existing){
            throw new IncorrectRequest(`A fieira ${input.code} já está cadastrada neste armário`)
        };

        const stockEntity = Stock.create(
            idCabinet, 
            input.code, 
            input.status
        );

        const output = this.presentOutput(stockEntity)

        return output;
    }

    private presentOutput(stock: Stock): CreateStockOutputDto {

        const output: CreateStockOutputDto = {
            cabinetId: stock.cabinetId!,
            code: stock.code,
            status: stock.status,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt
        }

        return output;
    }
}