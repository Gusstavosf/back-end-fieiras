import IncorrectRequest from "../../../core/shared/errors/incorrectRequest.js";
import NotFound from "../../../core/shared/errors/notFound.js";
import type { Cabinet } from "../../../domain/cabinet/entity/cabinet.js";
import type { CabinetGateway } from "../../../domain/cabinet/gateway/cabinet.gateway.js";
import type { Fieira } from "../../../domain/fieira/entity/fieira.js";
import type { FieiraGateway } from "../../../domain/fieira/gateway/fieira.gateway.js";
import type { Usecase } from "../../usecase.js";

export type AttachFieiraToCabinetInputDto = {
    fieiraId: number;
    cabinetId: number;
};

export type AttachFieiraToCabinetOutputDto = {
    cabinetName: string;
    fieiraWidth: number;
    fieiraThickness: number;
    tension: number;
};

export class AttachFieiraToCabinetUseCase implements Usecase<
    AttachFieiraToCabinetInputDto,
    AttachFieiraToCabinetOutputDto
> {
    private constructor(
        private readonly fieiraGateway: FieiraGateway,
        private readonly cabinetGateway: CabinetGateway,
    ) {}

    public static create(fieiraGateway: FieiraGateway, cabinetGateway: CabinetGateway) {
        return new AttachFieiraToCabinetUseCase(fieiraGateway, cabinetGateway);
    }

    public async execute(
        input: AttachFieiraToCabinetInputDto,
    ): Promise<AttachFieiraToCabinetOutputDto> {
        const fieira = await this.fieiraGateway.findById(input.fieiraId);

        if (!fieira) {
            throw new NotFound(`Fieira ${input.fieiraId} não encontrada`);
        }

        const cabinet = await this.cabinetGateway.findById(input.cabinetId);

        if (!cabinet) {
            throw new NotFound(`Armário ${input.cabinetId} não encontrado`);
        }

        if (fieira.cabinetId === input.cabinetId) {
            throw new IncorrectRequest(
                `A fieira ${input.fieiraId} já está vinculada a esse armário.`,
            );
        }

        const currentFieira = await this.fieiraGateway.findByCabinetId(input.cabinetId);

        if (currentFieira) {
            currentFieira.removeCabinet();
            await this.fieiraGateway.update(currentFieira);
        }

        fieira.attachCabinet(input.cabinetId);

        await this.fieiraGateway.update(fieira);

        const output = this.presentOutput(fieira, cabinet);

        return output;
    }

    private presentOutput(
        fieira: Fieira,
        cabinet: Cabinet,
    ): AttachFieiraToCabinetOutputDto {
        return {
            cabinetName: cabinet.name,
            fieiraWidth: fieira.width,
            fieiraThickness: fieira.thickness,
            tension: fieira.tension,
        };
    }
}
