const request = require('request');
const config = require('config');

module.exports = {

  shorten: (url, callback) => {
    console.log('shorten 1 : ', config.url_shortener_url + 'api/urls'))
    request({
      url: config.url_shortener_url + 'api/urls',
      method: 'POST',
      json: {
        url: url
      }
    }, (err, res, body) => {
      console.log('shorten 2 : ', err, body, res.text);
      callback(err, res.text)
    });
  },

  get: (url, callback) => {

  }

}
