const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GNEWS_API_KEY;
const URL = "https://gnews.io/api/v4/search";

const getAgricultureNews = async () => {
    try {
        const params = {
            q: "agriculture India OR farming India OR crops India", // Broader query
            lang: "en",
            country: "in",
            token: API_KEY,
            max: 10 // Limit number of articles
        };
        const response = await axios.get(URL, { params });
        // Filter or map results if needed
        const articles = response.data.articles.map(article => ({
             title: article.title,
             description: article.description,
             url: article.url,
             image: article.image,
             publishedAt: article.publishedAt,
             source: article.source.name
        }));
        return articles;
    } catch (error) {
        console.error("Error fetching agriculture news:", error.response ? error.response.data : error.message);
        throw new Error("Could not fetch agriculture news");
    }
};

module.exports = { getAgricultureNews };