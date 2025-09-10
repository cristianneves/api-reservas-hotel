import { Router } from 'express';
import * as ComodidadeController from '../controllers/comodidade.controller';
import { proteger, isAdmin } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validator';
import { criarComodidadeSchema } from '../middlewares/schemas/comodidade.schema';

const comodidadeRouter = Router();

comodidadeRouter.post(
    '/', 
    proteger, 
    isAdmin, 
    validateBody(criarComodidadeSchema),
    ComodidadeController.criarComodidade
);

comodidadeRouter.get('/', ComodidadeController.listarComodidades);
comodidadeRouter.delete('/:id', proteger, isAdmin, ComodidadeController.deletarComodidade);

export default comodidadeRouter;