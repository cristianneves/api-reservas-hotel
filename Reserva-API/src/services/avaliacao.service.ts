// src/services/avaliacao.service.ts

import { AvaliacaoModel, findAllByHotelId } from '../models/avaliacao.model';
import * as ReservaModel from '../models/reserva.model';
import { HotelModel } from '../models/hotel.model';
import AppError from '../errors/AppError';
import { Types } from 'mongoose';

export const criarAvaliacao = async (
    reservaId: string, 
    usuarioId: string, 
    dadosAvaliacao: { nota: number; comentario?: string }
) => {
    const reserva = await ReservaModel.findById(reservaId);

    if (!reserva) {
        throw new AppError('Reserva não encontrada.', 404);
    }
    
    if (reserva.usuarioId._id.toString() !== usuarioId) {
        throw new AppError('Você só pode avaliar as suas próprias estadias.', 403);
    }
    if (reserva.checkOut > new Date()) {
        throw new AppError('Você só pode avaliar uma estadia após a data de check-out.', 400);
    }

    const avaliacaoExistente = await AvaliacaoModel.findOne({ reservaId });
    if (avaliacaoExistente) {
        throw new AppError('Esta estadia já foi avaliada.', 400);
    }
    
    const novaAvaliacao = await AvaliacaoModel.create({
        ...dadosAvaliacao,
        reservaId,
        usuarioId,
        hotelId: reserva.hotelId
    });

    const stats = await AvaliacaoModel.aggregate([
        { $match: { hotelId: new Types.ObjectId(reserva.hotelId.toString()) } },
        { 
            $group: {
                _id: '$hotelId',
                avaliacaoMedia: { $avg: '$nota' },
                numeroDeAvaliacoes: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        const { avaliacaoMedia, numeroDeAvaliacoes } = stats[0];
        await HotelModel.findByIdAndUpdate(reserva.hotelId, {
            avaliacaoMedia: parseFloat(avaliacaoMedia.toFixed(1)),
            numeroDeAvaliacoes: numeroDeAvaliacoes
        });
    }

    return novaAvaliacao;
};

export const buscarAvaliacoesPorHotel = async (hotelId: string) => {
    const hotel = await HotelModel.findById(hotelId);
    if (!hotel) {
        throw new AppError('Hotel não encontrado.', 404);
    }

    const avaliacoes = await findAllByHotelId(hotelId);
    return avaliacoes;
};