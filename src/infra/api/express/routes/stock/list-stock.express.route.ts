import { StatusFieira } from "../../../../../domain/stock/entity/stock.js";
import { ListStockUseCase, type ListStockInputDto, type ListStockOutputDto } from "../../../../../usecases/stock/list-estoque/list-stock.usecase.js";
import { HttpMethod, type Route } from "../route.js";
import type { Request, Response } from "express";

export type ListStockResponseDto = {
    stock: {
        id?: number | undefined;             
        cabinetId: number;
        code: string;
        status: StatusFieira;
        currentThickness?: number | undefined;
        currentWidth?: number | undefined;    
        utilization?: number | undefined;     
        production?: number | undefined;      
        createdAt: Date;
        updatedAt: Date;
    }[];
};

export class ListStockRoute implements Route {

    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listStockService: ListStockUseCase,
    ){}

    public static create(listStockService: ListStockUseCase){
        return new ListStockRoute(
            "/stock",
            HttpMethod.GET,
            listStockService
        )
    };

    public getHandler() {
        return async(request: Request, response: Response) => {

            const output = await this.listStockService.execute()

            const responseBody = this.present(output);

            response.status(200).json(responseBody).send();
        }
    }

    public getPath(): string {
        return this.path;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    private present(input: ListStockOutputDto) : ListStockResponseDto {
        const response: ListStockResponseDto = {
            stock: input.stock.map((stock) => ({
                id: stock.id,
                cabinetId: stock.cabinetId,
                code: stock.code,
                status: stock.status,
                currentThickness: stock.currentThickness,
                currentWidth: stock.currentWidth,
                utilization: stock.utilization,
                production: stock.production,
                createdAt: stock.createdAt,
                updatedAt: stock.updatedAt,
            })),
        };

        return response;
    }
}