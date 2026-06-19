import BaseError from "./baseError.js";

class NotFound extends BaseError {
    constructor(message: string = "Não encontrado") {
        super(message, 404);
    }
}

export default NotFound;
