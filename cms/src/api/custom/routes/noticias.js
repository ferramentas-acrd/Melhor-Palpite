module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/custom/noticias',
      handler: 'custom.noticias',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    }
  ],
};