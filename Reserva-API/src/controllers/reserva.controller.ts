// src/controllers/reserva.controller.ts

import { Request, Response } from 'express';
import * as ReservaService from '../services/reserva.service';

export const criarReserva = async (req: Request, res: Response) => {
    const dadosParaCriacao = {
        ...req.body,
        usuarioId: req.userId!
    };
    const novaReserva = await ReservaService.criarNovaReserva(dadosParaCriacao);
    res.status(201).json({
      mensagem: 'Reserva criada com sucesso.',
      dados: novaReserva,
    });
};

export const listarReservas = async (req: Request, res: Response) => {
    const todasAsReservas = await ReservaService.buscarTodas();
    res.status(200).json(todasAsReservas);
};

export const listarMinhasReservas = async (req: Request, res: Response) => {
    const minhasReservas = await ReservaService.buscarPorUsuarioId(req.userId!);
    res.status(200).json(minhasReservas);
};

export const obterReservaPorId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const reserva = await ReservaService.buscarPorId(id);
    res.status(200).json(reserva);
};

export const listarReservasPorHotel = async (req: Request, res: Response) => {
    const { hotelId } = req.params;
    const reservas = await ReservaService.buscarPorHotelId(hotelId);
    res.status(200).json(reservas);
};

export const cancelarReserva = async (req: Request, res: Response) => {
    const { id } = req.params;
    const reservaCancelada = await ReservaService.cancelarReserva(id);
    res.status(200).json(reservaCancelada);
};

export const atualizarReserva = async (req: Request, res: Response) => {
    const { id } = req.params;
    const dadosAtualizados = await ReservaService.atualizarUmaReserva(id, req.body);
    res.status(200).json(dadosAtualizados);
}

export const deletarReserva = async (req: Request, res: Response) => {
    const { id } = req.params;
    await ReservaService.removerUmaReserva(id);
    res.status(204).send();
};