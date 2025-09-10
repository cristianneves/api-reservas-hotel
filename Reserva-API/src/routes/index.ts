import { Router } from "express";
import reservaRouter from "./reserva.routes";
import hoteisRouter from "./hotel.routes";
import quartoRouter from "./quarto.routes";
import authRouter from "./auth.routes";
import comodidadeRouter from "./comodidade.routes";
import avaliacaoRouter from "./avaliacao.routes";

const routes = Router();

routes.use("/reservas", reservaRouter);
routes.use("/hoteis", hoteisRouter);
routes.use("/quartos", quartoRouter); 
routes.use("/auth", authRouter);
routes.use("/comodidades", comodidadeRouter);
routes.use("/avaliacoes", avaliacaoRouter);

export default routes;