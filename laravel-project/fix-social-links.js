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

// Fix social_links table
function fixSocialLinksTable() {
  console.log('Checking social_links table structure...');
  
  // Check if table exists
  db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='social_links'", (err, row) => {
    if (err) {
      console.error('Error checking table existence:', err);
      db.close();
      return;
    }
    
    if (!row) {
      console.log('social_links table does not exist. Creating it...');
      createSocialLinksTable();
      return;
    }
    
    console.log('social_links table exists. Checking columns...');
    
    // Check current columns
    db.all("PRAGMA table_info(social_links)", (err, columns) => {
      if (err) {
        console.error('Error getting table info:', err);
        db.close();
        return;
      }
      
      const columnNames = columns.map(col => col.name);
      console.log('Current columns:', columnNames);
      
      // Check if business_card_id exists (incorrect column)
      if (columnNames.includes('business_card_id')) {
        console.log('Found incorrect business_card_id column. Removing it...');
        removeBusinessCardIdColumn();
      } else if (columnNames.includes('card_id')) {
        console.log('Correct card_id column exists. Table is properly structured.');
        db.close();
      } else {
        console.log('Neither business_card_id nor card_id found. Adding correct card_id column...');
        addCardIdColumn();
      }
    });
  });
}

function removeBusinessCardIdColumn() {
  // SQLite doesn't support dropping columns directly, so we need to recreate the table
  console.log('Recreating social_links table with correct structure...');
  
  db.run('DROP TABLE IF EXISTS social_links_new', (err) => {
    if (err) {
      console.error('Error dropping temp table:', err);
      db.close();
      return;
    }
    
    // Create new table with correct structure
    db.run(`CREATE TABLE social_links_new (
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
        console.error('Error creating new table:', err);
        db.close();
        return;
      }
      
      // Copy data from old table (excluding business_card_id)
      db.run(`INSERT INTO social_links_new (id, card_id, platform, url, username, created_at, updated_at)
              SELECT id, 
                     CASE 
                       WHEN business_card_id IS NOT NULL THEN business_card_id 
                       ELSE card_id 
                     END,
                     platform, url, username, created_at, updated_at
              FROM social_links`, (err) => {
        if (err) {
          console.error('Error copying data:', err);
          db.close();
          return;
        }
        
        // Drop old table
        db.run('DROP TABLE social_links', (err) => {
          if (err) {
            console.error('Error dropping old table:', err);
            db.close();
            return;
          }
          
          // Rename new table
          db.run('ALTER TABLE social_links_new RENAME TO social_links', (err) => {
            if (err) {
              console.error('Error renaming table:', err);
              db.close();
              return;
            }
            
            // Create index
            db.run('CREATE INDEX IF NOT EXISTS social_links_card_id_index ON social_links(card_id)', (err) => {
              if (err) {
                console.error('Error creating index:', err);
              } else {
                console.log('social_links table fixed successfully!');
              }
              db.close();
            });
          });
        });
      });
    });
  });
}

function addCardIdColumn() {
  // SQLite doesn't support adding foreign keys directly, so we need to recreate the table
  console.log('Recreating social_links table with card_id column...');
  
  db.run('DROP TABLE IF EXISTS social_links_new', (err) => {
    if (err) {
      console.error('Error dropping temp table:', err);
      db.close();
      return;
    }
    
    // Create new table with correct structure
    db.run(`CREATE TABLE social_links_new (
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
        console.error('Error creating new table:', err);
        db.close();
        return;
      }
      
      // Copy data from old table
      db.run(`INSERT INTO social_links_new (id, platform, url, username, created_at, updated_at)
              SELECT id, platform, url, username, created_at, updated_at
              FROM social_links`, (err) => {
        if (err) {
          console.error('Error copying data:', err);
          db.close();
          return;
        }
        
        // Drop old table
        db.run('DROP TABLE social_links', (err) => {
          if (err) {
            console.error('Error dropping old table:', err);
            db.close();
            return;
          }
          
          // Rename new table
          db.run('ALTER TABLE social_links_new RENAME TO social_links', (err) => {
            if (err) {
              console.error('Error renaming table:', err);
              db.close();
              return;
            }
            
            // Create index
            db.run('CREATE INDEX IF NOT EXISTS social_links_card_id_index ON social_links(card_id)', (err) => {
              if (err) {
                console.error('Error creating index:', err);
              } else {
                console.log('social_links table fixed successfully!');
              }
              db.close();
            });
          });
        });
      });
    });
  });
}

function createSocialLinksTable() {
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
    } else {
      // Create index
      db.run('CREATE INDEX IF NOT EXISTS social_links_card_id_index ON social_links(card_id)', (err) => {
        if (err) {
          console.error('Error creating index:', err);
        } else {
          console.log('social_links table created successfully!');
        }
        db.close();
      });
    }
  });
}

// Start the fix process
fixSocialLinksTable();