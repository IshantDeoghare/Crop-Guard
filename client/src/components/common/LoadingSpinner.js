// src/components/common/LoadingSpinner.js
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

function LoadingSpinner({ fullscreen = false, size = 'md' }) {
    const spinnerStyle = fullscreen ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1050, // Ensure it's on top
    } : {
        display: 'inline-block' // Or 'block' if needed
    };

    return (
        <div style={fullscreen ? spinnerStyle : {}}>
            <Spinner animation="border" role="status" variant="success" size={size === 'sm' ? 'sm' : undefined}>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
}

export default LoadingSpinner;