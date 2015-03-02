import assert from 'assert';
import sinon from 'sinon';
import * as underTest from '../iter';

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

describe("test iter module: ", function() {


  beforeEach(function() {

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

  afterEach(function() {

    arr = null;
    obj = null;
    gen = null;
    fakes.restore();

  });


  describe('function iterator', function () {

    it('should return an iterable object from an Array.prototype.entries method', function () {

      let it = underTest.iterator(arr);

      expect(it.next()).to.be.deep.equal({value: [0, 10], done: false});
      expect(it.next()).to.be.deep.equal({value: [1, 20], done: false});
      expect(it.next()).to.be.deep.equal({value: [2, 30], done: false});
      expect(it.next()).to.be.deep.equal({value: [3, 40], done: false});
      expect(it.next()).to.be.deep.equal({value: [4, 50], done: false});
      expect(it.next()).to.be.deep.equal({value: undefined, done: true});
    });

    it('should return an iterable object from a Map.prototype.entries method', function () {

      let it = underTest.iterator(map);
      expect(it.next()).to.be.deep.equal({value: ['ten', 10], done: false});
      expect(it.next()).to.be.deep.equal({value: ['twenty', 20], done: false});
      expect(it.next()).to.be.deep.equal({value: ['thirty', 30], done: false});
      expect(it.next()).to.be.deep.equal({value: ['forty', 40], done: false});
      expect(it.next()).to.be.deep.equal({value: ['fifty', 50], done: false});
      expect(it.next()).to.be.deep.equal({value: undefined, done: true});
    });

    it('should return an iterable object from a Set.prototype.entries method', function () {

      let it = underTest.iterator(set);
      expect(it.next()).to.be.deep.equal({value: [10, 10], done: false});
      expect(it.next()).to.be.deep.equal({value: [20, 20], done: false});
      expect(it.next()).to.be.deep.equal({value: [30, 30], done: false});
      expect(it.next()).to.be.deep.equal({value: [40, 40], done: false});
      expect(it.next()).to.be.deep.equal({value: [50, 50], done: false});
      expect(it.next()).to.be.deep.equal({value: undefined, done: true});
    });

    it('should return the iterable object if passed an object with an iterator', function () {

      let it = underTest.iterator(objSym);
      expect(it.next()).to.be.deep.equal({value: [0, 1], done: false});
      expect(it.next()).to.be.deep.equal({value: [1, 2], done: false});
      expect(it.next()).to.be.deep.equal({value: [2, 3], done: false});
      expect(it.next()).to.be.deep.equal({value: [3, 4], done: false});
      expect(it.next()).to.be.deep.equal({value: [4, 5], done: false});
      expect(it.next()).to.be.deep.equal({value: undefined, done: true});

    });

    it('should return an iterable object if passed a generator function', function () {

      let it = underTest.iterator(gen);
      expect(it.next()).to.be.deep.equal({value: [0, 1], done: false});
      expect(it.next()).to.be.deep.equal({value: [1, 2], done: false});
      expect(it.next()).to.be.deep.equal({value: [2, 3], done: false});
      expect(it.next()).to.be.deep.equal({value: [3, 4], done: false});
      expect(it.next()).to.be.deep.equal({value: [4, 5], done: false});
      expect(it.next()).to.be.deep.equal({value: undefined, done: true});

    });

    it('should return an iterable object from an object', function () {

      let it = underTest.iterator(obj);
      expect(it.next()).to.be.deep.equal({value: ['ten', 10, Object], done: false});
      expect(it.next()).to.be.deep.equal({value: ['twenty', 20, Object], done: false});
      expect(it.next()).to.be.deep.equal({value: ['thirty', 30, Object], done: false});
      expect(it.next()).to.be.deep.equal({value: ['forty', 40, Object], done: false});
      expect(it.next()).to.be.deep.equal({value: ['fifty', 50, Object], done: false});
      expect(it.next()).to.be.deep.equal({value: undefined, done: true});

    });

    it('should return the iterable object if it is already an iterarable object', function () {

      let it = gen();
      expect(it).to.be.equal(underTest.iterator(it));

    });


  });


  describe("function forEach", function() {

    it("should iterate over the iterator returned from the Array.prototype.entries method", function() {

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

    it("should iterate over the iterator returned from the Map.prototype.entries method", function() {

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


    it("should iterate over the iterator returned from the Set.prototype.entries method", function() {

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


    it("should iterate over an object", function() {

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


    it("should iterate over an object with a next() method", function() {

      let spy = sinon.spy();
      underTest.forEach(gen(), spy);

      expect(5, spy.callCount);

      expect(1).to.be.equal(spy.args[0][0]);
      expect(2).to.be.equal(spy.args[1][0]);
      expect(3).to.be.equal(spy.args[2][0]);
      expect(4).to.be.equal(spy.args[3][0]);
      expect(5).to.be.equal(spy.args[4][0]);

    });


    it("should iterate over a function that returns a generator", function() {

      let spy = sinon.spy();
      underTest.forEach(gen, spy);

      expect(5, spy.callCount);

      expect(1).to.be.equal(spy.args[0][0]);
      expect(2).to.be.equal(spy.args[1][0]);
      expect(3).to.be.equal(spy.args[2][0]);
      expect(4).to.be.equal(spy.args[3][0]);
      expect(5).to.be.equal(spy.args[4][0]);

    });

    it("should iterate over an object with a Symbol.iterator function", function() {

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


  describe("function filter", function() {

    it("should filter on an array", function() {

      let results = underTest.filter(arr, function(value) {
        return value < 30;
      });

      expect(results).to.be.deep.equal([10, 20]);

    });

    it("should filter on a Map", function() {

      let results = underTest.filter(map, function(value) {
        return value < 30;
      });

      expect(results.constructor).to.be.equal(Map);
      expect(results.size).to.be.equal(2);
      expect(results.get('ten')).to.be.equal(10);
      expect(results.get('twenty')).to.be.equal(20);

    });

    it("should filter on a Set", function() {

      let results = underTest.filter(set, function(value) {
        return value < 30;
      });

      expect(results.constructor).to.be.equal(Set);
      expect(results.size).to.be.equal(2);
      expect(results.has(10)).to.be.true;
      expect(results.has(20)).to.be.true;

    });


    it("should filter on an object", function() {

      let results = underTest.filter(obj, function(value) {
        return value < 30;
      });

      expect(results).to.be.deep.equal({ten: 10, twenty: 20});

    });

    it("should filter on an object with a next method with no defined return type", function() {

      let results = underTest.filter(gen(), function(value) {
        return value < 3;
      });

      expect(results).to.be.deep.equal([1, 2]);

    });

    it("should filter on an object with a next method with an Object return type", function() {

      let results = underTest.filter(genObj(), function(value) {
        return value < 3;
      });

      expect(results).to.be.deep.equal({'one': 1, 'two': 2});

    });

    it("should filter on an object with a next method with a Map return type", function() {

      let results = underTest.filter(genMap(), function(value) {
        return value < 3;
      });

      expect(results.constructor).to.be.equal(Map);
      expect(results.size).to.be.equal(2);
      expect(results.get('one')).to.be.equal(1);
      expect(results.get('two')).to.be.equal(2);

    });

    it("should filter on an object with a next method with a Set return type", function() {

      let results = underTest.filter(genSet(), function(value) {
        return value < 3;
      });

      expect(results.constructor).to.be.equal(Set);
      expect(results.size).to.be.equal(2);
      expect(results.has(1)).to.be.true;
      expect(results.has(2)).to.be.true;

    });


    it("should handle an empty array", function() {

      let results = underTest.filter([], function(value) {
        return value > 30;
      });
      expect(results.constructor).to.be.equal(Array);
      expect(results).to.be.deep.equal([]);

    });

    it("should handle an empty object", function() {

      let results = underTest.filter({}, function(value) {
        return value > 30;
      });

      expect(results.constructor).to.be.equal(Object);
      expect(results).to.be.deep.equal({});

    });

    it("should handle an empty Map", function() {

      let results = underTest.filter(new Map(), function(value) {
        return value > 30;
      });

      expect(results.constructor).to.be.equal(Map);
      expect(results.size).to.be.equal(0);
    });

    it("should handle an empty Set", function() {

      let results = underTest.filter(new Set(), function(value) {
        return value > 30;
      });

      expect(results.constructor).to.be.equal(Set);
      expect(results.size).to.be.equal(0);
    });


  });


  describe("function map", function() {

    it("should map on an array", function() {

      let results = underTest.map(arr, function(value) {
        return value * 2;
      });

      expect(results).to.be.deep.equal([20, 40, 60, 80, 100]);

    });


    it("should map on a, er, a map", function() {

      let results = underTest.map(map, function(value) {
        return value * 2;
      });

      expect(results.constructor).to.be.equal(Map);
      expect(results.size).to.be.equal(5);
      expect(results.get('ten')).to.be.equal(20);
      expect(results.get('twenty')).to.be.equal(40);
      expect(results.get('thirty')).to.be.equal(60);
      expect(results.get('forty')).to.be.equal(80);
      expect(results.get('fifty')).to.be.equal(100);

    });


    it("should map on a set", function() {

      let results = underTest.map(set, function(value) {
        return value * 2;
      });

      expect(results.constructor).to.be.equal(Set);
      expect(results.size).to.be.equal(5);
      expect(results.has(20)).to.be.true;
      expect(results.has(40)).to.be.true;
      expect(results.has(60)).to.be.true;
      expect(results.has(80)).to.be.true;
      expect(results.has(100)).to.be.true;

    });


    it("should map on an object", function() {

      let results = underTest.map(obj, function(value) {
        return value * 2;
      });

      expect(results).to.be.deep.equal({ten: 20, twenty: 40, thirty: 60, forty: 80, fifty: 100});

    });


    it("should map on an object with a next method with no defined return type", function() {

     let results = underTest.map(gen(), function(value) {
        return value * 2;
      });

      expect(results).to.be.deep.equal([2, 4, 6, 8, 10]);

    });

    it("should map on an object with a next method with an Object return type", function() {

     let results = underTest.map(genObj(), function(value) {
        return value * 2;
      });

      expect(results).to.be.deep.equal({one: 2, two: 4, three: 6, four: 8, five: 10});

    });


    it("should filter on an object with a next method with a Map return type", function() {

      let results = underTest.map(genMap(), function(value) {
        return value * 2;
      });

      expect(results.constructor).to.be.equal(Map);
      expect(results.size).to.be.equal(5);
      expect(results.get('one')).to.be.equal(2);
      expect(results.get('two')).to.be.equal(4);
      expect(results.get('three')).to.be.equal(6);
      expect(results.get('four')).to.be.equal(8);
      expect(results.get('five')).to.be.equal(10);

    });


    it("should filter on an object with a next method with a Set return type", function() {

      let results = underTest.map(genSet(), function(value) {
        return value * 2;
      });

      expect(results.constructor).to.be.equal(Set);
      expect(results.size).to.be.equal(5);
      expect(results.has(2)).to.be.true;
      expect(results.has(4)).to.be.true;
      expect(results.has(6)).to.be.true;
      expect(results.has(8)).to.be.true;
      expect(results.has(10)).to.be.true;

    });


    it("should handle an empty object", function() {

      let results = underTest.map({}, function(value) {
        return value > 30;
      });

      expect(results).to.be.deep.equal({});

    });

    it("should handle an empty array", function() {

      let results = underTest.map([], function(value) {
        return value > 30;
      });

      expect(results).to.be.deep.equal([]);

    });

    it("should handle an empty Map", function() {

      let results = underTest.map(new Map(), function(value) {
        return value > 30;
      });

      expect(results.constructor).to.be.equal(Map);
      expect(results.size).to.be.equal(0);
    });

    it("should handle an empty Set", function() {

      let results = underTest.map(new Set(), function(value) {
        return value > 30;
      });

      expect(results.constructor).to.be.equal(Set);
      expect(results.size).to.be.equal(0);
    });


  });

  describe("function some", function() {

    it("should some on an array", function() {

      let results = underTest.some(arr, function(value) {
        return value > 30;
      });

      expect(results).to.be.true;

      results = underTest.some(arr, function(value) {
        return value > 100;
      });

      expect(results).to.be.false;

    });

    it("should some on an object", function() {

      let results = underTest.some(obj, function(value) {
        return value > 30;
      });

      expect(results).to.be.true;

      results = underTest.some(obj, function(value) {
        return value > 100;
      });

      expect(results).to.be.false;

    });

    it("should some on an object with a next method", function() {

      let results = underTest.some(gen(), function(value) {
        return value > 3;
      });

      expect(results).to.be.true;

      results = underTest.some(gen(), function(value) {
        return value > 10;
      });

      expect(results).to.be.false;

    });

  });


  describe("function every", function() {

    it("should every on an array", function() {

      let results = underTest.every(arr, function(value) {
        return value > 0;
      });

      expect(results).to.be.true;

      results = underTest.every(arr, function(value) {
        return value > 50;
      });

      expect(results).to.be.false;

    });

    it("should every on an object", function() {

      let results = underTest.every(obj, function(value) {
        return value > 0;
      });

      expect(results).to.be.true;

      results = underTest.every(obj, function(value) {
        return value > 50;
      });

      expect(results).to.be.false;

    });

    it("should every on an object with a next method", function() {

      let results = underTest.every(gen(), function(value) {
        return value > 0;
      });

      expect(results).to.be.true;

      results = underTest.every(gen(), function(value) {
        return value > 3;
      });

      expect(results).to.be.false;

    });

  });


  describe("function indexOf", function() {

    it("should indexOf on an array", function() {

      arr.push(30)

      let results = underTest.indexOf(arr, 30);

      expect(results).to.be.equal(2);

      results = underTest.indexOf(arr, 5000);

      expect(results).to.be.equal(-1);

    });


    it("should indexOf on an object", function() {

      obj['sixty'] = 30;

      let results = underTest.indexOf(obj, 30);

      expect(results).to.be.equal('thirty');

      results = underTest.indexOf(obj, 5000);

      expect(results).to.be.equal(-1);

    });

  });


  describe("function find", function() {

    it("should find on an array", function() {

      let results = underTest.find(arr, function(value) {
        return value > 30;
      });

      expect(results).to.be.equal(40);

      results = underTest.find(arr, function(value) {
        return value > 100;
      });

      expect(results).to.be.undefined;

    });

    it("should find on an object", function() {

      let results = underTest.find(obj, function(value) {
        return value > 30;
      });

      expect(results).to.be.equal(40);

      results = underTest.find(obj, function(value) {
        return value > 100;
      });

      expect(results).to.be.undefined;

    });

    it("should find on an object with a next method", function() {

      let results = underTest.find(gen(), function(value) {
        return value > 3;
      });

      expect(results).to.be.equal(4);

      results = underTest.find(gen(), function(value) {
        return value > 10;
      });

      expect(results).to.be.undefined;

    });

    it("should handle an empty object", function() {

      let results = underTest.find({}, function(value) {
        return value > 30;
      });

      expect(results).to.be.undefined;

    });

    it("should handle an empty array", function() {

      let results = underTest.find([], function(value) {
        return value > 30;
      });

      expect(results).to.be.undefined;

    });


  });


  describe("function findIndex", function() {

    it("should findIndex on an array", function() {

      let results = underTest.findIndex(arr, function(value) {
        return value > 30;
      });

      expect(results).to.be.equal(3);

      results = underTest.findIndex(arr, function(value) {
        return value > 100;
      });

      expect(results).to.be.equal(-1);

    });

    it("should findIndex on an object", function() {

      let results = underTest.findIndex(obj, function(value) {
        return value > 30;
      });

      expect(results).to.be.equal('forty');

      results = underTest.findIndex(obj, function(value) {
        return value > 100;
      });

      expect(results).to.be.equal(-1);

    });

  });



  describe("function lastIndexOf", function() {

    it("should lastIndexOf on an array", function() {

      arr.push(30)

      let results = underTest.lastIndexOf(arr, 30);

      expect(results).to.be.equal(5);

      results = underTest.lastIndexOf(arr, 5000);

      expect(results).to.be.equal(-1);

    });


    it("should lastIndexOf on an object", function() {

      obj['sixty'] = 30;

      let results = underTest.lastIndexOf(obj, 30);

      expect(results).to.be.equal('sixty');

      results = underTest.lastIndexOf(obj, 5000);

      expect(results).to.be.equal(-1);

    });

  });


  describe("function findLast", function() {

    it("should find on an array", function() {

      let results = underTest.findLast(arr, function(value) {
        return value > 30;
      });

      expect(results).to.be.equal(50);

      results = underTest.find(arr, function(value) {
        return value > 100;
      });

      expect(results).to.be.undefined;

    });

    it("should findLast on an object", function() {

      let results = underTest.findLast(obj, function(value) {
        return value > 30;
      });

      expect(results).to.be.equal(50);

      results = underTest.find(obj, function(value) {
        return value > 100;
      });

      expect(results).to.be.undefined;

    });

    it("should findLast on an object with a next method", function() {

      let results = underTest.findLast(gen(), function(value) {
        return value > 3;
      });

      expect(results).to.be.equal(5);

      results = underTest.findLast(gen(), function(value) {
        return value > 10;
      });

      expect(results).to.be.undefined;

    });

  });

  describe("function findLastIndex", function() {

    it("should find on an array", function() {

      let results = underTest.findLastIndex(arr, function(value) {
        return value > 30;
      });

      expect(results).to.be.equal(4);

      results = underTest.findLastIndex(arr, function(value) {
        return value > 100;
      });

      expect(results).to.be.equal(-1);

    });

    it("should findLastIndex on an object", function() {

      let results = underTest.findLastIndex(obj, function(value) {
        return value > 30;
      });

      expect(results).to.be.equal('fifty');

      results = underTest.findLastIndex(obj, function(value) {
        return value > 100;
      });

      expect(results).to.be.equal(-1);

    });


  });



  describe("function reduce", function() {

    it("should reduce on an array", function() {

      let results = underTest.reduce(arr, function(acc, value) {
        return acc + value;
      }, 10);

      expect(results).to.be.equal(160);

      results = underTest.reduce(arr, function(acc, value) {
        return acc + value;
      });

      expect(results).to.be.equal(150);

    });

    it("should an reduce on an object", function() {

      let results = underTest.reduce(obj, function(acc, value, key) {
        return acc + value;
      }, 10);

      expect(results).to.be.equal(160);

      results = underTest.reduce(obj, function(acc, value) {
        return acc + value;
      });

      expect(results).to.be.equal(150);

    });

    it("should an reduce on an object with a next method", function() {

      let results = underTest.reduce(gen, function(acc, value, key) {
        return acc + value;
      }, 10);

      expect(results).to.be.equal(25);

      results = underTest.reduce(gen, function(acc, value) {
        return acc + value;
      });

      expect(results).to.be.equal(15);

    });


    it("should pass the accumulator correctly", function() {

      let spy = fakes.spy();

      underTest.reduce(obj, spy, 0);

      expect(spy.args[0][0]).to.be.equal(0);

    });

    it("should pass the accumulator correctly", function() {

      let spy = fakes.spy();

      underTest.reduce(obj, spy);

      expect(spy.args[0][0]).to.be.equal(10);

    });

    it("should handle an empty object", function() {

      let results = underTest.reduce({}, function(acc, value) {
        return value > 30;
      }, 10);

      expect(results).to.be.deep.equal(10);

    });

    it("should handle an empty array", function() {

      let results = underTest.reduce([], function(acc, value) {
        return value > 30;
      }, 10);

      expect(results).to.be.deep.equal(10);

    });

  });


  describe("function sum", function() {

    it("should sum on an array", function() {

      let results = underTest.sum(arr, 10);

      expect(results).to.be.equal(160);

      results = underTest.sum(arr);

      expect(results).to.be.equal(150);

    });

    it("should an reduce on an object", function() {

      let results = underTest.sum(obj, 10);

      expect(results).to.be.equal(160);

      results = underTest.sum(obj);

      expect(results).to.be.equal(150);

    });

    it("should an reduce on an object with a next method", function() {

      let results = underTest.sum(gen(), 10);

      expect(results).to.be.equal(25);

      results = underTest.sum(gen());

      expect(results).to.be.equal(15);

    });

  });

  describe('function zip', function () {

    it('should zip a bunch of arrays', function () {

      let results = underTest.zip(arr, arr, arr);

      expect(results).to.deep.equal([[10, 10, 10], [20, 20, 20], [30, 30, 30], [40, 40, 40], [50, 50, 50]]);

    });

    it('should zip a bunch of objects', function () {

      let results = underTest.zip(obj, obj, obj);

      expect(results).to.deep.equal({ten: [10, 10, 10], twenty: [20, 20, 20], thirty: [30, 30, 30], forty: [40, 40, 40], fifty: [50, 50, 50]});

    });

    it('should zip a bunch of generators', function () {

      let results = underTest.zip(gen(), gen(), gen());

      expect(results).to.deep.equal([[1, 1, 1], [2, 2, 2], [3, 3, 3], [4, 4, 4], [5, 5, 5]]);

    });

  });


  describe('function chain', function () {

    it('should create an iterator that iterates over all items', function () {

      let c = underTest.chain(arr, obj, gen);

      expect(c.next()).to.be.deep.equal({value:10, done: false});
      expect(c.next()).to.be.deep.equal({value:20, done: false});
      expect(c.next()).to.be.deep.equal({value:30, done: false});
      expect(c.next()).to.be.deep.equal({value:40, done: false});
      expect(c.next()).to.be.deep.equal({value:50, done: false});
      expect(c.next()).to.be.deep.equal({value:10, done: false});
      expect(c.next()).to.be.deep.equal({value:20, done: false});
      expect(c.next()).to.be.deep.equal({value:30, done: false});
      expect(c.next()).to.be.deep.equal({value:40, done: false});
      expect(c.next()).to.be.deep.equal({value:50, done: false});
      expect(c.next()).to.be.deep.equal({value:1, done: false});
      expect(c.next()).to.be.deep.equal({value:2, done: false});
      expect(c.next()).to.be.deep.equal({value:3, done: false});
      expect(c.next()).to.be.deep.equal({value:4, done: false});
      expect(c.next()).to.be.deep.equal({value:5, done: false});
      expect(c.next()).to.be.deep.equal({value:undefined, done: true});

    });

  });


  describe.only('function imap', function () {

    it('should create an iterator that maps over all items of an array', function () {

      let c = underTest.imap(arr, function (v) {
        return v * 2;
      });

      expect(c.next()).to.be.deep.equal({value: [0, 20, Array], done: false});
      expect(c.next()).to.be.deep.equal({value: [1, 40, Array], done: false});
      expect(c.next()).to.be.deep.equal({value: [2, 60, Array], done: false});
      expect(c.next()).to.be.deep.equal({value: [3, 80, Array], done: false});
      expect(c.next()).to.be.deep.equal({value: [4, 100, Array], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});
    });

    it('should create an iterator that maps over all items of an object', function () {

      let c = underTest.imap(obj, function (v) {
        return v * 2;
      });

      expect(c.next()).to.be.deep.equal({value: ['ten', 20, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['twenty', 40, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['thirty', 60, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['forty', 80, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: ['fifty', 100, Object], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });



    it('should create an iterator that maps over all items of a Map', function () {

      let c = underTest.imap(map, function (v) {
        return v * 2;
      });

      expect(c.next()).to.be.deep.equal({value: ['ten', 20, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['twenty', 40, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['thirty', 60, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['forty', 80, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: ['fifty', 100, Map], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });

    it('should create an iterator that maps over all items of a Set', function () {

      let c = underTest.imap(set, function (v) {
        return v * 2;
      });

      expect(c.next()).to.be.deep.equal({value: ['ten', 20, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: ['twenty', 40, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: ['thirty', 60, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: ['forty', 80, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: ['fifty', 100, Set], done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });


    it('should create an iterator that maps over all items of an iterator', function () {

      let c = underTest.imap(gen(), function (v) {
        return v * 2;
      });

      expect(c.next()).to.be.deep.equal({value: 2, done: false});
      expect(c.next()).to.be.deep.equal({value: 4, done: false});
      expect(c.next()).to.be.deep.equal({value: 6, done: false});
      expect(c.next()).to.be.deep.equal({value: 8, done: false});
      expect(c.next()).to.be.deep.equal({value: 10, done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });

  });

  describe('function ifilter', function () {

    it('should create an iterator that filters over all items of an array', function () {

      let c = underTest.ifilter(arr, function (v) {
        return v > 25;
      });

      expect(c.next()).to.be.deep.equal({value: 30, done: false});
      expect(c.next()).to.be.deep.equal({value: 40, done: false});
      expect(c.next()).to.be.deep.equal({value: 50, done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(arr, function (v) {
        return v < 25;
      });

      expect(c.next()).to.be.deep.equal({value: 10, done: false});
      expect(c.next()).to.be.deep.equal({value: 20, done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(arr, function (v) {
        return ((v / 10) % 2 === 0);
      });

      expect(c.next()).to.be.deep.equal({value: 20, done: false});
      expect(c.next()).to.be.deep.equal({value: 40, done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });

    it('should create an iterator that filters over all items of an object', function () {

      let c = underTest.ifilter(obj, function (v) {
        return v > 25;
      });

      expect(c.next()).to.be.deep.equal({value: 30, done: false});
      expect(c.next()).to.be.deep.equal({value: 40, done: false});
      expect(c.next()).to.be.deep.equal({value: 50, done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(obj, function (v) {
        return v < 25;
      });

      expect(c.next()).to.be.deep.equal({value: 10, done: false});
      expect(c.next()).to.be.deep.equal({value: 20, done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(obj, function (v) {
        return ((v / 10) % 2 === 0);
      });

      expect(c.next()).to.be.deep.equal({value: 20, done: false});
      expect(c.next()).to.be.deep.equal({value: 40, done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });


    it('should create an iterator that filters over all items of an iterator', function () {

      let c = underTest.ifilter(gen(), function (v) {
        return v > 2;
      });

      expect(c.next()).to.be.deep.equal({value: 3, done: false});
      expect(c.next()).to.be.deep.equal({value: 4, done: false});
      expect(c.next()).to.be.deep.equal({value: 5, done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(gen(), function (v) {
        return v < 3;
      });

      expect(c.next()).to.be.deep.equal({value: 1, done: false});
      expect(c.next()).to.be.deep.equal({value: 2, done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

      c = underTest.ifilter(gen(), function (v) {
        return (v % 2 === 0);
      });

      expect(c.next()).to.be.deep.equal({value: 2, done: false});
      expect(c.next()).to.be.deep.equal({value: 4, done: false});
      expect(c.next()).to.be.deep.equal({value: undefined, done: true});

    });

  });


  it( 'function invoke', function() {
    expect( underTest.invoke( [1, 2, 3, 4, 5], 'toFixed', 2 ) ).to.deep.equal( ['1.00', '2.00', '3.00', '4.00', '5.00'] );
    expect( underTest.invoke( [1, 2, 3, 4, 5, 6, 7], 'toString', 2 ) ).to.deep.equal( ['1', '10', '11', '100', '101', '110', '111'] );

  } );


  it( 'function pluck', function() {
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


  describe("function takeWhile", function() {

    it("should takeWhile on an array", function() {

      let results = underTest.takeWhile(arr, function (v) {
        return v < 40;
      });

      expect(results).to.deep.equal([10, 20, 30]);

      results = underTest.takeWhile(arr, function (v) {
        return v < 100;
      });

      expect(results).to.deep.equal([10, 20, 30, 40, 50]);

      results = underTest.takeWhile(arr, function (v) {
        return v < 10;
      });

      expect(results).to.deep.equal([]);


    });

    it("should takeWhile on an object", function() {

      let results = underTest.takeWhile(obj, function (v, k) {
        return v < 40;
      });

      expect(results).to.deep.equal({ten: 10, twenty: 20, thirty: 30});

      results = underTest.takeWhile(obj, function (v, k) {
        return v < 100;
      });

      expect(results).to.deep.equal({ten: 10, twenty: 20, thirty: 30, forty: 40, fifty: 50});

      results = underTest.takeWhile(obj, function (v, k) {
        return v < 10;
      });

      expect(results).to.deep.equal({});

    });

    it("should takeWhile on an object with a next method", function() {

      let results = underTest.takeWhile(gen, function (v, k) {
        return v < 4;
      });

      expect(results).to.deep.equal([1, 2 ,3]);

      results = underTest.takeWhile(gen, function (v, k) {
        return v < 10;
      });

      expect(results).to.deep.equal([1, 2 ,3, 4, 5]);

      results = underTest.takeWhile(gen, function (v, k) {
        return v < 1;
      });

      expect(results).to.deep.equal([]);

    });

  });

  describe("function dropWhile", function() {

    it("should dropWhile on an array", function() {

      let results = underTest.dropWhile(arr, function (v) {
        return v < 40;
      });

      expect(results).to.deep.equal([40, 50]);

      results = underTest.dropWhile(arr, function (v) {
        return v < 100;
      });

      expect(results).to.deep.equal([]);

      results = underTest.dropWhile(arr, function (v) {
        return v < 10;
      });

      expect(results).to.deep.equal([10, 20, 30, 40, 50]);


    });

    it("should dropWhile on an object", function() {

      let results = underTest.dropWhile(obj, function (v, k) {
        return v < 40;
      });

      expect(results).to.deep.equal({forty: 40, fifty: 50});

      results = underTest.dropWhile(obj, function (v, k) {
        return v < 100;
      });

      expect(results).to.deep.equal({});

      results = underTest.dropWhile(obj, function (v, k) {
        return v < 10;
      });

      expect(results).to.deep.equal({ten: 10, twenty: 20, thirty: 30, forty: 40, fifty: 50});

    });

    it("should dropWhile on an object with a next method", function() {

      let results = underTest.dropWhile(gen, function (v, k) {
        return v < 4;
      });

      expect(results).to.deep.equal([4, 5]);

      results = underTest.dropWhile(gen, function (v, k) {
        return v < 10;
      });

      expect(results).to.deep.equal([]);

      results = underTest.dropWhile(gen, function (v, k) {
        return v < 1;
      });

      expect(results).to.deep.equal([1, 2 ,3, 4, 5]);

    });

  });


});