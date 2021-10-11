import express from 'express';

import UserRouter from "./users";

import WeatherDataRoute from './weatherData'

const router = express.Router();


router.use("/users", UserRouter);

router.use("/weatherData", WeatherDataRoute);

export default router;