# jp-freeze
JSON - PHP serailizer/unserializer

[![Latest Version on Packagist][ico-version]][link-npm]
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
#### Example: usage in browser
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JpFreeze Test</title>
</head>
<body>

<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
<script type="text/javascript" src="bower_components/jp-freeze/dist/jp-freeze.js"></script>
<script type="text/javascript">
    $.ajax({
        url: 'https://localhost/get-user.php?id=1234',
        dataType: 'json',
        success: function(data) {
            var user = new JpFreeze().unserialize(data);
            console.log(user.firstName);
        }
    });
</script>

</body>
</html>
```

## Installation

#### NPM
```
npm install jp-freeze
```

#### Bower
```
bower install jp-freeze
```

## Limitations
So far only the unserialization is implemented in JavaScript. The serialization is only available through the [corresponding PHP package][link-pj-freeze-github].

[ico-version]:https://img.shields.io/npm/v/jp-freeze.svg?style=plastic
[ico-travis]:https://img.shields.io/travis/maciej-sz/pj-freeze/master.svg?style=plastic
[ico-no-deps]:https://img.shields.io/badge/dependencies-none-brightgreen.svg?style=plastic
[ico-license]:https://img.shields.io/badge/license-MIT-blue.svg?style=plastic

[link-npm]:https://www.npmjs.com/package/jp-freeze
[link-pj-freeze-github]:https://github.com/maciej-sz/pj-freeze
[link-travis]:https://travis-ci.org/maciej-sz/jp-freeze
[link-license]:https://github.com/maciej-sz/pj-freeze/blob/master/LICENSE
