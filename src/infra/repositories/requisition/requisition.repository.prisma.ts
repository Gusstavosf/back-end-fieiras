import NotFound from "../../../core/shared/errors/notFound.js";
import type { Tension } from "../../../domain/control-fieira/entity/control-fieira.js";
import {
    Requisition,
    RequisitionType,
} from "../../../domain/requisition/entity/requisition.js";
import type {
    RequisitionGateway,
    RequisitionProcessed,
} from "../../../domain/requisition/gateway/requisition.gateway.js";
import { StatusFieira } from "../../../domain/stock/entity/stock.js";
import type {
    Prisma,
    PrismaClient,
    Requisition as PrismaRequisition,
} from "../../../generated/prisma/client.js";

const pendingRequisitionFilter: Prisma.RequisitionWhereInput = {
    OR: [
        { RequisitionItems: { none: {} } },
        {
            RequisitionItems: {
                some: {
                    OR: [
                        { stockFieiraId: null },
                        { StockFieira: { is: { status: StatusFieira.Requested } } },
                    ],
                },
            },
        },
    ],
};

export class RequisitionRepositoryPrisma implements RequisitionGateway {
    private constructor(
        private readonly prismaClient: PrismaClient | Prisma.TransactionClient,
    ) {}

    public static build(prismaClient: PrismaClient | Prisma.TransactionClient) {
        return new RequisitionRepositoryPrisma(prismaClient);
    }

    private toEntity(requisition: PrismaRequisition): Requisition {
        return Requisition.restore(
            {
                fieiraId: requisition.fieiraId,
                type: RequisitionType[requisition.type],
                currentStockQty: requisition.currentStockQty,
                currentStockCapacity: requisition.currentStockCapacity,
                necessaryQty: requisition.necessaryQty,
                requestedQty: requisition.requestedQty,
                createdAt: requisition.createdAt,
                updatedAt: requisition.updatedAt,
            },
            requisition.id,
        );
    }

    private toPersistence(requisition: Requisition) {
        return {
            fieiraId: requisition.fieiraId,
            type: requisition.type,
            currentStockQty: requisition.currentStockQty,
            currentStockCapacity: requisition.currentStockCapacity,
            necessaryQty: requisition.necessaryQty,
            requestedQty: requisition.requestedQty,
        };
    }

    public async save(requisition: Requisition): Promise<Requisition> {
        const saved = await this.prismaClient.requisition.create({
            data: {
                ...this.toPersistence(requisition),
                createdAt: requisition.createdAt,
                updatedAt: requisition.updatedAt,
            },
        });

        return this.toEntity(saved);
    }

    public async update(requisition: Requisition): Promise<Requisition> {
        const id = requisition.id;
        if (id == null) {
            throw new NotFound("Requisição sem identificação.");
        }

        const updated = await this.prismaClient.requisition.update({
            where: { id },
            data: this.toPersistence(requisition),
        });

        return this.toEntity(updated);
    }

    public async delete(id: number): Promise<void> {
        const deleteRequisition = async (
            client: Prisma.TransactionClient,
        ): Promise<void> => {
            const where = { requisitionId: id };
            await client.requisitionItem.deleteMany({ where });
            await client.requisitionControl.deleteMany({ where });
            await client.requisition.delete({ where: { id } });
        };

        if ("$transaction" in this.prismaClient) {
            await this.prismaClient.$transaction(deleteRequisition);
            return;
        }

        await deleteRequisition(this.prismaClient);
    }

    public async findById(id: number): Promise<Requisition | null> {
        const requisition = await this.prismaClient.requisition.findUnique({
            where: { id },
        });

        return requisition ? this.toEntity(requisition) : null;
    }

    public async findByOrder(order: number): Promise<Requisition | null> {
        const requisition = await this.prismaClient.requisition.findFirst({
            where: { requisitionControls: { some: { ControlFieira: { order } } } },
            orderBy: { id: "desc" },
        });

        return requisition ? this.toEntity(requisition) : null;
    }

    public async listRequisitionToBeProcessed(): Promise<Requisition[]> {
        const requisitions = await this.prismaClient.requisition.findMany({
            where: pendingRequisitionFilter,
            orderBy: { id: "desc" },
        });

        return requisitions.map((requisition) => this.toEntity(requisition));
    }

    public async listRequisitionProcessed(): Promise<RequisitionProcessed[]> {
        const requisitions = await this.prismaClient.requisition.findMany({
            where: { NOT: pendingRequisitionFilter },
            orderBy: { id: "desc" },
            select: {
                id: true,
                type: true,
                createdAt: true,
                updatedAt: true,
                Fieira: {
                    select: {
                        width: true,
                        thickness: true,
                        tension: true,
                        Cabinet: { select: { name: true } },
                    },
                },
                RequisitionItems: {
                    orderBy: { id: "asc" },
                    select: { StockFieira: { select: { code: true } } },
                },
                requisitionControls: {
                    orderBy: { ControlFieira: { order: "asc" } },
                    select: {
                        ControlFieira: {
                            select: { order: true, wireType: true, material: true },
                        },
                    },
                },
            },
        });

        return requisitions.map((requisition) => {
            const { Fieira: fieira, requisitionControls } = requisition;
            const firstOrder = requisitionControls[0]?.ControlFieira;
            const orders = requisitionControls.map(
                ({ ControlFieira }) => ControlFieira.order,
            );
            const defaultDestination =
                requisition.type === RequisitionType.free_stock ? "Estoque livre" : "";

            return {
                id: requisition.id,
                cabinet: fieira.Cabinet?.name ?? "",
                dimension: `${Number(fieira.width)}x${Number(fieira.thickness)}`,
                wireType: firstOrder?.wireType ?? "",
                tension: fieira.tension as Tension,
                codes: requisition.RequisitionItems.flatMap(({ StockFieira }) =>
                    StockFieira ? [StockFieira] : [],
                ),
                destination: orders.join(", ") || defaultDestination,
                material: firstOrder?.material ?? 0,
                status: "processed",
                createdAt: requisition.createdAt,
                updatedAt: requisition.updatedAt,
            };
        });
    }

    public async list(): Promise<Requisition[]> {
        const requisitions = await this.prismaClient.requisition.findMany({
            orderBy: { id: "desc" },
        });

        return requisitions.map((requisition) => this.toEntity(requisition));
    }
}
