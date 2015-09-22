'use strict';

import * as error from './error';
import { EventEmitter } from 'events';
import { RaceCommand } from '../racable';
import { Command } from '../command';

export class ObservableCommand extends EventEmitter {
  constructor (callable, context, originalArguments) {
    super();
    this.callable = callable;
    this.context = context;
  }

  execute () {
    let ctx = this;
    return function () {
      let start = new Date();
      let originalArguments = Object.create(arguments);
      return new RaceCommand(new Command(ctx.callable, ctx.scope, originalArguments)).then(
        function resolve (value) {
          let duration = new Date() - start;
          ctx.emit('command:complete', { duration, value });
          return value;
        },
        function reject (err) {
          let duration = new Date() - start;
          if (hasCallback([...originalArguments])) {
            let originalCallback = originalArguments[0];
            Reflect.apply(originalCallback, undefined, [new error.BreakerOpenError(err.message)]);
            ctx.emit('command:fail', { duration });
          } else {
            throw new error.BreakerOpenError(err.message)
          }
        }
      );
    };
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
  return isCallable(args[args.length - 1]);
}

/**
 * Check if `obj` is callable.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
function isCallable (obj) {
  return typeof obj === 'function';
}
