import express, { Application, Router } from 'express';
import morgan from "morgan";
import Routes from './routes';
import swaggerUi from "swagger-ui-express";
import swaggerDocument from '../doc/swagger.json'

const PORT = process.env.PORT || 4000;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

app.use(
 '/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)
);

app.use(Routes);

app.listen(PORT, () => {
    console.log("Server is running on port", PORT)
})