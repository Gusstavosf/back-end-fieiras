import { ControlFieira } from "../entity/control-fieira.js";

export interface ControlFieiraGateway {
    save(controlFieira: ControlFieira): Promise<ControlFieira>;
    list(): Promise<ControlFieira[]>;
    findByOrder(order: number): Promise<ControlFieira | null>;
    findPendingFieiras(): Promise<ControlFieira[]>;
    update(controlFieira: ControlFieira): Promise<void>;
    delete(order: number): Promise<void>;
}
