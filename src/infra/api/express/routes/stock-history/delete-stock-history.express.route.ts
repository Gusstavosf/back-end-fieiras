import type { Request, Response } from "express";
import type { StatusFieira } from "../../../../../domain/stock/entity/stock.js";
import type {
    DeleteStockHistoryInputDto,
    DeleteStockHistoryuseCase,
} from "../../../../../usecases/stock-history/correct-stock-history/delete-stock-history.usecase.js";
import { HttpMethod, type Route } from "../route.js";

export type DeleteStockHistoryResponseDto = {
    id: number;
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
        private readonly deleteHistoryService: DeleteStockHistoryuseCase,
    ) {}

    public static create(deleteHistoryService: DeleteStockHistoryuseCase) {
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

            const responseBody = this.present(output);

            response.send(200).json(responseBody);
        };
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    public getPath(): string {
        return this.path;
    }

    private present(
        history: DeleteStockHistoryResponseDto,
    ): DeleteStockHistoryResponseDto {
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
