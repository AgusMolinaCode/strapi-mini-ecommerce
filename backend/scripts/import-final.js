const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Railway PostgreSQL connection
const client = new Client({
  connectionString: 'postgresql://postgres:fbmJrxNxsHZQcMYjwFkjxbwLxxMjLSZu@maglev.proxy.rlwy.net:17605/railway',
  ssl: false
});

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkTablesExist() {
  const requiredTables = ['categorias', 'plans', 'productos', 'home_pages', 'components_plan_features', 'components_plan_feature_fulls'];

  const result = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = ANY($1)
  `, [requiredTables]);

  return result.rows.length === requiredTables.length;
}

async function importData() {
  try {
    console.log('🔌 Connecting to Railway PostgreSQL...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Check if tables exist, wait if not
    let tablesExist = await checkTablesExist();
    let attempts = 0;
    const maxAttempts = 12; // 2 minutes total

    while (!tablesExist && attempts < maxAttempts) {
      attempts++;
      console.log(`⏳ Waiting for Strapi to create tables... (attempt ${attempts}/${maxAttempts})`);
      await wait(10000); // Wait 10 seconds
      tablesExist = await checkTablesExist();
    }

    if (!tablesExist) {
      console.error('❌ Tables still don\'t exist after waiting. Please check Railway logs.');
      return;
    }

    console.log('✅ All tables exist!\n');

    // Read exported data
    const dataPath = path.join(__dirname, 'sqlite-export.json');
    const exportData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Import order respecting dependencies
    const importSteps = [
      { table: 'categorias', deps: [] },
      { table: 'home_pages', deps: [] },
      { table: 'components_plan_features', deps: [] },
      { table: 'components_plan_feature_fulls', deps: [] },
      { table: 'plans', deps: [] },
      { table: 'plans_cmps', deps: ['plans', 'components_plan_features', 'components_plan_feature_fulls'] },
      { table: 'productos', deps: [] },
      { table: 'productos_categorias_lnk', deps: ['productos', 'categorias'] },
      { table: 'files', deps: [] },
      { table: 'files_related_mph', deps: ['files'] },
      { table: 'orders', deps: [] },
      { table: 'subscriptions', deps: [] },
      { table: 'subscriptions_plan_lnk', deps: ['subscriptions', 'plans'] }
    ];

    let totalImported = 0;

    for (const step of importSteps) {
      const tableName = step.table;
      const rows = exportData[tableName];

      if (!rows || rows.length === 0) {
        console.log(`⏭️  Skipping ${tableName} (no data)`);
        continue;
      }

      console.log(`📥 Importing ${tableName} (${rows.length} rows)...`);

      try {
        // Get column names
        const columns = Object.keys(rows[0]);

        for (const row of rows) {
          // Convert Unix timestamps to ISO dates
          if (row.created_at && typeof row.created_at === 'number') {
            row.created_at = new Date(row.created_at).toISOString();
          }
          if (row.updated_at && typeof row.updated_at === 'number') {
            row.updated_at = new Date(row.updated_at).toISOString();
          }
          if (row.published_at && typeof row.published_at === 'number') {
            row.published_at = new Date(row.published_at).toISOString();
          }

          const values = columns.map(col => {
            const val = row[col];
            // Handle null values
            return val === null || val === undefined ? null : val;
          });

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

        // Reset sequence
        if (columns.includes('id')) {
          try {
            const seqResult = await client.query(`
              SELECT pg_get_serial_sequence('${tableName}', 'id') as seq_name
            `);

            if (seqResult.rows[0].seq_name) {
              await client.query(`
                SELECT setval(
                  '${seqResult.rows[0].seq_name}',
                  COALESCE((SELECT MAX(id) FROM ${tableName}), 1),
                  true
                )
              `);
            }
          } catch (seqError) {
            // Ignore sequence errors
          }
        }

      } catch (error) {
        console.error(`  ❌ Error importing ${tableName}:`, error.message);
      }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`📊 Total records imported: ${totalImported}\n`);
    console.log('🎉 You can now access your content at:');
    console.log('   https://strapi-production-77cb.up.railway.app/admin');

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
  } finally {
    await client.end();
    console.log('\n🔌 Connection closed');
  }
}

importData();
