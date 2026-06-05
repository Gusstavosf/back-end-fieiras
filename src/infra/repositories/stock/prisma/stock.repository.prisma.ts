import type { StockGateway } from "../../../../domain/stock/gateway/stock.gateway.js";
import { PrismaClient } from "../../../../generated/prisma/client.js";
import { Stock, StatusFieira } from "../../../../domain/stock/entity/stock.js";

export class StockReposistoryPrisma implements StockGateway{

    private constructor(private readonly prismaClient: PrismaClient){}

    public static build(prismaClient: PrismaClient){
        return new StockReposistoryPrisma(prismaClient);
    }

    public async save(stock: Stock) : Promise<void>{

        const data = {
            cabinetId: stock.cabinetId,
            code: stock.code,
            status: stock.status as any,
            currentThickness: null, 
            currentWidth: null, 
            utilization: 0, 
            production: 0, 
        };

        await this.prismaClient.stockFieira.create({
            data,
        });
    };

    public async list(): Promise<Stock[]> {

        const stocksFromDb = await this.prismaClient.stockFieira.findMany();

        const stockList = stocksFromDb.map((stock: any) => {
        return Stock.restore({
            id: stock.id,
            cabinetId: stock.cabinetId,
            code: stock.code,
            status: stock.status as StatusFieira, 
            currentThickness: stock.currentThickness ?? undefined, 
            currentWidth: stock.currentWidth ?? undefined,
            utilization: stock.utilization ?? 0,
            production: stock.production ?? 0,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt
        });
    });

    return stockList;

    }

    public async findByCode(code: string, cabinetId: number): Promise<Stock | null> {
        const stockCode = await this.prismaClient.stockFieira.findFirst({
            where: {code, cabinetId}
        })

        if(!stockCode) return null;

        return Stock.restore({
            id: stockCode.id,
            cabinetId: stockCode.cabinetId,
            code: stockCode.code,
            status: stockCode.status as StatusFieira,
            currentThickness: Number(stockCode.currentThickness) ?? undefined,
            currentWidth: Number(stockCode.currentWidth) ?? undefined,
            utilization: stockCode.utilization ?? 0,
            production: stockCode.production ?? 0,
            createdAt: stockCode.createdAt,
            updatedAt: stockCode.updatedAt
        })
    }

    public async findIdCabinetByName(cabinet: string): Promise<number | null> {
        const cabinetName = await this.prismaClient.cabinet.findFirst({
            where: {name: cabinet}
        })

        return cabinetName ? cabinetName.id : null;
    }

    public async update(stock: Stock): Promise<void> {
        if(!stock.id) return

        await this.prismaClient.stockFieira.update({
            where: {id: stock.id}, 
            data: {
                cabinetId: stock.cabinetId,
                code: stock.code,
                status: stock.status as any,
                currentThickness: stock.currentThickness ?? null,
                currentWidth: stock.currentWidth ?? null,
                utilization: stock.utilization ?? 0,
                production: stock.production ?? 0,
            }
        })
    }

    public async findById(id: number): Promise<Stock | null> {
        const stockId = await this.prismaClient.stockFieira.findUnique({
            where: { id }
        })

        if (!stockId) return null;

        return Stock.restore({
            id: stockId.id,
            cabinetId: stockId.cabinetId,
            code: stockId.code,
            status: stockId.status as StatusFieira,
            currentThickness: Number(stockId.currentThickness) ?? undefined,
            currentWidth: Number(stockId.currentWidth) ?? undefined,
            utilization: stockId.utilization ?? 0,
            production: stockId.production ?? 0,
            createdAt: stockId.createdAt,
            updatedAt: stockId.updatedAt
        })
    }
    
}