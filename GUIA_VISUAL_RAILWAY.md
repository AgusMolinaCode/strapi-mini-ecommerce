# 🎯 Guía Visual - Dónde Configurar Railway

## Paso 1: Acceder a Railway

1. Abre tu navegador
2. Ve a: **https://railway.app**
3. Inicia sesión con tu cuenta

---

## Paso 2: Encontrar tu Proyecto

1. Verás todos tus proyectos
2. **Busca el proyecto de Strapi** (puede llamarse "strapi-mini-ecommerce" o similar)
3. **Click en el proyecto** para abrirlo

---

## Paso 3: Identificar el Servicio Correcto

Dentro del proyecto verás **2 o más "tarjetas" o "cajas"**:

```
┌─────────────────┐    ┌─────────────────┐
│   Postgres      │    │   Strapi        │
│   (Database)    │    │   (Backend)     │
└─────────────────┘    └─────────────────┘
```

**IMPORTANTE**: Necesitas hacer click en el servicio de **Strapi** (NO en Postgres)

El servicio de Strapi puede tener:
- Un nombre como "strapi-mini-ecommerce"
- O simplemente el nombre de tu repositorio
- Generalmente está conectado a GitHub

---

## Paso 4: Abrir Settings (⚙️)

Una vez dentro del servicio de Strapi, verás tabs/pestañas en la parte superior:

```
Deployments | Metrics | Variables | Settings | Logs
```

**Click en "Settings"** (⚙️)

---

## Paso 5: Configurar Root Directory

En la página de Settings, **baja un poco** hasta encontrar una sección que dice:

**"Root Directory"** o **"Service Settings"**

Verás un campo de texto, probablemente vacío o con un punto (`.`)

**Escribe en ese campo**:
```
backend
```

**Importante**: Solo escribe `backend`, NO pongas `/backend` ni `./backend`

---

## Paso 6: Configurar Build Command

En la misma página de Settings, busca:

**"Build Command"** o **"Custom Build Command"**

Puede estar en una sección llamada "Build Settings"

**Escribe**:
```
npm install && npm run build
```

---

## Paso 7: Configurar Start Command

Justo debajo del Build Command, busca:

**"Start Command"** o **"Custom Start Command"**

**Escribe**:
```
npm run start
```

---

## Paso 8: Guardar los Cambios

**Railway guarda automáticamente** cuando escribes, PERO para estar seguro:

1. Busca un botón que diga **"Save"** o **"Apply"**
2. Si lo ves, haz click
3. Si no lo ves, los cambios ya están guardados

---

## Paso 9: Forzar Redeploy

Ahora necesitas que Railway vuelva a hacer deploy con esta nueva configuración:

### Opción A: Desde Deployments

1. Click en la pestaña **"Deployments"** (arriba)
2. Verás una lista de deployments anteriores
3. Busca el **más reciente** (el de arriba)
4. Click en los **tres puntos (...)** al lado derecho
5. Click en **"Redeploy"**

### Opción B: Automático

Railway puede hacer redeploy automáticamente al cambiar Settings.
Si ves que empieza a hacer deploy solo, ¡perfecto!

---

## Paso 10: Monitorear el Deploy

1. Ve a la pestaña **"Deployments"**
2. Verás el nuevo deployment con estado:
   - 🟡 **Building** (Construyendo - 2-3 minutos)
   - 🟡 **Deploying** (Desplegando - 1-2 minutos)
   - 🟢 **Active** (Activo - ¡Listo!)

3. **Click en el deployment activo** para ver los logs

---

## Paso 11: Revisar los Logs

En los logs deberías ver líneas como:

```
> npm install
added 1385 packages

> npm run build
Building Strapi...
✔ Building admin panel
✔ Compiling TS

> npm run start
Server started on port 1337
[INFO] Database connection established
```

**Esto significa que funcionó** ✅

---

## Paso 12: Verificar en Strapi Admin

1. Abre: **https://strapi-production-77cb.up.railway.app/admin**
2. Inicia sesión
3. En el menú lateral izquierdo, busca:
   - **"Content Manager"** - Deberías ver más que solo "User"
   - **"Content-Type Builder"** - Deberías ver: Plan, Producto, Categoría, etc.

---

## 🆘 Si No Encuentras Algo

### ¿No ves "Root Directory"?

Puede estar en:
- **Settings** → Scroll down
- Puede llamarse "Source Directory"
- Puede estar en una sección "Deploy Settings"

### ¿No ves "Build Command"?

Puede estar en:
- **Settings** → "Build Settings"
- **Settings** → "Custom Build Command"
- A veces hay un checkbox que dice "Override build command" que debes activar primero

### ¿No puedes hacer Redeploy?

Railway debería hacer redeploy automático al cambiar Settings.
Espera 1 minuto y verás que empieza solo.

---

## 📸 Lo Que Deberías Ver

### En Settings:

```
Service Settings
├─ Root Directory: backend
├─ Build Command: npm install && npm run build
└─ Start Command: npm run start
```

### En Deployments después del redeploy:

```
Status: 🟢 Active
Build time: ~3 minutes
```

### En Strapi Admin:

```
Content-Type Builder
├─ Plan
├─ Producto
├─ Categoría
├─ Order
├─ Subscription
└─ Home Page
```

---

## 💡 Resumen Rápido

1. Railway.app → Login
2. Click en tu proyecto Strapi
3. Click en el servicio (NO Postgres)
4. Click en "Settings"
5. Root Directory = `backend`
6. Build Command = `npm install && npm run build`
7. Start Command = `npm run start`
8. Espera el redeploy automático
9. Verifica en /admin

---

**¿En qué paso estás ahora?** Dime qué ves en tu pantalla y te ayudo con el siguiente paso.
