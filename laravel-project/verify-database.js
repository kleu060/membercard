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

// Get all tables
db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, tables) => {
  if (err) {
    console.error('Error getting tables:', err);
    db.close();
    process.exit(1);
  }
  
  console.log('\n=== Database Tables ===');
  tables.forEach(table => {
    console.log(`- ${table.name}`);
  });
  
  // Get migrations
  db.all("SELECT migration FROM migrations ORDER BY migration", (err, migrations) => {
    if (err) {
      console.error('Error getting migrations:', err);
      db.close();
      process.exit(1);
    }
    
    console.log('\n=== Completed Migrations ===');
    migrations.forEach(migration => {
      console.log(`- ${migration.migration}`);
    });
    
    console.log(`\nTotal tables: ${tables.length}`);
    console.log(`Total migrations: ${migrations.length}`);
    
    db.close();
  });
});