// src/routes/AppRoutes.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import NewsPage from '../pages/NewsPage';
import WeatherPage from '../pages/WeatherPage';
import PredictChatPage from '../pages/PredictChatPage';
import ChatbotPage from '../pages/ChatbotPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';
function AppRoutes() {
   const { currentUser } = useAuth();

    return (
        <Routes>
            {/* Public Route */}
            <Route path="/login" element={currentUser ? <Navigate to="/" /> : <LoginPage />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/predict" element={<ProtectedRoute><PredictChatPage /></ProtectedRoute>} />
            <Route path="/weather" element={<ProtectedRoute><WeatherPage /></ProtectedRoute>} />
            <Route path="/news" element={<ProtectedRoute><NewsPage /></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />

            {/* Add a 404 Not Found Route or Redirect */}
            <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} replace />} />
        </Routes>
    );
}

export default AppRoutes;