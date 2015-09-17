/* global describe, it */
'use strict';

import chai from 'chai';
chai.should();

import { Race } from '../lib/race';
import { Timeout } from '../lib/timeout';
import { Command } from '../lib/command';
import { CallbackTarget } from './fixtures/callback';

describe('Race', function () {
  let callback = new CallbackTarget();

  it('should reject if the timout wins the race', function (done) {
    new Race(new Timeout(), new Command(callback.methodWillTimeout, undefined, [function callback (response) {
      return response;
    }])).then(
      function resolve (result) {
        throw new Error('This call should not resolve');
      },
      function reject (err) {
        err.should.equal('Command timeout');
        done();
      }
    );
  });

  it('should resolve if the command wins the race', function (done) {
    new Race(new Timeout(5000), new Command(callback.methodWillBlockButNotTimeout, undefined, [function callback (response) {
      return response;
    }])).then(
      function resolve (result) {
        result.should.equal('Success');
        done();
      },
      function reject (err) {
        throw new Error(err);
      }
    );
  });
});
