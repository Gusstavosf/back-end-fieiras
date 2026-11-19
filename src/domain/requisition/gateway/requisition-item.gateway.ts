import type { RequisitionItem } from "../entity/requisition-item.js";

export interface RequisitionItemGateway {
    save(item: RequisitionItem): Promise<RequisitionItem>;
}
