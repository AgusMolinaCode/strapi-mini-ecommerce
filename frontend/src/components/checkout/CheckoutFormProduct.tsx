'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutProductSchema, type CheckoutProductFormData } from '@/lib/validations/checkout';
import { User, Mail, Phone, MapPin, FileText } from 'lucide-react';

interface CheckoutFormProductProps {
  onSubmit: (data: CheckoutProductFormData) => void;
  isSubmitting?: boolean;
}

const CheckoutFormProduct: React.FC<CheckoutFormProductProps> = ({ onSubmit, isSubmitting = false }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutProductFormData>({
    resolver: zodResolver(checkoutProductSchema),
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
        </div>
      </div>

      {/* Dirección de Envío */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <MapPin className="w-6 h-6 text-red-500" />
          Dirección de Envío
        </h2>

        <div className="space-y-5">
          {/* Dirección y Número */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                Calle *
              </label>
              <input
                {...register('direccion')}
                type="text"
                id="direccion"
                placeholder="Av. Corrientes"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.direccion ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.direccion && (
                <p className="mt-2 text-sm text-red-600">{errors.direccion.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-2">
                Número *
              </label>
              <input
                {...register('numero')}
                type="text"
                id="numero"
                placeholder="1234"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.numero ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.numero && (
                <p className="mt-2 text-sm text-red-600">{errors.numero.message}</p>
              )}
            </div>
          </div>

          {/* Piso */}
          <div>
            <label htmlFor="piso" className="block text-sm font-medium text-gray-700 mb-2">
              Piso / Depto (Opcional)
            </label>
            <input
              {...register('piso')}
              type="text"
              id="piso"
              placeholder="5° B"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Ciudad y Provincia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad *
              </label>
              <input
                {...register('ciudad')}
                type="text"
                id="ciudad"
                placeholder="Buenos Aires"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.ciudad ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.ciudad && (
                <p className="mt-2 text-sm text-red-600">{errors.ciudad.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="provincia" className="block text-sm font-medium text-gray-700 mb-2">
                Provincia *
              </label>
              <input
                {...register('provincia')}
                type="text"
                id="provincia"
                placeholder="CABA"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.provincia ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.provincia && (
                <p className="mt-2 text-sm text-red-600">{errors.provincia.message}</p>
              )}
            </div>
          </div>

          {/* Código Postal */}
          <div>
            <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-700 mb-2">
              Código Postal *
            </label>
            <input
              {...register('codigoPostal')}
              type="text"
              id="codigoPostal"
              placeholder="1414"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                errors.codigoPostal ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.codigoPostal && (
              <p className="mt-2 text-sm text-red-600">{errors.codigoPostal.message}</p>
            )}
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
              placeholder="Instrucciones de entrega, referencias, etc."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
            />
          </div>
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

export default CheckoutFormProduct;
