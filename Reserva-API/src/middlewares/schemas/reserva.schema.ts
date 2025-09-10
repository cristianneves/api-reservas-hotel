import { z } from 'zod';

export const criarReservaSchema = z.object({
    quartoId: z.preprocess(
        (val) => (val === undefined || val === null ? "" : val),
        z.string().min(1, { message: "O ID do quarto é obrigatório." })
    ),
    
    checkIn: z.preprocess(
        (val) => (val === undefined || val === null ? "" : val),
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { 
            message: "Formato de data de check-in inválido. Use AAAA-MM-DD." 
        })
    ),
    
    checkOut: z.preprocess(
        (val) => (val === undefined || val === null ? "" : val),
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
            message: "Formato de data de check-out inválido. Use AAAA-MM-DD."
        })
    ),
});