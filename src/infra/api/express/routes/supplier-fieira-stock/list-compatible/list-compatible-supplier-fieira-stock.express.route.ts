import { HttpMethod, type Route } from "../../route.js";
import type { Request, Response } from "express";
import {
    ListCompatibleSupplierFieiraStockUseCase,
    type ListCompatibleSupplierFieiraStockOutputDto,
} from "../../../../../../usecases/supplier-fieira-stock/list-compatible-supplier-fieira-stock/list-compatible-supplier-fieira-stock.usecase.js";

export type ListCompatibleSupplierFieiraStockResponseDto = {
    supplierFieiraStock: {
        id: number;
        thickness: number;
        width: number;
        quantitySent: number;
        quantityUsed: number;
        createdAt: Date;
        updatedAt: Date;
    }[];
};

export class ListCompatibleSupplierFieiraStockRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listCompatibleSupplierFieiraStockService: ListCompatibleSupplierFieiraStockUseCase,
    ) {}

    public static create(
        listCompatibleSupplierFieiraStockService: ListCompatibleSupplierFieiraStockUseCase,
    ) {
        return new ListCompatibleSupplierFieiraStockRoute(
            "/supplier-fieira-stock/compatible",
            HttpMethod.GET,
            listCompatibleSupplierFieiraStockService,
        );
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const { width, thickness } = request.query;

            const result = await this.listCompatibleSupplierFieiraStockService.execute({
                thickness: Number(thickness),
                width: Number(width),
            });

            response.json(this.present(result));
        };
    }

    public getPath(): string {
        return this.path;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    private present(
        input: ListCompatibleSupplierFieiraStockOutputDto,
    ): ListCompatibleSupplierFieiraStockResponseDto {
        const response: ListCompatibleSupplierFieiraStockResponseDto = {
            supplierFieiraStock: input.supplierStock.map((supplierStock) => ({
                id: supplierStock.id!,
                thickness: supplierStock.thickness,
                width: supplierStock.width,
                quantitySent: supplierStock.quantitySent,
                quantityUsed: supplierStock.quantityUsed,
                createdAt: supplierStock.createdAt,
                updatedAt: supplierStock.updatedAt,
            })),
        };
        return response;
    }
}
