import { z } from "zod";
import type { Validator } from "../../../../../core/shared/validator.interface.js";
import { StatusFieira } from "../../../../../domain/stock/entity/stock/stock.js";

const statusTranslate: Record<string, StatusFieira> = {
    Nova: StatusFieira.New,
    Requisição: StatusFieira.Requested,
    Morta: StatusFieira.Dead,
    Polida: StatusFieira.Polished,
};

const stockSchemaCreate = z.object({
    cabinetName: z
        .string({ message: "O campo armário é obrigatório." })
        .regex(/^(CTC\d{3}|WM\d{3})$/, {
            message:
                "O campo armário é obrigatório e deve estar entre CTC000..CTC999 ou WM000..WM999",
        }),

    code: z
        .string({ message: "O campo código da fieira é obrigatório." })
        .regex(/^[A-Z]\d{2}$/, {
            message:
                "O campo código da fieira é obrigatório e deve estar entre A00..Z99.",
        }),

    status: z
        .string()
        .refine((val) => Object.keys(statusTranslate).includes(val), {
            message: `O status enviado é inválido. Escolha entre: ${Object.keys(statusTranslate).join(", ")}`,
        })
        .optional(),
});

export type CreateStockInputValidated = z.infer<typeof stockSchemaCreate>;

export class CreateStockZodValidator implements Validator<CreateStockInputValidated> {
    public static build(): CreateStockZodValidator {
        return new CreateStockZodValidator();
    }

    public validate(data: unknown): CreateStockInputValidated {
        return stockSchemaCreate.parse(data);
    }
}
