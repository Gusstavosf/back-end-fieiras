import type { RequestHandler, Request, Response } from "express";
import type {
    AttachFieiraToCabinetInputDto,
    AttachFieiraToCabinetOutputDto,
    AttachFieiraToCabinetUseCase,
} from "../../../../../../usecases/fieira/attach-fieira-to-cabinet/attach-fieira-to-cabinet.usecase.js";
import { HttpMethod, type Route } from "../../route.js";

export type AttachFieiraToCabinetResponseDto = {
    cabinetName: string;
    fieiraWidth: number;
    fieiraThickness: number;
    tension: number;
};

export class AttachFieiraToCabinetRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly attachFieiraToCabinetService: AttachFieiraToCabinetUseCase,
    ) {}

    public static create(attachFIeiraToCabinetService: AttachFieiraToCabinetUseCase) {
        return new AttachFieiraToCabinetRoute(
            "/fieira/attach-to-cabinet",
            HttpMethod.PATCH,
            attachFIeiraToCabinetService,
        );
    }

    public getHandler(): RequestHandler {
        return async (request: Request, response: Response) => {
            const input: AttachFieiraToCabinetInputDto = {
                fieiraId: request.body.fieiraId,
                cabinetId: request.body.cabinetId,
            };

            const output = await this.attachFieiraToCabinetService.execute(input);

            const responseBody = this.present(output);

            response.status(200).json(responseBody).send();
        };
    }

    public getPath(): string {
        return this.path;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }

    private present(
        output: AttachFieiraToCabinetOutputDto,
    ): AttachFieiraToCabinetResponseDto {
        return {
            cabinetName: output.cabinetName,
            fieiraWidth: output.fieiraWidth,
            fieiraThickness: output.fieiraThickness,
            tension: output.tension,
        };
    }
}
