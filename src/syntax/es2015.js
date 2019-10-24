'use strict'

const defineSyntax = require('./define-syntax')
const safeName = require('../safeName')

const ForOfStatement = settings => defineSyntax({
  lloc: 1,
  cyclomatic: settings.forof ? 1 : 0,
  operators: 'forof',
  children: [ 'left', 'right', 'body' ]
})

const ClassBody = settings => defineSyntax({
  children: [ 'body' ]
})

const ClassDeclaration = settings => defineSyntax({
  lloc: 1,
  operators: 'class',
  operands: node => node.id.name,
  children: [ 'superClass', 'body' ]
})

const ImportDeclaration = settings => defineSyntax({
  lloc: 1,
  operators: 'import',
  children: [ 'specifiers', 'source' ],
  dependencies: node => ({
    line: node.loc.start.line,
    type: 'Module',
    path: node.source.value
  })
})

const ExportAllDeclaration = settings => defineSyntax({
  lloc: 1,
  operators: 'export',
  children: [ 'source' ]
})

const ExportDefaultDeclaration = settings => defineSyntax({
  lloc: 1,
  operators: 'export',
  children: [ 'declaration' ]
})

const ExportNamedDeclaration = settings => defineSyntax({
  lloc: 1,
  operators: 'export',
  children: [ 'declaration', 'specifiers', 'source' ]
})

const MethodDefinition = settings => defineSyntax({
  operators: node => node.static ? 'static' : undefined,
  children: [ 'value' ],
  methodName: node => node.key
})

// Arrows with a block statement body are treated as new scope
const ArrowFunctionExpression = settings => defineSyntax({
  operators: '=>',
  children: [ 'params', 'body' ],
  newScope: node => !node.expression
})

const YieldExpression = settings => defineSyntax({
  operators: 'yield',
  children: [ 'argument' ]
})

const RestElement = settings => defineSyntax({
  operators: 'rest',
  children: [ 'argument' ]
})

const SpreadElement = settings => defineSyntax({
  operators: 'spread',
  children: [ 'argument' ]
})

// Default Parameters
const AssignmentPattern = settings => defineSyntax({
  operators: '=',
  children: [ 'left', 'right' ],
  assignableName: node => safeName(node.left.id)
})

// Destructuring
const ArrayPattern = settings => defineSyntax({
  operators: '[]',
  children: 'elements'
})

const ObjectPattern = settings => defineSyntax({
  operators: '{}',
  children: 'properties'
})

const TemplateLiteral = settings => defineSyntax({
  operators: '``',
  children: 'expressions'
})

const TaggedTemplateExpression = settings => defineSyntax({
  operators: 'tag',
  children: 'quasi'
})

// Property redefined here so that
// if it is shorthand it does not increment the operators,
// nor does it add a logical loc
const Property = settings => defineSyntax({
  lloc: node => !node.shorthand ? 1 : 0,
  operators: node => !node.shorthand ? ':' : undefined,
  // Note that when shorthand is true, key and value will be
  // the same, so total operands will be 1 higher than it ideally should be
  // No easy fix.
  children: [ 'key', 'value' ],
  assignableName: node => safeName(node.key)
})

module.exports = {
  ClassBody,
  ClassDeclaration,
  ExportAllDeclaration,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  ForOfStatement,
  ImportDeclaration,
  MethodDefinition,
  ArrowFunctionExpression,
  YieldExpression,
  RestElement,
  SpreadElement,
  AssignmentPattern,
  ArrayPattern,
  ObjectPattern,
  TemplateLiteral,
  TaggedTemplateExpression,
  Property
}
