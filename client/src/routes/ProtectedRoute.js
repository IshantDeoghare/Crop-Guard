// src/routes/ProtectedRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth();
    let location = useLocation();

    if (loading) {
        // Optional: Show a loading indicator while auth state is resolving
        // You might have a global loading indicator already via AuthContext
        return null; // Or return a specific loading component
    }

    if (!currentUser) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them back after login.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children; // Render the child component if authenticated
}

export default ProtectedRoute;