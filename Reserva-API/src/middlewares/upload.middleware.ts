import multer from 'multer';
import path from 'path';
import AppError from '../errors/AppError';

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new AppError(`Apenas imagens do tipo JPEG, JPG e PNG são permitidas.`, 400));
    }
});

export default upload;