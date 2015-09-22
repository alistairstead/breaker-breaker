/* global describe, it, beforeEach */
'use strict';

import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.should();
chai.use(sinonChai);

import { State } from '../lib/state';
import { Policy } from '../lib/policy';

describe('Policy', () => {
  let policy, state;

  beforeEach(() => {
    policy = Policy.create();
    state = new State();
  });

  it('should have a default invocation timeout', () => {
    policy.invocation_timeout.should.equal(1000);
  });

  it('should have a default failure threshold', () => {
    policy.failure_threshold.should.equal(5);
  });

  it('should have a default reset timeout', () => {
    policy.reset_timeout.should.equal(1000);
  });

  it.skip('should have a set of static constants that can be references', () => {
    Policy.OPEN.should.equal('OPEN');
  });

  it('should have a method status', () => {
    policy.status.should.be.a('function');
  });

  it('should throw an error if an instance of State is not supplied to satus', () => {
    try {
      policy.status();
    } catch (e) {
      e.message.should.include('Expected instance of State');
    }
  });

  it('should be CLOSED when the failure count does not equal or exceed the failure threshold', () => {
    policy.status(state).should.equal('CLOSED');
  });

  it('should be OPEN when the failure count is equal or exceeds the failure threshold', () => {
    let stubGetFailureCount = sinon.stub(state, 'getFailureCount');
    stubGetFailureCount.returns(100);
    policy.status(state).should.equal('OPEN');
  });

  it('should be HALFOPEN if is is OPEN but the reset_timout has expired', () => {
    let stubGetLastFailureTime = sinon.stub(state, 'getLastFailureTime');
    stubGetLastFailureTime.returns(new Date() - 1500);
    let stubGetFailureCount = sinon.stub(state, 'getFailureCount');
    stubGetFailureCount.returns(100);
    policy.status(state).should.equal('HALFOPEN');
  });

  it('should be still OPEN if the reset_timeout has not expired', () => {
    let stubGetLastFailureTime = sinon.stub(state, 'getLastFailureTime');
    stubGetLastFailureTime.returns(new Date());
    let stubGetFailureCount = sinon.stub(state, 'getFailureCount');
    stubGetFailureCount.returns(100);
    policy.status(state).should.equal('OPEN');
  });
});
