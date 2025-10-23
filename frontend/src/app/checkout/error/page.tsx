'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, Home, ShoppingCart } from 'lucide-react';

function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get('orderId');
  const subscriptionId = searchParams.get('subscriptionId');

  return (
    <div className="min-h-screen bg-gray-50 py-28 md:py-32 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Error Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Pago No Procesado
            </h1>
            <p className="text-lg text-gray-600">
              Hubo un problema al procesar tu pago
            </p>
          </div>

          {/* Error Details */}
          <div className="border-t border-gray-200 pt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800 mb-3">
                <strong>Posibles causas:</strong>
              </p>
              <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                <li>Fondos insuficientes en tu método de pago</li>
                <li>Datos incorrectos de la tarjeta</li>
                <li>Cancelaste el proceso de pago</li>
                <li>Tu banco rechazó la transacción</li>
              </ul>
            </div>

            {(orderId || subscriptionId) && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Referencia de la orden:
                </p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">
                  {orderId ? `ORDER-${orderId}` : `SUB-${subscriptionId}`}
                </p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>¿Qué puedes hacer?</strong><br />
                • Verifica que tus datos de pago sean correctos<br />
                • Contacta a tu banco para verificar el rechazo<br />
                • Intenta con otro método de pago<br />
                • Si el problema persiste, contáctanos
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-gray-200">
            <button
              onClick={() => router.push('/checkout')}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              Intentar Nuevamente
            </button>
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Home className="w-5 h-5" />
              Volver al Inicio
            </button>
          </div>
        </div>

        {/* Support Info */}
        <div className="text-center text-sm text-gray-600">
          <p className="mb-2">
            ¿Necesitas ayuda? Estamos aquí para asistirte
          </p>
          <div className="space-y-1">
            <p>
              Email:{' '}
              <a href="mailto:soporte@fitpro.com" className="text-red-500 hover:text-red-600 font-semibold">
                soporte@fitpro.com
              </a>
            </p>
            <p>
              WhatsApp:{' '}
              <a href="https://wa.me/123456789" className="text-red-500 hover:text-red-600 font-semibold">
                +54 9 11 1234-5678
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-28 md:py-32 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
