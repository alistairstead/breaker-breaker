'use strict';

import { State } from './state';

const OPEN = 'OPEN';
const CLOSED = 'CLOSED';
const HALFOPEN = 'HALFOPEN';

// #TODO:0 want a passthrough state to disabel the functionality
// const FORCEDOPEN = 'FORCEDOPEN'
// const FORCEDCLOSED = 'FORCEDCLOSED'

const default_invocation_timeout = 1000;
const default_failure_threshold = 5;
const default_reset_timeout = 1000;

export class Policy {

  /**
   * Construct a Policy that represents the buisiness rules as configured for the Breaker
   * and the State with which it collaborates.
   *
   * @param {Object} options
   * @return {Policy}
   */
  constructor (options) {
    let opts = options || {};

    this.invocation_timeout = opts.invocation_timeout || default_invocation_timeout;
    this.failure_threshold = opts.failure_threshold || default_failure_threshold;
    this.reset_timeout = opts.reset_timeout || default_reset_timeout;
  }

  /**
   * Static builder method / named constructor
   */
  static create (options) {
    let policy = new Policy(...arguments);
    Object.freeze(policy);

    return policy;
  }

  /**
   * Return the current status of the breaker based on the state object
   *
   * @return {String}
   */
  status (state) {
    if (!(state instanceof State)) {
      throw new Error(`Expected instance of State, ${state} provides.`);
    }
    if ((state.getFailureCount() >= this.failure_threshold) && (new Date() - state.getLastFailureTime()) > this.reset_timeout) {
      return HALFOPEN;
    } else if (state.getFailureCount() >= this.failure_threshold) {
      return OPEN;
    } else {
      return CLOSED;
    }
  }
}
