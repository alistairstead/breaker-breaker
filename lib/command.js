'use strict';

export class Command {
  /**
   * Construct a Promise around the supplied `callable` to allow it to be passed to
   * Promise.race() and timed during execution. The continuation of a callback or promise API
   * is maintained. Syncronous callables are also supported however if these provide a fluent
   * interface this is not respected.
   *
   * @param {Function} callable
   * @param {Object} context
   * @param {Array} originalArguments
   * @return {Promise}
   */
  constructor (callable, context, originalArguments) {
    if (typeof callable.then === 'function') {
      return callable;
    }
    return new Promise(function (resolve, reject) {
      let result;
      try {
        if (hasCallbackFunction(originalArguments)) {
          originalArguments = decorateArgumentsCallback(originalArguments, resolve, reject);
        }
        result = Reflect.apply(callable, context, originalArguments);
      } catch (e) {
        reject(e);
      } finally {
        if (result instanceof Error) {
          reject(result);
        }
        resolve(result);
      }
    });
  }

  static create (callable, context, originalArguments) {
    return new Command(...arguments);
  }
}

/**
 * Decorate the supplied `args` array with a wrapper around the callback method.
 * This results in the promise API and the callback API being available for continuation.
 *
 * @param {Array} args
 * @param {Function} resolve
 * @param {Function} reject
 * @return {Array}
 */
function decorateArgumentsCallback (args, resolve, reject) {
  let originalArguments = Object.create(args);
  let callbackIndex = args.length - 1;
  let callback = getCallbackFunction(args);
  originalArguments[callbackIndex] = function (err, result) {
    if (err) {
      reject(err);
    }
    callback(err, result);
    resolve(result);
  };

  return originalArguments;
}

/**
 * Retrieve the callback method from the supplied array of arguments
 *
 * @param {Array} args
 * @return {Array} [{Function}, {Number}]
 */
function getCallbackFunction (args) {
  let callbackIndex = args.length - 1;
  return (hasCallbackFunction(args)) ? args[callbackIndex] : undefined;
}

/**
 * Has the callback method in the supplied array of arguments
 *
 * @param {Array} args
 * @return {Boolean}
 */
function hasCallbackFunction (args) {
  let callbackIndex = args.length - 1;
  return typeof args[callbackIndex] === 'function';
}