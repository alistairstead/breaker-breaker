'use strict';

import Promise from 'bluebird';

function resolve () {
  return 'Success';
}

function reject () {
  return 'Fail';
}

export class PromiseTarget {

  methodWillSucceed () {
    return new Promise(function (resolve, reject) {
      resolve();
    });
  }

  methodWillFail () {
    return new Promise(function (resolve, reject) {
      reject();
    });
  }

  mothodWillThrow () {
    throw new Error('Method threw an error');
  }

  methodWillTimeout (milliseconds=5000) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject();
      }, milliseconds);
    });

  }

}
