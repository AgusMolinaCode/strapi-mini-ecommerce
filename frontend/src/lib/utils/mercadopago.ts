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
 * Extrae el código de área del teléfono argentino
 * @param phone Número de teléfono completo
 * @returns Código de área y número separados
 */
export function extractPhoneData(phone: string): {
  areaCode: string;
  number: string;
} {
  // Limpiar el teléfono de caracteres no numéricos
  const cleanPhone = phone.replace(/\D/g, '');

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
