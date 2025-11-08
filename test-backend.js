/**
 * Backend Connection Test Script
 * Tests the new backend URL: https://sports-soccer-livescore-1-sqg1.onrender.com
 */

const https = require('https');

const BASE_URL = 'https://sports-soccer-livescore-1-sqg1.onrender.com';

// Helper function to make HTTP requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('🧪 Testing Backend Connection...\n');
  console.log('Backend URL:', BASE_URL);
  console.log('═'.repeat(60));

  const tests = [
    { name: 'Health Check', endpoint: '/health' },
    { name: 'API Status', endpoint: '/api/status' },
    { name: 'Live Matches', endpoint: '/api/matches/live' },
    { name: 'Popular Leagues', endpoint: '/api/leagues/popular' },
    { name: 'App-Ads.txt', endpoint: '/app-ads.txt' },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`\n📝 ${test.name}`);
      console.log(`   Endpoint: ${test.endpoint}`);
      
      const result = await makeRequest(BASE_URL + test.endpoint);
      
      if (result.status === 200) {
        console.log(`   ✅ Status: ${result.status} OK`);
        if (typeof result.data === 'object') {
          console.log(`   📦 Response:`, JSON.stringify(result.data, null, 2).substring(0, 200));
        } else {
          console.log(`   📦 Response:`, result.data.substring(0, 100));
        }
        passed++;
      } else {
        console.log(`   ⚠️  Status: ${result.status}`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Total:  ${tests.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Backend is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the backend.');
  }
}

runTests().catch(console.error);
