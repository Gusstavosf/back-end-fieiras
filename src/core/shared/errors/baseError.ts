class BaseError extends Error {
    statusCode: number;
    detalhes?: { campo: string; mensagem: string }[] | undefined;

    constructor(
        message: string = "Erro interno do Servidor",
        statusCode: number = 500,
        detalhes?: { campo: string; mensagem: string }[],
    ) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.detalhes = detalhes;
    }

    toJSON() {
        return {
            mensagem: this.message,
            status: this.statusCode,
            detalhes: this.detalhes,
        };
    }
}

export default BaseError;
