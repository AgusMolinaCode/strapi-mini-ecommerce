const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Railway PostgreSQL connection
const client = new Client({
  connectionString: 'postgresql://postgres:fbmJrxNxsHZQcMYjwFkjxbwLxxMjLSZu@maglev.proxy.rlwy.net:17605/railway',
  ssl: false
});

async function importContentData() {
  try {
    console.log('🔌 Connecting to Railway PostgreSQL...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Read exported data
    const dataPath = path.join(__dirname, 'sqlite-export.json');
    const exportData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Only import CONTENT tables (not Strapi system tables)
    // Strapi will create system tables automatically
    const contentTables = [
      'categorias',
      'home_pages',
      'plans',
      'productos',
      'components_plan_features',
      'components_plan_feature_fulls',
      'plans_cmps',
      'productos_categorias_lnk',
      'files',
      'files_related_mph'
    ];

    console.log('⏳ Waiting for Strapi to create tables...');
    console.log('   Please wait 30 seconds for Railway deployment to complete...\n');

    // Wait 30 seconds for deployment
    await new Promise(resolve => setTimeout(resolve, 30000));

    let totalImported = 0;
    const errors = [];

    for (const tableName of contentTables) {
      const rows = exportData[tableName];

      if (!rows || rows.length === 0) {
        console.log(`⏭️  Skipping ${tableName} (no data)`);
        continue;
      }

      console.log(`📥 Importing ${tableName} (${rows.length} rows)...`);

      try {
        // Check if table exists
        const tableCheck = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_name = '${tableName}'
          )
        `);

        if (!tableCheck.rows[0].exists) {
          console.log(`  ⚠️  Table ${tableName} doesn't exist yet, skipping...`);
          errors.push({ table: tableName, error: 'Table does not exist' });
          continue;
        }

        // Get column names from first row
        const columns = Object.keys(rows[0]);

        // Convert timestamp fields from Unix ms to ISO string
        const dateFields = ['created_at', 'updated_at', 'published_at', 'created_by_id', 'updated_by_id'];

        for (const row of rows) {
          // Convert timestamps
          for (const field of dateFields) {
            if (row[field] && typeof row[field] === 'number') {
              row[field] = new Date(row[field]).toISOString();
            }
          }

          const values = columns.map(col => row[col]);
          const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

          const query = `
            INSERT INTO ${tableName} (${columns.map(c => `"${c}"`).join(', ')})
            VALUES (${placeholders})
            ON CONFLICT DO NOTHING
          `;

          await client.query(query, values);
        }

        console.log(`  ✅ Imported ${rows.length} rows to ${tableName}`);
        totalImported += rows.length;

        // Reset sequence for id columns
        if (columns.includes('id')) {
          try {
            await client.query(`
              SELECT setval(
                pg_get_serial_sequence('${tableName}', 'id'),
                COALESCE((SELECT MAX(id) FROM ${tableName}), 1),
                true
              )
            `);
          } catch (seqError) {
            // Ignore if no sequence
          }
        }

      } catch (error) {
        console.error(`  ❌ Error importing ${tableName}:`, error.message);
        errors.push({ table: tableName, error: error.message });
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`📊 Total records imported: ${totalImported}`);

    if (errors.length > 0) {
      console.log(`\n⚠️  Errors (${errors.length}):`);
      errors.forEach(({ table, error }) => {
        console.log(`  - ${table}: ${error}`);
      });
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
  } finally {
    await client.end();
    console.log('\n🔌 Connection closed');
  }
}

importContentData();
