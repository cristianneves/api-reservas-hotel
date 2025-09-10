import { Schema, model, Document, Types } from 'mongoose';

export interface Hotel extends Document {
  nome: string;
  endereco: string;
  cidade: string;
  estado: string;
  pais: string;
  telefone: string;
  email: string;
  site: string;
  comodidades: Types.ObjectId[];
  avaliacaoMedia: number;
  numeroDeAvaliacoes: number;
  imagemDeCapaUrl?: string;
}

const hotelSchema = new Schema<Hotel>({
  nome: { type: String, required: true },
  endereco: { type: String, required: true },
  cidade: { type: String, required: true },
  estado: { type: String, required: true },
  pais: { type: String, required: true },
  telefone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  site: { type: String },
  comodidades: [{ type: Schema.Types.ObjectId, ref: 'Comodidade' }],
  avaliacaoMedia: { type: Number, default: 0 },
  numeroDeAvaliacoes: { type: Number, default: 0 },
  imagemDeCapaUrl: { type: String },
}, { timestamps: true });

export const HotelModel = model<Hotel>('Hotel', hotelSchema);

export const findAll = async (): Promise<Hotel[]> => {
  return HotelModel.find().populate('comodidades', 'nome');
};

export const findById = async (id: string | Types.ObjectId): Promise<Hotel | null> => {
  return HotelModel.findById(id).populate('comodidades', 'nome');
};

export const create = async (dadosNovoHotel: Omit<Hotel, 'id' | 'comodidades'>): Promise<Hotel> => {
    const novoHotel = new HotelModel(dadosNovoHotel);
    return novoHotel.save();
};

export const update = async (id: string, dadosAtualizacao: Partial<Omit<Hotel, 'id' | 'comodidades'>>): Promise<Hotel | null> => {
    return HotelModel.findByIdAndUpdate(id, dadosAtualizacao, { new: true });
};

export const remove = async (id: string): Promise<Hotel | null> => {
    return HotelModel.findByIdAndDelete(id);
};