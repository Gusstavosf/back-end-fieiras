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

export type ListControlFieiraWithoutCabinetIntputDto = Record<string, never>;

export type ListControlFieiraWithoutCabinetOutputDto = {
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

export class ListControlFieiraWithoutCabinetUseCase implements Usecase<
    ListControlFieiraWithoutCabinetIntputDto,
    ListControlFieiraWithoutCabinetOutputDto
> {
    private constructor(private readonly controlFieiraGateway: ControlFieiraGateway) {}

    public static create(controlFieiraGateway: ControlFieiraGateway) {
        return new ListControlFieiraWithoutCabinetUseCase(controlFieiraGateway);
    }

    public async execute(): Promise<ListControlFieiraWithoutCabinetOutputDto> {
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

        const pendingFieira = [];

        for (const group of groups.values()) {
            const totalOrderQuantity = group.controlFieiras.reduce(
                (total, controlFieira) => total + controlFieira.orderQuantity,
                0,
            );

            const qtdFieiraNecTotal = RequiredFieiraCalculator.calculate({
                orderQuantity: totalOrderQuantity,
                nominalCapacity: group.nominalCapacity,
            });

            pendingFieira.push({
                fieiraWidth: group.fieiraWidth,
                fieiraThickness: group.fieiraThickness,
                tension: group.tension,
                qtdOrdens: group.controlFieiras.length,
                orders: group.controlFieiras.map((controlFieira) => ({
                    order: controlFieira.order,
                    material: controlFieira.material,
                    orderQuantity: controlFieira.orderQuantity,
                    wireType: controlFieira.wireType,
                    qtdFieiraNec: controlFieira.qtdFieiraNec,
                })),
                qtdFieiraNecTotal: qtdFieiraNecTotal,
            });
        }

        return {
            pendingFieira,
        };
    }
}
