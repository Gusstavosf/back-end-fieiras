import {
    PrismaClient,
    type Fieira as PrismaFieira,
} from "../../../../generated/prisma/client.js";
import type { FieiraGateway } from "../../../../domain/fieira/gateway/fieira.gateway.js";
import { Fieira } from "../../../../domain/fieira/entity/fieira.js";

export class FieiraRepositoryPrisma implements FieiraGateway {
    private constructor(private readonly prismaClient: PrismaClient) {}

    public static build(prismaClient: PrismaClient) {
        return new FieiraRepositoryPrisma(prismaClient);
    }

    private toEntity(fieira: PrismaFieira): Fieira {
        return Fieira.restore({
            id: fieira.id,
            cabinetId: fieira.cabinetId,
            width: Number(fieira.width),
            thickness: Number(fieira.thickness),
            nominalFieiraCapacity: fieira.nominalFieiraCapacity,
            createdAt: fieira.createdAt,
            updatedAt: fieira.updatedAt,
        });
    }

    private toPersistence(fieira: Fieira) {
        return {
            cabinetId: fieira.cabinetId,
            width: fieira.width,
            thickness: fieira.thickness,
            nominalFieiraCapacity: fieira.nominalFieiraCapacity,
            createdAt: fieira.createdAt,
            updatedAt: fieira.updatedAt,
        };
    }

    public async save(fieira: Fieira): Promise<void> {
        await this.prismaClient.fieira.create({
            data: this.toPersistence(fieira),
        });
    }

    public async list(): Promise<Fieira[]> {
        const fieiraFromDb = await this.prismaClient.fieira.findMany();

        const fieiraList = fieiraFromDb.map((fieira) => this.toEntity(fieira));

        return fieiraList;
    }

    public async findByName(cabinetName: string): Promise<Fieira | null> {
        const fieira = await this.prismaClient.fieira.findFirst({
            where: {
                Cabinet: {
                    name: cabinetName,
                },
            },
        });

        if (!fieira) {
            return null;
        }

        return this.toEntity(fieira);
    }

    public async findByDimensions(
        width: number,
        thickness: number,
    ): Promise<Fieira | null> {
        const fieira = await this.prismaClient.fieira.findUnique({
            where: {
                width_thickness: {
                    width,
                    thickness,
                },
            },
        });
        if (!fieira) {
            return null;
        }

        return this.toEntity(fieira);
    }

    public async update(fieira: Fieira): Promise<void> {
        await this.prismaClient.fieira.update({
            where: { id: fieira.id },
            data: this.toPersistence(fieira),
        });
    }

    public async deleteByCabinetName(cabinetName: string): Promise<void> {
        const fieira = await this.prismaClient.fieira.findFirst({
            where: {
                Cabinet: {
                    name: cabinetName,
                },
            },
        });

        const cabinetId = fieira?.cabinetId;

        if (cabinetId === null || cabinetId === undefined) {
            return;
        }

        await this.prismaClient.fieira.delete({
            where: { cabinetId },
        });
    }
}
