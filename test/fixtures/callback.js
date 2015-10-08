'use strict';

import co from 'co';

function sleep (ms) {
  return function (done) {
    setTimeout(done, ms);
  };
}

function * timeout () {
  yield sleep(1500);
  return 'Success';
}

function * delay () {
  yield sleep(500);
  return 'Success';
}

export class CallbackTarget {

  methodWillSucceed (callback) {
    callback(null, 'Success');
  }

  methodWillFail (callback) {
    callback(new Error('Method failed'));
  }

  mothodWillThrow (callback) {
    throw new Error('Method threw an error');
  }

  methodWillTimeout (callback) {
    return co(function * () {
      return yield timeout();
    }).then(function () {
      callback(null, 'Success');
    });
  }

  methodWillBlockButNotTimeout (callback) {
    return co(function * () {
      return yield delay();
    }).then(function () {
      callback(null, 'Success');
    });
  }

}
