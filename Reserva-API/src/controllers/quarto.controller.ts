import { Request, Response } from 'express';
import * as QuartoService from '../services/quarto.service';
import * as ReservaService from '../services/reserva.service';
import AppError from '../errors/AppError';

export const criarQuarto = async (req: Request, res: Response) => {
    const { hotelId } = req.params;
    const novoQuarto = await QuartoService.criar(req.body, hotelId);
    res.status(201).json(novoQuarto);
};

export const listarQuartosPorHotel = async (req: Request, res: Response) => {
    const { hotelId } = req.params;
    const quartos = await QuartoService.listarPorHotel(hotelId);
    res.status(200).json(quartos);
};

export const listarTodosOsQuartos = async (req: Request, res: Response) => {
    const todosOsQuartos = await QuartoService.listarTodos();
    res.status(200).json(todosOsQuartos);
};

export const obterQuartoPorId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const quarto = await QuartoService.obterPorId(id);
    res.status(200).json(quarto);
};

export const obterDisponibilidadeCalendario = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { ano, mes } = req.query;

    if (!ano || !mes) {
        throw new AppError('Os parâmetros "ano" e "mes" são obrigatórios.', 400);
    }
    const anoNum = parseInt(ano as string);
    const mesNum = parseInt(mes as string);
    if (isNaN(anoNum) || isNaN(mesNum)) {
        throw new AppError('Os parâmetros "ano" e "mes" devem ser números válidos.', 400);
    }
    
    const calendario = await ReservaService.verificarDisponibilidadeMes(id, anoNum, mesNum);
    res.status(200).json(calendario);
};

export const buscarQuartos = async (req: Request, res: Response) => {
    const filtros = req.validatedQuery;
    const quartos = await QuartoService.buscarQuartos(filtros);
    res.status(200).json(quartos);
};

export const atualizarQuarto = async (req: Request, res: Response) => {
    const { id } = req.params;
    const quartoAtualizado = await QuartoService.atualizar(id, req.body);
    res.status(200).json(quartoAtualizado);
};

export const deletarQuarto = async (req: Request, res: Response) => {
    const { id } = req.params;
    await QuartoService.deletar(id);
    res.status(204).send(); 
};