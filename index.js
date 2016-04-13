const express = require('express')
const app = express()

const TOKEN = 'hello_super_verify_token'

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/webhook', (req, res) => {
  res.json('Hello Webhook', req.query);
  if (req.query['hub.verify_token'] === TOKEN) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})

app.listen(8080)
