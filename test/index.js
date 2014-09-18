var assert = require("assert");
var sinon = require("sinon");
var underTest = require("../iter");

var expect = require( 'chai' ).expect;

var arr;
var obj;
var gen;
var fakes;
var genString;

describe("test iter module: ", function() {


  beforeEach(function() {

    fakes = sinon.sandbox.create();

    arr = [10, 20, 30, 40, 50];

    obj = {
      ten: 10,
      twenty: 20,
      thirty: 30,
      forty: 40,
      fifty: 50
    }
    gen = function (six) {
      var a = [1, 2, 3, 4, 5];
      if (six) a.push(3);
      var i = 0;
      return {
        next: function () {
          return {
            value: [a.shift(), i++],
            done: !!(!a.length)
          }
        }
      }
    }

    genString = function (six) {
      var a = {one: 1, two: 2, three: 3, four: 4, five: 5};
      if (six) a['six'] = 3;
      var i = 0;
      var keys = Object.keys(a);
      return {
        next: function () {
          return {
            value: [a[keys[i]], keys[i++]],
            done: i === keys.length
          }
        }
      }
    }


  });

  afterEach(function() {

    arr = null;
    obj = null;
    gen = null;
    fakes.restore();

  });


  describe('function iterator', function () {

    it('should return an iterable object from on an array', function () {

      var it = underTest.iterator(arr);
      expect(it.next()).to.be.deep.equal({value: [10, 0], done: false});
      expect(it.next()).to.be.deep.equal({value: [20, 1], done: false});
      expect(it.next()).to.be.deep.equal({value: [30, 2], done: false});
      expect(it.next()).to.be.deep.equal({value: [40, 3], done: false});
      expect(it.next()).to.be.deep.equal({value: [50, 4], done: true});

    });

    it('should return an iterable object from on an object ', function () {

      var it = underTest.iterator(obj);
      expect(it.next()).to.be.deep.equal({value: [10, "ten"], done: false});
      expect(it.next()).to.be.deep.equal({value: [20, "twenty"], done: false});
      expect(it.next()).to.be.deep.equal({value: [30, "thirty"], done: false});
      expect(it.next()).to.be.deep.equal({value: [40, "forty"], done: false});
      expect(it.next()).to.be.deep.equal({value: [50, "fifty"], done: true});

    });

    it('should return the iterable object if it is already an iterarable object', function () {

      var it = gen();
      expect(it).to.be.equal(underTest.iterator(it));

    });

    it('should return an iterable object from the return of a function', function () {

      var it = underTest.iterator(gen);
      expect(it.next()).to.be.deep.equal({value: [1, 0], done: false});
      expect(it.next()).to.be.deep.equal({value: [2, 1], done: false});
      expect(it.next()).to.be.deep.equal({value: [3, 2], done: false});
      expect(it.next()).to.be.deep.equal({value: [4, 3], done: false});
      expect(it.next()).to.be.deep.equal({value: [5, 4], done: true});

    });


  });


  describe("function forEach", function() {

    it("should iterate over on an array", function() {

      var spy = sinon.spy();
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


    it("should iterate over on an object", function() {

      var spy = sinon.spy();
      underTest.forEach({
        ten: 10,
        twenty: 20,
        thirty: 30,
        forty: 40,
        fifty: 50
      }, spy);

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


    it("should iterate over on an object with a next() method", function() {

      var spy = sinon.spy();
      underTest.forEach(gen(), spy);

      expect(5, spy.callCount);

      expect(1).to.be.equal(spy.args[0][0]);
      expect(2).to.be.equal(spy.args[1][0]);
      expect(3).to.be.equal(spy.args[2][0]);
      expect(4).to.be.equal(spy.args[3][0]);
      expect(5).to.be.equal(spy.args[4][0]);

    });


    it("should delegate to Array.prototype.forEach", function() {

      var spy = sinon.spy();
      var forEachSpy = fakes.spy(Array.prototype, "forEach");
      underTest.forEach(arr, spy);

      expect(1, forEachSpy.callCount);
      expect(5, spy.callCount);

    });

  });


  describe("function filter", function() {

    it("should filter on an array", function() {

      var results = underTest.filter(arr, function(value) {
        return value < 30;
      });

      expect(results).to.be.deep.equal([10, 20]);

    });


    it("should filter on an object", function() {

      var results = underTest.filter(obj, function(value) {
        return value < 30;
      });

      expect(results).to.be.deep.equal({ten: 10, twenty: 20});

    });

    it("should filter on an object with a next method", function() {

      var results = underTest.filter(gen(), function(value) {
        return value < 3;
      });

      expect(results).to.be.deep.equal([1, 2]);

    });

    it("should filter on an object with a next method with string keys", function() {

      var results = underTest.filter(genString(), function(value) {
        return value < 3;
      });

      expect(results).to.be.deep.equal({one: 1, two: 2});

    });

    it("should handle an empty object", function() {

      var results = underTest.filter({}, function(value) {
        return value > 30;
      });

      expect(results).to.be.deep.equal({});

    });

    it("should handle an empty array", function() {

      var results = underTest.filter([], function(value) {
        return value > 30;
      });

      expect(results).to.be.deep.equal([]);

    });

  });


  describe("function map", function() {

    it("should map on an array", function() {

      var results = underTest.map(arr, function(value) {
        return value * 2;
      });

      expect(results).to.be.deep.equal([20, 40, 60, 80, 100]);

    });


    it("should map on an object", function() {

      var results = underTest.map(obj, function(value) {
        return value * 2;
      });

      expect(results).to.be.deep.equal({ten: 20, twenty: 40, thirty: 60, forty: 80, fifty: 100});

    });


    it("should map on an object with a next method", function() {

     var results = underTest.map(gen(), function(value) {
        return value * 2;
      });

      expect(results).to.be.deep.equal([2, 4, 6, 8, 10]);

    });

    it("should map on an object with a next method with string keys", function() {

     var results = underTest.map(genString(), function(value) {
        return value * 2;
      });

      expect(results).to.be.deep.equal({one: 2, two: 4, three: 6, four: 8, five: 10});

    });

    it("should handle an empty object", function() {

      var results = underTest.map({}, function(value) {
        return value > 30;
      });

      expect(results).to.be.deep.equal({});

    });

    it("should handle an empty array", function() {

      var results = underTest.map([], function(value) {
        return value > 30;
      });

      expect(results).to.be.deep.equal([]);

    });
  });

  describe("function some", function() {

    it("should some on an array", function() {

      var results = underTest.some(arr, function(value) {
        return value > 30;
      });

      expect(results).to.be.true;

      results = underTest.some(arr, function(value) {
        return value > 100;
      });

      expect(results).to.be.false;

    });

    it("should some on an object", function() {

      var results = underTest.some(obj, function(value) {
        return value > 30;
      });

      expect(results).to.be.true;

      results = underTest.some(obj, function(value) {
        return value > 100;
      });

      expect(results).to.be.false;

    });

    it("should some on an object with a next method", function() {

      var results = underTest.some(gen(), function(value) {
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

      var results = underTest.every(arr, function(value) {
        return value > 0;
      });

      expect(results).to.be.true;

      results = underTest.every(arr, function(value) {
        return value > 50;
      });

      expect(results).to.be.false;

    });

    it("should every on an object", function() {

      var results = underTest.every(obj, function(value) {
        return value > 0;
      });

      expect(results).to.be.true;

      results = underTest.every(obj, function(value) {
        return value > 50;
      });

      expect(results).to.be.false;

    });

    it("should every on an object with a next method", function() {

      var results = underTest.every(gen(), function(value) {
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

      var results = underTest.indexOf(arr, 30);

      expect(results).to.be.equal(2);

      results = underTest.indexOf(arr, 5000);

      expect(results).to.be.equal(-1);

    });


    it("should indexOf on an object", function() {

      obj['sixty'] = 30;

      var results = underTest.indexOf(obj, 30);

      expect(results).to.be.equal('thirty');

      results = underTest.indexOf(obj, 5000);

      expect(results).to.be.equal(-1);

    });


    it("should indexOf on an object with next method", function() {

      var results = underTest.indexOf(gen(true), 3);

      expect(results).to.be.equal(2);

      results = underTest.indexOf(obj, 5000);

      expect(results).to.be.equal(-1);

    });


    it("should indexOf on an object with next method with a string key", function() {

      var results = underTest.indexOf(genString(true), 3);

      expect(results).to.be.equal('three');

      results = underTest.indexOf(genString(true), 5000);

      expect(results).to.be.equal(-1);

    });


  });


  describe("function find", function() {

    it("should find on an array", function() {

      var results = underTest.find(arr, function(value) {
        return value > 30;
      });

      expect(results).to.be.equal(40);

      results = underTest.find(arr, function(value) {
        return value > 100;
      });

      expect(results).to.be.undefined;

    });

    it("should find on an object", function() {

      var results = underTest.find(obj, function(value) {
        return value > 30;
      });

      expect(results).to.be.equal(40);

      results = underTest.find(obj, function(value) {
        return value > 100;
      });

      expect(results).to.be.undefined;

    });

    it("should find on an object with a next method", function() {

      var results = underTest.find(gen(), function(value) {
        return value > 3;
      });

      expect(results).to.be.equal(4);

      results = underTest.find(gen(), function(value) {
        return value > 10;
      });

      expect(results).to.be.undefined;

    });

    it("should handle an empty object", function() {

      var results = underTest.find({}, function(value) {
        return value > 30;
      });

      expect(results).to.be.undefined;

    });

    it("should handle an empty array", function() {

      var results = underTest.find([], function(value) {
        return value > 30;
      });

      expect(results).to.be.undefined;

    });


  });


  describe("function findIndex", function() {

    it("should findIndex on an array", function() {

      var results = underTest.findIndex(arr, function(value) {
        return value > 30;
      });

      expect(results).to.be.equal(3);

      results = underTest.findIndex(arr, function(value) {
        return value > 100;
      });

      expect(results).to.be.equal(-1);

    });

    it("should findIndex on an object", function() {

      var results = underTest.findIndex(obj, function(value) {
        return value > 30;
      });

      expect(results).to.be.equal('forty');

      results = underTest.findIndex(obj, function(value) {
        return value > 100;
      });

      expect(results).to.be.equal(-1);

    });


    it("should findIndex on an object with next method", function() {

      var results = underTest.findIndex(gen(true), function(value) {
        return value > 2;
      });

      expect(results).to.be.equal(2);

      results = underTest.findIndex(obj, function (value) {
        return value > 100;
      });

      expect(results).to.be.equal(-1);

    });


    it("should findIndex on an object with next method with a string key", function() {

      var results = underTest.findIndex(genString(true), function(value) {
        return value > 2;
      });

      expect(results).to.be.equal('three');

      results = underTest.findIndex(obj, function (value) {
        return value > 100;
      });

      expect(results).to.be.equal(-1);

    });


  });



  describe("function lastIndexOf", function() {

    it("should lastIndexOf on an array", function() {

      arr.push(30)

      var results = underTest.lastIndexOf(arr, 30);

      expect(results).to.be.equal(5);

      results = underTest.lastIndexOf(arr, 5000);

      expect(results).to.be.equal(-1);

    });


    it("should lastIndexOf on an object", function() {

      obj['sixty'] = 30;

      var results = underTest.lastIndexOf(obj, 30);

      expect(results).to.be.equal('sixty');

      results = underTest.lastIndexOf(obj, 5000);

      expect(results).to.be.equal(-1);

    });

    it("should lastIndexOf on an object with next method", function() {

      var results = underTest.lastIndexOf(gen(true), 3);

      expect(results).to.be.equal(5);

      results = underTest.lastIndexOf(obj, 5000);

      expect(results).to.be.equal(-1);

    });

    it("should lastIndexOf on an object with next method with a string", function() {

      var results = underTest.lastIndexOf(genString(true), 3);

      expect(results).to.be.equal('six');

      results = underTest.lastIndexOf(genString(true), 5000);

      expect(results).to.be.equal(-1);

    });


  });


  describe("function findLast", function() {

    it("should find on an array", function() {

      var results = underTest.findLast(arr, function(value) {
        return value > 30;
      });

      expect(results).to.be.equal(50);

      results = underTest.find(arr, function(value) {
        return value > 100;
      });

      expect(results).to.be.undefined;

    });

    it("should findLast on an object", function() {

      var results = underTest.findLast(obj, function(value) {
        return value > 30;
      });

      expect(results).to.be.equal(50);

      results = underTest.find(obj, function(value) {
        return value > 100;
      });

      expect(results).to.be.undefined;

    });

    it("should findLast on an object with a next method", function() {

      var results = underTest.findLast(gen(), function(value) {
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

      var results = underTest.findLastIndex(arr, function(value) {
        return value > 30;
      });

      expect(results).to.be.equal(4);

      results = underTest.findLastIndex(arr, function(value) {
        return value > 100;
      });

      expect(results).to.be.equal(-1);

    });

    it("should findLastIndex on an object", function() {

      var results = underTest.findLastIndex(obj, function(value) {
        return value > 30;
      });

      expect(results).to.be.equal('fifty');

      results = underTest.findLastIndex(obj, function(value) {
        return value > 100;
      });

      expect(results).to.be.equal(-1);

    });

    it("should findLastIndex on an object with next method", function() {

      var results = underTest.findLastIndex(gen(true), function(value) {
        return value > 2;
      });

      expect(results).to.be.equal(5);

      results = underTest.findLastIndex(obj, function (value) {
        return value > 100;
      });

      expect(results).to.be.equal(-1);

    });


    it("should findLastIndex on an object with next method with a string key", function() {

      var results = underTest.findLastIndex(genString(true), function(value, k) {
        return value === 3;
      });

      expect(results).to.be.equal('six');

      results = underTest.findLastIndex(obj, function (value) {
        return value > 100;
      });

      expect(results).to.be.equal(-1);

    });

  });



  describe("function reduce", function() {

    it("should reduce on an array", function() {

      var results = underTest.reduce(arr, function(acc, value) {
        return acc + value;
      }, 10);

      expect(results).to.be.equal(160);

      results = underTest.reduce(arr, function(acc, value) {
        return acc + value;
      });

      expect(results).to.be.equal(150);

    });

    it("should an reduce on an object", function() {

      var results = underTest.reduce(obj, function(acc, value, key) {
        return acc + value;
      }, 10);

      expect(results).to.be.equal(160);

      results = underTest.reduce(obj, function(acc, value) {
        return acc + value;
      });

      expect(results).to.be.equal(150);

    });

    it("should an reduce on an object with a next method", function() {

      var results = underTest.reduce(gen, function(acc, value, key) {
        return acc + value;
      }, 10);

      expect(results).to.be.equal(25);

      results = underTest.reduce(gen, function(acc, value) {
        return acc + value;
      });

      expect(results).to.be.equal(15);

    });


    it("should pass the accumulator correctly", function() {

      var spy = fakes.spy();

      underTest.reduce(obj, spy, 0);

      expect(spy.args[0][0]).to.be.equal(0);

    });

    it("should pass the accumulator correctly", function() {

      var spy = fakes.spy();

      underTest.reduce(obj, spy);

      expect(spy.args[0][0]).to.be.equal(10);

    });

    it("should handle an empty object", function() {

      var results = underTest.reduce({}, function(acc, value) {
        return value > 30;
      }, 10);

      expect(results).to.be.deep.equal(10);

    });

    it("should handle an empty array", function() {

      var results = underTest.reduce([], function(acc, value) {
        return value > 30;
      }, 10);

      expect(results).to.be.deep.equal(10);

    });

  });


  describe("function sum", function() {

    it("should sum on an array", function() {

      var results = underTest.sum(arr, 10);

      expect(results).to.be.equal(160);

      results = underTest.sum(arr);

      expect(results).to.be.equal(150);

    });

    it("should an reduce on an object", function() {

      var results = underTest.sum(obj, 10);

      expect(results).to.be.equal(160);

      results = underTest.sum(obj);

      expect(results).to.be.equal(150);

    });

    it("should an reduce on an object with a next method", function() {

      var results = underTest.sum(gen(), 10);

      expect(results).to.be.equal(25);

      results = underTest.sum(gen());

      expect(results).to.be.equal(15);

    });

  });

  describe('function zip', function () {

    it('should zip a bunch of arrays', function () {

      var results = underTest.zip(arr, arr, arr);

      expect(results).to.deep.equal([[10, 10, 10], [20, 20, 20], [30, 30, 30], [40, 40, 40], [50, 50, 50]]);

    });

    it('should zip a bunch of objects', function () {

      var results = underTest.zip(obj, obj, obj);

      expect(results).to.deep.equal({ten: [10, 10, 10], twenty: [20, 20, 20], thirty: [30, 30, 30], forty: [40, 40, 40], fifty: [50, 50, 50]});

    });

    it('should zip a bunch of generators', function () {

      var results = underTest.zip(gen(), gen(), gen());

      expect(results).to.deep.equal([[1, 1, 1], [2, 2, 2], [3, 3, 3], [4, 4, 4], [5, 5, 5]]);

    });

    it('should zip a bunch of generators with string keys', function () {

      var results = underTest.zip(genString(), genString(), genString());

      expect(results).to.deep.equal({one: [1, 1, 1], two: [2, 2, 2], three: [3, 3, 3], four: [4, 4, 4], five: [5, 5, 5]});

    });

  });


  describe('function chain', function () {

    it('should create an iterator that iterates over all items', function () {

      var c = underTest.chain([arr, obj, gen]);

      expect(c.next()).to.be.deep.equal({value:[10, 0], done: false});
      expect(c.next()).to.be.deep.equal({value:[20, 1], done: false});
      expect(c.next()).to.be.deep.equal({value:[30, 2], done: false});
      expect(c.next()).to.be.deep.equal({value:[40, 3], done: false});
      expect(c.next()).to.be.deep.equal({value:[50, 4], done: false});
      expect(c.next()).to.be.deep.equal({value:[10, "ten"], done: false});
      expect(c.next()).to.be.deep.equal({value:[20, "twenty"], done: false});
      expect(c.next()).to.be.deep.equal({value:[30, "thirty"], done: false});
      expect(c.next()).to.be.deep.equal({value:[40, "forty"], done: false});
      expect(c.next()).to.be.deep.equal({value:[50, "fifty"], done: false});
      expect(c.next()).to.be.deep.equal({value:[1, 0], done: false});
      expect(c.next()).to.be.deep.equal({value:[2, 1], done: false});
      expect(c.next()).to.be.deep.equal({value:[3, 2], done: false});
      expect(c.next()).to.be.deep.equal({value:[4, 3], done: false});
      expect(c.next()).to.be.deep.equal({value:[5, 4], done: true});

    });

  });


  describe('function imap', function () {

    it('should create an iterator that maps over all items of an array', function () {

      var c = underTest.imap(arr, function (v) {
        return v * 2;
      });

      expect(c.next()).to.be.deep.equal({value: [20, 0], done: false});
      expect(c.next()).to.be.deep.equal({value: [40, 1], done: false});
      expect(c.next()).to.be.deep.equal({value: [60, 2], done: false});
      expect(c.next()).to.be.deep.equal({value: [80, 3], done: false});
      expect(c.next()).to.be.deep.equal({value: [100, 4], done: true});

    });

    it('should create an iterator that maps over all items of an object', function () {

      var c = underTest.imap(obj, function (v) {
        return v * 2;
      });

      expect(c.next()).to.be.deep.equal({value: [20, "ten"], done: false});
      expect(c.next()).to.be.deep.equal({value: [40, "twenty"], done: false});
      expect(c.next()).to.be.deep.equal({value: [60, "thirty"], done: false});
      expect(c.next()).to.be.deep.equal({value: [80, "forty"], done: false});
      expect(c.next()).to.be.deep.equal({value: [100, "fifty"], done: true});

    });


    it('should create an iterator that maps over all items of an iterator', function () {

      var c = underTest.imap(gen(), function (v) {
        return v * 2;
      });

      expect(c.next()).to.be.deep.equal({value: [2, 0], done: false});
      expect(c.next()).to.be.deep.equal({value: [4, 1], done: false});
      expect(c.next()).to.be.deep.equal({value: [6, 2], done: false});
      expect(c.next()).to.be.deep.equal({value: [8, 3], done: false});
      expect(c.next()).to.be.deep.equal({value: [10, 4], done: true});

    });

  });

  describe('function ifilter', function () {

    it('should create an iterator that filters over all items of an array', function () {

      var c = underTest.ifilter(arr, function (v) {
        return v > 25;
      });

      expect(c.next()).to.be.deep.equal({value: [30, 2], done: false});
      expect(c.next()).to.be.deep.equal({value: [40, 3], done: false});
      expect(c.next()).to.be.deep.equal({value: [50, 4], done: true});

      c = underTest.ifilter(arr, function (v) {
        return v < 25;
      });

      expect(c.next()).to.be.deep.equal({value: [10, 0], done: false});
      expect(c.next()).to.be.deep.equal({value: [20, 1], done: true});

      c = underTest.ifilter(arr, function (v) {
        return ((v / 10) % 2 === 0);
      });

      expect(c.next()).to.be.deep.equal({value: [20, 1], done: false});
      expect(c.next()).to.be.deep.equal({value: [40, 3], done: true});

    });

    it('should create an iterator that filters over all items of an object', function () {

      var c = underTest.ifilter(obj, function (v) {
        return v > 25;
      });

      expect(c.next()).to.be.deep.equal({value: [30, "thirty"], done: false});
      expect(c.next()).to.be.deep.equal({value: [40, "forty"], done: false});
      expect(c.next()).to.be.deep.equal({value: [50, "fifty"], done: true});

      c = underTest.ifilter(obj, function (v) {
        return v < 25;
      });

      expect(c.next()).to.be.deep.equal({value: [10, "ten"], done: false});
      expect(c.next()).to.be.deep.equal({value: [20, "twenty"], done: true});

      c = underTest.ifilter(obj, function (v) {
        return ((v / 10) % 2 === 0);
      });

      expect(c.next()).to.be.deep.equal({value: [20, "twenty"], done: false});
      expect(c.next()).to.be.deep.equal({value: [40, "forty"], done: true});

    });


    it('should create an iterator that filters over all items of an iterator', function () {

      var c = underTest.ifilter(gen(), function (v) {
        return v > 2;
      });

      expect(c.next()).to.be.deep.equal({value: [3, 2], done: false});
      expect(c.next()).to.be.deep.equal({value: [4, 3], done: false});
      expect(c.next()).to.be.deep.equal({value: [5, 4], done: true});

      c = underTest.ifilter(gen(), function (v) {
        return v < 3;
      });

      expect(c.next()).to.be.deep.equal({value: [1, 0], done: false});
      expect(c.next()).to.be.deep.equal({value: [2, 1], done: true});

      c = underTest.ifilter(gen(), function (v) {
        return (v % 2 === 0);
      });

      expect(c.next()).to.be.deep.equal({value: [2, 1], done: false});
      expect(c.next()).to.be.deep.equal({value: [4, 3], done: true});

    });

  });


  // it( 'function invoke', function() {
  //   expect( iter.invoke( [1, 2, 3, 4, 5], 'toFixed', 2 ) ).to.deep.equal( ['1.00', '2.00', '3.00', '4.00', '5.00'] );
  //   expect( iter.invoke( [1, 2, 3, 4, 5, 6, 7], 'toString', 2 ) ).to.deep.equal( ['1', '10', '11', '100', '101', '110', '111'] );

  // } );


  // it( 'function pluck', function() {
  //   var data = [{ data : { value : 'foo' } }, { data : { value : 'bar' } }, {}, { value : 'blim' }, { data : { value : 'blam' } }];
  //   expect( iter.pluck( data, 'data.value' ) ).to.deep.equal( ["foo", "bar", undefined, undefined, "blam"] );

  //   expect( iter.pluck( data, 'data.value', true ) ).to.deep.equal( ["foo", "bar", "blam"] );

  //   expect( iter.pluck( [
  //     { 'one' : 1, 'two' : 2, 'three' : 3 },
  //     { 'one' : 1, 'two' : 2, 'three' : 3 },
  //     { 'one' : 1, 'two' : 2, 'three' : 3 }
  //   ], 'two' ) ).to.deep.equal( [2, 2, 2] );

  //   expect( iter.pluck( [
  //     { 'one' : 1,         'two' : 2, 'three' : 3 },
  //     { 'one' : undefined, 'two' : 2, 'three' : 3 },
  //     { 'one' : 1,         'two' : 2, 'three' : 3 },
  //     { 'one' : null,      'two' : 2, 'three' : 3 },
  //     { 'one' : 1,         'two' : 2, 'three' : 3 }
  //   ], 'one', true ) ).to.deep.equal( [1, 1, 1] );

  //   expect( iter.pluck( iter.pluck( [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map( function( o, i ) {
  //     return { src : { val : i } };
  //   } ), 'src' ), 'val' ) ).to.deep.equal( [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] );

  //   expect( iter.pluck( iter.pluck( iter.pluck( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map( function( o, i ) {
  //     return { src : { val : { id : i % 2 ? i : null } } };
  //   } ), 'src' ), 'val' ), 'id', true ) ).to.deep.equal( [1, 3, 5, 7, 9] );

  //   expect( iter.pluck( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map( function( o, i ) {
  //     return { src : { val : i } };
  //   } ), 'src.val' ) ).to.deep.equal( [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] );

  //   expect( iter.pluck( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map( function( o, i ) {
  //     return { src : { val : { id : i % 2 ? i : null } } };
  //   } ), 'src.val.id', true ) ).to.deep.equal( [1, 3, 5, 7, 9] );

  // } );
});

