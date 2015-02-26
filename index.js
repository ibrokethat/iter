"use strict";

/**
  @description  creates an iterable object from another object
  @param        {object} obect
  @return       {iterable}
*/
exports.iterator = iterator;

// export function iterator (object) {

//   let o = typeof object === 'function' ? object() : object;
//   let i;
//   let len;

//   switch (true) {

//     //  is array like
//     case isArrayLike(o):

//       i = 0;
//       len = o.length;

//       return {
//         next: function () {
//           return {
//             value: [o[i], i++],
//             done: i === len ? true : false
//           }
//         }
//       }

//     //  iterate
//     case (typeof o.next === 'function'):

//       return o;

//     //  is obj with keys
//     default:

//       i = 0;
//       let keys = Object.keys(o);
//       len = keys.length;

//       return {
//         next: function () {
//           return {
//             value: [o[keys[i]], keys[i++]],
//             done: i === len ? true : false
//           };
//         }
//       }

//   }
// }

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
  @param        {func} function
*/
exports.filter = filter;

/**
  @descrption   calls a function on each item in an object and returns the result
  @param        {o} object
  @param        {func} function
  @return       {object|array}
*/
exports.map = map;
exports.first = first;
exports.last = last;

/**
  @description  returns true if any of the items evaluate to true
                else returns false
  @param        {o} object
  @param        {func} function
  @param        {object} [scope]
  @return       {boolean}
*/
exports.some = some;

/**
  @description  returns true if all of the items evaluate to true
                else returns false
  @param        {o} object
  @param        {func} function
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
  @description  converts an array like object to an array
  @param        {object} arrayLike
  @param        {number} [i]
  @return       {array}
*/
exports.toArray = toArray;

/**
  @description  reduces the value of the object down to a single value
  @param        {any} acc
  @param        {object} o
  @param        {function} func
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

// let zip = map(function () {
//   let args = toArray(arguments);
//   args.pop();
//   return args;
// });

/**
  @description  creates an iterable object that iterates over all it's parameter objects
  @param        {array} args
  @return       {iterable}
*/
exports.chain = chain;

/**
  @description  creates an iterator map
  @param        {object} o
  @param        {function} func
  @param        {object} [scope]
  @return       {iterable}
*/
exports.imap = imap;
exports.ifilter = ifilter;

/**
  @description  creates a range iterable
  @param        {number} start
  @param        {number} stop
  @param        {number} [step]
  @return       {iterable}
*/
exports.range = range;

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

function isArrayLike(o) {

  return typeof o !== "function" && typeof o.length === "number";
}

function returns(o) {

  var r = undefined,
      set = undefined;

  function setArray(v) {
    r.push(v);
  };
  function setObject(v, k) {
    r[k] = v;
  };
  // function setObjectOrArray (v, k) {
  //   if (typeof k === 'number') {
  //     r = r || [];
  //     setArray(v);
  //   }
  //   else {
  //     r = r || {};
  //     setObject(v, k);
  //   }
  // };

  if (isIterable(o) || isArrayLike(o)) {
    r = [];
    set = setArray;
  } else {
    r = {};
    set = setObject;
  }

  return {
    set: set,
    get: function get() {
      return r || {};
    }
  };
}

function isIterable(o) {

  return typeof o === "function" || typeof o.next === "function" || typeof o[Symbol.iterator] === "function";
}

var StopIteration = new Error();function iterator(object) {

  var o = typeof object === "function" ? object() : object;

  switch (true) {

    //  fall through on purpose here
    case typeof o[Symbol.iterator] === "function":

      o = o[Symbol.iterator]();

    case typeof o.next === "function":

      return o;

    default:

      return (function* () {

        var i = 0;
        var keys = Object.keys(o);
        var len = keys.length;

        while (i < len) {

          yield o[keys[i++]];
        }
      })();

  }
}function forEach(object, fn) {

  var o = typeof object === "function" ? object() : object;

  try {

    switch (true) {

      //  has .forEach
      case typeof o.forEach === "function":

        o.forEach(fn);
        break;

      //  is array like
      case isArrayLike(o):

        var i = -1;
        var length = o.length;
        while (++i < length) {
          fn(o[i], i);
        }
        break;

      //  iterator object
      case typeof o.next === "function":

        var data = {};

        while (!data.done) {
          data = o.next();
          fn(data.value);
        }
        break;

      //  iterator protocol
      case typeof o[Symbol.iterator] === "function":

        for (var _iterator = o[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
          var v = _step.value;

          fn(v);
        }
        break;

      //  is obj with keys
      default:

        Object.keys(o).forEach(function (key) {
          fn(o[key], key);
        });

    }
  } catch (e) {

    if (e !== StopIteration) {
      throw e;
    }
  }
}function filter(o, fn) {

  if (typeof o.filter === "function") {
    return o.filter(fn);
  }

  var r = returns(o);

  forEach(o, function (v, k) {
    if (fn(v, k)) {
      r.set(v, k);
    }
  });
  return r.get();
}function map(o, fn) {
  var _arguments = arguments;

  if (arguments.length === 2) {
    var _ret = (function () {

      if (typeof o.map === "function") {
        return {
          v: o.map(fn)
        };
      }

      var r = returns(o);
      forEach(o, function (v, k) {
        r.set(fn(v, k), k);
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
        var _key = undefined;
        var values = [];

        while (i < l) {

          data = args[i].next();
          value = data.value[0];
          _key = data.value[1];
          values.push(value);
          i++;

          if (data.done) {
            done = done + 1;
          }
          if (i === l) {
            i = 0;
            values.push(_key);
            r.set(fn.apply(null, values), _key);
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
}function some(o, fn) {

  if (typeof o.some === "function") {
    return o.some(fn);
  }
  return !!first(o, fn);
}function every(o, fn) {

  if (typeof o.every === "function") {
    return o.every(fn);
  }

  return !!!first(o, negate.bind(null, fn));
}function indexOf(o, el) {

  if (typeof o.indexOf === "function") {
    return o.indexOf(el);
  }

  var r = first(o, eq.bind(null, el));
  return r ? r[1] : -1;
}function findIndex(o, fn) {

  if (typeof o.findIndex === "function") {
    return o.findIndex(fn);
  }

  var r = first(o, fn);
  return r ? r[1] : -1;
}function find(o, fn) {

  if (typeof o.find === "function") {
    return o.find(fn);
  }

  var r = first(o, fn);
  return r ? r[0] : undefined;
}function lastIndexOf(o, el) {

  if (typeof o.lastIndexOf === "function") {
    return o.lastIndexOf(el);
  }

  var r = last(o, eq.bind(null, el));
  return r ? r[1] : -1;
}function findLastIndex(o, fn) {

  var r = last(o, fn);
  return r ? r[1] : -1;
}function findLast(o, fn) {

  var r = last(o, fn);
  return r ? r[0] : undefined;
}function takeWhile(o, fn) {

  var r = returns(o);
  forEach(o, function (v, k) {
    if (fn(v, k)) {
      r.set(v, k);
    } else {
      throw StopIteration;
    }
  });
  return r.get();
}function dropWhile(o, fn) {

  var r = returns(o);
  var take = false;
  forEach(o, function (v, k) {

    take = take || !fn(v, k);

    if (take) {
      r.set(v, k);
    }
  });
  return r.get();
}function toArray(arrayLike, i) {

  return Array.prototype.slice.call(arrayLike, i || 0);
}function reduce(o, fn, acc) {

  var noAcc = typeof acc === "undefined";
  var iterable = undefined;

  if (typeof o.reduce === "function") {

    return noAcc ? o.reduce(fn) : o.reduce(fn, acc);
  }

  if (noAcc) {

    iterable = iterator(o);
    var r = iterable.next();

    if (r.done) {
      throw new TypeError("reduce() of sequence with no initial value");
    } else {
      acc = r.value[0];
    }
  } else {
    iterable = o;
  }

  forEach(iterable, function (value, key) {
    acc = fn(acc, value, key);
  });

  return acc;
}function invoke(items, method) {

  var args = Array.prototype.slice.call(arguments, 2);
  var i = -1;
  var l = Array.isArray(items) ? items.length : 0;
  var res = [];

  while (++i < l) {
    res.push(items[i][method].apply(items[i], args));
  }

  return res;
}function pluck(items, key, only_existing) {

  only_existing = only_existing === true;

  var U = undefined,
      i = -1,
      l = Array.isArray(items) ? items.length : 0,
      res = [],
      val = undefined;

  if (key.indexOf(".") > -1) {

    return reduce(key.split("."), function (v, k) {
      return pluck(v, k, only_existing);
    }, items);
  }

  while (++i < l) {
    val = key in Object(items[i]) ? items[i][key] : U;

    if (only_existing !== true || val !== null && val !== U) res.push(val);
  }

  return res;
}function sum(o, acc) {
  return reduce(o, function (acc, a) {
    return acc + a;
  }, acc);
}function zip() {

  var args = arguments;
  var r = returns(args[0]);

  forEach(args[0], function (v, k) {

    var values = [v];
    var i = 0;
    while (++i < args.length) {
      values.push(typeof args[i].next === "function" ? args[i].next().value[0] : args[i][k]);
    }
    r.set(values, k);
  });

  return r.get();
}function chain(args) {

  if (args.length === 1) {
    return iterator(args[0]);
  }

  var iterables = map(args, iterator);

  return {

    next: function next() {

      var data = iterables[0].next();

      if (!data.done) {
        return data;
      } else {

        if (iterables.length === 1) {
          return data;
        }

        iterables.shift();

        return {
          value: data.value,
          done: false
        };
      }
    }

  };
}function* imap(o, fn) {

  var iterable = iterator(o);
  var data = {};

  while (!data.done) {

    data = iterable.next();
    yield fn(data.value);
  }
}

function ifilter(o, fn) {

  var iterable = iterator(o);
  var prev = undefined;
  var next = undefined;

  return {

    next: (function (_next) {
      var _nextWrapper = function next() {
        return _next.apply(this, arguments);
      };

      _nextWrapper.toString = function () {
        return _next.toString();
      };

      return _nextWrapper;
    })(function () {

      if (next) {
        prev = next;
        next = false;
      }

      if (!prev || prev && !prev.done) {

        var data = iterable.next();

        while (true) {

          if (fn(data.value[0], data.value[1])) {
            if (!prev) {
              prev = data;
            } else {
              next = data;
              break;
            }
          };

          if (prev && prev.done || data.done) {
            break;
          }

          data = iterable.next();
        }
      }

      return next ? prev : { value: prev.value, done: true };
    })
  };
}function range(start, stop, step) {

  var i = 0;

  step = step || 1;

  return {
    next: function next() {
      var ret = start;
      if (start >= stop) {
        throw StopIteration;
      }
      start = start + step;
      return [ret, i++];
    }
  };
}
Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
  @module   iteration methods
*/
