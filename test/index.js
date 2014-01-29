var assert = require("assert"),
    sinon = require("sinon"),
    iter = require("../iter"),
    exhaust = iter.exhaust,
    forEach = iter.forEach,
    map = iter.map,
    filter = iter.filter,
    reduce = iter.reduce,
    StopIteration = iter.StopIteration,
    fakes,
    expect = require( 'chai' ).expect;


describe("test iter module: ", function() {


  beforeEach(function() {

    fakes = sinon.sandbox.create();

  });

  afterEach(function() {

    fakes.restore();

  });

  describe("function exhaust", function() {

    it("should iterate over an array", function() {

      var spy = sinon.spy();
      exhaust([10, 20, 30, 40, 50], spy);

      assert.equal(5, spy.callCount);

      assert.equal(10, spy.args[0][0]);
      assert.equal(0, spy.args[0][1]);
      assert.equal(20, spy.args[1][0]);
      assert.equal(1, spy.args[1][1]);
      assert.equal(30, spy.args[2][0]);
      assert.equal(2, spy.args[2][1]);
      assert.equal(40, spy.args[3][0]);
      assert.equal(3, spy.args[3][1]);
      assert.equal(50, spy.args[4][0]);
      assert.equal(4, spy.args[4][1]);

    });


    it("should iterate over an object", function() {

      var spy = sinon.spy();
      exhaust({
        ten: 10,
        twenty: 20,
        thirty: 30,
        forty: 40,
        fifty: 50
      }, spy);

      assert.equal(5, spy.callCount);

      assert.equal(10, spy.args[0][0]);
      assert.equal("ten", spy.args[0][1]);
      assert.equal(20, spy.args[1][0]);
      assert.equal("twenty", spy.args[1][1]);
      assert.equal(30, spy.args[2][0]);
      assert.equal("thirty", spy.args[2][1]);
      assert.equal(40, spy.args[3][0]);
      assert.equal("forty", spy.args[3][1]);
      assert.equal(50, spy.args[4][0]);
      assert.equal("fifty", spy.args[4][1]);

    });


    it("should iterate over an object with a next() method", function() {

      var spy = sinon.spy();
      exhaust({
        ten: 10,
        twenty: 20,
        thirty: 30,
        forty: 40,
        fifty: 50,
        keys: ["ten", "twenty", "thirty", "fifty"],
        next: function () {
          var key = this.keys.shift();
          if (this[key]) return [this[key], key];
          throw StopIteration;
        }
      }, spy);

      assert.equal(4, spy.callCount);

      assert.equal(10, spy.args[0][0]);
      assert.equal("ten", spy.args[0][1]);
      assert.equal(20, spy.args[1][0]);
      assert.equal("twenty", spy.args[1][1]);
      assert.equal(30, spy.args[2][0]);
      assert.equal("thirty", spy.args[2][1]);
      assert.equal(50, spy.args[3][0]);
      assert.equal("fifty", spy.args[3][1]);

    });

  });


  describe("function forEach", function() {

    it("should delegate to Array.prototype.forEach", function() {

      var spy = sinon.spy(),
          fforEach = fakes.spy(Array.prototype, "forEach");
      forEach([0, 1, 2, 3, 4], spy);

      assert.equal(1, fforEach.callCount);
      assert.equal(5, spy.callCount);

    });

  });


  describe("function filter", function() {

    it("should delegate to Array.prototype.filter", function() {

      var ffilter = fakes.spy(Array.prototype, "filter"),
          results;

      results = filter([0, 1, 2, 3, 4], function(value) {
        return value < 3;
      });

      assert.equal(1, ffilter.callCount);
      assert.equal(3, results.length);
      assert.equal(0, results[0]);
      assert.equal(1, results[1]);
      assert.equal(2, results[2]);

    });

    it("should filter using filter", function() {

      var results;

      results = filter({
        ten: 10,
        twenty: 20,
        thirty: 30,
        forty: 40,
        fifty: 50
      }, function(value) {
        return value < 30;
      });

      assert.equal(10, results.ten);
      assert.equal(20, results.twenty);
      assert.equal(undefined, results.thirty);
      assert.equal(undefined, results.forty);
      assert.equal(undefined, results.fifty);

    });

  });



  describe("function map", function() {

    it("should delegate to Array.prototype.map", function() {

      var fmap = fakes.spy(Array.prototype, "map"),
          results;

      results = map([0, 1, 2, 3, 4], function(value) {
        return value * 2;
      });

      assert.equal(1, fmap.callCount);
      assert.equal(5, results.length);
      assert.equal(0, results[0]);
      assert.equal(2, results[1]);
      assert.equal(4, results[2]);
      assert.equal(6, results[3]);
      assert.equal(8, results[4]);

    });

    it("should map using map", function() {

      var results;

      results = map({
        ten: 10,
        twenty: 20,
        thirty: 30,
        forty: 40,
        fifty: 50
      }, function(value) {
        return value * 10;
      });

      assert.equal(100, results.ten);
      assert.equal(200, results.twenty);
      assert.equal(300, results.thirty);
      assert.equal(400, results.forty);
      assert.equal(500, results.fifty);

    });

  });



  describe("function reduce", function() {

    it("should an reduce an array to a value", function() {

      var freduce = fakes.spy(Array.prototype, "reduce"),
          results;

      results = reduce([0, 1, 2, 3, 4], function(acc, value) {
        return acc + value;
      }, 10);

      assert.equal(1, freduce.callCount);
      assert.equal(20, results);

    });

    it("should an reduce an object to a value", function() {

      var results;

      results = reduce({a:0, b:1, c:2, d:3, e:4}, function(acc, value, key) {
        return acc + value;
      }, 10);

      assert.equal(20, results);

    });

    it("should pass the accumulator correctly", function() {

      var spy = fakes.spy();

      reduce({a:10, b:20, c:20, d:30, e:40}, spy, 0);

      assert.equal(spy.args[0][0], 0);

    });

    it("should pass the accumulator correctly", function() {

      var spy = fakes.spy();

      reduce({a:0, b:1, c:2, d:3, e:4}, spy);

      assert.equal(spy.args[0][0][0], 0);
      assert.equal(spy.args[0][0][1], 'a');
    });



  });


  it( 'function invoke', function() {
    expect( iter.invoke( [1, 2, 3, 4, 5], 'toFixed', 2 ) ).to.deep.equal( ['1.00', '2.00', '3.00', '4.00', '5.00'] );
    expect( iter.invoke( [1, 2, 3, 4, 5, 6, 7], 'toString', 2 ) ).to.deep.equal( ['1', '10', '11', '100', '101', '110', '111'] );

  } );


  it( 'function pluck', function() {
    var data = [{ data : { value : 'foo' } }, { data : { value : 'bar' } }, {}, { value : 'blim' }, { data : { value : 'blam' } }];
    expect( iter.pluck( data, 'data.value' ) ).to.deep.equal( ["foo", "bar", undefined, undefined, "blam"] );

    expect( iter.pluck( data, 'data.value', true ) ).to.deep.equal( ["foo", "bar", "blam"] );

    expect( iter.pluck( [
      { 'one' : 1, 'two' : 2, 'three' : 3 },
      { 'one' : 1, 'two' : 2, 'three' : 3 },
      { 'one' : 1, 'two' : 2, 'three' : 3 }
    ], 'two' ) ).to.deep.equal( [2, 2, 2] );

    expect( iter.pluck( [
      { 'one' : 1,         'two' : 2, 'three' : 3 },
      { 'one' : undefined, 'two' : 2, 'three' : 3 },
      { 'one' : 1,         'two' : 2, 'three' : 3 },
      { 'one' : null,      'two' : 2, 'three' : 3 },
      { 'one' : 1,         'two' : 2, 'three' : 3 }
    ], 'one', true ) ).to.deep.equal( [1, 1, 1] );

    expect( iter.pluck( iter.pluck( [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map( function( o, i ) {
      return { src : { val : i } };
    } ), 'src' ), 'val' ) ).to.deep.equal( [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] );

    expect( iter.pluck( iter.pluck( iter.pluck( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map( function( o, i ) {
      return { src : { val : { id : i % 2 ? i : null } } };
    } ), 'src' ), 'val' ), 'id', true ) ).to.deep.equal( [1, 3, 5, 7, 9] );

    expect( iter.pluck( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map( function( o, i ) {
      return { src : { val : i } };
    } ), 'src.val' ) ).to.deep.equal( [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] );

    expect( iter.pluck( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map( function( o, i ) {
      return { src : { val : { id : i % 2 ? i : null } } };
    } ), 'src.val.id', true ) ).to.deep.equal( [1, 3, 5, 7, 9] );

  } );
});

