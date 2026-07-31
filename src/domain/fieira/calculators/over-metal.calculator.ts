export enum Material {
    Cu = "Cu",
    Al = "Al",
}

export type OverMetalInput = {
    material: Material;
    tension: 60 | 90 | 120 | 140 | 170 | 220;
    width: number;
    thickness: number;
};

export type OverMetalOutput = {
    overmetalWidth: number;
    overmetalThickness: number;
    fieiraWidth: number;
    fieiraThickness: number;
};

export class OverMetalCalculator {
    public static calculate({
        material,
        tension,
        width,
        thickness,
    }: OverMetalInput): OverMetalOutput {
        let overmetalWidth = 0;
        let overmetalThickness = 0;

        switch (material) {
            case Material.Cu:
                switch (tension) {
                    case 60:
                        overmetalWidth = 0.02;
                        overmetalThickness = 0;
                        break;

                    case 90:
                        overmetalWidth = Number(
                            (0.002 * width + 0.002 * thickness).toFixed(2),
                        );

                        overmetalThickness = Number(
                            (0.004 * thickness + 0.001 * width - 0.007).toFixed(2),
                        );
                        break;

                    case 120:
                        overmetalWidth = Number(
                            (0.004 * width + 0.0013 * thickness + 0.007).toFixed(2),
                        );

                        overmetalThickness = Number(
                            (0.011 * thickness - 0.001 * width - 0.005).toFixed(2),
                        );
                        break;

                    case 140:
                        overmetalWidth = Number(
                            (0.0035 * width + 0.003 * thickness + 0.025).toFixed(2),
                        );

                        overmetalThickness = Number(
                            (0.01 * thickness - 0.001 * width + 0.002).toFixed(2),
                        );
                        break;

                    case 170:
                        overmetalWidth = Number(
                            (0.007 * width + 0.002 * thickness + 0.05).toFixed(2),
                        );

                        overmetalThickness = Number(
                            (0.025 * thickness - 0.003 * width).toFixed(2),
                        );
                        break;

                    case 220:
                        overmetalWidth = Number(
                            (0.016 * width - 0.015 * thickness + 0.18).toFixed(2),
                        );

                        overmetalThickness = Number(
                            (0.04 * thickness - 0.002 * width + 0.03).toFixed(2),
                        );
                        break;
                }
                break;

            case Material.Al:
                overmetalWidth = Number(
                    (0.0035 * width - 0.0035 * thickness + 0.02).toFixed(2),
                );

                overmetalThickness = Number((0.0007 * width + 0.02).toFixed(2));
                break;
        }

        return {
            overmetalWidth,
            overmetalThickness,
            fieiraWidth: Number((width + overmetalWidth).toFixed(2)),
            fieiraThickness: Number((thickness + overmetalThickness).toFixed(2)),
        };
    }
}
