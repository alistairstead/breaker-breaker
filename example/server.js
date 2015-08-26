'use strict';

var express = require('express');
var app = express();

app.use('/', express.static(__dirname));

app.get('/will/succeed', function (req, res) {
  res.end('Success');
});

app.get('/will/fail', function (req, res) {
  res.status(500);
  res.end('Failure');
});

app.get('/will/timeout', function (req, res) {
  setTimeout(function () {
    res.end('Timed out');
  }, 5000);
});

app.get('/is/unreliable', function (req, res) {
  if (Math.random() > 0.5) {
    res.status(500);
  }
  res.end('Unreliable');
});

app.listen(3000);
