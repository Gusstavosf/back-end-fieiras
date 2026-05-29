import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '../../../generated/prisma/client.js';
import BaseError from '../../core/shared/errors/baseError.js';
import IncorrectRequest from '../../core/shared/errors/incorrectRequest.js';

function ErrorHandler (erro: unknown, req: Request, res: Response, next: NextFunction){

  if (erro instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json(new IncorrectRequest("Erro de validação nos dados"));
  }

  if (erro instanceof Prisma.PrismaClientKnownRequestError) {

    switch (erro.code) {

      case 'P2002':
        return res.status(409).json({
          message: 'Registro já existe'
        });

      case 'P2003':
        return res.status(400).json({
          message: 'Relacionamento inválido'
        });

      case 'P2025':
        return res.status(404).json({
          message: 'Registro não encontrado'
        });

      default:
        return res.status(400).json({
          message: 'Erro no banco de dados'
        });
    }
  } 
  if (erro instanceof BaseError){
    return res.status(erro.statusCode).json(erro);
  }
  
  return res.status(500).json(new BaseError())
}

export default ErrorHandler;