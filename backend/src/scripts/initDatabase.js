const supabase = require('../config/database');
const logger = require('../config/logger');

/**
 * Initialize database tables for the application
 */
async function initDatabase() {
  logger.info('Starting database initialization...');

  try {
    // Note: These SQL commands should be run in Supabase SQL Editor
    // This script is for reference and documentation
    
    const tables = `
    -- Users table (if using custom auth)
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE,
      display_name TEXT,
      avatar_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Favorites table
    CREATE TABLE IF NOT EXISTS favorites (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('team', 'league', 'match')),
      entity_id TEXT NOT NULL,
      entity_name TEXT NOT NULL,
      entity_logo TEXT,
      entity_data JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, type, entity_id)
    );

    -- API Usage tracking table
    CREATE TABLE IF NOT EXISTS api_usage (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      date TEXT UNIQUE NOT NULL,
      api_football_requests INTEGER DEFAULT 0,
      football_data_requests INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Notifications table
    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      data JSONB,
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- User settings table
    CREATE TABLE IF NOT EXISTS user_settings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID UNIQUE NOT NULL,
      theme TEXT DEFAULT 'light',
      notifications_enabled BOOLEAN DEFAULT TRUE,
      match_notifications BOOLEAN DEFAULT TRUE,
      goal_notifications BOOLEAN DEFAULT TRUE,
      card_notifications BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Match cache table (optional - for frequently accessed matches)
    CREATE TABLE IF NOT EXISTS match_cache (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      match_id TEXT UNIQUE NOT NULL,
      match_data JSONB NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
    CREATE INDEX IF NOT EXISTS idx_favorites_type ON favorites(type);
    CREATE INDEX IF NOT EXISTS idx_api_usage_date ON api_usage(date);
    CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
    CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
    CREATE INDEX IF NOT EXISTS idx_match_cache_expires ON match_cache(expires_at);

    -- Enable Row Level Security (RLS)
    ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
    ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
    ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

    -- RLS Policies for favorites
    CREATE POLICY "Users can view their own favorites"
      ON favorites FOR SELECT
      USING (auth.uid()::text = user_id::text);

    CREATE POLICY "Users can insert their own favorites"
      ON favorites FOR INSERT
      WITH CHECK (auth.uid()::text = user_id::text);

    CREATE POLICY "Users can delete their own favorites"
      ON favorites FOR DELETE
      USING (auth.uid()::text = user_id::text);

    -- RLS Policies for notifications
    CREATE POLICY "Users can view their own notifications"
      ON notifications FOR SELECT
      USING (auth.uid()::text = user_id::text);

    CREATE POLICY "Users can update their own notifications"
      ON notifications FOR UPDATE
      USING (auth.uid()::text = user_id::text);

    -- RLS Policies for user_settings
    CREATE POLICY "Users can view their own settings"
      ON user_settings FOR SELECT
      USING (auth.uid()::text = user_id::text);

    CREATE POLICY "Users can update their own settings"
      ON user_settings FOR UPDATE
      USING (auth.uid()::text = user_id::text);

    CREATE POLICY "Users can insert their own settings"
      ON user_settings FOR INSERT
      WITH CHECK (auth.uid()::text = user_id::text);
    `;

    logger.info('Database schema ready. Please run the following SQL in your Supabase SQL Editor:');
    console.log(tables);

    // Test connection
    const { data, error } = await supabase
      .from('api_usage')
      .select('*')
      .limit(1);

    if (error) {
      logger.warn('Could not query api_usage table. Please create tables manually.');
      logger.info('See the SQL schema above.');
    } else {
      logger.info('✅ Database connection successful!');
    }

  } catch (error) {
    logger.error('Database initialization error:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  initDatabase().then(() => {
    logger.info('Database initialization complete.');
    process.exit(0);
  }).catch((error) => {
    logger.error('Database initialization failed:', error);
    process.exit(1);
  });
}

module.exports = initDatabase;
