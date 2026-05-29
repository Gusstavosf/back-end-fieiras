import { Estoque } from "../../domain/stock/entity/stock.js";
import { StatusFieira } from "../../domain/stock/entity/stock.js";

export interface EstoqueService {
  cadastrarEstoque(armarioName: string, codigo: string, status: StatusFieira): Promise<Estoque>;
  listarEstoques(): Promise<Estoque[]>;
  listarPorId(id: number): Promise<Estoque>;
}
