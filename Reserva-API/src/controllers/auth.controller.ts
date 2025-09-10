import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';

export const registrarController = async (req: Request, res: Response) => {
    const usuario = await AuthService.registrar(req.body);
    res.status(201).json({ mensagem: "Usuário registrado com sucesso!", usuario });
};

export const loginController = async (req: Request, res: Response) => {
    const { usuario, token } = await AuthService.login(req.body);
    res.status(200).json({ mensagem: "Login bem-sucedido!", usuario, token });
};