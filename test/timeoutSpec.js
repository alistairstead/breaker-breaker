/* global describe, it */
'use strict';

import chai from 'chai';
chai.should();

import { Timeout } from '../lib/timeout';

describe('Timeout', function () {
  it('should return a delaying promise that rejects after the given time', function (done) {
    let start = new Date();
    new Timeout().catch(function (reason) {
      let duration = new Date() - start;
      duration.should.be.greaterThan(900);
      reason.should.equal('Command timeout');
      done();
    });
  });
});
