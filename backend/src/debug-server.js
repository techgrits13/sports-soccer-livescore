// Debug version of server.js to find where it's hanging
console.log('🔍 [DEBUG] Starting server initialization...');

console.log('🔍 [DEBUG] Step 1: Loading dependencies...');
const express = require('express');
console.log('✓ express loaded');

const cors = require('cors');
console.log('✓ cors loaded');

const helmet = require('helmet');
console.log('✓ helmet loaded');

const compression = require('compression');
console.log('✓ compression loaded');

const morgan = require('morgan');
console.log('✓ morgan loaded');

console.log('🔍 [DEBUG] Step 2: Loading dotenv...');
require('dotenv').config();
console.log('✓ dotenv loaded');

console.log('🔍 [DEBUG] Step 3: Loading logger...');
const logger = require('./config/logger');
console.log('✓ logger loaded');

console.log('🔍 [DEBUG] Step 4: Loading middleware...');
const { 
  errorHandler, 
  notFound, 
  handleUnhandledRejection, 
  handleUncaughtException 
} = require('./middleware/errorHandler');
console.log('✓ errorHandler loaded');

const { apiLimiter, strictLimiter, liveLimiter } = require('./middleware/rateLimiter');
console.log('✓ rateLimiter loaded');

console.log('🔍 [DEBUG] Step 5: Loading routes...');
console.log('  Loading matchRoutes...');
const matchRoutes = require('./routes/matchRoutes');
console.log('✓ matchRoutes loaded');

console.log('  Loading leagueRoutes...');
const leagueRoutes = require('./routes/leagueRoutes');
console.log('✓ leagueRoutes loaded');

console.log('  Loading teamRoutes...');
const teamRoutes = require('./routes/teamRoutes');
console.log('✓ teamRoutes loaded');

console.log('  Loading favoriteRoutes...');
const favoriteRoutes = require('./routes/favoriteRoutes');
console.log('✓ favoriteRoutes loaded');

console.log('  Loading apiRoutes...');
const apiRoutes = require('./routes/apiRoutes');
console.log('✓ apiRoutes loaded');

console.log('🔍 [DEBUG] Step 6: Creating Express app...');
const app = express();
const PORT = process.env.PORT || 3000;
console.log('✓ Express app created');

console.log('🔍 [DEBUG] Step 7: Setting up middleware...');
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log('✓ Middleware configured');

console.log('🔍 [DEBUG] Step 8: Setting up routes...');
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use('/api/matches/live', liveLimiter);
app.use('/api/matches', apiLimiter, matchRoutes);
app.use('/api/leagues', apiLimiter, leagueRoutes);
app.use('/api/teams', apiLimiter, teamRoutes);
app.use('/api/favorites', apiLimiter, favoriteRoutes);
app.use('/api', strictLimiter, apiRoutes);
console.log('✓ Routes configured');

console.log('🔍 [DEBUG] Step 9: Setting up error handlers...');
app.use(notFound);
app.use(errorHandler);
handleUnhandledRejection();
handleUncaughtException();
console.log('✓ Error handlers configured');

console.log('🔍 [DEBUG] Step 10: Starting server...');
const server = app.listen(PORT, () => {
  console.log('✓ Server started successfully!');
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`❤️  Health Check: http://localhost:${PORT}/health`);
});

console.log('🔍 [DEBUG] Server initialization complete!');
