// src/components/weather/WeatherDisplay.js
import React from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { format } from 'date-fns'; // Import date-fns for formatting

function WeatherDisplay({ weatherData }) {
    if (!weatherData) return null;

    const { current, history, forecast } = weatherData;

    const formatReadableDate = (dateString) => {
         try {
            // Add time part to avoid timezone issues assuming dateString is YYYY-MM-DD
            return format(new Date(dateString + 'T00:00:00'), 'MMM d, yyyy');
         } catch {
             return dateString; // Fallback
         }
    };

    const formatShortWeekday = (dateString) => {
        try {
            return format(new Date(dateString + 'T00:00:00'), 'eee'); // Short weekday name
        } catch {
            return dateString;
        }
    };

    // Sort history keys (dates) newest first
     const sortedHistoryDates = history ? Object.keys(history).sort((a, b) => new Date(b) - new Date(a)) : [];


    return (
        <Row className="g-4">
            {/* Current Weather */}
            {current && (
                <Col lg={4} md={6} className="mb-4">
                    <Card className="h-100 text-center shadow-sm border-primary">
                        <Card.Header>Current Weather ({formatReadableDate(current.date)})</Card.Header>
                        <Card.Body>
                            {current.icon && <Card.Img src={current.icon} alt={current.condition} style={{ width: '64px', marginBottom: '1rem' }} />}
                            <Card.Title className="display-4">{current.temp_c}°C</Card.Title>
                            <Card.Text className="text-capitalize mb-1">{current.condition}</Card.Text>
                            <Card.Text className="mb-1"><i className="bi bi-droplet-half me-1"></i>Humidity: {current.humidity}%</Card.Text>
                            <Card.Text><i className="bi bi-cloud-rain me-1"></i>Precipitation: {current.precip_mm} mm</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            )}

            {/* Forecast */}
            {forecast && Object.keys(forecast).length > 0 && (
                <Col lg={8} md={6} className="mb-4">
                    <Card className="h-100 shadow-sm border-info">
                        <Card.Header>Forecast</Card.Header>
                        <Card.Body>
                            <Row className="text-center">
                                {Object.entries(forecast).map(([date, day], index) => (
                                    // Optionally skip today if shown in current
                                    (current && date === current.date) ? null : (
                                        <Col key={date} xs={6} sm={4} md={4} lg={3} className="mb-3">
                                            <h6 className="mb-1">{formatShortWeekday(date)}</h6>
                                            <small className="text-muted d-block mb-1">{formatReadableDate(date)}</small>
                                            {day.icon && <img src={day.icon} alt={day.condition} width="48" className="mb-1"/>}
                                            <p className="mb-0 small text-capitalize">{day.condition}</p>
                                            <p className="mb-0 fw-bold">{day.avgtemp_c}°C</p>
                                            <p className="mb-0 text-muted small">(Min: {day.mintemp_c}° / Max: {day.maxtemp_c}°)</p>
                                            <p className="mb-0 text-muted small">Humidity: {day.avghumidity}%</p>
                                            <p className="mb-0 text-muted small">Precip: {day.totalprecip_mm} mm</p>
                                        </Col>
                                    )
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            )}

            {/* History */}
            {history && sortedHistoryDates.length > 0 && (
                <Col xs={12} className="mb-4">
                    <Card className="shadow-sm border-secondary">
                        <Card.Header>Past 7 Days Summary</Card.Header>
                        {/* Make table responsive */}
                        <Table responsive striped bordered hover size="sm" className="mb-0">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Condition</th>
                                    <th>Avg Temp (°C)</th>
                                    <th>Max/Min Temp (°C)</th>
                                    <th>Humidity (%)</th>
                                    <th>Precip (mm)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedHistoryDates.map(date => {
                                    const day = history[date];
                                    return (
                                        <tr key={date}>
                                            <td>{formatReadableDate(date)}</td>
                                            <td className="text-capitalize">
                                                {day.icon && <img src={day.icon} alt={day.condition} width="24" className="me-1"/>}
                                                {day.condition}
                                            </td>
                                            <td>{day.avgtemp_c}</td>
                                            <td>{day.maxtemp_c} / {day.mintemp_c}</td>
                                            <td>{day.avghumidity}</td>
                                            <td>{day.totalprecip_mm}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            )}
        </Row>
    );
}

export default WeatherDisplay;