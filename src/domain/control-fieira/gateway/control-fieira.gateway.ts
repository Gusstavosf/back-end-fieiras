import { ControlFieira } from "../entity/control-fieira.js";

export type ControlFieiraWithCabinetName = {
    controlFieira: ControlFieira;
    cabinetName: string | null;
};

export interface ControlFieiraGateway {
    save(controlFieira: ControlFieira): Promise<ControlFieira>;
    list(): Promise<ControlFieiraWithCabinetName[]>;
    findByOrder(order: number): Promise<ControlFieira | null>;
    findByOrders(orders: number[]): Promise<ControlFieira[]>;
    listPendingFieiras(): Promise<ControlFieira[]>;
    listFieirasPendingStock(): Promise<ControlFieira[]>;
    update(controlFieira: ControlFieira): Promise<void>;
    delete(order: number): Promise<void>;
}
