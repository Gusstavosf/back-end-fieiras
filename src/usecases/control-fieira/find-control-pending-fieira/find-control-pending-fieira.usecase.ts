import type { ControlFieira } from "../../../domain/control-fieira/entity/control-fieira.js";
import type { ControlFieiraGateway } from "../../../domain/control-fieira/gateway/control-fieira.gateway.js";
import type { Usecase } from "../../usecase.js";

export type FindControlPendingFieiraIntputDto = Record<string, never>;

export type FindControlPendingFieiraOutputDto = {
    fieiraWidth: number;
    fieiraThickness: number;
    qtdOrdens: number;
    orders: {
        order: number;
        material: number;
        orderQuantity: number;
        wireType: string;
        qtdFieiraNec: number;
    }[];
    qtdFieiraNecTotal: number;
};

export class FindControlPendingFieiraUseCase implements Usecase<
    FindControlPendingFieiraIntputDto,
    FindControlPendingFieiraOutputDto[]
> {
    private constructor(private readonly controlFieiraGateway: ControlFieiraGateway) {}

    public static create(controlFieiraGateway: ControlFieiraGateway) {
        return new FindControlPendingFieiraUseCase(controlFieiraGateway);
    }

    public async execute(
        input: FindControlPendingFieiraIntputDto,
    ): Promise<FindControlPendingFieiraOutputDto[]> {
        const pendingFeiras = await this.controlFieiraGateway.findPendingFieiras();
    }

    private presentOutput(
        controlFieiras: ControlFieira[],
        fieiraWidth: number,
        fieiraThickness: number,
        qtdFieiraNecTotal: number,
    ): FindControlPendingFieiraOutputDto {
        return {
            fieiraWidth,
            fieiraThickness,
            qtdOrdens: controlFieiras.length,
            orders: controlFieiras.map((controlFieira) => ({
                order: controlFieira.order,
                material: controlFieira.material,
                orderQuantity: controlFieira.orderQuantity,
                wireType: controlFieira.wireType,
                qtdFieiraNec: controlFieira.qtdFieiraNec,
            })),
            qtdFieiraNecTotal,
        };
    }
}
