var assert = require("assert");
var sinon = require("sinon");
var underTest = require("../iter");

var expect = require( 'chai' ).expect;

var arr;
var obj;
var gen;
var fakes;

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
    gen = function () {
      var a = [1, 2, 3, 4, 5];
      return {
        next: function () {
          return {
            value: a.shift(),
            done: !!(!a.length)
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
      expect(it.next()).to.be.deep.equal({value: 10, done: false});
      expect(it.next()).to.be.deep.equal({value: 20, done: false});
      expect(it.next()).to.be.deep.equal({value: 30, done: false});
      expect(it.next()).to.be.deep.equal({value: 40, done: false});
      expect(it.next()).to.be.deep.equal({value: 50, done: true});

    });

    it('should return an iterable object from on an object ', function () {

      var it = underTest.iterator(obj);
      expect(it.next()).to.be.deep.equal({value: 10, done: false});
      expect(it.next()).to.be.deep.equal({value: 20, done: false});
      expect(it.next()).to.be.deep.equal({value: 30, done: false});
      expect(it.next()).to.be.deep.equal({value: 40, done: false});
      expect(it.next()).to.be.deep.equal({value: 50, done: true});

    });

    it('should return the iterable object if it is already an iterarable object', function () {

      var it = gen();
      expect(it).to.be.equal(underTest.iterator(it));

    });

    it('should return an iterable object from the return of a function', function () {

      var it = underTest.iterator(gen);
      expect(it.next()).to.be.deep.equal({value: 1, done: false});
      expect(it.next()).to.be.deep.equal({value: 2, done: false});
      expect(it.next()).to.be.deep.equal({value: 3, done: false});
      expect(it.next()).to.be.deep.equal({value: 4, done: false});
      expect(it.next()).to.be.deep.equal({value: 5, done: true});

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

      var results = underTest.indexOf(arr, 30);

      expect(results).to.be.equal(2);

      results = underTest.indexOf(arr, 5000);

      expect(results).to.be.equal(-1);

    });


    it("should indexOf on an object", function() {

      var results = underTest.indexOf(obj, 30);

      expect(results).to.be.equal('thirty');

      results = underTest.indexOf(obj, 5000);

      expect(results).to.be.equal(-1);

    });


    it("should throw an exception for on an object with next method", function() {

      var err;

      try {

        underTest.indexOf(gen(), 3);
      }
      catch (e) {
        err = e;
      }

      expect(err).to.be.instanceOf(Error);

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


    it("should throw an exception for an object with next method", function() {

      var err;

      try {

        underTest.findIndex(gen(), function (){});
      }
      catch (e) {
        err = e;
      }

      expect(err).to.be.instanceOf(Error);

    });

  });



  // describe("function reduce", function() {

  //   it("should an reduce on an array to a value", function() {

  //     var freduce = fakes.spy(Array.prototype, "reduce"),
  //         results;

  //     results = reduce([0, 1, 2, 3, 4], function(acc, value) {
  //       return acc + value;
  //     }, 10);

  //     expect(1, freduce.callCount);
  //     expect(20, results);

  //   });

  //   it("should an reduce on an object to a value", function() {

  //     var results;

  //     results = reduce({a:0, b:1, c:2, d:3, e:4}, function(acc, value, key) {
  //       return acc + value;
  //     }, 10);

  //     expect(20, results);

  //   });

  //   it("should pass the accumulator correctly", function() {

  //     var spy = fakes.spy();

  //     reduce({a:10, b:20, c:20, d:30, e:40}, spy, 0);

  //     expect(spy.args[0][0], 0);

  //   });

  //   it("should pass the accumulator correctly", function() {

  //     var spy = fakes.spy();

  //     reduce({a:0, b:1, c:2, d:3, e:4}, spy);

  //     expect(spy.args[0][0][0], 0);
  //     expect(spy.args[0][0][1], 'a');
  //   });



  // });


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

