// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // <-- Add this line
import './assets/css/App.css'; // Your custom styles (optional)
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();