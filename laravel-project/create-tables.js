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

// Create tables
const tables = [
  // Users table
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(191) UNIQUE,
    name VARCHAR(191),
    password VARCHAR(191),
    avatar VARCHAR(191),
    location VARCHAR(191),
    role VARCHAR(50) DEFAULT 'user',
    subscription_plan VARCHAR(50) DEFAULT 'free',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  
  // Accounts table
  `CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    type VARCHAR(50),
    provider VARCHAR(50),
    provider_account_id VARCHAR(150),
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Business cards table
  `CREATE TABLE IF NOT EXISTS business_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name VARCHAR(191),
    company VARCHAR(191),
    position VARCHAR(191),
    phone VARCHAR(191),
    office_phone VARCHAR(191),
    email VARCHAR(191),
    address VARCHAR(191),
    website VARCHAR(191),
    bio TEXT,
    avatar VARCHAR(191),
    cover_photo VARCHAR(191),
    logo VARCHAR(191),
    location VARCHAR(191),
    template VARCHAR(191) DEFAULT 'modern-blue',
    is_public BOOLEAN DEFAULT 1,
    view_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Social links table
  `CREATE TABLE IF NOT EXISTS social_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER,
    platform VARCHAR(191),
    url TEXT,
    username VARCHAR(191),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES business_cards(id) ON DELETE CASCADE
  )`,
  
  // Products table
  `CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER,
    name VARCHAR(191),
    description TEXT,
    image VARCHAR(191),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES business_cards(id) ON DELETE CASCADE
  )`,
  
  // Product photos table
  `CREATE TABLE IF NOT EXISTS product_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  )`,
  
  // Product links table
  `CREATE TABLE IF NOT EXISTS product_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    title VARCHAR(191),
    url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  )`,
  
  // Industry tags table
  `CREATE TABLE IF NOT EXISTS industry_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_id INTEGER,
    tag VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES business_cards(id) ON DELETE CASCADE
  )`,
  
  // Saved cards table
  `CREATE TABLE IF NOT EXISTS saved_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    card_id INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (card_id) REFERENCES business_cards(id) ON DELETE CASCADE
  )`,
  
  // Scanned cards table
  `CREATE TABLE IF NOT EXISTS scanned_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    image_url TEXT,
    name VARCHAR(191),
    company VARCHAR(191),
    title VARCHAR(191),
    email VARCHAR(191),
    phone VARCHAR(191),
    address VARCHAR(191),
    website VARCHAR(191),
    notes TEXT,
    ocr_data TEXT,
    tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Contact tags table
  `CREATE TABLE IF NOT EXISTS contact_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    saved_card_id INTEGER,
    tag VARCHAR(50),
    color VARCHAR(7) DEFAULT '3B82F6',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (saved_card_id) REFERENCES saved_cards(id) ON DELETE CASCADE
  )`,
  
  // Leads table (CRM)
  `CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name VARCHAR(191),
    email VARCHAR(191),
    phone VARCHAR(191),
    company VARCHAR(191),
    position VARCHAR(191),
    message TEXT,
    interest VARCHAR(50) DEFAULT 'general',
    source VARCHAR(50) DEFAULT 'manual',
    status TEXT CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'converted', 'lost')) DEFAULT 'new',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    score INTEGER DEFAULT 0,
    estimated_value DECIMAL(12, 2),
    currency VARCHAR(3) DEFAULT 'TWD',
    website VARCHAR(191),
    linkedin VARCHAR(191),
    twitter VARCHAR(191),
    address TEXT,
    city VARCHAR(191),
    country VARCHAR(191),
    tags TEXT,
    notes TEXT,
    last_contact_at DATETIME,
    business_card_id INTEGER,
    assigned_user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (business_card_id) REFERENCES business_cards(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL
  )`,
  
  // Lead interactions table
  `CREATE TABLE IF NOT EXISTS lead_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER,
    type VARCHAR(20),
    direction TEXT CHECK (direction IN ('inbound', 'outbound')),
    title VARCHAR(191),
    description TEXT,
    duration INTEGER,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Lead activities table
  `CREATE TABLE IF NOT EXISTS lead_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER,
    type VARCHAR(30),
    title VARCHAR(191),
    description TEXT,
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Lead forms table
  `CREATE TABLE IF NOT EXISTS lead_forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name VARCHAR(191),
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    is_public BOOLEAN DEFAULT 1,
    embed_code TEXT,
    fields TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Form submissions table
  `CREATE TABLE IF NOT EXISTS form_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_id INTEGER,
    lead_id INTEGER,
    data TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES lead_forms(id) ON DELETE CASCADE,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL
  )`
];

// Create tables one by one
let currentTable = 0;

function createNextTable() {
  if (currentTable >= tables.length) {
    console.log('All tables created successfully!');
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