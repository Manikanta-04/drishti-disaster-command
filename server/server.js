require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Make io accessible in controllers via app
app.set('io', io);

// Socket.io connection handler
io.on('connection', (socket) => {
  logger.info(`🔌 Client connected: ${socket.id}`);

  // Join room by location/role
  socket.on('join:room', (room) => {
    socket.join(room);
    logger.info(`Socket ${socket.id} joined room: ${room}`);
  });

  // Team location update
  socket.on('team:location', (data) => {
    io.emit('team:location:update', data);
  });

  socket.on('disconnect', () => {
    logger.info(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Start server
const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    logger.info(`🚀 DRISHTI Disaster Server running on port ${PORT}`);
    logger.info(`📡 API Base URL : http://localhost:${PORT}/api`);
    logger.info(`🔋 Health Check : http://localhost:${PORT}/api/health`);
    logger.info(`🌍 Environment  : ${process.env.NODE_ENV}`);
    logger.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });
};

startServer();
