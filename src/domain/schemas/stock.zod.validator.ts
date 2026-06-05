import { z } from "zod";

export const stockSchema = z.object({
  cabinetName: z.string({ message: "O campo armário é obrigatório." })
  .regex(/^(CTC\d{3}|WM\d{3})$/, {
      message: "O campo armário é obrigatório e deve estar entre CTC000..CTC999 ou WM000..WM999"
    }),

  code: z.string({ message: "O campo código da fieira é obrigatório." })
  .regex(/^[A-Z]\d{2}$/, {
    message: "O campo código da fieira é obrigatório e deve estar entre A00..Z99."}),

  status: z.enum(['nova', 'requisicao', 'morta', 'polida'], { 
    message: "O campo status é obrigatório e deve ser: nova, requisicao, morta ou polida."}),

  currentThickness: z.number({ message: "Espessura atual deve ser um número" })
  .positive({ message: "Espessura atual deve ser um valor positivo" })
  .nullable()
  .optional(),

  currentWidth: z.number({ message: "Largura atual deve ser um número" })
  .positive({ message: "Largura atual deve ser um valor positivo" })
  .nullable()
  .optional(),

  utilization: z.number({ message: "Utilização deve ser um número" })
  .int({ message: "Utilização deve ser um valor inteiro" })
  .nonnegative({ message: "Utilização não pode ser um valor negativo" })
  .nullable()
  .optional(),

  production: z.number({ message: "Produção deve ser um número" })
  .int({ message: "Produção deve ser um valor inteiro" })
  .nonnegative({ message: "Produção não pode ser um valor negativo" })
  .nullable()
  .optional()
});
