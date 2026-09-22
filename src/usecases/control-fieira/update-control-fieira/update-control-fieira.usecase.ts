import {
    ControlFieira,
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
import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";
import type { DateParser } from "../../../domain/control-fieira/parser/date.parser.js";

export type UpdateControlFieiraInputDto = {
    order: number;
    material: number;
    description: string;
    orderQuantity: number;
    orderStartDate: string;
    orderEndDate: string;
    orderCreateDate: string;
    status: string;
};

export type UpdateControlFieiraOutputDto = {
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

export class UpdateControlFieiraUseCase implements Usecase<
    UpdateControlFieiraInputDto,
    UpdateControlFieiraOutputDto
> {
    private constructor(
        private readonly controlFieiraGateway: ControlFieiraGateway,
        private readonly fieiraGateway: FieiraGateway,
        private readonly descriptionParser: DescriptionParser,
        private readonly statusParser: StatusParser,
        private readonly dateParser: DateParser,
    ) {}

    public static create(
        controlFieiraGateway: ControlFieiraGateway,
        fieiraGateway: FieiraGateway,
        descriptionParser: DescriptionParser,
        statusParser: StatusParser,
        dateParser: DateParser,
    ) {
        return new UpdateControlFieiraUseCase(
            controlFieiraGateway,
            fieiraGateway,
            descriptionParser,
            statusParser,
            dateParser,
        );
    }

    public async execute(
        input: UpdateControlFieiraInputDto,
    ): Promise<UpdateControlFieiraOutputDto> {
        const parsedDescription = this.descriptionParser.parse(input.description);

        const existingControlFieira = await this.controlFieiraGateway.findByOrder(
            input.order,
        );

        if (!existingControlFieira) {
            throw new IncorrectRequest(`A ordem ${input.order} não está cadastrada.`);
        }

        if (!parsedDescription) {
            throw new Error("Descrição não suportada.");
        }
        const parsedOrderStartDate = this.dateParser.parse(input.orderStartDate);
        const parsedOrderEndDate = this.dateParser.parse(input.orderEndDate);
        const parsedOrderCreateDate = this.dateParser.parse(input.orderCreateDate);
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

        const update = existingControlFieira.update({
            fieiraId,
            orderQuantity: input.orderQuantity,
            wireType: parsedDescription.wireType,
            metal: parsedDescription.metal,
            tension: parsedDescription.tension,
            width: parsedDescription.width,
            thickness: parsedDescription.thickness,
            orderStartDate: parsedOrderStartDate,
            orderEndDate: parsedOrderEndDate,
            orderCreateDate: parsedOrderCreateDate,
            status: parsedStatus,
            qtdFieiraNec,
        });

        if (update) {
            await this.controlFieiraGateway.update(existingControlFieira);
        }

        return this.presentOutput(existingControlFieira);
    }

    private presentOutput(controlFieira: ControlFieira): UpdateControlFieiraOutputDto {
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
