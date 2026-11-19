import { RequisitionItem } from "../../../domain/requisition/entity/requisition-item.js";
import type { RequisitionItemGateway } from "../../../domain/requisition/gateway/requisition-item.gateway.js";
import type { Prisma } from "../../../generated/prisma/client.js";

export class RequisitionItemRepositoryPrisma implements RequisitionItemGateway {
    private constructor(private readonly prismaClient: Prisma.TransactionClient) {}

    public static build(prismaClient: Prisma.TransactionClient) {
        return new RequisitionItemRepositoryPrisma(prismaClient);
    }

    public async save(item: RequisitionItem): Promise<RequisitionItem> {
        const data = {
            requisitionId: item.requisitionId,
            stockFieiraId: item.stockFieiraId,
            supplierFieiraStockId: item.supplierFieiraStockId,
            type: item.type,
            createdAt: item.createdAt,
        };
        const { id } = await this.prismaClient.requisitionItem.create({
            data,
            select: { id: true },
        });

        return RequisitionItem.restore(data, id);
    }
}
