import BaseError from "./baseError.js";

class IncorrectRequest extends BaseError {
    constructor(
        mensagem: string = "Requisição incorreta",
        detalhes?: { campo: string; mensagem: string }[],
    ) {
        super(mensagem, 400, detalhes);
        this.name = "RequisicaoIncorreta";
    }
}

export default IncorrectRequest;
