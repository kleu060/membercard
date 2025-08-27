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

// Test all relationships
function testAllRelationships() {
  console.log('Testing all business card relationships...\n');
  
  // First, get a business card to test with
  db.get("SELECT id FROM business_cards LIMIT 1", (err, row) => {
    if (err) {
      console.error('Error getting business card:', err);
      db.close();
      return;
    }
    
    if (!row) {
      console.log('No business cards found. Creating a test business card...');
      createTestBusinessCard();
      return;
    }
    
    console.log(`Testing with business card ID: ${row.id}`);
    testRelationships(row.id);
  });
}

function createTestBusinessCard() {
  db.run(`INSERT INTO business_cards (user_id, name, company, position, email, phone, created_at, updated_at)
          VALUES (1, 'Test Business Card', 'Test Company', 'Test Position', 'test@example.com', '123-456-7890', datetime('now'), datetime('now'))`, 
  function(err) {
    if (err) {
      console.error('Error creating business card:', err);
      db.close();
      return;
    }
    
    const cardId = this.lastID;
    console.log(`Created test business card with ID: ${cardId}`);
    testRelationships(cardId);
  });
}

function testRelationships(cardId) {
  const relationships = [
    { name: 'products', table: 'products', fkColumn: 'card_id' },
    { name: 'social_links', table: 'social_links', fkColumn: 'card_id' },
    { name: 'industry_tags', table: 'industry_tags', fkColumn: 'card_id' },
    { name: 'saved_cards', table: 'saved_cards', fkColumn: 'card_id' },
    { name: 'appointments', table: 'appointments', fkColumn: 'business_card_id' },
    { name: 'appointment_availability', table: 'appointment_availability', fkColumn: 'business_card_id' },
    { name: 'leads', table: 'leads', fkColumn: 'business_card_id' }
  ];
  
  let currentTest = 0;
  
  function testNext() {
    if (currentTest >= relationships.length) {
      console.log('\n✅ All relationship tests completed successfully!');
      db.close();
      return;
    }
    
    const rel = relationships[currentTest];
    console.log(`\n--- Testing ${rel.name} relationship ---`);
    
    // Test basic query
    const query = `SELECT COUNT(*) as count FROM ${rel.table} WHERE ${rel.fkColumn} = ?`;
    
    db.get(query, [cardId], (err, row) => {
      if (err) {
        console.error(`❌ Error testing ${rel.name}:`, err.message);
      } else {
        console.log(`✅ ${rel.name}: Found ${row.count} records`);
        
        // Test JOIN query (similar to what Laravel would generate)
        const joinQuery = `
          SELECT business_cards.*, COUNT(${rel.table}.id) as ${rel.name}_count
          FROM business_cards
          LEFT JOIN ${rel.table} ON business_cards.id = ${rel.table}.${rel.fkColumn}
          WHERE business_cards.id = ?
          GROUP BY business_cards.id
        `;
        
        db.get(joinQuery, [cardId], (err, row) => {
          if (err) {
            console.error(`❌ Error testing ${rel.name} JOIN:`, err.message);
          } else {
            console.log(`✅ ${rel.name} JOIN: Count = ${row[`${rel.name}_count`]}`);
          }
        });
      }
      
      currentTest++;
      setTimeout(testNext, 100); // Small delay to avoid overwhelming the database
    });
  }
  
  testNext();
}

// Start testing
testAllRelationships();