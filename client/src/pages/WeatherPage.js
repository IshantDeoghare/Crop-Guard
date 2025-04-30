// src/pages/WeatherPage.js
import React, { useState, useEffect } from 'react';
import { Container, Alert } from 'react-bootstrap';
import { getWeatherAll } from '../services/api';
import WeatherDisplay from '../components/weather/WeatherDisplay';
import LoadingSpinner from '../components/common/LoadingSpinner';

function WeatherPage() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getWeatherAll();
                setWeatherData(data);
            } catch (err) {
                setError('Failed to load weather data. Please try again later.');
                console.error("Weather fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []); // Fetch on mount

    return (
        <Container>
            <h1 className="my-4"><i className="bi bi-cloud-sun me-2"></i>Weather Information (Nagpur)</h1>

            {loading && <div className="text-center"><LoadingSpinner /> Fetching weather data...</div>}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && !weatherData && (
                <Alert variant="warning">Could not retrieve weather data.</Alert>
            )}

            {!loading && !error && weatherData && (
                <WeatherDisplay weatherData={weatherData} />
            )}
        </Container>
    );
}

export default WeatherPage;