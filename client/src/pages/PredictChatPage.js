// src/pages/PredictChatPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Accordion, Button, Spinner } from 'react-bootstrap';
import PredictionForm from '../components/prediction/PredictionForm';
import PredictionResult from '../components/prediction/PredictionResult';
import ChatInterface from '../components/chat/ChatInterface';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { predictDisease, getPredictionHistory } from '../services/api';
import { format } from 'date-fns';

function PredictChatPage() {
    const [predictionResult, setPredictionResult] = useState(null);
    const [predictionHistory, setPredictionHistory] = useState([]);
    const [imagePreview, setImagePreview] = useState(null); // For displaying uploaded image with result
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState('');

    // Chat context based on the latest prediction
    const [chatContext, setChatContext] = useState({});

    // Fetch history on mount
    useEffect(() => {
        fetchHistory();
    }, []);

    // Update chat context when prediction result changes
    useEffect(() => {
        if (predictionResult && predictionResult.disease) {
             setChatContext({
                 prediction: {
                     plantType: predictionResult.plant,
                     disease: predictionResult.disease,
                     confidence: predictionResult.confidence
                 }
             });
         } else {
             // Clear context if there's no result or an error occurred
             setChatContext({});
         }
    }, [predictionResult]);


    const fetchHistory = async () => {
        setHistoryLoading(true);
        setHistoryError('');
        try {
            const history = await getPredictionHistory();
            setPredictionHistory(history);
        } catch (err) {
            console.error("History fetch error:", err);
            setHistoryError("Failed to load prediction history.");
        } finally {
            setHistoryLoading(false);
        }
    };

    const handlePredictionSubmit = async ({ plantType, imageFile, landSize }) => {
        setIsLoading(true);
        setError('');
        setPredictionResult(null); // Clear previous result
        setImagePreview(URL.createObjectURL(imageFile)); // Create preview URL

        try {
            const result = await predictDisease(plantType, imageFile, landSize);
            setPredictionResult(result);
            fetchHistory(); // Refresh history after successful prediction
        } catch (err) {
            console.error("Prediction error:", err);
            setError(err.response?.data?.message || err.message || "Prediction failed. Please try again.");
            setImagePreview(null); // Clear preview on error
        } finally {
            setIsLoading(false);
             // Revoke the object URL to free up memory after the component updates
             // Using setTimeout to ensure rendering is complete before revoke
             setTimeout(() => {
                 if (imagePreview && imagePreview.startsWith('blob:')) {
                     URL.revokeObjectURL(imagePreview);
                 }
             }, 100);
        }
    };

    // Function to handle clicking a history item to show its result
    const handleHistoryClick = (histItem) => {
        // Reconstruct a result object similar to the API response
         setPredictionResult({
             plant: histItem.plantType,
             disease: histItem.disease,
             confidence: histItem.confidence,
             probabilities: histItem.probabilities,
             suggestion: histItem.suggestion,
             // Note: Image is not stored, so we can't show the original preview
         });
         setImagePreview(null); // Clear image preview when showing history item
         window.scrollTo(0, 0); // Scroll to top to see the result
    };

    return (
        <Container fluid>
            <h1 className="my-4"><i className="bi bi-camera me-2"></i>Predict Disease & Get Advice</h1>

            <Row>
                {/* Prediction Area */}
                <Col lg={7} className="mb-4">
                     <Card className="shadow-sm">
                        <Card.Body>
                            <PredictionForm
                                onSubmit={handlePredictionSubmit}
                                isLoading={isLoading}
                                error={error}
                            />
                            <PredictionResult
                                result={predictionResult}
                                imagePreview={imagePreview} // Pass preview URL
                            />
                        </Card.Body>
                    </Card>

                     {/* History Section */}
                     <Card className="mt-4 shadow-sm">
                         <Card.Header as="h5">
                             <i className="bi bi-clock-history me-2"></i> Prediction History
                             <Button variant="outline-secondary" size="sm" className="float-end" onClick={fetchHistory} disabled={historyLoading}>
                                 {historyLoading ? <Spinner animation="border" size="sm" /> : <i className="bi bi-arrow-clockwise"></i>} Refresh
                             </Button>
                         </Card.Header>
                         <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                             {historyLoading && <LoadingSpinner />}
                             {historyError && <Alert variant="danger">{historyError}</Alert>}
                             {!historyLoading && !historyError && predictionHistory.length === 0 && (
                                 <p>No prediction history found.</p>
                             )}
                             {!historyLoading && !historyError && predictionHistory.length > 0 && (
                                <Accordion flush>
                                     {predictionHistory.map((hist, index) => (
                                         <Accordion.Item eventKey={String(index)} key={hist._id || index}>
                                             <Accordion.Header onClick={(e) => {
                                                  // Prevent default accordion toggle behavior if we want to load result above
                                                  // e.preventDefault(); handleHistoryClick(hist);
                                                  // Or let it toggle and show details inline:
                                             }}>
                                                 <span className="text-capitalize me-2 fw-bold">{hist.plantType} - {hist.disease.replace(/___/g, ' - ').replace(/_/g, ' ')}</span>
                                                 <small className="text-muted ms-auto me-2">({(hist.confidence * 100).toFixed(1)}%)</small>
                                                 <small className="text-muted">{format(new Date(hist.timestamp), 'Pp')}</small>
                                             </Accordion.Header>
                                             <Accordion.Body style={{ cursor: 'pointer' }} onClick={() => handleHistoryClick(hist)} title="Click to show full result above">
                                                  <strong>Suggestion:</strong> {hist.suggestion || 'N/A'}
                                                  <br />
                                                  <Button variant="link" size="sm" className="p-0" onClick={(e) => { e.stopPropagation(); handleHistoryClick(hist); }}>Show Full Result Above</Button>
                                             </Accordion.Body>
                                         </Accordion.Item>
                                     ))}
                                 </Accordion>
                             )}
                         </Card.Body>
                     </Card>

                </Col>

                {/* Chat Area */}
                <Col lg={5}>
                     <Card className="shadow-sm sticky-lg-top" style={{ top: '70px' }}> {/* Make chat sticky */}
                        <Card.Header as="h5">
                            <i className="bi bi-chat-dots me-2"></i> Ask AgriBot for more details
                        </Card.Header>
                        <Card.Body>
                            {predictionResult && predictionResult.disease && (
                                 <Alert variant="info" size="sm">
                                     <small>AgriBot context updated with prediction: <br />
                                     <strong>{predictionResult.plant} - {predictionResult.disease.replace(/___/g, ' - ').replace(/_/g, ' ')}</strong>.</small>
                                 </Alert>
                            )}
                            <ChatInterface initialContext={chatContext} height="500px"/> {/* Adjust height */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default PredictChatPage;