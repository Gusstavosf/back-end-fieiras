import type { RequestHandler } from "express";
import { HttpMethod, type Route } from "../../route.js";
import type { Request, Response } from "express";
import type {
    ListControlFieiraWithoutCabinetOutputDto,
    ListControlFieiraWithoutCabinetUseCase,
} from "../../../../../../usecases/control-fieira/list-control-fieira-without-cabinet/list-control-fieira-without-cabinet.usecase.js";

export type ListControlFieiraWithoutCabinetResponseDto = {
    pendingFieira: {
        fieiraWidth: number;
        fieiraThickness: number;
        tension: number;
        qtdOrdens: number;
        orders: {
            order: number;
            material: number;
            orderQuantity: number;
            wireType: string;
            qtdFieiraNec: number;
        }[];
        qtdFieiraNecTotal: number;
    }[];
};

export class ListControlFieiraWithoutCabinetRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listControlFieiraWithoutCabinetService: ListControlFieiraWithoutCabinetUseCase,
    ) {}

    public static create(
        listControlFieiraWithoutCabinetService: ListControlFieiraWithoutCabinetUseCase,
    ) {
        return new ListControlFieiraWithoutCabinetRoute(
            "/control-fieira/without-cabinet",
            HttpMethod.GET,
            listControlFieiraWithoutCabinetService,
        );
    }

    public getHandler(): RequestHandler {
        return async (request: Request, response: Response) => {
            const output = await this.listControlFieiraWithoutCabinetService.execute();

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
        output: ListControlFieiraWithoutCabinetOutputDto,
    ): ListControlFieiraWithoutCabinetResponseDto {
        return {
            pendingFieira: output.pendingFieira,
        };
    }
}
