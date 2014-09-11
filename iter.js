/**
  @module   iteration methods
*/
"use strict";
var StopIteration = new Error();


function curry2 (fn) {
  return function (a, b) {
    switch (arguments.length) {
      case 0: throw new Error();
      case 1: return function (b) {
        return fn(b, a);
      };
    };
    return fn(a, b);
  }
}

function curry3(fn) {
  return function(a, b, c) {
    switch (arguments.length) {
        case 0: throw NO_ARGS_EXCEPTION;
        case 1: return curry2(function(b, c) {
          return fn(b, c, a);
        });
        case 2: return function(c) {
          return fn(a, b, c);
        };
    }
    return fn(a, b, c);
  };
}



function isArrayLike (o) {
  return typeof o.length === 'number';
}


function returns (o) {

  var r, set;

  if (isArrayLike(o) || typeof o === 'function' || typeof o.next === 'function') {
    r = [];
    set = function (v) {
      r.push(v);
    };
  }
  else {
    r = {};
    set = function (v, k) {
      r[k] = v;
    };
  }

  return {
    set: set,
    r: r
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
            value: o[i++],
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
            value: o[keys[i++]],
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

function _forEach (object, fn) {

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
          fn(data.value);
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
function _filter (o, fn) {
  var r = returns(o);
  _forEach(o, function (v, k) {
    if (fn(v, k)) {
      r.set(v, k);
    }
  });
  return r.r;
}


/**
  @descrption   calls a function on each item in an object and returns the result
  @param        {o} object
  @param        {func} function
  @param        {object} [scope]
  @return       {object|array}
*/
function _map (o, fn) {
  var r = returns(o);
  _forEach(o, function (v, k) {
    r.set(fn(v, k), k);
  });
  return r.r;
}


/**
  @description  returns true if a === b
  @param        {a} object
  @param        {b} function
  @return       {boolean}
*/
function _eq (a, b) {
  return a === b;
}

function _negate (v, k, fn) {
  return !fn(v, k);
}



function _first (o, fn) {
  var r;
  _forEach(o, function (v, k) {
    if (fn(v, k)) {
      r = [v, k];
      throw StopIteration;
    }
  });
  return r;
}


function _last (o, fn) {
  var r;
  _forEach(o, function (v, k) {
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
function _some (o, fn) {
  if (typeof o.some === 'function') {
    return o.some(fn);
  }
  return !! _first(o, fn);
}



/**
  @description  returns true if all of the items evaluate to true
                else returns false
  @param        {o} object
  @param        {func} function
  @param        {object} [scope]
  @return       {boolean}
*/
function _every (o, fn) {
  if (typeof o.every === 'function') {
    return o.every(fn);
  }
  return !(!! _first(o, negate(fn)));
}



/**
  @description  returns the index of the first match
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
function _indexOf (o, el) {
  if (typeof o.next === 'function') {
    throw new TypeError('Object conformaing to iteration protocol supplied');
  }
  if (typeof o.indexOf === 'function') {
    return o.indexOf(el);
  }
  var r = _first(o, eq(el));
  return r ? r[1] : -1;
}



/**
  @description  returns the index|key of the first item to match the predicate function
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
function _findIndex (o, fn) {
  if (typeof o.next === 'function') {
    throw new TypeError('Object conformaing to iteration protocol supplied');
  }
  var r = _first(o, fn);
  return r ? r[1] : -1;
}


/**
  @description  returns the value of the first item to match the predicate function
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
function _find (o, fn) {
  var r = _first(o, fn);
  return r ? r[0] : undefined;

}


/**
  @description  returns the index of the last match
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
function _lastIndexOf (o, el) {
  if (typeof o.next === 'function') {
    throw new TypeError('Object conformaing to iteration protocol supplied');
  }
  var r = _last(o, eq(el));
  return r ? r[1] : -1;
}

/**
  @description  returns the index|key of the first item to match the predicate function
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
function _findLastIndex (o, fn) {
  if (typeof o.next === 'function') {
    throw new TypeError('Object conformaing to iteration protocol supplied');
  }
  var r = _last(o, fn);
  return r ? r[1] : -1;
}



/**
  @description  returns the value of the first item to match the predicate function
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
function _findLast (o, fn) {
  var r = _last(o, fn);
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
function reduce (o, func, acc, scope){

  if(typeof o.reduce === 'function') {
    return o.reduce(func.bind(scope || null), acc);
  }

  var iterable;

  if (typeof acc === "undefined") {

    iterable = iterator(o);
    try {
      acc = iterable.next();
    }
    catch (e) {
      if (e === StopIteration) {
        throw new TypeError("reduce() of sequence with no initial value");
      }
      throw e;
    }
  }
  else {
    iterable = iterator(o);
  }

  exhaust(iterable, function(value, key){
    acc = func.call(scope || null, acc, value, key);
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

  function invoke( items, method ) {
    var args  = Array.prototype.slice.call( arguments, 2 ),
      i     = -1,
      l     = Array.isArray( items ) ? items.length : 0,
      res   = [];

    while ( ++i < l )
      res.push( items[i][method].apply( items[i], args ) );

    return res;
  }



/**
  @description  pluck values from a collection of Objects
  @param        {object} items
  @param        {string} key
  @param        {boolean} [only_existing]
  @return       {array}
*/

  function pluck( items, key, only_existing ) {
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
function sum(o, ret) {
  return reduce( o, function(ret, a){
    return (ret + a);
  }, ret || 0);
}




/**
  @description  creates an iterable object that iterates over all it's parameter objects
  @param        {array} args
  @return       {iterable}
*/
function chain(args) {

  if(args.length === 1) {
    return iterator(args[0]);
  }

  var iterables = map(args, iterator);

  return {

    next: function() {

      try {
        return iterables[0].next();
      }
      catch(e) {
        if (e !== StopIteration) {
          throw e;
        }
        if(iterables.length === 1) {
          throw StopIteration;
        }
        iterables.shift();
        return iterables[0].next();
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
function imap(o, func, scope){

  var iterable = iterator(o);

  return {

    next: function () {
      var it = iterable.next();
      return [func.apply(scope || null, it[0]), it[1]];

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
function range(start, stop, step) {

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
var forEach = exports.forEach = curry2(_forEach);
var filter = exports.filter = curry2(_filter);
var map = exports.map = curry2(_map);
var some = exports.some = curry2(_some);
var every = exports.every = curry2(_every);
var indexOf = exports.indexOf = curry2(_indexOf);
var find = exports.find = curry2(_find);
var findIndex = exports.findIndex = curry2(_findIndex);
var lastIndexOf = exports.lastIndexOf = curry2(_lastIndexOf);
var findLast = exports.findLast = curry2(_findLast);
var findLastIndex = exports.findLastIndex = curry2(_findLastIndex);

exports.lastIndexOf   = lastIndexOf;
exports.toArray       = toArray;
exports.reduce        = reduce;
exports.sum           = sum;
exports.chain         = chain;
exports.imap          = imap;
exports.range         = range;
exports.invoke        = invoke;
exports.pluck         = pluck;

// private
var eq = curry2(_eq);
var negate = curry3(_negate);
