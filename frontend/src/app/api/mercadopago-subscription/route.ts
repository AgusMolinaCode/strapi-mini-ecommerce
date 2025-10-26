import { NextRequest } from 'next/server';
import { PreApproval } from 'mercadopago';
import { mercadopago } from '@/lib/clients/mercadopago';
import { extractPhoneData } from '@/lib/utils/mercadopago';

interface CreateSubscriptionRequest {
  subscriberData: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    dni: string;
  };
  planName: string;
  planPrice: number;
  frequency: 'monthly' | 'yearly';
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateSubscriptionRequest = await request.json();
    const { subscriberData, planName, planPrice, frequency } = body;

    // Validar datos requeridos
    if (!subscriberData || !planName || !planPrice) {
      return Response.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Validar que el precio sea válido
    const price = Number(planPrice);
    if (isNaN(price) || price <= 0) {
      console.error('Precio inválido recibido:', planPrice);
      return Response.json(
        { error: 'Precio inválido' },
        { status: 400 }
      );
    }

    const preApproval = new PreApproval(mercadopago);

    // Calcular fecha de inicio (mañana)
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);

    // Crear pre-approval (suscripción) en MercadoPago
    // NOTA: PreApproval no acepta datos detallados del comprador como Preference
    // Solo requiere payer_email
    const preApprovalData = {
      reason: `Suscripción ${planName}`,
      payer_email: subscriberData.email,
      auto_recurring: {
        frequency: 1,
        frequency_type: frequency === 'monthly' ? 'months' : 'days',
        transaction_amount: price,
        currency_id: 'ARS',
        start_date: startDate.toISOString(),
      },
      back_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}checkout/success`,
      external_reference: `SUB-${Date.now()}`,
      status: 'pending',
    };

    const result = await preApproval.create({ body: preApprovalData });

    return Response.json({
      preapprovalId: result.id,
      initPoint: result.init_point,
    });

  } catch (error) {
    console.error('Error creating MercadoPago subscription:', error);

    let errorMessage = 'Error al crear la suscripción';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;

      if (error.message.includes('invalid') || error.message.includes('required')) {
        statusCode = 400;
      }
      else if (error.message.includes('unauthorized') || error.message.includes('credentials')) {
        statusCode = 401;
        errorMessage = 'Error de autenticación con MercadoPago';
      }
      else if (error.message.includes('network') || error.message.includes('timeout')) {
        statusCode = 503;
        errorMessage = 'Servicio temporalmente no disponible. Por favor intenta nuevamente.';
      }
    }

    return Response.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : String(error)) : undefined,
      },
      { status: statusCode }
    );
  }
}
