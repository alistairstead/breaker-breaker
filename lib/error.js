'use strict';

export class BreakerOpen extends Error {
  constructor (message, fileName, lineNumber) {
    super(...arguments);
  }
}
