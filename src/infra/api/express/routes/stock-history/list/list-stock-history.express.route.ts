import type { NextFunction, Request, Response } from "express";
import { ListStockHistoryUseCase } from "../../../../../../usecases/stock-history/list-stock-history/list-stock-history.usecase.js";
import { HttpMethod, type Route } from "../../route.js";
import IncorrectRequest from "../../../../../../core/shared/errors/incorrectRequest.js";

export class ListStockHistoryRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listStockHistoryUseCase: ListStockHistoryUseCase,
    ) {}

    public static create(listStockHistoryUseCase: ListStockHistoryUseCase) {
        return new ListStockHistoryRoute(
            "/stock/history/:stockFieiraId",
            HttpMethod.GET,
            listStockHistoryUseCase,
        );
    }

    public getHandler() {
        return async (request: Request, response: Response, next: NextFunction) => {
            try {
                const stockFieiraId = Number(request.params.stockFieiraId);

                if (isNaN(stockFieiraId)) {
                    throw new IncorrectRequest(
                        `O ID fornecido deve ser um número válido.`,
                    );
                }

                const output = await this.listStockHistoryUseCase.execute({
                    stockFieiraId,
                });

                response.status(200).json(output);
            } catch (error) {
                next(error);
            }
        };
    }

    public getPath(): string {
        return this.path;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }
}
