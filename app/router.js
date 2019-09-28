/**
 * @file router
 * @author atom-yang
 */

module.exports = app => {
  const {
    router,
    controller
  } = app;
  router.get('/', controller.home.index);
  router.post('/api/token/apply', controller.token.apply);
  router.get('/api/token/chains', controller.token.getChains);
  router.get('/api/token/initCsrfToken', controller.initCsrfToken.initToken);
};
