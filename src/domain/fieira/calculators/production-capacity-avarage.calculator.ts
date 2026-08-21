export class ProductionCapacityAvarage {
    public static calculate(productions: number[]): number {
        if (productions.length === 0) {
            return 0;
        }

        const total = productions.reduce((sum, production) => sum + production, 0);

        return total / productions.length;
    }
}
