'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutPlanSchema, type CheckoutPlanFormData } from '@/lib/validations/checkout';
import { User, Mail, Phone, FileText } from 'lucide-react';

interface CheckoutFormPlanProps {
  onSubmit: (data: CheckoutPlanFormData) => void;
  isSubmitting?: boolean;
}

const CheckoutFormPlan: React.FC<CheckoutFormPlanProps> = ({ onSubmit, isSubmitting = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutPlanFormData>({
    resolver: zodResolver(checkoutPlanSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Datos Personales */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <User className="w-6 h-6 text-red-500" />
          Datos Personales
        </h2>

        <div className="space-y-5">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                {...register('nombre')}
                type="text"
                id="nombre"
                placeholder="Juan"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.nombre && (
                <p className="mt-2 text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                Apellido *
              </label>
              <input
                {...register('apellido')}
                type="text"
                id="apellido"
                placeholder="Pérez"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.apellido ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.apellido && (
                <p className="mt-2 text-sm text-red-600">{errors.apellido.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-1" />
              Email *
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder="juan@example.com"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Teléfono y DNI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Teléfono *
              </label>
              <input
                {...register('telefono')}
                type="tel"
                id="telefono"
                placeholder="1123456789"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.telefono ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.telefono && (
                <p className="mt-2 text-sm text-red-600">{errors.telefono.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                DNI *
              </label>
              <input
                {...register('dni')}
                type="text"
                id="dni"
                placeholder="12345678"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.dni ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dni && (
                <p className="mt-2 text-sm text-red-600">{errors.dni.message}</p>
              )}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Notas Adicionales (Opcional)
            </label>
            <textarea
              {...register('notas')}
              id="notas"
              rows={3}
              placeholder="Comentarios, preguntas o requisitos especiales..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            ℹ️ <strong>Suscripción:</strong> No se requiere dirección de envío.
            Recibirás un email con tus credenciales de acceso.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white text-xl font-semibold py-5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Procesando...' : 'Proceder al Pago'}
      </button>
    </form>
  );
};

export default CheckoutFormPlan;
