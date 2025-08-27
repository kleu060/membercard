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

// Create appointment tables
const tables = [
  // Appointments table
  `CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    business_card_id INTEGER,
    title VARCHAR(191),
    description TEXT,
    start_time DATETIME,
    end_time DATETIME,
    status VARCHAR(50) DEFAULT 'scheduled',
    contact_name VARCHAR(191),
    contact_email VARCHAR(191),
    contact_phone VARCHAR(50),
    calendar_event_id VARCHAR(191),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (business_card_id) REFERENCES business_cards(id) ON DELETE CASCADE
  )`,
  
  // Calendar integrations table
  `CREATE TABLE IF NOT EXISTS calendar_integrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    provider VARCHAR(50),
    calendar_id VARCHAR(191),
    access_token TEXT,
    refresh_token TEXT,
    expires_at INTEGER,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Booking settings table
  `CREATE TABLE IF NOT EXISTS booking_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_card_id INTEGER,
    location_type VARCHAR(20) DEFAULT 'in_person',
    location_address TEXT,
    online_meeting_link VARCHAR(500),
    currency VARCHAR(3) DEFAULT 'TWD',
    price DECIMAL(10, 2) DEFAULT 0,
    duration INTEGER DEFAULT 30,
    buffer_before INTEGER DEFAULT 0,
    buffer_after INTEGER DEFAULT 0,
    max_advance_days INTEGER DEFAULT 30,
    min_advance_hours INTEGER DEFAULT 1,
    lunch_break_start VARCHAR(5),
    lunch_break_end VARCHAR(5),
    mon_start VARCHAR(5),
    mon_end VARCHAR(5),
    tue_start VARCHAR(5),
    tue_end VARCHAR(5),
    wed_start VARCHAR(5),
    wed_end VARCHAR(5),
    thu_start VARCHAR(5),
    thu_end VARCHAR(5),
    fri_start VARCHAR(5),
    fri_end VARCHAR(5),
    sat_start VARCHAR(5),
    sat_end VARCHAR(5),
    sun_start VARCHAR(5),
    sun_end VARCHAR(5),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_card_id) REFERENCES business_cards(id) ON DELETE CASCADE
  )`,
  
  // Time slots table
  `CREATE TABLE IF NOT EXISTS time_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_settings_id INTEGER,
    start_time VARCHAR(5),
    end_time VARCHAR(5),
    day_of_week INTEGER,
    is_available BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_settings_id) REFERENCES booking_settings(id) ON DELETE CASCADE
  )`,
  
  // Appointment availability table
  `CREATE TABLE IF NOT EXISTS appointment_availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_card_id INTEGER,
    date DATE,
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_card_id) REFERENCES business_cards(id) ON DELETE CASCADE
  )`
];

// Create tables one by one
let currentTable = 0;

function createNextTable() {
  if (currentTable >= tables.length) {
    console.log('All appointment tables created successfully!');
    db.close();
    return;
  }
  
  const tableName = tables[currentTable].match(/CREATE TABLE IF NOT EXISTS (\w+)/)[1];
  console.log(`Creating table: ${tableName}`);
  
  db.run(tables[currentTable], (err) => {
    if (err) {
      console.error(`Error creating table ${tableName}:`, err);
    } else {
      console.log(`Table ${tableName} created successfully`);
    }
    currentTable++;
    createNextTable();
  });
}

// Start creating tables
createNextTable();