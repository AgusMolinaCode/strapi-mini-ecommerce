'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCheckoutStore } from '@/store/checkoutStore';
import CheckoutFormPlan from '@/components/checkout/CheckoutFormPlan';
import OrderSummary from '@/components/checkout/OrderSummary';
import { ArrowLeft } from 'lucide-react';
import type { CheckoutPlanFormData } from '@/lib/validations/checkout';

const CheckoutPlanPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedPlan, setBuyerData, setPaymentStatus } = useCheckoutStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if no plan selected
  useEffect(() => {
    const planId = searchParams.get('planId');
    if (!selectedPlan && !planId) {
      router.push('/planes');
    }
  }, [selectedPlan, searchParams, router]);

  const handleFormSubmit = async (data: CheckoutPlanFormData) => {
    setIsSubmitting(true);
    setPaymentStatus('processing');
    setBuyerData(data);

    try {
      // TODO: Integrar con MercadoPago para suscripciones
      // 1. Enviar datos al backend para crear suscripción
      // 2. Recibir preapproval_id de MercadoPago
      // 3. Redirigir a MercadoPago checkout

      console.log('Datos del suscriptor:', data);
      console.log('Plan seleccionado:', selectedPlan);

      // Simulación temporal
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert('Funcionalidad de suscripción próximamente. Datos guardados correctamente.');
      setPaymentStatus('success');

      // TODO: Descomentar cuando MercadoPago esté integrado
      // router.push('/checkout/success');
    } catch (error) {
      console.error('Error al procesar la suscripción:', error);
      setPaymentStatus('error');
      alert('Error al procesar la suscripción. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 py-28 md:py-32 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No hay plan seleccionado
          </h2>
          <button
            onClick={() => router.push('/planes')}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Ver Planes
          </button>
        </div>
      </div>
    );
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
            Finalizar Suscripción
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Completa tus datos para activar tu plan
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form - 3 columns */}
          <div className="lg:col-span-3">
            <CheckoutFormPlan
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Order Summary - 2 columns */}
          <div className="lg:col-span-2">
            <OrderSummary type="plan" plan={selectedPlan} />
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

export default CheckoutPlanPage;
