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

// Test the relationship by creating sample data
function testRelationship() {
  console.log('Testing social_links relationship...');
  
  // First, let's check if we have any business cards
  db.get("SELECT COUNT(*) as count FROM business_cards", (err, row) => {
    if (err) {
      console.error('Error counting business cards:', err);
      db.close();
      return;
    }
    
    console.log(`Found ${row.count} business cards`);
    
    if (row.count === 0) {
      console.log('Creating a sample business card for testing...');
      
      // Create a sample business card
      db.run(`INSERT INTO business_cards (user_id, name, company, position, email, phone, created_at, updated_at)
              VALUES (1, 'Test Card', 'Test Company', 'Test Position', 'test@example.com', '123-456-7890', datetime('now'), datetime('now'))`, 
      function(err) {
        if (err) {
          console.error('Error creating business card:', err);
          db.close();
          return;
        }
        
        const cardId = this.lastID;
        console.log(`Created business card with ID: ${cardId}`);
        
        // Create a sample social link
        createSampleSocialLink(cardId);
      });
    } else {
      // Get the first business card
      db.get("SELECT id FROM business_cards LIMIT 1", (err, row) => {
        if (err) {
          console.error('Error getting business card:', err);
          db.close();
          return;
        }
        
        console.log(`Using existing business card with ID: ${row.id}`);
        createSampleSocialLink(row.id);
      });
    }
  });
}

function createSampleSocialLink(cardId) {
  console.log(`Creating sample social link for card ID: ${cardId}`);
  
  // Create a sample social link
  db.run(`INSERT INTO social_links (card_id, platform, url, username, created_at, updated_at)
          VALUES (?, 'twitter', 'https://twitter.com/testuser', 'testuser', datetime('now'), datetime('now'))`, 
  [cardId], function(err) {
    if (err) {
      console.error('Error creating social link:', err);
      db.close();
      return;
    }
    
    const socialLinkId = this.lastID;
    console.log(`Created social link with ID: ${socialLinkId}`);
    
    // Test the relationship by querying
    testQuery(cardId);
  });
}

function testQuery(cardId) {
  console.log(`Testing relationship query for card ID: ${cardId}`);
  
  // Test a query similar to what Laravel would generate
  const query = `
    SELECT business_cards.*, COUNT(social_links.id) as social_links_count
    FROM business_cards
    LEFT JOIN social_links ON business_cards.id = social_links.card_id
    WHERE business_cards.id = ?
    GROUP BY business_cards.id
  `;
  
  db.get(query, [cardId], (err, row) => {
    if (err) {
      console.error('Error testing relationship query:', err);
      db.close();
      return;
    }
    
    console.log('Relationship query result:');
    console.log(`  Card ID: ${row.id}`);
    console.log(`  Card Name: ${row.name}`);
    console.log(`  Social Links Count: ${row.social_links_count}`);
    
    // Test direct social_links query
    db.all("SELECT * FROM social_links WHERE card_id = ?", [cardId], (err, rows) => {
      if (err) {
        console.error('Error querying social links:', err);
        db.close();
        return;
      }
      
      console.log(`Direct social_links query found ${rows.length} records:`);
      rows.forEach(row => {
        console.log(`  - ID: ${row.id}, Platform: ${row.platform}, URL: ${row.url}`);
      });
      
      console.log('✅ Relationship test completed successfully!');
      db.close();
    });
  });
}

// Start the test
testRelationship();