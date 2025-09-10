import { Router } from 'express';
import * as ReservaController from '../controllers/reserva.controller';
import { proteger, isAdmin } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validator';
import { criarReservaSchema } from '../middlewares/schemas/reserva.schema';

const reservaRouter = Router();

// --- Rotas de Admin ---
reservaRouter.get('/', proteger, isAdmin, ReservaController.listarReservas);
reservaRouter.get('/hotel/:hotelId', proteger, isAdmin, ReservaController.listarReservasPorHotel);
reservaRouter.delete('/:id', proteger, isAdmin, ReservaController.deletarReserva);

// --- Rotas de Usuário Autenticado ---
reservaRouter.get('/minhas-reservas', proteger, ReservaController.listarMinhasReservas);
reservaRouter.get('/:id', proteger, ReservaController.obterReservaPorId);
reservaRouter.post('/', proteger, validateBody(criarReservaSchema), ReservaController.criarReserva);
reservaRouter.post('/:id/cancelar', proteger, ReservaController.cancelarReserva);

export default reservaRouter;