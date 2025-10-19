'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useCheckoutStore } from '@/store/checkoutStore';
import CheckoutFormProduct from '@/components/checkout/CheckoutFormProduct';
import OrderSummary from '@/components/checkout/OrderSummary';
import { ArrowLeft } from 'lucide-react';
import type { CheckoutProductFormData } from '@/lib/validations/checkout';

const CheckoutPage = () => {
  const router = useRouter();
  const { items, getTotalItems } = useCartStore();
  const { setBuyerData, setPaymentStatus } = useCheckoutStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (getTotalItems() === 0) {
      router.push('/');
    }
  }, [getTotalItems, router]);

  const handleFormSubmit = async (data: CheckoutProductFormData) => {
    setIsSubmitting(true);
    setPaymentStatus('processing');
    setBuyerData(data);

    try {
      // TODO: Integrar con MercadoPago
      // 1. Enviar datos al backend para crear preferencia de pago
      // 2. Recibir preferenceId de MercadoPago
      // 3. Redirigir a MercadoPago checkout

      console.log('Datos del comprador:', data);
      console.log('Items del carrito:', items);

      // Simulación temporal
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert('Funcionalidad de pago próximamente. Datos guardados correctamente.');
      setPaymentStatus('success');

      // TODO: Descomentar cuando MercadoPago esté integrado
      // router.push('/checkout/success');
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setPaymentStatus('error');
      alert('Error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (getTotalItems() === 0) {
    return null; // Will redirect
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
            <CheckoutFormProduct
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
            />
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
