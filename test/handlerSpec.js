'use strict';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.should();
chai.use(sinonChai);

import {Reflect} from 'harmony-reflect';

import {Handler} from '../lib/handler';
import {Policy} from '../lib/policy';
import * as error from '../lib/error';
import {Target} from './fixtures/target';
import {CallbackTarget} from './fixtures/callback';
import {PromiseTarget} from './fixtures/promise';
import {Promise} from 'bluebird';

describe('Handler', function () {

  context('Syncronous API', function () {

    let target = new Target();
    let proxied = new Proxy(target, new Handler(Policy.create()));

    it('should wrap the target and leave original methods intact', function () {
      proxied.methodWillSucceed().should.equal(true);
      proxied.methodWillFail().should.equal(false);
    });

    it('should throw an error if attempting to access an undefined member', function () {
      try {
        proxied.nonMember();
      } catch (e) {
        e.should.be.an.instanceOf(error.BreakerOpenError);
      }
    });

    it('should throw a BreakerOpenError if the member throws', function () {
      try {
        proxied.methodWillThrow();
      } catch (e) {
        e.should.be.an.instanceOf(error.BreakerOpenError);
      }
    });

    it('should break the circuit if the original member timesout', function () {
      try {
        proxied.methodWillTimeout();
      } catch (e) {
        e.should.be.an.instanceOf(error.BreakerTimeoutError);
      }
    });

    it('should respect getter methods for properties', function () {
      proxied.propertyWillSucceed.should.equal(true);
    });

  });

  context('Async Callback API', function () {

    let target = new CallbackTarget();
    let callback = sinon.spy();
    let proxied = new Proxy(target, new Handler(Policy.create()));

    beforeEach(function (done) {
      callback.reset();
      done();
    });

    /**
     * This can trigger a V8 bug with 'illegal access' errors being thrown
     * see: https://github.com/strongloop/express/issues/2652
     * Using iojs-v3.0.0 resolves this non user space error.
     */
    it('should wrap the callback target and leave original callback API intact', function () {
      proxied.methodWillSucceed(callback);
      callback.should.have.been.calledWith(null, 'Success');
      proxied.methodWillFail(callback);
      callback.should.have.been.calledWith(new Error('Fail'));
    });

    it('should throw an error if attempting to access an undefined member', function () {
      try {
        proxied.nonMember(callback);
      } catch (e) {
        e.should.be.an.instanceOf(error.BreakerOpenError);
      }
    });

    it('should throw a BreakerOpenError if the member throws', function () {
      try {
        proxied.methodWillThrow(callback);
      } catch (e) {
        e.should.be.an.instanceOf(error.BreakerOpenError);
      }
    });

    it('should break the circuit if the original member timesout', function () {
      proxied.methodWillTimeout(callback);
      callback.should.have.been.calledWith('BreakerTimeoutError');
    });

  });

  describe('Async Promise API', function () {

    let target = new PromiseTarget();
    let proxied = new Proxy(target, new Handler(Policy.create()));

    it('should wrap the promise target and leave original promise API intact', function () {
      proxied.methodWillSucceed().should.equal('Success');
      proxied.methodWillFail().should.equal('Fail');
    });

  });

  describe('Raw Function', function () {

    let target = function (callback) {
      callback();
    };
    let callback = sinon.spy();
    let proxied = new Proxy(target, new Handler(Policy.create()));

    beforeEach(function (done) {
      callback.reset();
      done();
    });

    it('should wrap the callback target and leave original callback API intact', function () {
      proxied(callback);
      callback.should.have.been.calledWith(null, 'Success');
    });

  });

  describe('Raw Promise', function () {
    let target = new Promise(function (resolve, reject) {

    });
    let proxied = new Proxy(target, new Handler(Policy.create()));
  });

});
