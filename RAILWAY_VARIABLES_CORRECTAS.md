# 🚀 Variables para Railway - Copia y Pega

## 📍 Servicio: BACKEND (GitHub Repo)

**Dónde:** Railway Dashboard → Backend Service → Variables → RAW Editor

### ✅ Copia y pega EXACTAMENTE esto:

```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
APP_KEYS=u9wpbfyp4p8ic0ftesbt8gh7zlp4gy2t,jkw470lyvl0qgaklyfprwz3mc2o9fnmw,p2um8o54ipikgqh21pri6v8kdkowr460,rkmnxe718cr8ii2bkfexfwak79ep6o0a
API_TOKEN_SALT=jkw470lyvl0qgaklyfprwz3mc2o9fnmw
ADMIN_JWT_SECRET=p2um8o54ipikgqh21pri6v8kdkowr460
TRANSFER_TOKEN_SALT=rkmnxe718cr8ii2bkfexfwak79ep6o0a
ENCRYPTION_KEY=QR17idJjAooNVdhYZ6pXcA==
JWT_SECRET=wmj9nol24liqdo4z3uwbc1156x46ryok
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
DATABASE_SSL=true
STRAPI_DISABLE_UPDATE_NOTIFICATION=true
STRAPI_TELEMETRY_DISABLED=true
BROWSER=false
URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
```

---

## 📍 Servicio: FRONTEND (cuando lo despliegues)

**Dónde:** Railway Dashboard → Frontend Service → Variables → RAW Editor

### ✅ Copia y pega EXACTAMENTE esto:

```env
NEXT_PUBLIC_STRAPI_URL=https://strapi-production-77cb.up.railway.app
NEXT_PUBLIC_FRONTEND_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
MERCADOPAGO_ACCESS_TOKEN=APP_USR-2856796838524308-071220-a393d7c21bae06130536ff38b3eb975a-34687326
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-934ee029-e0d9-429d-a4c1-7cfc1db330d0
```

**⚠️ Importante:**
- Si tu backend NO está en `https://strapi-production-77cb.up.railway.app`, cambia esa URL
- `NEXT_PUBLIC_FRONTEND_URL` usa `${{RAILWAY_PUBLIC_DOMAIN}}` para que Railway lo llene automáticamente

---

## 🔑 Cambios Importantes vs Tu Configuración Anterior

| Variable | Antes (MAL) | Ahora (BIEN) | Por qué |
|----------|-------------|--------------|---------|
| **Backend** |
| `HOST` | `::` | `0.0.0.0` | Mejor compatibilidad en Railway |
| `APP_KEYS` | 1 clave | 4 claves separadas por comas | Strapi requiere 4 claves |
| `DATABASE_URL` | Hardcodeado | `${{Postgres.DATABASE_URL}}` | Railway lo llena automáticamente |
| `DATABASE_SSL` | `false` | `true` | Railway PostgreSQL requiere SSL |
| **Frontend** |
| `NEXT_PUBLIC_STRAPI_URL` | `""https://..."" ` | `https://...` | Comillas dobles causan error |

---

## ✅ Checklist

### Backend en Railway:
- [ ] Ir a Railway → Backend Service → Variables
- [ ] Click en "RAW Editor"
- [ ] Pegar las variables de arriba
- [ ] Click "Update Variables"
- [ ] Esperar redeploy (1-3 min)
- [ ] Ver logs: debe decir "Server listening on http://0.0.0.0:1337"
- [ ] Visitar `/admin` y verificar que funcione

### Frontend en Railway (cuando despliegues):
- [ ] Ir a Railway → Frontend Service → Variables
- [ ] Click en "RAW Editor"
- [ ] Pegar las variables de arriba
- [ ] Actualizar `NEXT_PUBLIC_STRAPI_URL` si tu backend tiene otra URL
- [ ] Click "Update Variables"
- [ ] Esperar redeploy
- [ ] Verificar que se conecte al backend

---

## 🆘 Si algo falla

### Error: "Missing admin.auth.secret"
**Causa:** Falta `ADMIN_JWT_SECRET`
**Solución:** Verifica que copiaste TODAS las variables

### Error: "Cannot connect to database"
**Causa:** PostgreSQL no conectado
**Solución:**
1. Ve a Settings → Connect → Selecciona PostgreSQL
2. Verifica que `DATABASE_URL=${{Postgres.DATABASE_URL}}`

### Error: Frontend con CORS
**Causa:** URL incorrecta en `NEXT_PUBLIC_STRAPI_URL`
**Solución:** Verifica que la URL del backend sea correcta

---

## 🎯 Resultado Esperado

**Backend:**
```
✓ Server listening on http://0.0.0.0:1337
✓ Database connection established
✓ Welcome back!
```

**Frontend:**
```
✓ Build succeeded
✓ Server started on port 3000
```

---

## 📋 Próximos Pasos

1. ✅ Copiar variables al servicio del backend
2. ✅ Esperar redeploy del backend
3. ✅ Verificar que `/admin` funcione
4. ✅ Copiar variables al servicio del frontend (cuando lo despliegues)
5. ✅ Verificar que frontend se conecte al backend
