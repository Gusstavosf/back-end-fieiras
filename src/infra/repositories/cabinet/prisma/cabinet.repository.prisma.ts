import {
    PrismaClient,
    StatusFieira,
    type Cabinet as CabinetPrisma,
} from "../../../../generated/prisma/client.js";
import type {
    CabinetGateway,
    EligibleCabinet,
} from "../../../../domain/cabinet/gateway/cabinet.gateway.js";
import { Cabinet } from "../../../../domain/cabinet/entity/cabinet.js";

export class CabinetRepositoryPrisma implements CabinetGateway {
    private constructor(private readonly prismaClient: PrismaClient) {}

    public static build(prismaClient: PrismaClient) {
        return new CabinetRepositoryPrisma(prismaClient);
    }

    private toEntity(cabinet: CabinetPrisma): Cabinet {
        return Cabinet.restore({
            id: cabinet.id,
            name: cabinet.name,
            createdAt: cabinet.createdAt,
            updatedAt: cabinet.updatedAt,
        });
    }

    private toPersistence(cabinet: Cabinet) {
        return {
            id: cabinet.id,
            name: cabinet.name,
            createdAt: cabinet.createdAt,
            updatedAt: cabinet.updatedAt,
        };
    }

    public async save(cabinet: Cabinet): Promise<void> {
        await this.prismaClient.cabinet.create({
            data: this.toPersistence(cabinet),
        });
    }

    public async list(): Promise<Cabinet[]> {
        const cabinetsFromDb = await this.prismaClient.cabinet.findMany();

        const cabinetsList = cabinetsFromDb.map((cabinet) => this.toEntity(cabinet));

        return cabinetsList;
    }

    public async findByName(name: string): Promise<Cabinet | null> {
        const cabinet = await this.prismaClient.cabinet.findFirst({
            where: {
                name: name,
            },
        });

        if (!cabinet) {
            return null;
        }

        return this.toEntity(cabinet);
    }

    public async findById(id: number): Promise<Cabinet | null> {
        const cabinet = await this.prismaClient.cabinet.findUnique({
            where: {
                id,
            },
        });

        if (!cabinet) {
            return null;
        }

        return this.toEntity(cabinet);
    }

    public async update(cabinet: Cabinet): Promise<void> {
        await this.prismaClient.cabinet.update({
            where: { id: cabinet.id },
            data: this.toPersistence(cabinet),
        });
    }

    public async delete(name: string): Promise<Cabinet | null> {
        const cabinet = await this.prismaClient.cabinet.delete({
            where: {
                name: name,
            },
        });

        if (!cabinet) {
            return null;
        }

        return this.toEntity(cabinet);
    }

    public async listEligibleForFieira(): Promise<EligibleCabinet[]> {
        const cabinetsFromDb = await this.prismaClient.cabinet.findMany({
            include: {
                Fieira: { include: { StockFieira: true } },
            },
        });

        const cabinetsList = cabinetsFromDb.flatMap((cabinet) =>
            cabinet.Fieira.map((fieira) => ({
                cabinetName: cabinet.name,
                width: Number(fieira.width),
                thickness: Number(fieira.thickness),
                tension: fieira.tension,
                qtdFieiraStock: fieira.StockFieira.length,
                allFieirasDead: fieira.StockFieira.every(
                    (stockFieira) => stockFieira.status === StatusFieira.dead,
                ),
                lastModification: fieira.StockFieira.reduce(
                    (latest, stockFieira) =>
                        stockFieira.updatedAt > latest ? stockFieira.updatedAt : latest,
                    fieira.StockFieira[0]?.updatedAt ?? new Date(),
                ),
            })),
        );

        return cabinetsList;
    }
}
