// src/components/prediction/PredictionForm.js
import React, { useState } from 'react';
import { Form, Button, Row, Col, Image, Alert, Spinner } from 'react-bootstrap';
import placeholderImg from '../../assets/img/placeholder.jpg';

function PredictionForm({ onSubmit, isLoading, error }) {
    const [plantType, setPlantType] = useState('');
    const [landSize, setLandSize] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(placeholderImg);
    const [formError, setFormError] = useState(''); // For local validation

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                 setFormError('File size exceeds 10MB limit.');
                 setImageFile(null);
                 setImagePreview(placeholderImg);
                 e.target.value = null; // Clear the file input
                 return;
             }
             if (!file.type.startsWith('image/')) {
                 setFormError('Invalid file type. Please upload an image.');
                 setImageFile(null);
                 setImagePreview(placeholderImg);
                 e.target.value = null; // Clear the file input
                 return;
             }

            setFormError('');
            setImageFile(file);
            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
             setImageFile(null);
             setImagePreview(placeholderImg);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(''); // Clear previous validation errors
        if (!plantType || !imageFile) {
            setFormError('Please select a plant type and upload an image.');
            return;
        }
        // Pass data up to the parent component
        onSubmit({ plantType, imageFile, landSize });
    };

    return (
        <Form onSubmit={handleSubmit}>
            {/* Display parent error if any */}
             {error && <Alert variant="danger">{error}</Alert>}
             {/* Display local form error */}
             {formError && <Alert variant="danger">{formError}</Alert>}

            <Row className="g-3 align-items-center">
                <Col md={4} className="text-center">
                    <Image
                        src={imagePreview}
                        alt="Image Preview"
                        fluid
                        thumbnail
                        className="mb-2 prediction-image"
                        style={{ maxHeight: '250px', objectFit: 'contain'}}
                     />
                     <Form.Group controlId="imageFile" className="mb-3">
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                            disabled={isLoading}
                        />
                     </Form.Group>
                </Col>
                <Col md={8}>
                     <Form.Group controlId="plantType" className="mb-3">
                        <Form.Label>Select Plant Type</Form.Label>
                        <Form.Select
                            aria-label="Select Plant Type"
                            value={plantType}
                            onChange={(e) => setPlantType(e.target.value)}
                            required
                            disabled={isLoading}
                        >
                            <option value="" disabled>-- Choose Plant --</option>
                            <option value="potato">Potato</option>
                            <option value="tomato">Tomato</option>
                            <option value="pepper">Pepper (Bell)</option>
                        </Form.Select>
                    </Form.Group>

                     <Form.Group controlId="landSize" className="mb-3">
                        <Form.Label>Land Size (Acres, Optional)</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.1"
                            placeholder="e.g., 2.5"
                            value={landSize}
                            onChange={(e) => setLandSize(e.target.value)}
                            disabled={isLoading}
                        />
                        <Form.Text className="text-muted">
                            Helps generate more relevant suggestions.
                        </Form.Text>
                    </Form.Group>

                    <Button variant="success" type="submit" disabled={isLoading || !plantType || !imageFile}>
                        {isLoading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> Predicting...
                            </>
                        ): (
                            <><i className="bi bi-magic me-2"></i>Predict Disease</>
                        )}
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}

export default PredictionForm;