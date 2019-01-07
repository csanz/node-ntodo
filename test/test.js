
// there are todos for tests, put different formats here

// TODO: create test
// TODO: create more tests
// TODO(name): Remove this.
//FIXME(addaleax): Remove this

/* TODO: another todo */

var assert = require('assert');
describe('var ntodo = require("../bin/app")();', function() {
  describe('ntodo.search("./test/test.js", callback)', function() {
    it('it should return 5 TODOs and 1 FIXMEs', function(done) {
      
      var ntodo = require('../bin/app')();

      var results = (err, results) => {

        if (err) return done(err);

        console.log("results[0].todos: ", results[0].todos.length)
        console.log("results[0].fixme: ", results[0].fixme.length)

        assert.equal(results[0].todos.length, 5);
        assert.equal(results[0].fixme.length, 1);
   
        done()

      }

      ntodo.search("./test/test.js", results);  

    });
  });
});


// TODO: Another crazy test