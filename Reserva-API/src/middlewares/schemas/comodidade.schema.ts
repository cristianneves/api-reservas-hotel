import { z } from 'zod';

export const criarComodidadeSchema = z.object({
  nome: z.preprocess(
      (val) => (val === undefined || val === null ? "" : val), 
      z.string().min(1, { message: "O nome da comodidade é obrigatório." })
  ),
});