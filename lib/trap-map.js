'use strict';

let map = new Map();

export class TrapMap {

  static create () {
    return new TrapMap();
  }

  get size () {
    return map.size;
  }

  clear () {
    map = new Map();
  }

  delete (key) {
    return map.delete(key);
  }

  get (key) {
    return map.get(key);
  }

  has (key) {
    return map.has(key);
  }

  set (key, value) {
    map.set(key, value);
    return this;
  }
}
