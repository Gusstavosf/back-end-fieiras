import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '../../generated/prisma/client.js';
import BaseError from '../../core/shared/errors/baseError.js';
import IncorrectRequest from '../../core/shared/errors/incorrectRequest.js';

function ErrorHandler (erro: unknown, request: Request, response: Response, next: NextFunction){

  if (erro instanceof Prisma.PrismaClientValidationError) {
    return response.status(400).json(new IncorrectRequest("Erro de validação nos dados"));
  }

  if (erro instanceof Prisma.PrismaClientKnownRequestError) {

    switch (erro.code) {

      case 'P2002':
        return response.status(409).json({
          message: 'Registro já existe'
        });

      case 'P2003':
        return response.status(400).json({
          message: 'Relacionamento inválido'
        });

      case 'P2025':
        return response.status(404).json({
          message: 'Registro não encontrado'
        });

      default:
        return response.status(400).json({
          message: 'Erro no banco de dados'
        });
    }
  } 
  
  if (erro instanceof BaseError) {
      response.status(erro.statusCode).json({
          message: erro.message,
          detalhes: erro.detalhes
      });

      return;
      }
      
      console.error("💥 Erro não tratado:", erro);
      response.status(500).json({
        message: "Ocorreu um erro interno no servidor."
    });

    return response.status(500).json(new BaseError())

}

export default ErrorHandler;