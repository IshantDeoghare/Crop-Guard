// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import logo from '../assets/img/logo.png'; // Import logo

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false); // Toggle between Login and Signup
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, signup, googleSignIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/"; // Redirect path after login

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isSignup) {
                await signup(email, password);
            } else {
                await login(email, password);
            }
            navigate(from, { replace: true }); // Redirect to intended page or home
        } catch (err) {
            setError(err.message || `Failed to ${isSignup ? 'sign up' : 'log in'}`);
            console.error("Auth Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
         try {
            await googleSignIn();
            navigate(from, { replace: true });
         } catch (err) {
             setError(err.message || "Failed to sign in with Google");
             console.error("Google Sign-In Error:", err);
         } finally {
             setLoading(false);
         }
    };

    const toggleMode = () => {
        setIsSignup(!isSignup);
        setError(''); // Clear error on mode toggle
        setEmail('');
        setPassword('');
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center min-vh-100">
            <Row className="w-100 justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6} xl={4}>
                    <Card className="shadow-lg border-0 rounded-lg">
                        <Card.Body className="p-4 p-sm-5 text-center">
                            <img src={logo} alt="Crop Guard Logo" width="72" className="mb-4" />
                            <h1 className="h3 mb-3 fw-normal">{isSignup ? 'Create Account' : 'Crop Guard Login'}</h1>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3 text-start" controlId="formBasicEmail">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Enter email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3 text-start" controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Password (min 6 chars)"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={isSignup ? 6 : undefined} // Enforce min length for signup
                                        disabled={loading}
                                    />
                                </Form.Group>

                                <Button variant="success" type="submit" className="w-100 mb-2" disabled={loading}>
                                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : (isSignup ? 'Sign Up' : 'Sign In')}
                                </Button>

                                <Button variant="outline-secondary" className="w-100 mb-3" onClick={toggleMode} disabled={loading}>
                                    {isSignup ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                                </Button>

                                 <div className="my-3 text-muted">OR</div>

                                 <Button variant="danger" className="w-100" onClick={handleGoogleSignIn} disabled={loading}>
                                     <i className="bi bi-google me-2"></i>
                                     {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Sign In with Google'}
                                 </Button>
                            </Form>
                            <p className="mt-5 mb-3 text-muted">© {new Date().getFullYear()} Crop Guard</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginPage;