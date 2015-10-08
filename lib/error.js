'use strict';

import ErrorSubclass from 'error-subclass';

export class BreakerError extends ErrorSubclass {
  constructor (message, fileName, lineNumber) {
    super(...arguments);
  }
}

export class BreakerOpenError extends ErrorSubclass {
  constructor (message, fileName, lineNumber) {
    super(...arguments);
  }
}

export class BreakerTimeoutError extends ErrorSubclass {
  constructor (message, fileName, lineNumber) {
    super(...arguments);
  }
}
