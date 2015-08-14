'use strict';

export class Handler {
  constructor (policy) {
    this.policy = policy;
  }

  get (target, property, receiver) {
    return property in target? target[property] : property in receiver? receiver[property] : undefined;
  }

  set (receiver, property, value) {
    receiver[property] = value;
  }

}
