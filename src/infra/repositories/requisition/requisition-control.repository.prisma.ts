import type { RequisitionControlGateway } from "../../../domain/requisition/gateway/requisition-control.gateway.js";
import type { Prisma } from "../../../generated/prisma/client.js";

export class RequisitionControlRepositoryPrisma implements RequisitionControlGateway {
    private constructor(private readonly prismaClient: Prisma.TransactionClient) {}

    public static build(prismaClient: Prisma.TransactionClient) {
        return new RequisitionControlRepositoryPrisma(prismaClient);
    }

    public async save(link: {
        requisitionId: number;
        controlFieiraId: number;
    }): Promise<void> {
        await this.prismaClient.requisitionControl.create({ data: link });
    }
}
