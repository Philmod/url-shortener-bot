'use strict';
const validUrl = require('valid-url');
const url = require('url');
const request = require('request');
const config = require('config');
const shortener = require('./shortener');

/**
 * Get url from text.
 */
const getUrl = text => {
  let elements = text.split(' ');
  let url;
  elements.forEach(elt => {
    url = validUrl.isUri(elt) ? elt : null;
  });
  return url;
}

/**
 * Handle incoming message.
 */
const handle = event => {
  let sender = event.sender.id;

  if (event.message && event.message.text) {
    let text = event.message.text;
    let url = getUrl(text);
    if (url) {
      if (url.indexOf(config.url_shortener_url) > -1) {
        sendAskMoreInfo(sender, url);
      } else {
        shortener.shorten(url, (err, shortenedUrl) => {
          if (err) {
            send(sender, "I am sorry, an error happened while shortening your url: " + err);
          } else {
            send(sender, "Here it is, short and sweet: " + shortenedUrl);
          }
        });
      }
    } else {
      send(sender, "Hey! Post here an url so I can help you.");
    }
  }
  else if (event.postback) {
    handlePostback(sender, event.postback);
  }
}

/**
 * Send message to ask if user wants more information.
 */
const sendAskMoreInfo = (sender, url) => {
  sendTemplate(sender, [{
    title: "Oh, this is an existing shortened url!",
    subtitle: "Do you want to get some stats about it?",
    buttons: [{
      type: "postback",
      title: "Yes",
      payload: url
    }, {
      type: "postback",
      title: "No",
      payload: "No"
    }],
  }]);
}

/**
 * Handle postback.
 */
const handlePostback = (sender, postback) => {
  let payload = postback.payload;
  if (payload == 'No') {
    send(sender, "Alright, no worries.");
  } else {
    let url = payload;
    shortener.get(url, (err, info) => {
      if (err) {
        send(sender, "I am sorry, an error happened while getting information about your url: " + err);
      } else {
        send(sender, "The full url is : " + info.fullUrl + ", and it had " + info.viewCount + " views so far.");
      }
    });
  }
}

/**
 * Send a message.
 */
const send = (sender, data) => {
  const message = (typeof data === 'string') ? {text: data} : data;
  request({
    url: config.facebook_url,
    qs: {access_token:config.facebook_page_token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: message
    }
  }, (error, response, body) => {
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
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: elements
      }
    }
  };
  send(sender, messageData);
}

module.exports = {

  handle: handle,
  send: send,
  sendTemplate: sendTemplate

}
