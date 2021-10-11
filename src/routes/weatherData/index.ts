import express from 'express';

import WeatherDataController from '../../controllers/WeatherDataController';

const router = express.Router();

//Routes for Weather Data

router.post("/", WeatherDataController.weatherData);

export default router;