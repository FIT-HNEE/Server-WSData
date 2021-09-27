import "reflect-metadata";
import 'module-alias/register';
import express, { Application } from 'express';
import morgan from "morgan";
import Routes from './routes';
import helmet from "helmet";
import cors from "./middlewares/cors/cors";
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
/* app.use(function (_req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
}); */
/* const corsOptions = {  
    origin:"http://localhost:3000", 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(cors(corsOptions)); */
app.use(cors())
app.use("/api", Routes);

app.use(helmet());


export default app