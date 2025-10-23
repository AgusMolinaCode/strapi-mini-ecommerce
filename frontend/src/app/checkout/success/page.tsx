'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Clock, Home } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface OrderData {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  buyerEmail: string;
  items: any[];
  createdAt: string;
}

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('orderId');
  const subscriptionId = searchParams.get('subscriptionId');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId && !subscriptionId) {
        setError('No se encontró información de la orden');
        setLoading(false);
        return;
      }

      try {
        const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
        const endpoint = orderId
          ? `${STRAPI_URL}/api/orders/${orderId}`
          : `${STRAPI_URL}/api/subscriptions/${subscriptionId}`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error('Error al obtener la información');
        }

        const result = await response.json();
        setOrder(result.data);

        // Limpiar carrito solo si es una orden de productos
        if (orderId) {
          clearCart();
        }

      } catch (err) {
        console.error('Error fetching order:', err);
        setError('No se pudo cargar la información de la orden');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, subscriptionId, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-28 md:py-32 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando el pago...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-28 md:py-32 px-4 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Procesando Pago
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'Tu pago está siendo procesado. Recibirás un email de confirmación en breve.'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  const isPending = order.status === 'pending';
  const isApproved = order.status === 'approved' || order.status === 'active';

  return (
    <div className="min-h-screen bg-gray-50 py-28 md:py-32 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            {isApproved ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  ¡Pago Confirmado!
                </h1>
                <p className="text-lg text-gray-600">
                  {orderId ? 'Tu pedido ha sido confirmado exitosamente' : 'Tu suscripción ha sido activada'}
                </p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-12 h-12 text-yellow-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Pago Pendiente
                </h1>
                <p className="text-lg text-gray-600">
                  Tu pago está siendo procesado
                </p>
              </>
            )}
          </div>

          {/* Order Details */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Número de Orden</p>
                <p className="font-semibold text-gray-900">{order.orderNumber || `#${order.id}`}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="font-semibold text-gray-900 capitalize">{order.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-semibold text-gray-900">${order.total?.toLocaleString('es-AR')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900 text-sm">{order.buyerEmail}</p>
              </div>
            </div>

            {isApproved && orderId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">
                      ¿Qué sigue?
                    </p>
                    <p className="text-sm text-blue-800">
                      Recibirás un email de confirmación en {order.buyerEmail} con los detalles de tu pedido.
                      Procesaremos tu envío en las próximas 24-48 horas.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isPending && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  Tu pago está siendo procesado. Te notificaremos por email cuando se confirme.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 border-t border-gray-200">
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <Home className="w-5 h-5" />
              Volver al Inicio
            </button>
            {orderId && (
              <button
                onClick={() => router.push('/productos')}
                className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Package className="w-5 h-5" />
                Ver Más Productos
              </button>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center text-sm text-gray-600">
          <p>
            ¿Tienes alguna pregunta? Contáctanos en{' '}
            <a href="mailto:soporte@fitpro.com" className="text-red-500 hover:text-red-600 font-semibold">
              soporte@fitpro.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-28 md:py-32 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
