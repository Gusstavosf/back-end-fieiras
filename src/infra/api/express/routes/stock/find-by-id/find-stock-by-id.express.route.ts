import type { NextFunction, Request, Response } from "express";
import type { FindStockByIdUseCase } from "../../../../../../usecases/stock/find-stock-by-id/find-stock-by-id.usecase.js";
import { HttpMethod, type Route } from "../../route.js";
import IncorrectRequest from "../../../../../../core/shared/errors/incorrectRequest.js";

export class FindStockByIdRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly findStockByIdUseCase: FindStockByIdUseCase,
    ) {}

    public static create(findStockByIdUseCase: FindStockByIdUseCase) {
        return new FindStockByIdRoute("/stock/:id", HttpMethod.GET, findStockByIdUseCase);
    }

    public getHandler() {
        return async (request: Request, response: Response, next: NextFunction) => {
            try {
                const id = Number(request.params.id);

                if (isNaN(id)) {
                    throw new IncorrectRequest(
                        `O ID fornecido deve ser um número válido.`,
                    );
                }

                const output = await this.findStockByIdUseCase.execute({ id });

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
