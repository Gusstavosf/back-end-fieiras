import { HttpMethod, type Route } from "../../route.js";
import type { Request, Response } from "express";
import {
    SentoToSupplierFieiraStockUseCase,
    type SentoToSupplierFieiraStockOutputDto,
} from "../../../../../../usecases/supplier-fieira-stock/sent-to-supplier-fieira-stock/sent-to-supplier-fieira-stock.usecase.js";

export class SentToSupplierFieiraStockRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly updateSupplierFieiraStockService: SentoToSupplierFieiraStockUseCase,
    ) {}

    public static create(
        updateSupplierFieiraStockService: SentoToSupplierFieiraStockUseCase,
    ) {
        return new SentToSupplierFieiraStockRoute(
            "/supplier-fieira-stock/sent",
            HttpMethod.POST,
            updateSupplierFieiraStockService,
        );
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const result = await this.updateSupplierFieiraStockService.execute({
                id: Number(request.params.id),
                thickness: Number(request.body.thickness),
                width: Number(request.body.width),
                quantitySent: Number(request.body.quantitySent),
            });

            response.status(200).json(result as SentoToSupplierFieiraStockOutputDto);
        };
    }

    public getPath(): string {
        return this.path;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }
}
