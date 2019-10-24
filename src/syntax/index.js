'use strict'

const _merge = require('lodash.merge')

module.exports = _merge(
  {},
  require('./es5'),
  require('./es2015'),
  require('./es2017')
)
