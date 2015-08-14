'use strict';

const OPEN = 'OPEN';
const CLOSED = 'CLOSED';
const HALFOPEN = 'HALFOPEN';

export class Policy {
  constructor (options, state) {
    let opts = options || {};

    this.invocation_timeout = opts.invocation_timeout || 0.01;
    this.failure_threshold = opts.failure_threshold || 5;
    this.reset_timeout = opts.reset_timeout || 30;

    this.reset();
  }

  state () {
    if ((this.failure_count >= this.failure_threshold) && (new Date() - this.last_failure_time) > this.reset_timeout) {
      return HALFOPEN;
    } else if (this.failure_count >= this.failure_threshold) {
      return OPEN;
    } else {
      return CLOSED;
    }
  }

  fail () {
    this.failure_count += 1;
    this.last_failure_time = Date();
  }

  reset () {
    this.failure_count = 0;
    this.last_failure_time = undefined;
  }
}
