/**
 * order controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    try {
      const { buyerData, items, subtotal, shippingCost, total, shippingAddress } = ctx.request.body.data;

      // Validar datos requeridos
      if (!buyerData || !items || !total) {
        return ctx.badRequest('Missing required fields');
      }

      // Generar número de orden único
      const orderCount = await strapi.entityService.count('api::order.order');
      const orderNumber = `ORD-${new Date().getFullYear()}-${String(orderCount + 1).padStart(6, '0')}`;
      const externalReference = `order-${Date.now()}`;

      // Crear orden en la base de datos con status "pending"
      const order = await strapi.entityService.create('api::order.order', {
        data: {
          orderNumber,
          status: 'pending',
          externalReference,
          buyerName: buyerData.nombre,
          buyerEmail: buyerData.email,
          buyerPhone: buyerData.telefono,
          shippingAddress: {
            direccion: shippingAddress.direccion,
            numero: shippingAddress.numero,
            piso: shippingAddress.piso,
            ciudad: shippingAddress.ciudad,
            provincia: shippingAddress.provincia,
            codigoPostal: shippingAddress.codigoPostal,
            notas: shippingAddress.notas
          },
          items,
          subtotal,
          shippingCost: shippingCost || 0,
          total,
          notes: shippingAddress.notas
        },
      });

      // Devolver orden al frontend
      return ctx.send({
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          externalReference: order.externalReference,
        },
      });

    } catch (error) {
      console.error('Error creating order:', error);
      return ctx.internalServerError('Error creating order');
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    try {
      const order = await strapi.entityService.findOne('api::order.order', id);

      if (!order) {
        return ctx.notFound('Order not found');
      }

      return ctx.send({ data: order });
    } catch (error) {
      console.error('Error finding order:', error);
      return ctx.internalServerError('Error finding order');
    }
  },

  async mercadopagoWebhook(ctx) {
    try {
      const { type, data } = ctx.request.body;

      console.log('🔔 Webhook received from MercadoPago:', JSON.stringify(ctx.request.body, null, 2));

      // MercadoPago envía notificaciones de tipo "payment"
      if (type !== 'payment') {
        console.log('⚠️ Webhook type not supported:', type);
        return ctx.send({ received: true });
      }

      const paymentId = data?.id;

      if (!paymentId) {
        console.log('⚠️ No payment ID in webhook data');
        return ctx.badRequest('Missing payment ID');
      }

      // Obtener información del pago desde MercadoPago
      const mercadopago = require('mercadopago');
      mercadopago.configure({
        access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
      });

      const payment = await mercadopago.payment.get(paymentId);
      console.log('💳 Payment info from MercadoPago:', JSON.stringify(payment.body, null, 2));

      const externalReference = payment.body.external_reference;
      const status = payment.body.status;
      const preferenceId = payment.body.metadata?.preference_id;

      // Buscar orden por external_reference
      const orders = await strapi.entityService.findMany('api::order.order', {
        filters: { externalReference },
        limit: 1,
      });

      if (!orders || orders.length === 0) {
        console.log('⚠️ Order not found with external_reference:', externalReference);
        return ctx.notFound('Order not found');
      }

      const order = orders[0];

      // Mapear estado de MercadoPago a estado de orden
      let orderStatus: 'pending' | 'approved' | 'rejected' | 'failed' | 'shipped' | 'delivered' | 'cancelled' = 'pending';
      let paidAt: string | null = null;

      switch (status) {
        case 'approved':
          orderStatus = 'approved';
          paidAt = new Date().toISOString();
          break;
        case 'rejected':
        case 'cancelled':
          orderStatus = 'rejected';
          break;
        case 'in_process':
        case 'pending':
          orderStatus = 'pending';
          break;
        default:
          orderStatus = 'pending';
      }

      // Actualizar orden
      const updatedOrder = await strapi.entityService.update('api::order.order', order.id, {
        data: {
          status: orderStatus,
          paymentId: paymentId.toString(),
          preferenceId: preferenceId || order.preferenceId,
          paidAt,
        },
      });

      console.log('✅ Order updated successfully:', {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: orderStatus,
        paymentId,
      });

      return ctx.send({ received: true, order: updatedOrder });

    } catch (error) {
      console.error('❌ Error processing MercadoPago webhook:', error);

      // Retornar 200 para evitar que MercadoPago reintente
      return ctx.send({ received: true, error: error.message });
    }
  },

  async updatePaymentStatus(ctx) {
    try {
      const { orderId, preferenceId } = ctx.request.body;

      if (!orderId || !preferenceId) {
        return ctx.badRequest('Missing orderId or preferenceId');
      }

      // Buscar orden
      const order = await strapi.entityService.findOne('api::order.order', orderId);

      if (!order) {
        return ctx.notFound('Order not found');
      }

      // Actualizar preferenceId si no existe
      if (!order.preferenceId) {
        await strapi.entityService.update('api::order.order', orderId, {
          data: { preferenceId },
        });
      }

      return ctx.send({ success: true });

    } catch (error) {
      console.error('Error updating payment status:', error);
      return ctx.internalServerError('Error updating payment status');
    }
  },
}));
