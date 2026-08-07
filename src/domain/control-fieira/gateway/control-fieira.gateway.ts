import { ControlFieira } from "../entity/control-fieira.js";

export interface ControlFieiraGateway {
    save(controlFieira: ControlFieira): Promise<void>;
    list(): Promise<ControlFieira[]>;
    findByOrder(order: number): Promise<ControlFieira | null>;
    update(controlFieira: ControlFieira): Promise<void>;
    delete(order: number): Promise<void>;
}
