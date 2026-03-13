const express = require('express');
const cors = require('cors');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🟢 DRISHTI Disaster API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/disasters', require('./routes/disasterRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/rescue', require('./routes/rescueRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));

// 404 + Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
