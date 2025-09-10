import { Schema, model, Document, Types } from 'mongoose';

export type TipoQuarto = "SIMPLES" | "DUPLO" | "TRIPLO" | "SUITE" | "SUITE_CRIANCA";

export interface Quarto extends Document {
  hotelId: Types.ObjectId;
  numero: string;
  tipo: TipoQuarto;
  capacidade: number;
  preco_diaria: number;
}

const quartoSchema = new Schema<Quarto>({
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    numero: { type: String, required: true },
    tipo: { type: String, enum: ["SIMPLES", "DUPLO", "TRIPLO", "SUITE", "SUITE_CRIANCA"], required: true },
    capacidade: { type: Number, required: true },
    preco_diaria: { type: Number, required: true }
}, { timestamps: true });

export const QuartoModel = model<Quarto>('Quarto', quartoSchema);

export const findAll = async (): Promise<Quarto[]> => {
    return QuartoModel.find().populate('hotelId', 'nome cidade');
};

export const findById = async (id: string | Types.ObjectId): Promise<Quarto | null> => {
    return QuartoModel.findById(id).populate('hotelId', 'nome cidade');
};

export const findAllByHotelId = async (hotelId: string): Promise<Quarto[]> => {
    return QuartoModel.find({ hotelId: hotelId }).populate('hotelId', 'nome cidade');
};
export const create = async (dadosNovoQuarto: Omit<Quarto, 'id'>): Promise<Quarto> => new QuartoModel(dadosNovoQuarto).save();
export const update = async (id: string, dadosAtualizacao: Partial<Omit<Quarto, 'id'>>): Promise<Quarto | null> => QuartoModel.findByIdAndUpdate(id, dadosAtualizacao, { new: true });
export const remove = async (id: string): Promise<Quarto | null> => QuartoModel.findByIdAndDelete(id);