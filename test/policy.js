'use strict';
import chai from 'chai';
import {Policy} from '../lib/policy';

const should = chai.should();

describe('Policy', function () {

  let policy = new Policy();

  it('should be a derived from Proxy', function () {
    policy.should.be.an('Object');
  });

  it('should be created with a failure count', function () {
    policy.failure_count.should.equal(0);
  });

  it('should have a default invocation timeout', function () {
    policy.invocation_timeout.should.equal(0.01);
  });

  it('should have a default failure threshold', function () {
    policy.failure_threshold.should.equal(5);
  });

  it('should have a default reset timeout', function () {
    policy.reset_timeout.should.equal(30);
  });

  it('should have a method reset', function () {
    policy.reset.should.be.a('function');
  });

  it('should have a method state', function () {
    policy.state.should.be.a('function');
  });

  it('should be created closed', function () {
    policy.state().should.equal('CLOSED');
  });

  it('should have a method fail', function () {
    policy.fail.should.be.a('function');
  });

  it('should be open if it has failed greater than or equal to the failure threshold', function () {
    policy.fail();
    policy.fail();
    policy.fail();
    policy.fail();
    policy.fail();
    policy.state().should.equal('OPEN');
  });

});
