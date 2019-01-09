var colors = require('colors')

var fs = require('fs-extra')

var libs = exports = module.exports = {}

// File system

libs.file = (function () {
  return {
    is_file: function (pathString) {
      // If is not directory return true

      return !fs.lstatSync(pathString).isDirectory()
    },
    is_zero_byte: function (pathString) {
      // If zero bytes return true

      return !fs.lstatSync(pathString).size
    }
  }
}())

// Parser

libs.parser = function () {
  // Set options

  var _options = {
    regex: null
  }

  return {

    init: function (options) {

    },
    find: function (string, regex) {
      if (regex) _options.regex = regex

      var _regexObject = new RegExp(_options.regex)
      var _test = _regexObject.test(string)
      var _match = string.match(_regexObject)

      return {
        match: _match,
        test: _test
      }
    }
  }
}

/// //////////////////////
// Logger

libs.logger = (function () {
  // Set options

  var _options = {
    isLogging: false,
    isVerbose: false
  }

  // Return and bind logging functions

  // TODO: would be nice to add color coding.

  return {
    init: function (options) {
      _options = options
    },
    info: function () {
      var args = Array.prototype.slice.call(arguments)
      show(colors.gray('info'), args)
    },
    warn: function () {
      var args = Array.prototype.slice.call(arguments)
      show(colors.yellow('warn'), args)
    },
    error: function () {
      var args = Array.prototype.slice.call(arguments)
      show(colors.red('error'), args)
    }
  }

  // Show messages

  function show (method, args) {
    if (_options) {
      // if(_options.is_logging){
      //   // TODO: add text logging here
      // }

      if (_options.isVerbose) { console[method].apply(console, args) }
    }
  }
}())
