import { Estoque } from "../../../domain/stock/entity/stock.js";
import { StatusFieira } from "../../../domain/stock/entity/stock.js";
import RequisicaoIncorreta from "../../../core/shared/errors/incorrectRequest.js";
import type { EstoqueService } from "../estoque.service.js";
import type { EstoqueReposistory } from "../../../domain/stock/gateway/stock.gateway.js";

export class EstoqueServiceImplementation implements EstoqueService {

    private constructor(readonly repository: EstoqueReposistory){}

    public static build(repository: EstoqueReposistory){
        return new EstoqueServiceImplementation(repository)
    }
 
    public async cadastrarEstoque(armarioName: string, codigo: string, status: StatusFieira): Promise<Estoque> {

        const armario = await this.repository.findArmarioByName(armarioName);

        if (!armario) {
            throw new RequisicaoIncorreta(`Armário ${armarioName} não encontrado.`);
        }

        const estoques = await this.repository.list();

        const existente = estoques.find(e => 
            e.armarioName === armarioName && e.codigo === codigo
        );

        if (existente) {
            throw new RequisicaoIncorreta(`Já existe uma fieira com o código ${codigo} nesse armário.`);
        }

        const novoEstoque = Estoque.createFromPersistence({
            id_armario: armario.id,
            armarioName,
            codigo,
            status,
            created_at: new Date(),
            updated_at: new Date(),
        });

        await this.repository.save(novoEstoque)

        return novoEstoque
    }

    public async listarEstoques(): Promise<Estoque[]> {

        const estoque = await this.repository.list();
        
        return estoque;
    }

    public async listarPorId(id: number): Promise<Estoque> {

        const estoque = await this.repository.find(id);

        if (!estoque) {
            throw new Error("Estoque não encontrado");
        }

        return estoque;

    }

}
