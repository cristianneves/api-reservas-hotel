import { z } from 'zod';

export const registrarUsuarioSchema = z.object({
  nome: z.preprocess(
      (val) => (val === undefined || val === null ? "" : val), 
      z.string().min(1, { message: "O nome é obrigatório." })
  ),
  email: z.preprocess(
      (val) => (val === undefined || val === null ? "" : val), 
      z.string().min(1, { message: "O e-mail é obrigatório." }).email("Formato de e-mail inválido.")
  ),
  password: z.preprocess(
      (val) => (val === undefined || val === null ? "" : val), 
      z.string()
          .min(1, { message: "A senha é obrigatória." })
          .min(6, "A senha deve ter no mínimo 6 caracteres.")
  ),
});

export const loginSchema = z.object({
    email: z.preprocess(
        (val) => (val === undefined || val === null ? "" : val), 
        z.string().min(1, { message: "O e-mail é obrigatório." }).email("Formato de e-mail inválido.")
    ),
    password: z.preprocess(
        (val) => (val === undefined || val === null ? "" : val), 
        z.string().min(1, { message: "A senha é obrigatória." })
    ),
});