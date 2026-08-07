import type { Cabinet } from "../../cabinet/entity/cabinet.js";
import { StatusFieira, Stock } from "../entity/stock.js";

export type StockHistoryInput = {
    stockFieiraId: number;
    status: StatusFieira;
    thickness?: number | null;
    width?: number | null;
    production: number;
    utilization?: number;
};

export type UpdateHistoryInput = {
    status: string;
    thickness?: number | null;
    width?: number | null;
    production: number;
    utilization: number;
};

export interface StockGateway {
    save(stock: Stock): Promise<void>;
    list(): Promise<Stock[]>;
    findById(id: number): Promise<Stock | null>;
    findByCode(code: string, cabinetId: number): Promise<Stock | null>;
    findIdCabinetByName(cabinet: string): Promise<number | null>;
    findEmptyCabinet(): Promise<Cabinet | null>;
    findReusableCabinets(): Promise<Cabinet[]>;
    update(stock: Stock): Promise<void>;
    saveHistory(history: StockHistoryInput): Promise<void>;
    delete(id: number): Promise<void>;
}
