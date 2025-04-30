// src/components/common/Footer.js
import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
    return (
        <footer className="footer mt-auto py-3 bg-light text-center border-top">
            <Container>
                <span className="text-muted">© {new Date().getFullYear()} Crop Guard. All rights reserved.</span>
            </Container>
        </footer>
    );
}

export default Footer;