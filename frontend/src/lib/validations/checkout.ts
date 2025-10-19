import { z } from 'zod';

// Schema para checkout de productos (requiere dirección de envío)
export const checkoutProductSchema = z.object({
  // Datos personales
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),

  // Dirección de envío
  direccion: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  numero: z.string().min(1, 'El número es requerido'),
  piso: z.string().optional(),
  ciudad: z.string().min(3, 'La ciudad es requerida'),
  provincia: z.string().min(3, 'La provincia es requerida'),
  codigoPostal: z.string().min(4, 'El código postal debe tener al menos 4 caracteres'),

  // Notas adicionales (opcional)
  notas: z.string().optional(),
});

// Schema para checkout de planes de suscripción (sin dirección de envío)
export const checkoutPlanSchema = z.object({
  // Datos personales
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),

  // Notas adicionales (opcional)
  notas: z.string().optional(),
});

// Types derivados de los schemas
export type CheckoutProductFormData = z.infer<typeof checkoutProductSchema>;
export type CheckoutPlanFormData = z.infer<typeof checkoutPlanSchema>;
