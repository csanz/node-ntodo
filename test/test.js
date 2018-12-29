
// there are todos for tests

// TODO: create test
// TODO: create more tests

var assert = require('assert');
describe('var ntodo = require("../bin/app")();', function() {
  describe('ntodo.search("./test/", callback)', function() {
    it('it should return 3 TODOs', function(done) {
      
      var ntodo = require('../bin/app')();

      var results = (err, results) => {

        if (err) return done(err);

        console.log("results[0].todos.length:", results[0].todos.length)

        assert.equal(results[0].todos.length, 3);
   
        done()

      }

      ntodo.search("./test/", results);  

    });
  });
});


// TODO: Another crazy test