const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to Database
connectDB();

// Initialize Firebase Admin SDK (call the config file)
require('./config/firebaseAdmin');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || '*' // Allow requests from frontend URL
}));
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: false })); // Body parser for URL-encoded data

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/predict', require('./routes/predictionRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Basic Route
app.get('/api', (req, res) => {
    res.send('API is running...');
});

// Serve frontend static files in production (Optional)
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '..', 'client'))); // Serve files from client folder

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'index.html')); // Serve index.html for any other route
  });
} else {
   app.get('/', (req, res) => {
    res.send('API is running in development mode...');
   });
}


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));