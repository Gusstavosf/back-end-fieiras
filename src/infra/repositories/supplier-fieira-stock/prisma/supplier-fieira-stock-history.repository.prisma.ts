import { PrismaClient } from "../../../../generated/prisma/client.js";
import type { SupplierStockFieiraHistoryGateway } from "../../../../domain/supplier-fieira-stock/gateway/supplier-fieira-stock-history.gateway.js";
import { SupplierFieiraStockHistory } from "../../../../domain/supplier-fieira-stock/entity/supplier-fieira-stock-history.js";

export class SupplierFieiraStockHistoryRepositoryPrisma implements SupplierStockFieiraHistoryGateway {
    private constructor(private readonly prismaClient: PrismaClient) {}

    public static build(prismaClient: PrismaClient) {
        return new SupplierFieiraStockHistoryRepositoryPrisma(prismaClient);
    }

    private toEntity(stock: {
        id: number;
        supplierFieiraStockId: number;
        quantitySent: number;
        createdAt: Date;
        updatedAt: Date;
    }): SupplierFieiraStockHistory {
        return SupplierFieiraStockHistory.restore({
            id: stock.id,
            supplierFieiraStockId: stock.supplierFieiraStockId,
            quantitySent: stock.quantitySent,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
        });
    }

    private toPersistence(stock: SupplierFieiraStockHistory) {
        return {
            supplierFieiraStockId: stock.supplierFieiraStockId,
            quantitySent: stock.quantitySent,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
        };
    }

    public async findById(id: number): Promise<SupplierFieiraStockHistory | null> {
        const stock = await this.prismaClient.supplierFieiraStockHistory.findUnique({
            where: { id },
        });
        return stock ? this.toEntity(stock) : null;
    }

    public async listBySupplierFieiraStockId(
        supplierFieiraStockId: number,
    ): Promise<SupplierFieiraStockHistory[] | null> {
        const stocks = await this.prismaClient.supplierFieiraStockHistory.findMany({
            where: { supplierFieiraStockId },
        });
        return stocks.length > 0 ? stocks.map((stock) => this.toEntity(stock)) : null;
    }

    public async update(stock: SupplierFieiraStockHistory): Promise<void> {
        await this.prismaClient.supplierFieiraStockHistory.update({
            where: { id: stock.id },
            data: this.toPersistence(stock),
        });
    }

    public async delete(id: number): Promise<void> {
        await this.prismaClient.supplierFieiraStockHistory.delete({
            where: { id },
        });
    }
}
