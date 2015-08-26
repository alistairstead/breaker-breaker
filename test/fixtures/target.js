'use strict';

export class Target {

  methodWillSucceed () {
    return true;
  }

  methodWillFail () {
    return false;
  }

  mothodWillThrow () {
    throw new Error('Target threw an error');
  }

  methodWillTimeout (milliseconds=5000) {
    setTimeout(function () {
      return 'timeout';
    }, milliseconds);
  }

  get propertWillSucceed () {
    return true;
  }

}
