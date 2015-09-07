/* global describe, it, beforeEach, context */
'use strict'

import chai from 'chai'

chai.should()

import { Reflect } from 'harmony-reflect'

import { Handler } from '../lib/handler'
import { Policy } from '../lib/policy'
import * as error from '../lib/error'

import { SyncronousTarget } from './fixtures/syncronous'

describe('Handler', function () {
  /**
   * Syncronous calls on an Object
   */
  context('Syncronous API', function () {
    let target = new SyncronousTarget()
    let proxied = new Proxy(target, new Handler(Policy.create()))

    it('should wrap the target and leave original methods intact', function () {
      proxied.methodWillSucceed().should.equal(true)
      proxied.methodWillFail().should.equal(false)
    })

    it('should throw a BreakerOpenError if the member throws', function () {
      try {
        proxied.methodWillThrow()
      } catch (e) {
        e.should.be.an.instanceOf(error.BreakerOpenError)
      }
    })

    it('should break the circuit if the original member exceeds the default time out', function () {
      try {
        proxied.methodWillTimeout()
      } catch (e) {
        e.should.be.an.instanceOf(error.BreakerTimeoutError)
      }
    })

    it('should not break the circuit if the original member does not exceed the default time out', function () {
      proxied.methodWillBlockButNotTimeout()
    })

    it('should respect getter methods for properties', function () {
      proxied.propertyWillSucceed.should.equal(true)
    })

    it('should throw a helpful error if a call is made to a non member', function () {
      try {
        proxied.nonMember()
      } catch (e) {
        e.should.be.an.instanceOf(error.BreakerOpenError)
        e.message.should.equal('nonMember is not a member of the Object you have wrapped with the breaker')
      }
    })
  })
})
