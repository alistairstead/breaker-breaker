'use strict'

import dbug from 'debug'
import co from 'co'
import * as error from './error'

let debug = dbug('breaker/handler')

export class Handler {

  constructor (policy) {
    this.policy = policy
  }

  get (target, property, receiver) {
    if (!(isPropertyMemberOfObject(...arguments))) {
      throw new error.BreakerOpenError(`${property} is not a member of the Object you have wrapped with the breaker`)
    }

    let policy = this.policy
    let state = policy.reset()

    // Need to identify the API of a callable e.g. callback or promise
    if (isPromise(target[property])) {
      // Promises
    } else if (isCallable(target[property])) {
      return function handlerGetTrap () {
        let result
        let originalArguments = arguments || {}
        // FIXME callback is normall the last argument need a method that extracts this
        let originalCallback = arguments[0] || function () {}

        if (hasCallback([...originalArguments])) {
          let routine = co(function * generatorRoutine () {
            let timedOut = false
            let completed = false

            let successClosure = function () {
              if (timedOut === false) {
                originalCallback(...arguments)
                completed = true
              }
            }

            function * timer () {
              debug('timer')
              yield wait(500)
              if (completed === false) {
                timedOut = true
                let message = 'Timeout error'
                throw new error.BreakerTimeoutError(message)
              }
            }

            function * command () {
              debug('command')
              let commandResult = yield Reflect.apply(target[property], target, originalArguments)
              completed = true
              if (timedOut) {
                return 'quick result that I can define later'
              } else {
                return commandResult
              }
              // throw new error.BreakerOpenError(commandResult)
            }

            originalArguments[0] = successClosure
            // Start the timer and the command in parallel
            result = yield {timer: timer, command: command}

            state = policy.reset(state)

            debug('inside co the result = ', result)

            return result.command

            return 'change this return value when you figure out what is going on'
          }).catch(function (e) {
            state = policy.fail(state)
            if (e instanceof error.BreakerTimeoutError) {
              Reflect.apply(originalCallback, undefined, [e])
            }
          })

          return routine
        } else {
          return Reflect.apply(target[property], target, originalArguments)
        }
      }
    } else {
      return Reflect.get(target, property)
    }
  }

  apply (target, thisArg, argumentsList) {
    debug('called: ', argumentsList.join(', '))
    Reflect.apply(target, thisArg, argumentsList)
  }
}

/**
 * Block routine for n `ms`
 *
 * @param {Number} ms - milliseconds wait time
 * @return {Function}
 * @api private
 */
function wait (ms) {
  return function (done) {
    setTimeout(done, ms)
  }
}

/**
 * Is the final property of argument callable
 *
 * @param {Array} args
 * @return {Boolean}
 * @api private
 */
 function hasCallback (args) {
   debug['hasCallback called with:']
   debug(args)
   return isCallable(args[args.length - 1])
 }

/**
 * Chack if the `property` is a member of the `target`
 *
 * @param {Object} obj
 * @param {String} property
 * @return {Boolean}
 * @api private
 */
function isPropertyMemberOfObject (obj, property) {
  return Reflect.has(obj, property)
}

/**
 * Check if `obj` is callable.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
function isCallable (obj) {
  return typeof obj === 'function'
}

/**
 * Check if `obj` is a promise.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
function isPromise (obj) {
  return typeof obj.then === 'function'
}

/**
 * Check if `obj` is a generator.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */
function isGenerator (obj) {
  return typeof obj.next === 'function' && typeof obj.throw === 'function'
}

/**
 * Check if `obj` is a generator function.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */
function isGeneratorFunction (obj) {
  var constructor = obj.constructor
  if (!constructor) {
    return false
  }
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) {
    return true
  }
  return isGenerator(constructor.prototype)
}

/**
 * Check for plain object.
 *
 * @param {Mixed} val
 * @return {Boolean}
 * @api private
 */
function isObject (val) {
  return Object === val.constructor
}
