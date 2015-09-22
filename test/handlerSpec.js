/* global describe, it, beforeEach */
'use strict';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.should();
chai.use(sinonChai);

import { Reflect } from 'harmony-reflect';

import { Handler } from '../lib/handler';
import { Policy } from '../lib/policy';

import { Promise } from 'bluebird';

// TODO reduce test complexity by injecting a spy and only testing interaction not results
describe('Handler', function () {
  /**
   * Wrap a function directly e.g. a middleware method
   */
  context.skip('Raw Function', function () {
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

  context.skip('Raw Promise', function () {
    let target = new Promise(function (resolve, reject) {});
    let proxied = new Proxy(target, new Handler(Policy.create()));
  });

  context.skip('Middleware', function () {});

});
