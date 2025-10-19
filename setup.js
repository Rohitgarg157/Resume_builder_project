#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Resume Builder Project...\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 14) {
  console.error('❌ Node.js version 14 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from env.example');
  } else {
    console.log('⚠️  Please create a .env file with your database configuration');
  }
} else {
  console.log('✅ .env file already exists');
}

// Create client .env file if it doesn't exist
const clientEnvPath = path.join(__dirname, 'client', '.env');
const clientEnvExamplePath = path.join(__dirname, 'client', 'env.example');

if (!fs.existsSync(clientEnvPath)) {
  if (fs.existsSync(clientEnvExamplePath)) {
    fs.copyFileSync(clientEnvExamplePath, clientEnvPath);
    console.log('✅ Created client .env file from env.example');
  }
} else {
  console.log('✅ Client .env file already exists');
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies:', error.message);
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('npm run install-client', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies:', error.message);
  process.exit(1);
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Set up your MySQL database and import database/schema.sql');
console.log('2. Update your .env file with database credentials');
console.log('3. Start the backend server: npm run dev');
console.log('4. Start the frontend server: npm run client');
console.log('5. Open http://localhost:3000 in your browser');
console.log('\n📖 For detailed instructions, see README.md');
