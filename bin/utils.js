var utils = exports = module.exports = {}

// Show results

utils.showResults = function (results, pathString) {
  loadTemplate(results, pathString)

  // ----------------------//
  // Template
  // ----------------------//

  function loadTemplate (results) {
    var _todosCounter = 0

    var _fixmesCounter = 0

    // Iterate through results

    for (var _result in results) {
      console.log('Inside %s'.cyan, results[_result].fileName)

      // Itereate through fixmes

      console.log('_TODO_'.gray)

      for (var _fixme in results[_result].fixme) {
        // Print out the TODO

        console.log('      \\_ Line %s: %s'.red
          , results[_result].fixme[_fixme].lineNumber
          , results[_result].fixme[_fixme].line)
        _fixmesCounter++
      }

      // Itereate through todos

      for (var _todo in results[_result].todos) {
        // Print out the TODO

        console.log('      \\_ Line %s: %s'.gray
          , results[_result].todos[_todo].lineNumber
          , results[_result].todos[_todo].line)
        _todosCounter++
      }
    }

    // Display summary results

    console.log('\nFound %s TODOs and %s FIXMEs inside: '.gray + '\n%s\n'.yellow, _todosCounter, _fixmesCounter, pathString)
  }
}

// Show screen header

utils.showScreenHeader = function (query) {
  var _query = query
  if (!_query) _query = 'TODOs & FIXMEs'
  console.log('\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\'.gray)
  console.log('\\\\\\\\\\\\\\  Your %s:'.gray, _query)
  console.log('\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n'.gray)
}

// Show help

utils.showHelp = function () {
  console.log('\nntodo <PATH>\n'.cyan)
  console.log('\tExamples:'.white.bold)
  console.log('\t\tntodo .'.cyan)
  console.log('\t\tntodo ../'.cyan)
  console.log('\t\tntodo -p ../'.cyan)
  console.log('\n')
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
