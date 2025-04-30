// src/pages/HomePage.js
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
function HomePage() {
    const { userProfile, currentUser } = useAuth();
    const displayName = userProfile?.name || currentUser?.email || 'there';

    return (
        <Container>
            <h1 className="my-4">Welcome, {displayName}!</h1>
            <p className="lead mb-4">Your digital assistant for healthier crops. What would you like to do today?</p>

            <Row xs={1} md={2} lg={3} className="g-4">
                <Col>
                    <Card className="text-center h-100 shadow-sm border-success">
                        <Card.Body className="d-flex flex-column">
                            <i className="bi bi-camera home-card-icon"></i>
                            <Card.Title>Predict Disease & Chat</Card.Title>
                            <Card.Text>
                                Upload a plant leaf image to identify diseases and get AI-powered advice.
                            </Card.Text>
                            <Button as={Link} to="/predict" variant="success" className="mt-auto">Go to Predictor</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="text-center h-100 shadow-sm border-info">
                        <Card.Body className="d-flex flex-column">
                            <i className="bi bi-cloud-sun home-card-icon text-info"></i>
                            <Card.Title>Weather Info</Card.Title>
                            <Card.Text>
                                Check current, past, and future weather conditions for Nagpur.
                            </Card.Text>
                            <Button as={Link} to="/weather" variant="info" className="mt-auto text-white">View Weather</Button>
                        </Card.Body>
                    </Card>
                </Col>
                 <Col>
                    <Card className="text-center h-100 shadow-sm border-warning">
                        <Card.Body className="d-flex flex-column">
                            <i className="bi bi-newspaper home-card-icon text-warning"></i>
                            <Card.Title>Agriculture News</Card.Title>
                            <Card.Text>
                                Stay updated with the latest farming and agriculture news from India.
                            </Card.Text>
                            <Button as={Link} to="/news" variant="warning" className="mt-auto text-dark">Read News</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card className="text-center h-100 shadow-sm border-primary">
                        <Card.Body className="d-flex flex-column">
                            <i className="bi bi-robot home-card-icon text-primary"></i>
                            <Card.Title>Ask AgriBot</Card.Title>
                            <Card.Text>
                                Have specific questions? Chat directly with our agricultural AI assistant.
                            </Card.Text>
                            <Button as={Link} to="/chatbot" variant="primary" className="mt-auto">Chat Now</Button>
                        </Card.Body>
                    </Card>
                </Col>
                {/* Add more cards/features as needed */}
            </Row>
        </Container>
    );
}

export default HomePage;