"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

/**
  @description  creates an iterable object from another object
  @param        {object} object
  @return       {iterable}
*/
exports.iterator = iterator;
exports.exhaust = exhaust;
exports.collect = collect;
exports.first = first;
exports.last = last;

/**
  @description  returns true if any of the items evaluate to true
                else returns false
  @param        {o} object
  @param        {fn} function
  @param        {object} [scope]
  @return       {boolean}
*/
exports.some = some;

/**
  @description  returns true if all of the items evaluate to true
                else returns false
  @param        {o} object
  @param        {fn} function
  @param        {object} [scope]
  @return       {boolean}
*/
exports.every = every;

/**
  @description  returns the index of the first match
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
exports.indexOf = indexOf;

/**
  @description  returns the index|key of the first item to match the predicate function
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
exports.findIndex = findIndex;

/**
  @description  returns the value of the first item to match the predicate function
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
exports.find = find;

/**
  @description  returns the index of the last match
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
exports.lastIndexOf = lastIndexOf;

/**
  @description  returns the index|key of the first item to match the predicate function
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
exports.findLastIndex = findLastIndex;

/**
  @description  returns the value of the first item to match the predicate function
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
exports.findLast = findLast;
exports.take = take;

/**
  @description  ignore while the predicate is true
  @param        {o} object
  @param        {fn} function
  @return       {int|string}
*/
exports.dropWhile = dropWhile;
exports.drop = drop;

/**
  @description  reduces the value of the object down to a single value
  @param        {any} acc
  @param        {object} o
  @param        {function} fn
  @return       {any}
*/
exports.reduce = reduce;

/**
  @description  invokes the passed method on a collection of Objects and returns an Array of the values returned by each Object
  @param        {object} items
  @param        {string} method
  @param        {any} [arg1, arg2, ..., argN]
  @return       {array}
*/
exports.invoke = invoke;

/**
  @description  pluck values from a collection of Objects
  @param        {object} items
  @param        {string} key
  @param        {boolean} [only_existing]
  @return       {array}
*/
exports.pluck = pluck;

/**
  @description  adds the values of the object
  @param        {object} o
  @param        {any} [ret]
  @return       {number}
*/
exports.sum = sum;

/*
  @description  adds the value of each index from each object into an array
  @param        {object} o
  @param        {any} [ret]
  @return       {number}
*/
exports.zip = zip;

/*
  @description  adds the value of each index from each object into an array
  @param        {object} o
  @param        {any} [ret]
  @return       {number}
*/
exports.izip = izip;
exports.chain = chain;

/**
  @description  creates a range iterable
  @param        {number} start
  @param        {number} stop
  @param        {number} [step]
  @return       {iterable}
*/
exports.irange = irange;
exports.partition = partition;

/*
  todo

  itakeWhile
  idropWhile

  groupBy
  intersection

*/

var StopIteration = new Error();

var GeneratorFunctionPrototype = exports.GeneratorFunctionPrototype = Object.getPrototypeOf(function* () {
  yield 1;
});
var GeneratorFunction = exports.GeneratorFunction = GeneratorFunctionPrototype.constructor;

/**
  @description  returns true if a === b
  @param        {a} object
  @param        {b} function
  @return       {boolean}
*/
function eq(a, b) {

  return a === b;
}

function negate(fn, v, k) {

  return !fn(v, k);
}

function returns(o) {

  var genSet = function (v, k, type) {

    if (!r) {
      var _ref = cache.get(type || Array);

      var _ref2 = _slicedToArray(_ref, 2);

      r = _ref2[0];
      set = _ref2[1];
    }
    set(v, k);
  };

  var cache = new WeakMap();

  cache.set(Array, [[], function (v) {
    return r.push(v);
  }]);
  cache.set(Map, [new Map(), function (v, k) {
    return r.set(k, v);
  }]);
  cache.set(Set, [new Set(), function (v) {
    return r.add(v);
  }]);
  cache.set(Object, [{}, function (v, k) {
    return r[k] = v;
  }]);
  cache.set(GeneratorFunction, [null, genSet]);
  cache.set(GeneratorFunctionPrototype, [null, genSet]);

  var _cache$get = cache.get(o.constructor);

  var _cache$get2 = _slicedToArray(_cache$get, 2);

  var r = _cache$get2[0];
  var set = _cache$get2[1];

  return {
    set: set,
    get: function () {
      return r;
    }
  };
}

function curry(fn) {

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    switch (args.length) {

      case 0:

        throw new Error("NO_ARGS_EXCEPTION");

      case 1:

        var fn1 = args[0];

        return function () {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return fn.apply(undefined, args.concat([fn1]));
        };

      default:

        return fn.apply(undefined, args);
    };
  };
}
function iterator(object) {

  var o = typeof object === "function" ? object() : object;

  switch (true) {

    case typeof o.entries === "function":

      return o.entries();

    case typeof o[Symbol.iterator] === "function":

      return o[Symbol.iterator]();

    case typeof o.next === "function":

      return o;

    default:

      return (function* () {

        var i = 0;
        var keys = Object.keys(o);
        var len = keys.length;

        while (i < len) {

          yield [keys[i], o[keys[i++]], Object];
        }
      })();

  }
}

/**
  @descrption   applies a function to each item in an object
                after selecting most appropriate method to perform the iteration
  @param        {o} object
  @param        {fn} function
*/

function _forEach(o, fn) {

  try {

    if (typeof o.entries === "function") {

      for (var _ref5 of o.entries()) {
        var _ref2 = _slicedToArray(_ref5, 2);

        var k = _ref2[0];
        var v = _ref2[1];

        fn(v, k);
      }
    } else if (typeof o[Symbol.iterator] === "function") {

      for (var _ref33 of o) {
        var _ref32 = _slicedToArray(_ref33, 3);

        var k = _ref32[0];
        var v = _ref32[1];
        var type = _ref32[2];

        k = type === Set ? v : k;
        fn(v, k, type);
      }
    } else if (typeof o === "function") {

      for (var _ref43 of o()) {
        var _ref42 = _slicedToArray(_ref43, 3);

        var k = _ref42[0];
        var v = _ref42[1];
        var type = _ref42[2];

        k = type === Set ? v : k;
        fn(v, k, type);
      }
    } else {

      var it = iterator(o);
      var data = it.next();

      while (!data.done) {
        var _data$value = _slicedToArray(data.value, 3);

        var k = _data$value[0];
        var v = _data$value[1];
        var type = _data$value[2];

        fn(v, k, type);
        data = it.next();
      }
    }
  } catch (e) {

    if (e !== StopIteration) {
      throw e;
    }
  }
}

var forEach = exports.forEach = curry(_forEach);

function exhaust(o) {
  forEach(o, function () {});
}

function collect(o) {
  return map(o, function (v) {
    return v;
  });
}

/**
  @descrption   calls a function on each item in an object and returns the item if 'true'
  @param        {o} object
  @param        {fn} function
*/
function _filter(o, fn) {

  var r = returns(o);

  forEach(o, function (v, k, type) {

    if (fn(v, k)) {

      r.set(v, k, type);
    }
  });

  return r.get();
}

var filter = exports.filter = curry(_filter);

/**
  @description  creates an iterator filter
  @param        {object} o
  @param        {function} fn
  @return       {iterable}
*/
function* _ifilter(o, fn) {

  var type = o.constructor;
  var iterable = iterator(o);
  var data = iterable.next();

  while (!data.done) {
    var _data$value = _slicedToArray(data.value, 3);

    var k = _data$value[0];
    var v = _data$value[1];
    var t = _data$value[2];

    if (fn(v, k)) {

      yield [k, v, t || type];
    }

    data = iterable.next();
  }
}

var ifilter = exports.ifilter = curry(_ifilter);

/**
  @descrption   calls a function on each item in an object and returns the result
  @param        {o} object
  @param        {fn} function
  @return       {object|array}
*/
function _map() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 2) {
    var _ret = (function () {
      var o = args[0];
      var fn = args[1];

      var r = returns(o);

      forEach(o, function (v, k, type) {
        r.set(fn(v, k), k, type);
      });

      return {
        v: r.get()
      };
    })();

    if (typeof _ret === "object") {
      return _ret.v;
    }
  } else {

    return collect(imap.apply(undefined, args));
  }
}

var map = exports.map = curry(_map);

/**
  @description  creates an iterator map
  @param        {object} o
  @param        {function} fn
  @return       {iterable}
*/
function* _imap() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 2) {
    var o = args[0];
    var fn = args[1];

    var iterable = iterator(o);
    var data = iterable.next();
    var type = o.constructor;

    while (!data.done) {
      var _data$value = _slicedToArray(data.value, 3);

      var k = _data$value[0];
      var v = _data$value[1];
      var t = _data$value[2];

      yield [k, fn(v, k), t || type];

      data = iterable.next();
    }
  } else {

    var fn = args.pop();
    var type = args[0].constructor;
    var iterables = map(args, iterator);
    var data = invoke(iterables, "next");

    while (filter(data, function (v) {
      return v.done;
    }).length === 0) {
      var _data$0$value = _slicedToArray(data[0].value, 3);

      var k = _data$0$value[0];
      var t = _data$0$value[2];

      var v = fn.apply(undefined, _toConsumableArray(pluck(data, "value.1")));

      yield [k, v, t || type];

      data = invoke(iterables, "next");
    }
  }
}

var imap = exports.imap = curry(_imap);

function first(o, fn) {

  var r = undefined;
  forEach(o, function (v, k) {
    if (fn(v, k)) {
      r = [v, k];
      throw StopIteration;
    }
  });
  return r;
}

function last(o, fn) {

  var r = undefined;
  forEach(o, function (v, k) {
    if (fn(v, k)) {
      r = [v, k];
    }
  });

  return r;
}

function some(o, fn) {

  return !!first(o, fn);
}

function every(o, fn) {

  return !!!first(o, negate.bind(null, fn));
}

function indexOf(o, el) {

  var r = first(o, eq.bind(null, el));
  return r ? r[1] : -1;
}

function findIndex(o, fn) {

  var r = first(o, fn);
  return r ? r[1] : -1;
}

function find(o, fn) {

  var r = first(o, fn);
  return r ? r[0] : undefined;
}

function lastIndexOf(o, el) {

  var r = last(o, eq.bind(null, el));
  return r ? r[1] : -1;
}

function findLastIndex(o, fn) {

  var r = last(o, fn);
  return r ? r[1] : -1;
}

function findLast(o, fn) {

  var r = last(o, fn);
  return r ? r[0] : undefined;
}

/**
  @description  take while the predicate is true
  @param        {o} object
  @param        {fn} funtion
  @return       {int|string}
*/
function _takeWhile(o, fn) {

  var r = returns(o);
  forEach(o, function (v, k, type) {
    if (fn(v, k)) {
      r.set(v, k, type);
    } else {
      throw StopIteration;
    }
  });
  return r.get();
}

var takeWhile = exports.takeWhile = curry(_takeWhile);

function take(o) {
  var n = arguments[1] === undefined ? 1 : arguments[1];

  return takeWhile(o, function (v, k) {
    return k < n;
  });
}

function dropWhile(o, fn) {

  var r = returns(o);
  var take = false;
  forEach(o, function (v, k, type) {

    take = take || !fn(v, k);

    if (take) {
      r.set(v, k, type);
    }
  });
  return r.get();
}

function drop(o) {
  var n = arguments[1] === undefined ? 1 : arguments[1];

  return dropWhile(o, function (v, k) {
    return k < n;
  });
}

function reduce(o, fn, acc) {

  var noAcc = typeof acc === "undefined";
  var iterable = undefined;

  if (noAcc) {

    iterable = iterator(o);
    var data = iterable.next();

    if (data.done) {
      throw new TypeError("reduce() of sequence with no initial value");
    } else {
      acc = data.value[1];
    }
  } else {
    iterable = o;
  }

  forEach(iterable, function (value, key) {
    acc = fn(acc, value, key);
  });

  return acc;
}

function invoke(items, method) {

  var args = Array.prototype.slice.call(arguments, 2);
  var i = -1;
  var l = Array.isArray(items) ? items.length : 0;
  var res = [];

  while (++i < l) {
    res.push(items[i][method].apply(items[i], args));
  }

  return res;
}

function pluck(items, key, only_existing) {

  only_existing = only_existing === true;

  var U = undefined;
  var i = -1;
  var l = Array.isArray(items) ? items.length : 0;
  var res = [];
  var val = undefined;

  if (key.indexOf(".") > -1) {

    return reduce(key.split("."), function (v, k) {
      return pluck(v, k, only_existing);
    }, items);
  }

  while (++i < l) {

    val = key in Object(items[i]) ? items[i][key] : U;

    if (only_existing !== true || val !== null && val !== U) {

      res.push(val);
    }
  }

  return res;
}

function sum(o, acc) {
  return reduce(o, function (acc, a) {
    return acc + a;
  }, acc);
}

function zip() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 1) {
    return args[0];
  }

  return map.apply(undefined, args.concat([function () {
    for (var _len2 = arguments.length, v = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      v[_key2] = arguments[_key2];
    }

    return v;
  }]));
}

function izip() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 1) {
    return args[0];
  }

  return imap.apply(undefined, args.concat([function () {
    for (var _len2 = arguments.length, v = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      v[_key2] = arguments[_key2];
    }

    return v;
  }]));
}

function* chain() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 1) {
    return iterator(args[0]);
  }

  var iterables = map(args, iterator);
  var data = iterables[0].next();

  while (true) {

    if (!data.done) {
      yield data.value;
    } else {

      if (iterables.length === 1) {
        break;
      }
      iterables.shift();
    }

    data = iterables[0].next();
  }
}

function* irange(start, stop) {
  var step = arguments[2] === undefined ? 1 : arguments[2];

  var i = 0;

  while (start <= stop) {

    yield [i++, start];
    start = start + step;
  }
}

function partition(o, fn) {

  var iterable = iterator(o);
  var data = iterable.next();
  var t = returns(o);
  var f = returns(o);

  while (!data.done) {
    var _data$value = _slicedToArray(data.value, 3);

    var k = _data$value[0];
    var v = _data$value[1];
    var type = _data$value[2];

    if (fn(v, k)) {
      t.set(v, k, type);
    } else {
      f.set(v, k, type);
    }

    data = iterable.next();
  }

  return [t.get(), f.get()];
}

Object.defineProperty(exports, "__esModule", {
  value: true
});