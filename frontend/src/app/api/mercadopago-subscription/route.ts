import { NextRequest } from 'next/server';
import { MercadoPagoConfig, PreApproval } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriberData, planName, planPrice, frequency } = body;

    // Validar datos requeridos
    if (!subscriberData || !planName || !planPrice) {
      return new Response(JSON.stringify({ error: 'Faltan datos requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validar que el precio sea válido
    const price = Number(planPrice);
    if (isNaN(price) || price <= 0) {
      console.error('Precio inválido recibido:', planPrice);
      return new Response(JSON.stringify({ error: 'Precio inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const preApproval = new PreApproval(client);

    // Calcular fecha de inicio (mañana)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);

    // Crear pre-approval (suscripción) en MercadoPago (estructura simplificada)
    const preApprovalData = {
      reason: `Suscripción ${planName}`,
      auto_recurring: {
        frequency: 1,
        frequency_type: frequency === 'monthly' ? 'months' : 'days',
        transaction_amount: price,
        currency_id: 'ARS',
        start_date: startDate.toISOString(),
      },
      back_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/checkout/success`,
    };

    const result = await preApproval.create({ body: preApprovalData });

    return new Response(JSON.stringify({
      preapprovalId: result.id,
      initPoint: result.init_point
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error al crear la suscripción de MercadoPago:', error);
    return new Response(JSON.stringify({ error: 'Error al crear la suscripción' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
