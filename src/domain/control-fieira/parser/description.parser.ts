import { Metal } from "../entity/control-fieira.js";

type ParsedDescription = {
    metal: string;
    wireType: string;
    width: number;
    thickness: number;
    tension: number;
};

type Initial = "FRC" | "FRA" | "CTC" | "CTA" | "CRC" | "CRA";
type WireType = `${Initial} ${string}`;
type Tension = 60 | 90 | 120 | 140 | 170 | 220;

export class DescriptionParser {
    private readonly supported = ["FRC", "FRA", "CTC", "CTA", "CRC", "CRA"];

    parse(description: string): ParsedDescription | null {
        const initial = description.split(" ")[0];

        if (!this.isSupported(String(initial))) {
            return null;
        }

        if (this.isLaminated(description)) {
            return null;
        }

        switch (initial) {
            case "FRC":
            case "FRA":
                return this.parseStandardWire(description);
            case "CTC":
            case "CTA":
                return this.parseCTC(description);
            case "CRC":
            case "CRA":
                return this.parseCRC(description);

            default:
                return null;
        }
    }

    parseCTC(description: string): ParsedDescription {
        const regex =
            /^(?<material>CTC|CTA).*?(?<width>\d+(?:,\d+)?)X(?<thickness>\d+(?:,\d+)?)\s+(?<tension>\d+)/;

        const match = description.match(regex);

        if (!match?.groups) {
            throw new Error("Descrição inválida.");
        }

        const { material, width, thickness, tension } = match?.groups;

        const parseMetal = this.parseMetal(String(material));
        const parsedWireType = this.parseWireType(String(material));
        const parsedDimensions = this.parseDimensions(`${width}X${thickness}`);
        const parsedTension = this.parseTension(Number(tension));

        return {
            metal: parseMetal,
            wireType: parsedWireType,
            width: parsedDimensions.width,
            thickness: parsedDimensions.thickness,
            tension: parsedTension,
        };
    }

    parseCRC(description: string): ParsedDescription {
        const regex =
            /^(?<material>CRC|CRA)\s+\d+(?<coating>P\/E|KFT).*?(?<width>\d+(?:,\d+)?)X(?<thickness>\d+(?:,\d+)?)\s+T\s+(?<tension>\d+)/;

        const match = description.match(regex);

        if (!match?.groups) {
            throw new Error("Descrição inválida.");
        }

        const { material, coating, width, thickness, tension } = match?.groups;

        const parseMetal = this.parseMetal(String(material));
        const parsedWireType = this.parseWireType(String(material), String(coating));
        const parsedDimensions = this.parseDimensions(`${width}X${thickness}`);
        const parsedTension = this.parseTension(Number(tension));

        return {
            metal: parseMetal,
            wireType: parsedWireType,
            width: parsedDimensions.width,
            thickness: parsedDimensions.thickness,
            tension: parsedTension,
        };
    }

    parseStandardWire(description: string): ParsedDescription {
        const regex =
            /^(?<material>FRC|FRA)\s+(?<coating>[A-Z0-9]+)(?:\s+T\d+)?(?:\s+\d+(?:,\d+)?%N)?(?:\s+\d+(?:,\d+)?)?\s+(?<width>\d+(?:,\d+)?)X(?<thickness>\d+(?:,\d+)?)\s+(?<process>[TL])\s+(?<tension>\d+)/;

        const match = description.match(regex);

        if (!match?.groups) {
            throw new Error("Descrição inválida.");
        }

        const { material, coating, width, thickness, tension } = match?.groups;

        const parseMetal = this.parseMetal(String(material));
        const parsedWireType = this.parseWireType(String(material), String(coating));
        const parsedDimensions = this.parseDimensions(`${width}X${thickness}`);
        const parsedTension = this.parseTension(Number(tension));

        return {
            metal: parseMetal,
            wireType: parsedWireType,
            width: parsedDimensions.width,
            thickness: parsedDimensions.thickness,
            tension: parsedTension,
        };
    }

    private isSupported(initial: string): boolean {
        return this.supported.includes(initial);
    }

    private parseMetal(metal: string): string {
        switch (metal) {
            case "FRC":
                return Metal.Cu;
            case "CTC":
                return Metal.Cu;
            case "CRC":
                return Metal.Cu;
            case "FRA":
                return Metal.Al;
            case "CTA":
                return Metal.Al;
            case "CRA":
                return Metal.Al;
            default:
                throw new Error(`Material '${metal}' não suportado.`);
        }
    }

    private parseWireType(materialCode: string, coatingCode?: string): WireType {
        const validMaterials = ["FRC", "FRA", "CTC", "CTA", "CRC", "CRA"];

        if (!validMaterials.includes(materialCode)) {
            throw new Error(`Material '${materialCode}' não suportado.`);
        }

        return coatingCode
            ? (`${materialCode} ${coatingCode}` as WireType)
            : (materialCode as WireType);
    }

    private parseDimensions(dimension: string) {
        console.log(dimension);
        const partDimension = dimension.split("X");

        const [width, thickness] = partDimension;

        return {
            width: Number(width?.replace(",", ".")),
            thickness: Number(thickness?.replace(",", ".")),
        };
    }

    private isLaminated(description: string): boolean {
        return /\sL\s/.test(description);
    }

    private parseTension(tension: number): Tension {
        const validTensions: Tension[] = [60, 90, 120, 140, 170, 220];

        if (!validTensions.includes(tension as Tension)) {
            throw new Error(`Tensão '${tension}' não suportada.`);
        }

        return tension as Tension;
    }
}
