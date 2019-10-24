'use strict'

const _merge = require('lodash.merge')
const safeArray = require('../safeArray')

const DEFAULTS = {
  assignableName: undefined,
  children: safeArray(undefined),
  cyclomatic: 0,
  lloc: 0,
  newScope: undefined,
  dependencies: undefined
}

const toIdentifiers = properties => properties.map(property => {
  if (property && typeof property.identifier !== 'undefined') {
    return property
  }
  return {
    identifier: property
  }
})

function defineSyntax (spec) {
  const computedSpec = {
    children: safeArray(spec.children),
    operands: toIdentifiers(safeArray(spec.operands)),
    operators: toIdentifiers(safeArray(spec.operators))
  }
  return _merge({}, DEFAULTS, spec, computedSpec)
}

module.exports = defineSyntax
