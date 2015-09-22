'use strict';
import express from 'express';

let app = express();

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

export default {app: app};
