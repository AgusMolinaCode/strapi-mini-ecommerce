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
}));
