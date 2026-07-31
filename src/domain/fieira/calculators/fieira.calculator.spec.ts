import { FieiraCalculator } from "./fieira.calculator.js";
import { Material } from "./over-metal.calculator.js";
import { RadiusCalculator } from "./radius.calculator.js";

describe("FieiraCalculator", () => {
    it.only("should calculate the fieira dimensions and nominal capacity", () => {
        const result = FieiraCalculator.calculate({
            material: Material.Cu,
            tension: 60,
            width: 4,
            thickness: 1.9,
        });

        console.log(result);

        console.log(RadiusCalculator.calculate(1.9));
        expect(result.fieiraWidth).toBe(4.02);
        expect(result.fieiraThickness).toBe(1.9);
        expect(result.nominalCapacity).toBeGreaterThan(0);
    });
});
