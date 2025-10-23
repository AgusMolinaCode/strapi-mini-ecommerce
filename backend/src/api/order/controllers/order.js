'use strict';

const { MercadoPagoConfig, Preference } = require('mercadopago');

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
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

      // Configurar MercadoPago
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      });

      const preference = new Preference(client);

      // Preparar items para MercadoPago
      const mpItems = items.map(item => ({
        title: item.title,
        unit_price: parseFloat(item.unitPrice),
        quantity: item.quantity,
        currency_id: 'ARS',
      }));

      // Agregar costo de envío si existe
      if (shippingCost && shippingCost > 0) {
        mpItems.push({
          title: 'Envío',
          unit_price: parseFloat(shippingCost),
          quantity: 1,
          currency_id: 'ARS',
        });
      }

      // Crear preferencia de pago en MercadoPago
      const preferenceData = {
        items: mpItems,
        payer: {
          name: buyerData.nombre,
          email: buyerData.email,
          phone: {
            number: buyerData.telefono
          },
          address: {
            street_name: shippingAddress.direccion,
            street_number: shippingAddress.numero,
            zip_code: shippingAddress.codigoPostal
          }
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL}/checkout/success?orderId=${order.id}`,
          failure: `${process.env.FRONTEND_URL}/checkout/error?orderId=${order.id}`,
          pending: `${process.env.FRONTEND_URL}/checkout/success?orderId=${order.id}`
        },
        auto_return: 'approved',
        external_reference: externalReference,
        notification_url: `${process.env.FRONTEND_URL}/api/mercadopago/webhook`,
        statement_descriptor: 'FitPro',
      };

      const response = await preference.create({ body: preferenceData });

      // Actualizar orden con preferenceId
      await strapi.entityService.update('api::order.order', order.id, {
        data: {
          preferenceId: response.id,
        },
      });

      // Devolver orden y preferenceId al frontend
      return ctx.send({
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
        },
        preferenceId: response.id,
        initPoint: response.init_point,
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
