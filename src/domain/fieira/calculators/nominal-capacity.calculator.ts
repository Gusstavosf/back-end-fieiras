import { Material } from "./over-metal.calculator.js";
import { RadiusCalculator } from "./radius.calculator.js";

export type NominalCapacityInput = {
    width: number;
    thickness: number;
    material: Material;
};

export class NominalCapacityCalculator {
    public static calculate({
        width,
        thickness,
        material,
    }: NominalCapacityInput): number {
        const radius = RadiusCalculator.calculate(thickness);

        const density = material === Material.Cu ? 8.9 : 2.7;

        const area = width * thickness - (4 * radius ** 2 - Math.PI * radius ** 2);

        const factor = thickness < 2.3 ? 12000 : 10000;

        return Number((area * (density / 1000) * factor).toFixed(0));
    }
}
