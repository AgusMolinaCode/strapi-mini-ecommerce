# 🚀 Cómo Agregar Variables de Entorno en Railway

## ✅ Ya generaste los secrets

Acabas de ejecutar `node scripts/generate-secrets.js` y tienes los valores listos.

---

## 📋 Paso a Paso en Railway

### **1. Ir a Railway Dashboard**

1. Abre [Railway.app](https://railway.app)
2. Inicia sesión
3. Selecciona tu proyecto `strapi-mini-ecommerce`
4. Click en el servicio del **Backend** (no la base de datos)

---

### **2. Ir a Variables**

1. En el servicio del Backend, verás varias pestañas:
   - Settings
   - **Variables** ← Click aquí
   - Deployments
   - Metrics

---

### **3. Agregar Variables**

Hay dos formas de agregar variables:

#### **Opción A: Una por una (Más visual)**

1. Click en **"+ New Variable"**
2. En **"Variable Name"**, escribe: `APP_KEYS`
3. En **"Value"**, pega el valor generado
4. Repite para cada variable

#### **Opción B: Todas a la vez (Más rápido)** ⭐ RECOMENDADO

1. Click en **"RAW Editor"** (esquina superior derecha)
2. Pega TODAS las variables de una vez:

```env
APP_KEYS=csodLiG2MjobQOM9VmIezvnu6b42sSXPgLwE0Lxj9Dc=,+T+HpJr6w0Sn//DyvCmmHkXddCcog9emHFFc7wfQm7E=,mSECvCYQLcIx80SM8+FcxvYpIDaWIzEcS+1EnZsxQpo=,rbuz8AdDrjsYCRIhAwdCo7RkyC0nruvG0fE+f2nMBF8=
API_TOKEN_SALT=o6t2EBufiTZksrKoAa5ybrrHUaYpCHS45TYKGZQKXDA=
ADMIN_JWT_SECRET=/szP+z6vS+1EdiCNiww4V2fkaGHVHfJZt9+DZT/KU1I=
TRANSFER_TOKEN_SALT=SnkWdoE+D058Ho4wiMuP9+TwxMoiIRu/WzTFaHBlYg0=
JWT_SECRET=bqnvkRtJ0P4+5PXZSkh/FDBS+uMWNuE7fqWTXEki+8c=
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_SSL=true
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

3. Click **"Update Variables"**

---

### **4. Railway Redeployará Automáticamente**

1. Verás un mensaje: "Deploying..."
2. Ve a la pestaña **"Deployments"**
3. Espera a que el estado cambie a **"Success"** (puede tardar 1-3 minutos)

---

## 🔍 Verificar que Funcionó

### **Ver Logs:**

1. Ve a **Deployments** → Click en el último deploy
2. Click en **"View Logs"**
3. Busca estos mensajes:

**✅ ÉXITO - Deberías ver:**
```
✓ Server listening on http://0.0.0.0:1337
✓ [2025-10-24] info: Server started
✓ Welcome back!
```

**❌ ERROR - Si ves esto, algo falta:**
```
Missing admin.auth.secret configuration
```
**Solución:** Verifica que agregaste `ADMIN_JWT_SECRET`

---

## 🌐 Acceder a tu Strapi

Una vez que el deploy sea exitoso:

1. **URL del Admin:**
   ```
   https://tu-backend-app.up.railway.app/admin
   ```

2. **Primera vez:**
   - Strapi te pedirá crear una cuenta de administrador
   - Completa el formulario
   - ¡Ya tienes tu Strapi funcionando!

3. **URL para el frontend:**
   - Copia la URL de Railway (ej: `https://strapi-production-77cb.up.railway.app`)
   - Esta es la que usarás en `NEXT_PUBLIC_STRAPI_URL` del frontend

---

## 📝 Checklist Final

Asegúrate de tener TODAS estas variables en Railway:

### Secrets (Obligatorias):
- [ ] `APP_KEYS` (4 claves separadas por comas)
- [ ] `API_TOKEN_SALT`
- [ ] `ADMIN_JWT_SECRET`
- [ ] `TRANSFER_TOKEN_SALT`
- [ ] `JWT_SECRET`

### Servidor (Obligatorias):
- [ ] `HOST=0.0.0.0`
- [ ] `PORT=1337`
- [ ] `NODE_ENV=production`

### Base de Datos (Obligatorias):
- [ ] `DATABASE_CLIENT=postgres`
- [ ] `DATABASE_SSL=true`
- [ ] `DATABASE_URL=${{Postgres.DATABASE_URL}}` (Railway lo provee)

---

## 🆘 Solución de Problemas

### **Error: "Missing admin.auth.secret"**
**Causa:** Falta `ADMIN_JWT_SECRET`
**Solución:** Agrega la variable en Railway

### **Error: "Cannot connect to database"**
**Causa:** Variables de base de datos incorrectas
**Solución:** Verifica que `DATABASE_URL` esté configurada

### **Error: "Invalid APP_KEYS"**
**Causa:** Formato incorrecto (debe tener 4 claves separadas por comas)
**Solución:** Verifica que `APP_KEYS` tenga formato: `"clave1,clave2,clave3,clave4"`

### **Build exitoso pero el servicio crashea**
**Causa:** Falta alguna variable de entorno
**Solución:** Revisa los logs y agrega la variable que falta

---

## 🎯 Después de que funcione

1. **Crear cuenta de admin en Strapi**
   - Visita `/admin`
   - Completa el formulario de registro
   - Guarda tus credenciales

2. **Actualizar frontend** (si cambió la URL)
   ```env
   # frontend/.env.local
   NEXT_PUBLIC_STRAPI_URL=https://tu-nueva-url.railway.app
   ```

3. **Probar la conexión**
   - Crea un producto de prueba en Strapi
   - Verifica que aparezca en tu frontend

---

## 💾 Guardar los Secrets

**⚠️ IMPORTANTE:** Guarda los secrets generados en un lugar seguro:

1. **Opción 1:** Gestor de contraseñas (1Password, Bitwarden, LastPass)
2. **Opción 2:** Archivo cifrado localmente
3. **❌ NO:** Commitear a git (ya están en Railway)

Los necesitarás si:
- Migras a otro servidor
- Necesitas recrear el proyecto
- Agregas nuevas instancias de Strapi

---

¿Todo listo? ¡Deberías tener Strapi funcionando en Railway! 🎉
