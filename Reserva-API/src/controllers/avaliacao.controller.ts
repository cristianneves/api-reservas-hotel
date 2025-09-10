import { Request, Response } from 'express';
import * as AvaliacaoService from '../services/avaliacao.service';

export const criarAvaliacao = async (req: Request, res: Response) => {
    const { reservaId } = req.params;
    const usuarioId = req.userId!;
    const dadosAvaliacao = req.body;

    const avaliacao = await AvaliacaoService.criarAvaliacao(reservaId, usuarioId, dadosAvaliacao);
    res.status(201).json(avaliacao);
};

export const listarAvaliacoesPorHotel = async (req: Request, res: Response) => {
    const { hotelId } = req.params;
    const avaliacoes = await AvaliacaoService.buscarAvaliacoesPorHotel(hotelId);
    res.status(200).json(avaliacoes);
};