# 🚂 Configuración de Railway - Paso a Paso

## Problema Actual

Railway está ejecutando Strapi **PERO** sin las variables de entorno correctas, por eso no ve tus Content Types (planes, productos, categorías, etc.).

## Solución: Configurar Variables de Entorno en Railway

### Paso 1: Acceder a Railway

1. Ve a: **https://railway.app**
2. Inicia sesión
3. Busca tu proyecto **"Strapi"** o el nombre que le hayas dado
4. Click en el proyecto

### Paso 2: Ir a Variables de Entorno

1. En tu proyecto, deberías ver dos servicios:
   - **Postgres** (tu base de datos)
   - **Strapi** o el nombre de tu servicio backend

2. **Click en el servicio de Strapi** (NO en Postgres)

3. Busca la pestaña **"Variables"** en el menú superior

### Paso 3: Agregar Variables de Entorno

En la sección de Variables, agrega TODAS estas variables una por una:

#### Variables de Base de Datos

```
DATABASE_CLIENT=postgres
```

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```
*(Nota: Usa exactamente `${{Postgres.DATABASE_URL}}` - Railway lo reemplazará automáticamente)*

#### Variables de Servidor

```
HOST=0.0.0.0
```

```
PORT=1337
```

```
NODE_ENV=production
```

#### Variables de Seguridad (Strapi Secrets)

```
APP_KEYS=u9wpbfyp4p8ic0ftesbt8gh7zlp4gy2t
```

```
API_TOKEN_SALT=jkw470lyvl0qgaklyfprwz3mc2o9fnmw
```

```
ADMIN_JWT_SECRET=p2um8o54ipikgqh21pri6v8kdkowr460
```

```
TRANSFER_TOKEN_SALT=rkmnxe718cr8ii2bkfexfwak79ep6o0a
```

```
JWT_SECRET=wmj9nol24liqdo4z3uwbc1156x46ryok
```

#### Variables Opcionales

```
STRAPI_DISABLE_UPDATE_NOTIFICATION=true
```

```
STRAPI_TELEMETRY_DISABLED=true
```

### Paso 4: Guardar y Redeploy

1. Después de agregar **TODAS** las variables, Railway automáticamente hará redeploy
2. **O** puedes forzar el redeploy:
   - Ve a la pestaña "Deployments"
   - Click en los tres puntos (...) del último deployment
   - Click en "Redeploy"

### Paso 5: Esperar el Deploy (3-5 minutos)

Mientras esperas, verás:
- 🟡 **Building** - Compilando el código
- 🟡 **Deploying** - Desplegando la aplicación
- 🟢 **Active** - ¡Listo!

### Paso 6: Verificar que Funcione

Una vez que el deploy esté **Active** (verde):

1. Abre: **https://strapi-production-77cb.up.railway.app/admin**

2. Deberías ver:
   - Página de creación de administrador (primera vez)
   - O login si ya creaste uno

3. Crea tu usuario administrador

4. Una vez dentro, ve a **"Content-Type Builder"**
   - Deberías ver: Plan, Producto, Categoría, Order, Subscription, Home Page
   - Esto confirma que las tablas fueron creadas ✅

### Paso 7: Importar Datos

Una vez que veas los Content Types, avísame y ejecutaremos:

```bash
cd backend
node scripts/import-final.js
```

Esto importará automáticamente:
- ✅ 18 Productos
- ✅ 6 Planes
- ✅ 6 Categorías
- ✅ 4 Órdenes
- ✅ Imágenes y relaciones

---

## 🆘 Si algo sale mal

### Error: "Application failed to respond"

**Solución**: Verifica los logs
1. En Railway, ve a "Deployments"
2. Click en el último deployment
3. Revisa los logs para ver errores

### Error: No veo los Content Types

**Solución**: Verifica variables de entorno
1. Asegúrate de que `DATABASE_CLIENT=postgres`
2. Verifica que `DATABASE_URL` esté configurada
3. Redeploy manualmente

### ¿Cómo ver los logs?

1. Railway Dashboard → Tu proyecto
2. Click en el servicio Strapi
3. Pestaña "Deployments"
4. Click en el deployment activo
5. Verás los logs en tiempo real

---

## 📋 Checklist Final

Antes de continuar, asegúrate de haber:

- [ ] Agregado todas las variables de entorno
- [ ] El deployment está en estado "Active" (verde)
- [ ] Puedes acceder a `/admin`
- [ ] Creaste tu usuario administrador
- [ ] Ves los Content Types en "Content-Type Builder"

Una vez que **TODOS** los ítems estén ✅, avísame y ejecutamos el script de importación automática.

---

**¿Necesitas ayuda?**

Si tienes algún problema con Railway, avísame específicamente:
- ¿Qué paso estás haciendo?
- ¿Qué error ves?
- ¿Capturas de pantalla si es posible?

¡Estoy aquí para ayudarte! 🚀
