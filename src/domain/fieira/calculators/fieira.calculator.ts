import type { Metal, Tension } from "../../control-fieira/entity/control-fieira.js";
import { NominalCapacityCalculator } from "./nominal-capacity.calculator.js";
import { OverMetalCalculator } from "./over-metal.calculator.js";

export type FieiraCalculatorInput = {
    metal: Metal;
    tension: Tension;
    width: number;
    thickness: number;
};

export type FieiraCalculatorOutput = {
    fieiraWidth: number;
    fieiraThickness: number;
    nominalCapacity: number;
};

export type RequiredFieiraCalculatorInput = {
    orderQuantity: number;
    nominalCapacity: number;
};

export class FieiraCalculator {
    public static calculate(input: FieiraCalculatorInput): FieiraCalculatorOutput {
        const dimensions = OverMetalCalculator.calculate(input);

        const nominalCapacity = NominalCapacityCalculator.calculate({
            width: input.width,
            thickness: input.thickness,
            material: input.metal,
        });

        return {
            fieiraWidth: dimensions.fieiraWidth,
            fieiraThickness: dimensions.fieiraThickness,
            nominalCapacity: nominalCapacity,
        };
    }
}

export class RequiredFieiraCalculator {
    public static calculate(input: RequiredFieiraCalculatorInput): number {
        return Math.ceil(input.orderQuantity / input.nominalCapacity);
    }
}
