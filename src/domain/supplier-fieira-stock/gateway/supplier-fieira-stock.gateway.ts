import type { SupplierFieiraStock } from "../entity/supplier-fieira-stock.ts";

export type SupplierFieiraStockHistoryInput = {
    supplierFieiraStockId: number;
    quantitySent: number;
    createdAt: Date;
    updatedAt: Date;
};

export interface SupplierFieiraStockGateway {
    save(stock: SupplierFieiraStock): Promise<SupplierFieiraStock>;
    findById(id: number): Promise<SupplierFieiraStock | null>;
    list(): Promise<SupplierFieiraStock[]>;
    delete(id: number): Promise<void>;
    update(stock: SupplierFieiraStock): Promise<void>;
    sentFieira(id: number, quantitySent: number): Promise<void>;
    listCompatible(thickness: number, width: number): Promise<SupplierFieiraStock[]>;
    findByDimensions(
        thickness: number,
        width: number,
    ): Promise<SupplierFieiraStock | null>;
    saveHistory(history: SupplierFieiraStockHistoryInput): Promise<void>;
}
