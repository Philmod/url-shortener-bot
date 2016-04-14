'use strict';
const request = require('request');
const config = require('config');
const Url = require('url');

module.exports = {

  /**
   * Shorten an url.
   */
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

  /**
   * Get info about a shortened url.
   */
  get: (url, callback) => {
    let id = Url.parse(url).path.replace('/','');
    request({
      url: config.url_shortener_url + 'api/urls/' + id,
    }, (err, res, body) => {
      console.log('hello results : ', typeof body, body);
      callback(err, body);
    });
  }

}
