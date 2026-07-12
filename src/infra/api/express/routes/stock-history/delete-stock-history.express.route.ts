import type { Request, Response } from "express";
import type { StatusFieira } from "../../../../../domain/stock/entity/stock.js";
import type {
    DeleteStockHistoryInputDto,
    DeleteStockHistoryUseCase,
} from "../../../../../usecases/stock-history/delete-stock-history/delete-stock-history.usecase.js";
import { HttpMethod, type Route } from "../route.js";

export type DeleteStockHistoryResponseDto = {
    status: StatusFieira;
    thickness?: number | null | undefined;
    width?: number | null | undefined;
    production?: number | undefined;
    utilization: number;
    createdAt: Date;
    updatedAt: Date;
};

export class DeleteStockHistoryRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly deleteHistoryService: DeleteStockHistoryUseCase,
    ) {}

    public static create(deleteHistoryService: DeleteStockHistoryUseCase) {
        return new DeleteStockHistoryRoute(
            "/stock/history/:id",
            HttpMethod.DELETE,
            deleteHistoryService,
        );
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const { id } = request.params;

            const input: DeleteStockHistoryInputDto = {
                id: Number(id),
            };

            const output = await this.deleteHistoryService.execute(input);

            const responseBody = this.presentOutput(output);

            response.status(200).json(responseBody);
        };
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    public getPath(): string {
        return this.path;
    }

    private presentOutput(
        history: DeleteStockHistoryResponseDto,
    ): DeleteStockHistoryResponseDto {
        return {
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
