'use strict'

export class SyncronousTarget {

  methodWillSucceed () {
    return true
  }

  methodWillFail () {
    return false
  }

  methodWillThrow () {
    throw new Error('Target threw an error')
  }

  methodWillTimeout (milliseconds = 5000) {
    setTimeout(function () {
      return 'timeout'
    }, milliseconds)
  }

  get propertyWillSucceed () {
    return true
  }

}
