// src/components/common/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/img/logo.png'; // Import logo

function AppNavbar() {
    const { currentUser, userProfile, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login'); // Redirect to login after logout
        } catch (error) {
            console.error("Failed to log out:", error);
            alert("Failed to log out. Please try again.");
        }
    };

    return (
        <Navbar bg="success" variant="dark" expand="lg" fixed="top" className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/">
                     <img
                       alt="Crop Guard Logo"
                       src={logo}
                       width="30"
                       height="30"
                       className="d-inline-block align-top me-2"
                     />
                    Crop Guard
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {currentUser && ( // Show links only if logged in
                            <>
                                <Nav.Link as={Link} to="/">Home</Nav.Link>
                                <Nav.Link as={Link} to="/predict">Predict & Chat</Nav.Link>
                                <Nav.Link as={Link} to="/weather">Weather</Nav.Link>
                                <Nav.Link as={Link} to="/news">News</Nav.Link>
                                <Nav.Link as={Link} to="/chatbot">AgriBot</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {currentUser ? (
                            <NavDropdown title={userProfile?.email || currentUser.email || 'Account'} id="basic-nav-dropdown" align="end">
                                {/* Add profile link later if needed */}
                                {/* <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item> */}
                                {/* <NavDropdown.Divider /> */}
                                <NavDropdown.Item onClick={handleLogout}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;