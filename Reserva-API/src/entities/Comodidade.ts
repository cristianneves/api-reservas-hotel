import { ComodidadeModel } from '../models/comodidade.model';
import AppError from '../errors/AppError';

export type CriarComodidadeDTO = {
    nome: string;
};

export class Comodidade {
    public id: string;
    public nome: string;

    private constructor(props: { id: string, nome: string }) {
        this.id = props.id;
        this.nome = props.nome;
    }

    public static async criar(dados: CriarComodidadeDTO): Promise<Comodidade> {
        const comodidadeDoc = await ComodidadeModel.create(dados);
        return new Comodidade({ id: comodidadeDoc.id, nome: comodidadeDoc.nome });
    }

    public static async buscarTodas(): Promise<Comodidade[]> {
        const comodidadesDocs = await ComodidadeModel.find();
        return comodidadesDocs.map(doc => new Comodidade({ id: doc.id, nome: doc.nome }));
    }
    
    public static async deletar(id: string): Promise<void> {
        const comodidade = await ComodidadeModel.findById(id);
        if (!comodidade) {
            throw new AppError("Comodidade não encontrada para exclusão.", 404);
        }
        await ComodidadeModel.findByIdAndDelete(id);
    }
}