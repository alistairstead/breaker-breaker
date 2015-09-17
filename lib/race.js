'use strict';

export class Race {
  /**
   * Construct a promise that will race the two supplied promises. Whichever of the
   * two complete first the result will be passed to the continuation routine.
   *
   * @param {Promise} timeout
   * @param {Promise} command
   * @return {Promise}
   */
  constructor (timeout, command) {
    if (!(timeout instanceof Promise)) {
      throw new Error(`Timeout expected, ${timeout} given`);
    }
    if (!(command instanceof Promise)) {
      throw new Error(`Command expected, ${command} given`);
    }

    return Promise.race([timeout, command]);
  }
}
