// Quick script to check if .env file is loaded correctly
require('dotenv').config();

console.log('\n🔍 Checking Environment Variables...\n');

const requiredVars = {
  'SUPABASE_URL': process.env.SUPABASE_URL,
  'SUPABASE_KEY': process.env.SUPABASE_KEY,
  'LIVESCORE_API_KEY': process.env.LIVESCORE_API_KEY,
  'API_FOOTBALL_KEY': process.env.API_FOOTBALL_KEY,
};

const optionalVars = {
  'PORT': process.env.PORT || '3000 (default)',
  'NODE_ENV': process.env.NODE_ENV || 'development (default)',
  'LIVESCORE_API_SECRET': process.env.LIVESCORE_API_SECRET || '(not set)',
  'LIVESCORE_DAILY_LIMIT': process.env.LIVESCORE_DAILY_LIMIT || '10000 (default)',
  'API_FOOTBALL_DAILY_LIMIT': process.env.API_FOOTBALL_DAILY_LIMIT || '100 (default)',
};

let hasErrors = false;

console.log('✅ REQUIRED Variables:');
console.log('─────────────────────────────────────');
for (const [key, value] of Object.entries(requiredVars)) {
  if (!value || value.trim() === '') {
    console.log(`❌ ${key}: MISSING!`);
    hasErrors = true;
  } else {
    // Mask the value for security
    const masked = value.substring(0, 10) + '...' + value.substring(value.length - 10);
    console.log(`✓  ${key}: ${masked}`);
  }
}

console.log('\n📋 OPTIONAL Variables:');
console.log('─────────────────────────────────────');
for (const [key, value] of Object.entries(optionalVars)) {
  console.log(`   ${key}: ${value}`);
}

console.log('\n─────────────────────────────────────\n');

if (hasErrors) {
  console.log('❌ ERROR: Missing required environment variables!');
  console.log('\n💡 Fix:');
  console.log('   1. Make sure backend/.env exists');
  console.log('   2. Copy from .env.new: cp .env.new .env');
  console.log('   3. Or edit .env and add missing values\n');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set!');
  console.log('✅ Your backend should start successfully.\n');
  process.exit(0);
}
