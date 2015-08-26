'use strict';

export class CallbackTarget {

  methodWillSucceed (callback) {

    callback(null, 'Success');
  }

  methodWillFail (callback) {
    callback(new Error('Method failed'));
  }

  mothodWillThrow () {
    throw new Error('Method threw an error');
  }

  methodWillTimeout (callback, milliseconds=5000) {
    setTimeout(function () {
      callback(null, 'Success');
    }, milliseconds);
  }
  
}
