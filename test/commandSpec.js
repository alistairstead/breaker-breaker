/* global describe, it */
'use strict';

import chai from 'chai';
chai.should();

import { Command } from '../lib/command';
import { CallbackTarget } from './fixtures/callback';

describe('Command', () => {
  let callback = new CallbackTarget();

  it('should wrap the supplied callable in a promise', () => {
    Command.create(() => { return 'result'; }, undefined, []).then.should.be.a('function');
  });

  it('should resolve with the result of the supplied syncronous call', (done) => {
    Command.create(() => { return 'result'; }, undefined, []).then((result) => {
      result.should.equal('result');
      done();
    });
  });

  it('should respect the callback API for success', (done) => {
    Command.create(callback.methodWillSucceed, undefined, [(err, result) => {
      if (err) {
        throw err;
      }
      result.should.equal('Success');
      done();
    }]);
  });

  it('should respect the callback API for errors', (done) => {
    Command.create(callback.methodWillFail, undefined, [(err, result) => {
      err.message.should.equal('Method failed');
      done();
    }]);
  });

  it('should allow the use of the promise API for a callback success', (done) => {
    Command.create(callback.methodWillSucceed, undefined, [() => {}]).then((result) => {
      result.should.equal('Success');
      done();
    });
  });

  it('should simply return an exiting promise untouched', () => {
    Command.create(new Promise((resolve, reject) => { resolve('Success'); })).then.should.be.a('function');
  });
});
