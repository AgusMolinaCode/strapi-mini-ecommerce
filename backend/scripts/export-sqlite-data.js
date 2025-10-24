const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
const db = new Database(dbPath, { readonly: true });

// Get all tables
const tables = db.prepare(`
  SELECT name FROM sqlite_master
  WHERE type='table'
  AND name NOT LIKE 'sqlite_%'
  AND name NOT LIKE '%_knex_%'
`).all();

console.log('Found tables:', tables.map(t => t.name).join(', '));

const exportData = {};

// Export data from each table
for (const table of tables) {
  const tableName = table.name;
  console.log(`\nExporting ${tableName}...`);

  try {
    const rows = db.prepare(`SELECT * FROM ${tableName}`).all();
    exportData[tableName] = rows;
    console.log(`  ✓ Exported ${rows.length} rows from ${tableName}`);
  } catch (error) {
    console.error(`  ✗ Error exporting ${tableName}:`, error.message);
  }
}

// Save to JSON file
const outputPath = path.join(__dirname, 'sqlite-export.json');
fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));

console.log(`\n✅ Export complete! Data saved to: ${outputPath}`);

// Print summary
console.log('\n📊 Summary:');
for (const [tableName, rows] of Object.entries(exportData)) {
  console.log(`  - ${tableName}: ${rows.length} records`);
}

db.close();
