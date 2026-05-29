import type { Request, Response, NextFunction } from "express";
import { estoqueSchema } from "../../schemas/estoque.schemas.js";
import IncorrectRequest from "../../core/shared/errors/incorrectRequest.js";
import { ZodError } from "zod";

export function validationEstoque(req: Request, res: Response, next: NextFunction) {
    try{
        req.body = estoqueSchema.parse(req.body)
        next()
    } catch(erro) {
        if (erro instanceof ZodError) {
            const detalhes = erro.issues.map(e => ({
                campo: e.path.join("."),
                mensagem: e.message
      }));
      return next(new IncorrectRequest("Erro de validação de dados", detalhes));
    }
    next(erro);
    }
}