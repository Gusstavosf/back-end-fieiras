import type { RequestHandler, Request, Response } from "express";
import type {
    SyncControlFieiraInputDto,
    SyncControlFieiraUseCase,
} from "../../../../../../usecases/control-fieira/sync-control-fieira/sync-control-fieira.usecase.js";
import { HttpMethod, type Route } from "../../route.js";

export class SyncControlFieiraRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly syncControlFieiraService: SyncControlFieiraUseCase,
    ) {}

    public static create(syncControlFieiraService: SyncControlFieiraUseCase) {
        return new SyncControlFieiraRoute(
            "/control-feira/sync",
            HttpMethod.POST,
            syncControlFieiraService,
        );
    }

    public getHandler(): RequestHandler {
        return async (request: Request, response: Response) => {
            const input: SyncControlFieiraInputDto = {
                orders: request.body.orders,
            };

            await this.syncControlFieiraService.execute(input);

            response.status(204).send();
        };
    }

    public getPath(): string {
        return this.method;
    }

    public getMethod(): HttpMethod {
        return this.method;
    }
}
