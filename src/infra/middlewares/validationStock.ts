import type { Request, Response, NextFunction } from "express";
import type { Validator } from "../../core/shared/validator.interface.js";
import IncorrectRequest from "../../core/shared/errors/incorrectRequest.js";
import { ZodError } from "zod";

export function validationStock<T>(validator: Validator<T>) {
    return (request: Request, response: Response, next: NextFunction) => {
        try {
            request.body = validator.validate(request.body);
            return next();
        } catch (erro: unknown) {
            if (erro instanceof ZodError) {
                const details = erro.issues.map((issues) => ({
                    campo: issues.path.join("."),
                    mensagem: issues.message,
                }));

                return next(new IncorrectRequest("Erro de validação de dados", details));
            }

            if (erro instanceof Error) {
                return next(new IncorrectRequest(erro.message));
            }
            return next(new IncorrectRequest("Dados de requisição inválidos"));
        }
    };
}
