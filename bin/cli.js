#!/usr/bin/env node

var pkg = require('../package.json')

var program = require('commander')

var ntodo = require('./app')

var utils = require('./utils')

var logger = require('./libs').logger

var colors = require('colors')

var path = require('path')

// Set global variables

var _scriptName = path.basename(__filename)

var _options = {
  isLogging: false,
  isVerbose: false,
  isFlat: false,
  isEditMode: false,
  isSummary: false,
  isSaveToDisc: false,
  filterSettings: {
    addedBy: 'all', // all/@name
    dateOrder: 'desc', // none/desc/asc
    entryType: 'all' // all/todo/fixme
  },
  filePath: null
}

var _missingValues = []

var _isDebug = false

var _pathString = null

var _isFlat = false

start() // start the program

function start () {
  // Setup initial parameters

  program
    .version(pkg.version)
    .option('-f, --file [filePath]', 'format single file')
    .option('-l, --logging', 'activate logging')
    .option('-v, --verbose', 'activate verbose mode')
    .option('--flat', 'show flat visual version')
    .option('-e, --edit', 'start to edit todos and fixmes right away')
    .option('-s, --summary', 'display summary of results')
    .option('--save', 'save result')
    .option('--filter <filter>', 'filter the results by author, date added and type in that order', filter)
    .option('--debug', 'run the app in debug mode')

  // Catch all

  program
    .command('*')
    .action(catchAll)

  program.parse(process.argv)

  // Parse results

  function filter (val) {
    if (val) val = val.split(',')

    if (!val.length) return []

    if (val[0]) { _options.filterSettings.addedBy = val[0] }

    if (val[1]) { _options.filterSettings.dateOrder = val[1] }

    if (val[2]) { _options.filterSettings.entryType = val[2] }
  }

  function catchAll (filePath) {
    // Catch all, only value was passed

    if (!program.file || program.file === null) { _options.filePath = filePath }
  }

  // Set boolean options

  _options.isFlat = !!(program.flat)
  _options.isVerbose = !!(program.verbose)
  _options.isLogging = !!(program.logging)
  _options.isEditMode = !!(program.edit)
  _options.isSummary = !!(program.summary)
  _options.isDebug = !!(program.debug)

  // File option `ntodo --file <value>`

  if (program.file) {
    // No value was passed

    if (program.file === true) {
      _missingValues.push('Missing <value> for --file option')

      _options.filePath = null
    } else {
      _options.filePath = program.file
    }
  }

  // No params, no value

  if (process.argv.length === 2 ||
      _options.filePath === null) {
    _options.filePath = './'
  }

  // Handle errors !!

  if (_missingValues && _missingValues.length) {
    return utils.showMissingValues(_missingValues)
  }

  // Global vars

  _isDebug = _options.isDebug
  _pathString = _options.filePath
  _isFlat = _options.isFlat

  // Show debug

  if (_isDebug) {
    utils.showDebug(colors.gray('%s::OPTIONS: \n'), _scriptName, colors.cyan(_options))
    utils.showDebug(colors.gray('%s::ARGV:\n'), _scriptName, colors.cyan(process.argv))
  }

  // Set options

  var _searchOptions = {
    pathString: _options.filePath,
    addedBy: _options.filterSettings.addedBy,
    dateOrder: _options.filterSettings.dateOrder,
    entryType: _options.filterSettings.entryType,
    isVerbose: _options.isVerbose,
    isDebug: _options.isDebug
  }

  // Search

  ntodo.search(_pathString, _searchOptions, complete)

  // Complete

  function complete (err, results) {
    // Show debug

    if (_isDebug) {
      utils.showDebug(colors.gray('%s::Passed %s items to cli'), _scriptName, results.length)
    }

    if (err) return logger.error(err)

    // TODO: Add the ability to remove the TODO line... more options
    // TODO: Add the ability to connect your todo app or Github

    utils.showBanner(_isFlat)

    utils.showResults(_isFlat, results, _pathString)
  }
}
