import { NominalCapacityCalculator } from "./nominal-capacity.calculator.js";
import { OverMetalCalculator, type Material } from "./over-metal.calculator.js";

export type FieiraCalculatorInput = {
    material: Material;
    tension: 60 | 90 | 120 | 140 | 170 | 220;
    width: number;
    thickness: number;
};

export type FieiraCalculatorOutput = {
    fieiraWidth: number;
    fieiraThickness: number;
    nominalCapacity: number;
};

export class FieiraCalculator {
    public static calculate(input: FieiraCalculatorInput): FieiraCalculatorOutput {
        const dimensions = OverMetalCalculator.calculate(input);

        const nominalCapacity = NominalCapacityCalculator.calculate({
            width: input.width,
            thickness: input.thickness,
            material: input.material,
        });

        return {
            fieiraWidth: dimensions.fieiraWidth,
            fieiraThickness: dimensions.fieiraThickness,
            nominalCapacity: nominalCapacity,
        };
    }
}

export class RequiredFieiraCalculator {
    public static calculate(orderQuantity: number, nominalCapacity: number): number {
        return Math.ceil(orderQuantity / nominalCapacity);
    }
}
