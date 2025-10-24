const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Railway PostgreSQL connection
const client = new Client({
  connectionString: 'postgresql://postgres:fbmJrxNxsHZQcMYjwFkjxbwLxxMjLSZu@maglev.proxy.rlwy.net:17605/railway',
  ssl: false
});

async function importData() {
  try {
    console.log('🔌 Connecting to Railway PostgreSQL...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Read exported data
    const dataPath = path.join(__dirname, 'sqlite-export.json');
    const exportData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Priority order for import (respecting foreign key dependencies)
    const importOrder = [
      // Core Strapi tables first
      'strapi_migrations_internal',
      'strapi_database_schema',
      'strapi_core_store_settings',
      'i18n_locale',
      'strapi_webhooks',
      'strapi_releases',
      'strapi_workflows',
      'strapi_workflows_stages',

      // Admin & Permissions
      'admin_roles',
      'admin_users',
      'admin_permissions',
      'admin_users_roles_lnk',
      'admin_permissions_role_lnk',

      // User Permissions
      'up_roles',
      'up_users',
      'up_permissions',
      'up_permissions_role_lnk',
      'up_users_role_lnk',

      // API Tokens
      'strapi_api_tokens',
      'strapi_api_token_permissions',
      'strapi_api_token_permissions_token_lnk',
      'strapi_transfer_tokens',
      'strapi_transfer_token_permissions',
      'strapi_transfer_token_permissions_token_lnk',

      // Files
      'upload_folders',
      'files',
      'files_folder_lnk',
      'files_related_mph',
      'upload_folders_parent_lnk',

      // Content Types - Main entities
      'categorias',
      'home_pages',
      'plans',
      'productos',
      'orders',
      'subscriptions',

      // Components
      'components_plan_features',
      'components_plan_feature_fulls',

      // Junction tables
      'plans_cmps',
      'productos_categorias_lnk',
      'subscriptions_plan_lnk',

      // Sessions and history
      'strapi_sessions',
      'strapi_history_versions',
      'strapi_release_actions',
      'strapi_release_actions_release_lnk',
      'strapi_workflows_stage_required_to_publish_lnk',
      'strapi_workflows_stages_workflow_lnk',
      'strapi_workflows_stages_permissions_lnk'
    ];

    let totalImported = 0;
    const errors = [];

    for (const tableName of importOrder) {
      const rows = exportData[tableName];

      if (!rows || rows.length === 0) {
        console.log(`⏭️  Skipping ${tableName} (no data)`);
        continue;
      }

      console.log(`📥 Importing ${tableName} (${rows.length} rows)...`);

      try {
        // Get column names from first row
        const columns = Object.keys(rows[0]);

        for (const row of rows) {
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

        // Reset sequence for id columns if they exist
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
            // Ignore if no sequence exists
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

importData();
