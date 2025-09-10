import { z } from 'zod';

export const criarHotelSchema = z.object({
    nome: z.preprocess(
        (val) => (val === undefined || val === null ? "" : val), 
        z.string().min(1, { message: "O nome do hotel é obrigatório." })
    ),
    endereco: z.preprocess(
        (val) => (val === undefined || val === null ? "" : val), 
        z.string().min(1, { message: "O endereço é obrigatório." })
    ),
    cidade: z.preprocess(
        (val) => (val === undefined || val === null ? "" : val), 
        z.string().min(1, { message: "A cidade é obrigatória." })
    ),
    estado: z.preprocess(
        (val) => (val === undefined || val === null ? "" : val), 
        z.string().min(1, { message: "O estado é obrigatório." })
    ),
    pais: z.preprocess(
        (val) => (val === undefined || val === null ? "" : val), 
        z.string().min(1, { message: "O país é obrigatório." })
    ),
    telefone: z.preprocess(
        (val) => (val === undefined || val === null ? "" : val), 
        z.string().min(1, { message: "O telefone é obrigatório." })
    ),
    email: z.preprocess(
        (val) => (val === undefined || val === null ? "" : val), 
        z.string()
            .min(1, { message: "O e-mail é obrigatório." })
            .email({ message: "Formato de e-mail inválido." })
    ),
    site: z.string().url({ message: "A URL do site é inválida." }).optional(),
});

export const atualizarHotelSchema = criarHotelSchema.partial();