import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { registrarUsuarioSchema, loginSchema } from '../middlewares/schemas/auth.schema';
import { validateBody } from '../middlewares/validator';

const authRouter = Router();

authRouter.post('/registrar', validateBody(registrarUsuarioSchema), AuthController.registrarController);
authRouter.post('/login', validateBody(loginSchema), AuthController.loginController);

export default authRouter;