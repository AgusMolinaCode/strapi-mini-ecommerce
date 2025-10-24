import { NextRequest } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { buyerData, items, subtotal, shippingCost, total, shippingAddress, orderNumber } = body;

    console.log('Received body:', JSON.stringify(body, null, 2));

    // Validar datos requeridos
    if (!buyerData || !items || !total) {
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

    // Crear preferencia de pago en MercadoPago (estructura simplificada)
    const preferenceData = {
      items: mpItems,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/checkout/success`,
        failure: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/checkout/error`,
        pending: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/checkout/success`
      },
      auto_return: 'approved' as const,
    };

    console.log('Preference data:', JSON.stringify(preferenceData, null, 2));
    console.log('Environment - Access Token exists:', !!process.env.MERCADOPAGO_ACCESS_TOKEN);
    console.log('Environment - Frontend URL:', process.env.NEXT_PUBLIC_FRONTEND_URL);

    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceData });

    console.log('MercadoPago result:', result);

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
