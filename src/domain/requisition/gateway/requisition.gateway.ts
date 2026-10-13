import { Requisition } from "../entity/requisition.js";
import type { Tension } from "../../control-fieira/entity/control-fieira.js";

export type RequisitionProcessed = {
    id: number;
    cabinet: string;
    dimension: string;
    wireType: string;
    tension: Tension;
    codes: {
        code: string;
    }[];
    destination: string;
    material: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
};

export type RequisitionToBeProcessed = {
    cabinet: string;
    dimension: string;
    wireType: string;
    tension: Tension;
    destination: number;
    material: number;
    necessaryQty: number;
    availableQty: number;
    requiredQty: number;
    createdAt: Date;
    updatedAt: Date;
};

export interface RequisitionGateway {
    save(requisition: Requisition): Promise<Requisition>;
    update(requisition: Requisition): Promise<Requisition>;
    delete(id: number): Promise<void>;
    findById(id: number): Promise<Requisition | null>;
    findByOrder(order: number): Promise<Requisition | null>;
    listRequisitionToBeProcessed(): Promise<Requisition[]>;
    listRequisitionProcessed(): Promise<RequisitionProcessed[]>;
    list(): Promise<Requisition[]>;
}
