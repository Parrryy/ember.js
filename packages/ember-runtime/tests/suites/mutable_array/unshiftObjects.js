import { get } from 'ember-metal';
import { SuiteModuleBuilder } from '../suite';

const suite = SuiteModuleBuilder.create();

suite.module('unshiftObjects');

suite.test('returns receiver', function(assert) {
  let obj = this.newObject([]);
  let items = this.newFixture(3);

  assert.equal(obj.unshiftObjects(items), obj, 'should return receiver');
});

suite.test('[].unshiftObjects([A,B,C]) => [A,B,C] + notify', function(assert) {
  let before = [];
  let items = this.newFixture(3);
  let obj = this.newObject(before);
  let observer = this.newObserver(obj, '[]', '@each', 'length', 'firstObject', 'lastObject');

  obj.getProperties('firstObject', 'lastObject'); /* Prime the cache */

  obj.unshiftObjects(items);

  assert.deepEqual(this.toArray(obj), items, 'post item results');
  assert.equal(get(obj, 'length'), items.length, 'length');

  assert.equal(observer.timesCalled('[]'), 1, 'should have notified [] once');
  assert.equal(observer.timesCalled('@each'), 0, 'should not have notified @each once');
  assert.equal(observer.timesCalled('length'), 1, 'should have notified length once');
  assert.equal(observer.timesCalled('firstObject'), 1, 'should have notified firstObject once');
  assert.equal(observer.timesCalled('lastObject'), 1, 'should have notified lastObject once');
});

suite.test('[A,B,C].unshiftObjects([X,Y]) => [X,Y,A,B,C] + notify', function(assert) {
  let before = this.newFixture(3);
  let items  = this.newFixture(2);
  let after  = items.concat(before);
  let obj = this.newObject(before);
  let observer = this.newObserver(obj, '[]', '@each', 'length', 'firstObject', 'lastObject');

  obj.getProperties('firstObject', 'lastObject'); /* Prime the cache */

  obj.unshiftObjects(items);

  assert.deepEqual(this.toArray(obj), after, 'post item results');
  assert.equal(get(obj, 'length'), after.length, 'length');

  assert.equal(observer.timesCalled('[]'), 1, 'should have notified [] once');
  assert.equal(observer.timesCalled('@each'), 0, 'should not have notified @each once');
  assert.equal(observer.timesCalled('length'), 1, 'should have notified length once');
  assert.equal(observer.timesCalled('firstObject'), 1, 'should have notified firstObject once');

  assert.equal(observer.validate('lastObject'), false, 'should NOT have notified lastObject');
});

suite.test('[A,B,C].unshiftObjects([A,B]) => [A,B,A,B,C] + notify', function(assert) {
  let before = this.newFixture(3);
  let items = [before[0], before[1]]; // note same object as current head. should end up twice
  let after  = items.concat(before);
  let obj = this.newObject(before);
  let observer = this.newObserver(obj, '[]', '@each', 'length', 'firstObject', 'lastObject');

  obj.getProperties('firstObject', 'lastObject'); /* Prime the cache */

  obj.unshiftObjects(items);

  assert.deepEqual(this.toArray(obj), after, 'post item results');
  assert.equal(get(obj, 'length'), after.length, 'length');

  assert.equal(observer.timesCalled('[]'), 1, 'should have notified [] once');
  assert.equal(observer.timesCalled('@each'), 0, 'should not have notified @each once');
  assert.equal(observer.timesCalled('length'), 1, 'should have notified length once');

  assert.equal(observer.validate('firstObject'), false, 'should NOT have notified firstObject');
  assert.equal(observer.validate('lastObject'), false, 'should NOT have notified lastObject');
});

export default suite;
