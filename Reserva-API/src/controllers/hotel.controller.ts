import { Request, Response } from 'express';
import * as HotelService from '../services/hotel.service';
import AppError from '../errors/AppError';


export const criarHotel = async (req: Request, res: Response) => {
    const novoHotel = await HotelService.criar(req.body);
    res.status(201).json(novoHotel);
};

export const listarHoteis = async (req: Request, res: Response) => {
    const todosOsHoteis = await HotelService.listar();
    res.status(200).json(todosOsHoteis);
};

export const obterHotelPorId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const hotel = await HotelService.obterPorId(id);
    res.status(200).json(hotel);
};

export const atualizarHotel = async (req: Request, res: Response) => {
    const { id } = req.params;
    const hotelAtualizado = await HotelService.atualizar(id, req.body);
    res.status(200).json(hotelAtualizado);
};

export const deletarHotel = async (req: Request, res: Response) => {
    const { id } = req.params;
    await HotelService.deletar(id);
    res.status(204).send();
};

export const adicionarComodidadeHotel = async (req: Request, res: Response) => {
    const { hotelId } = req.params;
    const { comodidadeId } = req.body;
    const hotelAtualizado = await HotelService.adicionarComodidade(hotelId, comodidadeId);
    res.status(200).json(hotelAtualizado);
};

export const removerComodidadeHotel = async (req: Request, res: Response) => {
    const { hotelId, comodidadeId } = req.params;
    const hotelAtualizado = await HotelService.removerComodidade(hotelId, comodidadeId);
    res.status(200).json(hotelAtualizado);
};

export const uploadImagemDeCapa = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!req.file) {
        throw new AppError("Nenhuma imagem foi enviada.", 400);
    }

    const hotelAtualizado = await HotelService.salvarImagemDeCapa(id, req.file);
    res.status(200).json(hotelAtualizado);
};