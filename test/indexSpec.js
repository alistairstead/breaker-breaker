/* global describe, it */

'use strict'
import chai from 'chai'

chai.should()

import { Reflect } from 'harmony-reflect'

import { Breaker } from '../lib'
import * as error from '../lib/error'
import { SyncronousTarget } from './fixtures/syncronous'

describe('Breaker', function () {
  let breaker = Breaker.create(new SyncronousTarget(), {})

  it('should wrap the target and leave original methods intact', function () {
    breaker.methodWillSucceed().should.equal(true)
    breaker.methodWillFail().should.equal(false)
  })

  it('should break the circuit if the original method times out', function () {
    try {
      breaker.methodWillTimeout()
    } catch (e) {
      e.should.be.an.instanceOf(error.BreakerOpenError)
    }
  })

  it.skip('should break the circuit and call the callback with an Error if the async call times out', function () {})

  it.skip('should break the circuit and call reject in a promise if the promise times out', function () {})

})
