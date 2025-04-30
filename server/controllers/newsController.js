const { getAgricultureNews } = require('../services/newsService');

const getNews = async (req, res) => {
    try {
        const news = await getAgricultureNews();
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getNews };