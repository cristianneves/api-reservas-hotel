import { Router } from 'express';
import * as AvaliacaoController from '../controllers/avaliacao.controller';
import { proteger } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validator';
import { criarAvaliacaoSchema } from '../middlewares/schemas/avaliacao.schema';

const avaliacaoRouter = Router();

avaliacaoRouter.post(
    '/reservas/:reservaId', 
    proteger, 
    validateBody(criarAvaliacaoSchema),
    AvaliacaoController.criarAvaliacao
);

avaliacaoRouter.get(
    '/hotel/:hotelId', 
    AvaliacaoController.listarAvaliacoesPorHotel
);

export default avaliacaoRouter;