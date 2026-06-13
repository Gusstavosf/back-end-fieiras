import type {
    CreateStockInputDto,
    CreateStockOutputDto,
    CreateStockUseCase,
} from "../../../../../usecases/stock/create-stock/create-stock.usecase.js";
import { validationStock } from "../../../../middlewares/validationStock.js";
import { type Route, HttpMethod } from "../route.js";
import type { Request, RequestHandler, Response } from "express";
import { StockZodValidator } from "../../validators/stock.zod.validator.js";

export type CreateStockResponseDto = {
    cabinetId: number;
    code: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateStockRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createStockService: CreateStockUseCase,
    ) {}

    public static create(createStockService: CreateStockUseCase) {
        return new CreateStockRoute("/stock", HttpMethod.POST, createStockService);
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const input: CreateStockInputDto = {
                cabinetName: request.body.cabinetName,
                code: request.body.code,
            };

            const output: CreateStockOutputDto =
                await this.createStockService.execute(input);

            const responseBody = this.present(output);

            response.status(201).json(responseBody);
        };
    }

    public getPath(): string {
        return this.path;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    public getMiddlewares(): RequestHandler[] {
        const stockValidator = StockZodValidator.build();

        return [validationStock(stockValidator)];
    }

    private present(output: CreateStockOutputDto): CreateStockResponseDto {
        return {
            cabinetId: output.cabinetId,
            code: output.code,
            status: output.status,
            createdAt: output.createdAt,
            updatedAt: output.updatedAt,
        };
    }
}
