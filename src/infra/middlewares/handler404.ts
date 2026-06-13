import type { Response, Request, NextFunction } from "express";
import NotFound from "../../core/shared/errors/notFound.js";

function Handler404(request: Request, response: Response, next: NextFunction) {
    const erro404 = new NotFound();
    next(erro404);
}

export default Handler404;
