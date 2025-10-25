import { NextRequest } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buyerData, items, subtotal, shippingCost, total, shippingAddress, orderNumber, orderId, externalReference } = body;

    console.log('Received body:', JSON.stringify(body, null, 2));

    // Validar datos requeridos
    if (!buyerData || !items || !total || !orderId || !externalReference) {
      return new Response(JSON.stringify({ error: 'Faltan datos requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Preparar items para MercadoPago
    const mpItems = items.map((item: any) => ({
      id: item.productId.toString(),
      title: item.title,
      quantity: item.quantity,
      unit_price: parseFloat(item.unitPrice.toString()),
      currency_id: 'ARS',
    }));

    console.log('MercadoPago items:', JSON.stringify(mpItems, null, 2));

    // Agregar costo de envío si existe
    if (shippingCost && shippingCost > 0) {
      mpItems.push({
        id: 'shipping',
        title: 'Envío',
        quantity: 1,
        unit_price: parseFloat(shippingCost.toString()),
        currency_id: 'ARS',
      });
    }

    // Crear preferencia de pago en MercadoPago con webhook y external_reference
    const preferenceData = {
      items: mpItems,
      external_reference: externalReference,
      notification_url: `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders/mercadopago-webhook`,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_FRONTEND_URL}checkout/success?orderId=${orderId}`,
        failure: `${process.env.NEXT_PUBLIC_FRONTEND_URL}checkout/error?orderId=${orderId}`,
        pending: `${process.env.NEXT_PUBLIC_FRONTEND_URL}checkout/pending?orderId=${orderId}`,
      },
      auto_return: 'approved' as const,
      metadata: {
        order_id: orderId.toString(),
        order_number: orderNumber,
      },
      payer: {
        name: buyerData.nombre,
        email: buyerData.email,
        phone: {
          number: buyerData.telefono,
        },
      },
    };

    console.log('Preference data:', JSON.stringify(preferenceData, null, 2));
    console.log('Environment - Access Token exists:', !!process.env.MERCADOPAGO_ACCESS_TOKEN);
    console.log('Environment - Frontend URL:', process.env.NEXT_PUBLIC_FRONTEND_URL);
    console.log('Environment - Strapi URL:', process.env.NEXT_PUBLIC_STRAPI_URL);

    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceData });

    console.log('MercadoPago result:', result);

    // Actualizar orden con preferenceId
    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders/update-payment-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        preferenceId: result.id,
      }),
    });

    return new Response(JSON.stringify({
      preferenceId: result.id,
      initPoint: result.init_point
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error al crear la preferencia de MercadoPago:', error);

    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    const errorMessage = error instanceof Error ? error.message : 'Error al crear la preferencia';

    return new Response(JSON.stringify({
      error: errorMessage,
      details: error instanceof Error ? error.stack : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
