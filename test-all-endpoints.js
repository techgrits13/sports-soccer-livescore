/**
 * Comprehensive Backend Endpoint Test
 */

const https = require('https');

const BASE_URL = 'https://sports-soccer-livescore-1-sqg1.onrender.com';

function makeRequest(path, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const req = https.get(BASE_URL + path, { timeout }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const duration = Date.now() - startTime;
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
            duration,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            duration
          });
        }
      });
    });

    req.on('error', (err) => reject({ error: err.message, duration: Date.now() - startTime }));
    req.on('timeout', () => {
      req.destroy();
      reject({ error: 'Request timeout', duration: Date.now() - startTime });
    });
  });
}

async function testEndpoint(name, path) {
  process.stdout.write(`\n📝 ${name}... `);
  try {
    const result = await makeRequest(path);
    if (result.status === 200) {
      console.log(`✅ OK (${result.duration}ms)`);
      if (result.data.count !== undefined) {
        console.log(`   Data: ${result.data.count} items`);
      }
      return true;
    } else {
      console.log(`⚠️  Status: ${result.status}`);
      return false;
    }
  } catch (err) {
    console.log(`❌ ${err.error} (${err.duration}ms)`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing All Backend Endpoints\n');
  console.log('URL:', BASE_URL);
  console.log('═'.repeat(60));

  const tests = [
    { name: 'Health Check', path: '/health' },
    { name: 'API Status', path: '/api/status' },
    { name: 'Matches (Today)', path: '/api/matches' },
    { name: 'Live Matches', path: '/api/matches/live' },
    { name: 'Popular Leagues', path: '/api/leagues/popular' },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const success = await testEndpoint(test.name, test.path);
    if (success) passed++;
    else failed++;
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`\n📊 Test Results:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Total:  ${tests.length}`);
  
  if (failed === 0) {
    console.log('\n🎉 All endpoints working!');
  } else {
    console.log('\n⚠️  Some endpoints failed. Backend might be under load or timing out.');
    console.log('💡 Tip: Render free tier can be slow on first request.');
  }
}

runTests().catch(console.error);
