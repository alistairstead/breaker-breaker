'use strict';

import { BreakerError, BreakerOpenError } from './error';
import { TrapMap } from './trap-map';
import { Timer } from './timer';
import { Race } from './race';
import { Command } from './command';
import { Timeout } from './timeout';

import { Reflect } from 'harmony-reflect';

export class TrapFactory {
  constructor (map) {
    if (!(map instanceof TrapMap)) {
      throw new BreakerError(`Map required, ${map} provided`);
    }
    this.map = map;
  }
  static create (map) {
    return new TrapFactory(map);
  }

  /**
   * Construct a trap that will execute when it intercepts calls through
   * the proxy handler to the `callable` within a given `scope`
   *
   * @param {Object} callable
   * @param {Object} scope
   * @param {String} key
   * @param {State} state
   * @return {Function}
   */
  createCallableTrap (callable, scope, key, state) {
    if (this.map.has(key)) {
      // FIXME this is not a unique hash for objects with multiple methods
      // return this.map.get(key);
    }
    let command;
    if (isCallable(callable)) {
      command = function callableTrap () {
        let originalArguments = [...arguments];

        return new Timer(new Race(
            new Timeout(),
            new Command(callable, scope, originalArguments)
          ), state)
          .then(
          (value) => {
            return value;
          },
          (err) => {
            if (hasCallback(originalArguments)) {
              return Reflect.apply(getCallback(originalArguments), undefined, [new BreakerOpenError(err.message)]);
            } else {
              throw new BreakerOpenError(err.message);
            }
          }
        );
      };
    } else {
      // TODO wrap property access with a trap to protect against use of getters
      // return Reflect.get(target, property)
    }

    this.map.set(key, command);
    return command;
  }
}

/**
 * Is the final property of argument callable
 *
 * @param {Array} args
 * @return {Boolean}
 */
function hasCallback (args) {
  return isCallable(args[args.length - 1]);
}

/**
 * Retrieve the callback method
 *
 * @param {Array} args
 * @return {Function}
 */
function getCallback (args) {
  let callbackIndex = args.length - 1;
  return (isCallable(args[callbackIndex])) ? args[callbackIndex] : undefined;
}

/**
 * Check if `obj` is callable.
 *
 * @param {Object} obj
 * @return {Boolean}
 */
function isCallable (obj) {
  return typeof obj === 'function';
}
