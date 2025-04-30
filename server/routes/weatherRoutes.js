const express = require('express');
const { getCurrent, getHistory, getForecast, getAllWeather } = require('../controllers/weatherController');
const router = express.Router();

router.get('/current', getCurrent);
router.get('/history', getHistory); // Optional query param: ?days=N
router.get('/forecast', getForecast); // Optional query param: ?days=N
router.get('/all', getAllWeather); // Gets current, 7day history, 3day forecast

module.exports = router;