import type { SupplierFieiraStock } from "../entity/supplier-fieira-stock.ts";

export interface SupplierFieiraStockGateway {
    save(stock: SupplierFieiraStock): Promise<SupplierFieiraStock>;

    findById(id: number): Promise<SupplierFieiraStock | null>;

    list(): Promise<SupplierFieiraStock[]>;

    findCompatible(width: number, thickness: number): Promise<SupplierFieiraStock[]>;

    update(stock: SupplierFieiraStock): Promise<SupplierFieiraStock>;
}
