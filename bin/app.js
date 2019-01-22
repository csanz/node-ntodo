// load libs

var walker = require('klaw')

var through2 = require('through2')

var path = require('path')

var colors = require('colors')

var lr = require('line-reader')

var logger = require('./libs').logger

var file = require('./libs').file

var utils = require('./utils')

var conf = require('./conf.json')

// Set some global variables

var _scriptName = path.basename(__filename)

var _pathString = null

var _items = []

var _promises = []

var _results = []

var _isDebug = false

var _options = {
  addedBy: 'all',
  dateOrder: 'desc',
  entryType: 'all',
  isVerbose: false
}

var _fileCounter = 0 // file counter

// Constants and configurations

const _includedExtensions = conf.includedExtensions

// const _ignored_folders = conf.ignoredFolders

// Allocate app

var app = {}

module.exports = app

// Start search

app.search = function (pathString, options, callback) {
  // Set options

  _options.addedBy = options.addedBy
  _options.dateOrder = options.dateOrder
  _options.entryType = options.entryType
  _isDebug = options.isDebug

  // Set global

  _pathString = (pathString || options.pathString)

  // If single file

  if (file.is_file(_pathString)) {
    if (_isDebug) utils.showDebug(colors.gray('Single File:'), _pathString)

    // Check if zero byte

    if (file.is_zero_byte(_pathString)) {
      return console.log(colors.red('\nThe file was zero bytes\n>> %s\n'), _pathString)
    }

    // Continue search of single file

    logger.info(colors.bgWhite('Searching single file: %s'), _pathString)

    _items.push(_pathString)

    _fileCounter++

    searchForTodos()
  } else {
    // If directory
    if (_isDebug) utils.showDebug(colors.gray('%s::Searching Directory:%s'), _scriptName, _pathString)

    logger.info('Searching path: %s'.gray, _pathString)

    generateFileList(_pathString)
  }

  // Generate file list / walk directories

  function generateFileList (directory) {
    // TODO: move to config file, list of filters

    const filterFunction = item => {
      const basename = path.basename(item)

      var _excludedFolder = !!((basename === 'node_modules' || basename === 'deps'))

      var _otherExclusions = !!((basename === '.' || basename[0] !== '.'))

      return (!_otherExclusions || !_excludedFolder)
    }

    // Exclude bad files

    const excludeBadFiles = through2.obj(function (item, enc, next) {
      // If this is not a zero byte file add the file

      if (item.stats.size !== 0) this.push(item)

      next()
    })

    // Exclude filter

    const excludeFilter = through2.obj(function (item, enc, next) {
      // If this is a directory exclude

      if (!item.stats.isDirectory()) this.push(item)

      next()
    })

    // Include filter

    const includeFilter = through2.obj(function (item, enc, next) {
      var _shouldIncludeExtension =
            (_includedExtensions.indexOf(path.extname(item.path.toLowerCase())) !== -1)

      // if extension should be included push item

      if (_shouldIncludeExtension) this.push(item)

      next()
    })

    logger.info('Start folder walk on %s directory'.gray, directory)

    // Start the walk

    walker(directory, {
      filter: filterFunction,
      depthLimit: -1,
      preserveSymlinks: false
    })

    // On error

      .on('error', function (err) {
        logger.error(err)

        callback(err, null)
      })

    // Exclude bad files

      .pipe(excludeBadFiles)

    // Exclude filter

      .pipe(excludeFilter)

    // Include filter

      .pipe(includeFilter)

    // Found data

      .on('data', function (item) {
        logger.info('%s) found file: %s [%s]'
          , _fileCounter
          , item.path
          , _includedExtensions.indexOf(path.extname(item.path.toLowerCase())) !== -1)

        // Add the full file path to the array

        _items.push(item.path)

        // Keep file counter

        _fileCounter++
      })

    // End of search

      .on('end', function () {
        if (_isDebug) utils.showDebug(colors.gray('%s::Directory Walk Ended with %s items'), _scriptName, _fileCounter)

        // Initialize search

        if (!_fileCounter) {
          return console.log('\nNo files loaded, please check '.yellow +
           'the extensions are supported: \n%s\n'.yellow, _includedExtensions.join(' ').white)
        }

        searchForTodos()
      })
  }

  // Search for todos

  function searchForTodos () {
    if (_isDebug) utils.showDebug(colors.gray('%s::Supported Extensions (conf.json):\n'), _scriptName, colors.cyan(_includedExtensions))

    logger.info('included extensions:', JSON.stringify(_includedExtensions))

    logger.info('ended file scan with %s files(s)', _fileCounter)

    try {
      // Load files and pull todos

      loadFiles(_items)
    } catch (err) {
      logger.error(err, null)

      onError(err)
    }
  }

  // Load files and pull todos

  function loadFiles (items) {
    // Load Promises

    for (var _item in _items) { _promises.push(getResults(_items[_item])) }

    if (_isDebug) utils.showDebug(colors.gray('%s::%s file(s) loaded for search'), _scriptName, _promises.length)

    logger.info('%s file(s) loaded for search', _promises.length)

    // Display results from promises

    var processResults = (results) => {
      if (_isDebug) utils.showDebug(colors.gray('%s::Completed search with %s items'), _scriptName, results.length)
      cleanUpResults(results, complete)
    }

    // Handle all promises

    Promise.all(_promises)
      .then(processResults)
      .catch(onError)
    // .finally(onFinally);
  }

  function complete (err) {
    if (err) return onError(err)

    if (_isDebug) utils.showDebug(colors.gray('%s::Completed filter with %s items'), _scriptName, _results.length)

    callback(null, _results)
  }

  // On error

  function onError (err) {
    callback(err, null)
  }

  // Clean up

  function cleanUpResults (results, callback) {
    try {
      // Loop through all results from promises

      for (var _i in results) {
        // Only display results with todos

        if (results[_i] &&
           results[_i].todos &&
           results[_i].todos.length) { _results.push(results[_i]) }
      }

      callback(null)
    } catch (err) {
      logger.error(err)

      callback(err)

      throw err
    }
  }

  // Get results

  function getResults (fileName) {
    return new Promise(function (resolve, reject) {
      // return resolve('Success:' + fileName);

      // Set global variables

      var _allItems = []

      var _itemTodos = []

      var _itemFixme = []

      var _index = 0

      try {
        logger.info('file name: %s'.yellow, fileName)

        lr.eachLine(fileName, function (line, last) {
          // Set variables

          var _line = `${line}`

          // Search

          var _formula = /(\/\/|\/\*).*(TODO|FIXME).*?/g
          var _regex = new RegExp(_formula)
          var _test = _regex.test(_line)
          var _match = _line.match(_regex)

          // Save the lines found

          if (_test && _match) {
            // console.log("found match %s", _match)

            if (_match[0].indexOf('FIXME') !== -1) {
              _itemFixme.push({
                line: _line.trim(),
                lineNumber: _index
              })
            }

            if (_match[0].indexOf('TODO') !== -1) {
              _itemTodos.push({
                line: _line.trim(),
                lineNumber: _index
              })
            }
          }

          // If this is the last line, resolve promise

          if (last) {
            // Reset variables before looping

            _index = 0
            _allItems = {}

            _allItems = {
              fileName: path.relative('./', fileName),
              todos: _itemTodos,
              fixme: _itemFixme
            }

            // Send back to promise

            resolve(_allItems)

            _itemTodos = []
            _itemFixme = []
          }

          _index++
        })
      } catch (err) {
        logger.error(err)

        // Always reject the promise if you encounter errors

        // TODO: should I throw and error?

        reject(err)
      }
    })
  }
}
