const config = require('config');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const morgan = require('morgan');

module.exports = function(app) {

  // Body parser.
  app.use(bodyParser.json());

  // Logs.
  app.use(morgan(config.logger));

  // Error handling.
  app.use(errorhandler());

}
