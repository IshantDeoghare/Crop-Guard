// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Create an Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add the auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Get token from storage
        if (token && config.headers) {
            // Only add header if it exists and headers object is present
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // Don't set Content-Type for FormData uploads, Axios handles it
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle 401 Unauthorized errors (e.g., token expired)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token might be invalid or expired
            console.error("API Error 401: Unauthorized. Token may be invalid.");
            // Optional: Trigger logout or token refresh logic here
            // For simplicity, we'll just let the error propagate for now
            // Example: window.location.href = '/login'; // Force logout
        }
        return Promise.reject(error);
    }
);


// --- API Call Functions ---

// Auth
// Note: Login/Signup use Firebase directly, getMe verifies token with backend
export const getMyProfile = async (/* Optional: pass token if not using interceptor reliably */) => {
     // Interceptor handles token automatically now
    const response = await api.get('/auth/me');
    return response.data;
};

// Prediction
export const predictDisease = async (plantType, imageFile, landSize) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    if (landSize) {
        formData.append('landSize', landSize);
    }
    // Axios handles FormData Content-Type
    const response = await api.post(`/predict/${plantType}`, formData);
    return response.data;
};

export const getPredictionHistory = async () => {
    const response = await api.get('/predict/history');
    return response.data;
};

// Weather (Assuming public, but using api instance for consistency)
export const getWeatherAll = async () => {
    const response = await api.get('/weather/all'); // No token needed if public
    return response.data;
};

// News (Assuming public)
export const getNews = async () => {
    const response = await api.get('/news'); // No token needed if public
    return response.data;
};

// Chat
export const sendMessage = async (message, context = {}) => {
    const response = await api.post('/chat', { message, context });
    return response.data; // Should contain { reply: "..." }
};

export default api; // Export the configured instance if needed elsewhere