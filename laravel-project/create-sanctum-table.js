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

// Create personal_access_tokens table for Laravel Sanctum
function createSanctumTable() {
  console.log('Creating personal_access_tokens table for Laravel Sanctum...');
  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS personal_access_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(191) NOT NULL,
      token VARCHAR(64) NOT NULL UNIQUE,
      abilities TEXT,
      expires_at DATETIME,
      tokenable_id INTEGER NOT NULL,
      tokenable_type VARCHAR(191) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating personal_access_tokens table:', err);
      db.close();
      return;
    }
    
    console.log('✅ personal_access_tokens table created successfully');
    
    // Create indexes
    const indexes = [
      'CREATE INDEX IF NOT EXISTS personal_access_tokens_token_index ON personal_access_tokens(token)',
      'CREATE INDEX IF NOT EXISTS personal_access_tokens_tokenable_type_index ON personal_access_tokens(tokenable_type)',
      'CREATE INDEX IF NOT EXISTS personal_access_tokens_tokenable_id_index ON personal_access_tokens(tokenable_id)'
    ];
    
    let indexCount = 0;
    
    function createNextIndex() {
      if (indexCount >= indexes.length) {
        console.log('✅ All indexes created successfully');
        verifyTable();
        return;
      }
      
      db.run(indexes[indexCount], (err) => {
        if (err) {
          console.error(`Error creating index ${indexCount + 1}:`, err);
        } else {
          console.log(`✅ Index ${indexCount + 1} created successfully`);
        }
        indexCount++;
        createNextIndex();
      });
    }
    
    createNextIndex();
  });
}

function verifyTable() {
  console.log('\nVerifying personal_access_tokens table structure...');
  
  db.all("PRAGMA table_info(personal_access_tokens)", (err, columns) => {
    if (err) {
      console.error('Error getting table info:', err);
      db.close();
      return;
    }
    
    console.log('Table structure:');
    columns.forEach(col => {
      console.log(`  ${col.name} (${col.type})`);
    });
    
    // Check indexes
    db.all("PRAGMA index_list(personal_access_tokens)", (err, indexes) => {
      if (err) {
        console.error('Error getting indexes:', err);
        db.close();
        return;
      }
      
      console.log('\nIndexes:');
      indexes.forEach(idx => {
        console.log(`  ${idx.name} (${idx.unique ? 'UNIQUE' : 'NON-UNIQUE'})`);
      });
      
      console.log('\n✅ Laravel Sanctum table setup completed successfully!');
      db.close();
    });
  });
}

// Start the process
createSanctumTable();