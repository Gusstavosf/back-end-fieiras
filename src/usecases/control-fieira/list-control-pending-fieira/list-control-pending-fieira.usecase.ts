import type {
    ControlFieira,
    Tension,
} from "../../../domain/control-fieira/entity/control-fieira.js";
import type { ControlFieiraGateway } from "../../../domain/control-fieira/gateway/control-fieira.gateway.js";
import {
    FieiraCalculator,
    RequiredFieiraCalculator,
} from "../../../domain/fieira/calculators/fieira.calculator.js";
import type { Usecase } from "../../usecase.js";

export type ListControlPendingFieiraIntputDto = Record<string, never>;

export type ListControlPendingFieiraOutputDto = {
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
};

export class ListControlPendingFieiraUseCase implements Usecase<
    ListControlPendingFieiraIntputDto,
    ListControlPendingFieiraOutputDto[]
> {
    private constructor(private readonly controlFieiraGateway: ControlFieiraGateway) {}

    public static create(controlFieiraGateway: ControlFieiraGateway) {
        return new ListControlPendingFieiraUseCase(controlFieiraGateway);
    }

    public async execute(): Promise<ListControlPendingFieiraOutputDto[]> {
        const pendingFeiras = await this.controlFieiraGateway.listPendingFieiras();

        const groups = new Map<
            string,
            {
                controlFieiras: ControlFieira[];
                fieiraWidth: number;
                fieiraThickness: number;
                tension: Tension;
                nominalCapacity: number;
            }
        >();

        for (const controlFieira of pendingFeiras) {
            const fieira = FieiraCalculator.calculate({
                metal: controlFieira.metal,
                tension: controlFieira.tension,
                width: controlFieira.width,
                thickness: controlFieira.thickness,
            });

            const key = `${fieira.fieiraWidth}x${fieira.fieiraThickness} - T ${controlFieira.tension}`;

            const group = groups.get(key);

            if (group) {
                group.controlFieiras.push(controlFieira);
            } else {
                groups.set(key, {
                    controlFieiras: [controlFieira],
                    fieiraWidth: fieira.fieiraWidth,
                    tension: controlFieira.tension,
                    fieiraThickness: fieira.fieiraThickness,
                    nominalCapacity: fieira.nominalCapacity,
                });
            }
        }

        const output: ListControlPendingFieiraOutputDto[] = [];

        for (const group of groups.values()) {
            const totalOrderQuantity = group.controlFieiras.reduce(
                (total, controlFieira) => total + controlFieira.orderQuantity,
                0,
            );

            const qtdFieiraNectotal = RequiredFieiraCalculator.calculate({
                orderQuantity: totalOrderQuantity,
                nominalCapacity: group.nominalCapacity,
            });

            output.push(
                this.presentOutput(
                    group.controlFieiras,
                    group.fieiraWidth,
                    group.fieiraThickness,
                    group.tension,
                    qtdFieiraNectotal,
                ),
            );
        }

        return output;
    }

    private presentOutput(
        controlFieiras: ControlFieira[],
        fieiraWidth: number,
        fieiraThickness: number,
        tension: Tension,
        qtdFieiraNecTotal: number,
    ): ListControlPendingFieiraOutputDto {
        return {
            fieiraWidth,
            fieiraThickness,
            tension,
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
