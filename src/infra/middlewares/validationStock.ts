import type { Request, Response, NextFunction } from "express";
import { stockSchema } from "../../domain/schemas/stock.zod.validator.js";
import IncorrectRequest from "../../core/shared/errors/incorrectRequest.js";
import { ZodError } from "zod";

export function validationStock(req: Request, res: Response, next: NextFunction) {
    try{
        req.body = stockSchema.parse(req.body)
        next()
    } catch(erro) {
        if (erro instanceof ZodError) {
            const details = erro.issues.map(e => ({
                campo: e.path.join("."),
                mensagem: e.message
      }));
      return next(new IncorrectRequest("Erro de validação de dados", details));
    }
    next(erro);
    }
}