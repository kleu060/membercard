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

// Create job profile tables
const tables = [
  // Skills table
  `CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name VARCHAR(100),
    level VARCHAR(20),
    years_of_experience INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Education table
  `CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    institution VARCHAR(191),
    degree VARCHAR(191),
    field_of_study VARCHAR(191),
    start_date DATE,
    end_date DATE,
    grade VARCHAR(50),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Certifications table
  `CREATE TABLE IF NOT EXISTS certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name VARCHAR(191),
    issuer VARCHAR(191),
    issue_date DATE,
    expiry_date DATE,
    credential_id VARCHAR(191),
    credential_url VARCHAR(191),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Career history table
  `CREATE TABLE IF NOT EXISTS career_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    company VARCHAR(191),
    position VARCHAR(191),
    start_date DATE,
    end_date DATE,
    description TEXT,
    skills TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Job profile table
  `CREATE TABLE IF NOT EXISTS job_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title VARCHAR(191),
    summary TEXT,
    resume_url VARCHAR(191),
    portfolio_url VARCHAR(191),
    linkedin_url VARCHAR(191),
    github_url VARCHAR(191),
    website VARCHAR(191),
    location VARCHAR(191),
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Saved jobs table
  `CREATE TABLE IF NOT EXISTS saved_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    job_id VARCHAR(50),
    title VARCHAR(191),
    company VARCHAR(191),
    location VARCHAR(191),
    url VARCHAR(191),
    description TEXT,
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'TWD',
    job_type VARCHAR(50),
    experience_level VARCHAR(50),
    posted_at DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`,
  
  // Applications table
  `CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    job_id VARCHAR(50),
    company VARCHAR(191),
    position VARCHAR(191),
    status VARCHAR(20) DEFAULT 'applied',
    applied_at DATE,
    last_follow_up DATE,
    notes TEXT,
    resume_url VARCHAR(191),
    cover_letter_url VARCHAR(191),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`
];

// Create tables one by one
let currentTable = 0;

function createNextTable() {
  if (currentTable >= tables.length) {
    console.log('All job profile tables created successfully!');
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