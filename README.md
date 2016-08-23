# jp-freeze
JSON - PHP serailizer/unserializer
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

[link-pj-freeze-github]:https://github.com/maciej-sz/pj-freeze
