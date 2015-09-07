/* global describe, it, beforeEach */
'use strict'

import chai from 'chai'
chai.should()
import _ from 'lodash'

import { Reflect } from 'harmony-reflect'

import { Policy } from '../lib/policy'

describe('Policy', function () {
  let policy = Policy.create()

  let closedState = {
    failure_count: 0,
    last_failure_time: undefined,
  }

  it('should have a default invocation timeout', function () {
    policy.invocation_timeout.should.equal(1000)
  })

  it('should have a default failure threshold', function () {
    policy.failure_threshold.should.equal(5)
  })

  it('should have a default reset timeout', function () {
    policy.reset_timeout.should.equal(30)
  })

  it.skip('should have a set of static constants that can be references', function () {
    Policy.OPEN.should.equal('OPEN')
  })

  it('should have a method reset', function () {
    policy.reset.should.be.a('function')
  })

  it('should have a method state', function () {
    policy.state.should.be.a('function')
  })

  it('should be closed when the failure count does not equal or exceed the failure threshold', function () {
    policy.state(closedState).should.equal('CLOSED')
  })

  it('should have a method fail', function () {
    policy.fail.should.be.a('function')
  })

  it('should be open if the failure count equals the failure threshold', function () {
    let state = Object.create(closedState)
    _.times(5, function () {
      state = policy.fail(state)
    })
    state.failure_count.should.equal(5)
    policy.state(state).should.equal('OPEN')
  })

  it('should have a method timeout', function () {
    policy.timeout.should.be.a('function')
  })

})
