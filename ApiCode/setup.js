#!/usr/bin/env node

/**
 * Quick Setup Script for Healthcare API Testing Framework
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Healthcare API Testing Framework - Quick Setup');
console.log('==================================================\n');

const steps = [
  {
    name: 'Installing Dependencies',
    command: 'npm install',
    description: 'Installing Node.js dependencies...'
  },
  {
    name: 'Installing Playwright',
    command: 'npx playwright install',
    description: 'Installing Playwright browsers...'
  }
];

async function runSetup() {
  for (const step of steps) {
    try {
      console.log(`📦 ${step.description}`);
      execSync(step.command, { stdio: 'inherit', cwd: __dirname });
      console.log(`✅ ${step.name} completed successfully!\n`);
    } catch (error) {
      console.error(`❌ ${step.name} failed:`, error.message);
      process.exit(1);
    }
  }

  console.log('🎉 Setup completed successfully!');
  console.log('\n📋 Available Commands:');
  console.log('  npm test                  # Run basic workflow test');
  console.log('  npm run test:enhanced     # Run enhanced workflow test');
  console.log('  npm run test:all          # Run all tests');
  console.log('  npm run test:ui           # Run with Playwright UI');
  console.log('  npm run test:debug        # Run in debug mode');
  console.log('  npm run report            # View test report');
  
  console.log('\n🔧 Framework Structure:');
  console.log('  ApiCode/');
  console.log('  ├── tests/');
  console.log('  │   ├── test-complete-workflow.ts    # Basic 4-step workflow');
  console.log('  │   ├── test-enhanced-workflow.ts    # Enhanced with utilities');
  console.log('  │   └── api-utils.ts                 # Utility functions');
  console.log('  ├── package.json                     # Dependencies');
  console.log('  ├── playwright.config.ts             # Playwright config');
  console.log('  ├── tsconfig.json                   # TypeScript config');
  console.log('  └── README.md                       # Documentation');
  
  console.log('\n🚀 Ready to test! Run: npm test');
}

if (require.main === module) {
  runSetup().catch(console.error);
}

module.exports = { runSetup };
