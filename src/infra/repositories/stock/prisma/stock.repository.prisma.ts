import type { StockGateway } from "../../../../domain/stock/gateway/stock.gateway.js";
import { PrismaClient } from "@prisma/client/extension";
import { Stock, StatusFieira } from "../../../../domain/stock/entity/stock.js";

export class StockReposistoryPrisma implements StockGateway{

    private constructor(private readonly prismaClient: PrismaClient){}

    public static build(prismaClient: PrismaClient){
        return new StockReposistoryPrisma(prismaClient);
    }

    public async save(stock: Stock) : Promise<void>{

        const data = {
            cabinetID: stock.cabinetId,
            code: stock.code,
            status: stock.status,
            currentThickness: null, 
            currentWidth: null, 
            utilization: 0, 
            production: 0, 
        };

        await this.prismaClient.stock.create({
            data,
        });
    };

    public async list(): Promise<Stock[]> {

        const stocksFromDb = await this.prismaClient.stockFieira.findMany();

        const stockList = stocksFromDb.map((s) => {
        return Stock.restore({
            id: s.id,
            cabinetId: s.cabinetId,
            code: s.code,
            status: s.status as StatusFieira, 
            currentThickness: s.currentThickness ?? undefined, 
            currentWidth: s.currentWidth ?? undefined,
            utilization: s.utilization ?? 0,
            production: s.production ?? 0,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt
        });
    });

    return stockList;

    }

    public async findById(id: number): Promise<Stock | null> {
        
    }

    public async findByCode(code: string, cabinetId: number): Promise<Stock | null> {
        
    }

    public async findIdCabinetByName(cabinet: string): Promise<number | null> {
        
    }

    public async update(stock: Stock): Promise<void> {
        
    }


}