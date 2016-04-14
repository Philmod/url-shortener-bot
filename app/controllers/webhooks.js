'use strict';

const config = require('config');

module.exports = app => {

  const errors = app.errors;
  const messageLib = require('../lib/message')(app);

  /**
   * Verify token.
   */
  const verification = (req, res, next) => {
    if (req.query['hub.verify_token'] === config.facebook_verif_token) {
      res.send(req.query['hub.challenge']);
    } else {
      next(new errors.Unauthorized('Wrong validation token.'));
    }
  };

  /**
   * Receive messages.
   */
  const messages = (req, res, next) => {
    console.log('req.body : ', JSON.stringify(req.body));
    let messaging_events = req.body.entry[0].messaging;
    messaging_events.forEach(messageLib.handle);
    res.sendStatus(200);
  };

  return {
    verification: verification,
    messages: messages
  }
}
