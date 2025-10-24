# 🔧 Solución: Error de Login en Railway

## 🚨 Error

```
Failed to create admin refresh session Cannot send secure cookie over unencrypted connection
```

## ✅ Solución Aplicada

### **1. Actualización de `config/server.ts`**

Se agregó configuración de proxy para Railway:

```typescript
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: env('URL', 'http://localhost:1337'),      // ← URL pública
  proxy: env.bool('IS_PROXIED', true),            // ← Confiar en proxy
  cron: {
    enabled: false,
  },
});
```

### **2. Variables Necesarias en Railway**

Agrega estas variables adicionales en Railway Dashboard:

```env
# Ya las tienes (verifica):
URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

# Agregar estas (si no existen):
IS_PROXIED=true
STRAPI_ADMIN_BACKEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
```

---

## 📋 Pasos para Aplicar

### **PASO 1: Push del código actualizado**

El código ya está actualizado y pusheado. Railway redeployará automáticamente.

### **PASO 2: Verificar variables en Railway**

Ve a Railway → Backend Service → Variables y asegúrate de tener:

```env
URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
IS_PROXIED=true
STRAPI_ADMIN_BACKEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
```

### **PASO 3: Esperar Redeploy**

- Railway redeployará automáticamente (1-3 min)
- Ve a Deployments para ver progreso

### **PASO 4: Probar Login**

1. Visita: `https://strapi-mini-ecommerce-production.up.railway.app/admin`
2. Usa tus credenciales:
   - Email: `am.motos@hotmail.com`
   - Password: `Sara2018*`
3. Deberías poder iniciar sesión ✅

---

## 🔍 Por qué Ocurre Este Error

Railway usa un **proxy HTTPS** (Nginx) delante de tu aplicación:

```
Internet (HTTPS)
    ↓
Railway Proxy (HTTPS → HTTP)
    ↓
Tu Strapi (HTTP internamente)
```

**Problema:** Strapi piensa que está en HTTP, pero intenta enviar cookies con flag `secure` (solo HTTPS).

**Solución:** Configurar `proxy: true` le dice a Strapi que confíe en los headers `X-Forwarded-*` del proxy.

---

## 🆘 Si Sigue Sin Funcionar

### Verificar en Railway Logs:

Busca estos mensajes:

**✅ BIEN:**
```
✓ Server listening on http://0.0.0.0:1337
✓ Admin panel available at https://...
```

**❌ MAL:**
```
error: Cannot send secure cookie over unencrypted connection
```

### Variables Críticas:

Asegúrate de tener en Railway:
- [ ] `URL=https://${{RAILWAY_PUBLIC_DOMAIN}}`
- [ ] `IS_PROXIED=true`
- [ ] `STRAPI_ADMIN_BACKEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}`

---

## 📊 Resultado Esperado

Después de aplicar esto:

1. ✅ Login funciona en `/admin`
2. ✅ No más errores de "secure cookie"
3. ✅ Cookies se crean correctamente
4. ✅ Sesión persiste

---

## 🎯 Alternativa (si la solución de arriba no funciona)

Si el problema persiste, agrega esta variable en Railway:

```env
NODE_ENV=production
STRAPI_PLUGIN_I18N_INIT_LOCALE_CODE=en
```

Y verifica que `URL` esté usando HTTPS:
```env
URL=https://strapi-mini-ecommerce-production.up.railway.app
```

(Cambia `${{RAILWAY_PUBLIC_DOMAIN}}` por tu URL real si es necesario)
