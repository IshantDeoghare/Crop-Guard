// src/components/news/NewsCard.js
import React from 'react';
import { Card, Button, Col } from 'react-bootstrap';
import placeholderImg from '../../assets/img/placeholder.jpg'; // Import placeholder
import { formatDistanceToNow } from 'date-fns'; // For relative time

function NewsCard({ article }) {
    const handleImageError = (e) => {
        e.target.onerror = null; // prevent infinite loop
        e.target.src = placeholderImg;
    };

    const timeAgo = article.publishedAt
        ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
        : 'Unknown date';

    return (
        <Col>
            <Card className="h-100 shadow-sm news-card">
                <Card.Img
                    variant="top"
                    src={article.image || placeholderImg}
                    alt={article.title}
                    className="news-card-img"
                    onError={handleImageError}
                />
                <Card.Body className="d-flex flex-column">
                    <Card.Title className="h6">{article.title}</Card.Title>
                    <Card.Text style={{ fontSize: '0.9rem', flexGrow: 1 }}>
                        {article.description || 'No description available.'}
                    </Card.Text>
                    <Card.Text>
                        <small className="text-muted">
                            {article.source} - {timeAgo}
                        </small>
                    </Card.Text>
                    <Button
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline-success"
                        size="sm"
                        className="mt-auto align-self-start" // Align button bottom-left
                    >
                        Read More <i className="bi bi-box-arrow-up-right ms-1"></i>
                    </Button>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default NewsCard;