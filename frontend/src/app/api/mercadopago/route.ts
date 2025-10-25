import { NextRequest } from 'next/server';
import { Preference } from 'mercadopago';
import { mercadopago } from '@/lib/clients/mercadopago';

interface CreatePreferenceRequest {
  buyerData: {
    nombre: string;
    email: string;
    telefono: string;
  };
  items: Array<{
    productId: number;
    title: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    direccion: string;
    numero: string;
    codigoPostal: string;
  };
  orderNumber: string;
  orderId: number;
  externalReference: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePreferenceRequest = await request.json();
    const { buyerData, items, shippingCost, orderId, externalReference } = body;

    // Validar datos requeridos
    if (!buyerData || !items || !orderId || !externalReference) {
      return Response.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Preparar items para MercadoPago
    const mpItems = items.map((item) => ({
      id: item.productId.toString(),
      title: item.title,
      quantity: item.quantity,
      unit_price: Number(item.unitPrice),
      currency_id: 'ARS',
    }));

    // Agregar costo de envío si existe
    if (shippingCost > 0) {
      mpItems.push({
        id: 'shipping',
        title: 'Envío',
        quantity: 1,
        unit_price: Number(shippingCost),
        currency_id: 'ARS',
      });
    }

    // Crear preferencia
    const preference = new Preference(mercadopago);
    const result = await preference.create({
      body: {
        items: mpItems,
        external_reference: externalReference,
        notification_url: `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders/mercadopago-webhook`,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_FRONTEND_URL}checkout/success?orderId=${orderId}`,
          failure: `${process.env.NEXT_PUBLIC_FRONTEND_URL}checkout/error?orderId=${orderId}`,
          pending: `${process.env.NEXT_PUBLIC_FRONTEND_URL}checkout/pending?orderId=${orderId}`,
        },
        auto_return: 'approved',
        statement_descriptor: 'FITPRO',
        metadata: {
          order_id: orderId.toString(),
        },
        payer: {
          name: buyerData.nombre,
          email: buyerData.email,
          phone: {
            area_code: '11',
            number: buyerData.telefono,
          },
        },
      },
    });

    // Actualizar orden con preferenceId
    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders/update-payment-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        preferenceId: result.id,
      }),
    });

    return Response.json({
      preferenceId: result.id,
      initPoint: result.init_point,
    });

  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);

    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Error al crear la preferencia',
      },
      { status: 500 }
    );
  }
}
