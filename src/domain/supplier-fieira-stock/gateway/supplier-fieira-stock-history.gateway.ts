import type { SupplierFieiraStockHistory } from "../entity/supplier-fieira-stock-history.ts";

export interface SupplierStockFieiraHistoryGateway {
    findById(id: number): Promise<SupplierFieiraStockHistory | null>;
    listBySupplierFieiraStockId(
        supplierFieiraStockId: number,
    ): Promise<SupplierFieiraStockHistory[] | null>;
    update(stock: SupplierFieiraStockHistory): Promise<void>;
    delete(id: number): Promise<void>;
}
