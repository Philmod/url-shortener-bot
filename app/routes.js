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
   * Verification route.
   */
  app.get('/webhook', (req, res) => {
    if (req.query['hub.verify_token'] === TOKEN) {
      res.send(req.query['hub.challenge']);
    } else {
      res.send('Error, wrong validation token');
    }
  })

  /**
   * Reception messages.
   */
  app.post('/webhook', (req, res) => {
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i];
      handleIncomingMessage(event)
    }
    res.sendStatus(200);
  })

  /**
   * Handle incoming message.
   */
  var handleIncomingMessage = (event) {
    let sender = event.sender.id;
    let recipient = event.recipient.id;
    let ts = event.timestamp;

    if (event.message && event.message.text) {
      let text = event.message.text;
      let elements = text.split(' ');
      let url;
      elements.forEach(function(elt) {
        url = validUrl.isUri(elt) ? elt : null;
      });
      if (url) {

      } else {
        sendTextMessage(sender, "Post here an url so I help you");
      }
    }
    else if (event.postback) {
      let text = JSON.stringify(event.postback);
      sendTextMessage(sender, "Postback received: " + text.substring(0, 200));
    }
  }

  /**
   * Send message.
   */
  var sendTextMessage = (sender, data) => {
    request({
      url: FACEBOOK_URL,
      qs: {access_token:PAGE_TOKEN},
      method: 'POST',
      json: {
        recipient: {id:sender},
        message: (typeof data === 'string') ? {text: data} : data,
      }
    }, function(error, response, body) {
      if (error) {
        console.log('Error sending message: ', error);
      } else if (response.body.error) {
        console.log('Error: ', response.body.error);
      }
    });
  }

  /**
   * Send generic message.
   */
  var sendGenericMessage = (sender, elements) => {
    let messageData = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": elements
          // [{
          //   "title": "First card",
          //   "subtitle": "Element #1 of an hscroll",
          //   "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
          //   "buttons": [{
          //     "type": "web_url",
          //     "url": "https://www.messenger.com/",
          //     "title": "Web url"
          //   }, {
          //     "type": "postback",
          //     "title": "Postback",
          //     "payload": "Payload for first element in a generic bubble",
          //   }],
          // },{
          //   "title": "Second card",
          //   "subtitle": "Element #2 of an hscroll",
          //   "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
          //   "buttons": [{
          //     "type": "postback",
          //     "title": "Postback",
          //     "payload": "Payload for second element in a generic bubble",
          //   }],
          // }]
        }
      }
    };
    sendTextMessage(sender, messageData);
  }

  /**
   * Error handler.
   */
  app.use(errorHandler);

}
