const axios = require('axios');
require('dotenv').config();
const { format, subDays } = require('date-fns'); // Use date-fns for easier date manipulation

const API_KEY = process.env.WEATHERAPI_KEY;
const BASE_URL = "http://api.weatherapi.com/v1";
const LOCATION = "Nagpur"; // Make this configurable or get from user profile?

const getCurrentWeather = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/current.json`, {
            params: { key: API_KEY, q: LOCATION, aqi: "no" }
        });
        const { data } = response;
        const cur = data.current;
        return {
            date: data.location.localtime.split(" ")[0],
            temp_c: cur.temp_c,
            humidity: cur.humidity,
            precip_mm: cur.precip_mm,
            condition: cur.condition.text,
            icon: cur.condition.icon // Include icon URL
        };
    } catch (error) {
        console.error("Error fetching current weather:", error.response ? error.response.data : error.message);
        throw new Error("Could not fetch current weather data");
    }
};

const getHistoricalWeather = async (days = 7) => {
    try {
        const history = {};
        const today = new Date();
        for (let i = 1; i <= days; i++) {
            const targetDate = subDays(today, i);
            const dateString = format(targetDate, "yyyy-MM-dd");

            const response = await axios.get(`${BASE_URL}/history.json`, {
                params: { key: API_KEY, q: LOCATION, dt: dateString }
            });
            const { data } = response;
            const day = data.forecast.forecastday[0].day;
            history[dateString] = {
                maxtemp_c: day.maxtemp_c,
                mintemp_c: day.mintemp_c,
                avgtemp_c: day.avgtemp_c,
                avghumidity: day.avghumidity,
                totalprecip_mm: day.totalprecip_mm,
                condition: day.condition.text,
                icon: day.condition.icon
            };
        }
        return history;
    } catch (error) {
        console.error("Error fetching historical weather:", error.response ? error.response.data : error.message);
        throw new Error("Could not fetch historical weather data");
    }
};

const getForecastWeather = async (daysAhead = 3) => {
    try {
        const response = await axios.get(`${BASE_URL}/forecast.json`, {
            params: { key: API_KEY, q: LOCATION, days: daysAhead + 1, aqi: "no", alerts: "no" }
        });
        const { data } = response;
        const forecast = {};
        data.forecast.forecastday.forEach(entry => {
            const day = entry.day;
            forecast[entry.date] = {
                maxtemp_c: day.maxtemp_c,
                mintemp_c: day.mintemp_c,
                avgtemp_c: day.avgtemp_c,
                avghumidity: day.avghumidity,
                totalprecip_mm: day.totalprecip_mm,
                condition: day.condition.text,
                icon: day.condition.icon
            };
        });
        // Remove today's forecast if it's already covered by current/history logic if needed
         // const todayStr = format(new Date(), "yyyy-MM-dd");
         // if (forecast[todayStr]) delete forecast[todayStr]; // Example if you only want future days
        return forecast;
    } catch (error) {
        console.error("Error fetching forecast weather:", error.response ? error.response.data : error.message);
        throw new Error("Could not fetch forecast weather data");
    }
};

module.exports = {
    getCurrentWeather,
    getHistoricalWeather,
    getForecastWeather,
};