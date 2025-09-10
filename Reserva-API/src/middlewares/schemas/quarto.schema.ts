import { z } from 'zod';

const TIPOS_DE_QUARTO = ["SIMPLES", "DUPLO", "TRIPLO", "SUITE", "SUITE_CRIANCA"] as const;

export const criarQuartoSchema = z.object({
    numero: z.preprocess(
        (val) => (val === undefined || val === null ? "" : val),
        z.string().min(1, { message: "O número do quarto é obrigatório." })
    ),
    tipo: z.any()
        .refine(val => val !== undefined && val !== null, { message: "O tipo do quarto é obrigatório." })
        .refine(val => TIPOS_DE_QUARTO.includes(val), { message: "O tipo do quarto é inválido." }),
    capacidade: z.any()
        .refine(val => val !== undefined && val !== null, { message: "A capacidade é obrigatória." })
        .refine(val => Number.isInteger(val) && val > 0, { message: "A capacidade deve ser um número inteiro positivo." }),
    preco_diaria: z.any()
        .refine(val => val !== undefined && val !== null, { message: "O preço da diária é obrigatório." })
        .refine(val => typeof val === 'number' && val > 0, { message: "O preço da diária deve ser um número positivo." }),
});

export const atualizarQuartoSchema = criarQuartoSchema.partial();

export const buscarQuartosSchema = z.object({
    cidade: z.string().optional(),
    precoMin: z.coerce.number().positive().optional(),
    precoMax: z.coerce.number().positive().optional(),
    capacidadeMin: z.coerce.number().int().positive().optional(),
});