# 🔧 Variables de Entorno - Guía Completa

## 📁 Estructura de Archivos

```
strapi-mini-ecommerce/
├── backend/
│   ├── .env                    ← Desarrollo local (git ignored)
│   ├── .env.example            ← Template (commited)
│   └── RAILWAY_VARS.md         ← Variables para Railway
│
└── frontend/
    ├── .env.local              ← Desarrollo local (git ignored)
    ├── .env.example            ← Template (commited)
    └── RAILWAY_VARS.md         ← Variables para Railway
```

---

## 🏠 DESARROLLO LOCAL

### **Backend Local** (`backend/.env`)

```env
# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=development

# Secrets (valores de ejemplo - OK para local)
APP_KEYS=u9wpbfyp4p8ic0ftesbt8gh7zlp4gy2t,jkw470lyvl0qgaklyfprwz3mc2o9fnmw,p2um8o54ipikgqh21pri6v8kdkowr460,rkmnxe718cr8ii2bkfexfwak79ep6o0a
API_TOKEN_SALT=jkw470lyvl0qgaklyfprwz3mc2o9fnmw
ADMIN_JWT_SECRET=p2um8o54ipikgqh21pri6v8kdkowr460
TRANSFER_TOKEN_SALT=rkmnxe718cr8ii2bkfexfwak79ep6o0a
ENCRYPTION_KEY=QR17idJjAooNVdhYZ6pXcA==
JWT_SECRET=wmj9nol24liqdo4z3uwbc1156x46ryok

# Database - SQLite (más fácil para desarrollo)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Comandos:**
```bash
cd backend
npm run develop
# Strapi: http://localhost:1337/admin
```

---

### **Frontend Local** (`frontend/.env.local`)

```env
# Backend - Apunta a Strapi en Railway (o localhost:1337 si corres local)
NEXT_PUBLIC_STRAPI_URL=https://strapi-production-77cb.up.railway.app

# Frontend - Tu app local
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-2856796838524308-071220-a393d7c21bae06130536ff38b3eb975a-34687326
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-934ee029-e0d9-429d-a4c1-7cfc1db330d0
```

**Comandos:**
```bash
cd frontend
npm run dev
# Frontend: http://localhost:3000
```

---

## ☁️ RAILWAY PRODUCCIÓN

### **Backend en Railway**

**Dónde:** Railway Dashboard → Backend Service → Variables → RAW Editor

```env
# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Secrets - USA LOS VALORES QUE YA TIENES en Railway
APP_KEYS=u9wpbfyp4p8ic0ftesbt8gh7zlp4gy2t,jkw470lyvl0qgaklyfprwz3mc2o9fnmw,p2um8o54ipikgqh21pri6v8kdkowr460,rkmnxe718cr8ii2bkfexfwak79ep6o0a
API_TOKEN_SALT=jkw470lyvl0qgaklyfprwz3mc2o9fnmw
ADMIN_JWT_SECRET=p2um8o54ipikgqh21pri6v8kdkowr460
TRANSFER_TOKEN_SALT=rkmnxe718cr8ii2bkfexfwak79ep6o0a
ENCRYPTION_KEY=QR17idJjAooNVdhYZ6pXcA==
JWT_SECRET=wmj9nol24liqdo4z3uwbc1156x46ryok

# Database - PostgreSQL (Railway provee estas variables automáticamente)
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_SSL=true

# Strapi Config
STRAPI_DISABLE_UPDATE_NOTIFICATION=true
STRAPI_TELEMETRY_DISABLED=true
BROWSER=false

# URL Pública (Railway la llena automáticamente)
URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
```

**⚠️ IMPORTANTE:**
- ❌ NO pongas credenciales hardcodeadas de PostgreSQL
- ✅ USA `${{Postgres.DATABASE_URL}}` - Railway lo llena automáticamente
- ✅ `DATABASE_SSL=true` en producción

---

### **Frontend en Railway** (cuando lo despliegues)

**Dónde:** Railway Dashboard → Frontend Service → Variables → RAW Editor

```env
# Backend - URL de tu Strapi en Railway
NEXT_PUBLIC_STRAPI_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

# Frontend - URL de tu frontend en Railway
NEXT_PUBLIC_FRONTEND_URL=https://tu-frontend.up.railway.app

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=APP_USR-2856796838524308-071220-a393d7c21bae06130536ff38b3eb975a-34687326
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-934ee029-e0d9-429d-a4c1-7cfc1db330d0
```

**⚠️ Nota sobre `NEXT_PUBLIC_STRAPI_URL`:**
- Si frontend y backend están en **servicios separados**: usa la URL completa del backend
- Si están en el **mismo proyecto**: puedes usar `${{RAILWAY_PUBLIC_DOMAIN}}`

---

## 🔑 Cambios Importantes vs Tu Configuración Actual

### ✅ **Corregido en Backend:**

| Antes (MAL) | Ahora (BIEN) | Por qué |
|-------------|--------------|---------|
| `HOST=::` | `HOST=0.0.0.0` | Mejor compatibilidad |
| `APP_KEYS=una-sola` | `APP_KEYS=clave1,clave2,clave3,clave4` | Strapi requiere 4 |
| `DATABASE_URL=postgresql://...` | `DATABASE_URL=${{Postgres.DATABASE_URL}}` | No hardcodear credenciales |
| `DATABASE_SSL=false` | `DATABASE_SSL=true` | Railway requiere SSL |

### ✅ **Corregido en Frontend:**

| Antes (MAL) | Ahora (BIEN) | Por qué |
|-------------|--------------|---------|
| `NEXT_PUBLIC_STRAPI_URL=""https://..."" ` | `NEXT_PUBLIC_STRAPI_URL=https://...` | Comillas dobles causan error |

---

## 📋 Checklist

### Desarrollo Local:
- [ ] `backend/.env` creado con SQLite
- [ ] `frontend/.env.local` creado con URLs correctas
- [ ] Backend corre en `localhost:1337`
- [ ] Frontend corre en `localhost:3000`
- [ ] Frontend se conecta a backend

### Railway:
- [ ] Backend tiene todas las variables en Railway Dashboard
- [ ] `DATABASE_URL=${{Postgres.DATABASE_URL}}` configurado
- [ ] `DATABASE_SSL=true` configurado
- [ ] `APP_KEYS` tiene 4 claves separadas por comas
- [ ] Backend deployado y funcionando
- [ ] Frontend tiene variables configuradas
- [ ] Frontend deployado y funcionando

---

## 🔒 Seguridad

### ❌ NO commitear a git:
- `backend/.env`
- `frontend/.env.local`
- Credenciales de base de datos
- Access tokens de MercadoPago

### ✅ SÍ commitear a git:
- `backend/.env.example`
- `frontend/.env.example`
- Documentación
- Configuración de Railway (`railway.json`)

---

## 🆘 Problemas Comunes

### Error: "Invalid APP_KEYS format"
**Solución:** Asegúrate que `APP_KEYS` tenga 4 claves separadas por comas

### Error: "Cannot connect to database" en Railway
**Solución:** Verifica que `DATABASE_URL=${{Postgres.DATABASE_URL}}` y `DATABASE_SSL=true`

### Error: Frontend no se conecta al backend
**Solución:** Verifica que `NEXT_PUBLIC_STRAPI_URL` tenga la URL correcta sin comillas dobles

### Error: MercadoPago no funciona
**Solución:** Verifica que las credenciales estén correctas y sin comillas extra

---

## 🎯 Comandos Útiles

### Desarrollo Local:
```bash
# Backend
cd backend && npm run develop

# Frontend (nueva terminal)
cd frontend && npm run dev
```

### Ver variables en Railway:
```bash
# En Railway Dashboard → Service → Variables
```

### Regenerar secrets:
```bash
cd backend
node scripts/generate-secrets.js
```
