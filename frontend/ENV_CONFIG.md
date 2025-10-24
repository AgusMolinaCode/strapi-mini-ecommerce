# Configuración de Variables de Entorno - Frontend

## Variables Necesarias

Tu frontend necesita estas 4 variables de entorno:

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `NEXT_PUBLIC_STRAPI_URL` | Pública | URL de tu backend Strapi |
| `NEXT_PUBLIC_FRONTEND_URL` | Pública | URL de tu frontend (para redirects) |
| `MERCADOPAGO_ACCESS_TOKEN` | Privada | Token de acceso de MercadoPago (server-side) |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Pública | Public key de MercadoPago (client-side) |

---

## 📋 Escenarios de Configuración

### 1️⃣ **Desarrollo Local (Frontend local + Strapi en Railway)**
*Situación actual - Lo que tienes ahora*

**Archivo:** `.env.local`
```env
NEXT_PUBLIC_STRAPI_URL=https://strapi-production-77cb.up.railway.app
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
MERCADOPAGO_ACCESS_TOKEN=APP_USR-2856796838524308-071220-a393d7c21bae06130536ff38b3eb975a-34687326
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-934ee029-e0d9-429d-a4c1-7cfc1db330d0
```

**Comandos:**
```bash
cd frontend
npm run dev
# Frontend: http://localhost:3000
# Backend:  https://strapi-production-77cb.up.railway.app
```

---

### 2️⃣ **Desarrollo Local (Todo local)**
*Si quieres correr Strapi localmente*

**Archivo:** `.env.local`
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
MERCADOPAGO_ACCESS_TOKEN=APP_USR-2856796838524308-071220-a393d7c21bae06130536ff38b3eb975a-34687326
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-934ee029-e0d9-429d-a4c1-7cfc1db330d0
```

**Comandos:**
```bash
# Terminal 1 - Backend
cd backend
npm run develop

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

### 3️⃣ **Producción en Railway (o Vercel/Netlify)**
*Cuando despliegues el frontend a producción*

**Variables de Entorno en Railway:**
```env
NEXT_PUBLIC_STRAPI_URL=https://strapi-production-77cb.up.railway.app
NEXT_PUBLIC_FRONTEND_URL=https://tu-frontend-app.up.railway.app
MERCADOPAGO_ACCESS_TOKEN=APP_USR-2856796838524308-071220-a393d7c21bae06130536ff38b3eb975a-34687326
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-934ee029-e0d9-429d-a4c1-7cfc1db330d0
```

**⚠️ IMPORTANTE:** Una vez que despliegues el frontend a Railway (u otra plataforma):
1. Copia la URL del frontend deployado (ej: `https://tu-app.up.railway.app`)
2. Actualiza `NEXT_PUBLIC_FRONTEND_URL` con esa URL
3. Esto es crucial para que los redirects de MercadoPago funcionen

---

## 🔒 Seguridad

### Variables Públicas (NEXT_PUBLIC_*)
- ✅ Se exponen al navegador
- ✅ Pueden verse en el código del cliente
- ✅ Seguras para compartir en URLs públicas

### Variables Privadas (sin NEXT_PUBLIC_)
- 🔒 Solo disponibles en server-side (API routes)
- 🔒 NUNCA se exponen al navegador
- 🔒 Mantén estos valores secretos

---

## 📁 Archivos de Entorno

```
frontend/
├── .env.local          # Tu configuración local (git ignore)
├── .env.example        # Template sin valores sensibles (se commitea)
├── .env.production     # (Opcional) Valores para producción
└── ENV_CONFIG.md       # Esta documentación
```

**Prioridad de Next.js:**
1. `.env.local` (mayor prioridad - usa este para desarrollo)
2. `.env.development` o `.env.production` (según NODE_ENV)
3. `.env`

---

## 🚀 Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm run start

# Ver variables de entorno (debug)
npm run dev | grep NEXT_PUBLIC
```

---

## ❓ FAQ

**Q: ¿Puedo usar `.env` en lugar de `.env.local`?**
A: Sí, pero `.env.local` tiene mayor prioridad y es mejor práctica para valores locales que no quieres commitear.

**Q: ¿Necesito cambiar algo cuando despliegue?**
A: Sí, actualiza `NEXT_PUBLIC_FRONTEND_URL` con la URL de tu frontend deployado.

**Q: ¿Los valores NEXT_PUBLIC son seguros?**
A: Son seguros para URLs y datos públicos, pero NUNCA pongas credenciales secretas en variables NEXT_PUBLIC.

**Q: ¿Cómo sé si mis variables están cargadas?**
A: Next.js las valida en tiempo de build. Si falta alguna, verás warnings en la consola.
