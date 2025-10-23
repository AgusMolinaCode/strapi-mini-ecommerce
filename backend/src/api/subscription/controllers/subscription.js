'use strict';

const { MercadoPagoConfig, PreApproval } = require('mercadopago');

/**
 * subscription controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::subscription.subscription', ({ strapi }) => ({
  async create(ctx) {
    try {
      const { subscriberData, planId, frequency } = ctx.request.body.data;

      // Validar datos requeridos
      if (!subscriberData || !planId) {
        return ctx.badRequest('Missing required fields');
      }

      // Obtener datos del plan
      const plan = await strapi.entityService.findOne('api::plan.plan', planId);

      if (!plan) {
        return ctx.notFound('Plan not found');
      }

      const externalReference = `subscription-${Date.now()}`;

      // Crear suscripción en la base de datos con status "pending_payment"
      const subscription = await strapi.entityService.create('api::subscription.subscription', {
        data: {
          status: 'pending_payment',
          externalReference,
          plan: planId,
          subscriberName: subscriberData.nombre,
          subscriberEmail: subscriberData.email,
          subscriberPhone: subscriberData.telefono,
          frequency: frequency || plan.periodo,
          amount: plan.precio,
        },
      });

      // Configurar MercadoPago
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      });

      const preApproval = new PreApproval(client);

      // Calcular fecha de inicio y siguiente cobro
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1); // Empieza mañana

      // Crear pre-approval (suscripción) en MercadoPago
      const preApprovalData = {
        reason: `Suscripción ${plan.nombre}`,
        auto_recurring: {
          frequency: 1,
          frequency_type: frequency === 'monthly' ? 'months' : 'days',
          transaction_amount: parseFloat(plan.precio),
          currency_id: 'ARS',
          start_date: startDate.toISOString(),
        },
        back_url: `${process.env.FRONTEND_URL}/checkout/success?subscriptionId=${subscription.id}`,
        external_reference: externalReference,
        payer_email: subscriberData.email,
      };

      const response = await preApproval.create({ body: preApprovalData });

      // Actualizar suscripción con preapprovalId
      await strapi.entityService.update('api::subscription.subscription', subscription.id, {
        data: {
          preapprovalId: response.id,
          startDate: startDate,
        },
      });

      // Devolver suscripción y initPoint al frontend
      return ctx.send({
        subscription: {
          id: subscription.id,
          status: subscription.status,
        },
        preapprovalId: response.id,
        initPoint: response.init_point,
      });

    } catch (error) {
      console.error('Error creating subscription:', error);
      return ctx.internalServerError('Error creating subscription');
    }
  },

  async findOne(ctx) {
    const { id } = ctx.params;

    try {
      const subscription = await strapi.entityService.findOne('api::subscription.subscription', id, {
        populate: ['plan'],
      });

      if (!subscription) {
        return ctx.notFound('Subscription not found');
      }

      return ctx.send({ data: subscription });
    } catch (error) {
      console.error('Error finding subscription:', error);
      return ctx.internalServerError('Error finding subscription');
    }
  },
}));
