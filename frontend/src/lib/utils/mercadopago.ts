/**
 * Utilidades para MercadoPago
 */

// Códigos de área por provincia de Argentina
const AREA_CODES: Record<string, string> = {
  // CABA y GBA
  'CABA': '11',
  'Buenos Aires': '11',
  'Ciudad Autónoma de Buenos Aires': '11',

  // Provincias
  'Catamarca': '3833',
  'Chaco': '3722',
  'Chubut': '2965',
  'Córdoba': '351',
  'Corrientes': '3794',
  'Entre Ríos': '343',
  'Formosa': '3717',
  'Jujuy': '388',
  'La Pampa': '2954',
  'La Rioja': '3822',
  'Mendoza': '261',
  'Misiones': '3764',
  'Neuquén': '299',
  'Río Negro': '2920',
  'Salta': '387',
  'San Juan': '264',
  'San Luis': '2652',
  'Santa Cruz': '2966',
  'Santa Fe': '342',
  'Santiago del Estero': '385',
  'Tierra del Fuego': '2901',
  'Tucumán': '381',
};

/**
 * Extrae el código de área del teléfono argentino basado en la provincia
 * @param phone Número de teléfono completo
 * @param province Provincia del comprador
 * @returns Código de área y número separados
 */
export function extractPhoneData(phone: string, province?: string): {
  areaCode: string;
  number: string;
} {
  // Limpiar el teléfono de caracteres no numéricos
  const cleanPhone = phone.replace(/\D/g, '');

  // Si la provincia está especificada, usar su código de área
  if (province && AREA_CODES[province]) {
    const areaCode = AREA_CODES[province];
    // Si el teléfono empieza con el código de área, quitarlo
    if (cleanPhone.startsWith(areaCode)) {
      return {
        areaCode,
        number: cleanPhone.slice(areaCode.length),
      };
    }
    // Si no, asumir que el teléfono no incluye el código de área
    return {
      areaCode,
      number: cleanPhone,
    };
  }

  // Fallback: Asumir CABA (código 11) si no se especifica provincia
  // Si el teléfono tiene 10 dígitos y empieza con 11, separar
  if (cleanPhone.length === 10 && cleanPhone.startsWith('11')) {
    return {
      areaCode: '11',
      number: cleanPhone.slice(2),
    };
  }

  // Default: código de área 11 (CABA)
  return {
    areaCode: '11',
    number: cleanPhone,
  };
}

/**
 * Mapeo de categorías de productos a categorías de MercadoPago
 * https://www.mercadopago.com.ar/developers/es/docs/checkout-api/integration-configuration/improve-approval-rates
 */
export function getItemCategory(productTitle: string): string {
  const title = productTitle.toLowerCase();

  // Deportes y Fitness
  if (title.includes('proteína') ||
      title.includes('creatina') ||
      title.includes('bcaa') ||
      title.includes('suplemento') ||
      title.includes('plan') ||
      title.includes('suscripción')) {
    return 'health';
  }

  // Ropa deportiva
  if (title.includes('remera') ||
      title.includes('short') ||
      title.includes('calza') ||
      title.includes('ropa')) {
    return 'fashion';
  }

  // Accesorios
  if (title.includes('botella') ||
      title.includes('shaker') ||
      title.includes('accesorio')) {
    return 'accessories';
  }

  // Default
  return 'others';
}

/**
 * Genera una descripción detallada del producto para MercadoPago
 * @param title Título del producto
 * @param quantity Cantidad
 * @returns Descripción del producto
 */
export function generateItemDescription(title: string, quantity: number): string {
  return `${title} - Cantidad: ${quantity} unidad${quantity > 1 ? 'es' : ''}`;
}
