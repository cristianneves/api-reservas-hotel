// src/services/reserva.service.ts

import ReservaModel, { Reserva, ReservaInput } from '../models/reserva.model';
import { QuartoModel } from '../models/quarto.model';
import { HotelModel } from '../models/hotel.model';
import { UsuarioModel } from '../models/usuario.model';
import { Types } from 'mongoose';
import AppError from '../errors/AppError';

type CriarReservaDto = {
  quartoId: string;
  usuarioId: string;
  checkIn: string | Date;
  checkOut: string | Date;
};

const verificaDisponibilidade = async (quartoId: string, checkIn: Date, checkOut: Date, reservaIdExcluida?: string): Promise<boolean> => {
    const query: any = {
        quartoId,
        status: 'CONFIRMADA',
        checkIn: { $lt: checkOut },
        checkOut: { $gt: checkIn },
    };

    if (reservaIdExcluida) {
        query._id = { $ne: new Types.ObjectId(reservaIdExcluida) };
    }

    const reservaConflitante = await ReservaModel.findOne(query);
    return !reservaConflitante;
};

export const verificarDisponibilidadeMes = async (quartoId: string, ano: number, mes: number): Promise<any[]> => {
    const quarto = await QuartoModel.findById(quartoId);
    if (!quarto) {
        throw new AppError('Quarto não encontrado.', 404);
    }

    const primeiroDia = new Date(Date.UTC(ano, mes - 1, 1));
    const ultimoDia = new Date(Date.UTC(ano, mes, 1));

    const reservasDoQuarto = await ReservaModel.find({
        quartoId: quartoId,
        status: 'CONFIRMADA',
        checkIn: { $lt: ultimoDia },
        checkOut: { $gt: primeiroDia }
    });

    const calendario = [];
    const diasNoMes = new Date(ano, mes, 0).getDate();

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const dataAtual = new Date(Date.UTC(ano, mes - 1, dia));
        let statusDia = { dia, status: 'disponivel' };

        for (const reserva of reservasDoQuarto) {
            const checkIn = reserva.checkIn;
            const checkOut = reserva.checkOut;

            if (dataAtual >= checkIn && dataAtual < checkOut) {
                statusDia = { dia, status: 'ocupado' };
                break;
            }
        }
        calendario.push(statusDia);
    }
    return calendario;
};

export const criarNovaReserva = async (dadosReserva: CriarReservaDto): Promise<any> => {
  const { quartoId, usuarioId, checkIn, checkOut } = dadosReserva;

  const quarto = await QuartoModel.findById(quartoId);
  if (!quarto) {
    throw new AppError('Quarto não encontrado.', 404);
  }

  const usuario = await UsuarioModel.findById(usuarioId);
  if (!usuario) {
      throw new AppError('Usuário não encontrado.', 404);
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
      throw new AppError('A data de check-out deve ser posterior à data de check-in.');
  }
  const disponivel = await verificaDisponibilidade(quartoId, checkInDate, checkOutDate);
  if (!disponivel) {
      throw new AppError('O quarto não está disponível para as datas selecionadas.');
  }
  
  const umDiaEmMs = 1000 * 60 * 60 * 24;
  const numeroDeNoites = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / umDiaEmMs);
  const precoTotal = numeroDeNoites * quarto.preco_diaria;

  const dadosParaCriacao: ReservaInput = {
    hotelId: (quarto as any).hotelId,
    quartoId: new Types.ObjectId((quarto._id as any).toString()),
    usuarioId: new Types.ObjectId((usuario._id as any).toString()),
    checkIn: checkInDate,
    checkOut: checkOutDate,
    precoTotal: precoTotal,
  };

  const novaReserva = await ReservaModel.create(dadosParaCriacao);

  await novaReserva.populate([
    { path: 'usuarioId', select: 'nome email' },
    { path: 'hotelId', select: 'nome' },
    { path: 'quartoId', select: 'numero tipo' }
  ]);

  return novaReserva;
};

export const buscarTodas = async (): Promise<any[]> => {
  return ReservaModel.find({}).populate([
    { path: 'usuarioId', select: 'nome email' },
    { path: 'hotelId', select: 'nome' },
    { path: 'quartoId', select: 'numero tipo' }
  ]);
};

export const buscarPorId = async (id: string): Promise<any | null> => {
  const reserva = await ReservaModel.findById(id).populate([
    { path: 'usuarioId', select: 'nome email' },
    { path: 'hotelId', select: 'nome' },
    { path: 'quartoId', select: 'numero tipo' }
  ]);
  if (!reserva) {
    throw new AppError('Reserva não encontrada.', 404);
  }
  return reserva;
};

export const buscarPorHotelId = async (hotelId: string): Promise<any[]> => {
    const hotel = await HotelModel.findById(hotelId);
    if (!hotel) {
        throw new AppError('Hotel não encontrado.', 404);
    }
    return ReservaModel.find({ hotelId }).populate([
      { path: 'usuarioId', select: 'nome email' },
      { path: 'quartoId', select: 'numero tipo' }
    ]);
};

export const buscarPorUsuarioId = async (usuarioId: string): Promise<any[]> => {
    return ReservaModel.find({ usuarioId }).populate([
      { path: 'hotelId', select: 'nome' },
      { path: 'quartoId', select: 'numero tipo' }
    ]);
};

export const cancelarReserva = async (id: string): Promise<any> => {
    const reserva = await ReservaModel.findById(id);

    if (!reserva) {
        throw new AppError("Reserva não encontrada.", 404);
    }

    if ((reserva as any).status === 'CANCELADA') {
        throw new AppError("Esta reserva já foi cancelada.");
    }

    const hoje = new Date();
    const checkIn = new Date((reserva as any).checkIn);

    hoje.setHours(0, 0, 0, 0);
    checkIn.setHours(0, 0, 0, 0);

    const diffEmMs = checkIn.getTime() - hoje.getTime();
    const diffEmDias = Math.ceil(diffEmMs / (1000 * 60 * 60 * 24));

    if (diffEmDias < 3) {
        throw new AppError(`Cancelamento não permitido. A reserva deve ser cancelada com pelo menos 3 dias de antecedência.`);
    }

    const reservaCancelada = await ReservaModel.findByIdAndUpdate(id, { status: 'CANCELADA' }, { new: true });
    
    return reservaCancelada;
};

export const atualizarUmaReserva = async (id: string, dados: Partial<CriarReservaDto>): Promise<Reserva | null> => {
    const reservaExistente = await ReservaModel.findById(id);

    if(!reservaExistente) {
      throw new AppError('Reserva não encontrada para atualização.', 404);
    }

    if ((reservaExistente as any).status === 'CANCELADA') {
      throw new AppError('Não é possível atualizar uma reserva cancelada.');
    }

    const dadosParaAtualizar: any = { ...dados };
    const checkInDate = dados.checkIn ? new Date(dados.checkIn) : (reservaExistente as any).checkIn;
    const checkOutDate = dados.checkOut ? new Date(dados.checkOut) : (reservaExistente as any).checkOut;

    if (dados.checkIn || dados.checkOut) {
      if (checkOutDate <= checkInDate) {
        throw new AppError('A data de check-out deve ser posterior à data de check-in.');
      }
      const disponivel = await verificaDisponibilidade((reservaExistente as any).quartoId.toString(), checkInDate, checkOutDate, id);
      if (!disponivel) {
        throw new AppError('O quarto não está disponível para as novas datas selecionadas.');
      }

      const quarto = await QuartoModel.findById((reservaExistente as any).quartoId);
      if (!quarto) {
        throw new AppError('Quarto associado à reserva não foi encontrado.', 404);
      }
      
      const umDiaEmMs = 1000 * 60 * 60 * 24;
      const numeroDeNoites = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / umDiaEmMs);
      dadosParaAtualizar.precoTotal = numeroDeNoites * quarto.preco_diaria;
      dadosParaAtualizar.checkIn = checkInDate;
      dadosParaAtualizar.checkOut = checkOutDate;
    }

    return ReservaModel.findByIdAndUpdate(id, dadosParaAtualizar, { new: true });
};

export const removerUmaReserva = async (id: string): Promise<void> => {
  const resultado = await ReservaModel.findByIdAndDelete(id);
  if (resultado === null) {
    throw new AppError('Reserva não encontrada para exclusão.', 404);
  }
};