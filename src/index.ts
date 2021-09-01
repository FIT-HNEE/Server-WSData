import "reflect-metadata";
import 'module-alias/register';
import express, { Application } from 'express';
import morgan from "morgan";
import Routes from './routes';
import { createConnection } from 'typeorm';
import helmet from "helmet";
import cors from "cors";
//import swaggerUi from "swagger-ui-express";
//import swaggerDocument from '../doc/swagger.json'
import dbConfig from './config/ormConfig';
import passport from '@utils/passport/passport';
//import ApiError from "@middlewares/ErrorHandling/ApiError";
//import errorHandler from '@middlewares/ErrorHandling/ErrorHandler';

const PORT = process.env.PORT || 4000;

const app: Application = express();

app.use(express.json());
app.use(passport.initialize())
app.use(passport.session())
app.use(morgan("tiny"));
app.use(express.static("public"));
//app.use(errorHandler)
/* app.use((req,res) => {
  if(!req.route&&!res.headersSent){
    res.status(404).send(new ApiError(404,'This route is not found',true))
  }
}) */
/* app.use(
 '/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)
); */

app.use("/api", Routes);
app.use(cors());
app.use(helmet());

createConnection(dbConfig)
  .then((_connection) => {
    app.listen(PORT, () => {    
      console.log("Server is running on port. 👍", PORT);      
    });    
})
  .catch((err) => {
    console.log("Not Connected to DB 👎 :", err);
    process.exit(1)
})