"use server";

import type {
  CreateOrderData,
  CreateOrderResponse,
  GetOrderResponse,
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

export async function getProductos() {
  try {
    const response = await fetch(`${baseUrl}/api/productos?populate=*`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getCategorias() {
  try {
    const response = await fetch(`${baseUrl}/api/categorias?populate=*`);
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
// ORDERS - Productos físicos
// ============================================

/**
 * Crear una orden de compra para productos físicos
 */
export async function createOrder(orderData: CreateOrderData): Promise<CreateOrderResponse> {
  const response = await fetch(`${baseUrl}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: orderData }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al crear la orden: ${response.status} ${errorText}`);
  }

  return response.json();
}

/**
 * Obtener una orden por ID
 */
export async function getOrder(orderId: number) {
  try {
    const response = await fetch(`${baseUrl}/api/orders/${orderId}`);

    if (!response.ok) {
      throw new Error(`Error al obtener la orden: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
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
  const response = await fetch(`${baseUrl}/api/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: subscriptionData }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al crear la suscripción: ${response.status} ${errorText}`);
  }

  return response.json();
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
