import {
    ControlFieira,
    type ControlStatus,
    type Metal,
    type Tension,
} from "../../../domain/control-fieira/entity/control-fieira.js";
import type { ControlFieiraGateway } from "../../../domain/control-fieira/gateway/control-fieira.gateway.js";
import {
    FieiraCalculator,
    RequiredFieiraCalculator,
} from "../../../domain/fieira/calculators/fieira.calculator.js";
import type { Usecase } from "../../usecase.js";
import { DescriptionParser } from "../../../domain/control-fieira/parser/description.parser.js";
import { StatusParser } from "../../../domain/control-fieira/parser/status.parser.js";
import type { FieiraGateway } from "../../../domain/fieira/gateway/fieira.gateway.js";
import { Fieira } from "../../../domain/fieira/entity/fieira.js";

export type CreateControlFieiraInputDto = {
    order: number;
    material: number;
    description: string;
    orderQuantity: number;
    orderStartDate: Date;
    orderEndDate: Date;
    orderCreatedDate: Date;
    status: string;
};

export type CreateControlFieiraOutputDto = {
    id: number;
    fieiraId: number | null;
    material: number;
    order: number;
    orderQuantity: number;
    metal: Metal;
    wireType: string;
    tension: Tension;
    width: number;
    thickness: number;
    orderStartDate: Date;
    orderEndDate: Date;
    orderCreateDate: Date;
    status: string;
    qtdFieiraNec: number;
    createdAt: Date;
    updatedAt: Date;
};

export class CreateControlFieiraUseCase implements Usecase<
    CreateControlFieiraInputDto,
    CreateControlFieiraOutputDto
> {
    private constructor(
        private readonly controlFieiraGateway: ControlFieiraGateway,
        private readonly fieiraGateway: FieiraGateway,
        private readonly descriptionParser: DescriptionParser,
        private readonly statusParser: StatusParser,
    ) {}

    public static create(
        controlFieiraGateway: ControlFieiraGateway,
        fieiraGateway: FieiraGateway,
        descriptionParser: DescriptionParser,
        statusParser: StatusParser,
    ) {
        return new CreateControlFieiraUseCase(
            controlFieiraGateway,
            fieiraGateway,
            descriptionParser,
            statusParser,
        );
    }

    public async execute(
        input: CreateControlFieiraInputDto,
    ): Promise<CreateControlFieiraOutputDto> {
        const parsedDescription = this.descriptionParser.parse(input.description);

        const existingControlFieira = await this.controlFieiraGateway.findByOrder(
            input.order,
        );

        if (existingControlFieira) {
            return this.presentOutput(existingControlFieira);
        }

        if (!parsedDescription) {
            throw new Error("Descrição não suportada.");
        }

        const parsedStatus = this.statusParser.parse(input.status);

        if (!parsedStatus) {
            throw new Error(`Status não suportado: ${input.status}`);
        }

        const fieira = FieiraCalculator.calculate({
            metal: parsedDescription.metal,
            tension: parsedDescription.tension,
            width: parsedDescription.width,
            thickness: parsedDescription.thickness,
        });

        const qtdFieiraNec = RequiredFieiraCalculator.calculate({
            orderQuantity: input.orderQuantity,
            nominalCapacity: fieira.nominalCapacity,
        });

        const fieiraExisting = await this.fieiraGateway.findByDimensions(
            fieira.fieiraWidth,
            fieira.fieiraThickness,
            parsedDescription.tension,
        );

        let fieiraId: number;

        if (fieiraExisting) {
            fieiraId = fieiraExisting.id;
        } else {
            const newFieira = Fieira.create(
                null,
                fieira.fieiraWidth,
                fieira.fieiraThickness,
                parsedDescription.tension,
                fieira.nominalCapacity,
            );

            const savedFieira = await this.fieiraGateway.save(newFieira);

            fieiraId = savedFieira.id;
        }

        const controlFieira = ControlFieira.create({
            fieiraId: fieiraId,
            order: input.order,
            material: input.material,
            orderQuantity: input.orderQuantity,
            wireType: parsedDescription.wireType,
            metal: parsedDescription.metal,
            tension: parsedDescription.tension,
            width: parsedDescription.width,
            thickness: parsedDescription.thickness,
            orderStartDate: input.orderStartDate,
            orderEndDate: input.orderEndDate,
            orderCreateDate: input.orderCreatedDate,
            status: parsedStatus as ControlStatus,
            qtdFieiraNec,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const savedControlFieira = await this.controlFieiraGateway.save(controlFieira);

        return this.presentOutput(savedControlFieira);
    }

    private presentOutput(controlFieira: ControlFieira): CreateControlFieiraOutputDto {
        return {
            id: controlFieira.id!,
            fieiraId: controlFieira.fieiraId,
            order: controlFieira.order,
            material: controlFieira.material,
            orderQuantity: controlFieira.orderQuantity,
            wireType: controlFieira.wireType,
            metal: controlFieira.metal,
            tension: controlFieira.tension,
            width: controlFieira.width,
            thickness: controlFieira.thickness,
            orderStartDate: controlFieira.orderStartDate,
            orderEndDate: controlFieira.orderEndDate,
            orderCreateDate: controlFieira.orderCreateDate,
            status: controlFieira.status,
            qtdFieiraNec: controlFieira.qtdFieiraNec,
            createdAt: controlFieira.createdAt,
            updatedAt: controlFieira.updatedAt,
        };
    }
}
