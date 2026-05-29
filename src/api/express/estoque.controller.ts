import type { Request, Response, NextFunction } from "express";
import NaoEncontrado from "../../core/shared/errors/notFound.js";
import RequisicaoIncorreta from '../../core/shared/errors/incorrectRequest.js';
import { EstoqueReposistoryPrisma } from "../../infra/repositories/stock/prisma/stock.repository.prisma.js";
import prisma from "../../config/db.js";
import { EstoqueServiceImplementation } from "../../services/estoque/implementation/estoque.service.implementation.js";

export default class EstoqueController{

  private constructor(){}

  public static build(){
    return new EstoqueController()
  }

  public listarEstoque = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const repository = EstoqueReposistoryPrisma.build(prisma);

      const service = EstoqueServiceImplementation.build(repository);

      const output = await service.listarEstoques();

      res.status(200).json(output);

  } catch (erro) {
      next(erro)
    }
  };

  public listarEstoquePorId = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { id } = req.params;

        const numeroId = Number(id);

        if (
          isNaN(numeroId) || 
          !Number.isInteger(numeroId) ||
          numeroId <= 0 || 
          numeroId > 2147483647
         ){
          return next(new RequisicaoIncorreta("Id inválido"));
        }
        const repository = EstoqueReposistoryPrisma.build(prisma);

        const service = EstoqueServiceImplementation.build(repository);

        const output = await service.listarPorId(numeroId)

        if (!output) {
          return next(new NaoEncontrado("Fieira não encontrada."))
        }
        
        res.status(200).json(output);

    } catch(erro){
        next(erro);
    }
  }

  public cadastrarEstoque = async (req: Request, res: Response, next: NextFunction) => {
    try{

      const {armarioName, codigo, status} = req.body
      
      const repository = EstoqueReposistoryPrisma.build(prisma);

      const service = EstoqueServiceImplementation.build(repository)

      const output = await service.cadastrarEstoque(armarioName, codigo, status)

      const data = {
        armarioName: output.armarioName,
        codigo: output.codigo,
        status: output.status
      }

      res.status(201).json(data)

    } catch (erro){
        next(erro)
    }
  }
}
