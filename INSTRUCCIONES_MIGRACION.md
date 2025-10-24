# Instrucciones para Migración de Datos a Railway

## Estado Actual

✅ **Datos Exportados**: Los datos de SQLite han sido exportados exitosamente
- 18 Productos
- 6 Planes
- 6 Categorías
- 4 Órdenes
- 21 Archivos (imágenes)
- Componentes y relaciones

## Problema Detectado

La base de datos PostgreSQL en Railway está **completamente vacía** - ni siquiera tiene las tablas creadas aún.

## Solución: Proceso en 3 Pasos

### Paso 1: Esperar Deploy de Railway (5-10 minutos)

1. Ve a tu dashboard de Railway: https://railway.app
2. Busca el proyecto "Strapi"
3. Verifica que el deploy esté completo
4. Accede a: https://strapi-production-77cb.up.railway.app/admin

### Paso 2: Configuración Inicial de Strapi

1. **Crear Usuario Administrador**:
   - Abre: https://strapi-production-77cb.up.railway.app/admin
   - Crea tu cuenta de administrador
   - Inicia sesión

2. **Verificar Content Types**:
   - Ve a "Content-Type Builder"
   - Deberías ver:
     - Plan
     - Producto
     - Categoría
     - Order
     - Subscription
     - Home Page
   - **Strapi habrá creado todas las tablas automáticamente**

### Paso 3: Importar Datos (2 opciones)

#### Opción A: Manual (Recomendado para inicio)

**Ventajas**: Control total, verifica que todo funcione
**Tiempo**: ~30 minutos

1. **Categorías** (6):
   - Ve a "Content Manager" → "Categorías"
   - Crea manualmente las categorías desde tus datos locales

2. **Planes** (6):
   - Ve a "Content Manager" → "Planes"
   - Crea los planes con sus features

3. **Productos** (18):
   - Ve a "Content Manager" → "Productos"
   - Crea productos y asigna categorías

4. **Imágenes**:
   - Ve a "Media Library"
   - Sube las imágenes de productos
   - Asócialas con los productos

#### Opción B: Script Automático (Después de Paso 1 y 2)

**Ventajas**: Rápido, automatizado
**Requisito**: Strapi debe estar funcionando y configurado

Ejecuta desde tu computadora local:

\`\`\`bash
cd backend
node scripts/import-via-api.js
\`\`\`

Este script:
- Se conectará a la API de Strapi en Railway
- Importará todos los datos automáticamente
- Subirá las imágenes a la Media Library

## Datos Exportados Disponibles

Los datos están guardados en:
\`backend/scripts/sqlite-export.json\`

Contiene:
- ✅ 6 Categorías
- ✅ 6 Planes con features
- ✅ 18 Productos
- ✅ 4 Órdenes
- ✅ 21 Archivos/Imágenes
- ✅ Relaciones entre entidades

## Notas Importantes

⚠️ **No podrás migrar**:
- Usuario administrador (debes crear uno nuevo)
- Sesiones activas
- Tokens de API (genera nuevos si los necesitas)

✅ **Sí se migrará**:
- Todo el contenido (productos, planes, categorías)
- Configuraciones de content types
- Imágenes y archivos
- Relaciones entre entidades

## Próximos Pasos

1. ✅ Espera que Railway termine el deploy (~5-10 min)
2. ✅ Accede a Strapi y crea usuario admin
3. ✅ Verifica que los Content Types estén disponibles
4. ⏳ Decide entre importación manual o automática
5. 🎉 ¡Tu ecommerce estará funcionando en Railway con PostgreSQL!

---

**Fecha de exportación**: $(date)
**Ubicación datos**: \`backend/scripts/sqlite-export.json\`
**Strapi URL**: https://strapi-production-77cb.up.railway.app
