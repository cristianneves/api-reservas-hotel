import { Request, Response } from 'express';
import { Comodidade } from '../entities/Comodidade';

export const criarComodidade = async (req: Request, res: Response) => {
    const novaComodidade = await Comodidade.criar(req.body);
    res.status(201).json(novaComodidade);
};

export const listarComodidades = async (req: Request, res: Response) => {
    const todasComodidades = await Comodidade.buscarTodas();
    res.status(200).json(todasComodidades);
};

export const deletarComodidade = async (req: Request, res: Response) => {
    const { id } = req.params;
    await Comodidade.deletar(id);
    res.status(204).send(); 
};