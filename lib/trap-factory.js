'use strict';

import * as error from './error';
import { TrapMap } from './trap-map';
import { Race } from './race';
import { Command } from './command';
import { Timeout } from './timeout';

export class TrapFactory {
  constructor (map) {
    if (!(map instanceof TrapMap)) {
      throw new Error(`Map required, ${map} provided`);
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
   * @param {Function} callable
   * @param {Object} scope
   * @return {Function}
   */
  createCallableTrap (callable, scope, key) {
    key = key || scope.toString() + callable.constructor.toString();
    if (this.map.has(key)) {
      return this.map.get(key);
    }
    let command;
    if (isCallable(callable)) {
      command = function callableTrap () {
        let originalArguments = Object.create(arguments);
        return new Race(new Timeout(), new Command(callable, scope, arguments)).then(
          function callSuccessfulAndWithinCallTime (value) {
            return value;
          },
          function callFailedOrExceededCallTime (err) {
            if (hasCallback([...originalArguments])) {
              return Reflect.apply(getCallback([...originalArguments]), undefined, [new error.BreakerOpenError(err.message)]);
            } else {
              throw new error.BreakerOpenError(err.message);
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
 * @api private
 */
function hasCallback (args) {
  return isCallable(args[args.length - 1]);
}

/**
 * Retrieve the callback method
 *
 * @param {Array} args
 * @return {Function}
 * @api private
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
 * @api private
 */
function isCallable (obj) {
  return typeof obj === 'function';
}
