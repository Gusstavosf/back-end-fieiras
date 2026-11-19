export interface RequisitionControlGateway {
    save(link: { requisitionId: number; controlFieiraId: number }): Promise<void>;
}
