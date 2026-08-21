import type { Usecase } from "../../usecase.js";
import type { CabinetGateway } from "../../../domain/cabinet/gateway/cabinet.gateway.js";
import { Cabinet } from "../../../domain/cabinet/entity/cabinet.js";
import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";

export type CreateCabinetInputDto = {
    name: string;
};

export type CreateCabinetOutputDto = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateCabinetUseCase implements Usecase<
    CreateCabinetInputDto,
    CreateCabinetOutputDto
> {
    private constructor(private readonly cabinetGateway: CabinetGateway) {}

    public static create(cabinetGateway: CabinetGateway) {
        return new CreateCabinetUseCase(cabinetGateway);
    }

    public async execute(input: CreateCabinetInputDto): Promise<CreateCabinetOutputDto> {
        const cabinetExisting = await this.cabinetGateway.findByName(input.name);

        if (cabinetExisting) {
            throw new IncorrectRequest(`O armário com o nome ${input.name} já existe`);
        }

        const newCabinet = Cabinet.create(input.name);

        const output = this.presentOutput(newCabinet);

        return output;
    }

    private presentOutput(cabinet: Cabinet): CreateCabinetOutputDto {
        const output: CreateCabinetOutputDto = {
            id: cabinet.id,
            name: cabinet.name,
            createdAt: cabinet.createdAt,
            updatedAt: cabinet.updatedAt,
        };

        return output;
    }
}
