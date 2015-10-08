'use strict';

import { EventEmitter } from 'events';

export class State extends EventEmitter {
  constructor () {
    super();
    this.reset();
  }

  static create () {
    return new State();
  }

  queue () {
    this.queuq_count++;
  }

  fail () {
    this.failure_count++;
    this.last_failure_time = new Date();
    // this.emit('command:fail', { duration });
  }

  pass () {
    this.success_count++;
    this.last_success_time = new Date();
    // this.emit('command:complete', { duration, value });
  }

  reset () {
    this.failure_count = 0;
    this.slow_response_count = 0;
    this.success_count = 0;
    this.last_failure_time = undefined;
    this.last_success_time = undefined;
    this.queue_count = 0;
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
