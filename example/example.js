var ntodo = require('ntodo')

var results = (err, results) => {
  console.log('results: %s', results)
  console.log('errors: %s', err)
}

ntodo.search('./', results)
