/* global describe, it */
'use strict';

import chai from 'chai';
chai.should();

import { Command } from '../lib/command';
import { CallbackTarget } from './fixtures/callback';

describe('Command', function () {
  let callback = new CallbackTarget();

  it('should wrap the supplied callable in a promise', function () {
    Command.create(function () { return 'result'; }, undefined, []).then.should.be.a('function');
  });

  it('should resolve with the result of the supplied syncronous call', function (done) {
    Command.create(function () { return 'result'; }, undefined, []).then(function (result) {
      result.should.equal('result');
      done();
    });
  });

  it('should respect the callback API for success', function (done) {
    Command.create(callback.methodWillSucceed, undefined, [function (err, result) {
      if (err) {
        throw err;
      }
      result.should.equal('Success');
      done();
    }]);
  });

  it('should respect the callback API for errors', function (done) {
    Command.create(callback.methodWillFail, undefined, [function (err, result) {
      err.message.should.equal('Method failed');
      done();
    }]);
  });

  it('should allow the use of the promise API for a callback success', function (done) {
    Command.create(callback.methodWillSucceed, undefined, [function () {}]).then(function (result) {
      result.should.equal('Success');
      done();
    });
  });

  it('should simply return an exiting promise untouched', function () {
    Command.create(new Promise(function (resolve, reject) {resolve('Success');})).then.should.be.a('function');
  });
});
