import type {
    DeleteSupplierFieiraStockHistoryInputDto,
    DeleteSupplierFieiraStockHistoryUseCase,
} from "../../../../../../usecases/supplier-fieira-stock-history/delete-supplier-fieira-stock-history/delete-supplier-fieira-stock-history.usecase.js";
import { HttpMethod, type Route } from "../../route.js";
import type { Request, Response } from "express";

export type DeleteSupplierFieiraStockHistoryResponseDto = {
    id: number | undefined;
    quantitySent: number;
    createdAt: Date;
    updatedAt: Date;
};

export class DeleteSupplierFieiraStockHistoryRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly deleteSupplierFieiraStockHistoryService: DeleteSupplierFieiraStockHistoryUseCase,
    ) {}

    public static create(
        deleteSupplierFieiraStockHistoryService: DeleteSupplierFieiraStockHistoryUseCase,
    ) {
        return new DeleteSupplierFieiraStockHistoryRoute(
            "/supplier-fieira-stock-history/:id",
            HttpMethod.DELETE,
            deleteSupplierFieiraStockHistoryService,
        );
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const { id } = request.params;
            const input: DeleteSupplierFieiraStockHistoryInputDto = {
                id: Number(id),
            };
            const output =
                await this.deleteSupplierFieiraStockHistoryService.execute(input);

            const responseDto = this.presentOutput(output);

            response.status(200).json(responseDto).send();
        };
    }

    public getPath(): string {
        return this.path;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    private presentOutput(
        input: DeleteSupplierFieiraStockHistoryResponseDto,
    ): DeleteSupplierFieiraStockHistoryResponseDto {
        return {
            id: input.id,
            quantitySent: input.quantitySent,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
        };
    }
}
