import type { RequestHandler } from "express";
import type {
    CreateRequisitionToOrderInputDto,
    CreateRequisitionToOrderOutputDto,
    CreateRequisitionToOrderUseCase,
} from "../../../../../../usecases/requisition/create-requisition/create-requisition-to-order.usecase.js";
import { HttpMethod, type Route } from "../../route.js";

export type CreateRequisitionResponseDto = CreateRequisitionToOrderOutputDto;

export class CreateRequisitionRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly createRequisitionService: CreateRequisitionToOrderUseCase,
    ) {}

    public static create(createRequisitionService: CreateRequisitionToOrderUseCase) {
        return new CreateRequisitionRoute(
            "/requisition",
            HttpMethod.POST,
            createRequisitionService,
        );
    }

    public getHandler(): RequestHandler {
        return async (request, response) => {
            const { order, requestedQty, qtyRework } = request.body;
            const input: CreateRequisitionToOrderInputDto = { order, requestedQty };
            if (qtyRework !== undefined) {
                input.qtyRework = qtyRework;
            }

            const output = await this.createRequisitionService.execute(input);
            const responseBody = this.present(output);
            response.status(201).json(responseBody);
        };
    }

    public getPath(): string {
        return this.path;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    private present(
        output: CreateRequisitionToOrderOutputDto,
    ): CreateRequisitionResponseDto {
        return {
            cabinetName: output.cabinetName,
            dimension: output.dimension,
            wireType: output.wireType,
            tension: output.tension,
            order: output.order,
            material: output.material,
            necessaryTotalQty: output.necessaryTotalQty,
            currentStockQty: output.currentStockQty,
            currentStockCapacity: output.currentStockCapacity,
            necessaryRequisitionQty: output.necessaryRequisitionQty,
            createdAt: output.createdAt,
            updatedAt: output.updatedAt,
        };
    }
}
