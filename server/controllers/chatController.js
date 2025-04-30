const { getGroqChatCompletion } = require('../services/chatService');
const { getCurrentWeather, getForecastWeather, getHistoricalWeather } = require('../services/weatherService');

const handleChat = async (req, res) => {
    const { message, context } = req.body; // context might include prediction, landSize etc. from client

    if (!message) {
        return res.status(400).json({ message: "Message is required" });
    }

    try {
        const current = await getCurrentWeather();
        const forecast = await getForecastWeather(3);
        const history = await getHistoricalWeather(7);

        const combinedContext = {
            ...(context || {}), // Include context sent from client (like recent prediction)
            weather: { current, forecast, history }, // Add fresh weather data
        };

        const reply = await getGroqChatCompletion(message, combinedContext);
        res.json({ reply });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { handleChat };