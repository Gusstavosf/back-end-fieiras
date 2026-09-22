import type { RequestHandler, Request, Response } from "express";
import type {
    ListReservationFieiraPendingOutputDto,
    ListReservationFieiraPendingUseCase,
} from "../../../../../../usecases/reservation-fieira/list-reservation-fieira-pending/list-reservation-fieira-pending.usecase.js";
import { HttpMethod, type Route } from "../../route.js";

export type ListReservationFieiraPendingResponseDto = {
    pendingStocks: {
        wireWidth: number;
        wireThickness: number;
        tension: number;
        qtdOrdens: number;
        orders: {
            order: number;
            material: number;
            orderQuantity: number;
            wireType: string;
            qtdFieiraNec: number;
            percentServed: number;
        }[];
        qtdFieiraNecTotal: number;
        percentServed: number;
    }[];
};

export class ListReservationFieiraPendingRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listReservationFieiraPending: ListReservationFieiraPendingUseCase,
    ) {}

    public static create(
        listReservationFieiraPending: ListReservationFieiraPendingUseCase,
    ) {
        return new ListReservationFieiraPendingRoute(
            "/reservation-fieira/pending",
            HttpMethod.GET,
            listReservationFieiraPending,
        );
    }

    public getHandler(): RequestHandler {
        return async (request: Request, response: Response) => {
            const output = await this.listReservationFieiraPending.execute();

            const responseBody = this.present(output);

            response.status(200).json(responseBody).send();
        };
    }

    public getPath(): string {
        return this.path;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    private present(
        input: ListReservationFieiraPendingOutputDto,
    ): ListReservationFieiraPendingResponseDto {
        return {
            pendingStocks: input.pendingStocks,
        };
    }
}
