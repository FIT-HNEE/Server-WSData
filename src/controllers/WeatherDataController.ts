import { Request, Response } from 'express';
import fetch from 'node-fetch';
const { API_KEY_WEATHER_DATA, WEBVIS_DATA_PROVIDER } = process.env

class WeatherDataController {

    static weatherData = async (req: Request, res: Response) => {
        const { StationName, StartDay, EndDay} = req.body
        try {
            let url = `${WEBVIS_DATA_PROVIDER}/api/${API_KEY_WEATHER_DATA}/${StationName}/${StartDay}/${EndDay}`
            
            await fetch(url)
                .then(resp => resp.json())
                .then(data => {
                    res.send(data)
                })
                .catch(err => {                
                    console.log(err)                    
                })
            
        } catch (error) {
            console.log(error);            
        }    
    }   
}

export default WeatherDataController; 