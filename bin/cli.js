#!/usr/bin/env node

var ntodo = require('./app')

var utils = require('./utils')

var logger = require('./libs').logger

var opt = require('optimist').argv

var colors = require('colors')

// Set global variables

var _pathString = null

var _options = {
  isLogging: false,
  isVerbose: false
}

// Run the app

var run = function () {
  opt.help = opt.help || opt.h
  opt.path = opt.path || opt.p
  opt.file = opt.file || opt.f
  opt.logging = opt.logging || opt.l
  opt.verbose = opt.verbose || opt.v

  // Empty, run search

  if (!opt._.length &&
     !opt.help &&
     !opt.path) {
    search('./')

    return
  }

  // Only one arument, assume is a path

  if (opt._ &&
    !opt.path &&
    !opt.help) {
    search(opt._[0])

    return
  }

  // Path option, run with path

  if (opt.path) {
    if (opt.path === true) {
      return logger.warn(colors.yellow('missing path'))
    }

    search(opt.path)
  }

  // Show help

  if (opt.help) {
    utils.show_help()
  }

  // ----------------------//
  // Search
  // ----------------------//

  function search (pathString) {
    _pathString = pathString

    // Set options

    _options.isLogging =
      !!(opt.logging)

    _options.isVerbose =
      !!(opt.verbose)

    // Initialize ntodo app

    ntodo.init(_options)

    // utils.show_status(true);

    logger.info(colors.gray('options: %s'),
       JSON.stringify(_options))

    ntodo.search(
      _pathString
      , complete)
  }

  // ----------------------//
  // Complete
  // ----------------------//

  function complete (err, results) {
    // utils.show_status(false);

    if (err) return logger.error(err)

    // TODO: Add the ability to remove the TODO line... more options
    // TODO: Add the ability to connect your todo app or Github

    utils.showScreenHeader()

    utils.showResults(
      results
      , _pathString)
  }
}

run() // Run the cli
