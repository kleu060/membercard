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

// Create advanced features tables
const tables = [
  // Email templates table
  `CREATE TABLE IF NOT EXISTS email_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name VARCHAR(191),
    subject VARCHAR(191),
    content TEXT,
    type VARCHAR(20) DEFAULT 'custom',
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Email campaigns table
  `CREATE TABLE IF NOT EXISTS email_campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name VARCHAR(191),
    description TEXT,
    template_id INTEGER,
    status VARCHAR(20) DEFAULT 'draft',
    schedule_type VARCHAR(20) DEFAULT 'immediate',
    scheduled_at DATETIME,
    sent_at DATETIME,
    total_recipients INTEGER DEFAULT 0,
    successful_sends INTEGER DEFAULT 0,
    failed_sends INTEGER DEFAULT 0,
    opens INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE SET NULL
  )`,
  
  // Email automations table
  `CREATE TABLE IF NOT EXISTS email_automations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name VARCHAR(191),
    description TEXT,
    trigger_type VARCHAR(50),
    trigger_config TEXT,
    actions TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Email deliveries table
  `CREATE TABLE IF NOT EXISTS email_deliveries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER,
    automation_id INTEGER,
    recipient_email VARCHAR(191),
    recipient_name VARCHAR(191),
    subject VARCHAR(191),
    content TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    sent_at DATETIME,
    opened_at DATETIME,
    clicked_at DATETIME,
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES email_campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (automation_id) REFERENCES email_automations(id) ON DELETE CASCADE
  )`,
  
  // iPhone sync configs table
  `CREATE TABLE IF NOT EXISTS iphone_sync_configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    card_dav_url VARCHAR(191) UNIQUE,
    username VARCHAR(100),
    password TEXT,
    sync_direction VARCHAR(10) DEFAULT 'both',
    last_sync_at DATETIME,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Team members table
  `CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_id INTEGER,
    user_id INTEGER,
    role VARCHAR(20) DEFAULT 'member',
    permissions TEXT,
    invited_at DATETIME,
    joined_at DATETIME,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Teams table
  `CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(191),
    description TEXT,
    owner_id INTEGER,
    settings TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Saved searches table
  `CREATE TABLE IF NOT EXISTS saved_searches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name VARCHAR(191),
    query TEXT,
    filters TEXT,
    type VARCHAR(50) DEFAULT 'job',
    last_run_at DATETIME,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`
];

// Create tables one by one
let currentTable = 0;

function createNextTable() {
  if (currentTable >= tables.length) {
    console.log('All advanced features tables created successfully!');
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