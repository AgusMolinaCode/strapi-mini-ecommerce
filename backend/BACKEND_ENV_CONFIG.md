# Configuración del Backend (Strapi)

## 📋 Variables de Entorno Necesarias

### Variables Básicas de Strapi
| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `HOST` | Host del servidor | ✅ |
| `PORT` | Puerto del servidor | ✅ |
| `NODE_ENV` | Ambiente (development/production) | ✅ |
| `APP_KEYS` | Claves para encriptación de sesiones | ✅ |
| `API_TOKEN_SALT` | Salt para tokens de API | ✅ |
| `ADMIN_JWT_SECRET` | Secret para JWT del admin | ✅ |
| `TRANSFER_TOKEN_SALT` | Salt para tokens de transferencia | ✅ |
| `JWT_SECRET` | Secret para JWT | ✅ |

### Variables de Base de Datos
| Variable | Descripción | Desarrollo | Producción |
|----------|-------------|------------|------------|
| `DATABASE_CLIENT` | Tipo de DB (sqlite/postgres) | sqlite | postgres |
| `DATABASE_HOST` | Host de PostgreSQL | - | ✅ |
| `DATABASE_PORT` | Puerto de PostgreSQL | - | 5432 |
| `DATABASE_NAME` | Nombre de la DB | - | ✅ |
| `DATABASE_USERNAME` | Usuario de PostgreSQL | - | ✅ |
| `DATABASE_PASSWORD` | Contraseña de PostgreSQL | - | ✅ |
| `DATABASE_SSL` | Usar SSL para conexión | false | true |

---

## 🏗️ Configuración por Ambiente

### **DESARROLLO LOCAL (SQLite)**

**Archivo:** `backend/.env`
```env
# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=development

# Secrets (usa valores de ejemplo para local)
APP_KEYS="key1,key2,key3,key4"
API_TOKEN_SALT=saltExample123
ADMIN_JWT_SECRET=adminSecretExample123
TRANSFER_TOKEN_SALT=transferSaltExample123
JWT_SECRET=jwtSecretExample123

# Database - SQLite (no requiere configuración adicional)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

**Comando:**
```bash
cd backend
npm run develop
# Strapi Admin: http://localhost:1337/admin
```

---

### **PRODUCCIÓN en RAILWAY (PostgreSQL)**

**⚠️ NO uses archivos .env en producción - Configura en Railway Dashboard**

#### 📍 **Dónde Configurar:**

1. Ve a [Railway.app](https://railway.app) → Tu proyecto
2. Selecciona el servicio del **backend** (Strapi)
3. Click en pestaña **"Variables"**
4. Agrega cada variable manualmente

#### 🔑 **Variables a Configurar:**

```env
# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Secrets - ⚠️ GENERA VALORES ÚNICOS Y SEGUROS
APP_KEYS=<clave-segura-1>,<clave-segura-2>,<clave-segura-3>,<clave-segura-4>
API_TOKEN_SALT=<salt-seguro-aleatorio>
ADMIN_JWT_SECRET=<secret-jwt-admin-seguro>
TRANSFER_TOKEN_SALT=<salt-transfer-seguro>
JWT_SECRET=<secret-jwt-seguro>

# Database - PostgreSQL de Railway
DATABASE_CLIENT=postgres
DATABASE_HOST=${PGHOST}              # Railway provee esto automáticamente
DATABASE_PORT=${PGPORT}              # Railway provee esto automáticamente
DATABASE_NAME=${PGDATABASE}          # Railway provee esto automáticamente
DATABASE_USERNAME=${PGUSER}          # Railway provee esto automáticamente
DATABASE_PASSWORD=${PGPASSWORD}      # Railway provee esto automáticamente
DATABASE_SSL=true
```

#### 💡 **Tip de Railway:**

Si agregaste PostgreSQL desde Railway, usa las variables que Railway provee automáticamente:

```env
# Opción A: Usar DATABASE_URL (más simple)
DATABASE_CLIENT=postgres
DATABASE_URL=${DATABASE_URL}  # Railway la provee automáticamente

# Opción B: Usar variables individuales
DATABASE_CLIENT=postgres
DATABASE_HOST=${PGHOST}
DATABASE_PORT=${PGPORT}
DATABASE_NAME=${PGDATABASE}
DATABASE_USERNAME=${PGUSER}
DATABASE_PASSWORD=${PGPASSWORD}
DATABASE_SSL=true
```

---

## 🔐 Generar Secrets Seguros

Para producción, genera valores aleatorios seguros:

**Opción 1: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Opción 2: OpenSSL**
```bash
openssl rand -base64 32
```

**Opción 3: Herramienta Online**
- [randomkeygen.com](https://randomkeygen.com/)

**Ejemplo de APP_KEYS:**
```env
APP_KEYS="Kx9j2Lm3Pq4Rv5Sw6Tx7Uy8Vz9,Aa1Bb2Cc3Dd4Ee5Ff6Gg7Hh8,Ii9Jj0Kk1Ll2Mm3Nn4Oo5Pp6,Qq7Rr8Ss9Tt0Uu1Vv2Ww3Xx4"
```

---

## 📁 Estructura de Archivos

```
backend/
├── .env                 # Local development (git ignored)
├── .env.example         # Template (commited to git)
├── config/
│   └── database.ts     # Database configuration logic
└── BACKEND_ENV_CONFIG.md  # Esta documentación
```

---

## ✅ Checklist de Deploy

### Antes de deployar a Railway:

- [ ] PostgreSQL service agregado en Railway
- [ ] Variables de entorno configuradas en Railway dashboard
- [ ] Secrets generados con valores aleatorios seguros
- [ ] `DATABASE_CLIENT=postgres` configurado
- [ ] `DATABASE_SSL=true` configurado
- [ ] `NODE_ENV=production` configurado
- [ ] Build exitoso en Railway
- [ ] Strapi admin accesible en `https://tu-app.railway.app/admin`

---

## 🚨 Errores Comunes

**Error: "Client does not support authentication protocol"**
- Solución: Asegúrate que `DATABASE_CLIENT=postgres`

**Error: "Connection timeout"**
- Solución: Verifica que `DATABASE_SSL=true` en Railway

**Error: "Invalid APP_KEYS"**
- Solución: `APP_KEYS` debe tener formato: `"key1,key2,key3,key4"`

**Error: "Cannot connect to database"**
- Solución: Verifica que las variables `DATABASE_*` estén configuradas correctamente

---

## 📞 Soporte

- [Strapi Docs](https://docs.strapi.io/)
- [Railway Docs](https://docs.railway.app/)
- [PostgreSQL en Railway](https://docs.railway.app/databases/postgresql)
