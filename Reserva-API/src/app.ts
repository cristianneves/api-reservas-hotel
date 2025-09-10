import express from "express";
import cors from "cors";
import routes from "./routes/index";

import { logger } from "./middlewares/logger";
import { errorHandler } from "./middlewares/errorHandler";


import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Configurações do CORS
app.use(cors());

// Middleware global
app.use(logger);

// Middleware para aceitar JSON
app.use(express.json());

// Rotas
app.use("/api", routes);

app.use(errorHandler);


export default app;