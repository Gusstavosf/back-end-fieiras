import type { Cabinet } from "../../../domain/cabinet/entity/cabinet.js";
import type { CabinetGateway } from "../../../domain/cabinet/gateway/cabinet.gateway.js";
import type { Usecase } from "../../usecase.js";

export type ListCabinetInputDto = void;

export type ListCabinetOutputDto = {
    cabinets: {
        name: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
};

export class ListCabinetUseCase implements Usecase<
    ListCabinetInputDto,
    ListCabinetOutputDto
> {
    private constructor(private readonly cabinetGateway: CabinetGateway) {}

    public static create(cabinetGateway: CabinetGateway) {
        return new ListCabinetUseCase(cabinetGateway);
    }

    public async execute(): Promise<ListCabinetOutputDto> {
        const cabinetsFromDb = await this.cabinetGateway.list();

        const output = this.presentOutput(cabinetsFromDb);

        return output;
    }

    private presentOutput(cabinets: Cabinet[]): ListCabinetOutputDto {
        return {
            cabinets: cabinets.map((cabinet) => ({
                id: cabinet.id,
                name: cabinet.name,
                createdAt: cabinet.createdAt,
                updatedAt: cabinet.updatedAt,
            })),
        };
    }
}
