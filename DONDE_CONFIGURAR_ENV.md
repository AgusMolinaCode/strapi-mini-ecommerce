# 🎯 Guía Rápida: ¿Dónde Configurar Variables de Entorno?

## 📊 Resumen Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                        TU PROYECTO                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐        ┌──────────────────────┐      │
│  │   BACKEND (Strapi)   │        │  FRONTEND (Next.js)  │      │
│  │   Puerto 1337        │        │   Puerto 3000        │      │
│  └──────────────────────┘        └──────────────────────┘      │
│                                                                  │
│  📍 Variables en:                📍 Variables en:               │
│  ━━━━━━━━━━━━━━━━                ━━━━━━━━━━━━━━━━               │
│                                                                  │
│  🏠 Local:                       🏠 Local:                      │
│  backend/.env                    frontend/.env.local            │
│  ├─ DATABASE_CLIENT=sqlite       ├─ NEXT_PUBLIC_STRAPI_URL     │
│  ├─ DATABASE_FILENAME=...        ├─ NEXT_PUBLIC_FRONTEND_URL   │
│  ├─ APP_KEYS=...                 ├─ MERCADOPAGO_ACCESS_TOKEN   │
│  └─ JWT_SECRET=...               └─ NEXT_PUBLIC_MERCADOPAGO... │
│                                                                  │
│  ☁️ Railway (Producción):       ☁️ Railway (Producción):       │
│  Dashboard → Variables           Dashboard → Variables          │
│  ├─ DATABASE_CLIENT=postgres     ├─ NEXT_PUBLIC_STRAPI_URL     │
│  ├─ DATABASE_HOST=${PGHOST}      ├─ NEXT_PUBLIC_FRONTEND_URL   │
│  ├─ DATABASE_PORT=5432           ├─ MERCADOPAGO_ACCESS_TOKEN   │
│  ├─ DATABASE_NAME=...            └─ NEXT_PUBLIC_MERCADOPAGO... │
│  ├─ DATABASE_USERNAME=...                                       │
│  ├─ DATABASE_PASSWORD=...                                       │
│  ├─ DATABASE_SSL=true                                           │
│  ├─ NODE_ENV=production                                         │
│  └─ APP_KEYS=...                                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Respuesta Rápida a tu Pregunta

### Las variables de PostgreSQL van en **RAILWAY DASHBOARD**, NO en archivos locales.

---

## 📋 Paso a Paso para Railway

### **BACKEND en Railway** (Strapi con PostgreSQL)

1. **Ir a Railway:**
   ```
   https://railway.app → Tu Proyecto → Servicio Backend
   ```

2. **Click en "Variables"**

3. **Agregar estas variables:**

   ```env
   # Base de Datos PostgreSQL
   DATABASE_CLIENT=postgres
   DATABASE_HOST=${PGHOST}              ← Railway lo provee automáticamente
   DATABASE_PORT=${PGPORT}              ← Railway lo provee automáticamente
   DATABASE_NAME=${PGDATABASE}          ← Railway lo provee automáticamente
   DATABASE_USERNAME=${PGUSER}          ← Railway lo provee automáticamente
   DATABASE_PASSWORD=${PGPASSWORD}      ← Railway lo provee automáticamente
   DATABASE_SSL=true

   # Configuración del Servidor
   NODE_ENV=production
   HOST=0.0.0.0
   PORT=1337

   # Secrets (genera valores únicos y seguros)
   APP_KEYS=<genera-4-claves-separadas-por-comas>
   API_TOKEN_SALT=<genera-valor-aleatorio>
   ADMIN_JWT_SECRET=<genera-valor-aleatorio>
   TRANSFER_TOKEN_SALT=<genera-valor-aleatorio>
   JWT_SECRET=<genera-valor-aleatorio>
   ```

4. **💡 Tip:** Si agregaste PostgreSQL desde Railway, puedes usar:
   ```env
   DATABASE_CLIENT=postgres
   DATABASE_URL=${DATABASE_URL}   ← Más simple, Railway lo maneja todo
   ```

---

### **FRONTEND en Railway** (cuando lo despliegues)

1. **Ir a Railway:**
   ```
   https://railway.app → Tu Proyecto → Servicio Frontend
   ```

2. **Click en "Variables"**

3. **Agregar estas variables:**

   ```env
   NEXT_PUBLIC_STRAPI_URL=https://strapi-production-77cb.up.railway.app
   NEXT_PUBLIC_FRONTEND_URL=https://tu-frontend-app.railway.app  ← URL de tu frontend deployado
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-2856796838524308-071220-a393d7c21bae06130536ff38b3eb975a-34687326
   NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-934ee029-e0d9-429d-a4c1-7cfc1db330d0
   ```

---

## 🏠 Variables Locales (Desarrollo)

### **BACKEND Local** (si quieres correr Strapi localmente)

**Archivo:** `backend/.env`

```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=development

# Para desarrollo local usa SQLite (más simple)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Secrets (valores de ejemplo para local)
APP_KEYS="key1,key2,key3,key4"
API_TOKEN_SALT=local_salt
ADMIN_JWT_SECRET=local_admin_secret
TRANSFER_TOKEN_SALT=local_transfer_salt
JWT_SECRET=local_jwt_secret
```

---

### **FRONTEND Local** (desarrollo)

**Archivo:** `frontend/.env.local`

```env
NEXT_PUBLIC_STRAPI_URL=https://strapi-production-77cb.up.railway.app
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
MERCADOPAGO_ACCESS_TOKEN=APP_USR-2856796838524308-071220-a393d7c21bae06130536ff38b3eb975a-34687326
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-934ee029-e0d9-429d-a4c1-7cfc1db330d0
```

---

## 🔑 Generar Secrets para Producción

**En tu terminal:**

```bash
# Genera un secret aleatorio
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Para APP_KEYS, genera 4 y sepáralos con comas:
APP_KEYS="clave1,clave2,clave3,clave4"
```

---

## ✅ Checklist

### Para BACKEND en Railway:
- [ ] PostgreSQL service agregado en Railway
- [ ] `DATABASE_CLIENT=postgres` en Variables
- [ ] Variables `DATABASE_*` configuradas (o usar `DATABASE_URL`)
- [ ] `DATABASE_SSL=true` configurado
- [ ] `NODE_ENV=production` configurado
- [ ] Secrets generados con valores seguros
- [ ] Deploy exitoso
- [ ] Admin accesible en `https://tu-backend.railway.app/admin`

### Para FRONTEND en Railway (cuando despliegues):
- [ ] `NEXT_PUBLIC_STRAPI_URL` apunta a tu backend en Railway
- [ ] `NEXT_PUBLIC_FRONTEND_URL` usa la URL del frontend deployado
- [ ] Variables de MercadoPago configuradas
- [ ] Build exitoso (`npm run build`)
- [ ] App accesible en `https://tu-frontend.railway.app`

---

## 📚 Documentación Completa

- **Backend:** Ver `backend/BACKEND_ENV_CONFIG.md`
- **Frontend:** Ver `frontend/ENV_CONFIG.md`

---

## ❓ FAQ Rápido

**Q: ¿Dónde pongo las variables de PostgreSQL?**
A: En Railway Dashboard → Variables (NO en archivos locales)

**Q: ¿Necesito un .env en Railway?**
A: NO. Railway usa su propio sistema de variables de entorno.

**Q: ¿Puedo usar el mismo .env para local y producción?**
A: NO recomendado. Usa `.env` local con SQLite y Railway variables con PostgreSQL.

**Q: ¿Cómo sé que mis variables están cargadas en Railway?**
A: Ve a Deployments → Logs y busca mensajes de conexión a la base de datos.

**Q: Mi Strapi no conecta a PostgreSQL, ¿qué hago?**
A: Verifica que `DATABASE_SSL=true` y que las variables `DATABASE_*` existan en Railway.
