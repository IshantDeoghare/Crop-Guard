// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppNavbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AppRoutes from './routes/AppRoutes';
import Container from 'react-bootstrap/Container';
import './assets/css/App.css'; // Ensure custom styles are imported

function App() {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100"> {/* Ensure footer sticks to bottom */}
                <AppNavbar />
                <Container fluid className="flex-grow-1 app-container pt-3 pb-5"> {/* Add padding */}
                    <AppRoutes /> {/* Routes will render page content here */}
                </Container>
                <Footer />
            </div>
        </Router>
    );
}

export default App;