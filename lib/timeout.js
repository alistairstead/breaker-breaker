'use strict';

export class Timeout {
  /**
   * Construct a delayed promise for n `milliseconds`. The promise
   * will reject after the appropriate delay.
   *
   * @param {Number} milliseconds - milliseconds wait time
   * @return {Promise}
   * @api private
   */
  constructor (milliseconds = 1000) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject(...arguments);
      }, milliseconds, 'Command timeout');
    });
  }
}
