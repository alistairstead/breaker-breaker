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

import { PromiseTarget } from './fixtures/promise'

describe('Handler', function () {
  /**
   * Async calls using the promise pattern
   */
  context('Async Promise API', function () {
    let target = new PromiseTarget()
    let proxied = new Proxy(target, new Handler(Policy.create()))

    it.skip('should wrap the promise target and leave original promise API intact', function () {
      proxied.methodWillSucceed().should.equal('Success')
      proxied.methodWillFail().should.equal('Fail')
    })

  })

})
