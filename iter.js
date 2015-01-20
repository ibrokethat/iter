/**
  @module   iteration methods
*/
"use strict";

var StopIteration = new Error();


function isArrayLike (o) {
  return typeof o.length === 'number';
}


function returns (o) {

  var r, set;

  function setArray(v) {
    r.push(v);
  };
  function setObject (v, k) {
    r[k] = v;
  };
  function setObjectOrArray (v, k) {
    if (typeof k === 'number') {
      r = r || [];
      setArray(v);
    }
    else {
      r = r || {};
      setObject(v, k);
    }
  };

  if (isArrayLike(o)) {
    r = [];
    set = setArray;
  }
  else {
    set = setObjectOrArray;
  }

  return {
    set: set,
    get: function () {
      return r || {};
    }
  };
}



/**
  @description  creates an iterable object from another object
  @param        {object} obect
  @return       {iterable}
*/
function iterator (object) {

  var o = typeof object === 'function' ? object() : object;

  switch (true) {

    //  is array like
    case isArrayLike(o):

      var i = 0;
      var len = o.length;

      return {
        next: function () {
          return {
            value: [o[i], i++],
            done: i === len ? true : false
          }
        }
      }

    //  iterate
    case (typeof o.next === 'function'):

      return o;

    //  is obj with keys
    default:

      var i = 0;
      var keys = Object.keys(o);
      var len = keys.length;

      return {
        next: function () {
          return {
            value: [o[keys[i]], keys[i++]],
            done: i === len ? true : false
          };
        }
      }

  }
}

/**
  @descrption   applies a function to each item in an object
                after selecting most appropriate method to perform the iteration
  @param        {object} object
  @param        {func} function
*/

function forEach (object, fn) {

  var o = typeof object === 'function' ? object() : object;

  try {

    switch (true) {

      //  has .forEach
      case (typeof o.forEach === 'function'):

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

      //  iterateor protocol
      case (typeof o.next === 'function'):

        var data = {};

        while (!data.done) {
          data = o.next();
          fn(data.value[0], data.value[1]);
        }
        break;

      //  is obj with keys
      default:

        Object.keys(o).forEach(function(key) {
          fn(o[key], key);
        });

    }

  }
  catch (e) {

    if (e !== StopIteration) {
      throw e;
    }
  }

}



/**
  @descrption   calls a function on each item in an object and returns the item if 'true'
  @param        {o} object
  @param        {func} function
  @param        {object} [scope]
*/
function filter (o, fn) {

  if (typeof o.filter === 'function') {
    return o.filter(fn);
  }

  var r = returns(o);
  forEach(o, function (v, k) {
    if (fn(v, k)) {
      r.set(v, k);
    }
  });
  return r.get();
}


/**
  @descrption   calls a function on each item in an object and returns the result
  @param        {o} object
  @param        {func} function
  @param        {object} [scope]
  @return       {object|array}
*/
function map (o, fn) {

  if (arguments.length === 2) {

    if (typeof o.map === 'function') {
      return o.map(fn);
    }

    var r = returns(o);
    forEach(o, function (v, k) {
      r.set(fn(v, k), k);
    });
    return r.get();

  }
  else {

    var args = toArray(arguments);
    args.pop();
    var r = returns(args[0]);

    if (typeof args[0].next === 'function') {

      var l = args.length;
      var done = 0;
      var i = 0;

      var data;
      var value;
      var key;
      var values = [];

      while (i < l) {

        data = args[i].next();
        value = data.value[0];
        key = data.value[1];
        values.push(value);
        i++;

        if (data.done) {
          done = done + 1;
        }
        if (i === l) {
          i = 0;
          values.push(key);
          r.set(fn.apply(null, values), key);
          values = [];
          if (done === l) {
            break;
          }
        }

      }

    }
    else {

      var longest = (function (args) {
        var l = 0;
        reduce(args, function (acc, arg, i) {

          if (arg > acc) {
            l = i;
          }
          return arg;

        }, typeof args[0].length === 'number' ? args[0].length : Object.key(args[0].length))
        return l;
      }());

      forEach(args[longest], function (v, k) {

        var values = [];
        var i = 0;
        while (i++ < args.length) {
          values.push(args[i][k]);
        }
        values.push(key);
        r.set(fn.apply(null, values), key);
      });

      return r.get();
    }
  }

}



/**
  @description  returns true if a === b
  @param        {a} object
  @param        {b} function
  @return       {boolean}
*/
function eq (a, b) {
  return a === b;
}

function negate (fn, v, k) {
  return !fn(v, k);
}



function first (o, fn) {
  var r;
  forEach(o, function (v, k) {
    if (fn(v, k)) {
      r = [v, k];
      throw StopIteration;
    }
  });
  return r;
}


function last (o, fn) {
  var r;
  forEach(o, function (v, k) {
    if (fn(v, k)) {
      r = [v, k];
    }
  });

  return r;
}



/**
  @description  returns true if any of the items evaluate to true
                else returns false
  @param        {o} object
  @param        {func} function
  @param        {object} [scope]
  @return       {boolean}
*/
function some (o, fn) {
  if (typeof o.some === 'function') {
    return o.some(fn);
  }
  return !! first(o, fn);
}



/**
  @description  returns true if all of the items evaluate to true
                else returns false
  @param        {o} object
  @param        {func} function
  @param        {object} [scope]
  @return       {boolean}
*/
function every (o, fn) {

  if (typeof o.every === 'function') {
    return o.every(fn);
  }

  return !(!! first(o, negate.bind(null, fn)));
}



/**
  @description  returns the index of the first match
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
function indexOf (o, el) {

  if (typeof o.indexOf === 'function') {
    return o.indexOf(el);
  }

  var r = first(o, eq.bind(null, el));
  return r ? r[1] : -1;
}



/**
  @description  returns the index|key of the first item to match the predicate function
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
function findIndex (o, fn) {

  if (typeof o.findIndex === 'function') {
    return o.findIndex(fn);
  }

  var r = first(o, fn);
  return r ? r[1] : -1;
}


/**
  @description  returns the value of the first item to match the predicate function
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
function find (o, fn) {

  if (typeof o.find === 'function') {
    return o.find(fn);
  }

  var r = first(o, fn);
  return r ? r[0] : undefined;
}


/**
  @description  returns the index of the last match
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
function lastIndexOf (o, el) {

  if (typeof o.lastIndexOf === 'function') {
    return o.lastIndexOf(el);
  }

  var r = last(o, eq.bind(null, el));
  return r ? r[1] : -1;
}

/**
  @description  returns the index|key of the first item to match the predicate function
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
function findLastIndex (o, fn) {

  var r = last(o, fn);
  return r ? r[1] : -1;
}



/**
  @description  returns the value of the first item to match the predicate function
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
function findLast (o, fn) {

  var r = last(o, fn);
  return r ? r[0] : undefined;
}


/**
  @description  converts an array like object to an array
  @param        {object} arrayLike
  @param        {number} [i]
  @return       {array}
*/
function toArray(arrayLike, i) {

  return Array.prototype.slice.call(arrayLike, i || 0);

}




/**
  @description  reduces the value of the object down to a single value
  @param        {any} acc
  @param        {object} o
  @param        {function} func
  @return       {any}
*/
function reduce (o, fn, acc){

  var noAcc = typeof acc === 'undefined';

  if(typeof o.reduce === 'function') {

    return noAcc ? o.reduce(fn) : o.reduce(fn, acc);
  }

  if (noAcc) {

    var iterable = iterator(o);
    var r = iterable.next();

    if (r.done) {
      throw new TypeError("reduce() of sequence with no initial value");
    }
    else {
      acc = r.value[0];
    }

  }
  else {
    var iterable = o;
  }

  forEach(iterable, function(value, key){
    acc = fn(acc, value, key);
  });

  return acc;
}



/**
  @description  invokes the passed method on a collection of Objects and returns an Array of the values returned by each Object
  @param        {object} items
  @param        {string} method
  @param        {any} [arg1, arg2, ..., argN]
  @return       {array}
*/
function invoke (items, method) {
  var args = Array.prototype.slice.call(arguments, 2);
  var i = -1;
  var l = Array.isArray(items) ? items.length : 0;
  var res = [];

  while (++i < l) {
    res.push(items[i][method].apply(items[i], args));
  }

  return res;
}



/**
  @description  pluck values from a collection of Objects
  @param        {object} items
  @param        {string} key
  @param        {boolean} [only_existing]
  @return       {array}
*/
function pluck(items, key, only_existing) {

  only_existing = only_existing === true;

  var U,
    i   = -1,
    l   = Array.isArray( items ) ? items.length : 0,
    res = [],
    val;

  if ( key.indexOf( '.' ) > -1 )
    return reduce( key.split( '.' ), function( v, k ) {
      return pluck( v, k, only_existing );
    }, items );

  while ( ++i < l ) {
    val = key in Object( items[i] ) ? items[i][key] : U;

    if ( only_existing !== true || ( val !== null && val !== U ) )
      res.push( val );
  }

  return res;
}


/**
  @description  adds the values of the object
  @param        {object} o
  @param        {any} [ret]
  @return       {number}
*/
function sum (o, acc) {
  return reduce(o, function(acc, a) {
    return acc + a;
  }, acc);
}



/*
  todo - map over the longest arg
       - throw if args are not the same
*/
function zip () {


  var args = arguments;
  var r = returns(args[0]);

  forEach(args[0], function (v, k) {

    var values = [v];
    var i = 0;
    while (++i < args.length) {
      values.push(typeof args[i].next === 'function' ? args[i].next().value[0] : args[i][k]);
    }
    r.set(values, k);
  });

  return r.get();
}


// var zip = map(function () {
//   var args = toArray(arguments);
//   args.pop();
//   return args;
// });

/**
  @description  creates an iterable object that iterates over all it's parameter objects
  @param        {array} args
  @return       {iterable}
*/
function chain (args) {

  if(args.length === 1) {
    return iterator(args[0]);
  }

  var iterables = map(args, iterator);

  return {

    next: function() {

      var data = iterables[0].next();

      if (!data.done) {
        return data;
      }
      else {

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
}



/**
  @description  creates an iterator map
  @param        {object} o
  @param        {function} func
  @param        {object} [scope]
  @return       {iterable}
*/
function imap (o, fn) {

  var iterable = iterator(o);

  return {

    next: function () {

      var data = iterable.next();

      return {
        value: [fn(data.value[0], data.value[1]), data.value[1]],
        done: data.done
      };
    }
  }
}


function ifilter (o, fn) {

  var iterable = iterator(o);
  var prev;
  var next;

  return {

    next: function () {

      if (next) {
        prev = next;
        next = false;
      }

      if (!prev || (prev && !prev.done)) {

        var data = iterable.next();

        while (true) {

          if (fn(data.value[0], data.value[1])) {
            if (!prev) {
              prev = data;
            }
            else {
              next = data;
              break
            }
          };

          if ((prev && prev.done) || data.done) {
            break;
          }

          data = iterable.next();

        }
      }

      return next ? prev : {value: prev.value, done: true};
    }
  };

}



/**
  @description  creates a range iterable
  @param        {number} start
  @param        {number} stop
  @param        {number} [step]
  @return       {iterable}
*/
function range  (start, stop, step) {

  var i = 0;

  step = step || 1;

  return {
    next: function() {
      var ret = start;
      if(start >= stop) {
        throw StopIteration;
      }
      start = start + step;
      return [ret, i++];
    }
  };
}

//  public
exports.StopIteration = StopIteration;
exports.iterator      = iterator;

exports.forEach = forEach;
exports.filter = filter;
exports.map = map;
exports.some = some;
exports.every = every;
exports.find = find;
exports.findIndex = findIndex;
exports.findLast = findLast;
exports.findLastIndex = findLastIndex;
exports.imap = imap;
exports.ifilter = ifilter;

exports.lastIndexOf = lastIndexOf;
exports.indexOf = indexOf;

exports.toArray = toArray;
exports.reduce = reduce;
exports.sum = sum;
exports.chain = chain;
exports.zip = zip;

exports.range = range;
exports.invoke = invoke;
exports.pluck = pluck;
