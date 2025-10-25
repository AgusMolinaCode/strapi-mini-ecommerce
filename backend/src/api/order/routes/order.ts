/**
 * order router
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/orders',
      handler: 'order.create',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/orders/:id',
      handler: 'order.findOne',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/orders/mercadopago-webhook',
      handler: 'order.mercadopagoWebhook',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/orders/update-payment-status',
      handler: 'order.updatePaymentStatus',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
