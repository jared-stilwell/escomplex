'use strict'
var parsers = [
  {
    name: 'acorn',
    options: {
      locations: true,
      onComment: []
    },
    parser: require('acorn')
  },
  {
    name: 'espree',
    options: {
      ecmaVersion: 8,
      loc: true
    },
    parser: require('espree')
  },
  {
    name: 'espree',
    options: {
      ecmaVersion: 9,
      loc: true
    },
    parser: require('espree')
  },
  {
    name: 'esprima',
    options: {
      loc: true
    },
    parser: require('esprima')
  }
]
module.exports.forEach = function forEachParser (tests) {
  for (var i = 0; i < parsers.length; i++) {
    var parserName = parsers[i].name
    var parser = parsers[i].parser
    var options = parsers[i].options
    suite('using the ' + parserName + ' parser:', function () {
      tests(parserName, parser, options)
    })
  }
}
