#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database path
const dbPath = path.join(__dirname, 'database', 'database.sqlite');

// Read migration files
const migrationsDir = path.join(__dirname, 'database', 'migrations');
const migrationFiles = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.php'))
  .sort();

console.log('Found migration files:', migrationFiles);

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Create migrations table if it doesn't exist
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
  console.log('Migrations table ready');
  
  // Get already run migrations
  db.all('SELECT migration FROM migrations', (err, rows) => {
    if (err) {
      console.error('Error getting migrations:', err);
      db.close();
      process.exit(1);
    }
    
    const runMigrations = rows.map(row => row.migration);
    console.log('Already run migrations:', runMigrations);
    
    // Run pending migrations
    runPendingMigrations(runMigrations);
  });
});

function runPendingMigrations(runMigrations) {
  const pendingMigrations = migrationFiles.filter(file => !runMigrations.includes(file));
  
  if (pendingMigrations.length === 0) {
    console.log('No pending migrations');
    db.close();
    return;
  }
  
  console.log('Pending migrations:', pendingMigrations);
  
  // Process each migration
  let currentMigration = 0;
  
  function processNextMigration() {
    if (currentMigration >= pendingMigrations.length) {
      console.log('All migrations completed');
      db.close();
      return;
    }
    
    const migrationFile = pendingMigrations[currentMigration];
    console.log(`Running migration: ${migrationFile}`);
    
    // Read and parse the migration file
    const migrationPath = path.join(migrationsDir, migrationFile);
    const migrationContent = fs.readFileSync(migrationPath, 'utf8');
    
    // Extract table creation commands from the migration file
    const tables = extractTableDefinitions(migrationContent);
    
    if (tables.length === 0) {
      console.log(`No table definitions found in ${migrationFile}`);
      currentMigration++;
      processNextMigration();
      return;
    }
    
    // Create tables
    let tablesCreated = 0;
    
    function createNextTable() {
      if (tablesCreated >= tables.length) {
        // Record migration as run
        db.run('INSERT INTO migrations (migration, batch) VALUES (?, ?)', 
          [migrationFile, 1], (err) => {
            if (err) {
              console.error(`Error recording migration ${migrationFile}:`, err);
            } else {
              console.log(`Migration ${migrationFile} completed`);
            }
            currentMigration++;
            processNextMigration();
          });
        return;
      }
      
      const table = tables[tablesCreated];
      console.log(`Creating table: ${table.name}`);
      
      // Create table first
      db.run(table.createTable, (err) => {
        if (err) {
          console.error(`Error creating table ${table.name}:`, err);
        } else {
          console.log(`Table ${table.name} created successfully`);
          
          // Create indexes after table is created
          let indexesCreated = 0;
          
          function createNextIndex() {
            if (indexesCreated >= table.indexes.length) {
              tablesCreated++;
              createNextTable();
              return;
            }
            
            const indexSql = table.indexes[indexesCreated];
            console.log(`Creating index for table ${table.name}`);
            
            db.run(indexSql, (err) => {
              if (err) {
                console.error(`Error creating index for table ${table.name}:`, err);
              } else {
                console.log(`Index created successfully for table ${table.name}`);
              }
              indexesCreated++;
              createNextIndex();
            });
          }
          
          createNextIndex();
        }
      });
    }
    
    createNextTable();
  }
  
  processNextMigration();
}

function extractTableDefinitions(content) {
  const tables = [];
  
  // Find all Schema::create blocks more reliably
  const schemaCreateRegex = /Schema::create\(['"`]([^'"`]+)['"`],\s*function\s*\(([^)]*)\)\s*{([\s\S]*?)(?=\s*Schema::create|\s*}\s*;)/g;
  const createMatches = content.match(schemaCreateRegex);
  
  if (!createMatches) {
    return tables;
  }
  
  // Reset regex to find individual table definitions
  let match;
  const tableRegex = /Schema::create\(['"`]([^'"`]+)['"`],\s*function\s*\(([^)]*)\)\s*{([\s\S]*?)(?=\s*Schema::create|\s*}\s*;)/g;
  
  while ((match = tableRegex.exec(content)) !== null) {
    const tableName = match[1];
    const tableBody = match[3];
    
    console.log(`Found table: ${tableName}`);
    
    // Convert Laravel schema to SQL
    const sql = convertLaravelSchemaToSQL(tableName, tableBody);
    if (sql) {
      tables.push({ name: tableName, sql: sql });
    }
  }
  
  return tables;
}

function convertLaravelSchemaToSQL(tableName, body) {
  let columns = [];
  let indexes = [];
  let foreignKeys = [];
  
  // Parse column definitions
  const lines = body.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*')) continue;
    
    // Parse $table->id()
    if (trimmed.match(/\$table->id\(\)/)) {
      columns.push('id INTEGER PRIMARY KEY AUTOINCREMENT');
    }
    // Parse $table->string('name', length)
    else if (trimmed.match(/\$table->string\(['"`]([^'"`]+)['"`](?:\s*,\s*(\d+))?\)/)) {
      const match = trimmed.match(/\$table->string\(['"`]([^'"`]+)['"`](?:\s*,\s*(\d+))?\)/);
      const colName = match[1];
      const length = match[2] || 255;
      columns.push(`${colName} VARCHAR(${length})`);
    }
    // Parse $table->text('name')
    else if (trimmed.match(/\$table->text\(['"`]([^'"`]+)['"`]\)/)) {
      const match = trimmed.match(/\$table->text\(['"`]([^'"`]+)['"`]\)/);
      columns.push(`${match[1]} TEXT`);
    }
    // Parse $table->integer('name')
    else if (trimmed.match(/\$table->integer\(['"`]([^'"`]+)['"`]\)/)) {
      const match = trimmed.match(/\$table->integer\(['"`]([^'"`]+)['"`]\)/);
      columns.push(`${match[1]} INTEGER`);
    }
    // Parse $table->decimal('name', precision, scale)
    else if (trimmed.match(/\$table->decimal\(['"`]([^'"`]+)['"`]\s*,\s*(\d+)\s*,\s*(\d+)\)/)) {
      const match = trimmed.match(/\$table->decimal\(['"`]([^'"`]+)['"`]\s*,\s*(\d+)\s*,\s*(\d+)\)/);
      columns.push(`${match[1]} DECIMAL(${match[2]}, ${match[3]})`);
    }
    // Parse $table->boolean('name')
    else if (trimmed.match(/\$table->boolean\(['"`]([^'"`]+)['"`]\)/)) {
      const match = trimmed.match(/\$table->boolean\(['"`]([^'"`]+)['"`]\)/);
      columns.push(`${match[1]} BOOLEAN`);
    }
    // Parse $table->dateTime('name')
    else if (trimmed.match(/\$table->dateTime\(['"`]([^'"`]+)['"`]\)/)) {
      const match = trimmed.match(/\$table->dateTime\(['"`]([^'"`]+)['"`]\)/);
      columns.push(`${match[1]} DATETIME`);
    }
    // Parse $table->timestamps()
    else if (trimmed.match(/\$table->timestamps\(\)/)) {
      columns.push('created_at DATETIME DEFAULT CURRENT_TIMESTAMP');
      columns.push('updated_at DATETIME DEFAULT CURRENT_TIMESTAMP');
    }
    // Parse $table->foreignId('user_id')->constrained()
    else if (trimmed.match(/\$table->foreignId\(['"`]([^'"`]+)['"`]\)->constrained\(\)/)) {
      const match = trimmed.match(/\$table->foreignId\(['"`]([^'"`]+)['"`]\)->constrained\(\)/);
      columns.push(`${match[1]} INTEGER`);
      foreignKeys.push(`FOREIGN KEY (${match[1]}) REFERENCES users(id) ON DELETE CASCADE`);
    }
    // Parse $table->foreignId('user_id')->nullable()->constrained()
    else if (trimmed.match(/\$table->foreignId\(['"`]([^'"`]+)['"`]\)->nullable\(\)->constrained\(\)/)) {
      const match = trimmed.match(/\$table->foreignId\(['"`]([^'"`]+)['"`]\)->nullable\(\)->constrained\(\)/);
      columns.push(`${match[1]} INTEGER`);
      foreignKeys.push(`FOREIGN KEY (${match[1]}) REFERENCES users(id) ON DELETE SET NULL`);
    }
    // Parse $table->foreignId('card_id')->constrained('business_cards')
    else if (trimmed.match(/\$table->foreignId\(['"`]([^'"`]+)['"`]\)->constrained\(['"`]([^'"`]+)['"`]\)/)) {
      const match = trimmed.match(/\$table->foreignId\(['"`]([^'"`]+)['"`]\)->constrained\(['"`]([^'"`]+)['"`]\)/);
      columns.push(`${match[1]} INTEGER`);
      foreignKeys.push(`FOREIGN KEY (${match[1]}) REFERENCES ${match[2]}(id) ON DELETE CASCADE`);
    }
    // Parse $table->foreignId('card_id')->nullable()->constrained('business_cards')
    else if (trimmed.match(/\$table->foreignId\(['"`]([^'"`]+)['"`]\)->nullable\(\)->constrained\(['"`]([^'"`]+)['"`]\)/)) {
      const match = trimmed.match(/\$table->foreignId\(['"`]([^'"`]+)['"`]\)->nullable\(\)->constrained\(['"`]([^'"`]+)['"`]\)/);
      columns.push(`${match[1]} INTEGER`);
      foreignKeys.push(`FOREIGN KEY (${match[1]}) REFERENCES ${match[2]}(id) ON DELETE SET NULL`);
    }
    // Parse $table->foreignId('assigned_by')->constrained('users')
    else if (trimmed.match(/\$table->foreignId\(['"`]([^'"`]+)['"`]\)->constrained\(['"`]([^'"`]+)['"`]\)/)) {
      const match = trimmed.match(/\$table->foreignId\(['"`]([^'"`]+)['"`]\)->constrained\(['"`]([^'"`]+)['"`]\)/);
      columns.push(`${match[1]} INTEGER`);
      foreignKeys.push(`FOREIGN KEY (${match[1]}) REFERENCES ${match[2]}(id) ON DELETE CASCADE`);
    }
    // Parse ->nullable()
    else if (trimmed.match(/->nullable\(\)/)) {
      // This is handled in the column definitions above
    }
    // Parse ->default('value')
    else if (trimmed.match(/->default\(['"`]([^'"`]+)['"`]\)/)) {
      // This is handled in the column definitions above
    }
    // Parse $table->enum('status', ['values'])->default('value')
    else if (trimmed.match(/\$table->enum\(['"`]([^'"`]+)['"`]\s*,\s*\[([^\]]+)\]\)->default\(['"`]([^'"`]+)['"`]\)/)) {
      const match = trimmed.match(/\$table->enum\(['"`]([^'"`]+)['"`]\s*,\s*\[([^\]]+)\]\)->default\(['"`]([^'"`]+)['"`]\)/);
      const colName = match[1];
      const values = match[2].replace(/['"`]/g, '').split(',').map(v => v.trim());
      const defaultValue = match[3];
      columns.push(`${colName} TEXT CHECK (${colName} IN (${values.map(v => `'${v}'`).join(', ')})) DEFAULT '${defaultValue}'`);
    }
    // Parse $table->enum('priority', ['values'])
    else if (trimmed.match(/\$table->enum\(['"`]([^'"`]+)['"`]\s*,\s*\[([^\]]+)\]\)/)) {
      const match = trimmed.match(/\$table->enum\(['"`]([^'"`]+)['"`]\s*,\s*\[([^\]]+)\]\)/);
      const colName = match[1];
      const values = match[2].replace(/['"`]/g, '').split(',').map(v => v.trim());
      columns.push(`${colName} TEXT CHECK (${colName} IN (${values.map(v => `'${v}'`).join(', ')}))`);
    }
    // Parse $table->unique(['column'])
    else if (trimmed.match(/\$table->unique\(\[([^\]]+)\]\)/)) {
      const match = trimmed.match(/\$table->unique\(\[([^\]]+)\]\)/);
      const columns = match[1].replace(/['"`]/g, '').split(',').map(c => c.trim());
      indexes.push(`UNIQUE (${columns.join(', ')})`);
    }
    // Parse $table->index(['column'])
    else if (trimmed.match(/\$table->index\(\[([^\]]+)\]\)/)) {
      const match = trimmed.match(/\$table->index\(\[([^\]]+)\]\)/);
      const indexColumns = match[1].replace(/['"`]/g, '').split(',').map(c => c.trim());
      indexes.push(`INDEX (${indexColumns.join(', ')})`);
    }
    // Parse $table->dateTime('assigned_at')->default(now())
    else if (trimmed.match(/\$table->dateTime\(['"`]([^'"`]+)['"`]\)->default\(now\(\)\)/)) {
      const match = trimmed.match(/\$table->dateTime\(['"`]([^'"`]+)['"`]\)->default\(now\(\)\)/);
      columns.push(`${match[1]} DATETIME DEFAULT CURRENT_TIMESTAMP`);
    }
  }
  
  if (columns.length === 0) {
    return null;
  }
  
  const allColumns = [...columns, ...foreignKeys];
  const createTableSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (${allColumns.join(', ')})`;
  
  return {
    createTable: createTableSQL,
    indexes: indexes.map(indexColumns => `CREATE INDEX IF NOT EXISTS idx_${tableName}_${indexColumns.replace(/\W/g, '_')} ON ${tableName} ${indexColumns}`)
  };
}