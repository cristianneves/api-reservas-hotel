import { z } from 'zod';

export const criarAvaliacaoSchema = z.object({
    nota: z.any()
        .refine(val => val !== undefined && val !== null, { message: "A nota é obrigatória." })
        .refine(val => typeof val === 'number', { message: "A nota deve ser um número." })
        .refine(val => Number.isInteger(val), { message: "A nota deve ser um número inteiro." })
        .refine(val => val >= 1, { message: "A nota mínima é 1." })
        .refine(val => val <= 5, { message: "A nota máxima é 5." }),
    comentario: z.string().optional(),
});