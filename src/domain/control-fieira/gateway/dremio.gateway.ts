import type { ImportOrder } from "../dto/dremio-order.js";

export interface ControlFieiraImportGateway {
    listOrders(): Promise<ImportOrder[]>;
}
