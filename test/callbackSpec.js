/* global describe, it, beforeEach, context */

'use strict'

import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

chai.should()
chai.use(sinonChai)

import { Reflect } from 'harmony-reflect'

import { Handler } from '../lib/handler'
import { Policy } from '../lib/policy'
import * as error from '../lib/error'

import { CallbackTarget } from './fixtures/callback'

describe('Handler', function () {
  /**
   * Async calls using the callback pattern
   */
  context('Async Callback API', function () {
    let target = new CallbackTarget()
    let spy = sinon.spy()
    let proxied = new Proxy(target, new Handler(Policy.create()))

    beforeEach(function (done) {
      spy.reset()
      done()
    })

    /**
     * This can trigger a V8 bug with 'illegal access' errors being thrown
     * see: https://github.com/strongloop/express/issues/2652
     * Using iojs-v3.0.0 resolves this non user space error.
     */
    it('should wrap the callback target and leave original callback API intact', function (done) {
      proxied.methodWillSucceed(function () {
        arguments[1].should.equal('Success')
        done()
      })
    })

    it.skip('should wrap the callback target but also leave the original return API intact for fluent interfaces', function (done) {
      proxied.methodWillSucceed(function () {
        arguments[1].should.equal('Success')
        done()
      }).toString().should.equal('CallbackTarget')
    })

    it('should return an error as the first argument to the callback on failure', function (done) {
      proxied.methodWillFail(function () {
        arguments[0].should.be.eql(new Error('Fail'))
        done()
      })
    })

    it('should throw a BreakerOpenError if the member throws', function (done) {
      try {
        proxied.methodWillThrow(spy)
      } catch (e) {
        e.should.be.an.instanceOf(error.BreakerOpenError)
        done()
      }
    })

    it('should break the circuit if the original member exceeds the default time out', function (done) {
      proxied.methodWillTimeout(function delayedCallback () {
        spy(...arguments)
        spy.should.have.been.calledWith(new error.BreakerTimeoutError('Timeout error'))
        done()
      })
    })

    it('should not break the circuit if the original member does not exceed the default time out', function (done) {
      proxied.methodWillBlockButNotTimeout(function delayedCallback () {
        spy(...arguments)
        spy.should.have.been.calledWith(null, 'Success')
        done()
      })
    })
  })
})
