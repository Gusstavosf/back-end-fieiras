import type {
    StockGateway,
    StockHistoryInput,
} from "../../../../domain/stock/gateway/stock.gateway.js";
import { PrismaClient } from "../../../../generated/prisma/client.js";
import {
    Stock,
    StatusFieira as DomainStatusFieira,
} from "../../../../domain/stock/entity/stock.js";
import { StatusFieira } from "../../../../generated/prisma/client.js";

export class StockReposistoryPrisma implements StockGateway {
    private constructor(private readonly prismaClient: PrismaClient) {}

    public static build(prismaClient: PrismaClient) {
        return new StockReposistoryPrisma(prismaClient);
    }

    private decimal(value: unknown): number | null {
        return value == null ? null : Number(value);
    }

    private toEntity(stock: {
        id: number;
        fieiraId: number;
        code: string;
        status: StatusFieira;
        currentThickness: unknown;
        currentWidth: unknown;
        utilization: number;
        production: number;
        createdAt: Date;
        updatedAt: Date;
    }): Stock {
        return Stock.restore({
            id: stock.id,
            fieiraId: stock.fieiraId,
            code: stock.code,
            status: stock.status as DomainStatusFieira,
            currentThickness: this.decimal(stock.currentThickness),
            currentWidth: this.decimal(stock.currentWidth),
            utilization: stock.utilization,
            production: stock.production,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
        });
    }

    private toPersistance(stock: Stock) {
        return {
            status: stock.status as StatusFieira,
            fieiraId: stock.fieiraId,
            code: stock.code,
            currentThickness: this.decimal(stock.currentThickness),
            currentWidth: this.decimal(stock.currentWidth),
            utilization: stock.utilization,
            production: stock.production,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
        };
    }

    private toHistoryPersistence(history: StockHistoryInput) {
        return {
            stockFieiraId: history.stockFieiraId,
            status: history.status as StatusFieira,
            thickness: this.decimal(history.thickness),
            width: this.decimal(history.width),
            production: history.production,
            utilization: history.utilization ?? 0,
        };
    }

    public async save(stock: Stock): Promise<void> {
        await this.prismaClient.stockFieira.create({
            data: this.toPersistance(stock),
        });
    }

    public async list(): Promise<Stock[]> {
        const stocksFromDb = await this.prismaClient.stockFieira.findMany();

        const stockList = stocksFromDb.map((stock) => this.toEntity(stock));

        return stockList;
    }

    public async findByCode(code: string, fieiraId: number): Promise<Stock | null> {
        const stockCode = await this.prismaClient.stockFieira.findFirst({
            where: { code, fieiraId },
        });

        if (!stockCode) return null;

        return this.toEntity(stockCode);
    }

    public async findIdCabinetByName(cabinet: string): Promise<number | null> {
        const cabinetName = await this.prismaClient.cabinet.findFirst({
            where: { name: cabinet },
        });

        return cabinetName ? cabinetName.id : null;
    }

    public async update(stock: Stock): Promise<void> {
        if (!stock.id) return;

        await this.prismaClient.stockFieira.update({
            where: { id: stock.id },
            data: this.toPersistance(stock),
        });
    }

    public async findById(id: number): Promise<Stock | null> {
        const stockId = await this.prismaClient.stockFieira.findUnique({
            where: { id },
        });

        if (!stockId) return null;

        return this.toEntity(stockId);
    }

    public async saveHistory(history: StockHistoryInput): Promise<void> {
        await this.prismaClient.stockFieiraHistory.create({
            data: this.toHistoryPersistence(history),
        });
    }

    public async delete(id: number): Promise<void> {
        await this.prismaClient.stockFieira.delete({
            where: { id },
        });
    }
}
