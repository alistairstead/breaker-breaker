'use strict';
import chai from 'chai';

import {Reflect} from 'harmony-reflect';

import {Breaker} from '../lib';
import * as error from '../lib/error';
import {Target} from './fixtures/target';

const should = chai.should();

describe('Breaker', function () {

  let breaker = Breaker.create(new Target(), {});

  it('should wrap the target and leave original methods intact', function () {
    breaker.success().should.equal(true);
    breaker.fail().should.equal(false);
  });

  it('should break the circuit if the original method times out', function () {
    try {
      breaker.timeout();
    } catch (e) {
      e.should.be.an.instanceOf(error.BreakerOpenError);
    }
  });

  it('should break the circuit and call fail in a promise if the promise times out', function () {

  });

});
