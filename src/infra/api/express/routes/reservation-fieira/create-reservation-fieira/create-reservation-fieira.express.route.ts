import type { RequestHandler, Request, Response } from "express";
import type {
    CreateReservationFieiraInputDto,
    CreateReservationFieiraOutputDto,
    CreateReservationFieiraUseCase,
} from "../../../../../../usecases/reservation-fieira/create-reservation-fieira/create-reservation-fieira.usecase.js";
import { HttpMethod, type Route } from "../../route.js";

export type CreateReservationFieiraResponseDto = {
    controlFieiraId: number;
    stockFieiraId: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateReservationFieiraRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createReservationFieiraService: CreateReservationFieiraUseCase,
    ) {}

    public static create(createReservationFieiraService: CreateReservationFieiraUseCase) {
        return new CreateReservationFieiraRoute(
            "/reservation-fieira",
            HttpMethod.PATCH,
            createReservationFieiraService,
        );
    }

    public getHandler(): RequestHandler {
        return async (request: Request, response: Response) => {
            const input: CreateReservationFieiraInputDto = {
                order: request.body.order,
                stockFieiraId: request.body.stockFieiraId,
            };

            const output = await this.createReservationFieiraService.execute(input);

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

    public present(
        output: CreateReservationFieiraOutputDto,
    ): CreateReservationFieiraResponseDto {
        return {
            controlFieiraId: output.controlFieiraId,
            stockFieiraId: output.stockFieiraId,
            quantity: output.quantity,
            createdAt: output.createdAt,
            updatedAt: output.updatedAt,
        };
    }
}
