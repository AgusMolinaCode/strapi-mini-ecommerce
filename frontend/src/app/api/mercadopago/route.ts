import { NextRequest } from 'next/server';
import { Preference } from 'mercadopago';
import { mercadopago } from '@/lib/clients/mercadopago';
import {
  extractPhoneData,
  getItemCategory,
  generateItemDescription,
} from '@/lib/utils/mercadopago';

interface CreatePreferenceRequest {
  buyerData: {
    nombre: string;
    apellido?: string;
    email: string;
    telefono: string;
    dni?: string;
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
  shippingAddress?: {
    direccion: string;
    numero: string;
    piso?: string;
    ciudad: string;
    provincia: string;
    codigoPostal: string;
  };
  orderNumber: string;
  orderId: number;
  externalReference: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePreferenceRequest = await request.json();
    const { buyerData, items, shippingCost, shippingAddress, orderId, externalReference } = body;

    // Validar datos requeridos
    if (!buyerData || !items || !orderId || !externalReference) {
      return Response.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Extraer área code del teléfono
    const phoneData = extractPhoneData(
      buyerData.telefono,
      shippingAddress?.provincia
    );

    // Preparar items para MercadoPago con campos adicionales
    const mpItems = items.map((item) => ({
      id: item.productId.toString(),
      title: item.title,
      description: generateItemDescription(item.title, item.quantity),
      category_id: getItemCategory(item.title),
      quantity: item.quantity,
      unit_price: Number(item.unitPrice),
      currency_id: 'ARS',
    }));

    // Agregar costo de envío si existe
    if (shippingCost > 0) {
      mpItems.push({
        id: 'shipping',
        title: 'Envío',
        description: 'Costo de envío a domicilio',
        category_id: 'services',
        quantity: 1,
        unit_price: Number(shippingCost),
        currency_id: 'ARS',
      });
    }

    // Preparar datos del comprador
    const payerData: any = {
      email: buyerData.email,
      phone: {
        area_code: phoneData.areaCode,
        number: phoneData.number,
      },
    };

    // Agregar nombre y apellido si están disponibles
    if (buyerData.nombre) {
      payerData.name = buyerData.nombre;
    }
    if (buyerData.apellido) {
      payerData.surname = buyerData.apellido;
    }

    // Agregar identificación si está disponible
    if (buyerData.dni) {
      payerData.identification = {
        type: 'DNI',
        number: buyerData.dni,
      };
    }

    // Agregar dirección si está disponible
    if (shippingAddress) {
      payerData.address = {
        street_name: shippingAddress.direccion,
        street_number: shippingAddress.numero,
        zip_code: shippingAddress.codigoPostal,
      };
    }

    // Crear preferencia con todos los campos optimizados
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
        binary_mode: true, // Aprobación instantánea
        payment_methods: {
          installments: 12, // Máximo 12 cuotas
        },
        metadata: {
          order_id: orderId.toString(),
        },
        payer: payerData,
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

    // Determinar el tipo de error y responder apropiadamente
    let errorMessage = 'Error al crear la preferencia de pago';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;

      // Errores de validación de MercadoPago
      if (error.message.includes('invalid') || error.message.includes('required')) {
        statusCode = 400;
      }
      // Errores de autenticación
      else if (error.message.includes('unauthorized') || error.message.includes('credentials')) {
        statusCode = 401;
        errorMessage = 'Error de autenticación con MercadoPago';
      }
      // Errores de red
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
