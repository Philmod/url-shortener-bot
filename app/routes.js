const serverStatus = require('express-server-status');
const errorHandler = require('./middlewares/error_handler');

const validUrl = require('valid-url')
const url = require('url')

module.exports = (app) => {

  /**
   * Controllers
   */
  const Controllers = app.set('controllers');
  const webhooks = Controllers.webhooks;

  /**
   * Status.
   */
  app.use('/status', serverStatus(app));

  /**
   * Webhook.
   */
  app.get('/webhook', webhooks.verification);
  app.post('/webhook', webhooks.messages);

  /**
   * Error handler.
   */
  app.use(errorHandler);

}
