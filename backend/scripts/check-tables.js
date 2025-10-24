const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:fbmJrxNxsHZQcMYjwFkjxbwLxxMjLSZu@maglev.proxy.rlwy.net:17605/railway',
  ssl: false
});

async function checkTables() {
  try {
    await client.connect();
    console.log('✅ Connected to Railway PostgreSQL\n');

    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log(`📊 Found ${result.rows.length} tables:\n`);

    const contentTables = ['categorias', 'plans', 'productos', 'orders', 'home_pages'];
    const found = [];
    const missing = [];

    result.rows.forEach(row => {
      const tableName = row.table_name;
      if (contentTables.includes(tableName)) {
        found.push(tableName);
        console.log(`  ✅ ${tableName}`);
      } else {
        console.log(`  -  ${tableName}`);
      }
    });

    console.log('\n📋 Content Tables Status:');
    contentTables.forEach(table => {
      if (found.includes(table)) {
        console.log(`  ✅ ${table} - EXISTS`);
      } else {
        missing.push(table);
        console.log(`  ❌ ${table} - MISSING`);
      }
    });

    if (missing.length === 0) {
      console.log('\n🎉 All content tables exist! Ready to import data.');
    } else {
      console.log('\n⚠️  Some tables are missing. Strapi may still be initializing.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkTables();
