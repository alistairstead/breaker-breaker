'use strict';

import { Handler } from './handler';
import { Policy } from './policy';
import { State } from './state';

import { Reflect } from 'harmony-reflect'; // eslint-disable-line

export class Breaker {
  constructor (target, key, options) {
    let proxy = new Proxy(target, new Handler(Policy.create(options), key, new State()));

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
