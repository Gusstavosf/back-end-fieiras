import { HttpMethod, type Route } from "../../route.js";
import type { Request, Response } from "express";
import {
    DeleteSupplierFieiraStockUseCase,
    type DeleteSupplierFieiraStockInputDto,
} from "../../../../../../usecases/supplier-fieira-stock/delete-supplier-fieira-stock/delete-supplier-fieira-stock.usecase.js";

export type DeleteSupplierFieiraStockResponseDto = {
    id: number | undefined;
    width: number;
    thickness: number;
    quantitySent: number;
    quantityUsed: number;
    createdAt: Date;
    updatedAt: Date;
};

export class DeleteSupplierFieiraStockRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly deleteSupplierFieiraStockService: DeleteSupplierFieiraStockUseCase,
    ) {}

    public static create(
        deleteSupplierFieiraStockService: DeleteSupplierFieiraStockUseCase,
    ) {
        return new DeleteSupplierFieiraStockRoute(
            "/supplier-fieira-stock/:id",
            HttpMethod.DELETE,
            deleteSupplierFieiraStockService,
        );
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const { id } = request.params;
            const input: DeleteSupplierFieiraStockInputDto = {
                id: Number(id),
            };
            await this.deleteSupplierFieiraStockService.execute(input);

            const responseDto = this.present(input);

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
        input: DeleteSupplierFieiraStockInputDto,
    ): DeleteSupplierFieiraStockResponseDto {
        return {
            id: input.id,
            width: input.width,
            thickness: input.thickness,
            quantitySent: input.quantitySent,
            quantityUsed: input.quantityUsed,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
        };
    }
}
