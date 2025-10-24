/**
 * subscription controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::subscription.subscription', ({ strapi }) => ({
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

      // Devolver suscripción al frontend
      return ctx.send({
        subscription: {
          id: subscription.id,
          status: subscription.status,
        },
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
