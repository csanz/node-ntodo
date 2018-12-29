#!/usr/bin/env node

var os      = require('os')
  , ntodo   = require('./app')()
  , opt     = require('optimist').argv
  , colors  = require('colors')
  , sys     = require('util')
  , path    = require('path')
  , resolve = require('path').resolve
    
// Run the app

run = function() {

  opt.help = opt.help || opt.h;
  opt.path = opt.path || opt.p;

  // Empty, run search

  if(!opt._.length &&
     !opt.help &&
     !opt.path){

    ntodo.search("./", complete);

    return;
  }

  // Only one arument, assume is a path

  if(opt._ &&
    !opt.path &&
    !opt.help){

    console.log("hi", opt._[0])

    ntodo.search(opt._[0], complete);

    return;
  } 

  // Path option, run with path

  if(opt.path){

    if(opt.path == true) return error("Missing Path!");

    ntodo.search(opt.path, complete);

    return;
  }

  // Show help

  if(opt.help){

    help();

    return;
  }

}

// Complete, display

function complete(err, results){

  if(err) return error(err.toString())

  // TODO: Add the ability to remove the TODO line... more options
  // TODO: Add the ability to connect your todo app or Github

  console.log("\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\".gray)
  console.log("\\\\\\\\\\\\\  Your TODOs:".gray);
  console.log("\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n".gray)

  for(var _result in results){

    for(var _todo in results[_result].todos){

      // Print out the TODO

      console.log("Line %s: %s".cyan
        , results[_result].todos[_todo].line_number
        , results[_result].todos[_todo].line);
    }

    // Display the file and full path

    console.log('\n>>> Inside: '.grey + results[_result].file_name.grey + "\n");
  }
}

// Help

function help(){

  console.log("\nntodo <PATH>\n".green)
  console.log("\tExamples:".white.bold)
  console.log("\t\tntodo .".green)
  console.log("\t\tntodo ../".green)
  console.log("\t\tntodo -p ../".green)
  console.log("\n")

}

// Error 

function error(msg){
  console.log("\n", msg.red, "\n")
}

run();
