// src/pages/ChatbotPage.js
import React from 'react';
import { Container, Card } from 'react-bootstrap';
import ChatInterface from '../components/chat/ChatInterface';

function ChatbotPage() {
    return (
        <Container>
            <h1 className="my-4"><i className="bi bi-robot me-2"></i>AgriBot Assistant</h1>
            <p className="lead mb-4">Ask me anything about Indian agriculture, farming techniques, weather effects, or general crop advice!</p>

            <Card className="shadow-sm">
                 <Card.Header as="h5">Chat with AgriBot</Card.Header>
                <Card.Body>
                    {/* Use ChatInterface without specific prediction context */}
                    <ChatInterface height="60vh"/> {/* Adjust height as needed */}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default ChatbotPage;