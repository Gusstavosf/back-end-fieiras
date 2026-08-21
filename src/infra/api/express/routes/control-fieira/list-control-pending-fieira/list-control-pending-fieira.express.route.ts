import type { RequestHandler } from "express";
import { HttpMethod, type Route } from "../../route.js";
import type { Request, Response } from "express";
import type { ListControlPendingFieiraUseCase } from "../../../../../../usecases/control-fieira/list-control-pending-fieira/list-control-pending-fieira.usecase.js";

export class ListControlPendingFieiraRoute implements Route {
    private constructor(
        private readonly path: string,
        private readonly method: HttpMethod,
        private readonly listControlPendingFieiraService: ListControlPendingFieiraUseCase,
    ) {}

    public static create(
        listControlPendingFieiraService: ListControlPendingFieiraUseCase,
    ) {
        return new ListControlPendingFieiraRoute(
            "/control-fieira/pending-fieira",
            HttpMethod.GET,
            listControlPendingFieiraService,
        );
    }

    public getHandler(): RequestHandler {
        return async (request: Request, response: Response) => {
            const output = await this.listControlPendingFieiraService.execute();

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

    private present() {}
}
