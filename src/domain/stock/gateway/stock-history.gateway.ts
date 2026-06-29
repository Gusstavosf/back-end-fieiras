import { StockHistory } from "../entity/stock-history.js";

export interface StockHistoryGateway {
    findById(id: number): Promise<StockHistory | null>;
    update(stockHistory: StockHistory): Promise<void>;
    listByStockId(stockFieiraid: number): Promise<StockHistory[]>;
    delete(id: number): Promise<void>;
}
