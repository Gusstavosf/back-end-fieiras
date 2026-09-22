import type { ControlFieiraGateway } from "../../../domain/control-fieira/gateway/control-fieira.gateway.js";
import type { Usecase } from "../../usecase.js";
import type { CreateControlFieiraUseCase } from "../create-control-fieira/create-control-fieira.usecase.js";
import type { UpdateControlFieiraUseCase } from "../update-control-fieira/update-control-fieira.usecase.js";

export type ControlFieiraSyncInputDto = {
    order: number;
    material: number;
    description: string;
    orderQuantity: number;
    orderStartDate: string;
    orderEndDate: string;
    orderCreateDate: string;
    status: string;
};

export type SyncControlFieiraOutputDto = {
    created: number;
    updated: number;
};

export type SyncControlFieiraInputDto = {
    orders: ControlFieiraSyncInputDto[];
};

export class SyncControlFieiraUseCase implements Usecase<
    SyncControlFieiraInputDto,
    SyncControlFieiraOutputDto
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

    public async execute(
        input: SyncControlFieiraInputDto,
    ): Promise<SyncControlFieiraOutputDto> {
        const orders = input.orders.map((item) => item.order);

        const existingControlFieira =
            await this.controlFieiraGateway.findByOrders(orders);

        const existingByOrder = new Map(
            existingControlFieira.map((controlFieira) => [
                controlFieira.order,
                controlFieira,
            ]),
        );

        let created = 0;
        let updated = 0;

        for (const order of input.orders) {
            const existing = existingByOrder.get(order.order);

            if (existing) {
                await this.updateControlFieiraUseCase.execute(order);

                updated++;
                continue;
            }

            await this.createControlFieiraUseCase.execute(order);
            created++;
        }
        return {
            created,
            updated,
        };
    }
}
