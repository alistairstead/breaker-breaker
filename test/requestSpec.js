/* global describe, it, before, after, beforeEach */
'use strict';
import chai from 'chai';
chai.should();

import request from 'request';
import { app } from '../example/server';

import { Breaker } from '../lib';

describe('request', function () {
  let server, breaker;

  before(function () {
    server = app.listen(3000);
  });

  beforeEach(function () {
    breaker = Breaker.create(request, 'test:request');
  });

  after(function () {
    server.close();
  });

  it('should wrap request and leave the callback API intact', function (done) {
    breaker.get('http://127.0.0.1:3000/will/succeed', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        body.should.equal('Success');
        done();
      }
    });
  });

  it('should wrap request and record failures for error response', function (done) {
    breaker.get('http://127.0.0.1:3000/will/fail', function (error, response, body) {
      if (!error && response.statusCode === 500) {
        body.should.equal('Failure');
        breaker.state.failure_count.should.equal(1);
        done();
      }
    });
  });

  it.skip('should wrap request and leave the event API intact', function (done) {
    breaker.get('http://127.0.0.1:3000/will/succeed')
    .on('response', function (response) {
      response.statusCode.should.equal(200);
    });
  });
});
