# 🚀 Solución para Error de Deploy en Railway

## ❌ Error Original

```
ERROR: failed to build: process "/bin/bash -ol pipefail -c cd backend && npm install && npm run build"
did not complete successfully: exit code: 127
/bin/bash: line 1: npm: command not found
```

**Causa:** Railway/Nixpacks no detecta Node.js porque `package.json` está en `/backend` (monorepo), no en la raíz.

---

## ✅ Soluciones (Elige UNA)

### **OPCIÓN 1: Usar Root Directory (MÁS SIMPLE)** ⭐ RECOMENDADO

Esta es la solución más limpia y simple.

#### Pasos:

1. **Ve a Railway Dashboard**
   - Abre tu proyecto en [Railway.app](https://railway.app)
   - Click en el servicio del **Backend** (Strapi)

2. **Configurar Root Directory**
   - Ve a **Settings** → **Service Settings**
   - Busca **"Root Directory"**
   - Cambia de `/` a `/backend`
   - Click **"Save"**

3. **Eliminar railway.json en la raíz** (ya no es necesario)
   ```bash
   git rm railway.json
   git commit -m "Remove railway.json - using Root Directory instead"
   git push
   ```

4. **Redeploy**
   - Railway detectará automáticamente el `package.json` en `/backend`
   - El build se ejecutará automáticamente

**✅ Ventaja:** Railway tratará `/backend` como si fuera la raíz del proyecto.

---

### **OPCIÓN 2: Usar nixpacks.toml (YA CONFIGURADO)** ✅

Ya he pusheado el archivo `nixpacks.toml` que instala Node.js y configura los comandos correctamente.

#### Pasos:

1. **El archivo ya está en tu repo:**
   ```toml
   # nixpacks.toml (en la raíz)
   [phases.setup]
   nixPkgs = ["nodejs_20", "npm-9_x"]

   [phases.install]
   cmds = ["cd backend && npm ci"]

   [phases.build]
   cmds = ["cd backend && npm run build"]

   [start]
   cmd = "cd backend && npm run start"
   ```

2. **Redeploy en Railway:**
   - Railway detectará el `nixpacks.toml` automáticamente
   - El build debería funcionar ahora

3. **Verificar:**
   - Ve a **Deployments** en Railway
   - Revisa los logs para confirmar que el build fue exitoso

**✅ Ventaja:** Mantiene la estructura de monorepo completa.

---

## 🎯 Mi Recomendación

**USA OPCIÓN 1 (Root Directory = /backend)**

Es más simple y Railway manejará todo automáticamente. Solo necesitas:

1. Cambiar Root Directory a `/backend` en Railway Settings
2. Opcional: Eliminar `railway.json` de la raíz (ya no se necesita)
3. Redeploy

---

## 📋 Variables de Entorno en Railway

**NO OLVIDES configurar estas variables en Railway Dashboard:**

```env
# Base de Datos
DATABASE_CLIENT=postgres
DATABASE_URL=${DATABASE_URL}  # Railway la provee automáticamente

# O usar variables individuales:
DATABASE_HOST=${PGHOST}
DATABASE_PORT=${PGPORT}
DATABASE_NAME=${PGDATABASE}
DATABASE_USERNAME=${PGUSER}
DATABASE_PASSWORD=${PGPASSWORD}
DATABASE_SSL=true

# Servidor
NODE_ENV=production
HOST=0.0.0.0
PORT=1337

# Secrets (genera valores únicos)
APP_KEYS=<genera-4-claves-separadas-por-comas>
API_TOKEN_SALT=<valor-aleatorio>
ADMIN_JWT_SECRET=<valor-aleatorio>
TRANSFER_TOKEN_SALT=<valor-aleatorio>
JWT_SECRET=<valor-aleatorio>
```

**Generar secrets seguros:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## ✅ Checklist Post-Deploy

Después de deployar exitosamente:

- [ ] Build completado sin errores
- [ ] Servicio está en estado "Active"
- [ ] Visitar `https://tu-backend.railway.app/admin`
- [ ] Crear cuenta de admin en Strapi
- [ ] Verificar que el frontend puede conectarse al backend
- [ ] Verificar que los datos se guardan en PostgreSQL

---

## 🆘 Si sigue fallando

### Verifica en Railway Logs:

1. **Ve a Deployments → View Logs**
2. Busca estos mensajes:

**✅ Éxito:**
```
✓ Compiled successfully
✓ Server listening on http://0.0.0.0:1337
✓ Database connection established
```

**❌ Error de DB:**
```
Error: connect ECONNREFUSED
```
**Solución:** Verifica variables `DATABASE_*` en Railway

**❌ Error de Secrets:**
```
Error: APP_KEYS is required
```
**Solución:** Agrega las variables APP_KEYS, JWT_SECRET, etc.

---

## 📞 Próximos Pasos

1. Elige Opción 1 o 2 (recomiendo Opción 1)
2. Configura variables de entorno
3. Redeploy
4. Verifica que funcione visitando `/admin`
5. Actualiza `NEXT_PUBLIC_STRAPI_URL` en frontend si cambió la URL

**¿Necesitas ayuda?** Comparte los logs de Railway para diagnosticar el problema.
