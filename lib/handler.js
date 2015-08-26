'use strict';

import debuger from 'debug';
import {Policy} from './policy';
import * as error from './error';

let debug = debuger('breaker/handler');

function timeoutCallback() {
  throw new error.BreakerTimieoutError('Timeout error');
}

export class Handler {

  constructor (policy) {
    this.policy = policy;
  }

  get (target, property, receiver) {
    debug('get: ', property);

    if (this.policy.state(this.state) === Policy.OPEN) {
      throw new error.BreakerOpenError('The breaker is OPEN');
    }

    let isCallable = false;
    let policy = this.policy;
    let state = policy.reset();
    if (typeof target[property] === 'function') {
      isCallable = true;
    }

    return function getTrap() {
      let result;
      let timeoutId = policy.timeout(timeoutCallback);
      try {
        if (isCallable) {
          result = Reflect.apply(target[property], target, arguments);
        } else {
          result = Reflect.get(target, property, receiver) || undefined;
        }
      } catch (e) {
        state = policy.fail(state);

        throw new error.BreakerOpenError(e.message);
      } finally {
        clearTimeout(timeoutId);
        state = policy.reset(state);

        return result;
      }
    };


    //

    //
    // let result;
    //
    //

  }

  apply (target, thisArg, argumentsList) {
    debug('called: ', argumentsList.join(', '));
    Reflect.apply(target, thisArg, argumentsList);
  }
}

function propertyIsInTargetOrReceiver (target, property, receiver) {
  if (!(Reflect.has(target, property))) {
    throw new error.BreakerOpenError(property + ' is not a member of the object you have wrapped by the breaker');
  }
}
