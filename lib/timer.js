'use strict';

import { State } from './state';

export class Timer {
  constructor (promise, state) {
    if (!(promise instanceof Promise)) {
      throw new Error(`Race expected, ${promise} given`);
    }
    if (!(state instanceof State)) {
      throw new Error(`State expected, ${state} given`);
    }
    let start = new Date();
    state.queue();
    return promise.then(
      (value) => {
        let duration = new Date() - start;
        state.pass(value, duration);
      },
      (err) => {
        let duration = new Date() - start;
        state.fail(err, duration);
      }
    );
  }
}
