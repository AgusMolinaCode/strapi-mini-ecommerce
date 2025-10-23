'use strict';

const { MercadoPagoConfig, Payment, PreApproval } = require('mercadopago');

module.exports = {
  async webhook(ctx) {
    const { type, action, data } = ctx.request.body;

    console.log('MercadoPago Webhook received:', { type, action, data });

    try {
      // Configurar cliente MercadoPago
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      });

      // Manejar notificaciones de pago
      if (type === 'payment') {
        const payment = new Payment(client);
        const paymentInfo = await payment.get({ id: data.id });

        console.log('Payment info:', paymentInfo);

        // Extraer external_reference (ej: "order-123456")
        const externalRef = paymentInfo.external_reference;

        if (!externalRef) {
          console.error('No external_reference found in payment');
          return ctx.send({ received: true });
        }

        // Buscar orden por externalReference
        const orders = await strapi.entityService.findMany('api::order.order', {
          filters: { externalReference: externalRef },
        });

        if (!orders || orders.length === 0) {
          console.error('Order not found for external_reference:', externalRef);
          return ctx.send({ received: true });
        }

        const order = orders[0];

        // Mapear status de MercadoPago a nuestro sistema
        let orderStatus = 'pending';
        switch (paymentInfo.status) {
          case 'approved':
            orderStatus = 'approved';
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
            orderStatus = 'failed';
        }

        // Actualizar orden en la base de datos
        await strapi.entityService.update('api::order.order', order.id, {
          data: {
            status: orderStatus,
            paymentId: paymentInfo.id,
            paidAt: paymentInfo.status === 'approved' ? new Date() : null,
          },
        });

        console.log(`Order ${order.orderNumber} updated to status: ${orderStatus}`);
      }

      // Manejar notificaciones de suscripción
      if (type === 'subscription_preapproval') {
        const preApproval = new PreApproval(client);
        const preApprovalInfo = await preApproval.get({ id: data.id });

        console.log('PreApproval info:', preApprovalInfo);

        const externalRef = preApprovalInfo.external_reference;

        if (!externalRef) {
          console.error('No external_reference found in preapproval');
          return ctx.send({ received: true });
        }

        // Buscar suscripción por externalReference
        const subscriptions = await strapi.entityService.findMany('api::subscription.subscription', {
          filters: { externalReference: externalRef },
        });

        if (!subscriptions || subscriptions.length === 0) {
          console.error('Subscription not found for external_reference:', externalRef);
          return ctx.send({ received: true });
        }

        const subscription = subscriptions[0];

        // Mapear status de MercadoPago a nuestro sistema
        let subscriptionStatus = 'pending_payment';
        switch (preApprovalInfo.status) {
          case 'authorized':
            subscriptionStatus = 'active';
            break;
          case 'paused':
            subscriptionStatus = 'paused';
            break;
          case 'cancelled':
            subscriptionStatus = 'cancelled';
            break;
          default:
            subscriptionStatus = 'pending_payment';
        }

        // Actualizar suscripción en la base de datos
        const updateData = {
          status: subscriptionStatus,
        };

        if (subscriptionStatus === 'active' && !subscription.activatedAt) {
          updateData.activatedAt = new Date();
        }

        if (subscriptionStatus === 'cancelled' && !subscription.cancelledAt) {
          updateData.cancelledAt = new Date();
        }

        await strapi.entityService.update('api::subscription.subscription', subscription.id, {
          data: updateData,
        });

        console.log(`Subscription ${subscription.id} updated to status: ${subscriptionStatus}`);
      }

      return ctx.send({ received: true });

    } catch (error) {
      console.error('Webhook error:', error);
      return ctx.send({ received: true, error: error.message });
    }
  },
};
