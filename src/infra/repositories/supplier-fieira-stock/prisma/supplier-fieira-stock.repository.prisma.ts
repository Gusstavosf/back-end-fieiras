import { PrismaClient } from "../../../../generated/prisma/client.js";
import type {
    SupplierFieiraStockGateway,
    SupplierFieiraStockHistoryInput,
} from "../../../../domain/supplier-fieira-stock/gateway/supplier-fieira-stock.gateway.js";
import { SupplierFieiraStock } from "../../../../domain/supplier-fieira-stock/entity/supplier-fieira-stock.js";

export class SupplierFieiraStockRepositoryPrisma implements SupplierFieiraStockGateway {
    private constructor(private readonly prismaClient: PrismaClient) {}

    public static build(prismaClient: PrismaClient) {
        return new SupplierFieiraStockRepositoryPrisma(prismaClient);
    }

    private decimal(value: unknown): number {
        return value == null ? 0 : Number(value);
    }

    private toEntity(stock: {
        id: number;
        thickness: unknown;
        width: unknown;
        quantitySent: number;
        quantityUsed: number;
        createdAt: Date;
        updatedAt: Date;
    }): SupplierFieiraStock {
        return SupplierFieiraStock.restore(
            {
                thickness: this.decimal(stock.thickness),
                width: this.decimal(stock.width),
                quantitySent: stock.quantitySent,
                quantityUsed: stock.quantityUsed,
                createdAt: stock.createdAt,
                updatedAt: stock.updatedAt,
            },
            stock.id,
        );
    }

    private toPersistence(stock: SupplierFieiraStock) {
        return {
            thickness: this.decimal(stock.thickness),
            width: this.decimal(stock.width),
            quantitySent: stock.quantitySent,
            quantityUsed: stock.quantityUsed,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
        };
    }

    public async save(stock: SupplierFieiraStock): Promise<SupplierFieiraStock> {
        await this.prismaClient.supplierFieiraStock.create({
            data: this.toPersistence(stock),
        });
        return stock;
    }

    public async findById(id: number): Promise<SupplierFieiraStock | null> {
        const stock = await this.prismaClient.supplierFieiraStock.findUnique({
            where: { id },
        });

        if (!stock) return null;

        const entity = this.toEntity(stock);

        return entity;
    }

    public async list(): Promise<SupplierFieiraStock[]> {
        const stocks = await this.prismaClient.supplierFieiraStock.findMany();

        const stockEntities = stocks.map((stock) => this.toEntity(stock));

        return stockEntities;
    }

    public async delete(id: number): Promise<void> {
        await this.prismaClient.supplierFieiraStock.delete({
            where: { id },
        });
    }

    public async update(stock: SupplierFieiraStock): Promise<void> {
        await this.prismaClient.supplierFieiraStock.update({
            where: { id: stock.id! },
            data: this.toPersistence(stock),
        });
    }

    public async sentFieira(id: number, quantitySent: number): Promise<void> {
        await this.prismaClient.supplierFieiraStock.update({
            where: { id },
            data: {
                quantitySent: {
                    increment: quantitySent,
                },
            },
        });
    }

    public async listCompatible(
        thickness: number,
        width: number,
    ): Promise<SupplierFieiraStock[]> {
        const maxThickness = Number((thickness - 0.2).toFixed(2));
        const maxWidth = Number((width - 0.2).toFixed(2));

        const stocks = await this.prismaClient.supplierFieiraStock.findMany({
            where: {
                thickness: {
                    lte: maxThickness,
                },
                width: {
                    lte: maxWidth,
                },
            },
        });

        return stocks.map((stock) => this.toEntity(stock));
    }

    public async findByDimensions(
        thickness: number,
        width: number,
    ): Promise<SupplierFieiraStock | null> {
        const fieira = await this.prismaClient.supplierFieiraStock.findUnique({
            where: {
                width_thickness: {
                    thickness,
                    width,
                },
            },
        });

        if (!fieira) return null;

        const entity = this.toEntity(fieira);

        return entity;
    }

    public async saveHistory(history: SupplierFieiraStockHistoryInput): Promise<void> {
        await this.prismaClient.supplierFieiraStockHistory.create({
            data: {
                supplierFieiraStockId: history.supplierFieiraStockId,
                quantitySent: history.quantitySent,
            },
        });
    }
}
