
var mocha = require('mocha')
var describe = mocha.describe
var it = mocha.it

// there are todos for tests, put different formats here

// TODO: create test
// TODO: create more tests
// TODO(name): Remove this.
// FIXME(addaleax): Remove this

/* TODO: another todo */

/*
  TODO: Hello World
*/

var assert = require('assert')
describe('var ntodo = require("../bin/app");', function () {
  describe('ntodo.search("./test/test.js", callback)', function () {
    it('it should return 5 TODOs and 1 FIXMEs', function (done) {
      var ntodo = require('../bin/app')

      var results = (err, results) => {
        if (err) return done(err)

        console.log('todos:', results[0].todos.length)
        console.log('fixme:', results[0].fixme.length)

        assert.strictEqual(results[0].todos.length, 5)
        assert.strictEqual(results[0].fixme.length, 1)

        done()
      }
      var options = {
        addedBy: 'all',
        dateOrder: 'all',
        entryType: 'all',
        isVerbose: false,
        isDebug: false
      }
      ntodo.search('./test/test.js', options, results)
    })
  })
})

// TODO: Another crazy test
