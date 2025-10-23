# Configuración de MercadoPago - Guía Completa

## 📋 Resumen de la Implementación

Se implementó un sistema completo de pagos con MercadoPago que incluye:

### Backend (Strapi)
- ✅ Collection `order` para productos físicos
- ✅ Collection `subscription` para planes recurrentes
- ✅ API endpoints para crear órdenes y suscripciones
- ✅ Webhook handler para procesar notificaciones de MercadoPago
- ✅ Integración con MercadoPago SDK

### Frontend (Next.js)
- ✅ Checkout actualizado para productos y planes
- ✅ Redirección automática a MercadoPago
- ✅ Páginas de success y error
- ✅ Consulta de estado de órdenes

---

## 🔧 Configuración Inicial

### 1. Obtener Credenciales de MercadoPago

1. Ve a https://www.mercadopago.com.ar/developers
2. Crea una aplicación o usa una existente
3. Obtén tus credenciales:
   - **Access Token** (para el backend)
   - **Public Key** (para el frontend)

⚠️ **Importante**: Usa credenciales de TEST durante el desarrollo

### 2. Configurar Variables de Entorno

#### Backend (`backend/.env`)

```env
# MercadoPago
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-abcdef-ghijklmnop
MERCADOPAGO_PUBLIC_KEY=TEST-abc123-def456-ghi789
FRONTEND_URL=http://localhost:3000
```

#### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-abc123-def456-ghi789
```

### 3. Configurar Permisos en Strapi

1. Inicia el backend: `cd backend && npm run develop`
2. Ve a http://localhost:1337/admin
3. Navega a **Settings → Users & Permissions → Public**
4. Habilita los siguientes permisos:

**Order:**
- `create` ✅
- `findOne` ✅

**Subscription:**
- `create` ✅
- `findOne` ✅

**Mercadopago:**
- `webhook` ✅

5. Guarda los cambios

---

## 🔄 Flujo de Pago Completo

### Para Productos Físicos

```
┌─────────────────────────────────────────────────┐
│ 1. Usuario llena formulario de checkout        │
│    (datos personales + dirección de envío)     │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 2. Frontend → POST /api/orders                  │
│    {                                            │
│      buyerData: {...},                          │
│      items: [...],                              │
│      shippingAddress: {...}                     │
│    }                                            │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 3. Backend Strapi:                              │
│    - Crea orden en DB (status: "pending")      │
│    - Genera orderNumber: "ORD-2024-000001"     │
│    - Guarda todos los datos                     │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 4. Backend → MercadoPago API:                   │
│    - Crea preferencia de pago                   │
│    - external_reference: "order-123"            │
│    - Recibe: preferenceId + initPoint           │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 5. Backend → Frontend:                          │
│    {                                            │
│      orderId: 1,                                │
│      preferenceId: "123-abc",                   │
│      initPoint: "https://mercadopago.com/..."   │
│    }                                            │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 6. Frontend redirige a initPoint                │
│    (Usuario ve checkout de MercadoPago)        │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 7. Usuario paga (o cancela/rechaza)             │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 8. MercadoPago → Webhook                        │
│    POST /api/mercadopago/webhook                │
│    {                                            │
│      type: "payment",                           │
│      data: { id: "payment-789" }                │
│    }                                            │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 9. Webhook Handler:                             │
│    - Consulta pago a MercadoPago                │
│    - Obtiene external_reference                 │
│    - Busca orden en DB                          │
│    - Actualiza status: "approved"/"rejected"    │
│    - Guarda paymentId y paidAt                  │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 10. MercadoPago redirige al usuario             │
│     → /checkout/success?orderId=1               │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 11. Página Success:                             │
│     - Consulta orden actualizada                │
│     - Muestra status y detalles                 │
│     - Limpia carrito si está aprobado           │
└─────────────────────────────────────────────────┘
```

### Para Suscripciones (Planes)

Similar al flujo anterior, pero:
- Usa `POST /api/subscriptions`
- Crea PreApproval en vez de Preference
- Maneja `subscription_preapproval` en el webhook

---

## 🧪 Testing

### Modo Test de MercadoPago

MercadoPago ofrece tarjetas de prueba para testing:

#### Tarjetas Aprobadas:
```
Número: 5031 7557 3453 0604
CVV: 123
Fecha: 11/25
Nombre: APRO
```

#### Tarjetas Rechazadas:
```
Número: 5031 4332 1540 6351
Nombre: OTHE (otros errores)
```

Más tarjetas de prueba: https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing

### Testing del Webhook Localmente

Como MercadoPago no puede enviar webhooks a `localhost`, necesitas usar:

**Opción 1: ngrok**
```bash
# Instalar ngrok
npm install -g ngrok

# Exponer tu backend
ngrok http 1337

# Usa la URL de ngrok en:
# - FRONTEND_URL en backend/.env
# - notification_url en la preferencia
```

**Opción 2: Mockear el webhook**

Usa Postman o curl para simular el webhook:

```bash
curl -X POST http://localhost:1337/api/mercadopago/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "type": "payment",
    "action": "payment.created",
    "data": {
      "id": "PAYMENT_ID"
    }
  }'
```

---

## 📊 Estados de Órdenes

### Order Status
- `pending` - Orden creada, esperando pago
- `approved` - Pago aprobado exitosamente
- `rejected` - Pago rechazado
- `failed` - Error en el proceso de pago
- `shipped` - Pedido enviado
- `delivered` - Pedido entregado
- `cancelled` - Orden cancelada

### Subscription Status
- `pending_payment` - Suscripción creada, esperando pago
- `active` - Suscripción activa y cobrando
- `paused` - Suscripción pausada
- `cancelled` - Suscripción cancelada

---

## 🚀 Pasar a Producción

### 1. Obtener Credenciales de Producción

1. Ve a tu Dashboard de MercadoPago
2. Cambia a modo **Producción**
3. Obtén nuevas credenciales
4. Actualiza las variables de entorno

### 2. Configurar Webhook en MercadoPago

1. Ve a tu aplicación en el Dashboard
2. Navega a **Webhooks**
3. Agrega la URL: `https://tu-dominio.com/api/mercadopago/webhook`
4. Selecciona eventos:
   - `payment`
   - `subscription_preapproval`

### 3. Actualizar URLs

```env
# Backend Production
MERCADOPAGO_ACCESS_TOKEN=APP-1234... (producción)
MERCADOPAGO_PUBLIC_KEY=APP-abc... (producción)
FRONTEND_URL=https://tu-dominio.com

# Frontend Production
NEXT_PUBLIC_STRAPI_URL=https://api.tu-dominio.com
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP-abc... (producción)
```

### 4. Certificado SSL

⚠️ **Requerido**: MercadoPago requiere HTTPS para webhooks en producción

---

## 🐛 Troubleshooting

### Error: "Order not found"
- Verifica que los permisos públicos estén habilitados en Strapi
- Revisa que el `orderId` se pase correctamente en la URL

### Webhook no se ejecuta
- Verifica la URL del webhook en MercadoPago Dashboard
- Revisa logs del backend: `console.log` en webhook.js
- Asegúrate que el endpoint no requiera autenticación (`auth: false`)

### Pago aprobado pero status sigue "pending"
- El webhook puede tomar unos segundos en procesarse
- Verifica que el external_reference coincida
- Revisa logs del webhook para errores

### Error: "Cannot find module 'mercadopago'"
```bash
cd backend
npm install mercadopago
```

---

## 📚 Estructura de Archivos Creados

```
backend/
├── src/api/
│   ├── order/
│   │   ├── content-types/order/schema.json
│   │   ├── controllers/order.js
│   │   ├── routes/order.js
│   │   └── services/order.js
│   ├── subscription/
│   │   ├── content-types/subscription/schema.json
│   │   ├── controllers/subscription.js
│   │   ├── routes/subscription.js
│   │   └── services/subscription.js
│   └── mercadopago/
│       ├── controllers/webhook.js
│       └── routes/webhook.js
└── .env (actualizado)

frontend/
├── src/app/
│   └── checkout/
│       ├── page.tsx (actualizado)
│       ├── plan/page.tsx (actualizado)
│       ├── success/page.tsx (nuevo)
│       └── error/page.tsx (nuevo)
└── .env.local (actualizado)
```

---

## ✅ Checklist de Implementación

- [ ] Credenciales de MercadoPago configuradas
- [ ] Variables de entorno configuradas (backend y frontend)
- [ ] Backend iniciado y collections creadas
- [ ] Permisos públicos habilitados en Strapi
- [ ] Webhook URL configurada en MercadoPago (producción)
- [ ] Probado flujo completo con tarjeta de prueba
- [ ] Verificado que webhook actualiza órdenes
- [ ] Página de success muestra información correcta
- [ ] Página de error funciona correctamente

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs del backend
2. Verifica la consola del navegador
3. Consulta la documentación de MercadoPago: https://www.mercadopago.com.ar/developers
4. Revisa el estado del webhook en el Dashboard de MercadoPago

---

**¡La integración está completa y lista para usar!** 🎉
