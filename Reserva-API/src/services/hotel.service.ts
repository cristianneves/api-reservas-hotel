import { HotelModel, findAll, findById, create, update, remove, Hotel } from '../models/hotel.model';
import { ComodidadeModel } from '../models/comodidade.model';
import AppError from '../errors/AppError';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const criar = async (dados: Omit<Hotel, 'id' | 'comodidades'>): Promise<Hotel> => {
    return create(dados);
};

export const listar = async (): Promise<Hotel[]> => {
    return findAll();
};

export const obterPorId = async (id: string): Promise<Hotel> => {
    const hotel = await findById(id);
    if (!hotel) {
      throw new AppError('Hotel não encontrado.', 404);
    }
    return hotel;
};

export const atualizar = async (id: string, dados: Partial<Omit<Hotel, 'id' | 'comodidades'>>): Promise<Hotel> => {
    const hotelAtualizado = await update(id, dados);
    if (!hotelAtualizado) {
        throw new AppError('Hotel não encontrado para atualização.', 404);
    }
    return hotelAtualizado;
};

export const deletar = async (id: string): Promise<void> => {
    const resultado = await remove(id);
    if (resultado === null) {
        throw new AppError('Hotel não encontrado para exclusão.', 404);
    }
};

export const adicionarComodidade = async (hotelId: string, comodidadeId: string): Promise<Hotel> => {
    if (!comodidadeId) {
        throw new AppError('O ID da comodidade é obrigatório.', 400);
    }
    
    const comodidade = await ComodidadeModel.findById(comodidadeId);
    if (!comodidade) {
        throw new AppError('Comodidade não encontrada.', 404);
    }

    const hotelAtualizado = await HotelModel.findByIdAndUpdate(
        hotelId,
        { $addToSet: { comodidades: comodidadeId } },
        { new: true }
    ).populate('comodidades', 'nome');

    if (!hotelAtualizado) {
        throw new AppError('Hotel não encontrado.', 404);
    }
    
    return hotelAtualizado;
};

export const removerComodidade = async (hotelId: string, comodidadeId: string): Promise<Hotel> => {
    const hotelAtualizado = await HotelModel.findByIdAndUpdate(
        hotelId,
        { $pull: { comodidades: comodidadeId } },
        { new: true }
    ).populate('comodidades', 'nome');

    if (!hotelAtualizado) {
        throw new AppError('Hotel não encontrado.', 404);
    }

    return hotelAtualizado;
};

export const salvarImagemDeCapa = async (hotelId: string, file: Express.Multer.File): Promise<Hotel> => {
    const hotel = await findById(hotelId);

    if (!hotel) {
        throw new AppError('Hotel não encontrado.', 404);
    }

    try {
        const resultado = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
            folder: 'hoteis',
            public_id: hotelId,
            overwrite: true,
            resource_type: 'image'
        });

        hotel.imagemDeCapaUrl = resultado.secure_url;
        await hotel.save();

        return hotel;
    } catch (error) {
        console.error("Erro ao fazer upload para o Cloudinary:", error);
        throw new AppError("Falha ao salvar a imagem no serviço de nuvem.", 500);
    }
};