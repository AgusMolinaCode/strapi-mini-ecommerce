"use server";

import type {
  CreateSubscriptionData,
  CreateSubscriptionResponse,
  GetSubscriptionResponse,
} from '@/lib/interface';

const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function getStrapiData(url: string) {
  try {
    const response = await fetch(baseUrl + url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getPlans() {
  try {
    const response = await fetch(`${baseUrl}/api/plans?populate=*`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

// ============================================
// SUBSCRIPTIONS - Planes recurrentes
// ============================================

/**
 * Crear una suscripción para un plan recurrente
 */
export async function createSubscription(
  subscriptionData: CreateSubscriptionData
): Promise<CreateSubscriptionResponse> {
  // Primero obtener datos del plan
  const planResponse = await fetch(`${baseUrl}/api/plans/${subscriptionData.planId}`);
  if (!planResponse.ok) {
    throw new Error('Error al obtener datos del plan');
  }
  const planData = await planResponse.json();
  const plan = planData.data;

  // Crear la suscripción en Strapi
  const strapiResponse = await fetch(`${baseUrl}/api/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: subscriptionData }),
  });

  if (!strapiResponse.ok) {
    const errorText = await strapiResponse.text();
    throw new Error(`Error al crear la suscripción: ${strapiResponse.status} ${errorText}`);
  }

  const strapiData = await strapiResponse.json();

  // Crear la suscripción en MercadoPago en el frontend
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';
  const mpResponse = await fetch(`${frontendUrl}/api/mercadopago-subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subscriberData: subscriptionData.subscriberData,
      planName: plan.nombre,
      planPrice: plan.precio,
      frequency: subscriptionData.frequency,
    }),
  });

  if (!mpResponse.ok) {
    const mpError = await mpResponse.json();
    throw new Error(`Error al crear la suscripción de MercadoPago: ${mpError.error}`);
  }

  const mpData = await mpResponse.json();

  return {
    subscription: strapiData.subscription,
    preapprovalId: mpData.preapprovalId,
    initPoint: mpData.initPoint,
  };
}

/**
 * Obtener una suscripción por ID
 */
export async function getSubscription(subscriptionId: number) {
  try {
    const response = await fetch(`${baseUrl}/api/subscriptions/${subscriptionId}`);

    if (!response.ok) {
      throw new Error(`Error al obtener la suscripción: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
}
