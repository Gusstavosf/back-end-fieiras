import type { CreateStockUseCase } from "../../../../usecases/stock/create-stock/create-stock.usecase.js";
import { HttpMethod, type Route, type HttMethod } from "../route.js";

export type CreateStockResponseDto = {
    id: number;
}

export class CreateStockRoute implements Route {
    private constructor(
        private readonly path: string, 
        private readonly method: HttMethod,
        private readonly createStockService: CreateStockUseCase
    ){}

    public static create(createStockService: CreateStockUseCase){
        return new CreateStockRoute(
            "/stock",
            HttpMethod.POST,
            createStockService
        )
    }

    public getHandler(request: Request, response: Response){

        return async (request: Request, response: Response) => {
            const 
        }

    }
}