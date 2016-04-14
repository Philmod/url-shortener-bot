'use strict';
const validUrl = require('valid-url');
const url = require('url');


module.exports = app => {

  /**
   * Handle incoming message.
   */
  const handle = event => {
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
        send(sender, "Post here an url so I help you");
      }
    }
    else if (event.postback) {
      let text = JSON.stringify(event.postback);
      send(sender, "Postback received: " + text.substring(0, 200));
    }
  }

  /**
   * Send a message.
   */
  const send = (sender, data) => {
    const message = (typeof data === 'string') ? {text: data} : data;
    request({
      url: FACEBOOK_URL,
      qs: {access_token:PAGE_TOKEN},
      method: 'POST',
      json: {
        recipient: {id:sender},
        message: message
      }
    }, function(error, response, body) {
      if (error || response.body.error) {
        console.log('Error sending message: ', error || response.body.error);
      } else {
        console.log('Successfully sent message.');
      }
    });
  }

  /**
   * Send templated message.
   */
  const sendTemplate = (sender, elements) => {
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

  return {
    handle: handle,
    send: send,
    sendTemplate: sendTemplate
  }

}
