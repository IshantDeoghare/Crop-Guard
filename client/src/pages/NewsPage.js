// src/pages/NewsPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Alert } from 'react-bootstrap';
import { getNews } from '../services/api';
import NewsCard from '../components/news/NewsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

function NewsPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            setError('');
            try {
                const newsData = await getNews();
                setArticles(newsData);
            } catch (err) {
                setError('Failed to load news articles. Please try again later.');
                console.error("News fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []); // Empty dependency array means run once on mount

    return (
        <Container>
            <h1 className="my-4"><i className="bi bi-newspaper me-2"></i>Latest Agriculture News</h1>

            {loading && <div className="text-center"><LoadingSpinner /> Fetching news...</div>}
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && articles.length === 0 && (
                <Alert variant="info">No recent agriculture news found.</Alert>
            )}

            {!loading && !error && articles.length > 0 && (
                <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                    {articles.map((article, index) => (
                        // Using URL as key, fallback to index if URL is missing (not ideal)
                        <NewsCard key={article.url || index} article={article} />
                    ))}
                </Row>
            )}
        </Container>
    );
}

export default NewsPage;