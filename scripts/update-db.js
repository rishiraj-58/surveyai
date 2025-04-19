#!/usr/bin/env node

/**
 * This script is used to push the Prisma schema to the database
 * without creating migrations, suitable for production environments
 * where we don't need to track schema changes through migration files.
 */

const { execSync } = require('child_process');

console.log('Applying Prisma schema to the database...');

try {
  // Generate Prisma client first
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push the schema directly to the database
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('Database schema updated successfully!');
} catch (error) {
  console.error('Error updating database schema:', error);
  process.exit(1);
} 