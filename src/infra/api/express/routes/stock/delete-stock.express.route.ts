import type { Request, Response } from "express";
import type { StatusFieira } from "../../../../../domain/stock/entity/stock.js";
import type {
    DeleteStockInputDto,
    DeleteStockUseCase,
} from "../../../../../usecases/stock/delete-stock/delete-stock.usecase.js";
import { HttpMethod, type Route } from "../route.js";

export type DeleteStockResponseDto = {
    id: number | undefined;
    fieiraId: number;
    status: StatusFieira;
    code: string;
    currentThickness: number | null;
    cuurrentWidth: number | null;
    production: number;
    utilization: number;
    createdAt: Date;
    updatedAt: Date;
};

export class DeleteStockRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly deleteService: DeleteStockUseCase,
    ) {}

    public static create(deleteService: DeleteStockUseCase) {
        return new DeleteStockRoute("/stock/:id", HttpMethod.DELETE, deleteService);
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const { id } = request.params;

            const input: DeleteStockInputDto = {
                id: Number(id),
            };

            const output = await this.deleteService.execute(input);

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

    private presentOutput(stock: DeleteStockResponseDto): DeleteStockResponseDto {
        return {
            id: stock.id,
            fieiraId: stock.fieiraId,
            status: stock.status,
            code: stock.code,
            currentThickness: stock.currentThickness,
            cuurrentWidth: stock.cuurrentWidth,
            production: stock.production,
            utilization: stock.utilization,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
        };
    }
}
