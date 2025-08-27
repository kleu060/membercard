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

// Check if columns already exist
db.all("PRAGMA table_info(business_cards)", (err, columns) => {
  if (err) {
    console.error('Error checking table columns:', err);
    db.close();
    process.exit(1);
  }
  
  const columnNames = columns.map(col => col.name);
  const hasCoverPhoto = columnNames.includes('cover_photo');
  const hasLogo = columnNames.includes('logo');
  
  if (hasCoverPhoto && hasLogo) {
    console.log('Columns cover_photo and logo already exist in business_cards table');
    db.close();
    return;
  }
  
  // Add columns if they don't exist
  const alterStatements = [];
  
  if (!hasCoverPhoto) {
    alterStatements.push('ALTER TABLE business_cards ADD COLUMN cover_photo VARCHAR(191)');
  }
  
  if (!hasLogo) {
    alterStatements.push('ALTER TABLE business_cards ADD COLUMN logo VARCHAR(191)');
  }
  
  if (alterStatements.length === 0) {
    console.log('No columns to add');
    db.close();
    return;
  }
  
  console.log(`Adding ${alterStatements.length} columns to business_cards table`);
  
  // Execute alter statements
  let currentStatement = 0;
  
  function executeNextStatement() {
    if (currentStatement >= alterStatements.length) {
      console.log('All columns added successfully!');
      db.close();
      return;
    }
    
    db.run(alterStatements[currentStatement], (err) => {
      if (err) {
        console.error('Error executing alter statement:', err);
      } else {
        console.log(`Statement executed: ${alterStatements[currentStatement]}`);
      }
      currentStatement++;
      executeNextStatement();
    });
  }
  
  executeNextStatement();
});