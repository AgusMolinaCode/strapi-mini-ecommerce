# Configuración de Revalidación de Caché en Next.js

## Problema Resuelto

El frontend en producción (Vercel) no mostraba cambios inmediatos del backend (Strapi Cloud) porque Next.js genera páginas estáticas durante el build que quedan cacheadas.

## Solución Implementada: ISR (Incremental Static Regeneration)

### ✅ Páginas Configuradas

Se agregó `export const revalidate = 60;` a las siguientes páginas:

1. **`/app/page.tsx`** (Home)
   - Revalida: Hero, Categorías, Productos
   - Cada 60 segundos

2. **`/app/categorias/[slug]/page.tsx`** (Páginas de Categorías)
   - Revalida: Lista de productos por categoría
   - Cada 60 segundos

3. **`/app/planes/page.tsx`** (Planes de Suscripción)
   - Revalida: Lista de planes
   - Cada 60 segundos

### Cómo Funciona ISR

```typescript
// ISR: Revalidar cada 60 segundos
export const revalidate = 60;
```

**Comportamiento**:
1. Primera visita después de 60s → genera nueva página con datos frescos
2. Visitantes subsiguientes → ven la versión cacheada (rápida)
3. Después de otros 60s → se regenera de nuevo

**Ventajas**:
- ✅ Páginas rápidas (servidas desde caché)
- ✅ Datos actualizados cada minuto
- ✅ Sin costo extra de servidor

**Desventajas**:
- ⚠️ Cambios NO son instantáneos (hasta 60s de delay)
- ⚠️ Primera visita después de 60s puede ser lenta

---

## Opción Avanzada: On-Demand Revalidation (Webhook)

Para **revalidación instantánea** cuando cambias contenido en Strapi:

### 1. Crear API Route en Next.js

**Archivo**: `frontend/src/app/api/revalidate/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verificar secret token
    const secret = request.nextUrl.searchParams.get('secret');
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Revalidar según el tipo de contenido
    const { model, entry } = body;

    switch (model) {
      case 'producto':
      case 'productos':
        await revalidatePath('/');
        await revalidatePath('/categorias/[slug]', 'page');
        break;

      case 'categoria':
      case 'categorias':
        await revalidatePath('/');
        await revalidatePath('/categorias/[slug]', 'page');
        break;

      case 'plan':
      case 'plans':
        await revalidatePath('/planes');
        break;

      case 'home-page':
        await revalidatePath('/');
        break;

      default:
        // Revalidar todo si no se especifica
        await revalidatePath('/', 'layout');
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json(
      { message: 'Error revalidating', error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

### 2. Configurar en Vercel

**Variables de Entorno**:
```
REVALIDATE_SECRET=tu_token_secreto_aqui_12345
```

### 3. Configurar Webhook en Strapi

1. Ve a **Settings** → **Webhooks**
2. Haz clic en **Add new webhook**
3. Configura:

```
Name: Vercel Revalidation
URL: https://tu-app.vercel.app/api/revalidate?secret=tu_token_secreto_aqui_12345

Events to trigger:
✅ Entry Create (todas las colecciones)
✅ Entry Update (todas las colecciones)
✅ Entry Delete (todas las colecciones)
```

4. **Headers** (opcional para seguridad):
```
Content-Type: application/json
```

### 4. Resultado

**Con Webhook configurado**:
- ✅ Cambios en Strapi → instantáneos en Vercel
- ✅ Revalidación solo cuando hay cambios reales
- ✅ Más eficiente que ISR con tiempo fijo

---

## Comparación de Estrategias

| Característica | ISR (60s) | On-Demand Webhook |
|----------------|-----------|-------------------|
| Configuración | ✅ Simple (1 línea) | ⚠️ Requiere webhook |
| Actualización | Cada 60 segundos | Instantánea |
| Eficiencia | Media | Alta |
| Costo servidor | Bajo | Muy bajo |
| Recomendado para | Contenido cambia ocasionalmente | Contenido cambia frecuentemente |

---

## Recomendación

**Para empezar**: Usa ISR (`revalidate = 60`) ✅ Ya está configurado

**Para producción seria**: Implementa webhook para revalidación instantánea

---

## Verificación

### Probar ISR (Actual)
1. Cambia algo en Strapi
2. Espera 60 segundos
3. Visita tu sitio en Vercel
4. Debe aparecer el cambio

### Probar Webhook (Si lo implementas)
1. Cambia algo en Strapi
2. Inmediatamente visita Vercel
3. El cambio aparece al instante

---

## Páginas Client-Side (No requieren configuración)

Estas páginas ya funcionan correctamente:
- ✅ `/producto/[slug]` - Fetch en cliente (useEffect)
- ✅ `/checkout/*` - Páginas dinámicas

No necesitan `revalidate` porque hacen fetch en el navegador, no durante el build.
