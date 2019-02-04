# ntodo [![Build Status](https://travis-ci.org/csanz/ntodo.svg?branch=master)](https://travis-ci.org/csanz/ntodo)

A simple to use CLI TODO/FIXME parser for the lazy coder

![Screenshot](https://raw.githubusercontent.com/csanz/ntodo/master/misc/ntodo.png?bust=4)

The much much simpler version is to just use git grep

``` bash
  $ git grep -EI "TODO|FIXME"
```

You can find the full documentation [here](https://git-scm.com/docs/git-grep)

`ntodo` is useful if you are looking for something you can interact with both via terminal and also programatically and pull more meta data like author, date added, etc as an array of objects.  

`ntodo` will also include the ability to prioritize and synchronize with your own task tools while keeping the easy to use in-code TODO and FIXME convention. 

The issue today with TODO and FIXME is that they never get looked at... unless you run into them while fixing code.  

## Installation

``` bash
  $ [sudo] npm install ntodo -g
```

## Usage

There are two ways to view TODOs: through the command line or by using ntodo in your code. **Note:** If you are using ntodo _programatically_ see example below.

To add new TODOs it is super easy. Simply add a TODO to your source code

    // TODO: new todo text here 

Then pull them via your terminal or code. It will output a summary of TODOs with the line number of where to find it. You can also track general TODOs inside .todo.js at the root of your project. 

### Command Line Usage

**Options**
```
    $ ntodo --help
    Usage: ntodo [Options]
    
    [Options]
    
    -h, --help      Display help
    -p, --path      It sets the path
                      ex: ntodo -p ./
    -s, --summary   Output summary
                      ex: ntodo -s ./
    
    you can also skip the -p 
    
    ntodo .
    ntodo ./    
``` 

**Example**

Standard search

``` bash
  $ ntodo ./
```

Get summary

``` bash
  $ ntodo -s ./
```

This returns a summary instead of a list of TODOs. This can be interesting when analyzing multiple projects to see how many TODOs are there in aggregate like this:

``` bash
  $ ntodo -s ./folder_with_all_projects/
```

``` bash
    +++++++++

    Total Number of TODOs: 4000

    Inside the following folders:

    ./application1 3000

    ./application2 1000
```


### Programatically
You can also use ntodo from inside your own node.js code.

``` js
  var ntodo = require('ntodo');

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


