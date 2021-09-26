import "reflect-metadata";
import 'module-alias/register';
import express, { Application } from 'express';
import morgan from "morgan";
import Routes from './routes';
import helmet from "helmet";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from './doc/swagger.json'
import passport from './utils/passport/passport';
//import ApiError from "@middlewares/ErrorHandling/ApiError";
//import errorHandler from '@middlewares/ErrorHandling/ErrorHandler';


const app: Application = express();

app.use(express.json());
app.use(passport.initialize())
app.use(passport.session())
app.use(morgan("tiny"));
app.use(express.static("public"));
//app.use(errorHandler)

/* app.use((req: Request, res: Response) => {
  if (!req.route && !res.headersSent) {
    res.status(404).send(new ApiError(404, 'This route is not found', true));
  }
}); */
app.use(
 '/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)
);

app.use("/api", Routes);
app.use(cors());
app.use(helmet());


export default app