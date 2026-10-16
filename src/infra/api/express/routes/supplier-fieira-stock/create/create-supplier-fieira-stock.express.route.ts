import { type Route, HttpMethod } from "../../route.js";
import type { Request, Response } from "express";
import type {
    CreateSupplierStockFieiraUseCase,
    CreateSupplierStockFieiraOutputDto,
} from "../../../../../../usecases/supplier-fieira-stock/create-supplier-fieira-stock/create-supplier-fieira-stock.usecase.js";

export type CreateSupplierFieiraStockResponseDto = {
    id: number;
    thickness: number;
    width: number;
    quantitySent: number;
    quantityUsed: number;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateSupplierFieiraStockRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createSupplierFieiraStockService: CreateSupplierStockFieiraUseCase,
    ) {}

    public static create(
        createSupplierFieiraStockService: CreateSupplierStockFieiraUseCase,
    ) {
        return new CreateSupplierFieiraStockRoute(
            "/supplier-fieira-stock",
            HttpMethod.POST,
            createSupplierFieiraStockService,
        );
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const input = {
                thickness: request.body.thickness,
                width: request.body.width,
                quantitySent: request.body.quantitySent,
            };

            const output = await this.createSupplierFieiraStockService.execute(input);

            const responseBody = this.present(output);

            response.status(201).json(responseBody);
        };
    }

    getPath(): string {
        return this.path;
    }

    getMethod(): HttpMethod {
        return this.method;
    }

    private present(
        output: CreateSupplierStockFieiraOutputDto,
    ): CreateSupplierFieiraStockResponseDto {
        return {
            id: output.id,
            thickness: output.thickness,
            width: output.width,
            quantitySent: output.quantitySent,
            quantityUsed: 0,
            createdAt: output.createdAt,
            updatedAt: output.updatedAt,
        };
    }
}
