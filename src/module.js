'use strict'

const _isObject = require('lodash.isobject')
const _isFunction = require('lodash.isfunction')
const _isNumber = require('lodash.isnumber')
const assert = require('assert')
const debug = require('debug')('escomplex:module')
const HalsteadMetrics = require('./metrics/halstead')
const defaultSettings = {
  forin: false,
  logicalor: true,
  newmi: false,
  switchcase: true,
  trycatch: false
}

module.exports.analyse = analyse

var report

function analyse (ast, walker, options) {
  // TODO: Asynchronise
  var settings
  var currentReport
  var clearDependencies = true
  const scopeStack = []

  assert(_isObject(ast), 'Invalid syntax tree')
  assert(_isObject(walker), 'Invalid walker')
  assert(_isFunction(walker.walk), 'Invalid walker.walk method')

  settings = _isObject(options) ? options : defaultSettings

  // TODO: loc is moz-specific, move to walker?
  report = createReport(ast.loc)
  debug('Walking the AST:')
  debug(JSON.stringify(ast, null, 2))
  walker.walk(ast, settings, {
    createScope: pushScope,
    popScope: popScope,
    processNode: processNode
  })
  calculateMetrics(settings)

  function processNode (node, syntax) {
    debug(`process node: ${node.type}`)
    processLloc(node, syntax, currentReport)
    processCyclomatic(node, syntax, currentReport)
    processHalsteadMetric(node, syntax, 'operators', currentReport)
    processHalsteadMetric(node, syntax, 'operands', currentReport)
    if (processDependencies(node, syntax, clearDependencies)) {
      debug('Processed dependencies')
      // HACK: This will fail with async or if other syntax than CallExpression introduces dependencies.
      // TODO: Come up with a less crude approach.
      clearDependencies = false
    }
  }

  function pushScope (name, loc, parameterCount) {
    currentReport = createFunctionReport(name, loc, parameterCount)
    report.functions.push(currentReport)
    report.aggregate.params += parameterCount
    scopeStack.push(currentReport)
  }

  function popScope () {
    scopeStack.pop()
    if (scopeStack.length > 0) {
      currentReport = scopeStack[scopeStack.length - 1]
    } else {
      currentReport = undefined
    }
  }

  return report
}

function createReport (lines) {
  return {
    aggregate: createFunctionReport(undefined, lines, 0),
    dependencies: [],
    functions: []
  }
}

function createFunctionReport (name, lines, params) {
  const result = {
    cyclomatic: 1,
    halstead: new HalsteadMetrics(),
    name: name,
    params: params,
    sloc: {
      logical: 0
    }
  }
  if (_isObject(lines)) {
    debug('Calculating line information...')
    debug('start line: ' + lines.start.line)
    debug('end line: ' + lines.end.line)
    result.line = lines.start.line
    result.sloc.physical = lines.end.line - lines.start.line + 1
    debug('physical lines: ' + result.sloc.physical)
  }
  return result
}

function processLloc (node, syntax, currentReport) {
  incrementCounter(node, syntax, 'lloc', incrementLogicalSloc, currentReport)
}

function incrementCounter (node, syntax, name, incrementFn, currentReport) {
  const amount = syntax[name]
  if (_isNumber(amount)) {
    incrementFn(currentReport, amount)
  } else if (_isFunction(amount)) {
    incrementFn(currentReport, amount(node))
  }
}

function incrementLogicalSloc (currentReport, amount) {
  debug('incrementing sloc by ' + amount)
  report.aggregate.sloc.logical += amount
  if (currentReport) {
    currentReport.sloc.logical += amount
  }
}

function processCyclomatic (node, syntax, currentReport) {
  incrementCounter(node, syntax, 'cyclomatic', incrementCyclomatic, currentReport)
}

function incrementCyclomatic (currentReport, amount) {
  report.aggregate.cyclomatic += amount
  if (currentReport) {
    currentReport.cyclomatic += amount
  }
}

function processHalsteadMetric (node, syntax, metric, currentReport) {
  if (Array.isArray(syntax[metric])) {
    syntax[metric].forEach(s => {
      var identifier
      if (_isFunction(s.identifier)) {
        identifier = s.identifier(node)
      } else {
        identifier = s.identifier
      }
      if ((_isFunction(s.filter) === false || s.filter(node) === true) && (identifier !== undefined)) {
        halsteadItemEncountered(currentReport, metric, identifier)
      }
    })
  }
}

function halsteadItemEncountered (currentReport, metric, identifier) {
  if (currentReport) {
    incrementHalsteadItems(currentReport, metric, identifier)
  }
  incrementHalsteadItems(report.aggregate, metric, identifier)
}

function incrementHalsteadItems (baseReport, metric, identifier) {
  incrementDistinctHalsteadItems(baseReport, metric, identifier)
  debug(`incrementing halstead total ${metric} by 1`)
  baseReport.halstead[metric].total += 1
}

function incrementDistinctHalsteadItems (baseReport, metric, identifier) {
  const identifiers = baseReport.halstead[metric].identifiers

  // Avoid clashes with built-in property names.
  if (Object.prototype.hasOwnProperty(identifier)) {
    identifier = `_${identifier}`
  }
  if (identifiers.indexOf(identifier) === -1) {
    debug(`incrementing halstead distinct ${metric} by 1`)
    identifiers.push(identifier)
    baseReport.halstead[metric].distinct += 1
  }
}

function processDependencies (node, syntax, clearDependencies) {
  var dependencies
  if (_isFunction(syntax.dependencies)) {
    dependencies = syntax.dependencies(node, clearDependencies)
    if (_isObject(dependencies) || Array.isArray(dependencies)) {
      report.dependencies = report.dependencies.concat(dependencies)
    }
    return true
  }
  return false
}

function calculateMetrics (settings) {
  var count
  var indices
  var sums
  var averages
  count = report.functions.length
  indices = {
    cyclomatic: 1,
    effort: 2,
    loc: 0,
    params: 3
  }
  sums = [
    0,
    0,
    0,
    0
  ]
  report.functions.forEach(functionReport => {
    calculateCyclomaticDensity(functionReport)
    functionReport.halstead.calculate()
    sumMaintainabilityMetrics(sums, indices, functionReport)
  })
  calculateCyclomaticDensity(report.aggregate)
  report.aggregate.halstead.calculate()
  if (count === 0) {
    // Sane handling of modules that contain no functions.
    sumMaintainabilityMetrics(sums, indices, report.aggregate)
    count = 1
  }
  averages = sums.map(sum => sum / count)
  report.maintainability = calculateMaintainabilityIndex(
    averages[indices.effort],
    averages[indices.cyclomatic],
    averages[indices.loc],
    settings.newmi
  )
  Object.keys(indices).forEach(index => {
    report[index] = averages[indices[index]]
  })
}

function calculateCyclomaticDensity (data) {
  data.cyclomaticDensity = (data.cyclomatic / data.sloc.logical) * 100
}

function sumMaintainabilityMetrics (sums, indices, data) {
  sums[indices.loc] += data.sloc.logical
  sums[indices.cyclomatic] += data.cyclomatic
  sums[indices.effort] += data.halstead.effort
  sums[indices.params] += data.params
}

function calculateMaintainabilityIndex (averageEffort, averageCyclomatic, averageLoc, newmi) {
  if (averageCyclomatic === 0) {
    throw new Error('Encountered function with cyclomatic complexity zero!')
  }
  var maintainability = 171 - (3.42 * Math.log(averageEffort)) - (0.23 * Math.log(averageCyclomatic)) - (16.2 * Math.log(averageLoc))
  if (maintainability > 171) {
    maintainability = 171
  }
  if (newmi) {
    maintainability = Math.max(0, (maintainability * 100) / 171)
  }
  return maintainability
}
