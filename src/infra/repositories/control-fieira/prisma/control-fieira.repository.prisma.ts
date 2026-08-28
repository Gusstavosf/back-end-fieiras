import {
    ControlFieira,
    ControlStatus,
    Metal,
} from "../../../../domain/control-fieira/entity/control-fieira.js";
import type {
    ControlFieiraGateway,
    ControlFieiraWithCabinetName,
} from "../../../../domain/control-fieira/gateway/control-fieira.gateway.js";
import type {
    PrismaClient,
    ControlFieira as PrismaControlFieira,
} from "../../../../generated/prisma/client.js";

export class ControlFieiraRepositoryPrisma implements ControlFieiraGateway {
    private constructor(private readonly prismaClient: PrismaClient) {}

    public static build(prismaClient: PrismaClient) {
        return new ControlFieiraRepositoryPrisma(prismaClient);
    }

    private toEntity(controlFieira: PrismaControlFieira): ControlFieira {
        return ControlFieira.restore(
            {
                fieiraId: controlFieira.fieiraId,
                order: controlFieira.order,
                material: controlFieira.material,
                orderQuantity: Number(controlFieira.orderQuantity),
                wireType: controlFieira.wireType,
                metal: controlFieira.metal as Metal,
                tension: controlFieira.tension,
                width: Number(controlFieira.width),
                thickness: Number(controlFieira.thickness),
                orderStartDate: controlFieira.orderStartDate,
                orderEndDate: controlFieira.orderEndDate,
                orderCreateDate: controlFieira.orderCreateDate,
                qtdFieiraNec: controlFieira.qtdFieiraNec,
                status: controlFieira.status as ControlStatus,
                createdAt: controlFieira.createdAt,
                updatedAt: controlFieira.updatedAt,
            },
            controlFieira.id,
        );
    }

    private toPersistence(controlFieira: ControlFieira) {
        return {
            fieiraId: controlFieira.fieiraId,
            order: controlFieira.order,
            material: controlFieira.material,
            orderQuantity: controlFieira.orderQuantity,
            wireType: controlFieira.wireType,
            metal: controlFieira.metal,
            tension: controlFieira.tension,
            width: controlFieira.width,
            thickness: controlFieira.thickness,
            orderStartDate: controlFieira.orderStartDate,
            orderEndDate: controlFieira.orderEndDate,
            orderCreateDate: controlFieira.orderCreateDate,
            qtdFieiraNec: controlFieira.qtdFieiraNec,
            status: controlFieira.status,
            createdAt: controlFieira.createdAt,
            updatedAt: controlFieira.updatedAt,
        };
    }

    public async save(controlFieira: ControlFieira): Promise<ControlFieira> {
        const controlFieiraSaved = await this.prismaClient.controlFieira.create({
            data: this.toPersistence(controlFieira),
        });

        return this.toEntity(controlFieiraSaved);
    }

    public async list(): Promise<ControlFieiraWithCabinetName[]> {
        const controlFieiraFromdb = await this.prismaClient.controlFieira.findMany({
            include: {
                Fieira: {
                    include: {
                        Cabinet: true,
                    },
                },
            },
        });

        const controlFieiraList = controlFieiraFromdb.map((controlFieira) => ({
            controlFieira: this.toEntity(controlFieira),
            cabinetName: controlFieira.Fieira?.Cabinet?.name ?? null,
        }));

        return controlFieiraList;
    }

    public async findByOrder(order: number): Promise<ControlFieira | null> {
        const controlFieira = await this.prismaClient.controlFieira.findFirst({
            where: {
                order,
            },
        });

        if (!controlFieira) {
            return null;
        }

        return this.toEntity(controlFieira);
    }

    public async listPendingFieiras(): Promise<ControlFieira[]> {
        const controlFieiraPeinding = await this.prismaClient.controlFieira.findMany({
            where: {
                status: ControlStatus.ReleasedPrinted,
                fieiraId: {
                    not: null,
                },
                Fieira: {
                    cabinetId: null,
                },
            },
        });

        const controlFieiraList = controlFieiraPeinding.map((controlFieira) =>
            this.toEntity(controlFieira),
        );

        return controlFieiraList;
    }

    public async update(controlFieira: ControlFieira): Promise<void> {
        await this.prismaClient.controlFieira.update({
            where: { order: controlFieira.order },
            data: this.toPersistence(controlFieira),
        });
    }

    public async delete(order: number): Promise<void> {
        await this.prismaClient.controlFieira.delete({
            where: { order },
        });
    }
}
