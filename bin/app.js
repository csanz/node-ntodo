const fs        = require('fs-extra')
    , klaw      = require('klaw')
    , through2  = require('through2')
    , path      = require('path')
    , colors    = require('colors')
    , async     = require("async")
    , lr        = require('line-reader')
    , logger    = require('./libs').logger
    , file      = require('./libs').file
    , conf      = require("./conf.json");

// Set some global variables

var _items          = []
  , _line           = null
  , _promises       = []
  , _results        = []
  , _line_counter   = 0 // line counter
  , _todo_counter   = 0 // todo counter
  , _fixme_counter  = 0 // fixme counter
  , _file_counter   = 0 // file counter
  , _scan_counter   = 0 // file scan counter
  , _options        = {}
  , _is_single_file = false;

// Constants and configurations

const _included_extensions = conf.included_extensions
    , _ignored_folders     = conf.ignored_folders

// Allocate app

var app = {};

module.exports = app;

/////////////////////////
// Init

app.init = function(options){

  _options = options
  logger.init(_options)

}

/////////////////////////
// Start search

app.search = function(path_string, callback){

  // Check if this is a file or directory

  if(file.is_file(path_string)){

    // Check if the file is zero bytes first

    if(file.is_zero_byte(path_string)) 
      return console.log("\nThe file was zero bytes\n>> %s\n".red, path_string)

    logger.info("scan file: %s".black.bgWhite, path_string);

    // Add single file 

    _items.push(path_string);

    // Increase file counter

    _file_counter++;

    // Initialize the search

    init_search();

    return;

  }else{

    // Walk file system and generate file list
    // After generating the list pull todos

    logger.info("searching path: %s".black.bgWhite, path_string);
    
    generate_file_list(path_string);

  }

  //----------------------//
  // Walk directories 
  //----------------------//

  function generate_file_list(directory){

    // TODO: move to config file, list of filters

    const filter_function = item => {
      const  basename = path.basename(item);
      return basename === '.' || 
             basename[0] !== '.' &&
             basename !== 'node_modules' &&
             basename !== 'deps';
    }

    // Exclude bad files

    const exclude_bad_files = through2.obj(function (item, enc, next) {

      // If this is not a zero byte file add the file

      if (!item.stats.size==0) this.push(item)

      next()
    })

    // Exclude filter

    const exclude_filter = through2.obj(function (item, enc, next) {

      // If this is a directory exclude

      if (!item.stats.isDirectory()) this.push(item)

      next()
    })


    // Include filter

    const include_filter = through2.obj(function (item, enc, next) {

      var _should_include_extension = 
            (_included_extensions.indexOf(path.extname(item.path.toLowerCase()))!=-1) 

      // if extension should be included push item

      if (_should_include_extension) this.push(item);


      next();
    })

    // Start the walk

    klaw(directory,{ 
        filter : filter_function 
      , depthLimit : -1
      , preserveSymlinks: false
    })

    // On error 

    .on('error', function(err){

      logger.error(err);

      callback(err, null);

    })

    // Exclude bad files

    .pipe(exclude_bad_files) 

    // Exclude filter

    .pipe(exclude_filter) 

    // Include filter

    .pipe(include_filter) 

    // Found data

    .on('data', function (item) {

      logger.info("%s) found file: %s [%s]"
        , _file_counter
        , item.path
        , _included_extensions.indexOf(path.extname(item.path.toLowerCase()))!=-1);

      // Add the full file path to the array

      _items.push(item.path);

      // Keep file counter

      _file_counter++;

    })

    // End of search

    .on('end', function () {

      // Initialize search

      init_search();

    })    
  }

  //----------------------//
  // Initialize todos
  //----------------------//

  function init_search(){

    logger.info("included extensions:", _included_extensions)

    logger.info("ended file scan with %s", _file_counter, "file(s)");

    // If you have no files at this point let the user know 

    if(!_file_counter) return console.log("\nNo files loaded, please check ".yellow + 
       "the extensions are supported: \n%s\n".yellow, _included_extensions.join(' ').white);

    try{

      // Load items

      load(_items);

    }catch(err){

      logger.error(err, null);

      complete(err)
    }

  }

  //----------------------//
  // Load data
  //----------------------//

  function load(items){

    // Load Promises

    for(var _item in _items)
     _promises.push(get_todos(_items[_item]))

    // Display results from promises

    var process_results = (results) => {
        clean_up_results(results)
    }

    logger.info("%s file(s) loaded".black.bgWhite, _promises.length); 

    // Handle all promises   

    Promise.all(_promises)
           .then(process_results)
           .catch(error)
           .finally(display);

  }

  //----------------------//
  // Pass error
  //----------------------//

  function error(err){
    callback(err, null) 
  }

  //----------------------//
  // Display
  //----------------------//

  function display(){

    logger.info("completed search");

    callback(null, _results) 
  }

  //----------------------//
  // Clean up results
  //----------------------//

  function clean_up_results(results, callback){

    try{
      // Loop through all results from promises

      for(var _i in results){

        // Only display results with todos

        if(results[_i] &&
           results[_i].todos && 
           results[_i].todos.length)
           _results.push(results[_i])
      } 

      //callback(null)

    }catch(err){

      logger.error(err);

      //callback(err)

      throw err;

    } 
  }

  //----------------------//
  // Get todos
  //----------------------//

  function get_todos(file_name){

    _scan_counter++;

    return new Promise(function(resolve, reject) {

      //return resolve('Success:' + file_name);

      // Set global variables 

      var _all_items  = []
        , _item_todos = []
        , _item_fixme = []
        , _index      = 0

      try{

        logger.info("file name: %s".yellow, file_name)

        lr.eachLine(file_name, function(line, last) {

          _line_counter++;

          // Set variables 

          var _line  = `${line}`;

          // Search for TODOs and FIXMEs


          var _formula = /(\/\/|\/\*).*(TODO|FIXME).*?/g
          var _regex   = new RegExp(_formula);
          var _test    = _regex.test(_line);
          var _match   = _line.match(_regex)

          // Save the lines found

          if(_test && _match){

            //console.log("found match %s", _match)

            if(_match[0].indexOf("FIXME")!=-1){
              _fixme_counter++;
              _item_fixme.push({
                line: _line.trim() 
              , line_number: _index
              })  
            }

            if(_match[0].indexOf("TODO")!=-1){
              _todo_counter++;
              _item_todos.push({
                line: _line.trim() 
              , line_number: _index
              })   
            }
          }

          // If this is the last line, resolve promise

          if(last){

            // Reset variables before looping

            _index      = 0;
            _all_items  = {};

            _all_items  = {
              file_name: path.relative("./", file_name)
            , todos: _item_todos
            , fixme: _item_fixme
            };

            // Send back to promise

            resolve(_all_items);

            _item_todos = [];
            _item_fixme = [];
          }

          _index++;
        });

      }catch(err){

        logger.error(err);

        // Always reject the promise if you encounter errors

        // TODO: should I throw and error? 

        reject(err);
      }
  
    })
  }
}


