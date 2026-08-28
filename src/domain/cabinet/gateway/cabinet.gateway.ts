import type { Cabinet } from "../entity/cabinet.js";

export type EligibleCabinet = {
    cabinetName: string;
    width: number | null;
    thickness: number | null;
    tension: number | null;
    qtdFieiraStock: number;
    allFieirasDead: boolean;
    hasFieira: boolean;
    lastModification: Date | null;
};

export interface CabinetGateway {
    save(cabinet: Cabinet): Promise<void>;
    list(): Promise<Cabinet[]>;
    findByName(name: string): Promise<Cabinet | null>;
    findById(id: number): Promise<Cabinet | null>;
    update(cabinet: Cabinet): Promise<void>;
    delete(name: string): Promise<Cabinet | null>;
    listCabinetsEmpty(): Promise<EligibleCabinet[]>;
    listEligibleForFieira(): Promise<EligibleCabinet[]>;
}
