import type { StatusFieira } from "../../../../../domain/stock/entity/stock.js";
import type {
    CorrectStockHistoryInputDto,
    CorrectStockHistoryUseCase,
} from "../../../../../usecases/stock-history/correct-stock-history/correct-stock-history.usecase.js";
import { CorrectStockHistoryZodValidator } from "../../validators/stock-history/correct-stock-history.zod.validator.js";
import { HttpMethod, type Route } from "../route.js";
import type { Request, RequestHandler, Response } from "express";
import { validationStock } from "../../../../middlewares/validationStock.js";

export type CorrectStockHistoryResponseDto = {
    id: number;
    status: StatusFieira;
    thickness?: number | null | undefined;
    width?: number | null | undefined;
    production?: number | undefined;
    utilization: number;
    createdAt: Date;
    updatedAt: Date;
};

export class CorrectStockHistoryRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly updateHistoryService: CorrectStockHistoryUseCase,
    ) {}

    public static create(updateHistoryService: CorrectStockHistoryUseCase) {
        return new CorrectStockHistoryRoute(
            "/stock/history/:id",
            HttpMethod.PATCH,
            updateHistoryService,
        );
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const { id } = request.params;

            const { status, thickness, width, production } = request.body;

            const input: CorrectStockHistoryInputDto = {
                id: Number(id),
                status: status as StatusFieira,
                thickness:
                    thickness !== undefined
                        ? thickness === null
                            ? null
                            : Number(thickness)
                        : undefined,
                width:
                    width !== undefined
                        ? width === null
                            ? null
                            : Number(width)
                        : undefined,
                production: production !== undefined ? Number(production) : undefined,
            };

            const output = await this.updateHistoryService.execute(input);

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
        const stockHistoryValidaor = CorrectStockHistoryZodValidator.build();

        return [validationStock(stockHistoryValidaor)];
    }

    private present(
        history: CorrectStockHistoryResponseDto,
    ): CorrectStockHistoryResponseDto {
        return {
            id: history.id,
            status: history.status,
            thickness: history.thickness,
            width: history.width,
            production: history.production,
            utilization: history.utilization,
            createdAt: history.createdAt,
            updatedAt: history.updatedAt,
        };
    }
}
