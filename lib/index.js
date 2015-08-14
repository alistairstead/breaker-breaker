'use strict';

import {Reflect} from 'harmony-reflect';
import {Handler} from './handler';

export class Breaker {

  static create (target, options) {
    return new Proxy(target, new Handler(options));
  }
}
