import { Stock } from "../entity/stock.js";

export interface StockGateway {
    save(stock: Stock) : Promise<void>
    list(): Promise<Stock[]>;
    findById(id: number): Promise<Stock | null>;
    findByCode(code: string, cabinetId: number): Promise<Stock| null>;
    findIdCabinetByName(cabinet: string): Promise <number | null>;
    update(stock: Stock) : Promise<void>;
}