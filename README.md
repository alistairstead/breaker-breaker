# breaker-breaker [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Circuit-breaker solution using Proxy to allow all object methods to be wrapped with the breaker pattern


## Install

```sh
$ npm install --save breaker-breaker
```


## Usage

```js
var breakerBreaker = require('breaker-breaker');

breakerBreaker('Rainbow');
```

## License

Apache-2.0 © [Alistair Stead](www.designdisclosure.com)


[npm-image]: https://badge.fury.io/js/breaker-breaker.svg
[npm-url]: https://npmjs.org/package/breaker-breaker
[travis-image]: https://travis-ci.org/alistairstead/breaker-breaker.svg?branch=master
[travis-url]: https://travis-ci.org/alistairstead/breaker-breaker
[daviddm-image]: https://david-dm.org/alistairstead/breaker-breaker.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/alistairstead/breaker-breaker
[coveralls-image]: https://coveralls.io/repos/alistairstead/breaker-breaker/badge.svg
[coveralls-url]: https://coveralls.io/r/alistairstead/breaker-breaker
