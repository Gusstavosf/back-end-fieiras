import type { ControlFieiraGateway } from "../../../domain/control-fieira/gateway/control-fieira.gateway.js";
import type { Usecase } from "../../usecase.js";

export type CreateControlFieiraInputDto = {
    order: number;
    wireType: string;
    tension: number;
    width: number;
    thickness: number;
    orderStartDate: Date;
    orderEndDate: Date;
    orderQuantity: number;
};

export type CreateControlFieiraOutputDto = {
    id: number;
    fieiraId: number;
    order: number;
    wireType: string;
    tension: number;
    width: number;
    thickness: number;
    orderStartDate: Date;
    orderEndDate: Date;
    orderQuantity: number;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateControlFieiraUseCase implements Usecase<
    CreateControlFieiraInputDto,
    CreateControlFieiraOutputDto
> {
    private constructor(private readonly controlFieiraGateway: ControlFieiraGateway) {}

    public static create(controlFieiraGateway: ControlFieiraGateway) {
        return new CreateControlFieiraUseCase(controlFieiraGateway);
    }

    public async execute(
        input: CreateControlFieiraInputDto,
    ): Promise<CreateControlFieiraOutputDto> {}
}
