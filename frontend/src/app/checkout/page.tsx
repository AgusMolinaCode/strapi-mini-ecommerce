'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useCheckoutStore } from '@/store/checkoutStore';
import CheckoutFormProduct from '@/components/checkout/CheckoutFormProduct';
import OrderSummary from '@/components/checkout/OrderSummary';
import { ArrowLeft } from 'lucide-react';
import type { CheckoutProductFormData } from '@/lib/validations/checkout';
import type { CreateOrderData } from '@/lib/interface';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Inicializar MercadoPago solo en el cliente
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY) {
  initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY, { locale: 'es-AR' });
}

const CheckoutPage = () => {
  const router = useRouter();
  const { items, getTotalItems } = useCartStore();
  const { setBuyerData, setPaymentStatus } = useCheckoutStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  // Prevent hydration mismatch by only rendering after client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (isMounted && getTotalItems() === 0) {
      router.push('/');
    }
  }, [isMounted, getTotalItems, router]);

  const handleFormSubmit = async (data: CheckoutProductFormData) => {
    setIsSubmitting(true);
    setPaymentStatus('processing');
    setBuyerData(data);

    try {
      // Calcular totales
      const subtotal = items.reduce((total, item) => total + item.precio * item.quantity, 0);
      const shippingCost = 0;
      const total = subtotal + shippingCost;

      // Preparar datos para la orden en Strapi
      const orderData: CreateOrderData = {
        buyerData: {
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono,
        },
        items: items.map(item => ({
          productId: item.id,
          title: item.titulo,
          quantity: item.quantity,
          unitPrice: item.precio,
          subtotal: item.precio * item.quantity,
          image: item.imagen,
        })),
        subtotal,
        shippingCost,
        total,
        shippingAddress: {
          direccion: data.direccion,
          numero: data.numero,
          piso: data.piso || '',
          ciudad: data.ciudad,
          provincia: data.provincia,
          codigoPostal: data.codigoPostal,
          notas: data.notas || '',
        },
      };

      // 1. Crear orden en Strapi
      const strapiResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: orderData }),
      });

      if (!strapiResponse.ok) {
        throw new Error('Error al crear la orden en Strapi');
      }

      const strapiData = await strapiResponse.json();

      // 2. Crear preferencia de MercadoPago
      const mpResponse = await fetch('/api/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerData: orderData.buyerData,
          items: orderData.items,
          subtotal: orderData.subtotal,
          shippingCost: orderData.shippingCost,
          total: orderData.total,
          shippingAddress: orderData.shippingAddress,
          orderNumber: strapiData.order.orderNumber,
        }),
      });

      if (!mpResponse.ok) {
        const mpError = await mpResponse.json();
        console.error('MercadoPago error:', mpError);
        throw new Error(mpError.error || 'Error al crear la preferencia de MercadoPago');
      }

      const mpData = await mpResponse.json();

      // Guardar preferenceId para mostrar el botón de MercadoPago
      if (mpData.preferenceId) {
        setPreferenceId(mpData.preferenceId);
        setPaymentStatus('success');
      } else {
        throw new Error('No se recibió el preferenceId de MercadoPago');
      }

    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setPaymentStatus('error');

      const errorMessage = error instanceof Error
        ? error.message
        : 'Error al procesar el pago. Por favor intenta nuevamente.';

      alert(errorMessage);
      setIsSubmitting(false);
    }
  };

  // Show loading state during SSR/hydration to prevent mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-28 md:py-32 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // After hydration, redirect if cart is empty
  if (getTotalItems() === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-28 md:py-32 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Finalizar Compra
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Completa tus datos para recibir tu pedido
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form - 3 columns */}
          <div className="lg:col-span-3">
            {!preferenceId ? (
              <CheckoutFormProduct
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Orden creada exitosamente
                </h2>
                <p className="text-gray-600 mb-6">
                  Haz click en el botón de MercadoPago para completar tu pago de forma segura.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Wallet initialization={{ preferenceId }} />
                </div>
              </div>
            )}
          </div>

          {/* Order Summary - 2 columns */}
          <div className="lg:col-span-2">
            <OrderSummary type="product" />
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-white rounded-lg p-6 text-center">
          <p className="text-sm text-gray-600">
            🔒 Tu información está protegida y segura. Los pagos son procesados a través de{' '}
            <strong>MercadoPago</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
