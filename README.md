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
    
    you can also skip the -p 
    
    ntodo .
    ntod ../
    
``` 

### Programatically
You can also use ntodo from inside your own node.js code.

``` js
  var ntodo = require('ntodo')();

  var results = (err, results) => {
    console.log("results: %s", results)
    console.log("errors: %s", err)
  }

  ntodo.search("./", results);
```

You should see something like this

```
results: [
  {"file_name":"bin/app.js"
  ,"todos":[
      {"line":"// TODO: Add file watcher","line_number":20}
    , {"line":"// TODO: clean up the emtpy todos and then callback","line_number":128}]}
 ,{"file_name":"bin/cli.js"
  ,"todos":[
      {"line":"// TODO: Add the ability to remove the TODO line... more options","line_number":67}
     ,{"line":"// TODO: Add the ability to connect your todo app or Github","line_number":68}]}
 ,{"file_name":"test/test.js","todos":[
      {"line":"// TODO: create test","line_number":0}]}
 ]
errors: null
```


