import type { Request, Response } from "express";
import { HttpMethod, type Route } from "../../route.js";
import type {
    UpdateSupplierFieiraStockHistoryInputDto,
    UpdateSupplierFieiraStockHistoryOutputDto,
    UpdateSupplierFieiraStockHistoryUseCase,
} from "../../../../../../usecases/supplier-fieira-stock-history/update/update-supplier-fieira-stock-history.usecase.js";

export type UpdateSupplierFieiraStockHistoryResponseDto = {
    id: number;
    supplierFieiraStockId: number;
    quantitySent: number;
    createdAt: Date;
    updatedAt: Date;
};

export class UpdateSupplierFieiraStockHistoryRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly updateSupplierFieiraStockHistoryUseCase: UpdateSupplierFieiraStockHistoryUseCase,
    ) {}

    public static create(
        updateSupplierFieiraStockHistoryUseCase: UpdateSupplierFieiraStockHistoryUseCase,
    ) {
        return new UpdateSupplierFieiraStockHistoryRoute(
            "/supplier-fieira-stock-history/:id",
            HttpMethod.PATCH,
            updateSupplierFieiraStockHistoryUseCase,
        );
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const { id } = request.params;

            const input: UpdateSupplierFieiraStockHistoryInputDto = {
                id: Number(id),
                quantitySent: Number(request.body.quantitySent),
            };

            const output =
                await this.updateSupplierFieiraStockHistoryUseCase.execute(input);

            const responseBody = this.presentOutput(output);

            response.status(200).send().json(responseBody);
        };
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    public getPath(): string {
        return this.path;
    }

    private presentOutput(
        supplierStockHistory: UpdateSupplierFieiraStockHistoryOutputDto,
    ): UpdateSupplierFieiraStockHistoryResponseDto {
        return {
            id: supplierStockHistory.id,
            supplierFieiraStockId: supplierStockHistory.supplierFieiraStockId,
            quantitySent: supplierStockHistory.quantitySent,
            createdAt: supplierStockHistory.createdAt,
            updatedAt: supplierStockHistory.updatedAt,
        };
    }
}
