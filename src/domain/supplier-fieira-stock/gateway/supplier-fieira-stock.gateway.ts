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
    update(stock: SupplierFieiraStock): Promise<SupplierFieiraStock>;
    listCompatible(width: number, thickness: number): Promise<SupplierFieiraStock[]>;
    findByDimensions(
        width: number,
        thickness: number,
    ): Promise<SupplierFieiraStock | null>;
    saveHistory(history: SupplierFieiraStockHistoryInput): Promise<void>;
}
