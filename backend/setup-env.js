#!/usr/bin/env node

/**
 * Environment Setup Script
 * Helps configure the .env file with API keys
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

console.log('\n🔧 Sport Soccer Livescore - Environment Setup\n');
console.log('This script will help you configure your .env file.\n');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists!');
  rl.question('Do you want to overwrite it? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      setupEnv();
    } else {
      console.log('\n✅ Setup cancelled. Your existing .env file is unchanged.');
      rl.close();
    }
  });
} else {
  setupEnv();
}

function setupEnv() {
  // Read .env.example
  const exampleContent = fs.readFileSync(envExamplePath, 'utf8');
  
  console.log('\n📝 Please provide your API keys:\n');
  
  const questions = [
    {
      key: 'SPORTMONKS_API_KEY',
      question: 'SportMonks API Key (Primary - REQUIRED): ',
      default: 'DEIlvx84BFPHnraxU14OKUAwmneXhTznnxDZl4g21EPIbgpc2ruDeamDCyMD'
    },
    {
      key: 'API_FOOTBALL_KEY',
      question: 'API-Football Key (Secondary - Optional, press Enter to skip): ',
      default: ''
    },
    {
      key: 'FOOTBALL_DATA_KEY',
      question: 'Football-Data.org Key (Tertiary - Optional, press Enter to skip): ',
      default: ''
    }
  ];
  
  let envContent = exampleContent;
  let currentIndex = 0;
  
  function askQuestion() {
    if (currentIndex >= questions.length) {
      // All questions answered, write the file
      fs.writeFileSync(envPath, envContent);
      console.log('\n✅ .env file created successfully!');
      console.log(`\n📍 Location: ${envPath}`);
      console.log('\n🚀 You can now start the backend server with: npm start\n');
      rl.close();
      return;
    }
    
    const q = questions[currentIndex];
    const defaultText = q.default ? ` (default: ${q.default.substring(0, 20)}...)` : '';
    
    rl.question(q.question + defaultText + '\n> ', (answer) => {
      const value = answer.trim() || q.default;
      
      if (value) {
        // Replace placeholder in env content
        const regex = new RegExp(`${q.key}=.*`, 'g');
        envContent = envContent.replace(regex, `${q.key}=${value}`);
      }
      
      currentIndex++;
      askQuestion();
    });
  }
  
  askQuestion();
}
