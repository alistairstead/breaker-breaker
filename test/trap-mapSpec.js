/* global describe, it, beforeEach */
'use strict';

import chai from 'chai';
chai.should();

import { TrapMap } from '../lib/trap-map';

describe('TrapMap', function () {
  let map;
  beforeEach(function () {
    map = TrapMap.create();
    map.clear();
  });

  it('should be created empty', function () {
    map.size.should.equal(0);
  });

  it('should store the objects and has() should return true', function () {
    let key = 'test';
    let value = {};
    map.set(key, value).has(key).should.equal(true);
  });

  it('should store the objects and get() should return the value', function () {
    let key = 'test';
    let value = {};
    map.set(key, value).get(key).should.equal(value);
  });

  it('should store the objects and return the fluent interface', function () {
    let key = 'test';
    let value = {};
    map.set(key, value).should.equal(map);
  });
});
