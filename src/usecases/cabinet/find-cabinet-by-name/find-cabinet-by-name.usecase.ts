import NotFound from "../../../core/shared/errors/notFound.js";
import type { CabinetGateway } from "../../../domain/cabinet/gateway/cabinet.gateway.js";
import type { Cabinet } from "../../../generated/prisma/client.js";

export type FindCabinetByNameInputDto = {
    name: string;
};

export type FindCabinetByNameOutputDto = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
};

export class FindCabinetByNameUseCase {
    constructor(private readonly CabinetGateway: CabinetGateway) {}

    public static create(cabinetGateway: CabinetGateway) {
        return new FindCabinetByNameUseCase(cabinetGateway);
    }

    public async execute(
        input: FindCabinetByNameInputDto,
    ): Promise<FindCabinetByNameOutputDto> {
        const cabinet = await this.CabinetGateway.findByName(input.name);

        if (!cabinet) {
            throw new NotFound(`Cabinet com nome ${input.name} não foi encontrado.`);
        }

        const output = this.presentOutput(cabinet);

        return output;
    }

    private presentOutput(cabinets: Cabinet): FindCabinetByNameOutputDto {
        const output: FindCabinetByNameOutputDto = {
            id: cabinets.id,
            name: cabinets.name,
            createdAt: cabinets.createdAt,
            updatedAt: cabinets.updatedAt,
        };

        return output;
    }
}
