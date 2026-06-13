import type { Request, RequestHandler, Response } from "express";
import {
    UpdateStockUseCase,
    type UpdateStockOutputDto,
} from "../../../../../usecases/stock/update-stock/update-stock.usecase.js";
import { HttpMethod, type Route } from "../route.js";
import type { StatusFieira } from "../../../../../domain/stock/entity/stock.js";
import { StockZodValidator } from "../../validators/stock.zod.validator.js";
import { validationStock } from "../../../../middlewares/validationStock.js";

export type UpdateStockResponseDto = {
    id: number;
    cabinetId: number;
    code: string;
    status: StatusFieira;
    currentThickness?: number | undefined;
    currentWidth?: number | undefined;
    utilization?: number | undefined;
    production?: number | undefined;
    createdAt: Date;
    updatedAt: Date;
};

export class UpdateStockRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly updateStockService: UpdateStockUseCase,
    ) {}

    public static create(updateStockService: UpdateStockUseCase) {
        return new UpdateStockRoute("/stock/:id", HttpMethod.PATCH, updateStockService);
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const id = parseInt(String(request.params.id));

            const input = {
                id,
                status: request.body.status,
                thickness:
                    request.body.thickness !== undefined
                        ? Number(request.body.thickness)
                        : undefined,
                width:
                    request.body.width !== undefined
                        ? Number(request.body.width)
                        : undefined,
                production:
                    request.body.production !== undefined
                        ? Number(request.body.production)
                        : undefined,
                utilization:
                    request.body.utilization !== undefined
                        ? Number(request.body.utilization)
                        : undefined,
            };

            const output = await this.updateStockService.execute(input);

            const responseBody = this.present(output);

            response.status(200).json(responseBody);
        };
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    public getPath(): string {
        return this.path;
    }

    public getMiddlewares(): RequestHandler[] {
        const stockValidator = StockZodValidator.build();

        return [validationStock(stockValidator)];
    }

    private present(stock: UpdateStockOutputDto): UpdateStockResponseDto {
        const response = {
            id: stock.id,
            cabinetId: stock.cabinetId,
            code: stock.code,
            status: stock.status as StatusFieira,
            currentThickness: stock.currentThickness,
            currentWidth: stock.currentWidth,
            utilization: stock.utilization,
            production: stock.production,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
        };

        return response;
    }
}
