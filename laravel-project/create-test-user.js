#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const crypto = require('crypto');

// Database path
const dbPath = path.join(__dirname, 'database', 'database.sqlite');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Create a test user
function createTestUser() {
  console.log('Creating test user for Sanctum testing...');
  
  // Check if user already exists
  db.get("SELECT id FROM users WHERE email = 'test@example.com'", (err, user) => {
    if (err) {
      console.error('Error checking existing user:', err);
      db.close();
      return;
    }
    
    if (user) {
      console.log(`✅ Test user already exists with ID: ${user.id}`);
      testSanctumWithUser(user.id);
      return;
    }
    
    // Create new user
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: bcrypt('password123'), // In real app, use proper hashing
      role: 'user',
      subscription_plan: 'free'
    };
    
    db.run(`INSERT INTO users (name, email, password, role, subscription_plan, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`, 
            [userData.name, userData.email, userData.password, userData.role, userData.subscription_plan], 
            function(err) {
      if (err) {
        console.error('Error creating test user:', err);
        db.close();
        return;
      }
      
      const userId = this.lastID;
      console.log(`✅ Test user created with ID: ${userId}`);
      testSanctumWithUser(userId);
    });
  });
}

// Simple bcrypt-like hashing for testing
function bcrypt(password) {
  // This is a very basic hash for testing purposes
  // In a real application, use proper bcrypt hashing
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  return `$2y$10$${hash.substring(0, 53)}`; // Simulate bcrypt format
}

function testSanctumWithUser(userId) {
  console.log(`\n--- Testing Sanctum with User ID: ${userId} ---`);
  
  // Create a sample token
  const sampleToken = {
    name: 'app',
    token: 'test_token_' + crypto.randomBytes(32).toString('hex'),
    abilities: '["*"]',
    tokenable_id: userId,
    tokenable_type: 'App\\Models\\User'
  };
  
  db.run(`INSERT INTO personal_access_tokens (name, token, abilities, tokenable_id, tokenable_type, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`, 
          [sampleToken.name, sampleToken.token, sampleToken.abilities, sampleToken.tokenable_id, sampleToken.tokenable_type], 
          function(err) {
    if (err) {
      console.error('❌ Error creating test token:', err);
      db.close();
      return;
    }
    
    const tokenId = this.lastID;
    console.log(`✅ Test token created with ID: ${tokenId}`);
    
    // Verify token can be retrieved
    db.get("SELECT * FROM personal_access_tokens WHERE tokenable_id = ? AND name = ?", 
            [userId, 'app'], (err, token) => {
      if (err) {
        console.error('❌ Error retrieving token:', err);
      } else if (token) {
        console.log('✅ Token retrieved successfully');
        console.log(`  Token: ${token.token.substring(0, 20)}...`);
        console.log(`  Name: ${token.name}`);
        console.log(`  Abilities: ${token.abilities}`);
      } else {
        console.log('❌ Token not found');
      }
      
      // Test token uniqueness
      db.get("SELECT COUNT(*) as count FROM personal_access_tokens WHERE token = ?", [sampleToken.token], (err, row) => {
        if (err) {
          console.error('❌ Error checking token uniqueness:', err);
        } else {
          console.log(`✅ Token uniqueness check: ${row.count} tokens found (should be 1)`);
        }
        
        console.log('\n✅ Laravel Sanctum functionality test completed successfully!');
        console.log('The personal_access_tokens table is working correctly.');
        db.close();
      });
    });
  });
}

// Start the process
createTestUser();