// import { VITE_WEATHER_API} from '../credentials.jsx'

const apiKey = "58f090bbba511c4f6e0a7a431704956a"
export async function weatherApi(city) {
    try{
        const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${encodeURIComponent(city)}&units=m`
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error('Error fetching weather data')
        }
        const data = await response.json()
        if (data.error) {
            throw new Error(data.error.info)
        }

        return data
    }
    catch (error) {
        console.error('Error fetching weather data:', error)
        return { error: true, message: error.message } // Return a consistent structure
    }
}