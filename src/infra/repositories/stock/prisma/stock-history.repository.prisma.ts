import { PrismaClient } from "../../../../generated/prisma/client.js";
import { StockHistory } from "../../../../domain/stock/entity/stock-history.js";
import { StatusFieira } from "../../../../generated/prisma/client.js";
import { StatusFieira as DomainStatusFieira } from "../../../../domain/stock/entity/stock.js";
import type { StockHistoryGateway } from "../../../../domain/stock/gateway/stock-history.gateway.js";
import type { StockFieiraHistory } from "../../../../generated/prisma/browser.js";

export class StockHistoryRepositoryPrisma implements StockHistoryGateway {
    private constructor(private readonly prismaClient: PrismaClient) {}

    public static build(prismaClient: PrismaClient) {
        return new StockHistoryRepositoryPrisma(prismaClient);
    }

    private decimal(value: unknown): number | null {
        return value == null ? null : Number(value);
    }

    private toEntity(history: StockFieiraHistory): StockHistory {
        return StockHistory.restore({
            id: history.id,
            stockFieiraId: history.stockFieiraId,
            status: history.status as DomainStatusFieira,
            thickness: this.decimal(history.thickness),
            width: this.decimal(history.width),
            production: history.production,
            utilization: history.utilization,
            createdAt: history.createdAt,
            updatedAt: history.updatedAt,
        });
    }

    private toPersistence(history: StockHistory) {
        return {
            stockFieiraId: history.stockFieiraId,
            status: history.status as StatusFieira,
            thickness: this.decimal(history.thickness),
            width: this.decimal(history.width),
            production: history.production,
            utilization: history.utilization,
            createdAt: history.createdAt,
            updatedAt: history.updatedAt,
        };
    }

    public async findById(id: number): Promise<StockHistory | null> {
        const stockHistoryId = await this.prismaClient.stockFieiraHistory.findUnique({
            where: { id },
        });

        if (!stockHistoryId) return null;

        return this.toEntity(stockHistoryId);
    }

    public async update(stockHistory: StockHistory): Promise<void> {
        if (!stockHistory.id) return;

        await this.prismaClient.stockFieiraHistory.update({
            where: { id: stockHistory.id },
            data: this.toPersistence(stockHistory),
        });
    }

    public async listByStockId(stockFieiraid: number): Promise<StockHistory[]> {
        const historyIdfromDb = await this.prismaClient.stockFieiraHistory.findMany({
            where: { stockFieiraId: stockFieiraid },
        });

        const historyList = historyIdfromDb.map((stock) => this.toEntity(stock));

        return historyList;
    }

    public async delete(id: number): Promise<void> {
        await this.prismaClient.stockFieiraHistory.delete({
            where: { id },
        });
    }

    public async updateMany(histories: StockHistory[]): Promise<void> {
        const updatePromises = histories.map((history) =>
            this.prismaClient.stockFieiraHistory.update({
                where: { id: history.id },
                data: { utilization: history.utilization },
            }),
        );
        await this.prismaClient.$transaction(updatePromises);
    }
}
