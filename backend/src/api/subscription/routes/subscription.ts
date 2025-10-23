/**
 * subscription router
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/subscriptions',
      handler: 'subscription.create',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/subscriptions/:id',
      handler: 'subscription.findOne',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
