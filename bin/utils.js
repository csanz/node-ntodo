var utils = exports = module.exports = {};

/////////////////////////
// Show results

utils.show_results = function(results, path_string){


  template2(results, path_string)

  function template2(results){

    var _counter        = 0
      , _todos_counter  = 0
      , _fixmes_counter = 0

    // Iterate through results

    for(var _result in results){

        console.log('Inside %s'.cyan, results[_result].file_name);

        // Itereate through fixmes 

        console.log("_TODO_".gray)

        for(var _fixme in results[_result].fixme){

          // Print out the TODO

          console.log("      \\_ Line %s: %s".yellow
            , results[_result].fixme[_fixme].line_number
            , results[_result].fixme[_fixme].line);

          _counter++;
          _fixmes_counter++
        }

        // Itereate through todos 

        for(var _todo in results[_result].todos){

          // Print out the TODO

          console.log("      \\_ Line %s: %s".gray
            , results[_result].todos[_todo].line_number
            , results[_result].todos[_todo].line);

          _counter++;
          _todos_counter++
        }

        // Display the file and full path

        _counter = 0;
      }

      // Display summary results

      console.log("\nFound %s TODOs and %s FIXMEs inside: ".gray+"\n%s\n".yellow, _todos_counter, _fixmes_counter, path_string)

  }


  function template1(results){

    var _counter        = 0
      , _todos_counter  = 0
      , _fixmes_counter = 0;

    // Iterate through results

    for(var _result in results){

        // Itereate through todos 

        for(var _todo in results[_result].todos){

          // Print out the TODO

          console.log("Line %s: %s".cyan
            , results[_result].todos[_todo].line_number
            , results[_result].todos[_todo].line);

          _counter++;
          _todos_counter++
        }

        // Itereate through fixmes 

        for(var _fixme in results[_result].fixme){

          // Print out the TODO

          console.log("Line %s: %s".cyan
            , results[_result].fixme[_fixme].line_number
            , results[_result].fixme[_fixme].line);

          _counter++;
          _fixmes_counter++
        }

        // Display the file and full path

        console.log('\n>> (%s) Inside: %s\n'.yellow, _counter, results[_result].file_name);

        _counter = 0;
      }

      // Display summary results

      console.log("  Found %s TODOs and %s FIXMEs\n".gray, _todos_counter, _fixmes_counter)

  }

}

////////////////////////
// Show screen header

utils.show_screen_header = function(query){
  var _query = query;
  if(!_query) _query = "TODOs & FIXMEs";
  console.log("\n\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\".gray)
  console.log("\\\\\\\\\\\\\  Your %s:".gray, _query);
  console.log("\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\n".gray)
}

/////////////////////////
// Show help

utils.show_help = function(){
  console.log("\nntodo <PATH>\n".cyan)
  console.log("\tExamples:".white.bold)
  console.log("\t\tntodo .".cyan)
  console.log("\t\tntodo ../".cyan)
  console.log("\t\tntodo -p ../".cyan)
  console.log("\n")
}

/////////////////////////
// Show status

utils.show_status = function(is_on){

  // Start the interval search

  if(is_on){
    var i = 0; 
    _interval = setInterval(function() {
      i = (i + 1) % 4;
      process.stdout.clearLine();  
      process.stdout.cursorTo(0);
      var dots = new Array(i + 1).join(".");
      var text = "Searching TODOs" + dots; 
      process.stdout.write(text.cyan)

    }, 200);  
  }else{
    if(_interval){
      clearInterval(_interval);
      process.stdout.clearLine();
      process.stdout.cursorTo(0);  
    }  
  }
}
