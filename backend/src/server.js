const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const logger = require('./config/logger');
const { 
  errorHandler, 
  notFound, 
  handleUnhandledRejection, 
  handleUncaughtException 
} = require('./middleware/errorHandler');
const { apiLimiter, strictLimiter, liveLimiter } = require('./middleware/rateLimiter');

// Import routes
const matchRoutes = require('./routes/matchRoutes');
const leagueRoutes = require('./routes/leagueRoutes');
const teamRoutes = require('./routes/teamRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const apiRoutes = require('./routes/apiRoutes');
const testRoutes = require('./routes/testRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// app-ads.txt for AdMob verification
app.get('/app-ads.txt', (req, res) => {
  res.type('text/plain').send('google.com, pub-1810197362148301, DIRECT, f08c47fec0942fa0');
});

// API documentation endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Sport Soccer Livescore API',
    version: '1.0.0',
    endpoints: {
      matches: {
        live: 'GET /api/matches/live',
        byDate: 'GET /api/matches?date=YYYY-MM-DD',
        byDateRange: 'GET /api/matches?from=YYYY-MM-DD&to=YYYY-MM-DD',
        details: 'GET /api/matches/:id',
        statistics: 'GET /api/matches/:id/statistics',
        events: 'GET /api/matches/:id/events',
        lineups: 'GET /api/matches/:id/lineups',
        byLeague: 'GET /api/matches/league/:leagueId',
        byTeam: 'GET /api/matches/team/:teamId'
      },
      leagues: {
        all: 'GET /api/leagues',
        popular: 'GET /api/leagues/popular',
        byId: 'GET /api/leagues/:id',
        byCountry: 'GET /api/leagues/country/:country',
        standings: 'GET /api/leagues/:id/standings',
        topScorers: 'GET /api/leagues/:id/topscorers',
        topAssists: 'GET /api/leagues/:id/topassists'
      },
      teams: {
        byId: 'GET /api/teams/:id',
        search: 'GET /api/teams/search?name=',
        statistics: 'GET /api/teams/:id/statistics?league=',
        squad: 'GET /api/teams/:id/squad',
        byLeague: 'GET /api/teams/league/:leagueId'
      },
      favorites: {
        addTeam: 'POST /api/favorites/team',
        addLeague: 'POST /api/favorites/league',
        addMatch: 'POST /api/favorites/match',
        get: 'GET /api/favorites/:userId',
        check: 'GET /api/favorites/:userId/check',
        remove: 'DELETE /api/favorites/:id'
      },
      api: {
        status: 'GET /api/status',
        clearCache: 'POST /api/cache/clear'
      }
    }
  });
});

// API Routes with rate limiting
app.use('/api/matches/live', liveLimiter);
app.use('/api/matches', apiLimiter, matchRoutes);
app.use('/api/leagues', apiLimiter, leagueRoutes);
app.use('/api/teams', apiLimiter, teamRoutes);
app.use('/api/favorites', apiLimiter, favoriteRoutes);
app.use('/api/test', testRoutes); // Test endpoints - no rate limiting
app.use('/api', strictLimiter, apiRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Setup global error handlers
handleUnhandledRejection();
handleUncaughtException();

// Start server
console.log(`\n🚀 Starting server on port ${PORT}...`);
const server = app.listen(PORT, () => {
  console.log(`\n✅ SERVER IS RUNNING!\n`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Docs: http://localhost:${PORT}/`);
  console.log(`❤️  Health: http://localhost:${PORT}/health`);
  console.log(`📊 Status: http://localhost:${PORT}/api/status`);
  console.log(`\n✨ Ready to accept connections!\n`);
  
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`✨ Backend refinements applied successfully`);
});

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info('Received shutdown signal, closing server gracefully...');
  server.close(() => {
    logger.info('✓ HTTP server closed');
    logger.info('✓ Closing database connections...');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Prevent premature exit on Windows
process.stdin.resume();

module.exports = app;
