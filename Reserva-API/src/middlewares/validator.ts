import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

declare global {
    namespace Express {
        interface Request {
            validatedQuery?: any;
        }
    }
}

export const validateBody = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map(issue => ({
                campo: issue.path.join('.'),
                mensagem: issue.message,
            }));
            return res.status(400).json({ mensagem: "Erro de validação.", erros: errorMessages });
        }
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};

export const validateQuery = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        req.validatedQuery = schema.parse(req.query);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.issues.map(issue => ({
                campo: issue.path.join('.'),
                mensagem: issue.message,
            }));
            return res.status(400).json({ mensagem: "Erro de validação.", erros: errorMessages });
        }
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
};