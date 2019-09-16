[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

parse-ini-file
==============
Parse `.ini` files into JSON objects.

## Install
```sh
$ npm install parse-ini-file
```

## Use
```js
const parse = require('ini-file-parser');

const resultPromise = parse('../path/to/config.ini');
// or:
const result = parse.sync('../path/to/config.ini');
```

&nbsp;

Example `config.ini`:
```ini
username = me
pasword = 1234

[SectionA]
  key=value

[SectionB]
  key=value
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
  },
}
```

## Convention
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

* Comments are ignored, obviously. Use quotes to work with semicolons:
    ```ini
    ; line comment
    key1=value1 ; inline comment
    key2='quoted ; semicolon'
    key3="double quoted ; semicolon"
    ```

* Whitespace is trimmed:
    ```ini
    ;Same
    [sectionA]
    [ sectionA ]
    ```
    ```ini
    ;Same
    key = value
    key =value
    key= value
    ```
    ```ini
    [sectionA]
    key=value
    
    ;Same as
    
    [sectionA]
        key=value   
    ```
    Preserve whitespace using quotes:
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


&nbsp;
&nbsp;

## Extras

### Flags
* Lines with no equal sign are treated as flags and will be parsed into an array named `"flags"` on the current section:
    ```ini
    'flagA'
    "flagB"
    key=value

    [section]
        "sectionFlag"
        key=value
    ```
    ```js
    result = {
        flags: ['flagA', 'flagB'],
        key: 'value',
        section: {
            flags: ['sectionFlag'],
            key: 'value',
        }
    }
    ```
    >Note: Duplicated flag names are ignored.
