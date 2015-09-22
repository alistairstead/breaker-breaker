'use strict';

export class State {
  constructor () {
    this.reset();
  }

  static create () {
    return new State();
  }

  fail () {
    this.failure_count++;
    this.last_failure_time = new Date();
  }

  pass () {
    this.success_count++;
    this.last_success_time = new Date();
  }

  reset () {
    this.failure_count = 0;
    this.slow_response_count = 0;
    this.success_count = 0;
    this.last_failure_time = undefined;
    this.last_success_time = undefined;
  }

  getFailureCount () {
    return this.failure_count;
  }

  getLastFailureTime () {
    return this.last_failure_time;
  }

  getSuccessCount () {
    return this.success_count;
  }
}
