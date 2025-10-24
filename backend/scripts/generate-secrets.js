#!/usr/bin/env node

/**
 * Script para generar secrets seguros para Strapi en producción
 * Ejecutar: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

function generateSecret() {
  return crypto.randomBytes(32).toString('base64');
}

console.log('\n🔐 SECRETS PARA STRAPI EN RAILWAY\n');
console.log('Copia estas variables y pégalas en Railway Dashboard → Variables\n');
console.log('='.repeat(80));
console.log('\n# Strapi Secrets - GENERADOS AUTOMÁTICAMENTE');
console.log('# IMPORTANTE: Guarda estos valores en un lugar seguro!\n');

const appKeys = [
  generateSecret(),
  generateSecret(),
  generateSecret(),
  generateSecret()
].join(',');

console.log(`APP_KEYS=${appKeys}`);
console.log(`API_TOKEN_SALT=${generateSecret()}`);
console.log(`ADMIN_JWT_SECRET=${generateSecret()}`);
console.log(`TRANSFER_TOKEN_SALT=${generateSecret()}`);
console.log(`JWT_SECRET=${generateSecret()}`);

console.log('\n# Variables de Servidor');
console.log('HOST=0.0.0.0');
console.log('PORT=1337');
console.log('NODE_ENV=production');

console.log('\n# Variables de Base de Datos PostgreSQL');
console.log('DATABASE_CLIENT=postgres');
console.log('DATABASE_SSL=true');
console.log('\n# Railway provee estas automáticamente si agregaste PostgreSQL:');
console.log('# DATABASE_URL=${DATABASE_URL}');
console.log('# O usa estas individuales:');
console.log('# DATABASE_HOST=${PGHOST}');
console.log('# DATABASE_PORT=${PGPORT}');
console.log('# DATABASE_NAME=${PGDATABASE}');
console.log('# DATABASE_USERNAME=${PGUSER}');
console.log('# DATABASE_PASSWORD=${PGPASSWORD}');

console.log('\n' + '='.repeat(80));
console.log('\n✅ PRÓXIMOS PASOS:\n');
console.log('1. Ve a Railway.app → Tu Proyecto → Backend Service');
console.log('2. Click en la pestaña "Variables"');
console.log('3. Copia y pega cada variable de arriba');
console.log('4. Guarda y espera a que Railway redeploy automáticamente');
console.log('5. Visita tu backend en: https://tu-app.railway.app/admin\n');
