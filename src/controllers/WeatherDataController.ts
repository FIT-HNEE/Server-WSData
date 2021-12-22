import { Request, Response } from 'express';
import fetch from 'node-fetch';
const { API_KEY_WEATHER_DATA, WEBVIS_DATA_PROVIDER, APP_URL } = process.env
import moment from 'moment'
class WeatherDataController {

    static selectiveWeatherData = async (req: Request, res: Response) => {
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
    
    static lastSevenDaysWeatherData = async (_req: Request, res: Response) => {
        
        const StationName = 'Buche'
        const currentDate = new Date()
        const EndDate = moment(currentDate).format('YYYY-MM-DD')
        const LastSevenDays = moment(currentDate).subtract(6, 'days').toDate();
        const StartDate = moment(LastSevenDays).format('YYYY-MM-DD')
        
        try {
            let url = `${WEBVIS_DATA_PROVIDER}/api/${API_KEY_WEATHER_DATA}/${StationName}/${StartDate}/${EndDate}`
            
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

    static weatherDataForecast = async (_req: Request, res: Response) => {
       let array = []         
         
        try {
           
            
            await fetch(APP_URL)
                .then(resp => resp.json())
                .then(data => {
                    array.push(data)
                })
                .catch(err => {                
                    console.log(err)                    
                })
            await res.send(array)
        } catch (error) {
            console.log(error);            
        }    
    }
}

export default WeatherDataController; 