/* global describe, it */
'use strict';

import chai from 'chai';
chai.should();

import { TrapFactory } from '../lib/trap-factory';
import { TrapMap } from '../lib/trap-map';

describe('TrapFactory', function () {
  let map = TrapMap.create();
  let factory = TrapFactory.create(map);

  it('should construct a callable trap', function () {
    factory.createCallableTrap(function () {}, this).should.be.a('function');
  });

  it('should return the trap from the internal map after being created for the first time', function () {
    factory.createCallableTrap(function () {}, this, 'test-key').should.equal(factory.create(function () {}, this, 'test-key'));
  });

  it('should not return the trap from the internal map for a new key', function () {
    factory.createCallableTrap(function () {}, this, 'test-key').should.not.equal(factory.create(function () {}, this, 'new-key'));
  });
});
