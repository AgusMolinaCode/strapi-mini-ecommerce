'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCheckoutStore } from '@/store/checkoutStore';
import CheckoutFormPlan from '@/components/checkout/CheckoutFormPlan';
import OrderSummary from '@/components/checkout/OrderSummary';
import { ArrowLeft } from 'lucide-react';
import type { CheckoutPlanFormData } from '@/lib/validations/checkout';
import type { CreateSubscriptionData } from '@/lib/interface';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Inicializar MercadoPago solo en el cliente
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY) {
  initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY, { locale: 'es-AR' });
}

const CheckoutPlanContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedPlan, setBuyerData, setPaymentStatus } = useCheckoutStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

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
      if (!selectedPlan) {
        throw new Error('No hay plan seleccionado');
      }

      // Preparar datos para la suscripción en Strapi
      const subscriptionData: CreateSubscriptionData = {
        subscriberData: {
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          telefono: data.telefono,
          dni: data.dni,
        },
        planId: selectedPlan.id,
        frequency: 'monthly',
      };

      // 1. Crear suscripción en Strapi
      const strapiResponse = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: subscriptionData }),
      });

      if (!strapiResponse.ok) {
        throw new Error('Error al crear la suscripción en Strapi');
      }

      const strapiData = await strapiResponse.json();

      // 2. Crear suscripción de MercadoPago
      const mpResponse = await fetch('/api/mercadopago-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriberData: subscriptionData.subscriberData,
          planName: selectedPlan.nombre,
          planPrice: selectedPlan.precio,
          frequency: subscriptionData.frequency,
        }),
      });

      if (!mpResponse.ok) {
        const mpError = await mpResponse.json();
        console.error('MercadoPago error:', mpError);
        throw new Error(mpError.error || 'Error al crear la suscripción de MercadoPago');
      }

      const mpData = await mpResponse.json();

      // Guardar preapprovalId para mostrar el botón de MercadoPago
      if (mpData.preapprovalId) {
        setPreferenceId(mpData.preapprovalId);
        setPaymentStatus('success');
      } else {
        throw new Error('No se recibió el preapprovalId de MercadoPago');
      }

    } catch (error) {
      console.error('Error al procesar la suscripción:', error);
      setPaymentStatus('error');

      const errorMessage = error instanceof Error
        ? error.message
        : 'Error al procesar la suscripción. Por favor intenta nuevamente.';

      alert(errorMessage);
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
            {!preferenceId ? (
              <CheckoutFormPlan
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
              />
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Suscripción creada exitosamente
                </h2>
                <p className="text-gray-600 mb-6">
                  Haz click en el botón de MercadoPago para activar tu suscripción de forma segura.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Wallet initialization={{ preferenceId, redirectMode: 'blank' }} />
                </div>
              </div>
            )}
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

const CheckoutPlanPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-28 md:py-32 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando checkout...</p>
        </div>
      </div>
    }>
      <CheckoutPlanContent />
    </Suspense>
  );
};

export default CheckoutPlanPage;
