"use strict";

/*
  todo

  itakeWhile
  idropWhile

  groupBy
  intersection

*/


const StopIteration = new Error();

export const GeneratorFunctionPrototype = Object.getPrototypeOf(function*() {yield 1});
export const GeneratorFunction = GeneratorFunctionPrototype.constructor;


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


function returns (o) {

  let genSet = (v, k, type) => {

    if (!r) {
      [r, set] = cache.get(type || Array);
    }
    set(v, k);
  };

  let cache = new WeakMap();

  cache.set(Array, [[], (v) => r.push(v)]);
  cache.set(Map, [new Map(), (v, k) => r.set(k, v)]);
  cache.set(Set, [new Set(), (v) => r.add(v)]);
  cache.set(Object, [{}, (v, k) => r[k] = v]);
  cache.set(GeneratorFunction, [null, genSet]);
  cache.set(GeneratorFunctionPrototype, [null, genSet]);

  let [r, set] = cache.get(o.constructor);

  return {
    set: set,
    get: () => r
  };
}



/**
  @description  creates an iterable object from another object
  @param        {object} object
  @return       {iterable}
*/
export function iterator (object) {

  let o = typeof object === 'function' ? object() : object;

  switch (true) {

    case typeof o.entries === 'function':

      return o.entries();

    case typeof o[Symbol.iterator] === 'function':

      return o[Symbol.iterator]();

    case (typeof o.next === 'function'):

      return o;

    default:

      return (function* () {

        let i = 0;
        let keys = Object.keys(o);
        let len = keys.length;

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

export function forEach (o, fn) {


  try {

    if (typeof o.entries === 'function') {

      for (let [k, v] of o.entries()) {
        fn(v, k);
      }
    }
    else if (typeof o[Symbol.iterator] === 'function') {

      for (let [k, v, type] of o) {
        k = type === Set ? v : k;
        fn(v, k, type);
      }
    }
    else if (typeof o === 'function') {

      for (let [k, v, type] of o()) {
        k = type === Set ? v : k;
        fn(v, k, type);
      }
    }
    else {

      let it = iterator(o);
      let data = it.next();

      while (!data.done) {

        let [k, v, type] = data.value;
        fn(v, k, type);
        data = it.next();
      }

    }
  }
  catch (e) {

    if (e !== StopIteration) {
      throw e;
    }
  }

}


export function exhaust (o) {
  forEach(o, () => {});
}


export function collect (o) {
  return map(o, (v) => v);
}


/**
  @descrption   calls a function on each item in an object and returns the item if 'true'
  @param        {o} object
  @param        {fn} function
*/
export function filter (o, fn) {

  let r = returns(o);

  forEach(o, (v, k, type) => {

    if (fn(v, k)) {

      r.set(v, k, type);
    }
  });

  return r.get();
}



/**
  @description  creates an iterator filter
  @param        {object} o
  @param        {function} fn
  @return       {iterable}
*/
export function* ifilter (o, fn) {

  let type = o.constructor;
  let iterable = iterator(o);
  let data = iterable.next();

  while (!data.done) {

    let [k, v, t] = data.value;

    if (fn(v, k)) {

      yield [k, v, t || type];
    }

    data = iterable.next();
  }
}




/**
  @descrption   calls a function on each item in an object and returns the result
  @param        {o} object
  @param        {fn} function
  @return       {object|array}
*/
export function map (...args) {

  if (args.length === 2) {

    let [o, fn] = args;

    let r = returns(o);

    forEach(o, (v, k, type) => {
      r.set(fn(v, k), k, type);
    });

    return r.get();
  }
  else {

    return collect(imap(...args));
  }

}


/**
  @description  creates an iterator map
  @param        {object} o
  @param        {function} fn
  @return       {iterable}
*/
export function* imap (...args) {

  if (args.length === 2) {

    let [o, fn] = args;

    let iterable = iterator(o);
    let data = iterable.next();
    let type = o.constructor;

    while (!data.done) {

      let [k, v, t] = data.value;

      yield [k, fn(v, k), t || type];

      data = iterable.next();
    }

  }
  else {

    let fn = args.pop();
    let type = args[0].constructor;
    let iterables = map(args, iterator);
    let data = invoke(iterables, 'next');

    while (filter(data, (v) => v.done).length === 0) {

      let [k, , t] = data[0].value;

      let v = fn(...pluck(data, 'value.1'));

      yield [k, v, t || type];

      data = invoke(iterables, 'next');
    }

  }
}



export function first (o, fn) {

  let r;
  forEach(o, (v, k) => {
    if (fn(v, k)) {
      r = [v, k];
      throw StopIteration;
    }
  });
  return r;
}


export function last (o, fn) {

  let r;
  forEach(o, (v, k) => {
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
  @param        {fn} function
  @param        {object} [scope]
  @return       {boolean}
*/
export function some (o, fn) {

  return !! first(o, fn);
}



/**
  @description  returns true if all of the items evaluate to true
                else returns false
  @param        {o} object
  @param        {fn} function
  @param        {object} [scope]
  @return       {boolean}
*/
export function every (o, fn) {

  return !(!! first(o, negate.bind(null, fn)));
}



/**
  @description  returns the index of the first match
  @param        {o} object
  @param        {any} val
  @return       {int|string}
*/
export function indexOf (o, el) {

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
  forEach(o, (v, k, type) => {
    if (fn(v, k)) {
      r.set(v, k, type);
    }
    else {
      throw StopIteration;
    }
  });
  return r.get();
}

export function take (o, n = 1) {

  return takeWhile(o, (v, k) => k < n);
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
  forEach(o, (v, k, type) => {

    take = take || !fn(v, k);

    if (take) {
      r.set(v, k, type);
    }
  });
  return r.get();
}


export function drop (o, n = 1) {

  return dropWhile(o, (v, k) => k < n);
}


/**
  @description  reduces the value of the object down to a single value
  @param        {any} acc
  @param        {object} o
  @param        {function} fn
  @return       {any}
*/
export function reduce (o, fn, acc){

  let noAcc = typeof acc === 'undefined';
  let iterable;

  if (noAcc) {

    iterable = iterator(o);
    let data = iterable.next();

    if (data.done) {
      throw new TypeError("reduce() of sequence with no initial value");
    }
    else {
      acc = data.value[1];
    }

  }
  else {
    iterable = o;
  }

  forEach(iterable, (value, key) => {
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

  let U;
  let i = -1;
  let l = Array.isArray(items) ? items.length : 0;
  let res = [];
  let val;

  if (key.indexOf('.') > -1) {

    return reduce( key.split('.'), (v, k) => pluck(v, k, only_existing), items);
  }

  while (++i < l) {

    val = key in Object(items[i]) ? items[i][key] : U;

    if (only_existing !== true || (val !== null && val !== U)) {

      res.push(val);
    }
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
  return reduce(o, (acc, a) => acc + a, acc);
}



/*
  @description  adds the value of each index from each object into an array
  @param        {object} o
  @param        {any} [ret]
  @return       {number}
*/
export function zip (...args) {

  if (args.length === 1) {
    return args[0];
  }

  return map(...args, (...v) => v);
}


/*
  @description  adds the value of each index from each object into an array
  @param        {object} o
  @param        {any} [ret]
  @return       {number}
*/
export function izip (...args) {

  if (args.length === 1) {
    return args[0];
  }

  return imap(...args, (...v) => v);
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
  @description  creates a range iterable
  @param        {number} start
  @param        {number} stop
  @param        {number} [step]
  @return       {iterable}
*/
export function* irange (start, stop, step = 1) {

  let i = 0;

  while (start <= stop) {

    yield [i++, start];
    start = start + step;
  }
}


export function partition (o, fn) {

  let iterable = iterator(o);
  let data = iterable.next();
  let t = returns(o);
  let f = returns(o);

  while (!data.done) {

    let [k, v, type] = data.value;

    if (fn(v, k)) {
      t.set(v, k, type);
    }
    else {
      f.set(v, k, type);
    }

    data = iterable.next();
  }

  return [t.get(), f.get()];

}
