import type { ControlFieiraGateway } from "../../../domain/control-fieira/gateway/control-fieira.gateway.js";
import type { Usecase } from "../../usecase.js";
import type { CreateControlFieiraUseCase } from "../create-control-fieira/create-control-fieira.usecase.js";
import type { UpdateControlFieiraUseCase } from "../update-control-fieira/update-control-fieira.usecase.js";

export type ControlFieiraSyncInputDto = {
    order: number;
    material: number;
    description: string;
    orderQuantity: number;
    orderStartDate: Date;
    orderEndDate: Date;
    orderCreateDate: Date;
    status: string;
};

export type SyncControlFieiraInputDto = {
    orders: ControlFieiraSyncInputDto[];
};

export class SyncControlFieiraUseCase implements Usecase<
    SyncControlFieiraInputDto,
    void
> {
    private constructor(
        private readonly controlFieiraGateway: ControlFieiraGateway,
        private readonly createControlFieiraUseCase: CreateControlFieiraUseCase,
        private readonly updateControlFieiraUseCase: UpdateControlFieiraUseCase,
    ) {}

    public static create(
        controlFieiraGateway: ControlFieiraGateway,
        createControlFieiraUseCase: CreateControlFieiraUseCase,
        updateControlFieiraUseCase: UpdateControlFieiraUseCase,
    ) {
        return new SyncControlFieiraUseCase(
            controlFieiraGateway,
            createControlFieiraUseCase,
            updateControlFieiraUseCase,
        );
    }

    public async execute(input: SyncControlFieiraInputDto): Promise<void> {
        const orders = input.orders.map((item) => item.order);

        const existingControlFieira =
            await this.controlFieiraGateway.findByOrders(orders);

        const existingByOrder = new Map(
            existingControlFieira.map((controlFieira) => [
                controlFieira.order,
                controlFieira,
            ]),
        );

        for (const order of input.orders) {
            const existing = existingByOrder.get(order.order);

            if (existing) {
                await this.updateControlFieiraUseCase.execute(order);
                continue;
            }

            await this.createControlFieiraUseCase.execute(order);
        }
    }
}
