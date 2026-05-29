import { z } from "zod";

export const estoqueSchema = z.object({
  armarioName: z.string({ message: "O campo armário é obrigatório e deve estar entre CTC000..CTC999 ou WM000..WM999" }).
  regex(/^(CTC\d{3}|WM\d{3})$/, {
      message: "O campo armário é obrigatório e deve estar entre CTC000..CTC999 ou WM000..WM999"
    }),

  codigo: z.string({ message: "O campo código da fieira é obrigatório e deve estar entre A00..Z99." }).
  regex(/^[A-Z]\d{2}$/, {
    message: "O campo código da fieira é obrigatório e deve estar entre A00..Z99."}),

  status: z.enum(['nova', 'requisição', 'morta', 'polida'], { 
    message: "O campo status é obrigatório e deve ser: nova, requisição, morta ou polida."}),

  espessura_atual: z.number({ message: "Espessura atual deve ser um número" }).
  positive({ message: "Espessura atual deve ser um valor positivo" }).
  nullable().
  optional(),

  largura_atual: z.number({ message: "Largura atual deve ser um número" }).
  positive({ message: "Largura atual deve ser um valor positivo" }).
  nullable().
  optional(),

  utilizacao: z.number({ message: "Utilização deve ser um número" }).
  int({ message: "Utilização deve ser um valor inteiro" }).
  positive({ message: "Utilização deve ser um valor positivo" }).
  nullable().
  optional(),

  producao: z.number({ message: "Produção deve ser um número" }).
  int({ message: "Produção deve ser um valor inteiro" }).
  positive({ message: "Produção deve ser valor positivo" }).
  nullable().
  optional()
});
