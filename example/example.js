var ntodo = require('ntodo')

var results = (err, results) => {
  console.log('results: %s', results)
  console.log('errors: %s', err)
}

var options = {
  addedBy: 'all',
  dateOrder: 'all',
  entryType: 'all',
  isVerbose: false,
  isDebug: false
}

ntodo.search('./', options, results)
