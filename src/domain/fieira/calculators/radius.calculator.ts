export class RadiusCalculator {
    public static calculate(thickness: number): number {
        if (thickness <= 1.6) {
            return 0.5;
        }

        if (thickness <= 2.24) {
            return 0.65;
        }

        if (thickness <= 3.55) {
            return 0.8;
        }

        return 1.0;
    }
}
