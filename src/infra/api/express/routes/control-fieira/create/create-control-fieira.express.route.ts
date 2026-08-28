import type { RequestHandler, Request, Response } from "express";
import type {
    CreateControlFieiraInputDto,
    CreateControlFieiraOutputDto,
    CreateControlFieiraUseCase,
} from "../../../../../../usecases/control-fieira/create-control-fieira/create-control-fieira.usecase.js";
import { HttpMethod, type Route } from "../../route.js";
import type {
    Metal,
    Tension,
} from "../../../../../../domain/control-fieira/entity/control-fieira.js";

export type CreateControlFieiraResponseDto = {
    id: number;
    fieiraId: number | null;
    material: number;
    order: number;
    orderQuantity: number;
    metal: Metal;
    wireType: string;
    tension: Tension;
    width: number;
    thickness: number;
    orderStartDate: Date;
    orderEndDate: Date;
    orderCreateDate: Date;
    status: string;
    qtdFieiraNec: number;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateControlFieiraRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createControlFieiraService: CreateControlFieiraUseCase,
    ) {}

    public static create(createControlFieiraService: CreateControlFieiraUseCase) {
        return new CreateControlFieiraRoute(
            "/control-fieira",
            HttpMethod.POST,
            createControlFieiraService,
        );
    }

    public getHandler(): RequestHandler {
        return async (request: Request, response: Response) => {
            const input: CreateControlFieiraInputDto = {
                order: request.body.order,
                material: request.body.material,
                description: request.body.description,
                orderQuantity: request.body.orderQuantity,
                orderStartDate: request.body.orderStartDate,
                orderEndDate: request.body.orderEndDate,
                orderCreatedDate: request.body.orderCreateDate,
                status: request.body.status,
            };

            const output = await this.createControlFieiraService.execute(input);

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
        output: CreateControlFieiraOutputDto,
    ): CreateControlFieiraResponseDto {
        return {
            id: output.id,
            fieiraId: output.fieiraId,
            material: output.material,
            order: output.order,
            orderQuantity: output.orderQuantity,
            metal: output.metal,
            wireType: output.wireType,
            tension: output.tension,
            width: output.width,
            thickness: output.thickness,
            orderStartDate: output.orderStartDate,
            orderEndDate: output.orderEndDate,
            orderCreateDate: output.orderCreateDate,
            status: output.status,
            qtdFieiraNec: output.qtdFieiraNec,
            createdAt: output.createdAt,
            updatedAt: output.updatedAt,
        };
    }
}
