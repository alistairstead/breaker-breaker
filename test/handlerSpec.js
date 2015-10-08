/* global describe, it, beforeEach, context */
'use strict';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.should();
chai.use(sinonChai);

// Reflect shims the harmony Proxy implementation to the ES6 API
import { Reflect } from 'harmony-reflect'; // eslint-disable-line

import { Handler } from '../lib/handler';
import { Policy } from '../lib/policy';
import { State } from '../lib/state';

// TODO reduce test complexity by injecting a spy and only testing interaction not results
describe('Handler', () => {
  /**
   * Wrap a function directly e.g. a middleware method
   */
  context.skip('Raw Function', () => {
    let target = function (callback) {
      callback();
    };
    let callback = sinon.spy();
    let proxied = new Proxy(target, new Handler(Policy.create(), 'test', new State()));

    beforeEach(function (done) {
      callback.reset();
      done();
    });

    it('should wrap the callback target and leave original callback API intact', function () {
      proxied(callback);
      callback.should.have.been.calledWith(null, 'Success');
    });
  });

  context.skip('Raw Promise', () => {});
  context.skip('Middleware', () => {});
});
