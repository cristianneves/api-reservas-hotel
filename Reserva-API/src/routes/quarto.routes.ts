import { Router } from 'express';
import * as QuartoController from '../controllers/quarto.controller';
import { proteger, isAdmin } from '../middlewares/auth.middleware';
import { validateBody, validateQuery } from '../middlewares/validator';
import { criarQuartoSchema, atualizarQuartoSchema, buscarQuartosSchema } from '../middlewares/schemas/quarto.schema';

const quartoRouter = Router();

quartoRouter.get('/buscar', validateQuery(buscarQuartosSchema), QuartoController.buscarQuartos);
quartoRouter.get('/', QuartoController.listarTodosOsQuartos);
quartoRouter.get('/:id', QuartoController.obterQuartoPorId);
quartoRouter.get('/:id/disponibilidade', QuartoController.obterDisponibilidadeCalendario);
quartoRouter.get('/hotel/:hotelId', QuartoController.listarQuartosPorHotel);


quartoRouter.post('/hotel/:hotelId', proteger, isAdmin, validateBody(criarQuartoSchema), QuartoController.criarQuarto);
quartoRouter.put('/:id', proteger, isAdmin, validateBody(atualizarQuartoSchema), QuartoController.atualizarQuarto);
quartoRouter.delete('/:id', proteger, isAdmin, QuartoController.deletarQuarto);

export default quartoRouter;