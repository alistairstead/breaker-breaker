'use strict';

import * as error from './error';
import { TrapFactory } from './trap-factory';
import { TrapMap } from './trap-map';

let factory = TrapFactory.create(TrapMap.create());
let passthroughMethods = ['state', 'on'];

export class Handler {

  constructor (policy) {
    this.policy = policy;
  }

  get (target, property, receiver) {
    if (passthroughMethods.indexOf(property) !== -1) {
      // TODO can we call against the receiver without it being recursive?
      return Reflect.get(target, property);
    }
    if (!(isPropertyMemberOfTargetOrReceiver(target, property, this))) {
      throw new error.BreakerOpenError(`${property} is not a member of the Object you have wrapped with the breaker`);
    }
    if (isCallable(target[property])) {
      return factory.createCallableTrap(target[property], target);
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
 * Chack if the `property` is a member of the `target` or `receiver`
 *
 * @param {Object} target
 * @param {String} property
 * @param {Object} receiver
 * @return {Boolean}
 * @api private
 */
function isPropertyMemberOfTargetOrReceiver (target, property, receiver) {
  return (Reflect.has(target, property)) ? true : Reflect.has(receiver, property);
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
