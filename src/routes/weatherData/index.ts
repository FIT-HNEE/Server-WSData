import express from 'express';

import WeatherDataController from '../../controllers/WeatherDataController';

const router = express.Router();

//Routes for Weather Data

router.get("/lastSevenDays", WeatherDataController.lastSevenDaysWeatherData);
router.post("/", WeatherDataController.selectiveWeatherData);

export default router;