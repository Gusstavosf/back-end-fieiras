import type { Fieira } from "../entity/fieira.js";

export interface FieiraGateway {
    save(fieira: Fieira): Promise<void>;
    list(): Promise<Fieira[]>;
    findById(id: number): Promise<Fieira | null>;
    findByDimensions(
        width: number,
        thickness: number,
        material: string,
    ): Promise<Fieira | null>;
    update(fieira: Fieira): Promise<void>;
    delete(id: number): Promise<void>;
}
