import { HttpMethod, type Route } from "../../route.js";
import type { Request, Response } from "express";
import type {
    ListSupplierFieiraStockUseCase,
    ListSupplierFieiraStockOutputDto,
} from "../../../../../../usecases/supplier-fieira-stock/list-supplier-fieira-stock/list-supplier-fieira-stock.usecase.js";

export type ListSupplierFieiraStockResponseDto = {
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

export class ListSupplierFieiraStockRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listSupplierFieiraStockService: ListSupplierFieiraStockUseCase,
    ) {}

    public static create(listSupplierFieiraStockService: ListSupplierFieiraStockUseCase) {
        return new ListSupplierFieiraStockRoute(
            "/supplier-fieira-stock",
            HttpMethod.GET,
            listSupplierFieiraStockService,
        );
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const output = await this.listSupplierFieiraStockService.execute();

            const responseDto = this.present(output);

            response.status(200).json(responseDto).send();
        };
    }

    public getPath(): string {
        return this.path;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    private present(
        input: ListSupplierFieiraStockOutputDto,
    ): ListSupplierFieiraStockResponseDto {
        const response: ListSupplierFieiraStockResponseDto = {
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
