const { createClient } = require('@supabase/supabase-js');
const logger = require('./logger');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Validate Supabase credentials
if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing Supabase credentials in environment variables');
  logger.error('Required: SUPABASE_URL and SUPABASE_KEY');
  process.exit(1);
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  logger.error('Invalid SUPABASE_URL format:', supabaseUrl);
  process.exit(1);
}

// Create Supabase client with options
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  },
  global: {
    headers: {
      'x-application-name': 'sport-soccer-livescore'
    }
  }
});

// Test database connection
const testConnection = async () => {
  try {
    const { error } = await supabase.from('api_usage').select('count', { count: 'exact', head: true });
    if (error) {
      logger.warn('Database connection test warning:', error.message);
      logger.warn('Some features may not work correctly. Please check your Supabase configuration.');
    } else {
      logger.info('✓ Database connection successful');
    }
  } catch (error) {
    logger.error('Database connection test failed:', error.message);
    logger.warn('Application will continue but database features may not work.');
  }
};

// Run connection test asynchronously
testConnection();

module.exports = supabase;
