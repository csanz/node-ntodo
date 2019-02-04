var colors = require('colors')

var utils = exports = module.exports = {}

// Show results

utils.showResults = function (isFlat, results, pathString) {
  var _results = results
  var _pathString = pathString

  if (!isFlat) {
    // Load visual template

    loadVisualTemplate()
  } else {
    // Load flat tempalte

    loadFlatTemplate()
  }

  // Visual view

  function loadVisualTemplate () {
    var _todosCounter = 0

    var _fixmesCounter = 0

    // Iterate through results

    for (var _result in _results) {
      console.log('Inside %s'.cyan, results[_result].fileName)

      // Itereate through fixmes

      console.log('_TODO_'.white.bold)

      for (var _fixme in results[_result].fixme) {
        console.log('      \\_ Line %s: %s'.red
          , results[_result].fixme[_fixme].lineNumber
          , results[_result].fixme[_fixme].line)
        _fixmesCounter++
      }

      // Itereate through todos

      for (var _todo in results[_result].todos) {
        console.log('      \\_ Line %s: %s'.white
          , results[_result].todos[_todo].lineNumber
          , results[_result].todos[_todo].line)
        _todosCounter++
      }
    }

    // Display summary results

    console.log('\nFound %s TODOs and %s FIXMEs inside: '.white.bold + '\n%s\n'.yellow, _todosCounter, _fixmesCounter, _pathString)
  }

  // Flat view

  function loadFlatTemplate () {
    var _todosCounter = 0

    var _fixmesCounter = 0

    var _fileName = null

    // Iterate through results

    for (var _result in _results) {
      _fileName = results[_result].fileName

      // Itereate through fixmes

      for (var _fixme in results[_result].fixme) {
        console.log(_fileName + results[_result].fixme[_fixme].lineNumber, ' ', results[_result].fixme[_fixme].line)
        _fixmesCounter++
      }

      // Itereate through todos

      for (var _todo in results[_result].todos) {
        console.log(_fileName + results[_result].todos[_todo].lineNumber, ' ', results[_result].todos[_todo].line)
        _todosCounter++
      }
    }

    // Display summary results

    console.log('\nFound %s TODOs and %s FIXMEs inside: '.white.bold + '\n%s\n'.yellow, _todosCounter, _fixmesCounter, _pathString)
  }
}
// Show screen header

utils.showBanner = function (isFlat) {
  if (!isFlat) {
    console.log(colors.white(' ||'))
    console.log(colors.white(' ||'), colors.white.italic(' ', '░    ░ ░░░░░ ░░░░░ ░░░░  ░░░░░'))
    console.log(colors.white(' ||'), colors.white.italic(' ', '░ ░  ░   ░   ░   ░ ░   ░ ░   ░'))
    console.log(colors.white(' ||'), colors.white.italic(' ', '░  ░ ░   ░   ░   ░ ░   ░ ░   ░'))
    console.log(colors.white(' ||'), colors.white.italic(' ', '░   ░░   ░   ░   ░ ░   ░ ░   ░'))
    console.log(colors.white(' ||'), colors.white.italic(' ', '░    ░   ░   ░░░░░ ░░░░  ░░░░░'))
    console.log(colors.white(' ||'))
    console.log(colors.white(' ||'), ' ', colors.white('Start to clean up your TODOs and FIXMEs'))
    console.log(colors.white(' ||'))
    console.log()
  } else {
    console.log(colors.cyan('\nNTODO ~ Start to clean up your TODOs and FIXMEs:\n'))
  }
}

// Show missing values

utils.showMissingValues = function (values) {
  console.log(colors.red.bold('\nMissing Values:\n'))

  for (var i = 0; i < values.length; i++) {
    console.log(colors.red(' - ' + values[i]))
  }

  console.log(colors.red('\nOperation halted, please fix and try again\n'))
}

utils.showDebug = function () {
  var args = Array.prototype.slice.call(arguments)
  console.info.apply(console, args)
}

// Show status

utils.showStatus = function (isOn) {
  // Start the interval search

  if (isOn) {
    var i = 0
    var _interval = setInterval(function () {
      i = (i + 1) % 4
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
      var dots = new Array(i + 1).join('.')
      var text = 'Searching TODOs' + dots
      process.stdout.write(text.cyan)
    }, 200)
  } else {
    if (_interval) {
      clearInterval(_interval)
      process.stdout.clearLine()
      process.stdout.cursorTo(0)
    }
  }
}
