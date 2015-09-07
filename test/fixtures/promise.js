'use strict'

import Promise from 'bluebird'

export class PromiseTarget {

  methodWillSucceed (resolve, reject) {
    return new Promise(function (resolve, reject) {
      resolve('Success')
    })
  }

  methodWillFail (resolve, reject) {
    return new Promise(function (resolve, reject) {
      reject('Fail')
    })
  }

  mothodWillThrow (resolve, reject) {
    throw new Error('Method threw an error')
  }

  methodWillTimeout (resolve, reject, milliseconds = 5000) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject()
      }, milliseconds)
    })

  }

}
