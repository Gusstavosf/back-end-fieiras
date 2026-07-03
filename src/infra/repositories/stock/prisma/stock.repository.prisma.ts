import type {
    StockGateway,
    StockHistoryInput,
} from "../../../../domain/stock/gateway/stock.gateway.js";
import { PrismaClient } from "../../../../generated/prisma/client.js";
import { Stock, StatusFieira } from "../../../../domain/stock/entity/stock.js";
import type { StockFieiraUncheckedCreateInput } from "../../../../generated/prisma/models.js";

export class StockReposistoryPrisma implements StockGateway {
    private constructor(private readonly prismaClient: PrismaClient) {}

    public static build(prismaClient: PrismaClient) {
        return new StockReposistoryPrisma(prismaClient);
    }

    public async save(stock: Stock): Promise<void> {
        const data: StockFieiraUncheckedCreateInput = {
            fieiraId: stock.fieiraId,
            code: stock.code,
            status: stock.status as StatusFieira,
            currentThickness:
                stock.currentThickness == null ? null : Number(stock.currentThickness),
            currentWidth: stock.currentWidth == null ? null : Number(stock.currentWidth),
            utilization: stock.utilization,
            production: stock.production,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
        };

        await this.prismaClient.stockFieira.create({
            data,
        });
    }

    public async list(): Promise<Stock[]> {
        const stocksFromDb = await this.prismaClient.stockFieira.findMany();

        const stockList = stocksFromDb.map((stock) => {
            return Stock.restore({
                id: stock.id,
                fieiraId: stock.fieiraId,
                code: stock.code,
                status: stock.status as StatusFieira,
                currentThickness:
                    stock.currentThickness == null
                        ? null
                        : Number(stock.currentThickness),
                currentWidth:
                    stock.currentWidth == null ? null : Number(stock.currentWidth),
                utilization: stock.utilization,
                production: stock.production,
                createdAt: stock.createdAt,
                updatedAt: stock.updatedAt,
            });
        });

        return stockList;
    }

    public async findByCode(code: string, fieiraId: number): Promise<Stock | null> {
        const stockCode = await this.prismaClient.stockFieira.findFirst({
            where: { code, fieiraId },
        });

        if (!stockCode) return null;

        return Stock.restore({
            id: stockCode.id,
            fieiraId: stockCode.fieiraId,
            code: stockCode.code,
            status: stockCode.status as StatusFieira,
            currentThickness:
                stockCode.currentThickness == null
                    ? null
                    : Number(stockCode.currentThickness),
            currentWidth:
                stockCode.currentWidth == null ? null : Number(stockCode.currentWidth),
            utilization: stockCode.utilization ?? 0,
            production: stockCode.production ?? 0,
            createdAt: stockCode.createdAt,
            updatedAt: stockCode.updatedAt,
        });
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
            data: {
                fieiraId: stock.fieiraId,
                code: stock.code,
                status: stock.status as StatusFieira,
                currentThickness: stock.currentThickness ?? null,
                currentWidth: stock.currentWidth ?? null,
                utilization: stock.utilization,
                production: stock.production,
            },
        });
    }

    public async findById(id: number): Promise<Stock | null> {
        const stockId = await this.prismaClient.stockFieira.findUnique({
            where: { id },
        });

        if (!stockId) return null;

        return Stock.restore({
            id: stockId.id,
            fieiraId: stockId.fieiraId,
            code: stockId.code,
            status: stockId.status as StatusFieira,
            currentThickness:
                stockId.currentThickness == null
                    ? null
                    : Number(stockId.currentThickness),
            currentWidth:
                stockId.currentWidth == null ? null : Number(stockId.currentWidth),
            utilization: stockId.utilization,
            production: stockId.production,
            createdAt: stockId.createdAt,
            updatedAt: stockId.updatedAt,
        });
    }

    public async saveHistory(history: StockHistoryInput): Promise<void> {
        const data = {
            stockFieiraId: history.stockFieiraId,
            status: history.status,
            thickness: history.thickness === null ? null : Number(history.thickness),
            width: history.width === null ? null : Number(history.width),
            production: history.production,
            utilization: history.utilization ?? 0,
        };

        await this.prismaClient.stockFieiraHistory.create({
            data,
        });
    }

    public async detele(id: number): Promise<void> {
        await this.prismaClient.stockFieira.delete({
            where: { id },
        });
    }
}
