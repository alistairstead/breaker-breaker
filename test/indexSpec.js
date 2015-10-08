/* global describe, context, it, beforeEach */

'use strict';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.should();
chai.use(sinonChai);

import { Breaker } from '../lib';
import * as error from '../lib/error';
import { SyncronousTarget } from './fixtures/syncronous';
import { CallbackTarget } from './fixtures/callback';
import { PromiseTarget } from './fixtures/promise';

describe('Breaker', () => {
  /**
   * Syncronous calls on an Object
   */
  context('Syncronous API', () => {
    let target = new SyncronousTarget();
    let proxied = Breaker.create(target, 'syncronous');

    it('should wrap the target and leave original methods intact', () => {
      proxied.methodWillSucceed().then((value) => {
        value.should.equal(true);
      });
    // proxied.methodWillFail().should.equal(false)
    });

    it('should throw a BreakerOpenError if the member throws', () => {
      try {
        proxied.methodWillThrow();
      } catch (e) {
        e.should.be.an.instanceOf(error.BreakerOpenError);
      }
    });

    it('should fail fast if the original member exceeds the default time out', () => {
      try {
        proxied.methodWillTimeout();
      } catch (e) {
        e.should.be.an.instanceOf(error.BreakerTimeoutError);
      }
    });

    it('should not fail fast if the original member does not exceed the default time out', () => {
      proxied.methodWillBlockButNotTimeout();
    });

    it('should respect getter methods for properties', () => {
      proxied.propertyWillSucceed.should.equal(true);
    });

    it.skip('should throw a helpful error if a call is made to a non member', () => {
      try {
        proxied.nonMember();
      } catch (e) {
        e.should.be.an.instanceOf(error.BreakerOpenError);
        e.message.should.equal('nonMember is not a member of the Object you have wrapped with the breaker');
      }
    });
  });

  /**
   * Async calls using the callback pattern
   */
  context('Async Callback API', () => {
    let target = new CallbackTarget();
    let spy = sinon.spy();
    let proxied = Breaker.create(target, 'callback');

    beforeEach((done) => {
      spy.reset();
      done();
    });

    it('should wrap the callback target and leave original callback API intact', (done) => {
      proxied.methodWillSucceed((err, response) => {
        if (err) {
          console.log(err);
        }
        response.should.equal('Success');
        done();
      });
    });

    it.skip('should wrap the callback target but also leave the original return API intact for fluent interfaces', (done) => {
      proxied.methodWillSucceed((err, response) => {
        if (err) {
          console.log(err);
        }
        response.should.equal('Success');
        done();
      }).toString().should.equal('CallbackTarget');
    });

    it('should return an error as the first argument to the callback on failure', (done) => {
      try {
        proxied.methodWillFail((err) => {
          err.should.be.eql(new Error('Method failed'));
          done();
        });
      } catch (e) {
        console.log(e);
      }
    });

    it.skip('should throw a BreakerOpenError if the member throws', (done) => {
      try {
        proxied.methodWillThrow(spy);
      } catch (e) {
        e.should.be.an.instanceOf(error.BreakerOpenError);
        done();
      }
    });

    it('should fail early if the original member exceeds the default time out', (done) => {
      proxied.methodWillTimeout(() => {
        spy(...arguments);
        spy.should.have.been.calledWith(new error.BreakerTimeoutError('Timeout error'));
        done();
      });
    });

    it('should not fail early if the original member does not exceed the default time out', (done) => {
      proxied.methodWillBlockButNotTimeout((err, response) => {
        spy(err, response);
        spy.should.have.been.calledWith(null, 'Success');
        done();
      });
    });
  });

  /**
   * Async calls using the promise pattern
   */
  context('Async Promise API', () => {
    let target = new PromiseTarget();
    let proxied = Breaker.create(target, 'promise:api');

    it.skip('should wrap the promise target and leave original promise API intact', () => {
      proxied.methodWillSucceed().should.equal('Success');
      proxied.methodWillFail().should.equal('Fail');
    });
  });
});
