import { ControlFieira } from "../entity/control-fieira.js";

export interface ControlFieiraGateway {
    save(controlFieira: ControlFieira): Promise<void>;
    list(): Promise<ControlFieira[]>;
    findById(id: number): Promise<ControlFieira | null>;
    update(controlFieira: ControlFieira): Promise<void>;
    delete(id: number): Promise<void>;
}
