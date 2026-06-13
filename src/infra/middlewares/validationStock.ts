import type { Request, Response, NextFunction } from "express";
import type { Validator } from "../../core/shared/validator.interface.js";
import IncorrectRequest from "../../core/shared/errors/incorrectRequest.js";

export function validationStock(validator: Validator<any>) {
    return (request: Request, response: Response, next: NextFunction) => {
        try {
            request.body = validator.validate(request.body);
            return next();
        } catch (erro: any) {
            if (erro.issues && Array.isArray(erro.issues)) {
                const details = erro.issues.map((erros: any) => ({
                    campo: erros.path.join("."),
                    mensagem: erros.message,
                }));
                return next(new IncorrectRequest("Erro de validação de dados", details));
            }

            return next(
                new IncorrectRequest(erro.message || "Dados de requisição inválidos"),
            );
        }
    };
}
