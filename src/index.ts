import "reflect-metadata";
import express, { Application, Router } from 'express';
import morgan from "morgan";
import Routes from './routes';
import { createConnection } from 'typeorm';
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from '../doc/swagger.json'
import dbConfig from './config/ormConfig';

const PORT = process.env.PORT || 4000;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

app.use(
 '/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)
);

app.use(Routes);
app.use(cors());
app.use(helmet());

createConnection(dbConfig)
  .then((_connection) => {
    app.listen(PORT, () => {    
      console.log("Server is running on port", PORT);      
    });    
})
  .catch((err) => {
    console.log("Not Connected to DB", err);
    process.exit(1)
})