import type { Request, RequestHandler, Response } from "express";
import {
    UpdateStockUseCase,
    type UpdateStockOutputDto,
} from "../../../../../usecases/stock/update-stock/update-stock.usecase.js";
import { HttpMethod, type Route } from "../route.js";
import type { StatusFieira } from "../../../../../domain/stock/entity/stock/stock.js";
import { UpdateStockZodValidator } from "../../validators/stock/update-stock.zod.validator.js";
import { validationStock } from "../../../../middlewares/validationStock.js";

export type UpdateStockResponseDto = {
    id: number;
    cabinetId: number;
    code: string;
    status: StatusFieira;
    currentThickness?: number | undefined;
    currentWidth?: number | undefined;
    utilization?: number;
    production?: number;
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
        return new UpdateStockRoute("/stock/", HttpMethod.PATCH, updateStockService);
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const {
                cabinetName,
                code,
                status,
                thickness,
                width,
                production,
                utilization,
            } = request.body;

            const input = {
                cabinetName,
                code,
                status: status as StatusFieira,
                thickness: thickness !== undefined ? Number(thickness) : undefined,
                width: width !== undefined ? Number(width) : undefined,
                production: production !== undefined ? Number(production) : undefined,
                utilization: utilization !== undefined ? Number(utilization) : undefined,
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
        const stockValidator = UpdateStockZodValidator.build();

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
