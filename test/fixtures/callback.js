'use strict'

import co from 'co'

function sleep (ms) {
  return function (done) {
    setTimeout(done, ms)
  }
}

function * work () {
  yield sleep(1500)
  return 'Success'
}

export class CallbackTarget {

  methodWillSucceed (callback) {
    callback(null, 'Success')
    return 'return value'
  }

  methodWillFail (callback) {
    callback(new Error('Method failed'))
    return 'return value'
  }

  mothodWillThrow (callback) {
    throw new Error('Method threw an error')
  }

  methodWillTimeout (callback) {
    return co(function * () {
      return yield work()
    }).then(function () {
      Reflect.apply(callback, undefined, [null, 'Success'])
    })
  }

}
