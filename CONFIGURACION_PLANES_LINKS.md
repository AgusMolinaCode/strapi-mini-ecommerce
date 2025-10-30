# Configuración de Plan Links en Strapi

## 📋 Objetivo
Vincular cada plan con su URL de checkout de MercadoPago de forma **confiable y sin errores**.

## ⚠️ Problema Anterior
- Se usaban **nombres** para relacionar planes con URLs
- Errores por diferencias en mayúsculas/minúsculas
- Mismo `preapproval_plan_id` para diferentes planes
- Difícil de mantener y propenso a errores

## ✅ Solución Implementada
Usar **`plan_id`** único para relacionar Plan ↔ PlanLink

---

## 🔧 Pasos de Configuración

### 1. Verificar el schema de `planes-link`
El schema ya ha sido actualizado con los siguientes campos:

```json
{
  "plan_id": "string (required, unique)",  // Debe coincidir con plan.plan_id
  "title": "string (required)",             // Nombre descriptivo
  "text": "text (optional)",                // Descripción opcional
  "url": "string (required)"                // URL completa de MercadoPago
}
```

### 2. Reiniciar Strapi
```bash
cd backend
npm run develop
```

### 3. Obtener los `plan_id` de los planes existentes

Accede a: http://localhost:1337/api/plans?populate=*

Busca el campo `plan_id` de cada plan. Ejemplos:
- Plan Básico: `plan_id: "basico"`
- Plan Pro: `plan_id: "pro"`
- Plan Elite: `plan_id: "elite"`

### 4. Crear entradas en Planes Links

Ve a: **Content Manager → Planes Links → Create new entry**

Crea **3 entradas** con la siguiente información:

#### Entrada 1: Plan Básico
```
plan_id: basico
title: Plan Básico
text: Acceso mensual al gimnasio con todas las facilidades básicas
url: https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2ef09b3443484eab87075b62849caf40
```

#### Entrada 2: Plan Pro
```
plan_id: pro
title: Plan Pro
text: Acceso completo con clases grupales y nutrición
url: [AQUÍ VA LA URL CORRECTA DEL PLAN PRO]
```
⚠️ **IMPORTANTE**: Verifica que la URL del Plan Pro sea diferente a la del Plan Básico

#### Entrada 3: Plan Elite
```
plan_id: elite
title: Plan Elite
text: Acceso premium con entrenamiento personalizado
url: https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=8012421304cb44fca48df579301f2188
```

### 5. Publicar las entradas
- Asegúrate de hacer clic en **Publish** para cada entrada
- Verifica que todas estén con estado "Published"

---

## 🔍 Verificación

### Verificar que los datos estén correctos:
```
GET http://localhost:1337/api/planes-links
```

Deberías ver 3 entradas con sus respectivos `plan_id`, `title`, y `url`.

### Probar en el frontend:
1. Ve a: http://localhost:3000/planes
2. Verifica que cada botón "Seleccionar Plan" tenga una URL
3. Haz clic en cada botón y verifica que abra la URL correcta de MercadoPago
4. Confirma que **Plan Pro** NO abra el mismo checkout que Plan Básico

---

## 🔄 Flujo de Datos

```
Strapi: Plan (plan_id: "basico")
          ↓
Strapi: PlanLink (plan_id: "basico", url: "https://...")
          ↓
Frontend: page.tsx obtiene ambos
          ↓
Relaciona por plan_id
          ↓
PlanCard recibe URL correcta
          ↓
Link abre MercadoPago
```

---

## 📝 Notas Importantes

1. **El `plan_id` debe ser EXACTAMENTE igual** en Plan y PlanLink
2. **No uses espacios ni mayúsculas** en plan_id (usa: "basico", no "Plan Básico")
3. **Cada plan debe tener su propio `preapproval_plan_id`** de MercadoPago
4. **Si cambias un plan_id**, actualiza tanto Plan como PlanLink

---

## 🐛 Solución de Problemas

### Problema: Botón muestra "No disponible"
**Causa**: No hay PlanLink con el `plan_id` correspondiente
**Solución**: Verifica que el `plan_id` en PlanLink coincida exactamente con el de Plan

### Problema: Todos los planes abren la misma URL
**Causa**: Los `preapproval_plan_id` son iguales en MercadoPago
**Solución**: Crea planes separados en MercadoPago y actualiza las URLs en PlanesLink

### Problema: Error 404 al cargar planes
**Causa**: Content type no está publicado o configurado
**Solución**:
1. Ve a Settings → Users & Permissions → Public
2. Encuentra `planes-link` y habilita `find` y `findOne`

---

## ✅ Checklist Final

- [ ] Schema de `planes-link` actualizado
- [ ] Strapi reiniciado
- [ ] Obtenidos los `plan_id` de los planes existentes
- [ ] Creadas 3 entradas en Planes Links
- [ ] Verificado que cada plan tenga URL única
- [ ] Todas las entradas publicadas
- [ ] Permisos públicos configurados
- [ ] Probado en frontend que funcione correctamente
- [ ] Plan Pro tiene URL diferente a Plan Básico

---

**Última actualización**: 2025-01-30
