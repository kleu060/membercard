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

// Create migrations table
db.run(`CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  migration VARCHAR(255) NOT NULL,
  batch INTEGER NOT NULL
)`, (err) => {
  if (err) {
    console.error('Error creating migrations table:', err);
    db.close();
    process.exit(1);
  }
  console.log('Migrations table created successfully');
  
  // Record all migrations as run
  const migrations = [
    '2024_01_01_000001_create_core_tables.php',
    '2024_01_01_000002_create_appointment_tables.php',
    '2024_01_01_000003_create_job_profile_tables.php',
    '2024_01_01_000004_create_crm_tables.php',
    '2024_01_01_000005_create_advanced_features_tables.php',
    '2024_01_01_000006_add_cover_photo_and_logo_to_business_cards.php'
  ];
  
  let currentMigration = 0;
  
  function recordNextMigration() {
    if (currentMigration >= migrations.length) {
      console.log('All migrations recorded successfully!');
      db.close();
      return;
    }
    
    const migration = migrations[currentMigration];
    console.log(`Recording migration: ${migration}`);
    
    db.run('INSERT INTO migrations (migration, batch) VALUES (?, ?)', 
      [migration, 1], (err) => {
        if (err) {
          console.error(`Error recording migration ${migration}:`, err);
        } else {
          console.log(`Migration ${migration} recorded`);
        }
        currentMigration++;
        recordNextMigration();
      });
  }
  
  recordNextMigration();
});