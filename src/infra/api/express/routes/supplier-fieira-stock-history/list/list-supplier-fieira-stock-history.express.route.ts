import type { Request, Response } from "express";
import { HttpMethod, type Route } from "../../route.js";
import type {
    ListSupplierFieiraStockHistoryOutputDto,
    ListSupplierFieiraStockHistoryUseCase,
} from "../../../../../../usecases/supplier-fieira-stock-history/list-supplier-fieira-stock-history/list-supplier-fieira-stock-history.usecase.js";

export type ListSupplierFieiraStockHistoryResponseDto = {
    supplierFieiraStockHistory: {
        id: number;
        supplierFieiraStockId: number;
        quantitySent: number;
        createdAt: Date;
        updatedAt: Date;
    }[];
};

export class ListSupplierFieiaStockHistoryRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listSupplierFieiraStockHistoryUseCase: ListSupplierFieiraStockHistoryUseCase,
    ) {}

    public static create(
        listSupplierFieiraStockHistoryUseCase: ListSupplierFieiraStockHistoryUseCase,
    ) {
        return new ListSupplierFieiaStockHistoryRoute(
            "/supplier-fieira-stock-history/:supplierFieiraStockId",
            HttpMethod.GET,
            listSupplierFieiraStockHistoryUseCase,
        );
    }

    public getHandler() {
        return async (request: Request, response: Response) => {
            const supplierFieiraStockId = Number(request.params.supplierFieiraStockId);

            const output = await this.listSupplierFieiraStockHistoryUseCase.execute({
                supplierFieiraStockId,
            });

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
        input: ListSupplierFieiraStockHistoryOutputDto,
    ): ListSupplierFieiraStockHistoryResponseDto {
        const output: ListSupplierFieiraStockHistoryResponseDto = {
            supplierFieiraStockHistory: input.supplierFieiraStockHistory.map(
                (history) => ({
                    id: history.id,
                    supplierFieiraStockId: history.supplierFieiraStockId,
                    quantitySent: history.quantitySent,
                    createdAt: history.createdAt,
                    updatedAt: history.updatedAt,
                }),
            ),
        };
        return output;
    }
}
