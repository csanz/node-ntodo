#!/usr/bin/env node

var os      = require('os')
  , app     = require('./app')({})
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

    // Run search

    app.search("./", complete);

    return;
  }

  // Path option, run with path

  if(opt.path){

    if(opt.path == true) return error("Missing Path!");

    // Run search

    app.search(opt.path, complete);

    return;
  }

  if(opt.help){

    // Run search

    //app.search(opt.path, complete)

    help();

    return;
  }

}

// Complete, display

function complete(err, results){

  if(err) return error(err.toString())

  // TODO: Add the ability to remove the TODO line... more options
  // TODO: Add the ability to connect your todo app or Github

  console.log("\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\".green)
  console.log("\\\\\\\\\\\\\  Your TODOs:".green);
  console.log("\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n".green)

  for(var _result in results){

    for(var _todo in results[_result].todos){

      // Print out the TODO

      console.log("Line %s: %s".cyan
        , results[_result].todos[_todo].line_number
        , results[_result].todos[_todo].line);
    }

    // Display the file and full path

    console.log('\n>>> Inside: '.grey + path.relative("./", results[_result].file_name).grey + "\n");
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
