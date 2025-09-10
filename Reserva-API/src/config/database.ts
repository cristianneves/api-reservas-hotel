import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error("MONGO_URI não foi definida no arquivo .env");
        }
        await mongoose.connect(mongoURI);
        console.log("MongoDB conectado com sucesso.");
    } catch (error) {
        console.error("Erro ao conectar com o MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;