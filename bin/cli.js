#!/usr/bin/env node

var os      = require('os')
  , ntodo   = require('./app')
  , utils   = require('./utils')
  , logger  = require('./libs').logger
  , opt     = require('optimist').argv
  , colors  = require('colors')
  , sys     = require('util')
  , path    = require('path')
  , resolve = require('path').resolve

// Set global variables 

var _interval    = null
  , _path_string = null
  , _options     = {
      is_logging : false
    , is_verbose : false
  }
    
/////////////////////////
// Run the app

run = function() {

  opt.help    = opt.help    || opt.h;
  opt.path    = opt.path    || opt.p;
  opt.file    = opt.file    || opt.f;
  opt.logging = opt.logging || opt.l;
  opt.verbose = opt.verbose || opt.v;

  // Empty, run search

  if(!opt._.length &&
     !opt.help &&
     !opt.path){

    search("./")

    return;
  }

  // Only one arument, assume is a path

  if(opt._ &&
    !opt.path &&
    !opt.help){

    search(opt._[0])

    return;
  } 

  return;

  // Path option, run with path

  if(opt.path){

    if(opt.path == true) 
      return logger.warn("missing path".yellow)

    search(opt.path)

    return;
  }

  // Show help

  if(opt.help){

    utils.show_help()

    return;
  }

  //----------------------//
  // Search
  //----------------------//

  function search(path_string){

    _path_string = path_string;

    // Set options

    _options.is_logging = 
      (opt.logging) ? true : false

    _options.is_verbose = 
      (opt.verbose) ? true : false

    // Initialize ntodo app

    ntodo.init(_options)

    //utils.show_status(true);

    ntodo.search(
        _path_string
      , complete);  

  }

  //----------------------//
  // Complete 
  //----------------------//

  function complete(err, results){

    //utils.show_status(false);

    if(err) return logger.error(err)

    // TODO: Add the ability to remove the TODO line... more options
    // TODO: Add the ability to connect your todo app or Github

    utils.show_screen_header();

    utils.show_results(
          results
        , _path_string);

  }
}

run();


