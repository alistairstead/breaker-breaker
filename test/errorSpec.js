/* global describe, it, beforeEach */
'use strict'
import chai from 'chai'

import * as error from '../lib/error'

const should = chai.should()

describe('Error', function () {
  describe('BreakerOpenError', function () {
    it('should be an instance of BreakerOpenError', function () {
      try {
        throwBreakerOpenError()
      } catch (e) {
        e.should.be.an.instanceOf(error.BreakerOpenError)
      }
    })
  })

  describe('BreakerTimeoutError', function () {
    it('should be an instance of BreakerTimeoutError', function () {
      try {
        throwBreakerTimeoutError()
      } catch (e) {
        e.should.be.an.instanceOf(error.BreakerTimeoutError)
      }
    })
  })
})

function throwBreakerOpenError () {
  throw new error.BreakerOpenError('Test error')
}

function throwBreakerTimeoutError () {
  throw new error.BreakerTimeoutError('Test timeout error')
}
