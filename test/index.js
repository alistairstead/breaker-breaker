'use strict';
import chai from 'chai';
import {Breaker} from '../lib';

const should = chai.should();

describe('Breaker', function () {

  let target = {
    success () {
      return true;
    },
    fail () {
      return false;
    },
    timeout () {
      
    }
  };

  let breaker = Breaker.create(target, {});

  it('should wrap the target and leave original methods intact', function () {
    breaker.success().should.equal(true);
    breaker.fail().should.equal(false);
  });

  it('should break the circuit if the original methos timeout', function () {

  });

});
