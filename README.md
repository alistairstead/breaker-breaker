# breaker-breaker [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url] [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
> Circuit-breaker solution using Proxy to allow all object methods to be wrapped with the breaker pattern


## Install

```sh
$ npm install --save breaker-breaker
```


## Usage

```js
var Breaker = require('breaker-breaker');
let request = Breaker.create(require('request'), 'request::npm.org', {
  invocation_timeout: 1000
});

request.get('http://www.npm.org', function (err, response) {
  if (err) {
    // handle the error
  }

  // use the response
});

```

## What Design Principles Underlie breaker-breaker?

### breaker-breaker works by:

* Preventing any single dependency from blocking the event loop or delaying callback and promise chains.
* Shedding load and failing fast instead of queueing.
* The fail fast option halts the execution of the long running call to the external dependency.
* Leaves fallback functionality to the consuming application; error callback, promise reject or event observers within the consumer should manage the fallback functionality.









Using isolation techniques (such as bulkhead, swimlane, and circuit breaker patterns) to limit the impact of any one dependency.
Optimizing for time-to-discovery through near real-time metrics, monitoring, and alerting
Optimizing for time-to-recovery by means of low latency propagation of configuration changes and support for dynamic property changes in most aspects of Hystrix, which allows you to make real-time operational modifications with low latency feedback loops.
Protecting against failures in the entire dependency client execution, not just in the network traffic.

## Known Issues

* This can trigger a V8 bug with 'illegal access' errors being thrown see: [https://github.com/strongloop/express/issues/2652](https://github.com/strongloop/express/issues/2652) Using iojs-v3.0.0 resolves this non user space error.

## License

Apache-2.0 © [Alistair Stead](www.designdisclosure.com)


[npm-image]: https://badge.fury.io/js/breaker-breaker.svg
[npm-url]: https://npmjs.org/package/breaker-breaker
[travis-image]: https://travis-ci.org/alistairstead/breaker-breaker.svg?branch=master
[travis-url]: https://travis-ci.org/alistairstead/breaker-breaker
[daviddm-image]: https://david-dm.org/alistairstead/breaker-breaker.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/alistairstead/breaker-breaker
[coveralls-image]: https://coveralls.io/repos/alistairstead/breaker-breaker/badge.svg?branch=master&service=github
[coveralls-url]: https://coveralls.io/r/alistairstead/breaker-breaker
