/**
  @module   iteration methods
*/
"use strict";


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

function isArrayLike (o) {

  return typeof o !== 'function' && typeof o.length === 'number';
}


function returns (o) {

  let r, set;

  function setArray(v) {
    r.push(v);
  };
  function setObject (v, k) {
    r[k] = v;
  };

  if (isIterable(o) || isArrayLike(o)) {
    r = [];
    set = setArray;
  }
  else {
    r = {};
    set = setObject;
  }

  return {
    set: set,
    get: function () {
      return r || {};
    }
  };
}


function isIterable (o) {

  return (typeof o === 'function' || typeof o.next === 'function' || typeof o[Symbol.iterator] === 'function');
}


let StopIteration = new Error();



/**
  @description  creates an iterable object from another object
  @param        {object} obect
  @return       {iterable}
*/
export function iterator (object) {

  let o = typeof object === 'function' ? object() : object;

  switch (true) {

    //  fall through on purpose here
    case typeof o[Symbol.iterator] === 'function':

      o = o[Symbol.iterator]();

    case (typeof o.next === 'function'):

      return o;

    default:

      return (function* () {

        let i = 0;
        let keys = Object.keys(o);
        let len = keys.length;

        while (i < len) {

          yield o[keys[i++]];
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

export function forEach (object, fn) {

  let o = typeof object === 'function' ? object() : object;

  try {

    switch (true) {

      //  has .forEach
      case (typeof o.forEach === 'function'):

        o.forEach(fn);
        break;

      //  is array like
      case isArrayLike(o):

        let i = -1;
        let length = o.length;
        while (++i < length) {
          fn(o[i], i);
        }
        break;

      //  iterator object
      case (typeof o.next === 'function'):

        let data = o.next();

        while (!data.done) {
          fn(data.value);
          data = o.next();
        }
        break;

      //  iterator protocol
      case (typeof o[Symbol.iterator] === 'function'):

        for (let v of o) {
          fn(v);
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
*/
export function filter (o, fn) {

  if (typeof o.filter === 'function') {
    return o.filter(fn);
  }

  let r = returns(o);

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
  @return       {object|array}
*/
export function map (o, fn) {

  if (arguments.length === 2) {

    if (typeof o.map === 'function') {
      return o.map(fn);
    }

    let r = returns(o);
    forEach(o, function (v, k) {
      r.set(fn(v, k), k);
    });
    return r.get();

  }
  else {

    let args = toArray(arguments);
    args.pop();
    let r = returns(args[0]);

    if (typeof args[0].next === 'function') {

      let l = args.length;
      let done = 0;
      let i = 0;

      let data;
      let value;
      let key;
      let values = [];

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

      let longest = (function (args) {
        let l = 0;
        reduce(args, function (acc, arg, i) {

          if (arg > acc) {
            l = i;
          }
          return arg;

        }, typeof args[0].length === 'number' ? args[0].length : Object.key(args[0].length))
        return l;
      }());

      forEach(args[longest], function (v, k) {

        let values = [];
        let i = 0;
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



export function first (o, fn) {

  let r;
  forEach(o, function (v, k) {
    if (fn(v, k)) {
      r = [v, k];
      throw StopIteration;
    }
  });
  return r;
}


export function last (o, fn) {

  let r;
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
export function some (o, fn) {

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
export function every (o, fn) {

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
export function indexOf (o, el) {

  if (typeof o.indexOf === 'function') {
    return o.indexOf(el);
  }

  let r = first(o, eq.bind(null, el));
  return r ? r[1] : -1;
}



/**
  @description  returns the index|key of the first item to match the predicate function
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
export function findIndex (o, fn) {

  if (typeof o.findIndex === 'function') {
    return o.findIndex(fn);
  }

  let r = first(o, fn);
  return r ? r[1] : -1;
}


/**
  @description  returns the value of the first item to match the predicate function
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
export function find (o, fn) {

  if (typeof o.find === 'function') {
    return o.find(fn);
  }

  let r = first(o, fn);
  return r ? r[0] : undefined;
}


/**
  @description  returns the index of the last match
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
export function lastIndexOf (o, el) {

  if (typeof o.lastIndexOf === 'function') {
    return o.lastIndexOf(el);
  }

  let r = last(o, eq.bind(null, el));
  return r ? r[1] : -1;
}

/**
  @description  returns the index|key of the first item to match the predicate function
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
export function findLastIndex (o, fn) {

  let r = last(o, fn);
  return r ? r[1] : -1;
}



/**
  @description  returns the value of the first item to match the predicate function
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
export function findLast (o, fn) {

  let r = last(o, fn);
  return r ? r[0] : undefined;
}


/**
  @description  take while the predicate is true
  @param        {o} object
  @param        {fn} funtion
  @return       {int|string}
*/
export function takeWhile (o, fn) {

  let r = returns(o);
  forEach(o, function (v, k) {
    if (fn(v, k)) {
      r.set(v, k);
    }
    else {
      throw StopIteration;
    }
  });
  return r.get();
}


/**
  @description  ignore while the predicate is true
  @param        {o} object
  @param        {fn} function
  @return       {int|string}
*/
export function dropWhile (o, fn) {

  let r = returns(o);
  let take = false;
  forEach(o, function (v, k) {

    take = take || !fn(v, k);

    if (take) {
      r.set(v, k);
    }
  });
  return r.get();
}


/**
  @description  converts an array like object to an array
  @param        {object} arrayLike
  @param        {number} [i]
  @return       {array}
*/
export function toArray(arrayLike, i) {

  return Array.prototype.slice.call(arrayLike, i || 0);

}




/**
  @description  reduces the value of the object down to a single value
  @param        {any} acc
  @param        {object} o
  @param        {function} func
  @return       {any}
*/
export function reduce (o, fn, acc){

  let noAcc = typeof acc === 'undefined';
  let iterable;

  if(typeof o.reduce === 'function') {

    return noAcc ? o.reduce(fn) : o.reduce(fn, acc);
  }

  if (noAcc) {

    iterable = iterator(o);
    let r = iterable.next();

    if (r.done) {
      throw new TypeError("reduce() of sequence with no initial value");
    }
    else {
      acc = r.value;
    }

  }
  else {
    iterable = o;
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
export function invoke (items, method) {

  let args = Array.prototype.slice.call(arguments, 2);
  let i = -1;
  let l = Array.isArray(items) ? items.length : 0;
  let res = [];

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
export function pluck(items, key, only_existing) {

  only_existing = only_existing === true;

  let U,
    i   = -1,
    l   = Array.isArray( items ) ? items.length : 0,
    res = [],
    val;

  if ( key.indexOf( '.' ) > -1 ) {

    return reduce( key.split( '.' ), function( v, k ) {
      return pluck( v, k, only_existing );
    }, items);

  }

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
export function sum (o, acc) {
  return reduce(o, function(acc, a) {
    return acc + a;
  }, acc);
}



/*
  todo - map over the longest arg
       - throw if args are not the same
*/
export function zip () {


  let args = arguments;
  let r = returns(args[0]);

  forEach(args[0], function (v, k) {

    let values = [v];
    let i = 0;
    while (++i < args.length) {
      values.push(typeof args[i].next === 'function' ? args[i].next().value : args[i][k]);
    }
    r.set(values, k);
  });

  return r.get();
}


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
export function chain2 (args) {

  if(args.length === 1) {
    return iterator(args[0]);
  }

  let iterables = map(args, iterator);

  return {

    next: function() {

      let data = iterables[0].next();

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

export function* chain (...args) {

  if(args.length === 1) {
    return iterator(args[0]);
  }

  let iterables = map(args, iterator);
  let data = iterables[0].next();

  while (true) {

    if (!data.done) {
      yield data.value;
    }
    else {

      if (iterables.length === 1) {
        break;
      }
      iterables.shift();
    }

    data = iterables[0].next();
  }
}





/**
  @description  creates an iterator map
  @param        {object} o
  @param        {function} func
  @param        {object} [scope]
  @return       {iterable}
*/
export function* imap (o, fn) {

  let iterable = iterator(o);
  let data = iterable.next();

  while (!data.done) {

    yield fn(data.value);
    data = iterable.next();
  }
}


export function* ifilter (o, fn) {


  let iterable = iterator(o);
  let data = iterable.next();

  while (!data.done) {

    if (fn(data.value)) {
      yield data.value;
    }
    data = iterable.next();
  }
}




/**
  @description  creates a range iterable
  @param        {number} start
  @param        {number} stop
  @param        {number} [step]
  @return       {iterable}
*/
export function range (start, stop, step) {

  let i = 0;

  step = step || 1;

  return {
    next: function() {
      let ret = start;
      if(start >= stop) {
        throw StopIteration;
      }
      start = start + step;
      return [ret, i++];
    }
  };
}
