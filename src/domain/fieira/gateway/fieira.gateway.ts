import type { Fieira } from "../entity/fieira.js";

export interface FieiraGateway {
    save(fieira: Fieira): Promise<Fieira>;
    list(): Promise<Fieira[]>;
    findByName(cabinetName: string): Promise<Fieira | null>;
    findById(id: number): Promise<Fieira | null>;
    findByCabinetId(cabinetId: number): Promise<Fieira | null>;
    findByDimensions(
        width: number,
        thickness: number,
        tension: number,
    ): Promise<Fieira | null>;
    update(fieira: Fieira): Promise<void>;
    deleteByCabinetName(cabinetName: string): Promise<void>;
}
