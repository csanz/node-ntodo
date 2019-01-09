// load libs

var klaw = require('klaw')

var through2 = require('through2')

var path = require('path')

var colors = require('colors')

var lr = require('line-reader')

var logger = require('./libs').logger

var file = require('./libs').file

var conf = require('./conf.json')

// Set some global variables

var _items = []

var _promises = []

var _results = []

var _options = {}

var _fileCounter = 0 // file counter

// Constants and configurations

const _includedExtensions = conf.includedExtensions

// const _ignored_folders = conf.ignoredFolders

// Allocate app

var app = {}

module.exports = app

// Init

app.init = function (options) {
  _options = options
  logger.init(_options)
}

// Start search

app.search = function (pathString, callback) {
  // Check if this is a file or directory

  if (file.is_file(pathString)) {
    // Check if the file is zero bytes first

    if (file.is_zero_byte(pathString)) { return console.log('\nThe file was zero bytes\n>> %s\n'.red, pathString) }

    logger.info(colors.bgWhite('Searching single file: %s'), pathString)

    // Add single file

    _items.push(pathString)

    // Increase file counter

    _fileCounter++

    // Initialize the search

    initSearch()
  } else {
    // Walk file system and generate file list
    // After generating the list pull todos

    logger.info('Searching path: %s'.gray, pathString)

    generateFileList(pathString)
  }

  // ----------------------//
  // Walk directories
  // ----------------------//

  function generateFileList (directory) {
    // TODO: move to config file, list of filters

    const filterFunction = item => {
      const basename = path.basename(item)

      var _excludedFolder = !!((basename === 'node_modules' ||
                         basename === 'deps'))

      var _otherExclusions = !!((basename === '.' ||
                          basename[0] !== '.'))

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

    klaw(directory, {
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
      // Initialize search

        if (!_fileCounter) {
          return console.log('\nNo files loaded, please check '.yellow +
           'the extensions are supported: \n%s\n'.yellow, _includedExtensions.join(' ').white)
        }

        initSearch()
      })
  }

  // ----------------------//
  // Initialize todos
  // ----------------------//

  function initSearch () {
    logger.info('included extensions:'.green, JSON.stringify(_includedExtensions))

    logger.info('ended file scan with %s'.gray, _fileCounter, 'file(s)')

    // If you have no files at this point let the user know

    try {
      // Load items

      load(_items)
    } catch (err) {
      logger.error(err, null)
      onError(err)
    }
  }

  // ----------------------//
  // Load data
  // ----------------------//

  function load (items) {
    // Load Promises

    for (var _item in _items) { _promises.push(getResults(_items[_item])) }

    // Display results from promises

    var processResults = (results) => {
      cleanUpResults(results, complete)
    }

    logger.info('%s file(s) loaded'.black.bgWhite, _promises.length)

    // Handle all promises

    Promise.all(_promises)
      .then(processResults)
      .catch(onError)
    // .finally(onFinally);
  }

  function complete (err) {
    if (err) return onError(err)
    callback(null, _results)
  }

  // ----------------------//
  // Pass error
  // ----------------------//

  function onError (err) {
    callback(err, null)
  }

  // //----------------------//
  // // onFinally
  // //----------------------//

  // function onFinally(){

  //   logger.info("completed search");
  // }

  // ----------------------//
  // Clean up results
  // ----------------------//

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

  // ----------------------//
  // Get results
  // ----------------------//

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

          // Search for TODOs and FIXMEs

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
