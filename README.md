# Iter

  Take the best ideas from python's itertools, mochikit iter, ramdas currying, and all the lovely ES6 iterable protocols and what do you get?

  Super Iteration...



## Install

  As the latest es6 branch isn't yet in npm add the following to your package.json dependencies

  ```
  "super-iter": "git+ssh://git@github.com:ibrokethat/iter.git#es6ification"

  ```


##  Usage

  ```
  import {ifilter, imap, sum, takeWhile} from 'super-iter';

  let a1 = [1, 2, 3, 4, 5];
  let a2 = [10, 20, 30, 40, 50];
  let a3 = [100, 200, 300, 400, 500];

  let sumAll = imap((...args) => sum(args));
  let evens = ifilter(v => v%2 === 0);
  let less250 = takeWhile(v => v < 250);

  let v = less250(evens(sumAll(a1, a2, a3)));

  console.log(v); // -> [222]

  ```

## Test

  ```
  git clone git@github.com/ibrokethat/iter
  cd iter
  git checkout es6ification
  npm i
  npm test
  ```

## Todo


  - Move build and test commands into .bin as they are getting too verbose to fit package.json nicely.
  - Have the tests trigger the builds
  - Add githooks to trigger tests pre commit


  - groupBy
  - indexBy
  - intersection
  - union



## License

(The MIT License)

Copyright (c) 2012 Simon Jefford <si@ibrokethat.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the 'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

