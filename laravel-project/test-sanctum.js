#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

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

// Test Laravel Sanctum functionality
function testSanctum() {
  console.log('Testing Laravel Sanctum functionality...\n');
  
  // Check if personal_access_tokens table exists
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='personal_access_tokens'", (err, row) => {
    if (err) {
      console.error('Error checking table existence:', err);
      db.close();
      return;
    }
    
    if (!row) {
      console.log('❌ personal_access_tokens table does not exist');
      db.close();
      return;
    }
    
    console.log('✅ personal_access_tokens table exists');
    
    // Check table structure
    db.all("PRAGMA table_info(personal_access_tokens)", (err, columns) => {
      if (err) {
        console.error('Error getting table info:', err);
        db.close();
        return;
      }
      
      console.log('\nTable structure:');
      const expectedColumns = ['id', 'name', 'token', 'abilities', 'expires_at', 'tokenable_id', 'tokenable_type', 'created_at', 'updated_at'];
      let allColumnsExist = true;
      
      columns.forEach(col => {
        console.log(`  ${col.name} (${col.type})`);
        if (!expectedColumns.includes(col.name)) {
          allColumnsExist = false;
        }
      });
      
      expectedColumns.forEach(col => {
        if (!columns.some(c => c.name === col)) {
          console.log(`  ❌ Missing column: ${col}`);
          allColumnsExist = false;
        }
      });
      
      if (allColumnsExist) {
        console.log('✅ All required columns exist');
      } else {
        console.log('❌ Some columns are missing');
      }
      
      // Check indexes
      db.all("PRAGMA index_list(personal_access_tokens)", (err, indexes) => {
        if (err) {
          console.error('Error getting indexes:', err);
          db.close();
          return;
        }
        
        console.log('\nIndexes:');
        const expectedIndexes = ['personal_access_tokens_token_index', 'personal_access_tokens_tokenable_type_index', 'personal_access_tokens_tokenable_id_index'];
        indexes.forEach(idx => {
          console.log(`  ${idx.name} (${idx.unique ? 'UNIQUE' : 'NON-UNIQUE'})`);
        });
        
        expectedIndexes.forEach(idx => {
          if (!indexes.some(i => i.name === idx)) {
            console.log(`  ❌ Missing index: ${idx}`);
          }
        });
        
        // Test token creation simulation
        testTokenCreation();
      });
    });
  });
}

function testTokenCreation() {
  console.log('\n--- Testing Token Creation Simulation ---');
  
  // Check if we have any users
  db.get("SELECT id, name, email FROM users LIMIT 1", (err, user) => {
    if (err) {
      console.error('Error getting user:', err);
      db.close();
      return;
    }
    
    if (!user) {
      console.log('❌ No users found in database');
      db.close();
      return;
    }
    
    console.log(`✅ Found user: ${user.name} (${user.email})`);
    
    // Simulate token creation by inserting a sample token
    const sampleToken = {
      name: 'app',
      token: 'sample_token_' + Math.random().toString(36).substring(7),
      abilities: '["*"]',
      tokenable_id: user.id,
      tokenable_type: 'App\\Models\\User'
    };
    
    db.run(`INSERT INTO personal_access_tokens (name, token, abilities, tokenable_id, tokenable_type, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`, 
            [sampleToken.name, sampleToken.token, sampleToken.abilities, sampleToken.tokenable_id, sampleToken.tokenable_type], 
            function(err) {
      if (err) {
        console.error('❌ Error creating sample token:', err);
        db.close();
        return;
      }
      
      const tokenId = this.lastID;
      console.log(`✅ Sample token created with ID: ${tokenId}`);
      
      // Test token retrieval
      db.get("SELECT * FROM personal_access_tokens WHERE id = ?", [tokenId], (err, token) => {
        if (err) {
          console.error('❌ Error retrieving token:', err);
          db.close();
          return;
        }
        
        if (token) {
          console.log('✅ Token retrieved successfully:');
          console.log(`  ID: ${token.id}`);
          console.log(`  Name: ${token.name}`);
          console.log(`  Token: ${token.token.substring(0, 20)}...`);
          console.log(`  Tokenable ID: ${token.tokenable_id}`);
          console.log(`  Tokenable Type: ${token.tokenable_type}`);
          console.log(`  Created: ${token.created_at}`);
        } else {
          console.log('❌ Token not found');
        }
        
        // Test user-token relationship
        db.get("SELECT * FROM personal_access_tokens WHERE tokenable_id = ? AND tokenable_type = ?", 
                [user.id, 'App\\Models\\User'], (err, userTokens) => {
          if (err) {
            console.error('❌ Error querying user tokens:', err);
          } else {
            console.log(`✅ User has ${userTokens ? 'at least one' : 'no'} token(s)`);
          }
          
          // Clean up the sample token
          db.run("DELETE FROM personal_access_tokens WHERE id = ?", [tokenId], (err) => {
            if (err) {
              console.error('❌ Error cleaning up sample token:', err);
            } else {
              console.log('✅ Sample token cleaned up');
            }
            
            console.log('\n✅ Laravel Sanctum functionality test completed successfully!');
            db.close();
          });
        });
      });
    });
  });
}

// Start testing
testSanctum();