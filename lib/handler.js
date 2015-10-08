'use strict';

import { BreakerError } from './error';
import { TrapFactory } from './trap-factory';
import { TrapMap } from './trap-map';
import { Policy } from './policy';
import { State } from './state';

let factory = TrapFactory.create(TrapMap.create());
let passthroughMethods = ['state'];
let unsupportedMethods = ['on'];

export class Handler {

  constructor (policy, key, state) {
    if (!(policy instanceof Policy)) {
      throw new BreakerError(`Policy expected, ${policy} given`);
    }
    if (!key) {
      throw new BreakerError(`Unique key required, ${key} given`);
    }
    if (!(state instanceof State)) {
      throw new BreakerError(`State expected, ${state} given`);
    }
    this.policy = policy;
    this.key = key;
    this.state = state;
  }

  get (target, property, receiver) {
    if (passthroughMethods.indexOf(property) !== -1) {
      return Reflect.get(this, property);
    }
    if (unsupportedMethods.indexOf(property) !== -1) {
      throw new BreakerError(`${property} is not currently supported by the breaker`);
    }
    if (!(isPropertyMemberOfTarget(target, property))) {
      throw new BreakerError(`${property} is not a member of the Object you have wrapped with the breaker`);
    }
    if (isCallable(target[property])) {
      return factory.createCallableTrap(target[property], target, this.key, this.state);
    } else {
      // TODO wrap property access with a trap to protect against misuse of getters
      return Reflect.get(target, property);
    }
  }

  apply (target, thisArg, argumentsList) {
    // TODO replace the direct call to apply with the appropriate command
    Reflect.apply(target, thisArg, argumentsList);
  }
}

/**
 * Chack if the `property` is a member of the `target`
 *
 * @param {Object} target
 * @param {String} property
 * @return {Boolean}
 * @api private
 */
function isPropertyMemberOfTarget (target, property) {
  return Reflect.has(target, property);
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
