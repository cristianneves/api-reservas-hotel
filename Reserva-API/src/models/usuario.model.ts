import { Schema, model, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = "user" | "admin";

export interface Usuario extends Document {
  nome: string;
  email: string;
  password?: string;
  role: UserRole;
}

const usuarioSchema = new Schema<Usuario>({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" }
}, { timestamps: true });

usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const hash = await bcrypt.hash(this.password!, 10);
    this.password = hash;
    next();
});

export const UsuarioModel = model<Usuario>('Usuario', usuarioSchema);

export const findById = async (id: string | Types.ObjectId): Promise<Usuario | null> => {
    return UsuarioModel.findById(id);
};

export const findAll = async (): Promise<Usuario[]> => {
    return UsuarioModel.find();
};

export const findOne = async (query: object): Promise<Usuario | null> => {
    return UsuarioModel.findOne(query);
};

export const findOneWithPassword = async (query: object): Promise<Usuario | null> => {
    return UsuarioModel.findOne(query).select('+password');
};

// MUDANÇA AQUI: Simplificar a assinatura para esperar um objeto simples
export const create = async (dados: { nome: string; email: string; password?: string }): Promise<Usuario> => {
    return UsuarioModel.create(dados);
};