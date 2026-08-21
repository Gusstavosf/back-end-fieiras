import {
    Metal,
    type Tension,
} from "../../../domain/control-fieira/entity/control-fieira.js";
import type {
    ControlFieiraGateway,
    ControlFieiraWithCabinetName,
} from "../../../domain/control-fieira/gateway/control-fieira.gateway.js";
import type { Usecase } from "../../usecase.js";

export type ListControlFieiraInputDto = void;

export type ListControlFieiraOutputDto = {
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

export class ListControlFieiraUseCase implements Usecase<
    ListControlFieiraInputDto,
    ListControlFieiraOutputDto
> {
    private constructor(private readonly controlFieiraGateway: ControlFieiraGateway) {}

    public static create(controlFieiraGateway: ControlFieiraGateway) {
        return new ListControlFieiraUseCase(controlFieiraGateway);
    }

    public async execute(): Promise<ListControlFieiraOutputDto> {
        const controlFieira = await this.controlFieiraGateway.list();

        const output = this.presentOutput(controlFieira);

        return output;
    }

    private presentOutput(
        controlFieiras: ControlFieiraWithCabinetName[],
    ): ListControlFieiraOutputDto {
        return {
            controlFieira: controlFieiras.map(({ controlFieira, cabinetName }) => ({
                id: controlFieira.id!,
                fieiraId: controlFieira.fieiraId,
                cabinetName,
                material: controlFieira.material,
                order: controlFieira.order,
                orderQuantity: controlFieira.orderQuantity,
                metal: controlFieira.metal,
                wireType: controlFieira.wireType,
                tension: controlFieira.tension,
                width: controlFieira.width,
                thickness: controlFieira.thickness,
                orderStartDate: controlFieira.orderStartDate,
                orderEndDate: controlFieira.orderEndDate,
                orderCreateDate: controlFieira.orderCreateDate,
                status: controlFieira.status,
                qtdFieiraNec: controlFieira.qtdFieiraNec,
                createdAt: controlFieira.createdAt,
                updatedAt: controlFieira.updatedAt,
            })),
        };
    }
}
