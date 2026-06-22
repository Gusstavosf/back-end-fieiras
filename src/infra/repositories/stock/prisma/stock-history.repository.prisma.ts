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
            thickness: stockHistoryId.thickness ? Number(stockHistoryId.thickness) : null,
            width: stockHistoryId.width ? Number(stockHistoryId.width) : null,
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
                thickness: stockHistory.thickness ? Number(stockHistory.thickness) : null,
                width: stockHistory.width ? Number(stockHistory.width) : null,
                production: stockHistory.production,
                utilization: stockHistory.utilization,
                createdAt: stockHistory.createdAt,
                updatedAt: stockHistory.updatedAt,
            },
        });
    }
}
