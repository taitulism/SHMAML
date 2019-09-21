[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/SHMAML.svg?branch=master)](https://travis-ci.org/taitulism/SHMAML)

SHMAML
======
Parse `.ini` files into JSON objects. Support lists.

## Install
```sh
$ npm install shmaml
```

## Use
```js
const parse = require('shmaml');

const resultPromise = parse('../path/to/config.ini');
// or:
const result = parse.sync('../path/to/config.ini');
```

&nbsp;

Example `config.ini` + list:
```ini
username = me
pasword = 1234

[SectionA]
  key=value

[SectionB]
  key=value
  list=[
      item1,
      item2,
      item3
  ]
```
Becomes:
```js
result = {
  username: 'me',
  pasword: 1234,
  SectionA: {
    key: 'value',
  },
  SectionB: {
    key: 'value',
    list: ['item1', 'item2', 'item3']
  },
}
```

## Convention
* key-value pairs are noted with an equal sign.
    ```ini
    key="value"
    ```

* Quoting values is optional. Strings are used as default.  
    ```ini
    ; These are all the same:
    key=value
    key='value'
    key="value"
    ```

* Unquoted numbers are parsed as numbers. Use single/double quotes to make number values parsed as strings.
    ```ini
    number = 55
    string = '55'
    string = "55"
    ```

* Unquoted booleans are parsed as booleans. Use single/double quotes to make boolean values parsed as strings. CaSe InSeNsITiVe.
    ```ini
    bool = TRUE
    bool = false
    string = 'true'
    string = "false"
    ```

* Sections are noted with wrapping square brackets.
    ```ini
    [categoryA]
        key="value"
    [categoryB]
        key="value"
    ```

* Lists are also noted with wrapping square brackets when come after a `key=`.
    ```ini
    [categoryA]
        key="value"
        list=[item1, item2, item3]
    ```

* Multiline lists are also supported.
    ```ini
    [categoryA]
        multilineList=[
            item1,
            item2,
            item3
        ]
        key="value"
    ```
> NOTE: Nested lists are NOT supported.  
> `list=[A, [B, [C, D]], E]`

* Comments are ignored, obviously. Use quotes to work with semicolons:
    ```ini
    ; line comment
    [category]
        key1=value1 ; inline comment
        key2='quoted ; semicolon'
        key3="double quoted ; semicolon"
    ```

* Whitespace (including tabs) is trimmed:
    ```ini
    ;Same
    [sectionA]
    [ sectionA ]
    ```
    ```ini
    ;Same
    key= value
    key =value
    key  =  value
    ```
    ```ini
    [sectionA]
    key=value
    
    ;Same as
    
    [sectionA]
        key=value   
    ```
* Preserve whitespace using quotes:
    ```ini
    [' section   ']
    key="  value "
    ```
    ```js
    {
        " section   ": {
            key: "  value "
        }
    }
    ```

* Duplicates.  
    Duplicated section names are merged to the same object.
    ```ini
    [sectionA]
        key1=value1
    [sectionA]
        key2=value2
    ```
    ```js
    result = {
        SectionA: {
            key1: 'value1',
            key2: 'value2',
        },
    }
    ```
    Duplicated key names in the same section: the later overwrites the former.
    ```ini
    sameKey=value1
    sameKey=value2
    sameKey=value3
    ```
    ```js
    result = {
        sameKey: 'value3'
    }
    ```
