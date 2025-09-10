import { QuartoModel } from '../models/quarto.model';
import { HotelModel } from '../models/hotel.model';
import AppError from '../errors/AppError';

interface FiltrosBusca {
    cidade?: string;
    precoMin?: number;
    precoMax?: number;
    capacidadeMin?: number;
}

export const criar = async (dadosDoQuarto: any, hotelId: string) => {
    const dadosCompletos = { ...dadosDoQuarto, hotelId: hotelId };
    const novoQuarto = await QuartoModel.create(dadosCompletos);
    return novoQuarto;
};

export const listarPorHotel = async (hotelId: string) => {
    const quartos = await QuartoModel.find({ hotelId: hotelId });
    if (!quartos || quartos.length === 0) {
        throw new AppError('Nenhum quarto encontrado para este hotel.', 404);
    }
    return quartos;
};

export const listarTodos = async () => {
    const todosOsQuartos = await QuartoModel.find({});
    return todosOsQuartos;
};

export const obterPorId = async (id: string) => {
    const quarto = await QuartoModel.findById(id);
    if (!quarto) {
        throw new AppError('Quarto não encontrado.', 404);
    }
    return quarto;
};

export const atualizar = async (id: string, dadosParaAtualizar: any) => {
    const quartoAtualizado = await QuartoModel.findByIdAndUpdate(id, dadosParaAtualizar, { new: true });
    if (!quartoAtualizado) {
        throw new AppError('Quarto não encontrado para atualização.', 404);
    }
    return quartoAtualizado;
};

export const deletar = async (id: string) => {
    const resultado = await QuartoModel.findByIdAndDelete(id);
    if (resultado === null) {
        throw new AppError('Quarto não encontrado para exclusão.', 404);
    }
};

export const buscarQuartos = async (filtros: FiltrosBusca) => {
    const { cidade, precoMin, precoMax, capacidadeMin } = filtros;

    const queryQuarto: any = {};
    
    if (cidade) {
        const hoteisNaCidade = await HotelModel.find({ 
            cidade: { $regex: new RegExp(`^${cidade}$`, 'i') } 
        }).select('_id');

        if (hoteisNaCidade.length === 0) {
            return [];
        }

        const idsDeHoteis = hoteisNaCidade.map(hotel => hotel._id);
        queryQuarto.hotelId = { $in: idsDeHoteis };
    }

    if (capacidadeMin) {
        queryQuarto.capacidade = { $gte: capacidadeMin };
    }
    if (precoMin) {
        queryQuarto.preco_diaria = { ...queryQuarto.preco_diaria, $gte: precoMin };
    }
    if (precoMax) {
        queryQuarto.preco_diaria = { ...queryQuarto.preco_diaria, $lte: precoMax };
    }

    const quartosEncontrados = await QuartoModel.find(queryQuarto).populate({
        path: 'hotelId',
        select: 'nome cidade'
    });

    return quartosEncontrados;
};