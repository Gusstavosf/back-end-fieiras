import { PrismaClient } from "../../../../generated/prisma/client.js";
import { StockHistory } from "../../../../domain/stock/entity/stock-history.js";
import { StatusFieira } from "../../../../domain/stock/entity/stock.js";
import type { StockHistoryGateway } from "../../../../domain/stock/gateway/stock-history.gateway.js";

export class StockHistoryRepositoryPrisma implements StockHistoryGateway {
    private constructor(private readonly prismaClient: PrismaClient) {}

    public static build(prismaClient: PrismaClient) {
        return new StockHistoryRepositoryPrisma(prismaClient);
    }

    public async findById(id: number): Promise<StockHistory | null> {
        const stockHistoryId = await this.prismaClient.stockFieiraHistory.findUnique({
            where: { id },
        });

        if (!stockHistoryId) return null;

        return StockHistory.restore({
            id: stockHistoryId.id,
            stockFieiraId: stockHistoryId.stockFieiraId,
            status: stockHistoryId.status as StatusFieira,
            thickness:
                stockHistoryId.thickness !== null &&
                stockHistoryId.thickness !== undefined
                    ? Number(stockHistoryId.thickness)
                    : null,
            width:
                stockHistoryId.width !== null && stockHistoryId.width !== undefined
                    ? Number(stockHistoryId.width)
                    : null,
            production: stockHistoryId.production,
            utilization: stockHistoryId.utilization,
            createdAt: stockHistoryId.createdAt,
            updatedAt: stockHistoryId.updatedAt,
        });
    }

    public async update(stockHistory: StockHistory): Promise<void> {
        if (!stockHistory.id) return;

        await this.prismaClient.stockFieiraHistory.update({
            where: { id: stockHistory.id },
            data: {
                id: stockHistory.id,
                stockFieiraId: stockHistory.stockFieiraId,
                status: stockHistory.status as StatusFieira,
                thickness:
                    stockHistory.thickness !== null &&
                    stockHistory.thickness !== undefined
                        ? Number(stockHistory.thickness)
                        : null,
                width:
                    stockHistory.width !== null && stockHistory.width !== undefined
                        ? Number(stockHistory.width)
                        : null,
                production: stockHistory.production,
                utilization: stockHistory.utilization,
                createdAt: stockHistory.createdAt,
                updatedAt: stockHistory.updatedAt,
            },
        });
    }

    public async listByStockId(stockFieiraid: number): Promise<StockHistory[]> {
        const historyIdfromDb = await this.prismaClient.stockFieiraHistory.findMany({
            where: { stockFieiraId: stockFieiraid },
        });

        const historyList = historyIdfromDb.map((stock) => {
            return StockHistory.restore({
                id: stock.id,
                stockFieiraId: stock.stockFieiraId,
                status: stock.status as StatusFieira,
                thickness:
                    stock.thickness !== null && stock.thickness !== undefined
                        ? Number(stock.thickness)
                        : null,
                width:
                    stock.width !== null && stock.width !== undefined
                        ? Number(stock.width)
                        : null,
                utilization: stock.utilization,
                production: stock.production,
                createdAt: stock.createdAt,
                updatedAt: stock.updatedAt,
            });
        });

        return historyList;
    }

    public async delete(id: number): Promise<void> {
        await this.prismaClient.stockFieiraHistory.delete({
            where: { id },
        });
    }
}
