var utils = exports = module.exports = {}

// Show results

utils.showResults = function (results, pathString) {
  loadTemplate(results, pathString)

  function loadTemplate (results) {
    var _counter = 0

    var _todosCounter = 0

    var _fixmesCounter = 0

    // Iterate through results

    for (var _result in results) {
      // Itereate through todos

      for (var _todo in results[_result].todos) {
        // Print out the TODO

        console.log('Line %s: %s'.cyan
          , results[_result].todos[_todo].line_number
          , results[_result].todos[_todo].line)

        _counter++
        _todosCounter++
      }

      // Itereate through fixmes

      for (var _fixme in results[_result].fixme) {
        // Print out the TODO

        console.log('Line %s: %s'.cyan
          , results[_result].fixme[_fixme].line_number
          , results[_result].fixme[_fixme].line)

        _counter++
        _fixmesCounter++
      }

      // Display the file and full path

      console.log('\n>> (%s) Inside: %s\n'.yellow, _counter, results[_result].file_name)
    }

    // Display summary results

    console.log('  Found %s TODOs and %s FIXMEs\n'.gray, _todosCounter, _fixmesCounter)
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
