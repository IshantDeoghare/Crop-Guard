const { getCurrentWeather, getHistoricalWeather, getForecastWeather } = require('../services/weatherService');

const getCurrent = async (req, res) => {
    try {
        const weather = await getCurrentWeather();
        res.json(weather);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getHistory = async (req, res) => {
    try {
         const days = req.query.days ? parseInt(req.query.days) : 7;
         const weather = await getHistoricalWeather(days);
        res.json(weather);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getForecast = async (req, res) => {
    try {
        const days = req.query.days ? parseInt(req.query.days) : 3;
        const weather = await getForecastWeather(days);
        res.json(weather);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

 const getAllWeather = async (req, res) => {
    try {
        const [current, history, forecast] = await Promise.all([
            getCurrentWeather(),
            getHistoricalWeather(7), // Past 7 days
            getForecastWeather(3)  // Next 3 days
        ]);
        res.json({ current, history, forecast });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { getCurrent, getHistory, getForecast, getAllWeather };