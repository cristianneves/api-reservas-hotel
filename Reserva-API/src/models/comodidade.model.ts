import { Schema, model, Document, Types } from 'mongoose';

export interface IComodidade extends Document {
  nome: string;
}

const comodidadeSchema = new Schema<IComodidade>({
    nome: { type: String, required: true, unique: true }
}, { timestamps: true });

export const ComodidadeModel = model<IComodidade>('Comodidade', comodidadeSchema);