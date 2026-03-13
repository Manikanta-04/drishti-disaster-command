const express = require('express');
const cors = require('cors');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// ✅ FIX: Allow multiple origins including Vercel
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://drishti-disaster-command.vercel.app',
  'https://drishti-command.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
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
app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/disasters', require('./routes/disasterRoutes'));
app.use('/api/alerts',    require('./routes/alertRoutes'));
app.use('/api/rescue',    require('./routes/rescueRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));

// 404 + Error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;