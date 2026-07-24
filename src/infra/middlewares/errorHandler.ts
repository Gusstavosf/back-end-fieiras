import type { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client.js";
import IncorrectRequest from "../../core/shared/errors/incorrectRequest.js";
import NotFound from "../../core/shared/errors/notFound.js";

interface AppError {
    message: string;
    statusCode?: number;
    detalhes?: unknown[];
}

function isAppError(erro: unknown): erro is AppError {
    return typeof erro === "object" && erro !== null && "message" in erro;
}

function ErrorHandler(
    erro: unknown,
    request: Request,
    response: Response,
    _next: NextFunction,
) {
    if (erro instanceof Prisma.PrismaClientValidationError) {
        return response.status(400).json({ message: "Erro de validação nos dados" });
    }

    if (erro instanceof Prisma.PrismaClientKnownRequestError) {
        switch (erro.code) {
            case "P2002":
                return response.status(409).json({ message: "Registro já existe" });
            case "P2003":
                return response.status(400).json({ message: "Relacionamento inválido" });
            case "P2025":
                return response.status(404).json({ message: "Registro não encontrado" });
            default:
                return response.status(400).json({ message: "Erro no banco de dados" });
        }
    }

    if (isAppError(erro)) {
        if (erro instanceof IncorrectRequest) {
            return response.status(400).json({
                message: erro.message,
                status: 400,
            });
        }

        if (erro instanceof NotFound) {
            return response.status(404).json({
                message: erro.message,
                status: 404,
            });
        }

        if (erro.statusCode) {
            return response.status(erro.statusCode).json({
                message: erro.message,
                status: erro.statusCode,
                detalhes: erro.detalhes,
            });
        }
    }

    if (erro instanceof Error) {
        return response.status(500).json({ message: erro.message });
    }

    console.error("Erro totalmente desconhecido:", erro);
    return response.status(500).json({ message: "Ocorreu um erro interno no servidor." });
}

export default ErrorHandler;
