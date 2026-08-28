import type { RequestHandler, Request, Response } from "express";
import type {
    ListControlFieiraOutputDto,
    ListControlFieiraUseCase,
} from "../../../../../../usecases/control-fieira/list-control-fieira/list-control-fieira.usecase.js";
import { HttpMethod, type Route } from "../../route.js";
import type {
    Metal,
    Tension,
} from "../../../../../../domain/control-fieira/entity/control-fieira.js";

export type ListControlFieiraResponseDto = {
    controlFieira: {
        id: number;
        fieiraId: number | null;
        cabinetName: string | null;
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
    }[];
};

export class ListControlFieiraRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listControlFieiraService: ListControlFieiraUseCase,
    ) {}

    public static create(listControlFieiraService: ListControlFieiraUseCase) {
        return new ListControlFieiraRoute(
            "/control-fieira",
            HttpMethod.GET,
            listControlFieiraService,
        );
    }

    public getHandler(): RequestHandler {
        return async (request: Request, response: Response) => {
            const output = await this.listControlFieiraService.execute();

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

    private present(input: ListControlFieiraOutputDto): ListControlFieiraResponseDto {
        return {
            controlFieira: input.controlFieira,
        };
    }
}
