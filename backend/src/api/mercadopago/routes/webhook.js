module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/mercadopago/webhook',
      handler: 'webhook.webhook',
      config: {
        auth: false, // MercadoPago webhooks no usan autenticación
      },
    },
  ],
};
