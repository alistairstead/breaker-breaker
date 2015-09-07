'use strict'

import { Reflect } from 'harmony-reflect'

import { Handler } from './handler'
import { Policy } from './policy'

export class Breaker {

  static create (target, options) {
    return new Proxy(target, new Handler(Policy.create(options)))
  }
}
