import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError';

export const errorHandler = (
    error: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    console.error(error);

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: 'error',
            mensagem: error.message
        });
    }

    return res.status(500).json({
        status: 'error',
        mensagem: 'Erro interno do servidor.'
    });
};