const app = require('../index');
const expect = require('chai').expect;
const request = require('supertest');
const config = require('config')

describe('webhook.routes.test.js', () => {

  describe('GET /webhook', () => {

    it('successfully verify application', (done) => {
      request(app)
        .get('/webhook')
        .query({
          'hub.verify_token': config.facebook_verif_token
        })
        .expect(200)
        .end(done);
    });

    it('fails verifying application with a bad token', (done) => {
      request(app)
        .get('/webhook')
        .query({
          'hub.verify_token': 'bad'
        })
        .expect(401)
        .end(done);
    });

  });

  describe('POST /webhook', () => {

    it('successfully post a message', (done) => {
      request(app)
        .post('/webhook')
        .send(require('./mocks/message.json'))
        .expect(200)
        .end(done);
    });

  });

});
