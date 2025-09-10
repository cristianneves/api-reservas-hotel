import * as UsuarioModel from '../models/usuario.model';
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError';

export const registrar = async (dadosUsuario: { nome: string; email: string; password?: string }): Promise<Omit<Usuario, 'password'>> => {
    const { email, nome, password } = dadosUsuario;

    if (await UsuarioModel.findOne({ email })) {
        throw new AppError("Este e-mail já está em uso.", 400);
    }
    
    const usuario = await UsuarioModel.create({ nome, email, password });
    usuario.password = undefined;

    return usuario;
};

export const login = async (dadosLogin: Pick<Usuario, 'email' | 'password'>): Promise<{ usuario: Omit<Usuario, 'password'>, token: string }> => {
    const { email, password } = dadosLogin;

    const usuario = await UsuarioModel.findOneWithPassword({ email });
    if (!usuario) {
        throw new AppError("Credenciais inválidas.", 401);
    }

    const senhaCorreta = await bcrypt.compare(password!, usuario.password!);
    if (!senhaCorreta) {
        throw new AppError("Credenciais inválidas.", 401);
    }

    const token = jwt.sign(
        { id: usuario.id, role: usuario.role },
        process.env.JWT_SECRET!,
        { expiresIn: '8h' }
    );

    usuario.password = undefined;

    return { usuario, token };
};