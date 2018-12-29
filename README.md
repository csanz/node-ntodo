# ntodo

A simple CLI TODO parser for the lazy coder

![Screenshot](https://raw.githubusercontent.com/csanz/node-ntodo/master/misc/sample.png?c=2)

## Installation

``` bash
  $ [sudo] npm install ntodo -g
```

## Usage

There are two ways to use ntodo: through the command line or by using ntodo in your code. **Note:** If you are using ntodo _programatically_ see example below.

### Command Line Usage

**Example**

```
  $ ntodo ./
```

**Options**
```
    $ ntodo --help
    Usage: ntodo [Options]
    
    [Options]
    
    -h, --help      Display help
    -p, --path      It sets the path
                      ex: ntodo -p .
                      ex: ntodo -p ../
    
    you can also skip the -p ;-)
    
    ntodo .
    ntod ../
    
    Filtering Examples
    
    ntodo . | grep "jade"
    ntodo . | grep "modules"
    ntodo . | grep "api"   
``` 

### Programatically
You can also use ntodo from inside your own node.js code.

``` js
  var _ntodo = require('ntodo');

  var results = (results) => {console.log("results: %s", results)}

  _ntodo.search("./", results);
```


