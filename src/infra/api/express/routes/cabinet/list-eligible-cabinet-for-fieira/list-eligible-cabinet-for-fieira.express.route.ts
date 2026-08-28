import type { RequestHandler } from "express";
import type {
    ListEligibleCabinetForFieiraUseCase,
    ListEligibleCabinetForFieiraOutputDto,
} from "../../../../../../usecases/cabinet/list-eligible-cabinet-for-fieira/list-eligible-cabinet-for-fieira.usecase.js";
import { HttpMethod, type Route } from "../../route.js";
import type { Request, Response } from "express";

export type ListEligibleCabinetForFieiraResponseDto = {
    eligibleCabinets: {
        cabinetName: string;
        dimension: string | null;
        tension: number | null;
        qtdFieiraStock: number;
        lastModification: Date | null;
    }[];
};

export class ListEligibleCabinetsForFieiraRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listEligibleCabinetForFieiraService: ListEligibleCabinetForFieiraUseCase,
    ) {}

    public static create(
        listEligibleCabinetForFieiraService: ListEligibleCabinetForFieiraUseCase,
    ) {
        return new ListEligibleCabinetsForFieiraRoute(
            "/cabinet/eligible-for-fieira",
            HttpMethod.GET,
            listEligibleCabinetForFieiraService,
        );
    }

    public getHandler(): RequestHandler {
        return async (request: Request, response: Response) => {
            const output = await this.listEligibleCabinetForFieiraService.execute();

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
        input: ListEligibleCabinetForFieiraOutputDto,
    ): ListEligibleCabinetForFieiraResponseDto {
        const response: ListEligibleCabinetForFieiraResponseDto = {
            eligibleCabinets: input.eligibleCabinets.map((eligibleCabinets) => ({
                cabinetName: eligibleCabinets.cabinetName,
                dimension: eligibleCabinets.dimension,
                tension: eligibleCabinets.tension,
                qtdFieiraStock: eligibleCabinets.qtdFieiraStock,
                lastModification: eligibleCabinets.lastModification,
            })),
        };

        return response;
    }
}
