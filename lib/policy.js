'use strict'

const OPEN = 'OPEN'
const CLOSED = 'CLOSED'
const HALFOPEN = 'HALFOPEN'

// TODO want a passthrough state to disabel the functionality
const FORCEDOPEN = 'FORCEDOPEN'
const FORCEDCLOSED = 'FORCEDCLOSED'

const default_invocation_timeout = 1000
const default_failure_threshold = 5
const default_reset_timeout = 30

export class Policy {

  constructor (options, state) {
    let opts = options || {}

    this.invocation_timeout = opts.invocation_timeout || default_invocation_timeout
    this.failure_threshold = opts.failure_threshold || default_failure_threshold
    this.reset_timeout = opts.reset_timeout || default_reset_timeout
  }

  static create (options) {
    let policy = new Policy(options)
    Object.freeze(policy)

    return policy
  }

  state (state = {}) {
    if ((state.failure_count >= this.failure_threshold) && (new Date() - state.last_failure_time) > this.reset_timeout) {
      return HALFOPEN
    } else if (state.failure_count >= this.failure_threshold) {
      return OPEN
    } else {
      return CLOSED
    }
  }

  fail (state = {}) {
    return {
      failure_count: state.failure_count + 1,
      last_failure_time: new Date()
    }
  }

  reset (state = {}) {
    return {
      failure_count: 0,
      last_failure_time: undefined
    }
  }

  timeout (scope, callback) {
    return setTimeout.call(scope, callback, this.invocation_timeout)
  }
}
