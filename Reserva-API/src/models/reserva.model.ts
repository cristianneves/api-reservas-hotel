import { Schema, model, Document, Types } from 'mongoose';
import { TipoQuarto } from './quarto.model';

export type StatusReserva = "CONFIRMADA" | "CANCELADA";

export interface Reserva extends Document {
  hotelId: Types.ObjectId;
  quartoId: Types.ObjectId;
  usuarioId: Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  precoTotal: number;
  status: StatusReserva;
}

const reservaSchema = new Schema<Reserva>({
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    quartoId: { type: Schema.Types.ObjectId, ref: 'Quarto', required: true },
    usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    precoTotal: { type: Number, required: true },
    status: { type: String, enum: ["CONFIRMADA", "CANCELADA"], default: "CONFIRMADA", required: true }
}, { timestamps: true });

const ReservaModel = model<Reserva>('Reserva', reservaSchema);

export type ReservaInput = {
    hotelId: Types.ObjectId;
    quartoId: Types.ObjectId;
    usuarioId: Types.ObjectId;
    checkIn: Date;
    checkOut: Date;
    precoTotal: number;
};

export const findAll = async (): Promise<Reserva[]> => 
    ReservaModel.find().populate('usuarioId', 'nome email').populate('hotelId', 'nome');

export const findById = async (id: string | Types.ObjectId): Promise<Reserva | null> => 
    ReservaModel.findById(id).populate('usuarioId', 'nome email').populate('hotelId', 'nome');

export const findAllByHotelId = async (hotelId: string): Promise<Reserva[]> => 
    ReservaModel.find({ hotelId: hotelId }).populate('usuarioId', 'nome email').populate('hotelId', 'nome');

export const findAllByUsuarioId = async (usuarioId: string): Promise<Reserva[]> => {
    return ReservaModel.find({ usuarioId: usuarioId }).populate('usuarioId', 'nome email').populate('hotelId', 'nome');
};

export const create = async (novaReservaData: ReservaInput): Promise<Reserva> => 
    new ReservaModel(novaReservaData).save();

export const update = async (id: string, dadosAtualizacao: Partial<Omit<Reserva, 'id'>>): Promise<Reserva | null> => 
    ReservaModel.findByIdAndUpdate(id, dadosAtualizacao, { new: true });

export const remove = async (id: string): Promise<Reserva | null> => 
    ReservaModel.findByIdAndDelete(id);

export default ReservaModel;