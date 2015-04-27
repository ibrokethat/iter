"use strict";

import assert from 'assert';
import sinon from 'sinon';
import * as underTest from '../src/iter';

import {expect} from 'chai';

let arr;
let set;
let map;
let obj;
let gen;
let genMap;
let genSet;
let genObj;
let objSym;
let fakes;

describe("test iter module: ", () => {


  beforeEach(()  =>  {

    fakes = sinon.sandbox.create();

    arr = [10, 20, 30, 40, 50];

    map = new Map();
    map.set('ten', 10);
    map.set('twenty', 20);
    map.set('thirty', 30);
    map.set('forty', 40);
    map.set('fifty', 50);

    set = new Set();
    set.add(10);
    set.add(20);
    set.add(30);
    set.add(40);
    set.add(50);

    obj = {
      ten: 10,
      twenty: 20,
      thirty: 30,
      forty: 40,
      fifty: 50
    };

    gen = function* (six) {
      let a = [1, 2, 3, 4, 5];
      if (six) a.push(3);
      let i = 0;

      while (a.length) {
        yield [i++, a.shift()];
      }
    };

    genObj = function* (six) {
      var o = {one: 1, two: 2, three: 3, four: 4, five: 5};
      if (six) o['six'] = 3;
      var i = 0;
      var keys = Object.keys(o);


      while (i < keys.length) {
        yield [keys[i], o[keys[i++]], Object];
      }
    };

    genMap = function* (six) {
      var o = {one: 1, two: 2, three: 3, four: 4, five: 5};
      if (six) o['six'] = 3;
      var i = 0;
      var keys = Object.keys(o);


      while (i < keys.length) {
        yield [keys[i], o[keys[i++]], Map];
      }
    };

    genSet = function* (six) {
      let a = [1, 2, 3, 4, 5];
      if (six) a.push(3);
      let v;

      while (a.length) {
        v = a.shift();
        yield [v, v, Set];
      }
    };

    objSym = {
      [Symbol.iterator]: gen
    }

  });

  afterEach(() =>  {

    arr = null;
    obj = null;
    gen = null;
    objSym = null;
    genSet = null;
    genMap = null;
    genObj = null;
    set = null;
    map = null;
    fakes.restore();

  });


  describe('function iterator', () => {

    it('should return an iterable object from an Array.prototype.entries method', () => {

      let it = underTest.iterator(arr);

      expect(it.next()).to.be.deep.equal({value: [0, 10], done: false});
      expect(it.next()).to.be.deep.equal({value: [1, 20], done: false});
      expect(it.next()).to.be.deep.equal({value: [2, 30], done: false});
      expect(it.next()).to.be.deep.equal({value: [3, 40], done: false});
      expect(it.next()).to.be.deep.equal({value: [4, 50], done: false});
      expect(it.next()).to.be.deep.equal({value: undefined, done: true});
    });

    it('should return an iterable object from a Map.prototype.entries method', () => {

      let it = underTest.iterator(map);
      expect(it.next()).to.be.deep.equal({value: ['ten', 10], done: false});
      expect(it.next()).to.be.deep.equal({value: ['twenty', 20], done: false});
      expect(it.next()).to.be.deep.equal({value: ['thirty', 30], done: false});
      expect(it.next()).to.be.deep.equal({value: ['forty', 40], done: false});
      expect(it.next()).to.be.deep.equal({value: ['fifty', 50], done: false});
      expect(it.next()).to.be.deep.equal({value: undefined, done: true});
    });

    it('should return an iterable object from a Set.prototype.entries method', () => {

      let it = underTest.iterator(set);
      expect(it.next()).to.be.deep.equal({value: [10, 10], done: false});
      expect(it.next()).to.be.deep.equal({value: [20, 20], done: false});
      expect(it.next()).to.be.deep.equal({value: [30, 30], done: false});
      expect(it.next()).to.be.deep.equal({value: [40, 40], done: false});
      expect(it.next()).to.be.deep.equal({value: [50, 50], done: false});
      expect(it.next()).to.be.deep.equal({value: undefined, done: true});
    });

    it('should return the iterable object if passed an object with an iterator', () => {

      let it = underTest.iterator(objSym);
      expect(it.next()).to.be.deep.equal({value: [0, 1], done: false});
      expect(it.next()).to.be.deep.equal({value: [1, 2], done: false});
      expect(it.next()).to.be.deep.equal({value: [2, 3], done: false});
      expect(it.next()).to.be.deep.equal({value: [3, 4], done: false});
      expect(it.next()).to.be.deep.equal({value: [4, 5], done: false});
      expect(it.next()).to.be.deep.equal({value: undefined, done: true});

    });

    it('should return an iterable object if passed a generator function', () => {

      let it = underTest.iterator(gen);
      expect(it.next()).to.be.deep.equal({value: [0, 1], done: false});
      expect(it.next()).to.be.deep.equal({value: [1, 2], done: false});
      expect(it.next()).to.be.deep.equal({value: [2, 3], done: false});
      expect(it.next()).to.be.deep.equal({value: [3, 4], done: false});
      expect(it.next()).to.be.deep.equal({value: [4, 5], done: false});
      expect(it.next()).to.be.deep.equal({value: undefined, done: true});

    });

    it('should return an iterable object from an object', () => {

      let it = underTest.iterator(obj);
      expect(it.next()).to.be.deep.equal({value: ['ten', 10, Object], done: false});
      expect(it.next()).to.be.deep.equal({value: ['twenty', 20, Object], done: false});
      expect(it.next()).to.be.deep.equal({value: ['thirty', 30, Object], done: false});
      expect(it.next()).to.be.deep.equal({value: ['forty', 40, Object], done: false});
      expect(it.next()).to.be.deep.equal({value: ['fifty', 50, Object], done: false});
      expect(it.next()).to.be.deep.equal({value: undefined, done: true});

    });

    it('should return the iterable object if it is already an iterarable object', () => {

      let it = gen();
      expect(it).to.be.equal(underTest.iterator(it));

    });


  });


  describe('function forEach', () => {

    it('should iterate over the iterator returned from the Array.prototype.entries method', () => {

      let spy = sinon.spy();
      underTest.forEach(arr, spy);

      expect(5, spy.callCount);

      expect(10).to.be.equal(spy.args[0][0]);
      expect(0).to.be.equal(spy.args[0][1]);
      expect(20).to.be.equal(spy.args[1][0]);
      expect(1).to.be.equal(spy.args[1][1]);
      expect(30).to.be.equal(spy.args[2][0]);
      expect(2).to.be.equal(spy.args[2][1]);
      expect(40).to.be.equal(spy.args[3][0]);
      expect(3).to.be.equal(spy.args[3][1]);
      expect(50).to.be.equal(spy.args[4][0]);
      expect(4).to.be.equal(spy.args[4][1]);

    });

    it('should iterate over the iterator returned from the Map.prototype.entries method', () => {

      let spy = sinon.spy();
      underTest.forEach(map, spy);

      expect(5, spy.callCount);

      expect(10).to.be.equal(spy.args[0][0]);
      expect("ten").to.be.equal(spy.args[0][1]);
      expect(20).to.be.equal(spy.args[1][0]);
      expect("twenty").to.be.equal(spy.args[1][1]);
      expect(30).to.be.equal(spy.args[2][0]);
      expect("thirty").to.be.equal(spy.args[2][1]);
      expect(40).to.be.equal(spy.args[3][0]);
      expect("forty").to.be.equal(spy.args[3][1]);
      expect(50).to.be.equal(spy.args[4][0]);
      expect("fifty").to.be.equal(spy.args[4][1]);

    });


    it('should iterate over the iterator returned from the Set.prototype.entries method', () => {

      let spy = sinon.spy();
      underTest.forEach(set, spy);

      expect(5, spy.callCount);

      expect(10).to.be.equal(spy.args[0][0]);
      expect(10).to.be.equal(spy.args[0][1]);
      expect(20).to.be.equal(spy.args[1][0]);
      expect(20).to.be.equal(spy.args[1][1]);
      expect(30).to.be.equal(spy.args[2][0]);
      expect(30).to.be.equal(spy.args[2][1]);
      expect(40).to.be.equal(spy.args[3][0]);
      expect(40).to.be.equal(spy.args[3][1]);
      expect(50).to.be.equal(spy.args[4][0]);
      expect(50).to.be.equal(spy.args[4][1]);

    });


    it('should iterate over an object', () => {

      let spy = sinon.spy();
      underTest.forEach(obj, spy);

      expect(5, spy.callCount);

      expect(10).to.be.equal(spy.args[0][0]);
      expect("ten").to.be.equal(spy.args[0][1]);
      expect(20).to.be.equal(spy.args[1][0]);
      expect("twenty").to.be.equal(spy.args[1][1]);
      expect(30).to.be.equal(spy.args[2][0]);
      expect("thirty").to.be.equal(spy.args[2][1]);
      expect(40).to.be.equal(spy.args[3][0]);
      expect("forty").to.be.equal(spy.args[3][1]);
      expect(50).to.be.equal(spy.args[4][0]);
      expect("fifty").to.be.equal(spy.args[4][1]);

    });


    it('should iterate over an object with a next() method', () => {

      let spy = sinon.spy();
      underTest.forEach(gen(), spy);

      expect(5, spy.callCount);

      expect(1).to.be.equal(spy.args[0][0]);
      expect(2).to.be.equal(spy.args[1][0]);
      expect(3).to.be.equal(spy.args[2][0]);
      expect(4).to.be.equal(spy.args[3][0]);
      expect(5).to.be.equal(spy.args[4][0]);

    });


    it('should iterate over a function that returns a generator', () => {

      let spy = sinon.spy();
      underTest.forEach(gen, spy);

      expect(5, spy.callCount);

      expect(1).to.be.equal(spy.args[0][0]);
      expect(2).to.be.equal(spy.args[1][0]);
      expect(3).to.be.equal(spy.args[2][0]);
      expect(4).to.be.equal(spy.args[3][0]);
      expect(5).to.be.equal(spy.args[4][0]);

    });

    it('should iterate over an object with a Symbol.iterator function', () => {

      let spy = sinon.spy();
      underTest.forEach(objSym, spy);

      expect(5, spy.callCount);

      expect(1).to.be.equal(spy.args[0][0]);
      expect(2).to.be.equal(spy.args[1][0]);
      expect(3).to.be.equal(spy.args[2][0]);
      expect(4).to.be.equal(spy.args[3][0]);
      expect(5).to.be.equal(spy.args[4][0]);

    });


  });


  describe('function filter', () => {

    it('should filter on an array', () => {

      let results = underTest.filter(arr, value => value < 30);

      expect(results).to.be.deep.equal([10, 20]);

    });

    it('should filter on a Map', () => {

      let results = underTest.filter(map, value => value < 30);

      expect(results.constructor).to.be.equal(Map);
      expect(results.size).to.be.equal(2);
      expect(results.get('ten')).to.be.equal(10);
      expect(results.get('twenty')).to.be.equal(20);

    });

    it('should filter on a Set', () => {

      let results = underTest.filter(set, value => value < 30);

      expect(results.constructor).to.be.equal(Set);
      expect(results.size).to.be.equal(2);
      expect(results.has(10)).to.be.true;
      expect(results.has(20)).to.be.true;

    });


    it('should filter on an object', () => {

      let results = underTest.filter(obj, value => value < 30);

      expect(results).to.be.deep.equal({ten: 10, twenty: 20});

    });

    it('should filter on an object with a next method with no defined return type', () => {

      let results = underTest.filter(gen(), value => value < 3);

      expect(results).to.be.deep.equal([1, 2]);

    });

    it('should filter on an object with a next method with an Object return type', () => {

      let results = underTest.filter(genObj(), value => value < 3);

      expect(results).to.be.deep.equal({'one': 1, 'two': 2});

    });

    it('should filter on an object with a next method with a Map return type', () => {

      let results = underTest.filter(genMap(), value => value < 3);

      expect(results.constructor).to.be.equal(Map);
      expect(results.size).to.be.equal(2);
      expect(results.get('one')).to.be.equal(1);
      expect(results.get('two')).to.be.equal(2);

    });

    it('should filter on an object with a next method with a Set return type', () => {

      let results = underTest.filter(genSet(), value => value < 3);

      expect(results.constructor).to.be.equal(Set);
      expect(results.size).to.be.equal(2);
      expect(results.has(1)).to.be.true;
      expect(results.has(2)).to.be.true;

    });


    it('should handle an empty array', () => {

      let results = underTest.filter([], value => value > 30);
      expect(results.constructor).to.be.equal(Array);
      expect(results).to.be.deep.equal([]);

    });

    it('should handle an empty object', () => {

      let results = underTest.filter({}, value => value > 30);

      expect(results.constructor).to.be.equal(Object);
      expect(results).to.be.deep.equal({});

    });

    it('should handle an empty Map', () => {

      let results = underTest.filter(new Map(), value => value > 30);

      expect(results.constructor).to.be.equal(Map);
      expect(results.size).to.be.equal(0);
    });

    it('should handle an empty Set', () => {

      let results = underTest.filter(new Set(), value => value > 30);

      expect(results.constructor).to.be.equal(Set);
      expect(results.size).to.be.equal(0);
    });


  });


  describe('function map', () => {

    it('should map on an array', () => {

      let results = underTest.map(arr, value => value * 2);

      expect(results).to.be.deep.equal([20, 40, 60, 80, 100]);

    });


    it('should map on a, er, a map', () => {

      let results = underTest.map(map, value => value * 2);

      expect(results.constructor).to.be.equal(Map);
      expect(results.size).to.be.equal(5);
      expect(results.get('ten')).to.be.equal(20);
      expect(results.get('twenty')).to.be.equal(40);
      expect(results.get('thirty')).to.be.equal(60);
      expect(results.get('forty')).to.be.equal(80);
      expect(results.get('fifty')).to.be.equal(100);

    });


    it('should map on a set', () => {

      let results = underTest.map(set, value => value * 2);

      expect(results.constructor).to.be.equal(Set);
      expect(results.size).to.be.equal(5);
      expect(results.has(20)).to.be.true;
      expect(results.has(40)).to.be.true;
      expect(results.has(60)).to.be.true;
      expect(results.has(80)).to.be.true;
      expect(results.has(100)).to.be.true;

    });


    it('should map on an object', () => {

      let results = underTest.map(obj, value => value * 2);

      expect(results).to.be.deep.equal({ten: 20, twenty: 40, thirty: 60, forty: 80, fifty: 100});

    });


    it('should map on an object with a next method with no defined return type', () => {

     let results = underTest.map(gen(), value => value * 2);

      expect(results).to.be.deep.equal([2, 4, 6, 8, 10]);

    });

    it('should map on an object with a next method with an Object return type', () => {

     let results = underTest.map(genObj(), value => value * 2);

      expect(results).to.be.deep.equal({one: 2, two: 4, three: 6, four: 8, five: 10});

    });


    it('should map on an object with a next method with a Map return type', () => {

      let results = underTest.map(genMap(), value => value * 2);

      expect(results.constructor).to.be.equal(Map);
      expect(results.size).to.be.equal(5);
      expect(results.get('one')).to.be.equal(2);
      expect(results.get('two')).to.be.equal(4);
      expect(results.get('three')).to.be.equal(6);
      expect(results.get('four')).to.be.equal(8);
      expect(results.get('five')).to.be.equal(10);

    });


    it('should map on an object with a next method with a Set return type', () => {

      let results = underTest.map(genSet(), value => value * 2);

      expect(results.constructor).to.be.equal(Set);
      expect(results.size).to.be.equal(5);
      expect(results.has(2)).to.be.true;
      expect(results.has(4)).to.be.true;
      expect(results.has(6)).to.be.true;
      expect(results.has(8)).to.be.true;
      expect(results.has(10)).to.be.true;

    });


    it('should handle an empty object', () => {

      let results = underTest.map({}, value => value > 30);

      expect(results).to.be.deep.equal({});

    });

    it('should handle an empty array', () => {

      let results = underTest.map([], value => value > 30);

      expect(results).to.be.deep.equal([]);

    });

    it('should handle an empty Map', () => {

      let results = underTest.map(new Map(), value => value > 30);

      expect(results.constructor).to.be.equal(Map);
      expect(results.size).to.be.equal(0);
    });

    it('should handle an empty Set', () => {

      let results = underTest.map(new Set(), value => value > 30);

      expect(results.constructor).to.be.equal(Set);
      expect(results.size).to.be.equal(0);
    });

    it('should map multiple arrays', () => {

      let results = underTest.map(arr, arr, arr, (v1, v2, v3) => v1 + v2 + v3);

      expect(results).to.be.deep.equal([30, 60, 90, 120, 150]);

    });

    it('should map multiple objects', () => {

      let results = underTest.map(obj, obj, obj, (v1, v2, v3) => v1 + v2 + v3);

      expect(results).to.be.deep.equal({ten: 30, twenty: 60, thirty: 90, forty: 120, fifty: 150});

    });

  });

  describe('function some', () => {

    it('should some on an array', () => {

      let results = underTest.some(arr, value => value > 30);

      expect(results).to.be.true;

      results = underTest.some(arr, value => value > 100);

      expect(results).to.be.false;

    });

    it('should some on an object', () => {

      let results = underTest.some(obj, value => value > 30);

      expect(results).to.be.true;

      results = underTest.some(obj, value => value > 100);

      expect(results).to.be.false;

    });

    it('should some on an object with a next method', () => {

      let results = underTest.some(gen(), value => value > 3);

      expect(results).to.be.true;

      results = underTest.some(gen(), value => value > 10);

      expect(results).to.be.false;

    });

  });


  describe('function every', () => {

    it('should every on an array', () => {

      let results = underTest.every(arr, value => value > 0);

      expect(results).to.be.true;

      results = underTest.every(arr, value => value > 50);

      expect(results).to.be.false;

    });

    it('should every on an object', () => {

      let results = underTest.every(obj, value => value > 0);

      expect(results).to.be.true;

      results = underTest.every(obj, value => value > 50);

      expect(results).to.be.false;

    });

    it('should every on an object with a next method', () => {

      let results = underTest.every(gen(), value => value > 0);

      expect(results).to.be.true;

      results = underTest.every(gen(), value => value > 3);

      expect(results).to.be.false;

    });

  });


  describe('function indexOf', () => {

    it('should indexOf on an array', () => {

      arr.push(30)

      let results = underTest.indexOf(arr, 30);

      expect(results).to.be.equal(2);

      results = underTest.indexOf(arr, 5000);

      expect(results).to.be.equal(-1);

    });


    it('should indexOf on an object', () => {

      obj['sixty'] = 30;

      let results = underTest.indexOf(obj, 30);

      expect(results).to.be.equal('thirty');

      results = underTest.indexOf(obj, 5000);

      expect(results).to.be.equal(-1);

    });

  });


  describe('function find', () => {

    it('should find on an array', () => {

      let results = underTest.find(arr, value => value > 30);

      expect(results).to.be.equal(40);

      results = underTest.find(arr, value => value > 100);

      expect(results).to.be.undefined;

    });

    it('should find on an object', () => {

      let results = underTest.find(obj, value => value > 30);

      expect(results).to.be.equal(40);

      results = underTest.find(obj, value => value > 100);

      expect(results).to.be.undefined;

    });

    it('should find on an object with a next method', () => {

      let results = underTest.find(gen(), value => value > 3);

      expect(results).to.be.equal(4);

      results = underTest.find(gen(), value => value > 10);

      expect(results).to.be.undefined;

    });

    it('should handle an empty object', () => {

      let results = underTest.find({}, value => value > 30);

      expect(results).to.be.undefined;

    });

    it('should handle an empty array', () => {

      let results = underTest.find([], value => value > 30);

      expect(results).to.be.undefined;

    });


  });


  describe('function findIndex', () => {

    it('should findIndex on an array', () => {

      let results = underTest.findIndex(arr, value => value > 30);

      expect(results).to.be.equal(3);

      results = underTest.findIndex(arr, value => value > 100);

      expect(results).to.be.equal(-1);

    });

    it('should findIndex on an object', () => {

      let results = underTest.findIndex(obj, value => value > 30);

      expect(results).to.be.equal('forty');

      results = underTest.findIndex(obj, value => value > 100);

      expect(results).to.be.equal(-1);

    });

  });



  describe('function lastIndexOf', () => {

    it('should lastIndexOf on an array', () => {

      arr.push(30)

      let results = underTest.lastIndexOf(arr, 30);

      expect(results).to.be.equal(5);

      results = underTest.lastIndexOf(arr, 5000);

      expect(results).to.be.equal(-1);

    });


    it('should lastIndexOf on an object', () => {

      obj['sixty'] = 30;

      let results = underTest.lastIndexOf(obj, 30);

      expect(results).to.be.equal('sixty');

      results = underTest.lastIndexOf(obj, 5000);

      expect(results).to.be.equal(-1);

    });

  });


  describe('function findLast', () => {

    it('should find on an array', () => {

      let results = underTest.findLast(arr, value => value > 30);

      expect(results).to.be.equal(50);

      results = underTest.find(arr, value => value > 100);

      expect(results).to.be.undefined;

    });

    it('should findLast on an object', () => {

      let results = underTest.findLast(obj, value => value > 30);

      expect(results).to.be.equal(50);

      results = underTest.find(obj, value => value > 100);

      expect(results).to.be.undefined;

    });

    it('should findLast on an object with a next method', () => {

      let results = underTest.findLast(gen(), value => value > 3);

      expect(results).to.be.equal(5);

      results = underTest.findLast(gen(), value => value > 10);

      expect(results).to.be.undefined;

    });

  });

  describe('function findLastIndex', () => {

    it('should find on an array', () => {

      let results = underTest.findLastIndex(arr, value => value > 30);

      expect(results).to.be.equal(4);

      results = underTest.findLastIndex(arr, value => value > 100);

      expect(results).to.be.equal(-1);

    });

    it('should findLastIndex on an object', () => {

      let results = underTest.findLastIndex(obj, value => value > 30);

      expect(results).to.be.equal('fifty');

      results = underTest.findLastIndex(obj, value => value > 100);

      expect(results).to.be.equal(-1);

    });


  });



  describe('function reduce', () => {

    it('should reduce on an array', () => {

      let results = underTest.reduce(arr, (acc, value) => acc + value, 10);

      expect(results).to.be.equal(160);

      results = underTest.reduce(arr, (acc, value) => acc + value);

      expect(results).to.be.equal(150);

    });

    it('should an reduce on an object', () => {

      let results = underTest.reduce(obj, function(acc, value, key) {
        return acc + value;
      }, 10);

      expect(results).to.be.equal(160);

      results = underTest.reduce(obj, (acc, value) => acc + value);

      expect(results).to.be.equal(150);

    });

    it('should an reduce on a Map', () => {

      let results = underTest.reduce(map, function(acc, value, key) {
        return acc + value;
      }, 10);

      expect(results).to.be.equal(160);

      results = underTest.reduce(map, (acc, value) => acc + value);

      expect(results).to.be.equal(150);

    });

    it('should an reduce on a Set', () => {

      let results = underTest.reduce(set, function(acc, value, key) {
        return acc + value;
      }, 10);

      expect(results).to.be.equal(160);

      results = underTest.reduce(set, (acc, value) => acc + value);

      expect(results).to.be.equal(150);

    });


    it('should an reduce on an object with a next method', () => {

      let results = underTest.reduce(gen, function(acc, value, key) {
        return acc + value;
      }, 10);

      expect(results).to.be.equal(25);

      results = underTest.reduce(gen, (acc, value) => acc + value);

      expect(results).to.be.equal(15);

    });


    it('should pass the accumulator correctly', () => {

      let spy = fakes.spy();

      underTest.reduce(obj, spy, 0);

      expect(spy.args[0][0]).to.be.equal(0);

    });

    it('should pass the accumulator correctly', () => {

      let spy = fakes.spy();

      underTest.reduce(obj, spy);

      expect(spy.args[0][0]).to.be.equal(10);

    });

    it('should handle an empty object', () => {

      let results = underTest.reduce({}, (acc, value) => value > 30, 10);

      expect(results).to.be.deep.equal(10);

    });

    it('should handle an empty array', () => {

      let results = underTest.reduce([], (acc, value) => value > 30, 10);

      expect(results).to.be.deep.equal(10);

    });

  });


  describe('function sum', () => {

    it('should sum on an array', () => {

      let results = underTest.sum(arr, 10);

      expect(results).to.be.equal(160);

      results = underTest.sum(arr);

      expect(results).to.be.equal(150);

    });

    it('should an reduce on an object', () => {

      let results = underTest.sum(obj, 10);

      expect(results).to.be.equal(160);

      results = underTest.sum(obj);

      expect(results).to.be.equal(150);

    });

    it('should an reduce on an object with a next method', () => {

      let results = underTest.sum(gen(), 10);

      expect(results).to.be.equal(25);

      results = underTest.sum(gen());

      expect(results).to.be.equal(15);

    });

  });

  describe('function zip', () => {

    it('should zip a bunch of arrays', () => {

      let results = underTest.zip(arr, arr, arr);

      expect(results).to.deep.equal([[10, 10, 10], [20, 20, 20], [30, 30, 30], [40, 40, 40], [50, 50, 50]]);

    });

    it('should zip a bunch of objects', () => {

      let results = underTest.zip(obj, obj, obj);

      expect(results).to.deep.equal({ten: [10, 10, 10], twenty: [20, 20, 20], thirty: [30, 30, 30], forty: [40, 40, 40], fifty: [50, 50, 50]});

    });

    it('should zip a bunch of generators', () => {

      let results = underTest.zip(gen(), gen(), gen());

      expect(results).to.deep.equal([[1, 1, 1], [2, 2, 2], [3, 3, 3], [4, 4, 4], [5, 5, 5]]);

    });

  });


  describe('function chain', () => {

    it('should create an iterator that iterates over all arrays', () => {

      let c = underTest.chain(arr, arr, arr);

      expect(c.next()).to.be.deep.equal({value:[0, 10], done: false});
      expect(c.next()).to.be.deep.equal({value:[1, 20], done: false});
      expect(c.next()).to.be.deep.equal({value:[2, 30], done: false});
      expect(c.next()).to.be.deep.equal({value:[3, 40], done: false});
      expect(c.next()).to.be.deep.equal({value:[4, 50], done: false});
      expect(c.next()).to.be.deep.equal({value:[0, 10], done: false});
      expect(c.next()).to.be.deep.equal({value:[1, 20], done: false});
      expect(c.next()).to.be.deep.equal({value:[2, 30], done: false});
      expect(c.next()).to.be.deep.equal({value:[3, 40], done: false});
      expect(c.next()).to.be.deep.equal({value:[4, 50], done: false});
      expect(c.next()).to.be.deep.equal({value:[0, 10], done: false});
      expect(c.next()).to.be.deep.equal({value:[1, 20], done: false});
      expect(c.next()).to.be.deep.equal({value:[2, 30], done: false});
      expect(c.next()).to.be.deep.equal({value:[3, 40], done: false});
      expect(c.next()).to.be.deep.equal({value:[4, 50], done: false});
      expect(c.next()).to.be.deep.equal({value:undefined, done: true});

    });

  });


  describe('function imap', () => {

    it('should create an iterator that maps over all items of an array', () => {

      let c = underTest.imap(arr, v => v * 2);

      expect(c.next()).to.be.deep.equal({value: [0, 20, Array], done: false});
      expect(c.next()).to.be.deep.equal({value: [1, 40, Array], done: false});
      expect(c.next()).to.be.deep.equal({value: [2, 60, Array], done: false});
      expect(c.next()).to.be.deep.equal({value: [3, 80, Array], done: false});
      expect(c.next()).to.be.deep.equal({value: [4, 100, Array], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});
    });

    it('should create an iterator that maps over all items of an object', () => {

      let c = underTest.imap(obj, v => v * 2);

      expect(c.next()).to.be.deep.equal({value: ['ten', 20, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['twenty', 40, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['thirty', 60, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['forty', 80, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['fifty', 100, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });



    it('should create an iterator that maps over all items of a Map', () => {

      let c = underTest.imap(map, v => v * 2);

      expect(c.next()).to.be.deep.equal({value: ['ten', 20, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['twenty', 40, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['thirty', 60, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['forty', 80, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['fifty', 100, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });

    it('should create an iterator that maps over all items of a Set', () => {

      let c = underTest.imap(set, v => v * 2);

      expect(c.next()).to.be.deep.equal({value: [10, 20, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: [20, 40, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: [30, 60, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: [40, 80, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: [50, 100, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });


    it('should create an iterator that maps over all items of an iterator with no defined return type', () => {

      let c = underTest.imap(gen(), v => v * 2);

      expect(c.next()).to.be.deep.equal({value: [0, 2, underTest.GeneratorFunctionPrototype], done: false});
      expect(c.next()).to.be.deep.equal({value: [1, 4, underTest.GeneratorFunctionPrototype], done: false});
      expect(c.next()).to.be.deep.equal({value: [2, 6, underTest.GeneratorFunctionPrototype], done: false});
      expect(c.next()).to.be.deep.equal({value: [3, 8, underTest.GeneratorFunctionPrototype], done: false});
      expect(c.next()).to.be.deep.equal({value: [4, 10, underTest.GeneratorFunctionPrototype], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });

    it('should create an iterator that maps over all items of an iterator with a Map return type', () => {

      let c = underTest.imap(genMap(), v => v * 2);

      expect(c.next()).to.be.deep.equal({value: ['one', 2, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['two', 4, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['three', 6, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['four', 8, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['five', 10, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });

    it('should create an iterator that maps over all items of an iterator with a Set return type', () => {

      let c = underTest.imap(genSet(), v => v * 2);

      expect(c.next()).to.be.deep.equal({value: [1, 2, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: [2, 4, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: [3, 6, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: [4, 8, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: [5, 10, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });

    it('should create an iterator that maps over all items of an iterator with an Object return type', () => {

      let c = underTest.imap(genObj(), v => v * 2);

      expect(c.next()).to.be.deep.equal({value: ['one', 2, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['two', 4, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['three', 6, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['four', 8, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['five', 10, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });


  });

  describe('function ifilter', () => {

    it('should create an iterator that filters over all items of an array', () => {

      let c = underTest.ifilter(arr, v => v > 25);

      expect(c.next()).to.be.deep.equal({value: [2, 30, Array], done: false});
      expect(c.next()).to.be.deep.equal({value: [3, 40, Array], done: false});
      expect(c.next()).to.be.deep.equal({value: [4, 50, Array], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(arr, v => v < 25);

      expect(c.next()).to.be.deep.equal({value: [0, 10, Array], done: false});
      expect(c.next()).to.be.deep.equal({value: [1, 20, Array], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(arr, v => ((v / 10) % 2 === 0));

      expect(c.next()).to.be.deep.equal({value: [1, 20, Array], done: false});
      expect(c.next()).to.be.deep.equal({value: [3, 40, Array], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });

    it('should create an iterator that filters over all items of a Map', () => {

      let c = underTest.ifilter(map, v => v > 25);

      expect(c.next()).to.be.deep.equal({value: ['thirty', 30, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['forty', 40, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['fifty', 50, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(map, v => v < 25);

      expect(c.next()).to.be.deep.equal({value: ['ten', 10, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['twenty', 20, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(map, v => ((v / 10) % 2 === 0));

      expect(c.next()).to.be.deep.equal({value: ['twenty', 20, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['forty', 40, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });


    it('should create an iterator that filters over all items of a Set', () => {

      let c = underTest.ifilter(set, v => v > 25);

      expect(c.next()).to.be.deep.equal({value: [30, 30, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: [40, 40, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: [50, 50, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(set, v => v < 25);

      expect(c.next()).to.be.deep.equal({value: [10, 10, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: [20, 20, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(set, v => ((v / 10) % 2 === 0));

      expect(c.next()).to.be.deep.equal({value: [20, 20, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: [40, 40, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });


    it('should create an iterator that filters over all items of an object', () => {

      let c = underTest.ifilter(obj, v => v > 25);

      expect(c.next()).to.be.deep.equal({value: ['thirty', 30, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['forty', 40, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['fifty', 50, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(obj, v => v < 25);

      expect(c.next()).to.be.deep.equal({value: ['ten', 10, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['twenty', 20, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(obj, v => ((v / 10) % 2 === 0));

      expect(c.next()).to.be.deep.equal({value: ['twenty', 20, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['forty', 40, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });


    it('should create an iterator that filters over all items of an iterator with no defined return type', () => {

      let c = underTest.ifilter(gen(), v => v > 2);

      expect(c.next()).to.be.deep.equal({value: [2, 3, underTest.GeneratorFunctionPrototype], done: false});
      expect(c.next()).to.be.deep.equal({value: [3, 4, underTest.GeneratorFunctionPrototype], done: false});
      expect(c.next()).to.be.deep.equal({value: [4, 5, underTest.GeneratorFunctionPrototype], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(gen(), v => v < 3);

      expect(c.next()).to.be.deep.equal({value: [0, 1, underTest.GeneratorFunctionPrototype], done: false});
      expect(c.next()).to.be.deep.equal({value: [1, 2, underTest.GeneratorFunctionPrototype], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(gen(), v => (v % 2 === 0));

      expect(c.next()).to.be.deep.equal({value: [1, 2, underTest.GeneratorFunctionPrototype], done: false});
      expect(c.next()).to.be.deep.equal({value: [3, 4, underTest.GeneratorFunctionPrototype], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });


    it('should create an iterator that filters over all items of an iterator with a Map return type', () => {

      let c = underTest.ifilter(genMap(), v => v > 2);

      expect(c.next()).to.be.deep.equal({value: ['three', 3, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['four', 4, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['five', 5, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(genMap(), v => v < 3);

      expect(c.next()).to.be.deep.equal({value: ['one', 1, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['two', 2, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(genMap(), v => (v % 2 === 0));

      expect(c.next()).to.be.deep.equal({value: ['two', 2, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['four', 4, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });


    it('should create an iterator that filters over all items of an iterator with a Set return type', () => {

      let c = underTest.ifilter(genSet(), v => v > 2);

      expect(c.next()).to.be.deep.equal({value: [3, 3, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: [4, 4, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: [5, 5, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(genSet(), v => v < 3);

      expect(c.next()).to.be.deep.equal({value: [1, 1, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: [2, 2, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(genSet(), v => (v % 2 === 0));

      expect(c.next()).to.be.deep.equal({value: [2, 2, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: [4, 4, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });


    it('should create an iterator that filters over all items of an iterator with an Object return type', () => {

      let c = underTest.ifilter(genObj(), v => v > 2);

      expect(c.next()).to.be.deep.equal({value: ['three', 3, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['four', 4, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['five', 5, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(genObj(), v => v < 3);

      expect(c.next()).to.be.deep.equal({value: ['one', 1, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['two', 2, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(genObj(), v => (v % 2 === 0));

      expect(c.next()).to.be.deep.equal({value: ['two', 2, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['four', 4, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });


  });

  describe('function invoke', () => {

    it('should call the methods on each item in the collection', () => {

      expect(underTest.invoke([1, 2, 3, 4, 5], 'toFixed', 2)).to.deep.equal(['1.00', '2.00', '3.00', '4.00', '5.00']);
      expect(underTest.invoke([1, 2, 3, 4, 5, 6, 7], 'toString', 2)).to.deep.equal(['1', '10', '11', '100', '101', '110', '111']);

    });

  });

  describe('function pluck', () => {

    it('should pluck the values from an object', () => {

      let data = [{ data : { value : 'foo' } }, { data : { value : 'bar' } }, {}, { value : 'blim' }, { data : { value : 'blam' } }];
      expect( underTest.pluck( data, 'data.value' ) ).to.deep.equal( ["foo", "bar", undefined, undefined, "blam"] );

      expect( underTest.pluck( data, 'data.value', true ) ).to.deep.equal( ["foo", "bar", "blam"] );

      expect( underTest.pluck( [
        { 'one' : 1, 'two' : 2, 'three' : 3 },
        { 'one' : 1, 'two' : 2, 'three' : 3 },
        { 'one' : 1, 'two' : 2, 'three' : 3 }
      ], 'two' ) ).to.deep.equal( [2, 2, 2] );

      expect( underTest.pluck( [
        { 'one' : 1,         'two' : 2, 'three' : 3 },
        { 'one' : undefined, 'two' : 2, 'three' : 3 },
        { 'one' : 1,         'two' : 2, 'three' : 3 },
        { 'one' : null,      'two' : 2, 'three' : 3 },
        { 'one' : 1,         'two' : 2, 'three' : 3 }
      ], 'one', true ) ).to.deep.equal( [1, 1, 1] );

      expect( underTest.pluck( underTest.pluck( [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map( function( o, i ) {
        return { src : { val : i } };
      } ), 'src' ), 'val' ) ).to.deep.equal( [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] );

      expect( underTest.pluck( underTest.pluck( underTest.pluck( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map( function( o, i ) {
        return { src : { val : { id : i % 2 ? i : null } } };
      } ), 'src' ), 'val' ), 'id', true ) ).to.deep.equal( [1, 3, 5, 7, 9] );

      expect( underTest.pluck( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map( function( o, i ) {
        return { src : { val : i } };
      } ), 'src.val' ) ).to.deep.equal( [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] );

      expect( underTest.pluck( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map( function( o, i ) {
        return { src : { val : { id : i % 2 ? i : null } } };
      } ), 'src.val.id', true ) ).to.deep.equal( [1, 3, 5, 7, 9] );

    });

  });


  describe('function takeWhile', () => {

    it('should takeWhile on an array', () => {

      let results = underTest.takeWhile(arr, v => v < 40);

      expect(results).to.deep.equal([10, 20, 30]);

      results = underTest.takeWhile(arr, v => v < 100);

      expect(results).to.deep.equal([10, 20, 30, 40, 50]);

      results = underTest.takeWhile(arr, v => v < 10);

      expect(results).to.deep.equal([]);


    });

    it('should takeWhile on an object', () => {

      let results = underTest.takeWhile(obj, v => v < 40);

      expect(results).to.deep.equal({ten: 10, twenty: 20, thirty: 30});

      results = underTest.takeWhile(obj, v => v < 100);

      expect(results).to.deep.equal({ten: 10, twenty: 20, thirty: 30, forty: 40, fifty: 50});

      results = underTest.takeWhile(obj, v => v < 10);

      expect(results).to.deep.equal({});

    });

    it('should takeWhile on an object with a next method', () => {

      let results = underTest.takeWhile(gen, v => v < 4);

      expect(results).to.deep.equal([1, 2 ,3]);

      results = underTest.takeWhile(gen, v => v < 10);

      expect(results).to.deep.equal([1, 2 ,3, 4, 5]);

      results = underTest.takeWhile(gen, v => v < 1);

      expect(results).to.deep.equal(null);

    });

  });

  describe('function dropWhile', () => {

    it('should dropWhile on an array', () => {

      let results = underTest.dropWhile(arr, v => v < 40);

      expect(results).to.deep.equal([40, 50]);

      results = underTest.dropWhile(arr, v => v < 100);

      expect(results).to.deep.equal([]);

      results = underTest.dropWhile(arr, v => v < 10);

      expect(results).to.deep.equal([10, 20, 30, 40, 50]);


    });

    it('should dropWhile on an object', () => {

      let results = underTest.dropWhile(obj, v => v < 40);

      expect(results).to.deep.equal({forty: 40, fifty: 50});

      results = underTest.dropWhile(obj, v => v < 100);

      expect(results).to.deep.equal({});

      results = underTest.dropWhile(obj, v => v < 10);

      expect(results).to.deep.equal({ten: 10, twenty: 20, thirty: 30, forty: 40, fifty: 50});

    });

    it('should dropWhile on an object with a next method', () => {

      let results = underTest.dropWhile(gen, v => v < 4);

      expect(results).to.deep.equal([4, 5]);

      results = underTest.dropWhile(gen, v => v < 10);

      expect(results).to.deep.equal(null);

      results = underTest.dropWhile(gen, v => v < 1);

      expect(results).to.deep.equal([1, 2 ,3, 4, 5]);

    });

  });


  describe('function take', () => {

    it('should take on an array', () => {

      let results = underTest.take(arr);

      expect(results).to.deep.equal([10]);

      results = underTest.take(arr, 3);

      expect(results).to.deep.equal([10, 20, 30]);

    });

    // it('should throw on an object', () => {

    //   let results = underTest.dropWhile(obj, v => v < 40);

    //   expect(results).to.deep.equal({ten: 10, twenty: 20, thirty: 30});

    //   results = underTest.dropWhile(obj, v => v < 100);

    //   expect(results).to.deep.equal({ten: 10, twenty: 20, thirty: 30, forty: 40, fifty: 50});

    //   results = underTest.dropWhile(obj, v => v < 10);

    //   expect(results).to.deep.equal({});

    // });

    it('should take on an object with a next method', () => {

      let results = underTest.take(gen);

      expect(results).to.deep.equal([1]);

      results = underTest.take(gen, 3);

      expect(results).to.deep.equal([1, 2 , 3]);


    });

  });


  describe('function drop', () => {

    it('should take on an array', () => {

      let results = underTest.drop(arr);

      expect(results).to.deep.equal([20, 30, 40, 50]);

      results = underTest.drop(arr, 3);

      expect(results).to.deep.equal([40, 50]);

    });

    // it('should throw on an object', () => {

    //   let results = underTest.dropWhile(obj, v => v < 40);

    //   expect(results).to.deep.equal({ten: 10, twenty: 20, thirty: 30});

    //   results = underTest.dropWhile(obj, v => v < 100);

    //   expect(results).to.deep.equal({ten: 10, twenty: 20, thirty: 30, forty: 40, fifty: 50});

    //   results = underTest.dropWhile(obj, v => v < 10);

    //   expect(results).to.deep.equal({});

    // });

    it('should drop on an object with a next method', () => {

      let results = underTest.drop(gen);

      expect(results).to.deep.equal([2, 3, 4, 5]);

      results = underTest.drop(gen, 3);

      expect(results).to.deep.equal([4, 5]);


    });

  });



  describe('function part', () => {

    it('should part an array', () => {

      let [t, f] = underTest.part(arr, v => v > 20);

      expect(t).to.deep.equal([30, 40, 50]);
      expect(f).to.deep.equal([10, 20]);

    });

    it('should part an object', () => {

      let [t, f] = underTest.part(obj, v => v > 20);

      expect(t).to.deep.equal({thirty: 30, forty: 40, fifty: 50});
      expect(f).to.deep.equal({ten:10, twenty: 20});

    });

  });



  describe('function groupBy', () => {

    it('should group the items of an array into groups in an array', () => {

      let results = underTest.groupBy([30,10,20,40,50], v => {
        let key;
        switch (true) {
          case v < 30:
            key = 0;
            break;
          case v === 30:
            key = 1;
            break;
          case v > 30:
            key = 2;
            break;
        }
        return key;
      });

      expect(results).to.deep.equal([
        [10, 20],
        [30],
        [40, 50]
      ]);

    });

    it('should group the items of an array into groups in an Object', () => {

      let results = underTest.groupBy(arr, v => {
        let key;
        switch (true) {
          case v < 30:
            key = '<';
            break;
          case v === 30:
            key = '===';
            break;
          case v > 30:
            key = '>';
            break;
        }
        return key;
      });

      expect(results).to.deep.equal({
        '<': [10, 20],
        '===': [30],
        '>': [40, 50]
      });

    });


    it('should group the items of an array into groups in a Map', () => {

      let keys = [['<'], ['==='], ['>']];

      let results = underTest.groupBy(arr, v => {

        let key;

        switch (true) {
          case v < 30:
            key = keys[0];
            break;
          case v === 30:
            key = keys[1];
            break;
          case v > 30:
            key = keys[2];
            break;
        }
        return key;
      });

      expect(results.constructor).to.be.equal(Map);
      expect(results.size).to.be.equal(3);
      expect(results.get(keys[0])).to.be.deep.equal([10, 20]);
      expect(results.get(keys[1])).to.be.deep.equal([30]);
      expect(results.get(keys[2])).to.be.deep.equal([40, 50]);

    });


    it('should group the items of an object into groups in an array', () => {

      let results = underTest.groupBy(obj, v => {
        let key;
        switch (true) {
          case v < 30:
            key = 0;
            break;
          case v === 30:
            key = 1;
            break;
          case v > 30:
            key = 2;
            break;
        }
        return key;
      });

      expect(results).to.deep.equal([
        {ten: 10, twenty: 20},
        {thirty: 30},
        {forty: 40, fifty: 50}
      ]);

    });


    it('should group the items of an object into groups in an object', () => {

      let results = underTest.groupBy(obj, v => {
        let key;
        switch (true) {
          case v < 30:
            key = '<';
            break;
          case v === 30:
            key = '===';
            break;
          case v > 30:
            key = '>';
            break;
        }
        return key;
      });


      expect(results).to.deep.equal({
        '<': {ten: 10, twenty: 20},
        '===': {thirty: 30},
        '>': {forty: 40, fifty: 50}
      });

    });


    it('should group the items of an object into groups in a Map', () => {

      let keys = [['<'], ['==='], ['>']];

      let results = underTest.groupBy(obj, v => {

        let key;

        switch (true) {
          case v < 30:
            key = keys[0];
            break;
          case v === 30:
            key = keys[1];
            break;
          case v > 30:
            key = keys[2];
            break;
        }
        return key;
      });

      expect(results.constructor).to.be.equal(Map);
      expect(results.size).to.be.equal(3);
      expect(results.get(keys[0])).to.be.deep.equal({ten: 10, twenty: 20});
      expect(results.get(keys[1])).to.be.deep.equal({thirty: 30});
      expect(results.get(keys[2])).to.be.deep.equal({forty: 40, fifty: 50});

    });

  });

});
