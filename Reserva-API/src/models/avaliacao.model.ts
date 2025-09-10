import { Schema, model, Document, Types } from 'mongoose';

export interface Avaliacao extends Document {
  usuarioId: Types.ObjectId;
  hotelId: Types.ObjectId;
  reservaId: Types.ObjectId;
  nota: number;
  comentario?: string;
}

const avaliacaoSchema = new Schema<Avaliacao>({
    usuarioId: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    reservaId: { type: Schema.Types.ObjectId, ref: 'Reserva', required: true, unique: true },
    nota: { type: Number, required: true, min: 1, max: 5 },
    comentario: { type: String, maxlength: 500 }
}, { timestamps: true });

export const AvaliacaoModel = model<Avaliacao>('Avaliacao', avaliacaoSchema);

export const findAllByHotelId = async (hotelId: string): Promise<Avaliacao[]> => {
    return AvaliacaoModel.find({ hotelId: hotelId })
        .populate('usuarioId', 'nome');
};