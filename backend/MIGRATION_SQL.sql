-- ========================================
-- Migration Script for Existing Database
-- ========================================
-- This script adds support for new API providers
-- Run this on your existing Supabase database

-- Add new columns to api_usage table for tracking new APIs
ALTER TABLE api_usage 
ADD COLUMN IF NOT EXISTS livescore_requests INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS soccers_requests INTEGER DEFAULT 0;

-- Add comment to document the change
COMMENT ON COLUMN api_usage.livescore_requests IS 'Daily request count for Livescore API (Primary)';
COMMENT ON COLUMN api_usage.soccers_requests IS 'Daily request count for SoccersAPI (Failover)';
COMMENT ON COLUMN api_usage.sportmonks_requests IS 'Legacy column - SportMonks API (deprecated)';

-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'api_usage' 
ORDER BY ordinal_position;
