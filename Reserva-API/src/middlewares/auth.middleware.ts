import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as UsuarioModel from '../models/usuario.model';

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const proteger = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ mensagem: 'Token de acesso não fornecido.' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ mensagem: 'Token com formato inválido.' });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        req.userId = decoded.id; 
        return next();
    } catch (error) {
        return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
    }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.userId) {
            return res.status(500).json({ mensagem: 'ID do usuário não encontrado na requisição.' });
        }

        const usuario = await UsuarioModel.findById(req.userId);

        if (usuario && usuario.role === 'admin') {
            return next();
        }

        return res.status(403).json({ mensagem: 'Acesso negado. Rota exclusiva para administradores.' });

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro ao verificar permissões de administrador.' });
    }
};