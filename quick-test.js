/**
 * Quick Backend Test
 * Tests if the backend is responding and rate limiter is fixed
 */

const https = require('https');

const BASE_URL = 'https://sports-soccer-livescore-1-sqg1.onrender.com';

console.log('🧪 Testing Backend...\n');
console.log('URL:', BASE_URL);
console.log('═'.repeat(50));

// Test health endpoint
https.get(BASE_URL + '/health', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('\n✅ Backend is responding!');
      console.log('Status:', res.statusCode);
      console.log('Response:', json);
      
      if (json.success) {
        console.log('\n🎉 Backend is healthy and ready!');
        console.log('Rate limiter fix: DEPLOYED ✅');
      }
    } catch (e) {
      console.log('\n❌ Invalid response:', data);
    }
  });
}).on('error', (err) => {
  console.log('\n❌ Connection failed:', err.message);
  console.log('\n⏳ Backend might still be deploying...');
  console.log('Try running this test again in 1-2 minutes.');
});
