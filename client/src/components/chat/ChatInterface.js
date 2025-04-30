// src/components/chat/ChatInterface.js
import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, InputGroup, Alert } from 'react-bootstrap';
import { sendMessage } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

// Helper to create unique IDs for messages for React keys
let messageIdCounter = 0;
const getUniqueMessageId = () => messageIdCounter++;

function ChatInterface({ initialContext = {}, height = '450px' }) {
    const [messages, setMessages] = useState([
         { id: getUniqueMessageId(), text: "Hello! How can I help you with your agricultural queries today?", type: 'bot' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const chatboxRef = useRef(null); // To scroll chatbox

    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (chatboxRef.current) {
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault(); // Prevent form submission if event is passed
        const userMessageText = inputMessage.trim();
        if (!userMessageText || isLoading) return;

        setError('');
        setInputMessage(''); // Clear input immediately

        // Add user message to state
        const userMessage = { id: getUniqueMessageId(), text: userMessageText, type: 'user' };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setIsLoading(true);

        // Add temporary thinking message
        const thinkingMessage = { id: getUniqueMessageId(), text: '...', type: 'bot-thinking' };
        setMessages(prevMessages => [...prevMessages, thinkingMessage]);


        try {
             // Combine initialContext with any dynamic context if needed
            const contextToSend = { ...initialContext };
            const response = await sendMessage(userMessageText, contextToSend); // Send message and context

             // Remove thinking message and add bot reply
             setMessages(prevMessages => [
                 ...prevMessages.filter(msg => msg.id !== thinkingMessage.id), // Remove thinking msg
                 { id: getUniqueMessageId(), text: response.reply, type: 'bot' } // Add actual reply
             ]);

        } catch (err) {
            console.error("Chat Error:", err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to get response from AgriBot.";
            setError(errorMessage);
             // Remove thinking message and add error message
             setMessages(prevMessages => [
                ...prevMessages.filter(msg => msg.id !== thinkingMessage.id),
                { id: getUniqueMessageId(), text: `Sorry, I encountered an error: ${errorMessage}`, type: 'bot-error' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column h-100"> {/* Ensure container takes height */}
             <div ref={chatboxRef} className="chatbox mb-3 flex-grow-1" style={{height: height}}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`chat-message ${msg.type}-message`}>
                        {msg.text}
                    </div>
                ))}
                {/* Optional: Show spinner inline while bot is thinking */}
                {/* {isLoading && <div className="bot-thinking-message chat-message">...</div>} */}
            </div>

             {error && <Alert variant="danger" onClose={() => setError('')} dismissible className="mt-2">{error}</Alert>}

             <Form onSubmit={handleSendMessage}>
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Type your message..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        disabled={isLoading}
                        aria-label="Chat message input"
                    />
                    <Button variant="success" type="submit" disabled={isLoading || !inputMessage.trim()}>
                        {isLoading ? <LoadingSpinner size="sm" /> : <i className="bi bi-send-fill"></i>} Send
                    </Button>
                </InputGroup>
            </Form>
        </div>
    );
}

export default ChatInterface;