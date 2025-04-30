// src/components/prediction/PredictionResult.js
import React from 'react';
import { Card, ListGroup, Badge, Row, Col, Image } from 'react-bootstrap';

function PredictionResult({ result, imagePreview }) {
    if (!result) return null;

    // Function to format disease names nicely
    const formatDiseaseName = (name) => {
        return name.replace(/___/g, ' - ').replace(/_/g, ' ');
    };

    return (
         <Row className="mt-4 g-4">
            {/* Image stays on the side */}
             <Col md={4} className="text-center">
                 {imagePreview && (
                     <Image
                        src={imagePreview}
                        alt="Uploaded Leaf"
                        fluid
                        thumbnail
                        className="prediction-image"
                      />
                 )}
             </Col>

             {/* Results and Suggestion */}
             <Col md={8}>
                 <Card className="shadow-sm border-success">
                     <Card.Header as="h5">Prediction Result</Card.Header>
                     <Card.Body>
                         <Card.Text>
                             <strong>Plant:</strong> <span className="text-capitalize">{result.plant?.replace('_bell', ' (Bell)') || 'N/A'}</span><br />
                             <strong>Predicted Condition:</strong> <span className="fw-bold text-primary">{formatDiseaseName(result.disease || 'N/A')}</span><br />
                             <strong>Confidence:</strong> <Badge bg="primary" pill>{(result.confidence * 100).toFixed(2)}%</Badge>
                         </Card.Text>

                         <h6 className="mt-3">Probabilities:</h6>
                         <ListGroup variant="flush">
                            {result.probabilities && Object.entries(result.probabilities)
                                .sort(([,a],[,b]) => b-a) // Sort by probability descending
                                .map(([disease, prob]) => (
                                <ListGroup.Item key={disease} className="d-flex justify-content-between align-items-center px-0 py-1">
                                    {formatDiseaseName(disease)}
                                    <Badge bg={disease === result.disease ? "success" : "secondary"} pill>
                                        {(prob * 100).toFixed(1)}%
                                    </Badge>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                     </Card.Body>
                 </Card>

                  {/* Suggestion Card */}
                  {result.suggestion && (
                     <Card className="mt-3 shadow-sm border-info">
                         <Card.Header><i className="bi bi-lightbulb me-2"></i>Suggested Actions (from AgriBot)</Card.Header>
                         <Card.Body>
                             {/* Use pre-wrap to preserve line breaks from the backend */}
                             <p className="card-text" style={{ whiteSpace: 'pre-wrap' }}>
                                 {result.suggestion}
                             </p>
                         </Card.Body>
                     </Card>
                 )}
             </Col>
         </Row>
    );
}

export default PredictionResult;