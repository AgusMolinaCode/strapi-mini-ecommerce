# 🔧 Conectar Repo GitHub con Strapi en Railway

## 📌 Situación Actual

Tienes 3 servicios en Railway:
- **PostgreSQL** (base de datos)
- **Servicio Strapi** (template con variables configuradas)
- **Servicio Repo GitHub** (tu código con /backend)

**Problema:** Servicios duplicados - necesitas consolidar en UNO.

---

## ✅ Solución: Usar SOLO el Servicio del Repo GitHub

### Por qué esta opción:
- ✅ Tienes tu código custom
- ✅ Control total sobre el código
- ✅ Fácil de actualizar (git push)
- ✅ Mantiene estructura de monorepo

---

## 📋 Guía Paso a Paso

### **PASO 1: Configurar Variables en Servicio del Repo**

#### 1.1 Ir al Servicio Correcto
```
Railway → Tu Proyecto → Servicio "GitHub Repo" (NO el template)
```

#### 1.2 Copiar Todas las Variables

Ve a **Variables** → **RAW Editor** y pega:

```env
# ========================================
# SECRETS DE STRAPI
# ========================================
ADMIN_JWT_SECRET=p2um8o54ipikgqh21pri6v8kdkowr460
API_TOKEN_SALT=jkw470lyvl0qgaklyfprwz3mc2o9fnmw
JWT_SECRET=wmj9nol24liqdo4z3uwbc1156x46ryok
TRANSFER_TOKEN_SALT=rkmnxe718cr8ii2bkfexfwak79ep6o0a

# APP_KEYS - Strapi recomienda 4 claves separadas por comas
# Si tienes problemas, genera 4 nuevas claves
APP_KEYS=u9wpbfyp4p8ic0ftesbt8gh7zlp4gy2t,u9wpbfyp4p8ic0ftesbt8gh7zlp4gy2t,u9wpbfyp4p8ic0ftesbt8gh7zlp4gy2t,u9wpbfyp4p8ic0ftesbt8gh7zlp4gy2t

# ========================================
# SERVIDOR
# ========================================
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# ========================================
# BASE DE DATOS POSTGRESQL
# ========================================
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_SSL=true

# ========================================
# CONFIGURACIÓN STRAPI
# ========================================
STRAPI_DISABLE_UPDATE_NOTIFICATION=true
STRAPI_TELEMETRY_DISABLED=true
BROWSER=false

# ========================================
# URL PÚBLICA
# ========================================
URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
```

Click **"Update Variables"**

---

### **PASO 2: Verificar Configuración del Servicio**

#### 2.1 Root Directory
```
Settings → Root Directory → /backend ✅
```

#### 2.2 Conectar PostgreSQL
```
Settings → Connect → Seleccionar "Postgres" service
```

---

### **PASO 3: Redeploy y Verificar**

#### 3.1 Esperar Redeploy
- Railway redeployará automáticamente (1-3 min)
- Ve a **Deployments** para ver progreso

#### 3.2 Revisar Logs
Click en el último deploy → **View Logs**

**✅ ÉXITO - Buscas:**
```
✓ Server listening on http://0.0.0.0:1337
✓ Database connection established
✓ [database] Connection to database created
✓ Welcome back!
```

**❌ ERROR común:**
```
Error: Missing admin.auth.secret
```
**Solución:** Verifica que `ADMIN_JWT_SECRET` esté en variables

```
Error: connect ECONNREFUSED
```
**Solución:** Verifica `DATABASE_URL` y conexión a PostgreSQL

---

### **PASO 4: Acceder a Strapi Admin**

1. Copia la URL de tu servicio (ej: `https://strapi-mini-ecommerce-production.up.railway.app`)
2. Visita: `https://tu-url.railway.app/admin`
3. Si es primera vez: crear cuenta de administrador
4. Si migras datos: tus datos deberían estar en PostgreSQL

---

### **PASO 5: Actualizar Frontend**

Una vez que funcione, actualiza la URL en tu frontend:

```env
# frontend/.env.local
NEXT_PUBLIC_STRAPI_URL=https://tu-url-nueva.railway.app
```

---

### **PASO 6: Eliminar Servicio Duplicado** (Opcional)

Una vez que TODO funcione correctamente:

1. Ve al servicio **"Strapi"** (template - el que NO estás usando)
2. **Settings** → **"Delete Service"**
3. Confirma eliminación

**⚠️ IMPORTANTE:**
- ✅ Elimina: Servicio Strapi template (duplicado)
- ❌ NO elimines: PostgreSQL
- ❌ NO elimines: Servicio del repo GitHub

---

## 🔍 Estructura Final

```
Railway Project
│
├── 🗄️ PostgreSQL
│   ├── DATABASE_URL
│   ├── PGHOST
│   ├── PGPORT
│   └── PGPASSWORD
│
└── 📦 strapi-mini-ecommerce (GitHub Repo)
    ├── Root Directory: /backend
    ├── Build: npm install && npm run build
    ├── Start: npm run start
    ├── Variables: ↓
    │   ├── DATABASE_URL → ${{Postgres.DATABASE_URL}}
    │   ├── APP_KEYS
    │   ├── JWT_SECRET
    │   └── ... (todas las demás)
    └── Connected to: PostgreSQL ✓
```

---

## 📊 Checklist de Variables

Asegúrate de tener TODAS estas en el servicio del repo:

### Secrets (del template Strapi):
- [ ] `ADMIN_JWT_SECRET=p2um8o54ipikgqh21pri6v8kdkowr460`
- [ ] `API_TOKEN_SALT=jkw470lyvl0qgaklyfprwz3mc2o9fnmw`
- [ ] `APP_KEYS=...` (4 claves separadas por comas)
- [ ] `JWT_SECRET=wmj9nol24liqdo4z3uwbc1156x46ryok`
- [ ] `TRANSFER_TOKEN_SALT=rkmnxe718cr8ii2bkfexfwak79ep6o0a`

### Servidor:
- [ ] `HOST=0.0.0.0`
- [ ] `PORT=1337`
- [ ] `NODE_ENV=production`

### Base de Datos (CRÍTICAS):
- [ ] `DATABASE_CLIENT=postgres` ← **ESTO FALTABA**
- [ ] `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- [ ] `DATABASE_SSL=true` ← **ESTO FALTABA**

### Configuración:
- [ ] `STRAPI_DISABLE_UPDATE_NOTIFICATION=true`
- [ ] `STRAPI_TELEMETRY_DISABLED=true`
- [ ] `URL=https://${{RAILWAY_PUBLIC_DOMAIN}}`

---

## 🆘 Troubleshooting

### Error: "Missing admin.auth.secret"
**Causa:** Falta `ADMIN_JWT_SECRET`
**Solución:** Agrega la variable con el valor del template

### Error: "Cannot connect to database"
**Causa:** PostgreSQL no conectado o variables incorrectas
**Solución:**
1. Verifica que `DATABASE_CLIENT=postgres`
2. Verifica que `DATABASE_URL=${{Postgres.DATABASE_URL}}`
3. Ve a Settings → Connect → Selecciona PostgreSQL

### Error: "Invalid APP_KEYS format"
**Causa:** APP_KEYS debe tener 4 claves separadas por comas
**Solución:** Actualiza a formato: `clave1,clave2,clave3,clave4`

### Build funciona pero crashea al iniciar
**Causa:** Falta alguna variable de entorno
**Solución:** Revisa logs y agrega la variable que falta

---

## 🎯 Resultado Esperado

Después de seguir estos pasos:

1. ✅ Servicio del repo GitHub funcionando
2. ✅ Conectado a PostgreSQL
3. ✅ Strapi admin accesible en `/admin`
4. ✅ Frontend puede conectarse al backend
5. ✅ Un solo servicio de Strapi (sin duplicados)

---

## 💾 Backup de Variables Actuales

Guarda estas variables en un lugar seguro (por si las necesitas):

```env
# Variables del Template Strapi (backup)
ADMIN_JWT_SECRET=p2um8o54ipikgqh21pri6v8kdkowr460
API_TOKEN_SALT=jkw470lyvl0qgaklyfprwz3mc2o9fnmw
APP_KEYS=u9wpbfyp4p8ic0ftesbt8gh7zlp4gy2t
JWT_SECRET=wmj9nol24liqdo4z3uwbc1156x46ryok
TRANSFER_TOKEN_SALT=rkmnxe718cr8ii2bkfexfwak79ep6o0a
```

---

¿Listo para configurar las variables en el servicio correcto? Sigue el PASO 1 y avísame cómo va.
