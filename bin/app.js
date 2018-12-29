const fs        = require('fs-extra')
    , klaw      = require('klaw')
    , through2  = require('through2')
    , path      = require('path')
    , colors    = require('colors')
    , async     = require("async")
    , lr        = require('line-reader');

// Set some variables

var _items     = []
  , _line      = null
  , _promises  = []
  , _results   = []
  , mod        = {};

module.exports = function () {
  return mod
}

// TODO: Add file watcher 

// Set allowed extensions

var _allowed = [
    '.js'
  , '.jade'
  , '.stylus'
  , '.py'
  , '.java'
  , '.cgi'
  , '.pl'
];

// Filter some hidden files

const filter_function = item => {
  const  basename = path.basename(item);
  return basename === '.' || 
         basename[0] !== '.' &&
         basename !== 'node_modules';
}

// Exlude some extensions and include others

const include_ext_filter = through2.obj(function (item, enc, next) {
  var _should_include = (_allowed.indexOf(path.extname(item.path.toLowerCase())))?false:true;
  if (_should_include) this.push(item);
  next();
})

// Exclude directories from getting parsed

const exclude_dir_filter = through2.obj(function (item, enc, next) {
  if (!item.stats.isDirectory()) this.push(item)
  next()
})

// Start search

mod.search = function(directory, callback){

  // Walk the directories with klaw

  klaw(directory,{ 
      filter : filter_function 
    })
    .on('error', function(err){

      // Error found, send it back

      callback(err, null);

    })
    .pipe(exclude_dir_filter) // filter
    .pipe(include_ext_filter) // filter
    .on('data', function (item) {

      // Add the full file path to the array

      _items.push(item.path);
    })
    .on('end', function () {

      try{
        // Loop and create pending promises for each file 

        for(var _item in _items)
          _promises.push(get_todos(_items[_item]))

          // Display results from promises

          var print_results = 
            (results) => {

              clean_up_todos(
                  results
                , complete)
          }

        // Execute all pending promises

        Promise.all(_promises).then(print_results);

      }catch(err){
        
          complete(err)
      }
    })

  // Complete

  function complete(err){

    if(err) return callback(err, null) 

    callback(null, _results) 

  }

  // Clean up todos

  function clean_up_todos(results, callback){

    try{
      // Loop through all results from promises

      for(var _i in results){

        // Only display results with todos

        if(results[_i].todos.length)
            _results.push(results[_i])
      } 

      callback(null)

    }catch(err){

      callback(err)

    } 
  }

  // Get todos

  function get_todos(file_name){

    return new Promise(function(resolve, reject) {

      // Set global variables 

      var _all_items  = []
        , _item_todos = []
        , _index      = 0

      try{

        lr.eachLine(file_name, function(line, last) {

          // Set variables 

          var _line  = `${line}`;
          var _regex = new RegExp(/\/\/.*TODO\:\s.*?/g);
          var _test  = _regex.test(_line);

          // If regex test pasesses, continue and add

          if(_test){
            
            _item_todos.push({
              line: line.trim() 
            , line_number: _index
            })      

          }

          // If this is the last line, resolve promise

          if(last){

            // Reset variables before looping

            _index      = 0;
            _all_items  = {};

            _all_items  = {
              file_name: path.relative("./", file_name)
            , todos: _item_todos
            };

            // Send back to promise

            resolve(_all_items);

            _item_todos = [];
          }

          _index++;
        });

      }catch(err){

        // Always reject the promise if you encounter errors

        reject(err);
      }
  
    })
  }
}
