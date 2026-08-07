import type { Cabinet } from "../entity/cabinet.js";

export interface CabinetGateway {
    save(cabinet: Cabinet): Promise<void>;
    list(): Promise<Cabinet[]>;
    findByName(name: string): Promise<Cabinet | null>;
    update(cabinet: Cabinet): Promise<void>;
    delete(name: string): Promise<void>;
}
