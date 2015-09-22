'use strict';

import { Handler } from './handler';
import { Policy } from './policy';

export class Breaker {

  // TODO use the key for identification of metrics etc.
  constructor (target, key, options) {
    // TODO Handle should be created with a new state and policy passed to that
    let proxy = new Proxy(target, new Handler(Policy.create(options)));

    return proxy;
  }

  /**
   * Construct a new breaker around the `target` and metrics observers, registering them against
   * a unique service `key` and a set of `options`
   *
   * @param {Object} target
   * @param {string} key - a unique identification key that will be used for reporting
   * @param {Object} options
   */
  static create (target, key, options) {
    return new Breaker(...arguments);
  }
}
