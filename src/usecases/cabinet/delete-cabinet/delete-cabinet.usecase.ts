import NotFound from "../../../core/shared/errors/notFound.js";
import type { Cabinet } from "../../../domain/cabinet/entity/cabinet.js";
import type { CabinetGateway } from "../../../domain/cabinet/gateway/cabinet.gateway.js";
import type { Usecase } from "../../usecase.js";

export type DeleteCabinetInputDto = {
    name: string;
};

export type DeleteCabinetOutputDto = {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
};

export class DeleteCabinetUseCase implements Usecase<
    DeleteCabinetInputDto,
    DeleteCabinetOutputDto
> {
    private constructor(private readonly cabinetGateway: CabinetGateway) {}

    public static create(cabinetGateway: CabinetGateway) {
        return new DeleteCabinetUseCase(cabinetGateway);
    }

    public async execute(input: DeleteCabinetInputDto): Promise<DeleteCabinetOutputDto> {
        const deleteCabinet = await this.cabinetGateway.findByName(input.name);

        if (!deleteCabinet) {
            throw new NotFound(`O armário ${deleteCabinet} não foi encontrado`);
        }

        const cabinet = await this.cabinetGateway.delete(input.name);

        if (!cabinet) {
            throw new NotFound(`O armário ${cabinet} não foi encontrado`);
        }

        const output = this.presentOutput(cabinet);

        return output;
    }

    private presentOutput(cabinets: Cabinet): DeleteCabinetOutputDto {
        const output: DeleteCabinetOutputDto = {
            id: cabinets.id,
            name: cabinets.name,
            createdAt: cabinets.createdAt,
            updatedAt: cabinets.updatedAt,
        };
        return output;
    }
}
