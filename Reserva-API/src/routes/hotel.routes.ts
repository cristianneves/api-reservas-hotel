import { Router } from 'express';
import * as HotelController from '../controllers/hotel.controller';
import { proteger, isAdmin } from '../middlewares/auth.middleware';
import { validateBody } from '../middlewares/validator';
import { criarHotelSchema, atualizarHotelSchema } from '../middlewares/schemas/hotel.schema';
import upload from '../middlewares/upload.middleware';


const hoteisRouter = Router();

// --- Rotas de Admin para Gerir Comodidades de um Hotel ---
hoteisRouter.post('/:hotelId/comodidades', proteger, isAdmin, HotelController.adicionarComodidadeHotel);
hoteisRouter.delete('/:hotelId/comodidades/:comodidadeId', proteger, isAdmin, HotelController.removerComodidadeHotel);

// --- Rotas Públicas ---
hoteisRouter.get('/', HotelController.listarHoteis);
hoteisRouter.get('/:id', HotelController.obterHotelPorId);

// --- Rotas de Admin para Hotéis ---
hoteisRouter.post('/', proteger, isAdmin, validateBody(criarHotelSchema), HotelController.criarHotel);
hoteisRouter.put('/:id', proteger, isAdmin, validateBody(atualizarHotelSchema), HotelController.atualizarHotel);
hoteisRouter.delete('/:id', proteger, isAdmin, HotelController.deletarHotel);

// --- Rota de Admin para Upload de Imagem de Capa ---
hoteisRouter.patch(
    '/:id/imagem-de-capa',
    proteger,
    isAdmin,
    upload.single('imagem'),
    HotelController.uploadImagemDeCapa
);

export default hoteisRouter;