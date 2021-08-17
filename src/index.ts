import express, { Application, Router } from 'express';
import morgan from "morgan";
import Routes from './routes/index';

const PORT = process.env.PORT || 4000;

const app: Application = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));

app.use(Routes);

app.listen(PORT, () => {
    console.log("Server is running on port", PORT)
})