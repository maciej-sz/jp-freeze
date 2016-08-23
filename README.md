# jp-freeze
JSON - PHP serailizer/unserializer

[![Build Status][ico-travis]][link-travis]
![No dependencies][ico-no-deps]
[![MIT License][ico-license]][link-license]

## Description
This package provides the functionality of unserialization of data encoded by the [PHP pj-freeze package][link-pj-freeze-github].

## Usage
#### Example: usage in Node.js
```js
var fs = require('fs');
var JpFreeze = require('jp-freeze');

var json = fs.readFileSync('test.json').toString();
var serialized = JSON.parse(json);

var obj = new JpFreeze().unserialize(serialized);

console.log(obj);
```

## Limitations
So far only the unserialization is implemented in JavaScript. The serialization is only available through the [corresponding PHP package][link-pj-freeze-github].

[ico-travis]:https://img.shields.io/travis/maciej-sz/pj-freeze/master.svg?style=plastic
[ico-no-deps]:https://img.shields.io/badge/dependencies-none-brightgreen.svg?style=plastic
[ico-license]:https://img.shields.io/badge/license-MIT-blue.svg?style=plastic

[link-pj-freeze-github]:https://github.com/maciej-sz/pj-freeze
[link-travis]:https://travis-ci.org/maciej-sz/jp-freeze
[link-license]:https://github.com/maciej-sz/pj-freeze/blob/master/LICENSE
