# Diagnóstico MercadoPago - Flujo Completo de Pago

## ✅ Campos Requeridos - Estado de Implementación

### 1. items.quantity
**Estado:** ✅ IMPLEMENTADO

**Flujo de datos:**
```
Cart Store → Checkout Page → API Route → MercadoPago
```

**Implementación:**
- **Frontend** (`checkout/page.tsx:65`):
  ```typescript
  items: items.map(item => ({
    productId: item.id,
    title: item.titulo,
    quantity: item.quantity,  // ✅ Campo presente
    unitPrice: item.precio,
    subtotal: item.precio * item.quantity,
    image: item.imagen,
  }))
  ```

- **API Route** (`api/mercadopago/route.ts:65`):
  ```typescript
  const mpItems = items.map((item) => ({
    id: item.productId.toString(),
    title: item.title,
    description: generateItemDescription(item.title, item.quantity),
    category_id: getItemCategory(item.title),
    quantity: item.quantity,  // ✅ Enviado a MercadoPago
    unit_price: Number(item.unitPrice),
    currency_id: 'ARS',
  }));
  ```

### 2. items.unit_price
**Estado:** ✅ IMPLEMENTADO

**Flujo de datos:**
```
Product Price → Cart → Checkout → API → MercadoPago
```

**Implementación:**
- **Frontend** (`checkout/page.tsx:66`):
  ```typescript
  unitPrice: item.precio,  // ✅ Precio del producto
  ```

- **API Route** (`api/mercadopago/route.ts:66`):
  ```typescript
  unit_price: Number(item.unitPrice),  // ✅ Convertido a número
  ```

### 3. back_urls
**Estado:** ✅ IMPLEMENTADO

**Implementación:**
- **API Route** (`api/mercadopago/route.ts:124-128`):
  ```typescript
  back_urls: {
    success: `${process.env.NEXT_PUBLIC_FRONTEND_URL}checkout/success?orderId=${orderId}`,
    failure: `${process.env.NEXT_PUBLIC_FRONTEND_URL}checkout/error?orderId=${orderId}`,
    pending: `${process.env.NEXT_PUBLIC_FRONTEND_URL}checkout/pending?orderId=${orderId}`,
  },
  auto_return: 'approved',  // ✅ Redirección automática en pagos aprobados
  ```

---

## 🔍 Diagnóstico del Problema Actual

### Síntoma
El botón de pago de MercadoPago no se habilita después de completar el formulario.

### Causas Posibles

#### 1. PreferenceId no se está creando
**Verificación:**
- Abrir consola del navegador (F12)
- Buscar logs que indiquen la creación de preferencia
- Verificar que aparezca: `✅ PreferenceId recibido: [ID]`

**Si no aparece el log:**
- Verificar errores en la consola
- Revisar respuesta de la API `/api/mercadopago`

#### 2. Wallet Component no se inicializa
**Verificación:**
```typescript
// En checkout/page.tsx:199
<Wallet initialization={{ preferenceId }} />
```

**Problemas potenciales:**
- `preferenceId` es `null` o `undefined`
- `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` no está configurado
- Error de inicialización del SDK

#### 3. Variables de entorno no disponibles en producción
**Verificación en Vercel:**
```
Settings → Environment Variables → Verificar:
- NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
- MERCADOPAGO_ACCESS_TOKEN
- NEXT_PUBLIC_STRAPI_URL
- NEXT_PUBLIC_FRONTEND_URL
```

---

## 🧪 Pruebas de Diagnóstico

### Test 1: Verificar Creación de Preferencia

**En consola del navegador:**
```javascript
// Después de enviar el formulario
console.log('PreferenceId:', preferenceId);
```

**Resultado esperado:**
```
✅ PreferenceId recibido: 1234567890-abc-def-123-456
```

**Si falla:**
- Verificar errores en Network tab (F12 → Network)
- Buscar request a `/api/mercadopago`
- Revisar response body

### Test 2: Verificar Datos del Request

**Network Tab (F12):**
1. Ir a Network
2. Enviar formulario
3. Buscar request `mercadopago`
4. Verificar Request Payload:

```json
{
  "buyerData": {
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "telefono": "1234567890",
    "dni": "12345678"
  },
  "items": [
    {
      "productId": 1,
      "title": "Producto Test",
      "quantity": 2,        // ✅ Debe estar presente
      "unitPrice": 5000     // ✅ Debe estar presente
    }
  ],
  "subtotal": 10000,
  "shippingCost": 0,
  "total": 10000,
  "orderNumber": "ORD-...",
  "orderId": 123,
  "externalReference": "..."
}
```

### Test 3: Verificar Response de MercadoPago

**Network Tab Response:**
```json
{
  "preferenceId": "1234567890-abc-def",
  "initPoint": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=..."
}
```

**Si no hay preferenceId:**
- Revisar error en response
- Verificar credenciales de MercadoPago
- Comprobar estructura del request

---

## 🐛 Errores Comunes y Soluciones

### Error 1: "invalid payer data"
**Causa:** Datos del comprador incompletos o inválidos

**Solución:**
```typescript
// Verificar que todos los campos estén presentes
payerData: {
  email: buyerData.email,              // ✅ Requerido
  phone: {
    area_code: phoneData.areaCode,     // ✅ Requerido
    number: phoneData.number,          // ✅ Requerido
  },
  name: buyerData.nombre,              // ✅ Opcional pero recomendado
  surname: buyerData.apellido,         // ✅ Opcional pero recomendado
  identification: {
    type: 'DNI',
    number: buyerData.dni,             // ✅ Opcional pero recomendado
  },
}
```

### Error 2: "items.quantity is required"
**Causa:** Campo quantity no está llegando al request

**Solución:**
- Verificar que el carrito tenga `quantity`
- Verificar mapeo en checkout page (línea 65)
- Verificar mapeo en API route (línea 65)

### Error 3: Botón no aparece pero no hay errores
**Causa:** Estado de React no se actualiza

**Solución:**
```typescript
// Verificar en código:
if (mpData.preferenceId) {
  console.log('✅ PreferenceId recibido:', mpData.preferenceId);
  setPreferenceId(mpData.preferenceId);  // ✅ Debe ejecutarse
  setPaymentStatus('success');            // ✅ Debe ejecutarse
}
```

**Verificar renderizado condicional:**
```typescript
{!preferenceId ? (
  <CheckoutFormProduct />  // Mostrar formulario
) : (
  <Wallet initialization={{ preferenceId }} />  // Mostrar botón
)}
```

### Error 4: "unauthorized" o "invalid credentials"
**Causa:** Credenciales de MercadoPago incorrectas

**Solución:**
1. Verificar en `.env.local`:
   ```
   MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
   NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-...
   ```

2. Verificar en Vercel Environment Variables

3. Verificar que no estés usando credenciales de TEST en producción

---

## 📊 Checklist de Verificación

### Desarrollo Local
- [ ] `.env.local` tiene todas las variables
- [ ] Variables comienzan con `APP_USR-`
- [ ] Servidor reiniciado después de cambios en `.env.local`
- [ ] Consola muestra logs de éxito
- [ ] Network tab muestra request exitoso
- [ ] PreferenceId se recibe en response
- [ ] Botón de MercadoPago se renderiza

### Producción (Vercel)
- [ ] Variables de entorno configuradas en Vercel
- [ ] Variables `NEXT_PUBLIC_*` disponibles en frontend
- [ ] Deploy exitoso sin errores de build
- [ ] Consola en producción muestra logs
- [ ] Request a `/api/mercadopago` responde 200
- [ ] Botón de MercadoPago funciona

### Backend (Strapi Cloud)
- [ ] `MERCADOPAGO_ACCESS_TOKEN` configurado
- [ ] Webhook URL configurado correctamente
- [ ] Webhook responde 200 OK
- [ ] Órdenes se actualizan con `paymentId` y `status`

---

## 🎯 Siguiente Paso de Diagnóstico

**Ejecuta estos comandos en la consola del navegador:**

```javascript
// 1. Verificar que MercadoPago SDK está cargado
console.log('MercadoPago SDK:', window.MercadoPago);

// 2. Verificar public key
console.log('Public Key:', process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY);

// 3. Hacer test request manual
fetch('/api/mercadopago', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    buyerData: { nombre: 'Test', apellido: 'User', email: 'test@test.com', telefono: '1234567890', dni: '12345678' },
    items: [{ productId: 1, title: 'Test', quantity: 1, unitPrice: 100 }],
    subtotal: 100,
    shippingCost: 0,
    total: 100,
    shippingAddress: { direccion: 'Test', numero: '123', ciudad: 'Test', provincia: 'Buenos Aires', codigoPostal: '1234' },
    orderNumber: 'TEST-123',
    orderId: 999,
    externalReference: 'TEST-REF-123'
  })
})
.then(r => r.json())
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e));
```

**Respuesta esperada:**
```json
{
  "preferenceId": "1234567890-abc-def-ghi",
  "initPoint": "https://www.mercadopago.com.ar/checkout/..."
}
```

---

## 🔧 Herramientas de Debug Implementadas

### Logs en Checkout Page
```
🚀 Iniciando proceso de checkout...
💰 Totales calculados: {...}
📝 Creando orden en Strapi...
✅ Orden creada: {...}
💳 Creando preferencia de MercadoPago...
✅ Respuesta de MercadoPago: {...}
✅ PreferenceId recibido: [ID]
✅ Estado actualizado - Botón debería aparecer
```

### Logs en API Route
- Errores de validación con código 400
- Errores de autenticación con código 401
- Errores de red con código 503
- Stack traces en desarrollo

---

## 📝 Conclusión

**Todos los campos requeridos por MercadoPago están implementados correctamente:**

1. ✅ **items.quantity** - Implementado y enviado
2. ✅ **items.unit_price** - Implementado y enviado
3. ✅ **back_urls** - Implementado con success, failure, pending

**El problema actual NO es por campos faltantes.**

**Próximos pasos de diagnóstico:**
1. Revisar consola del navegador en producción
2. Verificar Network tab para ver request/response
3. Comprobar variables de entorno en Vercel
4. Ejecutar test manual desde consola del navegador
5. Compartir logs para diagnóstico más específico
