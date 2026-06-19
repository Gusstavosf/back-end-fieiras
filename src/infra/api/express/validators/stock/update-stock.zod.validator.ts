import { z } from "zod";
import type { Validator } from "../../../../../core/shared/validator.interface.js";
import { StatusFieira } from "../../../../../domain/stock/entity/stock/stock.js";

const statusTranslate: Record<string, StatusFieira> = {
    Nova: StatusFieira.New,
    Requisição: StatusFieira.Requested,
    Morta: StatusFieira.Dead,
    Polida: StatusFieira.Polished,
};

const stockSchemaUpdate = z
    .object({
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
            .transform((val) => statusTranslate[val]),

        thickness: z
            .number({ message: "Espessura atual deve ser um número" })
            .positive({ message: "Espessura atual deve ser um valor positivo" })
            .optional(),

        width: z
            .number({ message: "Largura atual deve ser um número" })
            .positive({ message: "Largura atual deve ser um valor positivo" })
            .optional(),

        utilization: z
            .number({ message: "Utilização deve ser um número" })
            .int({ message: "Utilização deve ser um valor inteiro" })
            .nonnegative({ message: "Utilização não pode ser um valor negativo" })
            .optional(),

        production: z
            .number({ message: "Produção deve ser um número" })
            .int({ message: "Produção deve ser um valor inteiro" })
            .nonnegative({ message: "Produção não pode ser um valor negativo" })
            .optional(),
    })
    .refine(
        (data) => {
            if (
                data.status === StatusFieira.Polished ||
                data.status === StatusFieira.Dead
            ) {
                return (
                    data.thickness !== undefined &&
                    data.width !== undefined &&
                    data.production !== undefined &&
                    data.utilization !== undefined
                );
            }

            return true;
        },
        {
            message:
                "Para os status 'Polida' ou 'Morta', os campos espessura, largura, produção e utilização são obrigatórios.",
            path: ["status"],
        },
    );

export type UpdateStockInputValidated = z.infer<typeof stockSchemaUpdate>;

export class UpdateStockZodValidator implements Validator<UpdateStockInputValidated> {
    public static build(): UpdateStockZodValidator {
        return new UpdateStockZodValidator();
    }

    public validate(data: unknown): UpdateStockInputValidated {
        return stockSchemaUpdate.parse(data);
    }
}
