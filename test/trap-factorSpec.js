/* global describe, it */
'use strict';

import chai from 'chai';
chai.should();

import { TrapFactory } from '../lib/trap-factory';
import { TrapMap } from '../lib/trap-map';

describe('TrapFactory', () => {
  let map = TrapMap.create();
  let factory = TrapFactory.create(map);

  it('should construct a callable trap', () => {
    factory.createCallableTrap(() => {}, this).should.be.a('Function');
  });

  it('should return the trap from the internal map after being created for the first time', () => {
    factory.createCallableTrap(() => {}, this, 'test-key').should.equal(factory.createCallableTrap(() => {}, this, 'test-key'));
  });

  it('should not return the trap from the internal map for a new key', () => {
    factory.createCallableTrap(() => {}, this, 'test-key').should.not.equal(factory.createCallableTrap(() => {}, this, 'new-key'));
  });
});
