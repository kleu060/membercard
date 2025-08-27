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

// Check actual schema
function checkSchema() {
  console.log('Checking actual database schema...\n');
  
  const tablesToCheck = [
    'products',
    'social_links', 
    'industry_tags',
    'saved_cards',
    'appointments',
    'appointment_availability',
    'booking_settings'
  ];
  
  let currentTable = 0;
  
  function checkNextTable() {
    if (currentTable >= tablesToCheck.length) {
      console.log('✅ Schema check completed!');
      db.close();
      return;
    }
    
    const tableName = tablesToCheck[currentTable];
    console.log(`\n=== ${tableName.toUpperCase()} ===`);
    
    db.all(`PRAGMA table_info(${tableName})`, (err, columns) => {
      if (err) {
        console.error(`Error getting ${tableName} info:`, err);
        currentTable++;
        checkNextTable();
        return;
      }
      
      if (columns.length === 0) {
        console.log(`Table ${tableName} does not exist`);
        currentTable++;
        checkNextTable();
        return;
      }
      
      console.log('Columns:');
      columns.forEach(col => {
        console.log(`  ${col.name} (${col.type})`);
      });
      
      // Check for card_id vs business_card_id
      const hasCardId = columns.some(col => col.name === 'card_id');
      const hasBusinessCardId = columns.some(col => col.name === 'business_card_id');
      
      if (hasCardId) {
        console.log('✅ Uses: card_id');
      } else if (hasBusinessCardId) {
        console.log('✅ Uses: business_card_id');
      } else {
        console.log('❌ Neither card_id nor business_card_id found');
      }
      
      currentTable++;
      checkNextTable();
    });
  }
  
  checkNextTable();
}

// Start checking
checkSchema();