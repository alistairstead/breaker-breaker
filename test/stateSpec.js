/* global describe, it, beforeEach */
'use strict';

import chai from 'chai';
chai.should();

import _ from 'lodash';

import { State } from '../lib/state';

describe('State', function () {
  let state;
  beforeEach(function () {
    state = State.create();
  });

  it('it should be created with a failure_count of 0', function () {
    state.failure_count.should.equal(0);
  });

  it('should increment the failure_count with each call to fail()', function () {
    _.times(5, function () {
      state.fail();
    });
    state.failure_count.should.equal(5);
  });

  it('shuold reset the state properties when reset() is called', function () {
    _.times(11, function () {
      state.fail();
    });
    state.reset();
    state.failure_count.should.equal(0);
  });

  it('should increment the success_count with each call to pass()', function () {
    _.times(9, function () {
      state.pass();
    });
    state.success_count.should.equal(9);
  });
});
