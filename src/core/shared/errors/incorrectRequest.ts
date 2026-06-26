import BaseError from "./baseError.js";

class IncorrectRequest extends BaseError {
    constructor(
        mensagem: string = "Requisição incorreta",
        detalhes?: { campo: string; mensagem: string }[],
    ) {
        super(mensagem, 400, detalhes);
        this.name = "Requisicao Incorreta";

        Object.setPrototypeOf(this, IncorrectRequest.prototype);
    }
}

export default IncorrectRequest;
