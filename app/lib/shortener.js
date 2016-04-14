const request = require('request');
const config = require('config');

module.exports = {

  shorten: (url, callback) => {
    request({
      url: config.url_shortener_url + 'api/urls',
      method: 'POST',
      json: {
        url: url
      }
    }, (err, res, body) => {
      callback(err, body)
    });
  },

  get: (url, callback) => {

  }

}
