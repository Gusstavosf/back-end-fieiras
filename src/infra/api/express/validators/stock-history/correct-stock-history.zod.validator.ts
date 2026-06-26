import { z } from "zod";
import type { Validator } from "../../../../../core/shared/validator.interface.js";
import { StatusFieira } from "../../../../../domain/stock/entity/stock.js";

const statusTranslate: Record<string, StatusFieira> = {
    Nova: StatusFieira.New,
    Requisição: StatusFieira.Requested,
    Morta: StatusFieira.Dead,
    Polida: StatusFieira.Polished,
};

const stockHistorySchemaCorrect = z.object({
    status: z
        .string()
        .refine((val) => Object.keys(statusTranslate).includes(val), {
            message: `O status enviado é inválido. Escolha entre: ${Object.keys(statusTranslate).join(", ")}`,
        })
        .transform((val) => statusTranslate[val])
        .optional(),

    thickness: z
        .number({ message: "Espessura atual deve ser um número" })
        .positive({ message: "Espessura atual deve ser um valor positivo" })
        .nullable()
        .optional(),

    width: z
        .number({ message: "Largura atual deve ser um número" })
        .positive({ message: "Largura atual deve ser um valor positivo" })
        .nullable()
        .optional(),

    production: z
        .number({ message: "Produção deve ser um número" })
        .int({ message: "Produção deve ser um valor inteiro" })
        .nonnegative({ message: "Produção não pode ser um valor negativo" })
        .optional(),
});

export type CorrectStockHistoryInputValidated = z.infer<typeof stockHistorySchemaCorrect>;

export class CorrectStockHistoryZodValidator implements Validator<CorrectStockHistoryInputValidated> {
    public static build(): CorrectStockHistoryZodValidator {
        return new CorrectStockHistoryZodValidator();
    }

    public validate(data: unknown): CorrectStockHistoryInputValidated {
        return stockHistorySchemaCorrect.parse(data);
    }
}
