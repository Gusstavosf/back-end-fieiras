import type { Fieira } from "../entity/fieira.js";

export interface FieiraGateway {
    save(fieira: Fieira): Promise<void>;
    list(): Promise<Fieira[]>;
    findByName(cabinetName: string): Promise<Fieira | null>;
    findByDimensions(width: number, thickness: number): Promise<Fieira | null>;
    update(fieira: Fieira): Promise<void>;
    deleteByCabinetName(cabinetName: string): Promise<void>;
}
