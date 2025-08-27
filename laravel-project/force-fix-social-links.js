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

// Force fix social_links table
function forceFixSocialLinksTable() {
  console.log('Force fixing social_links table...');
  
  // Drop the table if it exists
  db.run('DROP TABLE IF EXISTS social_links', (err) => {
    if (err) {
      console.error('Error dropping social_links table:', err);
      db.close();
      return;
    }
    
    console.log('social_links table dropped successfully');
    
    // Recreate the table with correct structure
    db.run(`CREATE TABLE social_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_id INTEGER,
      platform VARCHAR(191),
      url TEXT,
      username VARCHAR(191),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (card_id) REFERENCES business_cards(id) ON DELETE CASCADE
    )`, (err) => {
      if (err) {
        console.error('Error creating social_links table:', err);
        db.close();
        return;
      }
      
      console.log('social_links table created successfully with correct structure');
      
      // Create index
      db.run('CREATE INDEX IF NOT EXISTS social_links_card_id_index ON social_links(card_id)', (err) => {
        if (err) {
          console.error('Error creating index:', err);
        } else {
          console.log('Index created successfully');
        }
        
        // Verify the table structure
        verifyTableStructure();
      });
    });
  });
}

function verifyTableStructure() {
  console.log('Verifying social_links table structure...');
  
  db.all("PRAGMA table_info(social_links)", (err, columns) => {
    if (err) {
      console.error('Error getting table info:', err);
      db.close();
      return;
    }
    
    console.log('Table structure:');
    columns.forEach(col => {
      console.log(`  ${col.name} (${col.type})`);
    });
    
    // Check for correct columns
    const columnNames = columns.map(col => col.name);
    const expectedColumns = ['id', 'card_id', 'platform', 'url', 'username', 'created_at', 'updated_at'];
    
    let allCorrect = true;
    expectedColumns.forEach(col => {
      if (!columnNames.includes(col)) {
        console.log(`❌ Missing column: ${col}`);
        allCorrect = false;
      } else {
        console.log(`✅ Column exists: ${col}`);
      }
    });
    
    // Check for incorrect columns
    const incorrectColumns = columnNames.filter(col => !expectedColumns.includes(col));
    if (incorrectColumns.length > 0) {
      console.log(`❌ Unexpected columns: ${incorrectColumns.join(', ')}`);
      allCorrect = false;
    }
    
    if (allCorrect) {
      console.log('✅ social_links table structure is correct!');
    } else {
      console.log('❌ social_links table structure has issues');
    }
    
    // Check foreign key constraints
    db.all("PRAGMA foreign_key_list(social_links)", (err, fks) => {
      if (err) {
        console.error('Error getting foreign key info:', err);
        db.close();
        return;
      }
      
      console.log('Foreign key constraints:');
      fks.forEach(fk => {
        console.log(`  ${fk.from} -> ${fk.table}.${fk.to} (ON DELETE ${fk.on_delete})`);
      });
      
      // Check indexes
      db.all("PRAGMA index_list(social_links)", (err, indexes) => {
        if (err) {
          console.error('Error getting index info:', err);
          db.close();
          return;
        }
        
        console.log('Indexes:');
        indexes.forEach(idx => {
          console.log(`  ${idx.name} (${idx.unique ? 'UNIQUE' : 'NON-UNIQUE'})`);
        });
        
        console.log('✅ social_links table fix completed!');
        db.close();
      });
    });
  });
}

// Start the fix process
forceFixSocialLinksTable();