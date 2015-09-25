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
    new Race(new Timeout(), new Command(callback.methodWillTimeout, undefined, [(response) => {
      return response;
    }])).then(
      (result) => {
        throw new Error('This call should not resolve');
      },
      (err) => {
        err.should.equal('Command timeout');
        done();
      }
    );
  });

  it('should resolve if the command wins the race', function (done) {
    new Race(new Timeout(5000), new Command(callback.methodWillBlockButNotTimeout, undefined, [(response) => {
      return response;
    }])).then(
      (result) => {
        result.should.equal('Success');
        done();
      },
      (err) => {
        throw new Error(err);
      }
    );
  });
});
