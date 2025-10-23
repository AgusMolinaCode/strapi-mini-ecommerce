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
import { createOrder } from '@/data/actions/strapi';

const CheckoutPage = () => {
  const router = useRouter();
  const { items, getTotalItems } = useCartStore();
  const { setBuyerData, setPaymentStatus } = useCheckoutStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

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
      const shippingCost = 0; // Puedes calcular esto según la ubicación
      const total = subtotal + shippingCost;

      // Preparar datos para la API usando el tipo correcto
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

      // Crear orden usando la función de strapi.ts
      const result = await createOrder(orderData);

      // Guardar orden ID en el store
      setPaymentStatus('success');

      // Redirigir a MercadoPago
      if (result.initPoint) {
        window.location.href = result.initPoint;
      } else {
        throw new Error('No se recibió el link de pago');
      }

    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setPaymentStatus('error');

      // Mostrar mensaje de error más específico
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
