"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

/**
  @description  creates an iterable object from another object
  @param        {object} object
  @return       {iterable}
*/
exports.iterator = iterator;

/**
  @descrption   applies a function to each item in an object
                after selecting most appropriate method to perform the iteration
  @param        {o} object
  @param        {fn} function
*/

exports.forEach = forEach;

/**
  @descrption   calls a function on each item in an object and returns the item if 'true'
  @param        {o} object
  @param        {fn} function
*/
exports.filter = filter;

/**
  @descrption   calls a function on each item in an object and returns the result
  @param        {o} object
  @param        {fn} function
  @return       {object|array}
*/
exports.map = map;
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

/**
  @description  take while the predicate is true
  @param        {o} object
  @param        {fn} funtion
  @return       {int|string}
*/
exports.takeWhile = takeWhile;

/**
  @description  ignore while the predicate is true
  @param        {o} object
  @param        {fn} function
  @return       {int|string}
*/
exports.dropWhile = dropWhile;

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
  todo - map over the longest arg
       - throw if args are not the same
*/
exports.zip = zip;
exports.chain = chain;

/**
  @description  creates an iterator map
  @param        {object} o
  @param        {function} fn
  @return       {iterable}
*/
exports.imap = imap;

/**
  @description  creates an iterator filter
  @param        {object} o
  @param        {function} fn
  @return       {iterable}
*/
exports.ifilter = ifilter;

/**
  @description  creates a range iterable
  @param        {number} start
  @param        {number} stop
  @param        {number} [step]
  @return       {iterable}
*/
exports.range = range;

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

function forEach(o, fn) {

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

function filter(o, fn) {

  var r = returns(o);

  forEach(o, function (v, k, type) {
    if (fn(v, k)) {
      r.set(v, k, type);
    }
  });
  return r.get();
}

function map() {
  var _arguments = arguments;

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
    var _ret2 = (function () {

      var args = toArray(_arguments);
      args.pop();
      var r = returns(args[0]);

      if (typeof args[0].next === "function") {

        var l = args.length;
        var done = 0;
        var i = 0;

        var data = undefined;
        var value = undefined;
        var _key2 = undefined;
        var values = [];

        while (i < l) {

          data = args[i].next();
          value = data.value[0];
          _key2 = data.value[1];
          values.push(value);
          i++;

          if (data.done) {
            done = done + 1;
          }
          if (i === l) {
            i = 0;
            values.push(_key2);
            r.set(fn.apply(null, values), _key2);
            values = [];
            if (done === l) {
              break;
            }
          }
        }
      } else {

        var longest = (function (args) {
          var l = 0;
          reduce(args, function (acc, arg, i) {

            if (arg > acc) {
              l = i;
            }
            return arg;
          }, typeof args[0].length === "number" ? args[0].length : Object.key(args[0].length));
          return l;
        })();

        forEach(args[longest], function (v, k) {

          var values = [];
          var i = 0;
          while (i++ < args.length) {
            values.push(args[i][k]);
          }
          values.push(key);
          r.set(fn.apply(null, values), key);
        });

        return {
          v: r.get()
        };
      }
    })();

    if (typeof _ret2 === "object") {
      return _ret2.v;
    }
  }
}

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

function takeWhile(o, fn) {

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

  var r = returns(args[0]);

  forEach(args[0], function (v, k, type) {

    var values = [v];
    var i = 0;
    while (++i < args.length) {
      values.push(typeof args[i].next === "function" ? args[i].next().value[1] : args[i][k]);
    }
    r.set(values, k, type);
  });

  return r.get();
}

// let zip = map(function () {
//   let args = toArray(arguments);
//   args.pop();
//   return args;
// });

function argsOfType() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var i = 0;
  var l = args.length - 1;

  while (i < l) {
    if (args[i].constructor !== args[++i].constructor) {
      throw new TypeError("arguments must be of same type");
    }
  }
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

function* imap(o, fn) {

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
}

function* ifilter(o, fn) {

  var iterable = iterator(o);
  var data = iterable.next();
  var type = o.constructor;

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

function* range(start, stop) {
  var step = arguments[2] === undefined ? 1 : arguments[2];

  var i = 0;

  while (start <= stop) {

    yield [i++, start];
    start = start + step;
  }
}

// let oo = {
//   [Symbol.iterator]: function* () {

//     let i = 0;

//     while (i < 11) {
//       yield [null, i, Set];
//       i = i +2;
//     }

//   }
// }

// forEach(imap(ifilter(oo, v => v%4 === 0), v => v * 10), (v, k) => console.log(v, k));
// forEach(imap(range(5, 100, 5), v => map(range(0, v), v => v)), (v, k) => console.log(v, k));

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
  @module   iteration methods
*/