var colors = require('colors')
  , fs     = require('fs-extra');

var libs = exports = module.exports = {};

/////////////////////////
// File system 

libs.file = function(){

  return {
    is_file: function(path_string){

      // If is not directory return true

      return !fs.lstatSync(path_string).isDirectory()
    }
  , is_zero_byte: function(path_string){

      // If zero bytes return true

      return !fs.lstatSync(path_string).size
  }
  }

}();

/////////////////////////
// Parser

libs.parser = function(){

  // Set options

  var _options = {
    regex : null
  }

  return {

    init: function(options){

    }
  , find: function(string, regex){

      if(regex) _options.regex = regex;

      var _regexobject = new RegExp(_options.regex);
      var _test        = _regexobject.test(_line);
      var _match       = _line.match(_regexobject);

      return {
        match : _match
      , test  : _test
      }
    }
  }

}

/////////////////////////
// Logger 

libs.logger = function () {

  // Set options

  var _options = {
    is_logging : false
  , is_verbose : false
  }

  // Return and bind logging functions

  // TODO: would be nice to add color coding. 

  return {
    init: function(options){
      _options = options
    }
  , info: function() {
        var args = Array.prototype.slice.call(arguments);
        show('info', args)

    }
  , warn: function() {
        var args = Array.prototype.slice.call(arguments);
        show('warn', args)
    }
  , error: function() {
        var args = Array.prototype.slice.call(arguments);
        show('error', args)
    }
  }

  // Show messages

  function show(method, args){

    if(_options){

      // if(_options.is_logging){
      //   // TODO: add text logging here
      // }

      if(_options.is_verbose) 
        console[method].apply(console, args);
      
    } 
  }
}();





